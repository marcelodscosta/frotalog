import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
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
