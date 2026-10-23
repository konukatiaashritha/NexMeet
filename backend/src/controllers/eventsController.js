const prisma = require('../config/prisma')
const { AppError, asyncHandler } = require('../middleware/errorHandler')
const logger = require('../utils/logger')

// Helper: determine derived event status
const getDerivedStatus = (event) => {
  const now = new Date()
  if (event.status === 'CANCELLED') return 'CANCELLED'
  if (event.status === 'DRAFT') return 'DRAFT'
  if (event.status === 'ARCHIVED') return 'ARCHIVED'
  if (now < new Date(event.startDateTime)) return 'UPCOMING'
  if (now >= new Date(event.startDateTime) && now <= new Date(event.endDateTime)) return 'ONGOING'
  return 'COMPLETED'
}

// Helper: format event for response
const formatEvent = (event, currentUserId = null) => {
  const formatted = {
    ...event,
    derivedStatus: getDerivedStatus(event),
    organizerName: event.organizer?.organizationName || event.organizer?.user?.firstName,
    organizerLogo: event.organizer?.logo,
    registeredCount: event._count?.registrations ?? 0,
    savedCount: event._count?.savedBy ?? 0,
    skills: event.skills?.map((s) => s.skill.name) || [],
    isSaved: currentUserId ? event.savedBy?.some((s) => s.userId === currentUserId) : false,
    isRegistered: currentUserId ? event.registrations?.some((r) => r.userId === currentUserId && r.status === 'REGISTERED') : false,
  }
  delete formatted._count
  return formatted
}

// GET /api/events
const getEvents = asyncHandler(async (req, res) => {
  const {
    search, category, city, area, online, startDate, endDate,
    price, skill, experienceLevel, networkingAvailable, certificateAvailable,
    organizer, status, page = 1, limit = 20, sort = 'startDate',
  } = req.query

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
  const skip = (pageNum - 1) * limitNum

  // Build where clause
  const where = {}

  // Default: show only PUBLISHED events for non-admin
  if (!status) {
    where.status = 'PUBLISHED'
  } else if (status !== 'all') {
    where.status = status.toUpperCase()
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { organizer: { organizationName: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (category) where.category = category
  if (city) where.city = { contains: city, mode: 'insensitive' }
  if (area) where.area = { contains: area, mode: 'insensitive' }
  if (online !== undefined) where.isOnline = online === 'true'
  if (experienceLevel) where.experienceLevel = experienceLevel
  if (networkingAvailable !== undefined) where.networkingAvailable = networkingAvailable === 'true'
  if (certificateAvailable !== undefined) where.certificateAvailable = certificateAvailable === 'true'
  if (organizer) where.organizerId = organizer

  if (price === 'free') where.price = 0
  if (price === 'paid') where.price = { gt: 0 }

  if (startDate) where.startDateTime = { gte: new Date(startDate) }
  if (endDate) {
    where.endDateTime = where.endDateTime
      ? { ...where.endDateTime, lte: new Date(endDate) }
      : { lte: new Date(endDate) }
  }

  if (skill) {
    where.skills = {
      some: {
        skill: { name: { contains: skill, mode: 'insensitive' } },
      },
    }
  }

  // Sort order
  let orderBy = []
  switch (sort) {
    case 'newest': orderBy = [{ createdAt: 'desc' }]; break
    case 'oldest': orderBy = [{ createdAt: 'asc' }]; break
    case 'startDate': orderBy = [{ startDateTime: 'asc' }]; break
    case 'price_asc': orderBy = [{ price: 'asc' }]; break
    case 'price_desc': orderBy = [{ price: 'desc' }]; break
    case 'popular': orderBy = [{ viewCount: 'desc' }]; break
    default: orderBy = [{ startDateTime: 'asc' }]
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: { id: true, organizationName: true, logo: true, verificationStatus: true },
        },
        skills: { include: { skill: true } },
        _count: { select: { registrations: true, savedBy: true } },
        certificate: { select: { certificateType: true, issuedBy: true } },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.event.count({ where }),
  ])

  res.json({
    success: true,
    data: events.map((e) => formatEvent(e)),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  })
})

// GET /api/events/:id
const getEventById = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      organizer: {
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
      skills: { include: { skill: true } },
      speakers: { orderBy: { sortOrder: 'asc' } },
      resources: { where: { isPublic: true }, orderBy: { createdAt: 'asc' } },
      certificate: true,
      _count: { select: { registrations: { where: { status: 'REGISTERED' } }, savedBy: true, reviews: true } },
    },
  })

  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')

  // Increment view count (non-blocking)
  prisma.event.update({
    where: { id: event.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {})

  // Check if current user has registered/saved
  let userRegistration = null
  let userSaved = false
  if (req.user) {
    const [reg, saved] = await Promise.all([
      prisma.eventRegistration.findUnique({
        where: { userId_eventId: { userId: req.user.id, eventId: event.id } },
      }),
      prisma.savedEvent.findUnique({
        where: { userId_eventId: { userId: req.user.id, eventId: event.id } },
      }),
    ])
    userRegistration = reg
    userSaved = !!saved
  }

  const result = {
    ...event,
    derivedStatus: getDerivedStatus(event),
    organizerName: event.organizer?.organizationName,
    organizerLogo: event.organizer?.logo,
    organizerVerified: event.organizer?.verificationStatus === 'VERIFIED',
    skills: event.skills?.map((s) => s.skill.name) || [],
    registeredCount: event._count.registrations,
    savedCount: event._count.savedBy,
    reviewCount: event._count.reviews,
    isRegistered: userRegistration?.status === 'REGISTERED',
    isSaved: userSaved,
    registrationStatus: userRegistration?.status || null,
  }
  delete result._count

  res.json({ success: true, data: result })
})

