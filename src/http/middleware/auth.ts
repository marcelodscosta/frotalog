import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { AppError } from '../../services/errors/app-error'
import { env } from '../../env'

interface JWTPayload {
  sub: string
  email: string
  role: string
  iat: number
  exp: number
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      email: string
      role: string
    }
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('Token not provided', 401)
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      throw new AppError('Token not provided', 401)
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload

    request.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401)
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401)
    }

    throw error
  }
}

export function requireRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await authMiddleware(request, reply)

    if (!roles.includes(request.user.role)) {
      throw new AppError('Insufficient permissions', 403)
    }
  }
}

export function requireAdmin() {
  return requireRole(['ADMIN'])
}

export function requireEmployee() {
  return requireRole(['ADMIN', 'EMPLOYEE'])
}

export function requireAuth() {
  return authMiddleware
}
