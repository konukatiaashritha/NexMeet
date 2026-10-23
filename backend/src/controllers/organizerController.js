const prisma = require('../config/prisma')
const { AppError, asyncHandler } = require('../middleware/errorHandler')
const logger = require('../utils/logger')

// POST /api/organizers
const createOrganizer = asyncHandler(async (req, res) => {
  const existing = await prisma.organizer.findUnique({ where: { userId: req.user.id } })
  if (existing) throw new AppError('You already have an organizer profile.', 409, 'ALREADY_EXISTS')

  const organizer = await prisma.organizer.create({
    data: {
      userId: req.user.id,
      organizationName: req.body.organizationName,
      description: req.body.description,
      website: req.body.website,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      logo: req.body.logo,
    },
  })

  // Update user role to ORGANIZER
  await prisma.user.update({
    where: { id: req.user.id },
    data: { role: 'ORGANIZER' },
  })

  logger.info('Organizer created', { organizerId: organizer.id, userId: req.user.id })

  res.status(201).json({ success: true, data: organizer })
})

// GET /api/organizers/:id
const getOrganizer = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, createdAt: true } },
      events: {
        where: { status: 'PUBLISHED' },
        include: {
          _count: { select: { registrations: { where: { status: 'REGISTERED' } } } },
        },
        orderBy: { startDateTime: 'desc' },
        take: 10,
      },
    },
  })

  if (!organizer) throw new AppError('Organizer not found.', 404, 'NOT_FOUND')

  res.json({ success: true, data: organizer })
})

// PATCH /api/organizers/:id
const updateOrganizer = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({ where: { id: req.params.id } })
  if (!organizer) throw new AppError('Organizer not found.', 404, 'NOT_FOUND')
  if (organizer.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('Forbidden.', 403, 'FORBIDDEN')
  }

  const updated = await prisma.organizer.update({
    where: { id: req.params.id },
    data: {
      organizationName: req.body.organizationName,
      description: req.body.description,
      website: req.body.website,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      logo: req.body.logo,
    },
  })

  res.json({ success: true, data: updated })
})

// GET /api/organizers/me
const getMyOrganizer = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({
    where: { userId: req.user.id },
    include: {
      events: {
        include: {
          _count: { select: { registrations: { where: { status: 'REGISTERED' } } } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!organizer) throw new AppError('No organizer profile found.', 404, 'NOT_FOUND')

  res.json({ success: true, data: organizer })
})

// GET /api/organizers/me/events
const getMyOrganizerEvents = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({ where: { userId: req.user.id } })
  if (!organizer) throw new AppError('No organizer profile found.', 404, 'NOT_FOUND')

  const events = await prisma.event.findMany({
    where: { organizerId: organizer.id },
    include: {
      skills: { include: { skill: true } },
      _count: { select: { registrations: { where: { status: 'REGISTERED' } }, reviews: true, savedBy: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: events.map((e) => ({
      ...e,
      skills: e.skills.map((s) => s.skill.name),
      registeredCount: e._count.registrations,
      reviewCount: e._count.reviews,
      savedCount: e._count.savedBy,
    })),
  })
})

// GET /api/organizers/me/events/:eventId/registrations
const getEventRegistrations = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({ where: { userId: req.user.id } })
  if (!organizer) throw new AppError('No organizer profile found.', 404, 'NOT_FOUND')

  const event = await prisma.event.findUnique({ where: { id: req.params.eventId } })
  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')
  if (event.organizerId !== organizer.id) throw new AppError('Forbidden.', 403, 'FORBIDDEN')

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId: req.params.eventId },
    include: {
      user: {
        include: {
          profile: { select: { profilePhoto: true, jobTitle: true, college: true, company: true } },
        },
      },
    },
    orderBy: { registeredAt: 'desc' },
  })

  res.json({
    success: true,
    data: registrations.map((r) => ({
      id: r.id,
      status: r.status,
      registeredAt: r.registeredAt,
      cancelledAt: r.cancelledAt,
      user: {
        id: r.user.id,
        firstName: r.user.firstName,
        lastName: r.user.lastName,
        email: r.user.email,
        ...r.user.profile,
      },
    })),
  })
})

