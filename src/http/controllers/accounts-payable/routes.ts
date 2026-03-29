import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import {
  createBankAccountController,
  listBankAccountsController,
  updateBankAccountController,
} from './bank-account-controllers'
import {
  launchExpenseController,
  listExpensesController,
  listExpensesByMaintenanceController,
  approveExpenseController,
  rejectExpenseController,
  listPendingApprovalsController,
  payInstallmentController,
} from './expense-controllers'

export async function accountsPayableRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  // Bank Accounts
  app.post('/bank-accounts', createBankAccountController)
  app.get('/bank-accounts', listBankAccountsController)
  app.patch('/bank-accounts/:id', updateBankAccountController)

  // Payable Expenses
  app.post('/expenses', launchExpenseController)
  app.get('/expenses', listExpensesController)
  app.get('/expenses/maintenance/:maintenanceId', listExpensesByMaintenanceController)

  // Approval Flow
  app.get('/expenses/approvals/pending', listPendingApprovalsController)
  app.patch('/expenses/:id/approve', approveExpenseController)
  app.patch('/expenses/:id/reject', rejectExpenseController)

  // Conciliation - Pay installment
  app.post('/expenses/installments/:installmentId/pay', payInstallmentController)
}
