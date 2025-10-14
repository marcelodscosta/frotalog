import { describe, beforeEach, it, expect } from 'vitest'
import { InMemorySupplierRepository } from '../../../repositories/in-memory/in-memory-supplier-repository'
import { FindSupplierByIdUseCase } from '../../supplier/find-by-id-use-case'
import { AppError } from '../../errors/app-error'

let supplierRepository: InMemorySupplierRepository
let sut: FindSupplierByIdUseCase

describe('Find Supplier by id', () => {
  beforeEach(() => {
    supplierRepository = new InMemorySupplierRepository()
    sut = new FindSupplierByIdUseCase(supplierRepository)
  })
  it('Should to find Supplier by id', async () => {
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

    const { supplier } = await sut.execute({ id: 'fornecedor02' })

    expect(supplier?.trading_name).toBe('Locar')
  })

  it('Should return null when Supplier is not found', async () => {
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

    await expect(sut.execute({ id: 'id-inexistente' })).rejects.toBeInstanceOf(
      AppError,
    )
  })
})
