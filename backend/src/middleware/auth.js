const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
const { AppError } = require('./errorHandler')

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED')
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })

    if (!user) {
      throw new AppError('User not found. Please log in again.', 401, 'USER_NOT_FOUND')
    }

    if (!user.isActive) {
      throw new AppError('Account has been deactivated.', 403, 'ACCOUNT_DEACTIVATED')
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

// Optional authentication - attaches user if token present but doesn't fail
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null
      return next()
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })

    req.user = user && user.isActive ? user : null
    next()
  } catch (err) {
    req.user = null
    next()
  }
}

// Authorize by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'))
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'))
    }
    next()
  }
}

module.exports = { authenticate, optionalAuth, authorize }
