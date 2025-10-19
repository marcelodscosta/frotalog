import { FastifyRequest, FastifyReply } from 'fastify'

// Middleware para rotas públicas (não requer autenticação)
export async function publicRoutesMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Este middleware não faz nada, apenas marca as rotas como públicas
  // As rotas de autenticação (login/register) não precisam de token
  return
}

// Lista de rotas públicas que não precisam de autenticação
export const PUBLIC_ROUTES = [
  'POST /auth/login',
  'POST /auth/register',
  'GET /health', // Rota de health check (se implementada)
]
