import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPayableExpenseRepository } from '../../repositories/in-memory/in-memory-payable-expense-repository'
import { InMemoryMaintenanceRepository } from '../../repositories/in-memory/in-memory-maintenance-repository'
import { LaunchExpenseUseCase } from './launch-expense-use-case'

let payableExpenseRepository: InMemoryPayableExpenseRepository
let maintenanceRepository: InMemoryMaintenanceRepository
let sut: LaunchExpenseUseCase

describe('Launch Expense Use Case', () => {
  beforeEach(() => {
    payableExpenseRepository = new InMemoryPayableExpenseRepository()
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new LaunchExpenseUseCase(payableExpenseRepository, maintenanceRepository)
  })

  it('should be able to launch a single installment expense', async () => {
    const { expense } = await sut.execute({
      description: 'Test Expense',
      total_value: 100,
      payment_method: 'BOLETO',
      installments: [
        {
          installment_number: 1,
          value: 100,
          due_date: new Date(),
        },
      ],
    })

    expect(expense.id).toEqual(expect.any(String))
    expect(expense.installments).toHaveLength(1)
    expect(expense.status).toEqual('PENDING_FINANCE_APPROVAL')
  })

  it('should be able to launch a multi-installment expense', async () => {
    const { expense } = await sut.execute({
      description: 'Test Multi-Installment',
      total_value: 300,
      payment_method: 'PIX',
      installments: [
        { installment_number: 1, value: 100, due_date: new Date() },
        { installment_number: 2, value: 100, due_date: new Date() },
        { installment_number: 3, value: 100, due_date: new Date() },
      ],
    })

    expect(expense.installments).toHaveLength(3)
    expect(Number(expense.total_value)).toEqual(300)
  })

  it('should be able to launch an expense linked to a maintenance', async () => {
    const maintenance = await maintenanceRepository.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'PREVENTIVE',
      description: 'OS Test',
      scheduled_date: new Date(),
      estimated_cost: 500,
    })

    const { expense } = await sut.execute({
      maintenanceId: maintenance.id,
      description: 'Expense for Maintenance',
      total_value: 500,
      payment_method: 'BOLETO',
      installments: [
        { installment_number: 1, value: 500, due_date: new Date() },
      ],
    })

    expect(expense.maintenanceId).toEqual(maintenance.id)
    expect(expense.status).toEqual('PENDING_MAINTENANCE_APPROVAL')
  })

  it('should not be able to launch an expense without installments', async () => {
    await expect(() =>
      sut.execute({
        description: 'Invalid',
        total_value: 100,
        payment_method: 'BOLETO',
        installments: [],
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