// POST /api/events
const createEvent = asyncHandler(async (req, res) => {
  // Check user has organizer profile
  const organizer = await prisma.organizer.findUnique({
    where: { userId: req.user.id },
  })
  if (!organizer) {
    throw new AppError('You need an organizer profile to create events. Please create one first.', 403, 'NO_ORGANIZER_PROFILE')
  }

  const { skills, ...eventData } = req.body

  const startDt = new Date(eventData.startDateTime)
  const endDt = new Date(eventData.endDateTime)
  if (endDt <= startDt) {
    throw new AppError('End date/time must be after start date/time.', 400, 'INVALID_DATES')
  }

  // Create event
  const event = await prisma.event.create({
    data: {
      ...eventData,
      startDateTime: startDt,
      endDateTime: endDt,
      registrationDeadline: eventData.registrationDeadline ? new Date(eventData.registrationDeadline) : null,
      organizerId: organizer.id,
      status: 'DRAFT',
    },
  })

  // Add skills if provided
  if (skills && skills.length > 0) {
    const skillRecords = await Promise.all(
      skills.map((name) =>
        prisma.skill.upsert({
          where: { name: name.trim() },
          create: { name: name.trim() },
          update: {},
        })
      )
    )
    await prisma.eventSkill.createMany({
      data: skillRecords.map((s) => ({ eventId: event.id, skillId: s.id })),
      skipDuplicates: true,
    })
  }

  logger.info('Event created', { eventId: event.id, organizerId: organizer.id })

  res.status(201).json({
    success: true,
    data: { ...event, skills: skills || [] },
  })
})

