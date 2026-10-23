require('dotenv').config()

const app = require('./app')
const prisma = require('./config/prisma')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 5000

async function startServer() {
  // Connect to database
  try {
    await prisma.$connect()
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error('Database connection failed', { error: error.message })
    process.exit(1)
  }

  // Start server
  const server = app.listen(PORT, () => {
    logger.info(`NexMeet API Server running`, {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      health: `http://localhost:${PORT}/api/health`,
    })
  })

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`)
    server.close(async () => {
      await prisma.$disconnect()
      logger.info('Server closed. Database disconnected.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection', { reason })
  })

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack })
    process.exit(1)
  })
}

startServer()
