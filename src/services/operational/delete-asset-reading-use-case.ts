import { prisma } from '../../lib/prisma'
import { AppError } from '../errors/app-error'

interface DeleteAssetReadingRequest {
  readingId: string
}

export class DeleteAssetReadingUseCase {
  async execute({ readingId }: DeleteAssetReadingRequest) {
    const reading = await prisma.assetReading.findUnique({
      where: { id: readingId },
    })

    if (!reading) {
      throw new AppError('Reading not found', 404)
    }

    const { assetId } = reading

    // Delete the reading
    await prisma.assetReading.delete({
      where: { id: readingId },
    })

    // Find the new latest reading
    const latestReading = await prisma.assetReading.findFirst({
      where: { assetId },
      orderBy: { date: 'desc' },
    })

    // Update Asset
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    })

    if (!asset) {
        // Should not happen if foreign key constraints are valid, but typesafety
        return
    }

    if (latestReading) {
      await prisma.asset.update({
        where: { id: assetId },
        data: {
          current_horometer: latestReading.horometer ?? asset.current_horometer, // Keep current if reading is null? No, probably reading has value.
          current_odometer: latestReading.odometer ?? asset.current_odometer,
        },
      })
    } else {
        // No readings left, revert to initial
        await prisma.asset.update({
            where: { id: assetId },
            data: {
                current_horometer: asset.initial_horometer ?? 0,
                current_odometer: asset.initial_odometer ?? 0,
            }
        })
    }
  }
}
