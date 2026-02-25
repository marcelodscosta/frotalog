import { describe, it, expect, beforeEach } from 'vitest'
import { CreateContractUseCase } from '../../contract/create-contract-use-case'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { InMemorySupplierRepository } from '../../../repositories/in-memory/in-memory-supplier-repository'
import { ContractAlreadyExistsError } from '../../errors/contract-already-exist-error'
import { ClientNotFoundError } from '../../errors/client-not-found-error'

let contractRepository: InMemoryContractRepository
let supplierRepository: InMemorySupplierRepository
let sut: CreateContractUseCase

describe('Create Contract', () => {
  beforeEach(async () => {
    contractRepository = new InMemoryContractRepository()
    supplierRepository = new InMemorySupplierRepository()
    sut = new CreateContractUseCase(contractRepository, supplierRepository)

    await supplierRepository.create({
      id: 'client-01',
      company_name: 'Cliente Teste Ltda',
      cnpj: '12345678000100',
      email: 'cliente@teste.com',
      phone: '11999999999',
      contact: 'João Silva',
      isClient: true,
    })
  })

  it('should create a contract successfully', async () => {
    const result = await sut.execute({
      contract_number: 'CT-001',
      description: 'Contrato de locação',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
      total_value: 50000,
    })

    expect(result.contract).toBeDefined()
    expect(result.contract.contract_number).toBe('CT-001')
    expect(result.contract.clientId).toBe('client-01')
    expect(contractRepository.items).toHaveLength(1)
  })

  it('should not create contract with duplicate number', async () => {
    await sut.execute({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    await expect(
      sut.execute({
        contract_number: 'CT-001',
        clientId: 'client-01',
        start_date: new Date('2026-02-01'),
      }),
    ).rejects.toBeInstanceOf(ContractAlreadyExistsError)
  })

  it('should not create contract with invalid client', async () => {
    await expect(
      sut.execute({
        contract_number: 'CT-002',
        clientId: 'non-existent-client',
        start_date: new Date('2026-01-01'),
      }),
    ).rejects.toBeInstanceOf(ClientNotFoundError)
  })

  it('should not create contract when supplier is not a client', async () => {
    await supplierRepository.create({
      id: 'supplier-01',
      company_name: 'Fornecedor Teste',
      cnpj: '98765432000100',
      email: 'fornecedor@teste.com',
      phone: '11888888888',
      contact: 'Pedro',
      isClient: false,
    })

    await expect(
      sut.execute({
        contract_number: 'CT-003',
        clientId: 'supplier-01',
        start_date: new Date('2026-01-01'),
      }),
    ).rejects.toBeInstanceOf(ClientNotFoundError)
  })
})
