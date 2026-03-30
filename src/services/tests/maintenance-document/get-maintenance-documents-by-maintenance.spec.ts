import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryMaintenanceDocumentRepository } from '../../../repositories/in-memory/in-memory-maintenance-document-repository'
import { InMemoryPayableExpenseRepository } from '../../../repositories/in-memory/in-memory-payable-expense-repository'
import { GetMaintenanceDocumentsByMaintenanceUseCase } from '../../maintenance-document/get-maintenance-documents-by-maintenance-use-case'

let maintenanceDocumentRepository: InMemoryMaintenanceDocumentRepository
let payableExpenseRepository: InMemoryPayableExpenseRepository
let getMaintenanceDocumentsByMaintenanceUseCase: GetMaintenanceDocumentsByMaintenanceUseCase

describe('Get Maintenance Documents By Maintenance', () => {
  beforeEach(() => {
    maintenanceDocumentRepository = new InMemoryMaintenanceDocumentRepository()
    payableExpenseRepository = new InMemoryPayableExpenseRepository()
    getMaintenanceDocumentsByMaintenanceUseCase = new GetMaintenanceDocumentsByMaintenanceUseCase(
      maintenanceDocumentRepository,
      payableExpenseRepository,
    )
  })

  it('Should get maintenance documents by maintenance id', async () => {
    for (let i = 1; i <= 22; i++) {
      await maintenanceDocumentRepository.create({
        Maintenance: { connect: { id: 'maintenance-01' } },
        filename: `test-${i}.pdf`,
        original_name: `test-${i}.pdf`,
        file_path: `/uploads/test-${i}.pdf`,
        file_size: 1024,
        mime_type: 'application/pdf',
      })
    }

    await maintenanceDocumentRepository.create({
      Maintenance: { connect: { id: 'maintenance-02' } },
      filename: `other.pdf`,
      original_name: `other.pdf`,
      file_path: `/uploads/other.pdf`,
      file_size: 1024,
      mime_type: 'application/pdf',
    })

    const { documents } = await getMaintenanceDocumentsByMaintenanceUseCase.execute({ 
      maintenanceId: 'maintenance-01', 
      page: 2 
    })

    expect(documents.items).toHaveLength(2)
    expect(documents.totalItems).toBe(22)
    expect(documents.currentPage).toBe(2)
  })

  it('Should get merged documents from both maintenance and expenses', async () => {
    // 1. Create a maintenance document
    await maintenanceDocumentRepository.create({
      Maintenance: { connect: { id: 'maintenance-01' } },
      filename: 'maintenance-doc.pdf',
      original_name: 'maintenance-doc.pdf',
      file_path: '/uploads/maintenance-doc.pdf',
      file_size: 1024,
      mime_type: 'application/pdf',
    })

    // 2. Create an expense for this maintenance
    const expense = await payableExpenseRepository.create({
      maintenanceId: 'maintenance-01',
      description: 'Test Expense',
      total_value: 100,
      payment_method: 'PIX',
      installments: [],
    })

    // 3. Create a document for this expense
    await payableExpenseRepository.createDocument({
      payableExpenseId: expense.id,
      filename: 'expense-doc.pdf',
      original_name: 'expense-doc.pdf',
      file_path: '/uploads/expense-doc.pdf',
      file_size: 2048,
      mime_type: 'application/pdf',
    })

    const { documents } = await getMaintenanceDocumentsByMaintenanceUseCase.execute({ 
      maintenanceId: 'maintenance-01', 
      page: 1 
    })

    // Should have 2 documents total (1 from maintenance, 1 from expense)
    expect(documents.items).toHaveLength(2)
    expect(documents.totalItems).toBe(2)
    
    // Check if the expense document was correctly mapped
    const expenseDoc = documents.items.find(d => d.filename === 'expense-doc.pdf')
    expect(expenseDoc).toBeDefined()
    expect(expenseDoc?.maintenanceId).toBe('maintenance-01')
  })
})
