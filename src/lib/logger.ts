import pino from 'pino'
import { env } from '../env'

const isDevelopment = env.NODE_ENV === 'dev'

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  } : undefined,
  formatters: {
    level: (label) => {
      return { level: label }
    }
  }
})

export const createChildLogger = (context: string) => {
  return logger.child({ context })
}
