import 'dotenv/config'
console.log('Dotenv loaded, DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND')
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url('DATABASE_URL deve ser uma URL válida'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  B2_ENDPOINT: z.string().optional(),
  B2_REGION: z.string().optional(),
  B2_BUCKET: z.string().optional(),
  B2_ACCESS_KEY_ID: z.string().optional(),
  B2_SECRET_ACCESS_KEY: z.string().optional(),
  B2_PUBLIC_BASE_URL: z.string().optional(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error(
    '❌ Variáveis de ambiente inválidas:',
    z.treeifyError(_env.error),
  )
  throw new Error('Variáveis de ambiente inválidas.')
}

export const env = _env.data

// Log warning if B2 is not configured
const missingB2Vars = []
if (!env.B2_ENDPOINT) missingB2Vars.push('B2_ENDPOINT')
if (!env.B2_REGION) missingB2Vars.push('B2_REGION')
if (!env.B2_BUCKET) missingB2Vars.push('B2_BUCKET')
if (!env.B2_ACCESS_KEY_ID) missingB2Vars.push('B2_ACCESS_KEY_ID')
if (!env.B2_SECRET_ACCESS_KEY) missingB2Vars.push('B2_SECRET_ACCESS_KEY')
if (!env.B2_PUBLIC_BASE_URL) missingB2Vars.push('B2_PUBLIC_BASE_URL')

if (missingB2Vars.length > 0 && env.NODE_ENV !== 'test') {
  console.warn(
    `⚠️ Configuração de armazenamento B2 incompleta. Variáveis ausentes: ${missingB2Vars.join(', ')}. Uploads não funcionarão corretamente.`,
  )
}
