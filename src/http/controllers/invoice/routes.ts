import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { createInvoice } from './create-invoice-controller'
import { fetchInvoices, getInvoiceSummaryController } from './fetch-invoices-controller'
import { getInvoice } from './get-invoice-controller'
import { toggleInvoicePayment } from './toggle-invoice-payment-controller'
import { deleteInvoice } from './delete-invoice-controller'
import { cancelInvoice } from './cancel-invoice-controller'
import { receiveInvoiceController } from './receive-invoice-controller'
import { refundInvoiceController } from './refund-invoice-controller'
import { uploadInvoiceDocumentController } from './upload-invoice-document-controller'
import { listInvoiceDocumentsController } from './list-invoice-documents-controller'
import { deleteInvoiceDocumentController } from './delete-invoice-document-controller'
import { createContractMonthInvoice } from './create-contract-month-invoice-controller'

export async function invoiceRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  app.post('/invoices', createInvoice)
  app.post('/invoices/batch', createContractMonthInvoice)
  app.get('/invoices', fetchInvoices)
  app.get('/invoices/summary', getInvoiceSummaryController)
  app.get('/invoices/:id', getInvoice)
  app.post('/invoices/:id/receive', receiveInvoiceController)
  app.post('/invoices/:id/refund', refundInvoiceController)
  app.patch('/invoices/:id/toggle-payment', toggleInvoicePayment)
  app.delete('/invoices/:id', deleteInvoice)
  app.post('/invoices/:id/cancel', cancelInvoice)

  // Documentos
  app.post('/invoices/documents', uploadInvoiceDocumentController)
  app.get('/invoices/:invoiceId/documents', listInvoiceDocumentsController)
  app.delete('/invoices/documents/:documentId', deleteInvoiceDocumentController)
}
