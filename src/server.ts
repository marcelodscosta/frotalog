import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    app.log.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
      },
      'HTTP server running!',
    )
  })
  .catch((error) => {
    app.log.fatal({ error }, 'Failed to start server')
    process.exit(1)
  })
