import { prisma } from '../../lib/prisma'
import { AppError } from '../errors/app-error'

interface CreateAssetReadingRequest {
  assetId: string
  date: Date
  horometer?: number | null
  odometer?: number | null
  notes?: string | null
  userId?: string | null
}

export class CreateAssetReadingUseCase {
  async execute({
    assetId,
    date,
    horometer,
    odometer,
    notes,
    userId,
  }: CreateAssetReadingRequest) {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    })

    if (!asset) {
      throw new AppError('Asset not found', 404)
    }

    // Create the reading record
    const reading = await prisma.assetReading.create({
      data: {
        assetId,
        date,
        horometer,
        odometer,
        notes,
        userId,
      },
    })

    // Update the Asset's current counters if new values are provided
    // We update even if lower? Usually readings should increase.
    // For now, let's just update to the new value, assuming operator knows best.
    // Ideally we should warn if lower, but let's allow correction.
    
    const dataToUpdate: any = {}
    
    if (horometer !== undefined && horometer !== null) {
        dataToUpdate.current_horometer = horometer
    }
    
    if (odometer !== undefined && odometer !== null) {
        dataToUpdate.current_odometer = odometer
    }
    
    if (Object.keys(dataToUpdate).length > 0) {
        await prisma.asset.update({
            where: { id: assetId },
            data: dataToUpdate
        })
    }

    return { reading }
  }
}