// PATCH /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { organizer: true },
  })

  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')

  // Check ownership
  if (event.organizer.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only edit your own events.', 403, 'FORBIDDEN')
  }

  const { skills, ...updateData } = req.body

  // Track important changes for notifications
  const changes = []
  const notifyFields = ['startDateTime', 'endDateTime', 'location', 'city', 'isOnline', 'status']
  for (const field of notifyFields) {
    if (updateData[field] !== undefined && String(event[field]) !== String(updateData[field])) {
      changes.push({ field, old: String(event[field]), new: String(updateData[field]) })
    }
  }

  // Handle cancellation
  if (updateData.status === 'CANCELLED' && event.status !== 'CANCELLED') {
    changes.push({ field: 'status', old: event.status, new: 'CANCELLED' })
  }

  if (updateData.startDateTime) updateData.startDateTime = new Date(updateData.startDateTime)
  if (updateData.endDateTime) updateData.endDateTime = new Date(updateData.endDateTime)
  if (updateData.registrationDeadline) updateData.registrationDeadline = new Date(updateData.registrationDeadline)

  const updated = await prisma.event.update({
    where: { id: req.params.id },
    data: updateData,
  })

  // Update skills if provided
  if (skills !== undefined) {
    await prisma.eventSkill.deleteMany({ where: { eventId: event.id } })
    if (skills.length > 0) {
      const skillRecords = await Promise.all(
        skills.map((name) =>
          prisma.skill.upsert({
            where: { name: name.trim() },
            create: { name: name.trim() },
            update: {},
          })
        )
      )
      await prisma.eventSkill.createMany({
        data: skillRecords.map((s) => ({ eventId: event.id, skillId: s.id })),
        skipDuplicates: true,
      })
    }
  }

  // Record changes in history
  if (changes.length > 0) {
    await prisma.eventChangeHistory.createMany({
      data: changes.map((c) => ({
        eventId: event.id,
        changedById: req.user.id,
        changeType: `${c.field}_change`,
        fieldName: c.field,
        oldValue: c.old,
        newValue: c.new,
      })),
    })

    // Notify registered users if important changes
    const importantChange = changes.find((c) =>
      ['startDateTime', 'endDateTime', 'location', 'city', 'isOnline'].includes(c.field)
    )
    const isCancelled = changes.find((c) => c.field === 'status' && c.new === 'CANCELLED')

    if (importantChange || isCancelled) {
      const registrations = await prisma.eventRegistration.findMany({
        where: { eventId: event.id, status: 'REGISTERED' },
        select: { userId: true },
      })

      const notificationType = isCancelled ? 'EVENT_CANCELLED' : 'EVENT_UPDATED'
      const notificationTitle = isCancelled
        ? `Event Cancelled: ${event.title}`
        : `Event Updated: ${event.title}`
      const notificationMsg = isCancelled
        ? `Unfortunately, "${event.title}" has been cancelled.`
        : `The details for "${event.title}" have been updated. Please check the event page.`

      if (registrations.length > 0) {
        await prisma.notification.createMany({
          data: registrations.map((r) => ({
            userId: r.userId,
            type: notificationType,
            title: notificationTitle,
            message: notificationMsg,
            relatedEntityId: event.id,
            relatedEntityType: 'EVENT',
            actionUrl: `/events/${event.id}`,
          })),
        })
      }
    }
  }

  res.json({ success: true, data: updated })
})

// DELETE /api/events/:id (soft delete - archive)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { organizer: true },
  })

  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')

  if (event.organizer.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only delete your own events.', 403, 'FORBIDDEN')
  }

  // Soft delete - archive
  await prisma.event.update({
    where: { id: req.params.id },
    data: { status: 'ARCHIVED' },
  })

  res.json({ success: true, data: { message: 'Event archived successfully.' } })
})

// POST /api/events/:id/publish
const publishEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { organizer: true },
  })

  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')
  if (event.organizer.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('Forbidden.', 403, 'FORBIDDEN')
  }
  if (event.status === 'CANCELLED') {
    throw new AppError('Cannot publish a cancelled event.', 400, 'INVALID_STATUS')
  }

  const updated = await prisma.event.update({
    where: { id: req.params.id },
    data: { status: 'PUBLISHED' },
  })

  res.json({ success: true, data: updated })
})

// GET /api/events/:id/attendees
const getEventAttendees = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } })
  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId: req.params.id, status: 'REGISTERED' },
    include: {
      user: {
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
      },
    },
  })

  // Get connection statuses if logged in
  let connectionMap = {}
  if (req.user) {
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: req.user.id },
          { targetId: req.user.id },
        ],
      },
    })
    connections.forEach((c) => {
      const otherId = c.requesterId === req.user.id ? c.targetId : c.requesterId
      connectionMap[otherId] = c.status
    })
  }

  const attendees = registrations
    .filter((r) => {
      if (r.userId === req.user?.id) return true
      const profile = r.user?.profile
      if (!profile) return false
      // Respect privacy
      if (profile.attendanceVisibility === 'HIDDEN') return false
      if (profile.attendanceVisibility === 'CONNECTIONS_ONLY') {
        const connStatus = connectionMap[r.userId]
        return connStatus === 'ACCEPTED'
      }
      return true
    })
    .map((r) => {
      const profile = r.user?.profile
      const isOwner = r.userId === req.user?.id
      const connStatus = connectionMap[r.userId]

      return {
        id: r.user.id,
        firstName: r.user.firstName,
        lastName: r.user.lastName,
        profilePhoto: profile?.profilePhoto,
        jobTitle: profile?.jobTitle,
        college: profile?.collegeCompanyVisible || isOwner ? profile?.college : undefined,
        company: profile?.collegeCompanyVisible || isOwner ? profile?.company : undefined,
        skills: profile?.skillsVisible || isOwner ? profile?.skills?.map((s) => s.skill.name) : undefined,
        interests: profile?.interestsVisible || isOwner ? profile?.interests?.map((i) => i.interest.name) : undefined,
        networkingIntents: profile?.networkingIntentVisible || isOwner
          ? profile?.networkingIntents?.map((n) => n.intent.value)
          : undefined,
        lookingFor: profile?.lookingForVisible || isOwner
          ? profile?.lookingForItems?.map((l) => l.lookingForOption.value)
          : undefined,
        connectionStatus: req.user && r.userId !== req.user.id ? (connStatus || 'none') : undefined,
        isCurrentUser: r.userId === req.user?.id,
      }
    })

  res.json({ success: true, data: attendees })
})

