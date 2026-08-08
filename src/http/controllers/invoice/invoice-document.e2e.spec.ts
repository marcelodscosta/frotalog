import { describe, it, expect, beforeAll, afterAll, vitest } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

vitest.mock('../../../lib/storage', () => ({
  uploadToB2: vitest.fn().mockResolvedValue({ url: 'http://b2.com/mock.pdf', key: 'mock.pdf' }),
  deleteFromB2: vitest.fn().mockResolvedValue(true),
  getKeyFromUrl: vitest.fn().mockReturnValue('mock.pdf'),
}))

let token: string
let invoiceId: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-test-user', email: 'e2e@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Invoice Document E2E', () => {
  beforeAll(async () => {
    await app.ready()
    token = generateToken()

    const invoice = await prisma.invoice.create({
      data: {
        total_value: 1000,
        due_date: new Date(),
        notes: 'E2E Invoice',
      },
    })
    invoiceId = invoice.id
  })

  afterAll(async () => {
    await prisma.invoiceDocument.deleteMany({ where: { invoiceId } })
    await prisma.invoice.deleteMany({ where: { id: invoiceId } })
    await app.close()
  })

  it('POST /invoices/documents - should upload a document', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/invoices/documents',
      headers: { 
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data; boundary=boundary'
      },
      payload: '--boundary\r\nContent-Disposition: form-data; name="invoiceId"\r\n\r\n' + invoiceId + '\r\n--boundary\r\nContent-Disposition: form-data; name="document_type"\r\n\r\nNOTA_FISCAL\r\n--boundary\r\nContent-Disposition: form-data; name="description"\r\n\r\nE2E Test File\r\n--boundary\r\nContent-Disposition: form-data; name="file"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\n%PDF-1.4 mock content\r\n--boundary--\r\n',
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.document.filename).toBe('mock.pdf')
    expect(body.document.original_name).toBe('test.pdf')
    expect(body.document.invoiceId).toBe(invoiceId)
  })

  it('GET /invoices/:invoiceId/documents - should list uploaded documents', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/invoices/${invoiceId}/documents`,
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.documents.length).toBeGreaterThanOrEqual(1)
    expect(body.documents[0].invoiceId).toBe(invoiceId)
  })

  it('DELETE /invoices/documents/:documentId - should delete a document', async () => {
    // 1. Get the document ID first
    const listResponse = await app.inject({
      method: 'GET',
      url: `/invoices/${invoiceId}/documents`,
      headers: { Authorization: `Bearer ${token}` },
    })
    const documentId = listResponse.json().documents[0].id

    // 2. Delete it
    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/invoices/documents/${documentId}`,
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(deleteResponse.statusCode).toBe(204)

    // 3. Verify it's gone
    const verifyResponse = await app.inject({
      method: 'GET',
      url: `/invoices/${invoiceId}/documents`,
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(verifyResponse.json().documents.some((d: any) => d.id === documentId)).toBe(false)
  })
})
