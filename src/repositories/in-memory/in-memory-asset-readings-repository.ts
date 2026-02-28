import { AssetReading, Prisma } from '../../generated/prisma'
import { AssetReadingRepository } from '../interfaces/asset-reading-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryAssetReadingsRepository implements AssetReadingRepository {
  public items: AssetReading[] = []

  async create(data: Prisma.AssetReadingUncheckedCreateInput) {
    const assetReading: AssetReading = {
      id: data.id ?? randomUUID(),
      assetId: data.assetId,
      date: new Date(data.date),
      horometer: data.horometer !== undefined ? Number(data.horometer) : null,
      odometer: data.odometer !== undefined ? Number(data.odometer) : null,
      notes: data.notes ?? null,
      userId: data.userId ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(assetReading)

    return assetReading
  }
}
