const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const { errorHandler, notFound } = require('./middleware/errorHandler')
const logger = require('./utils/logger')

// Import routes
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const eventsRoutes = require('./routes/events')
const networkingRoutes = require('./routes/networking')
const notificationsRoutes = require('./routes/notifications')
const organizersRoutes = require('./routes/organizers')
const adminRoutes = require('./routes/admin')
const optionsRoutes = require('./routes/options')

// Import community controller for inline routes
const {
  getCommunity,
  getCommunityPosts,
  createPost,
  updatePost,
  deletePost,
  createComment,
  deleteComment,
  getAllCommunities,
} = require('./controllers/communityController')
const { authenticate, optionalAuth } = require('./middleware/auth')
const { validate, schemas } = require('./middleware/validate')

// Create Express app
const app = express()

// ─────────────────────────────────────────────────────────────────────────────
// Security Middleware
// ─────────────────────────────────────────────────────────────────────────────

app.use(helmet({
  crossOriginEmbedderPolicy: false,
}))

// CORS
const corsOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:5173',  // Vite dev server
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests. Please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many authentication attempts.' } },
})

app.use('/api/', generalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// ─────────────────────────────────────────────────────────────────────────────
// Standard Middleware
// ─────────────────────────────────────────────────────────────────────────────

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// HTTP request logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
  skip: (req) => req.path === '/api/health',
}))

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/health', async (req, res) => {
  const prisma = require('./config/prisma')
  let dbStatus = 'unhealthy'
  try {
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'healthy'
  } catch (e) {
    logger.error('Health check DB error', { error: e.message })
  }

  res.json({
    success: true,
    status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/connections', networkingRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/organizers', organizersRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/options', optionsRoutes)

// Community routes (merged with events routes)
app.get('/api/communities', getAllCommunities)
app.get('/api/events/:eventId/community', optionalAuth, getCommunity)
app.get('/api/events/:eventId/community/posts', optionalAuth, getCommunityPosts)
app.post('/api/events/:eventId/community/posts', authenticate, validate(schemas.createPost), createPost)
app.patch('/api/posts/:id', authenticate, validate(schemas.createPost), updatePost)
app.delete('/api/posts/:id', authenticate, deletePost)
app.post('/api/posts/:id/comments', authenticate, validate(schemas.createComment), createComment)
app.delete('/api/comments/:id', authenticate, deleteComment)

// Networking recommendations (alias)
app.get('/api/networking/recommendations', authenticate, require('./controllers/networkingController').getRecommendations)

// Reviews routes (separate from events for editing/deleting)
app.patch('/api/reviews/:id', authenticate, require('./controllers/eventsController').updateReview)
app.delete('/api/reviews/:id', authenticate, require('./controllers/eventsController').deleteReview)

// ─────────────────────────────────────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────────────────────────────────────

app.use(notFound)
app.use(errorHandler)

module.exports = app
