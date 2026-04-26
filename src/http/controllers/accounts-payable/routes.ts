import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import {
  createBankAccountController,
  listBankAccountsController,
  updateBankAccountController,
  listTransactionsController,
  updateTransactionController,
  transferBetweenAccountsController,
} from './bank-account-controllers'
import {
  launchExpenseController,
  updateExpenseController,
  listExpensesController,
  listExpensesByMaintenanceController,
  approveExpenseController,
  rejectExpenseController,
  listPendingApprovalsController,
  payInstallmentController,
  getExpensesSummaryController,
  scheduleInstallmentController,
  deleteExpenseController,
} from './expense-controllers'
import { createExpenseDocumentController } from './create-expense-document-controller'

export async function accountsPayableRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  // Bank Accounts
  app.post('/bank-accounts', createBankAccountController)
  app.get('/bank-accounts', listBankAccountsController)
  app.patch('/bank-accounts/:id', updateBankAccountController)
  app.get('/bank-accounts/transactions', listTransactionsController)
  app.patch('/bank-accounts/transactions/:id', updateTransactionController)
  app.post('/bank-accounts/transfer', transferBetweenAccountsController)

  // Payable Expenses
  app.post('/expenses', launchExpenseController)
  app.get('/expenses', listExpensesController)
  app.get('/expenses/summary', getExpensesSummaryController)
  app.get('/expenses/maintenance/:maintenanceId', listExpensesByMaintenanceController)
  app.patch('/expenses/:id', updateExpenseController)
  app.delete('/expenses/:id', deleteExpenseController)
  app.post('/expenses/documents', createExpenseDocumentController)

  // Approval Flow
  app.get('/expenses/approvals/pending', listPendingApprovalsController)
  app.patch('/expenses/:id/approve', approveExpenseController)
  app.patch('/expenses/:id/reject', rejectExpenseController)

  // Conciliation - Pay installment
  app.post('/expenses/installments/:installmentId/pay', payInstallmentController)
  app.patch('/expenses/installments/:id/schedule', scheduleInstallmentController)
}
