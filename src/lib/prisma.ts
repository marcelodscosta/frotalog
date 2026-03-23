import { env } from '../env'
import { PrismaClient } from '../generated/prisma'

console.log('Finalizing Prisma initialization with URL:', env.DATABASE_URL ? 'FOUND' : 'NOT FOUND')

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
})