// GET /api/organizers/me/analytics
const getOrganizerAnalytics = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({ where: { userId: req.user.id } })
  if (!organizer) throw new AppError('No organizer profile found.', 404, 'NOT_FOUND')

  const events = await prisma.event.findMany({
    where: { organizerId: organizer.id },
    include: {
      _count: {
        select: {
          registrations: { where: { status: 'REGISTERED' } },
          savedBy: true,
          reviews: true,
        },
      },
      reviews: { select: { rating: true } },
    },
  })

  const totalEvents = events.length
  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED').length
  const totalRegistrations = events.reduce((sum, e) => sum + e._count.registrations, 0)
  const totalViews = events.reduce((sum, e) => sum + e.viewCount, 0)
  const totalSaved = events.reduce((sum, e) => sum + e._count.savedBy, 0)
  const allRatings = events.flatMap((e) => e.reviews.map((r) => r.rating))
  const avgRating = allRatings.length > 0
    ? Math.round((allRatings.reduce((s, r) => s + r, 0) / allRatings.length) * 10) / 10
    : 0

  res.json({
    success: true,
    data: {
      totalEvents,
      publishedEvents,
      totalRegistrations,
      totalViews,
      totalSaved,
      avgRating,
      totalReviews: allRatings.length,
      eventBreakdown: events.map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status,
        registrations: e._count.registrations,
        saved: e._count.savedBy,
        views: e.viewCount,
        reviews: e._count.reviews,
        capacity: e.capacity,
        capacityUtilization: e.capacity
          ? Math.round((e._count.registrations / e.capacity) * 100)
          : null,
      })),
    },
  })
})

// POST /api/organizers/:id/resources
const addEventResource = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({ where: { userId: req.user.id } })
  if (!organizer) throw new AppError('No organizer profile found.', 404, 'NOT_FOUND')

  const event = await prisma.event.findUnique({ where: { id: req.params.eventId } })
  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')
  if (event.organizerId !== organizer.id && req.user.role !== 'ADMIN') {
    throw new AppError('Forbidden.', 403, 'FORBIDDEN')
  }

  const resource = await prisma.eventResource.create({
    data: {
      eventId: event.id,
      title: req.body.title,
      type: req.body.type,
      url: req.body.url,
      description: req.body.description,
      isPublic: req.body.isPublic !== false,
    },
  })

  res.status(201).json({ success: true, data: resource })
})

// POST /api/events/:eventId/certificate
const upsertCertificate = asyncHandler(async (req, res) => {
  const organizer = await prisma.organizer.findUnique({ where: { userId: req.user.id } })
  if (!organizer) throw new AppError('No organizer profile found.', 404, 'NOT_FOUND')

  const event = await prisma.event.findUnique({ where: { id: req.params.eventId } })
  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')
  if (event.organizerId !== organizer.id && req.user.role !== 'ADMIN') {
    throw new AppError('Forbidden.', 403, 'FORBIDDEN')
  }

  const cert = await prisma.eventCertificate.upsert({
    where: { eventId: req.params.eventId },
    create: {
      eventId: req.params.eventId,
      ...req.body,
    },
    update: req.body,
  })

  // Update event certificateAvailable flag
  await prisma.event.update({
    where: { id: req.params.eventId },
    data: { certificateAvailable: true },
  })

  res.json({ success: true, data: cert })
})

module.exports = {
  createOrganizer,
  getOrganizer,
  updateOrganizer,
  getMyOrganizer,
  getMyOrganizerEvents,
  getEventRegistrations,
  getOrganizerAnalytics,
  addEventResource,
  upsertCertificate,
}
