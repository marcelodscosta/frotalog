import { describe, it, expect, beforeEach } from 'vitest'
import { ISupplierRepository } from '../../../repositories/interfaces/ISupplierRepository'
import { FindByCompanyNameUseCase } from '../../supplier/find-by-company-name-use-case'
import { InMemorySupplierRepository } from '../../../repositories/in-memory/in-memory-supplier-repository'

let supplierRepository: ISupplierRepository
let sut: FindByCompanyNameUseCase

describe('Find Supplier by company name', () => {
  beforeEach(() => {
    supplierRepository = new InMemorySupplierRepository()
    sut = new FindByCompanyNameUseCase(supplierRepository)
  })

  it('Shoud to find Suppliers by company name', async () => {
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
    const result = await sut.execute({ page: 1, query: 'loca' })

    expect(result.suppliers).toHaveLength(2)
    expect(result.totalItems).toBe(2)
    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(1)
  })

  it('Shoud return empty array when no suppliers for company name', async () => {
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
    const result = await sut.execute({ page: 1, query: 'Não existe' })

    expect(result.suppliers.length).toEqual(0)
    expect(result.suppliers).toEqual([])
    expect(result.currentPage).toBe(1)
  })
})
