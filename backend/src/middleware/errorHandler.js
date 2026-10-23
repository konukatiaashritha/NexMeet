const logger = require('../utils/logger')

// Custom API Error class
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message)
    this.statusCode = statusCode
    this.code = code || 'API_ERROR'
    this.isOperational = true
  }
}

// Async route handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log all errors
  if (err.statusCode >= 500 || !err.isOperational) {
    logger.error('Unhandled error', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    })
  }

  // Prisma errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field'
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: `A record with this ${field} already exists.`,
      },
    })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
      },
    })
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REFERENCE',
        message: 'Referenced resource does not exist.',
      },
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token.',
      },
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please log in again.',
      },
    })
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed.',
        details: err.errors,
      },
    })
  }

  // Operational (known) errors
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    })
  }

  // Unknown errors - don't leak details in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
  })
}

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found.`,
    },
  })
}

module.exports = { AppError, asyncHandler, errorHandler, notFound }
