const prisma = require('../config/prisma')
const { AppError, asyncHandler } = require('../middleware/errorHandler')
const logger = require('../utils/logger')

// GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(100, parseInt(req.query.limit) || 20)
  const skip = (page - 1) * limit
  const search = req.query.search

  const where = search ? {
    OR: [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  } : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isActive: true, createdAt: true,
        _count: { select: { registrations: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  res.json({
    success: true,
    data: users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

// PATCH /api/admin/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const { isActive, role } = req.body

  const user = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!user) throw new AppError('User not found.', 404, 'NOT_FOUND')

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      ...(isActive !== undefined && { isActive }),
      ...(role && { role }),
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
  })

  logger.info('Admin updated user', { adminId: req.user.id, targetUserId: req.params.id, changes: req.body })

  res.json({ success: true, data: updated })
})

// GET /api/admin/events
const getAdminEvents = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(100, parseInt(req.query.limit) || 20)
  const skip = (page - 1) * limit
  const status = req.query.status

  const where = status && status !== 'all' ? { status } : {}

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        organizer: { select: { organizationName: true, verificationStatus: true } },
        _count: { select: { registrations: { where: { status: 'REGISTERED' } } } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.event.count({ where }),
  ])

  res.json({
    success: true,
    data: events.map((e) => ({
      ...e,
      registeredCount: e._count.registrations,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

// PATCH /api/admin/events/:id
const updateAdminEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } })
  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')

  const updated = await prisma.event.update({
    where: { id: req.params.id },
    data: req.body,
  })

  logger.info('Admin updated event', { adminId: req.user.id, eventId: req.params.id })

  res.json({ success: true, data: updated })
})

// GET /api/admin/organizers
const getAdminOrganizers = asyncHandler(async (req, res) => {
  const status = req.query.status

  const where = status ? { verificationStatus: status } : {}

  const organizers = await prisma.organizer.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      _count: { select: { events: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ success: true, data: organizers })
})

// PATCH /api/admin/organizers/:id/verify
const verifyOrganizer = asyncHandler(async (req, res) => {
  const { status, notes } = req.body

  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    throw new AppError('Invalid status. Must be VERIFIED or REJECTED.', 400, 'INVALID_STATUS')
  }

  const organizer = await prisma.organizer.findUnique({ where: { id: req.params.id } })
  if (!organizer) throw new AppError('Organizer not found.', 404, 'NOT_FOUND')

  await prisma.organizer.update({
    where: { id: req.params.id },
    data: { verificationStatus: status, verificationNotes: notes },
  })

  // Record verification
  await prisma.organizerVerification.create({
    data: {
      organizerId: req.params.id,
      status,
      notes,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    },
  })

  logger.info('Admin verified organizer', { adminId: req.user.id, organizerId: req.params.id, status })

  res.json({ success: true, data: { message: `Organizer ${status.toLowerCase()}.` } })
})

// GET /api/admin/reports
const getReports = asyncHandler(async (req, res) => {
  const status = req.query.status || 'OPEN'

  const reports = await prisma.report.findMany({
    where: status !== 'all' ? { status } : {},
    include: {
      reporter: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ success: true, data: reports })
})

// PATCH /api/admin/reports/:id
const resolveReport = asyncHandler(async (req, res) => {
  const { status, resolution } = req.body

  await prisma.report.update({
    where: { id: req.params.id },
    data: {
      status,
      resolution,
      resolvedAt: new Date(),
      resolvedBy: req.user.id,
    },
  })

  res.json({ success: true, data: { message: 'Report resolved.' } })
})

// GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [users, events, organizers, registrations, reports] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.event.count({ where: { status: 'PUBLISHED' } }),
    prisma.organizer.count(),
    prisma.eventRegistration.count({ where: { status: 'REGISTERED' } }),
    prisma.report.count({ where: { status: 'OPEN' } }),
  ])

  res.json({
    success: true,
    data: { users, events, organizers, registrations, openReports: reports },
  })
})

module.exports = {
  getUsers, updateUser, getAdminEvents, updateAdminEvent,
  getAdminOrganizers, verifyOrganizer, getReports, resolveReport, getStats,
}
