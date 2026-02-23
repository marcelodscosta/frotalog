import { MeasurementBulletin, Prisma } from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'
import { AppError } from '../errors/app-error'
import { prisma } from '../../lib/prisma'

interface CreateMeasurementBulletinRequest {
  contractId: string
  assetMovementId: string
  reference_start: Date
  reference_end: Date
  notes?: string | null
  current_horometer?: number | null
  current_odometer?: number | null
}


interface CreateMeasurementBulletinResponse {
  measurementBulletin: MeasurementBulletin
}

export class CreateMeasurementBulletinUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
    private assetMovementRepository: IAssetMovementRepository,
    private contractRepository: IContractRepository,
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

    const startDate = new Date(data.reference_start)
    let endDate = new Date(data.reference_end)

    // Check for overlapping bulletins
    const overlappingBulletin = await prisma.measurementBulletin.findFirst({
      where: {
        assetMovementId: data.assetMovementId,
        is_active: true,
        AND: [
          { reference_start: { lte: endDate } },
          { reference_end: { gte: startDate } },
        ],
      },
    })

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

    // Commercial month: always 30 days regardless of actual calendar days
    // Full month = start is day 1 and end is last day of that month
    const isFullMonth = this.isFullMonthPeriod(
      new Date(data.reference_start),
      new Date(data.reference_end),
    )

    let totalDays: number
    if (isFullMonth) {
      totalDays = 30
    } else {
      totalDays = Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1,
      )
    }

    // Count inactive days: maintenance records with equipment_inactive = true
    // for this asset within the reference period
    const maintenances = await prisma.maintenance.findMany({
      where: {
        assetId: assetMovement.assetId,
        equipment_inactive: true,
        is_Active: true,
        OR: [
          // Starts within period
          { started_date: { gte: startDate, lte: endDate } },
          // Ends within period
          { completed_date: { gte: startDate, lte: endDate } },
          // Spans entire period
          {
            AND: [
              { started_date: { lte: startDate } },
              { OR: [{ completed_date: { gte: endDate } }, { completed_date: null }] },
            ],
          },
          // If not started but scheduled within period, count it
          {
            AND: [
              { started_date: null },
              { scheduled_date: { gte: startDate, lte: endDate } },
            ],
          },
        ],
      },
    })

    // Create a set of unique dates (YYYY-MM-DD) that are inactive
    const inactiveDates = new Set<string>()

    maintenances.forEach((m) => {
      const mStart = m.started_date ? new Date(m.started_date) : new Date(m.scheduled_date)
      const mEnd = m.completed_date ? new Date(m.completed_date) : (m.started_date ? new Date() : new Date(m.scheduled_date))

      // Iterate through each day of the maintenance that overlaps with the bulletin period
      const iterDate = new Date(Math.max(mStart.getTime(), startDate.getTime()))
      const iterEnd = new Date(Math.min(mEnd.getTime(), endDate.getTime()))

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
    const dailyRate = Number(assetMovement.rental_value) / 30
    const totalValue = dailyRate * workingDays

    const measurementBulletin =
      await this.measurementBulletinRepository.create({
        contractId: data.contractId,
        assetMovementId: data.assetMovementId,
        reference_start: data.reference_start,
        reference_end: data.reference_end,
        total_days: totalDays,
        inactive_days: inactiveDays,
        working_days: workingDays,
        daily_rate: new Prisma.Decimal(dailyRate.toFixed(2)),
        total_value: new Prisma.Decimal(totalValue.toFixed(2)),
        notes: data.notes,
        current_horometer: data.current_horometer,
        current_odometer: data.current_odometer,
      })

    return { measurementBulletin }
  }

  /**
   * Checks if a date range represents a full calendar month.
   * E.g., Feb 1-28 (non-leap) or Feb 1-29 (leap), Jan 1-31, etc.
   * All full months are treated as 30 commercial days.
   */
  private isFullMonthPeriod(start: Date, end: Date): boolean {
    const startDay = start.getUTCDate()
    if (startDay !== 1) return false

    // Check they are in the same month and year
    if (
      start.getUTCMonth() !== end.getUTCMonth() ||
      start.getUTCFullYear() !== end.getUTCFullYear()
    ) {
      return false
    }

    // Check end is last day of the month
    const lastDay = new Date(
      end.getUTCFullYear(),
      end.getUTCMonth() + 1,
      0,
    ).getUTCDate()
    return end.getUTCDate() === lastDay
  }
}
