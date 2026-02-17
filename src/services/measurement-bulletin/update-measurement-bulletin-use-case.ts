import {
  MeasurementBulletin,
  MeasurementBulletinStatus,
} from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateMeasurementBulletinRequest {
  id: string
  status?: MeasurementBulletinStatus
  notes?: string | null
}

interface UpdateMeasurementBulletinResponse {
  measurementBulletin: MeasurementBulletin
}

import { prisma } from '../../lib/prisma'

export class UpdateMeasurementBulletinUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute(
    data: UpdateMeasurementBulletinRequest,
  ): Promise<UpdateMeasurementBulletinResponse> {
    const existing = await this.measurementBulletinRepository.findById(data.id)
    if (!existing) throw new ResourceNotFoundError()

    const measurementBulletin =
      await this.measurementBulletinRepository.update(data.id, {
        status: data.status,
        notes: data.notes,
      })

    // If status changed to APPROVED, update Asset counters
    if (
      data.status === MeasurementBulletinStatus.APPROVED &&
      existing.status !== MeasurementBulletinStatus.APPROVED
    ) {
      await this.updateAssetCounters(measurementBulletin)
    }

    return { measurementBulletin }
  }

  private async updateAssetCounters(bulletin: MeasurementBulletin) {
    // We need to fetch the assetMovement to get the assetId
    // The repository method findById might include it, but let's be safe and fetch active movement logic if needed
    // However, bulletin has assetMovementId.
    
    const bulletinWithMovement = await prisma.measurementBulletin.findUnique({
      where: { id: bulletin.id },
      include: {
        assetMovement: true
      }
    })

    if (!bulletinWithMovement?.assetMovement) return

    const assetId = bulletinWithMovement.assetMovement.assetId
    
    // Calculate new totals based on bulletin data
    // Bulletin has total_horometer and total_odometer which represent the TOTAL usage *during this period*
    // OR does it have the FINAL reading?
    // Let's check Schema. MeasurementBulletin has `current_horometer` and `current_odometer` representing the value at end of period.
    
    // Actually, looking at previous files (create-measurement-bulletin logic), 
    // it likely stores the *reading* at the end of the period.
    // Let's verify standard: usually 'current_horometer' in bulletin is the closing reading.
    
    const newHorometer = bulletin.current_horometer
    const newOdometer = bulletin.current_odometer

    if (newHorometer || newOdometer) {
      await prisma.asset.update({
        where: { id: assetId },
        data: {
          ...(newHorometer ? { current_horometer: newHorometer } : {}),
          ...(newOdometer ? { current_odometer: newOdometer } : {}),
        }
      })
    }
  }
}
