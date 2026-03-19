import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { randomUUID } from 'crypto'
import path from 'path'

import { env } from '../env'

const s3Client = new S3Client({
  endpoint: env.B2_ENDPOINT,
  region: env.B2_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.B2_ACCESS_KEY_ID,
    secretAccessKey: env.B2_SECRET_ACCESS_KEY,
  },
})

const BUCKET = env.B2_BUCKET
const PUBLIC_BASE_URL = env.B2_PUBLIC_BASE_URL

interface UploadResult {
  url: string
  key: string
}

export async function uploadToB2(
  buffer: Buffer,
  originalFilename: string,
  contentType: string,
  folder: string = 'uploads',
): Promise<UploadResult> {
  const ext = path.extname(originalFilename)
  const key = `${folder}/${randomUUID()}${ext}`

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    },
  })

  await parallelUploads3.done()

  const url = `${PUBLIC_BASE_URL}/${key}`

  return { url, key }
}

export async function deleteFromB2(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  )
}

/**
 * Extracts the B2 object key from a full URL.
 * Example: "https://s3.us-east-005.backblazeb2.com/storage-top-locacoes/avatars/abc.jpg"
 *       -> "avatars/abc.jpg"
 */
export function getKeyFromUrl(url: string): string | null {
  if (!url || !PUBLIC_BASE_URL) return null
  if (url.startsWith(PUBLIC_BASE_URL)) {
    return url.slice(PUBLIC_BASE_URL.length + 1)
  }
  return null
}
