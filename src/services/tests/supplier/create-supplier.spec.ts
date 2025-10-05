import { beforeEach, describe, it, expect } from 'vitest'
import { CreateSupplierUseCase } from '../../../services/supplier/create-supplier-use-case'
import { InMemorySupplierRepository } from '../../../repositories/in-memory/in-memory-supplier-repository'

let supplierRepository: InMemorySupplierRepository
let sut: CreateSupplierUseCase

describe('Create Supplier', () => {
  beforeEach(() => {
    supplierRepository = new InMemorySupplierRepository()
    sut = new CreateSupplierUseCase(supplierRepository)
  })

  it('Shold to create Supplier', async () => {
    const { supplier } = await sut.execute({
      company_name: 'Top Locações Ltda',
      trading_name: 'Grupo TOP',
      cnpj: '18161784000100',
      contact: 'Marcelo Costa',
      email: 'financeiro@topconstrucoes.com',
      phone: '74981316568',
      adrdress: 'Rua 26, numero 26 Loteamento Recife',
      city: 'Petrolina',
      state: 'Pernambuco',
      zip_code: '489825331',
      service_types: ['Locação de equipamentos', 'Locação de mão de obra'],
    })
    expect(supplier.id).toEqual(expect.any(String))
  })
})
