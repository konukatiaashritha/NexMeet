const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
const { AppError, asyncHandler } = require('../middleware/errorHandler')
const logger = require('../utils/logger')

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// Format user for response
const formatUser = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  profile: user.profile || null,
})

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profile: {
        create: {},
      },
    },
    include: {
      profile: true,
    },
  })

  const token = generateToken(user.id)

  logger.info('New user registered', { userId: user.id, email: user.email })

  res.status(201).json({
    success: true,
    data: {
      token,
      user: formatUser(user),
    },
  })
})

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          networkingIntents: { include: { intent: true } },
          lookingForItems: { include: { lookingForOption: true } },
        },
      },
    },
  })

  if (!user || !user.isActive) {
    logger.warn('Failed login attempt', { email })
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    logger.warn('Failed login attempt - wrong password', { email })
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
  }

  const token = generateToken(user.id)

  logger.info('User logged in', { userId: user.id, email: user.email })

  res.json({
    success: true,
    data: {
      token,
      user: formatUser(user),
    },
  })
})

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  // JWT is stateless — just return success
  // Frontend should clear the token
  res.json({
    success: true,
    data: { message: 'Logged out successfully.' },
  })
})

// GET /api/auth/me
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          networkingIntents: { include: { intent: true } },
          lookingForItems: { include: { lookingForOption: true } },
        },
      },
      organizer: true,
    },
  })

  if (!user) {
    throw new AppError('User not found.', 404, 'NOT_FOUND')
  }

  res.json({
    success: true,
    data: {
      ...formatUser(user),
      organizer: user.organizer || null,
    },
  })
})

module.exports = { register, login, logout, getCurrentUser }
