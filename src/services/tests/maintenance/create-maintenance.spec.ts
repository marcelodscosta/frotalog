import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateMaintenanceUseCase } from '../../maintenance/create-maintenance-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { InMemorySupplierRepository } from '../../../repositories/in-memory/in-memory-supplier-repository'

import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { AssetNotFoundError } from '../../errors/asset-not-found-error'
import { SupplierNotFoundError } from '../../errors/supplier-not-found-error'
import { ServiceCategoryNotFoundError } from '../../errors/service-category-not-found-error'

let maintenanceRepository: InMemoryMaintenanceRepository
let assetRepository: InMemoryAssetRepository
let supplierRepository: InMemorySupplierRepository
let serviceCategoryRepository: any
let assetMovementRepository: InMemoryAssetMovementRepository
let sut: CreateMaintenanceUseCase

describe('Create Maintenance Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    assetRepository = new InMemoryAssetRepository()
    supplierRepository = new InMemorySupplierRepository()
    
    // We mock ServiceCategory inline since we don't have its repo yet
    serviceCategoryRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      search: vi.fn(),
      findByName: vi.fn(),
      deleteServiceCategory: vi.fn(),
      updateServiceCategory: vi.fn(),
    } as any

    assetMovementRepository = new InMemoryAssetMovementRepository()

    sut = new CreateMaintenanceUseCase(
      maintenanceRepository,
      assetRepository as any,
      supplierRepository,
      serviceCategoryRepository as any,
      assetMovementRepository,
    )

    await assetRepository.create({
      id: 'asset-01',
      brand: 'Caterpillar',
      model: '320D',
      plate: 'CAT-0001',
      serial_number: 'CAT123',
      year: 2022,
      category: { connect: { id: 'category-01' } },
    } as any)

    await supplierRepository.create({
      id: 'supplier-01',
      company_name: 'Pecas LTDA',
      cnpj: '12345678901234',
      email: 'contato@pecas.com',
      phone: '11999999999',
      contact: 'Joao',
      isClient: false,
    })
  })

  it('should be able to create a maintenance without category and movement', async () => {
    const { maintenance } = await sut.execute({
      assetId: 'asset-01',
      supplierId: 'supplier-01',
      type: 'PREVENTIVE',
      description: 'Troca de oleo',
      scheduled_date: new Date('2026-03-01'),
      estimated_cost: 1500,
    })

    expect(maintenance.id).toEqual(expect.any(String))
    expect(maintenance.type).toEqual('PREVENTIVE')
    expect(maintenance.status).toEqual('SCHEDULED')
    expect(maintenance.assetId).toEqual('asset-01')
    expect(maintenance.supplierId).toEqual('supplier-01')
    expect(maintenance.equipment_inactive).toBe(false)
  })

  it('should not be able to create a maintenance for a non-existing asset', async () => {
    await expect(() =>
      sut.execute({
        assetId: 'invalid-asset',
        supplierId: 'supplier-01',
        type: 'PREVENTIVE',
        description: 'Troca de oleo',
        scheduled_date: new Date('2026-03-01'),
      }),
    ).rejects.toBeInstanceOf(AssetNotFoundError)
  })

  it('should not be able to create a maintenance with a non-existing supplier', async () => {
    await expect(() =>
      sut.execute({
        assetId: 'asset-01',
        supplierId: 'invalid-supplier',
        type: 'PREVENTIVE',
        description: 'Troca de oleo',
        scheduled_date: new Date('2026-03-01'),
      }),
    ).rejects.toBeInstanceOf(SupplierNotFoundError)
  })
})
