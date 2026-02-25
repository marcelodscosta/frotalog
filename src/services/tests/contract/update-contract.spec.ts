import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateContractUseCase } from '../../contract/update-contract-use-case'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { InMemorySupplierRepository } from '../../../repositories/in-memory/in-memory-supplier-repository'
import { ContractNotFoundError } from '../../errors/contract-not-fount-error'
import { ContractAlreadyExistsError } from '../../errors/contract-already-exist-error'
import { ClientNotFoundError } from '../../errors/client-not-found-error'

let contractRepository: InMemoryContractRepository
let supplierRepository: InMemorySupplierRepository
let sut: UpdateContractUseCase

describe('Update Contract', () => {
  beforeEach(async () => {
    contractRepository = new InMemoryContractRepository()
    supplierRepository = new InMemorySupplierRepository()
    sut = new UpdateContractUseCase(contractRepository, supplierRepository)

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

  it('should update a contract successfully', async () => {
    const created = await contractRepository.create({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    const result = await sut.execute({
      id: created.id,
      description: 'Descrição atualizada',
      responsible_name: 'Maria Silva',
    })

    expect(result.contract.description).toBe('Descrição atualizada')
    expect(result.contract.responsible_name).toBe('Maria Silva')
  })

  it('should throw error when contract does not exist', async () => {
    await expect(
      sut.execute({
        id: 'non-existent-id',
        description: 'Test',
      }),
    ).rejects.toBeInstanceOf(ContractNotFoundError)
  })

  it('should throw error when updating to a duplicate contract number', async () => {
    await contractRepository.create({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    const second = await contractRepository.create({
      contract_number: 'CT-002',
      clientId: 'client-01',
      start_date: new Date('2026-02-01'),
    })

    await expect(
      sut.execute({
        id: second.id,
        contract_number: 'CT-001',
      }),
    ).rejects.toBeInstanceOf(ContractAlreadyExistsError)
  })

  it('should throw error when updating to invalid client', async () => {
    const created = await contractRepository.create({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    await expect(
      sut.execute({
        id: created.id,
        clientId: 'non-existent-client',
      }),
    ).rejects.toBeInstanceOf(ClientNotFoundError)
  })
})
