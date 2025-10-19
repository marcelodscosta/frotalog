import { z } from 'zod'
import { isValidCNPJ } from './cnpjValidate'

export const cnpjSchema = z.string()
  .min(1, 'CNPJ é obrigatório')
  .refine((cnpj) => isValidCNPJ(cnpj), {
    message: 'CNPJ inválido'
  })
