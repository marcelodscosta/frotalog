import {
  MaintenanceStatus,
  MeasurementBulletin,
  Prisma,
} from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ICommissionRepository } from '../../repositories/interfaces/ICommissionRepository'
import { AppError } from '../errors/app-error'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'
import { recalculateContractMonthCommission } from '../commission/recalculate-contract-month-commission'
import { applyMovementChargesToBulletin } from './apply-movement-charges-to-bulletin'

interface CreateMeasurementBulletinRequest {
  contractId: string
  assetMovementId: string
  reference_start: Date
  reference_end: Date
  notes?: string | null
  current_horometer?: number | null
  current_odometer?: number | null
  measured_quantity?: number | null
  measurement_unit?: string | null
}

interface CreateMeasurementBulletinResponse {
  measurementBulletin: MeasurementBulletin
}

export class CreateMeasurementBulletinUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
    private assetMovementRepository: IAssetMovementRepository,
    private contractRepository: IContractRepository,
    private maintenanceRepository: IMaintenanceRepository,
    private commissionRepository: ICommissionRepository,
  ) {}

  async execute(
    data: CreateMeasurementBulletinRequest,
  ): Promise<CreateMeasurementBulletinResponse> {
    const contract = await this.contractRepository.findById(data.contractId)
    if (!contract) throw new ContractNotFoundError()

    const assetMovement = await this.assetMovementRepository.findById(
      data.assetMovementId,
    )
    if (!assetMovement) throw new AssetMovimentNotFoundError()

    if (assetMovement.contractId !== data.contractId) {
      throw new AppError('A movimentação informada não pertence a este contrato.', 400)
    }

    if (!contract.is_Active || contract.status === 'CANCELLED' || contract.status === 'DRAFT') {
      throw new AppError('Não é possível medir um contrato cancelado, inativo ou em rascunho.', 400)
    }

    if (new Date(data.reference_end) < new Date(data.reference_start)) {
      throw new AppError('A data final do período deve ser posterior à inicial.', 400)
    }

    const startDate = new Date(data.reference_start)
    let endDate = new Date(data.reference_end)

    // Check for overlapping bulletins via Repository
    const overlappingBulletin =
      await this.measurementBulletinRepository.findOverlapping(
        data.assetMovementId,
        startDate,
        endDate,
      )

    if (overlappingBulletin) {
      throw new AppError(
        'Já existe um boletim de medição para este período.',
        409,
      )
    }
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    // Cap end date at today if it's in the future (don't count future days)
    if (endDate > today) {
      endDate = today
    }

    // Determine exact limits based on integration and demobilization dates
    const toUTCMidnight = (date: Date) => {
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
      )
    }

    const bulletinStartUTC = toUTCMidnight(startDate)
    const bulletinEndUTC = toUTCMidnight(endDate)

    const integrationUTC = assetMovement.integration_date
      ? toUTCMidnight(assetMovement.integration_date)
      : 0

    // Demobilization is Exclusive for Billing (Day of return is not charged)
    const rawDemobUTC = assetMovement.demobilization_date
      ? toUTCMidnight(assetMovement.demobilization_date)
      : Infinity
    const demobUTC =
      rawDemobUTC === Infinity ? Infinity : rawDemobUTC - 24 * 60 * 60 * 1000

    const effectiveStartUTC = Math.max(bulletinStartUTC, integrationUTC)
    const effectiveEndUTC = Math.min(bulletinEndUTC, demobUTC)

    // Calculate the total days of the requested billing period (used as monthly divisor)
    let periodDays =
      Math.max(
        1,
        Math.ceil((bulletinEndUTC - bulletinStartUTC) / (1000 * 60 * 60 * 24)),
      ) + 1

    const isFullMonth = this.isFullMonthPeriod(startDate, endDate)
    const calculationRule =
      assetMovement.calculation_rule || 'COMMERCIAL_30_DAYS'

    if (calculationRule === 'COMMERCIAL_30_DAYS') {
      periodDays = 30
    }

    // CALENDAR_DAYS: exactly how many days span the chosen dates within the effective period
    // If effective end is before effective start, then total days is 0.
    let totalDays =
      effectiveEndUTC >= effectiveStartUTC
        ? Math.max(
            1,
            Math.ceil(
              (effectiveEndUTC - effectiveStartUTC) / (1000 * 60 * 60 * 24),
            ) + 1,
          )
        : 0

    // For COMMERCIAL_30_DAYS, if the user requested a full month and the asset was available the entire time,
    // force totalDays to 30 to reflect the 30-day commercial month KPI.
    if (calculationRule === 'COMMERCIAL_30_DAYS' && isFullMonth) {
      if (
        effectiveStartUTC <= bulletinStartUTC &&
        effectiveEndUTC >= bulletinEndUTC
      ) {
        totalDays = 30
      }
    }

    // Count inactive days via Repository
    const maintenances =
      await this.maintenanceRepository.findInactiveByAssetAndPeriod(
        assetMovement.assetId,
        new Date(Math.max(startDate.getTime(), effectiveStartUTC)),
        new Date(Math.min(endDate.getTime(), effectiveEndUTC)),
      )

    // Create a set of unique dates (YYYY-MM-DD) that are inactive
    const inactiveDates = new Set<string>()

    maintenances.forEach((m) => {
      const mStart = m.started_date
        ? new Date(m.started_date)
        : new Date(m.scheduled_date)
      const mEnd = m.completed_date
        ? new Date(m.completed_date)
        : m.started_date
          ? new Date()
          : new Date(m.scheduled_date)

      // Iterate through each day of the maintenance that overlaps with the bulletin period
      // BUT bounded by the actual effective Start/End
      const iterDate = new Date(Math.max(mStart.getTime(), effectiveStartUTC))
      const iterEnd = new Date(Math.min(mEnd.getTime(), effectiveEndUTC))

      // Normalise to beginning of day for iteration
      iterDate.setUTCHours(0, 0, 0, 0)
      iterEnd.setUTCHours(0, 0, 0, 0)

      while (iterDate <= iterEnd) {
        inactiveDates.add(iterDate.toISOString().split('T')[0])
        iterDate.setUTCDate(iterDate.getUTCDate() + 1)
      }
    })

    const inactiveDays = inactiveDates.size
    const workingDays = Math.max(0, totalDays - inactiveDays)

    // Calculate rate and units based on billing cycle
    let dailyRate: number
    let workingUnits: number = workingDays
    let unitName: string = 'DAYS'
    let hourlyOverage = 0
    let hourlyFranchise = 0

    switch (assetMovement.billing_cycle) {
      case 'HOURLY':
        dailyRate = Number(assetMovement.rental_value)
        workingUnits = data.measured_quantity || 0
        unitName = 'HOURS'
        hourlyFranchise = Number(assetMovement.franchise_hours || 0)
        hourlyOverage = Math.max(0, workingUnits - hourlyFranchise)
        break
      case 'PER_UNIT':
        dailyRate = Number(assetMovement.rental_value)
        workingUnits = data.measured_quantity || 0
        unitName = 'SERVICE'
        break
      case 'DAILY':
        dailyRate = Number(assetMovement.rental_value)
        break
      case 'WEEKLY':
        dailyRate = Number(assetMovement.rental_value) / 7
        break
      case 'MONTHLY':
      default:
        // Use the calendar days of the reference period to calculate the true proportion
        const monthlyDivisor = periodDays
        dailyRate = Number(assetMovement.rental_value) / monthlyDivisor
        break
    }

    const extraHourRate = Number(
      assetMovement.extra_hour_value ?? assetMovement.rental_value,
    )

    // Locação: no HOURLY a franquia é o mínimo faturável e o excedente usa a hora extra
    const totalValue =
      assetMovement.billing_cycle === 'HOURLY'
        ? Math.max(workingUnits, hourlyFranchise) * dailyRate -
          hourlyOverage * dailyRate +
          hourlyOverage * extraHourRate
        : dailyRate * workingUnits

    // Round the dailyRate exactly like how it will be stored and shown to the user on PDF
    const roundedRate = Math.round(dailyRate * 100) / 100
    const roundedRentalTotal = Math.round(totalValue * 100) / 100

    let measurementBulletin =
      await this.measurementBulletinRepository.create({
        contractId: data.contractId,
        assetMovementId: data.assetMovementId,
        reference_start: data.reference_start,
        reference_end: data.reference_end,
        total_days: totalDays,
        inactive_days: inactiveDays,
        working_days: workingDays,
        daily_rate: new Prisma.Decimal(roundedRate.toFixed(2)),
        rental_value_total: new Prisma.Decimal(roundedRentalTotal.toFixed(2)),
        expenses_total: new Prisma.Decimal('0.00'),
        total_value: new Prisma.Decimal(roundedRentalTotal.toFixed(2)),
        measured_quantity: data.measured_quantity
          ? new Prisma.Decimal(data.measured_quantity.toFixed(2))
          : null,
        measurement_unit: unitName,
        notes: data.notes,
        current_horometer: data.current_horometer,
        current_odometer: data.current_odometer,
      })

    // Mobilização, frete e desmobilização entram como despesas do boletim do período
    await applyMovementChargesToBulletin({
      bulletinId: measurementBulletin.id,
      contractId: data.contractId,
      referenceStart: startDate,
      referenceEnd: new Date(data.reference_end),
      movement: {
        mobilization_date: assetMovement.mobilization_date,
        demobilization_date: assetMovement.demobilization_date,
        freight_value: assetMovement.freight_value,
      },
    })

    const refreshed = await this.measurementBulletinRepository.findById(
      measurementBulletin.id,
    )
    if (refreshed) measurementBulletin = refreshed

    // Comissão mensal do contrato = soma de todos os boletins do mês
    await recalculateContractMonthCommission(data.contractId, data.reference_start)

    return { measurementBulletin }
  }

  /**
   * Checks if a date range represents a full calendar month.
   * E.g., Feb 1-28 (non-leap) or Feb 1-29 (leap), Jan 1-31, etc.
   * All full months are treated as 30 commercial days.
   */
  private isFullMonthPeriod(start: Date, end: Date): boolean {
    // Datas são tratadas em UTC, como no restante do cálculo
    if (start.getUTCDate() !== 1) return false

    if (
      start.getUTCMonth() !== end.getUTCMonth() ||
      start.getUTCFullYear() !== end.getUTCFullYear()
    ) {
      return false
    }

    const lastDay = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0),
    ).getUTCDate()

    return end.getUTCDate() === lastDay
  }
}