// GET /api/events/:id/reviews
const getEventReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { eventId: req.params.id },
    include: {
      user: {
        include: {
          profile: { select: { profilePhoto: true, jobTitle: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  res.json({
    success: true,
    data: {
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        isEdited: r.isEdited,
        createdAt: r.createdAt,
        user: {
          id: r.user.id,
          firstName: r.user.firstName,
          lastName: r.user.lastName,
          profilePhoto: r.user.profile?.profilePhoto,
          jobTitle: r.user.profile?.jobTitle,
        },
      })),
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: reviews.length,
    },
  })
})

// POST /api/events/:id/reviews
const createReview = asyncHandler(async (req, res) => {
  const { rating, title, content } = req.body
  const eventId = req.params.id

  // Check event exists and is completed
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')

  const derived = getDerivedStatus(event)
  if (derived !== 'COMPLETED' && derived !== 'ONGOING') {
    throw new AppError('You can only review completed events.', 400, 'EVENT_NOT_COMPLETED')
  }

  // Check user attended or registered
  const registration = await prisma.eventRegistration.findUnique({
    where: { userId_eventId: { userId: req.user.id, eventId } },
  })
  if (!registration) {
    throw new AppError('You must be registered for an event to review it.', 403, 'NOT_REGISTERED')
  }

  // Check no duplicate review
  const existing = await prisma.review.findUnique({
    where: { eventId_userId: { eventId, userId: req.user.id } },
  })
  if (existing) {
    throw new AppError('You have already reviewed this event.', 409, 'DUPLICATE_REVIEW')
  }

  const review = await prisma.review.create({
    data: { eventId, userId: req.user.id, rating, title, content },
  })

  res.status(201).json({ success: true, data: review })
})

// PATCH /api/reviews/:id
const updateReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } })
  if (!review) throw new AppError('Review not found.', 404, 'NOT_FOUND')
  if (review.userId !== req.user.id) throw new AppError('You can only edit your own reviews.', 403, 'FORBIDDEN')

  const updated = await prisma.review.update({
    where: { id: req.params.id },
    data: { ...req.body, isEdited: true },
  })
  res.json({ success: true, data: updated })
})

// DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } })
  if (!review) throw new AppError('Review not found.', 404, 'NOT_FOUND')
  if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only delete your own reviews.', 403, 'FORBIDDEN')
  }
  await prisma.review.delete({ where: { id: req.params.id } })
  res.json({ success: true, data: { message: 'Review deleted.' } })
})

// POST /api/events/:id/register
const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: { where: { status: 'REGISTERED' } } } } },
  })

  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')
  if (event.status !== 'PUBLISHED') throw new AppError('This event is not accepting registrations.', 400, 'EVENT_NOT_PUBLISHED')

  const derived = getDerivedStatus(event)
  if (derived === 'COMPLETED' || derived === 'CANCELLED') {
    throw new AppError('Registration is closed for this event.', 400, 'REGISTRATION_CLOSED')
  }

  // Check capacity
  if (event.capacity && event._count.registrations >= event.capacity) {
    throw new AppError('This event is currently full.', 400, 'EVENT_CAPACITY_FULL')
  }

  // Check registration deadline
  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    throw new AppError('Registration deadline has passed.', 400, 'REGISTRATION_DEADLINE_PASSED')
  }

  // Check duplicate
  const existing = await prisma.eventRegistration.findUnique({
    where: { userId_eventId: { userId: req.user.id, eventId } },
  })

  if (existing) {
    if (existing.status === 'REGISTERED') {
      throw new AppError('You are already registered for this event.', 409, 'ALREADY_REGISTERED')
    }
    // Re-register if previously cancelled
    const updated = await prisma.eventRegistration.update({
      where: { userId_eventId: { userId: req.user.id, eventId } },
      data: { status: 'REGISTERED', cancelledAt: null, registeredAt: new Date() },
    })

    // Send notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: 'REGISTRATION_CONFIRMED',
        title: 'Registration Confirmed',
        message: `You are registered for "${event.title}"!`,
        relatedEntityId: eventId,
        relatedEntityType: 'EVENT',
        actionUrl: `/events/${eventId}`,
      },
    })

    return res.json({ success: true, data: updated })
  }

  // Use transaction for concurrent registration safety
  const registration = await prisma.$transaction(async (tx) => {
    // Double-check capacity inside transaction
    const count = await tx.eventRegistration.count({
      where: { eventId, status: 'REGISTERED' },
    })
    if (event.capacity && count >= event.capacity) {
      throw new AppError('This event is currently full.', 400, 'EVENT_CAPACITY_FULL')
    }

    const reg = await tx.eventRegistration.create({
      data: { userId: req.user.id, eventId, status: 'REGISTERED' },
    })

    await tx.notification.create({
      data: {
        userId: req.user.id,
        type: 'REGISTRATION_CONFIRMED',
        title: 'Registration Confirmed',
        message: `You are registered for "${event.title}"!`,
        relatedEntityId: eventId,
        relatedEntityType: 'EVENT',
        actionUrl: `/events/${eventId}`,
      },
    })

    return reg
  })

  logger.info('User registered for event', { userId: req.user.id, eventId })

  res.status(201).json({ success: true, data: registration })
})

