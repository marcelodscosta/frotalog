import { describe, it, expect, beforeEach } from 'vitest'
import { FindAllSupplierUseCase } from '../../supplier/find-all-supplier-use-case'
import { ISupplierRepository } from '../../../repositories/interfaces/ISupplierRepository'
import { InMemorySupplierRepository } from '../../../repositories/in-memory/in-memory-supplier-repository'

describe('Find All Supplier', () => {
  let supplierRepository: ISupplierRepository
  let sut: FindAllSupplierUseCase

  beforeEach(() => {
    supplierRepository = new InMemorySupplierRepository()
    sut = new FindAllSupplierUseCase(supplierRepository)
  })

  it('Shoud find all Suppliers', async () => {
    await supplierRepository.create({
      id: 'fornecedor01',
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

    await supplierRepository.create({
      id: 'fornecedor02',
      company_name: 'Jusu Locadora de Veiculos Ltda',
      trading_name: 'Locar',
      cnpj: '02466870000186',
      contact: 'João',
      email: 'financeiro@locar.com',
      phone: '8732654011',
      adrdress: 'Rua 02, Avenida Sete de Setembro',
      city: 'Petrolina',
      state: 'Pernambuco',
      zip_code: '48975321',
      service_types: ['Locação de equipamentos', 'Locação de mão de obra'],
    })

    await supplierRepository.create({
      id: 'fornecedor03',
      company_name: 'Leao Equipamentos',
      trading_name: 'Leao',
      cnpj: '20182807000442',
      contact: 'Pedro',
      email: 'financeiro@leao.com',
      phone: '8732654014',
      adrdress: 'Rua 23, Avenida doze de novembro',
      city: 'Petrolina',
      state: 'Pernambuco',
      zip_code: '48975324',
      service_types: [
        'Locação de equipamentos',
        'Locação de mão de obra',
        'Venda de peças',
      ],
    })
    const result = await sut.execute({ page: 1 })

    expect(result.currentPage).toBe(1)
    expect(result.pageSize).toBeGreaterThan(0)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
  })
})
