import { prisma } from '../../lib/prisma'

interface GetAssetReadingsRequest {
  page: number
}

export class GetAssetReadingsUseCase {
  async execute({ page }: GetAssetReadingsRequest) {
    const readings = await prisma.assetReading.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        date: 'desc',
      },
      include: {
        asset: {
          select: {
            brand: true,
            model: true,
            plate: true,
            serial_number: true
          }
        }
      }
    })
    
    // Check if we also want user info? schema has userId string.
    // If we want user name, we need relation to User.
    // Assuming simple string or we add relation later. For now just ID.

    return { readings }
  }
}
