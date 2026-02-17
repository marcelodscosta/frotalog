import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { createInvoice } from './create-invoice-controller'
import { fetchInvoices } from './fetch-invoices-controller'
import { getInvoice } from './get-invoice-controller'
import { toggleInvoicePayment } from './toggle-invoice-payment-controller'
import { deleteInvoice } from './delete-invoice-controller'

export async function invoiceRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  app.post('/invoices', createInvoice)
  app.get('/invoices', fetchInvoices)
  app.get('/invoices/:id', getInvoice)
  app.patch('/invoices/:id/toggle-payment', toggleInvoicePayment)
  app.delete('/invoices/:id', deleteInvoice)
}
