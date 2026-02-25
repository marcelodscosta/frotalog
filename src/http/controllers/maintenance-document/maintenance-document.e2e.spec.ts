import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'
import FormData from 'form-data'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

let assetId: string
let supplierId: string
let createdMaintenanceId: string
let documentId: string
let maintenanceToken: string
let dummyPdfPath: string
let uploadsDir: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-docs-user', email: 'e2edocs@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Maintenance Document (Uploads) E2E', () => {
  beforeAll(async () => {
    await app.ready()
    maintenanceToken = generateToken()

    // 1. Setup necessary foreign relationships
    const category = await prisma.assetCategory.create({
      data: { name: 'Docs E2E Cat', description: 'Test', type: 'EQUIPMENT' }
    })

    const asset = await prisma.asset.create({
      data: {
        brand: 'Ford', model: 'Doc Test Model', year: 2025,
        plate: 'DOC-1234', serial_number: 'DOC123',
        assetCategoryId: category.id, current_horometer: 100, current_odometer: 1000
      }
    })
    assetId = asset.id

    const supplier = await prisma.supplier.create({
      data: {
        company_name: 'Doc Supplier', cnpj: `91${Date.now()}91`,
        email: 'doc@sup.com', phone: '11999999999', contact: 'Doc Contact', isClient: false
      }
    })
    supplierId = supplier.id

    const maintenance = await prisma.maintenance.create({
      data: {
        assetId,
        supplierId,
        type: 'PREVENTIVE',
        description: 'Maintenance for Docs',
        scheduled_date: new Date(),
      }
    })
    createdMaintenanceId = maintenance.id

    // 2. Setup dummy file to upload
    dummyPdfPath = path.join(os.tmpdir(), 'dummy.pdf')
    await fs.writeFile(dummyPdfPath, 'fake-pdf-content')
    
    uploadsDir = path.join(process.cwd(), 'uploads', 'maintenance-documents')
  })

  afterAll(async () => {
    // 1. Cleanup generated document from uploads directory
    try {
      const documents = await prisma.maintenanceDocument.findMany()
      for(const doc of documents) {
        if(doc.file_path && doc.file_path.includes(uploadsDir)) {
           await fs.unlink(doc.file_path).catch(() => {})
        }
      }
    } catch(e) {}

    // 2. Disconnect and delete from DB
    await prisma.maintenanceDocument.deleteMany()
    await prisma.maintenance.deleteMany({ where: { assetId } })
    await prisma.asset.delete({ where: { id: assetId } })
    await prisma.supplier.delete({ where: { id: supplierId } })
    await prisma.assetCategory.deleteMany({ where: { name: 'Docs E2E Cat' } })

    // 3. Delete dummy pdf
    await fs.unlink(dummyPdfPath).catch(() => {})
    await app.close()
  })

  it('POST /maintenance/:maintenanceId/document - should upload a file', async () => {
    const fileStream = await fs.readFile(dummyPdfPath)
    
    const form = new FormData()
    form.append('description', 'Test Description for Upload')
    form.append('file', fileStream, {
      filename: 'dummy.pdf',
      contentType: 'application/pdf',
    })

    const response = await app.inject({
      method: 'POST',
      url: `/maintenance/${createdMaintenanceId}/document`,
      headers: {
        Authorization: `Bearer ${maintenanceToken}`,
        ...form.getHeaders()
      },
      payload: form
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.document).toBeDefined()
    expect(body.document.description).toBe('Test Description for Upload')
    expect(body.document.filename).toMatch(/\.pdf$/)
    documentId = body.document.id
  })

  it('GET /maintenance/:maintenanceId/documents - should list uploaded docs', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/maintenance/${createdMaintenanceId}/documents`,
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.documents.items.length).toBeGreaterThan(0)
    expect(body.documents.items[0].id).toBe(documentId)
  })

  it('GET /maintenance-document/search/:id - should get doc by id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/maintenance-document/search/${documentId}`,
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().document.id).toBe(documentId)
  })

  it('DELETE /maintenance-document/:id - should delete a doc', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/maintenance-document/${documentId}`,
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(204)
  })
})
