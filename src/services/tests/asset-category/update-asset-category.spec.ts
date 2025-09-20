import { describe, it, expect, beforeEach } from 'vitest'
import { Prisma } from '../../../generated/prisma'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'

describe('InMemoryAssetCategoryRepository', () => {
  let repository: InMemoryAssetCategoryRepository

  beforeEach(() => {
    repository = new InMemoryAssetCategoryRepository()
  })

  it('should update an existing asset category', async () => {
    const created = await repository.create({
      id: '1',
      name: 'Caminhão Munck',
      description: 'Descrição 1',
      type: 'VEHICLE',
      updated_at: new Date(),
    })

    const updateData: Prisma.AssetCategoryUpdateInput = {
      name: 'Caminhão Guindaste',
      description: 'Descrição atualizada',
    }

    const updated = await repository.updateAssetCategory(created.id, updateData)

    expect(updated.name).toBe(updateData.name)
    expect(updated.description).toBe(updateData.description)
    expect(updated.updated_at).toBeInstanceOf(Date)

    const found = await repository.findById(created.id)
    expect(found?.name).toBe(updateData.name)
    expect(found?.description).toBe(updateData.description)
  })

  it('should throw if asset category not found', async () => {
    await expect(
      repository.updateAssetCategory('non-existent-id', { name: 'Test' }),
    ).rejects.toThrow('AssetCategory not found')
  })
})
