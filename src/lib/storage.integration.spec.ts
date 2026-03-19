import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { uploadToB2, deleteFromB2, getKeyFromUrl } from './storage'
import { randomUUID } from 'crypto'

describe('Storage Integration Test (Real B2 Upload)', () => {
  it('should successfully upload a real PNG image buffer to Backblaze B2 and delete it afterwards using the generic upload function', async () => {
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    const buffer = Buffer.from(pngBase64, 'base64')

    const originalFilename = `test-real-upload-pixel-${randomUUID()}.png`
    const contentType = 'image/png'
    const folder = 'tests/integration'

    console.log('⬆️ Starting real upload to Backblaze B2...')
    const uploadStart = Date.now()
    
    // 1. UPLOAD
    const { url, key } = await uploadToB2(buffer, originalFilename, contentType, folder)
    
    const uploadMs = Date.now() - uploadStart
    console.log(`✅ Upload complete in ${uploadMs}ms. URL: ${url}`)

    // 2. ASSERTIONS
    expect(url).toBeDefined()
    expect(key).toBeDefined()
    expect(key).toContain('tests/integration')
    expect(url).toContain(key)

    expect(getKeyFromUrl(url)).toBe(key)

    // 3. CLEANUP (DELETE)
    console.log(`🗑️ Deleting test file ${key} from B2...`)
    const deleteStart = Date.now()
    await deleteFromB2(key)
    const deleteMs = Date.now() - deleteStart
    console.log(`✅ Cleanup complete in ${deleteMs}ms.`)

  }, 30000)
})