// DELETE /api/events/:id/register
const cancelRegistration = asyncHandler(async (req, res) => {
  const eventId = req.params.id

  const registration = await prisma.eventRegistration.findUnique({
    where: { userId_eventId: { userId: req.user.id, eventId } },
  })

  if (!registration || registration.status === 'CANCELLED') {
    throw new AppError('You are not registered for this event.', 404, 'NOT_REGISTERED')
  }

  await prisma.eventRegistration.update({
    where: { userId_eventId: { userId: req.user.id, eventId } },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
  })

  res.json({ success: true, data: { message: 'Registration cancelled.' } })
})

// GET /api/events/:id/registration
const getRegistrationStatus = asyncHandler(async (req, res) => {
  const registration = await prisma.eventRegistration.findUnique({
    where: { userId_eventId: { userId: req.user.id, eventId: req.params.id } },
  })

  res.json({
    success: true,
    data: {
      isRegistered: registration?.status === 'REGISTERED',
      status: registration?.status || null,
      registeredAt: registration?.registeredAt || null,
    },
  })
})

// POST /api/events/:id/save
const saveEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id

  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')

  await prisma.savedEvent.upsert({
    where: { userId_eventId: { userId: req.user.id, eventId } },
    create: { userId: req.user.id, eventId },
    update: {},
  })

  res.json({ success: true, data: { message: 'Event saved.' } })
})

// DELETE /api/events/:id/save
const unsaveEvent = asyncHandler(async (req, res) => {
  await prisma.savedEvent.deleteMany({
    where: { userId: req.user.id, eventId: req.params.id },
  })
  res.json({ success: true, data: { message: 'Event removed from saved.' } })
})

// GET /api/events/saved
const getSavedEvents = asyncHandler(async (req, res) => {
  const saved = await prisma.savedEvent.findMany({
    where: { userId: req.user.id },
    include: {
      event: {
        include: {
          organizer: { select: { organizationName: true, logo: true } },
          skills: { include: { skill: true } },
          _count: { select: { registrations: { where: { status: 'REGISTERED' } } } },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  })

  res.json({
    success: true,
    data: saved.map((s) => ({
      ...s.event,
      derivedStatus: getDerivedStatus(s.event),
      skills: s.event.skills.map((sk) => sk.skill.name),
      registeredCount: s.event._count.registrations,
      isSaved: true,
      savedAt: s.savedAt,
    })),
  })
})

// GET /api/events/registered
const getRegisteredEvents = asyncHandler(async (req, res) => {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: req.user.id },
    include: {
      event: {
        include: {
          organizer: { select: { organizationName: true, logo: true } },
          skills: { include: { skill: true } },
          _count: { select: { registrations: { where: { status: 'REGISTERED' } } } },
        },
      },
    },
    orderBy: { registeredAt: 'desc' },
  })

  res.json({
    success: true,
    data: registrations.map((r) => ({
      ...r.event,
      derivedStatus: getDerivedStatus(r.event),
      skills: r.event.skills.map((sk) => sk.skill.name),
      registeredCount: r.event._count.registrations,
      registrationStatus: r.status,
      registeredAt: r.registeredAt,
    })),
  })
})

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  getEventAttendees,
  getEventReviews,
  createReview,
  updateReview,
  deleteReview,
  registerForEvent,
  cancelRegistration,
  getRegistrationStatus,
  saveEvent,
  unsaveEvent,
  getSavedEvents,
  getRegisteredEvents,
}
