import { app } from '../../../app'
import { env } from '../../../env'

import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest'
import FormData from 'form-data'

describe('Generic Upload (e2e)', () => {
  vitest.mock('../../../lib/storage', () => ({
    uploadToB2: vitest.fn().mockResolvedValue({
      url: 'https://mock-b2-url.com/test-bucket/test-folder/mock-key.txt',
      key: 'test-folder/mock-key.txt',
    }),
    deleteFromB2: vitest.fn().mockResolvedValue(true),
    getKeyFromUrl: vitest.fn().mockReturnValue('test-folder/mock-key.txt'),
  }))

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to upload a file successfully', async () => {
    const form = new FormData()
    form.append('file', Buffer.from('test file content'), {
      filename: 'test-file.txt',
      contentType: 'text/plain',
    })

    const response = await app.inject({
      method: 'POST',
      url: '/upload?folder=test-folder',
      headers: form.getHeaders(),
      payload: form,
    })

    expect(response.statusCode).toEqual(201)
    const body = response.json()
    expect(body).toEqual({
      secure_url: expect.stringContaining('mock-b2-url.com'),
      public_id: expect.stringContaining('test-folder/'),
      resource_type: expect.any(String),
      format: expect.any(String),
      bytes: 17,
      original_filename: 'test-file.txt',
    })
  })

  it('should return 400 when no file is provided', async () => {
    const form = new FormData()
    const response = await app.inject({
      method: 'POST',
      url: '/upload?folder=test-folder',
      headers: form.getHeaders(),
      payload: form,
    })

    expect(response.statusCode).toEqual(400)
    expect(response.json().message).toEqual('No file uploaded.')
  })
})
