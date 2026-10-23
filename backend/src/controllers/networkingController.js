const prisma = require('../config/prisma')
const { AppError, asyncHandler } = require('../middleware/errorHandler')

// POST /api/connections/:userId
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const targetId = req.params.userId
  const requesterId = req.user.id

  if (targetId === requesterId) {
    throw new AppError('You cannot connect with yourself.', 400, 'SELF_CONNECTION')
  }

  const target = await prisma.user.findUnique({ where: { id: targetId } })
  if (!target || !target.isActive) throw new AppError('User not found.', 404, 'NOT_FOUND')

  // Check for existing connection (either direction)
  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId, targetId },
        { requesterId: targetId, targetId: requesterId },
      ],
    },
  })

  if (existing) {
    if (existing.status === 'ACCEPTED') throw new AppError('You are already connected.', 409, 'ALREADY_CONNECTED')
    if (existing.status === 'PENDING') throw new AppError('A connection request already exists.', 409, 'REQUEST_EXISTS')
    if (existing.status === 'REJECTED' || existing.status === 'CANCELLED' || existing.status === 'REMOVED') {
      // Allow re-sending if previously rejected/cancelled/removed
      const updated = await prisma.connection.update({
        where: { id: existing.id },
        data: {
          status: 'PENDING',
          requesterId,
          targetId,
          message: req.body.message || null,
        },
      })

      await prisma.notification.create({
        data: {
          userId: targetId,
          type: 'CONNECTION_REQUEST',
          title: 'New Connection Request',
          message: `${req.user.firstName} ${req.user.lastName} wants to connect with you.`,
          relatedEntityId: requesterId,
          relatedEntityType: 'USER',
          actionUrl: '/networking',
        },
      })

      return res.json({ success: true, data: updated })
    }
  }

  const connection = await prisma.connection.create({
    data: {
      requesterId,
      targetId,
      status: 'PENDING',
      message: req.body.message || null,
    },
  })

  await prisma.notification.create({
    data: {
      userId: targetId,
      type: 'CONNECTION_REQUEST',
      title: 'New Connection Request',
      message: `${req.user.firstName} ${req.user.lastName} wants to connect with you.`,
      relatedEntityId: requesterId,
      relatedEntityType: 'USER',
      actionUrl: '/networking',
    },
  })

  res.status(201).json({ success: true, data: connection })
})

// GET /api/connections
const getConnections = asyncHandler(async (req, res) => {
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { requesterId: req.user.id, status: 'ACCEPTED' },
        { targetId: req.user.id, status: 'ACCEPTED' },
      ],
    },
    include: {
      requester: {
        include: {
          profile: {
            include: {
              skills: { include: { skill: true } },
            },
          },
        },
      },
      target: {
        include: {
          profile: {
            include: {
              skills: { include: { skill: true } },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const formatted = connections.map((c) => {
    const other = c.requesterId === req.user.id ? c.target : c.requester
    return {
      connectionId: c.id,
      connectedAt: c.updatedAt,
      user: {
        id: other.id,
        firstName: other.firstName,
        lastName: other.lastName,
        profilePhoto: other.profile?.profilePhoto,
        jobTitle: other.profile?.jobTitle,
        college: other.profile?.college,
        company: other.profile?.company,
        skills: other.profile?.skills?.map((s) => s.skill.name) || [],
      },
    }
  })

  res.json({ success: true, data: formatted })
})

// GET /api/connections/requests
const getConnectionRequests = asyncHandler(async (req, res) => {
  const [received, sent] = await Promise.all([
    prisma.connection.findMany({
      where: { targetId: req.user.id, status: 'PENDING' },
      include: {
        requester: {
          include: {
            profile: { select: { profilePhoto: true, jobTitle: true, college: true, company: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.connection.findMany({
      where: { requesterId: req.user.id, status: 'PENDING' },
      include: {
        target: {
          include: {
            profile: { select: { profilePhoto: true, jobTitle: true, college: true, company: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  res.json({
    success: true,
    data: {
      received: received.map((c) => ({
        id: c.id,
        message: c.message,
        createdAt: c.createdAt,
        from: {
          id: c.requester.id,
          firstName: c.requester.firstName,
          lastName: c.requester.lastName,
          ...c.requester.profile,
        },
      })),
      sent: sent.map((c) => ({
        id: c.id,
        message: c.message,
        createdAt: c.createdAt,
        to: {
          id: c.target.id,
          firstName: c.target.firstName,
          lastName: c.target.lastName,
          ...c.target.profile,
        },
      })),
    },
  })
})

// PATCH /api/connections/:id/accept
const acceptConnection = asyncHandler(async (req, res) => {
  const connection = await prisma.connection.findUnique({ where: { id: req.params.id } })
  if (!connection) throw new AppError('Connection request not found.', 404, 'NOT_FOUND')
  if (connection.targetId !== req.user.id) throw new AppError('Forbidden.', 403, 'FORBIDDEN')
  if (connection.status !== 'PENDING') throw new AppError('This request is no longer pending.', 400, 'INVALID_STATUS')

  const updated = await prisma.connection.update({
    where: { id: req.params.id },
    data: { status: 'ACCEPTED' },
  })

  // Notify requester
  await prisma.notification.create({
    data: {
      userId: connection.requesterId,
      type: 'CONNECTION_ACCEPTED',
      title: 'Connection Accepted',
      message: `${req.user.firstName} ${req.user.lastName} accepted your connection request!`,
      relatedEntityId: req.user.id,
      relatedEntityType: 'USER',
      actionUrl: `/people`,
    },
  })

  res.json({ success: true, data: updated })
})

// PATCH /api/connections/:id/reject
const rejectConnection = asyncHandler(async (req, res) => {
  const connection = await prisma.connection.findUnique({ where: { id: req.params.id } })
  if (!connection) throw new AppError('Connection request not found.', 404, 'NOT_FOUND')
  if (connection.targetId !== req.user.id) throw new AppError('Forbidden.', 403, 'FORBIDDEN')
  if (connection.status !== 'PENDING') throw new AppError('This request is no longer pending.', 400, 'INVALID_STATUS')

  const updated = await prisma.connection.update({
    where: { id: req.params.id },
    data: { status: 'REJECTED' },
  })

  res.json({ success: true, data: updated })
})

// DELETE /api/connections/:id
const removeConnection = asyncHandler(async (req, res) => {
  const connection = await prisma.connection.findUnique({ where: { id: req.params.id } })
  if (!connection) throw new AppError('Connection not found.', 404, 'NOT_FOUND')
  if (connection.requesterId !== req.user.id && connection.targetId !== req.user.id) {
    throw new AppError('Forbidden.', 403, 'FORBIDDEN')
  }

  await prisma.connection.update({
    where: { id: req.params.id },
    data: { status: connection.status === 'PENDING' ? 'CANCELLED' : 'REMOVED' },
  })

  res.json({ success: true, data: { message: 'Connection removed.' } })
})

// GET /api/networking/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
  const limit = Math.min(20, parseInt(req.query.limit) || 10)

  // Get current user's profile
  const currentUser = await prisma.user.findUnique({
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
    },
  })

  const myProfile = currentUser.profile
  const mySkills = myProfile?.skills?.map((s) => s.skill.name) || []
  const myInterests = myProfile?.interests?.map((i) => i.interest.name) || []
  const myLookingFor = myProfile?.lookingForItems?.map((l) => l.lookingForOption.value) || []
  const myCity = myProfile?.city
  const myCollege = myProfile?.college
  const myCompany = myProfile?.company

  // Get existing connections to exclude
  const existingConnections = await prisma.connection.findMany({
    where: {
      OR: [
        { requesterId: req.user.id },
        { targetId: req.user.id },
      ],
      status: { in: ['ACCEPTED', 'PENDING'] },
    },
  })
  const excludeIds = new Set([
    req.user.id,
    ...existingConnections.map((c) =>
      c.requesterId === req.user.id ? c.targetId : c.requesterId
    ),
  ])

  // Get current user's registered events
  const myRegistrations = await prisma.eventRegistration.findMany({
    where: { userId: req.user.id, status: 'REGISTERED' },
    select: { eventId: true },
  })
  const myEventIds = myRegistrations.map((r) => r.eventId)

  // Get all eligible users (not already connected, not private profile, active)
  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: Array.from(excludeIds) },
      isActive: true,
      profile: {
        profileVisibility: { not: 'PRIVATE' },
      },
    },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          lookingForItems: { include: { lookingForOption: true } },
          networkingIntents: { include: { intent: true } },
        },
      },
    },
    take: 200,
  })

  // Get registrations for same events
  const sameEventUsers = myEventIds.length > 0
    ? await prisma.eventRegistration.findMany({
        where: {
          eventId: { in: myEventIds },
          userId: { notIn: Array.from(excludeIds) },
          status: 'REGISTERED',
        },
        select: { userId: true, eventId: true },
      })
    : []

  const sameEventUserIds = new Set(sameEventUsers.map((r) => r.userId))

  // Score and rank candidates
  const scored = candidates.map((c) => {
    const profile = c.profile
    if (!profile) return null

    const theirSkills = profile.skills?.map((s) => s.skill.name) || []
    const theirInterests = profile.interests?.map((i) => i.interest.name) || []
    const theirLookingFor = profile.lookingForItems?.map((l) => l.lookingForOption.value) || []

    let score = 0
    const reasons = []

    // Common skills
    const commonSkills = mySkills.filter((s) => theirSkills.includes(s))
    if (commonSkills.length > 0) {
      score += Math.min(commonSkills.length * 2, 10)
      reasons.push(`You both have skills in ${commonSkills.slice(0, 2).join(' and ')}.`)
    }

    // Common interests
    const commonInterests = myInterests.filter((i) => theirInterests.includes(i))
    if (commonInterests.length > 0) {
      score += Math.min(commonInterests.length * 2, 10)
      reasons.push(`You are both interested in ${commonInterests.slice(0, 2).join(' and ')}.`)
    }

    // Same event
    if (sameEventUserIds.has(c.id)) {
      score += 8
      reasons.push('You are attending the same event.')
    }

    // Same college
    if (myCollege && profile.college && myCollege.toLowerCase() === profile.college.toLowerCase()) {
      score += 5
      reasons.push(`You both attend ${profile.college}.`)
    }

    // Same company
    if (myCompany && profile.company && myCompany.toLowerCase() === profile.company.toLowerCase()) {
      score += 5
      reasons.push(`You both work at ${profile.company}.`)
    }

    // Same city
    if (myCity && profile.city && myCity.toLowerCase() === profile.city.toLowerCase()) {
      score += 3
      reasons.push(`You are both in ${profile.city}.`)
    }

    // Complementary looking for
    const lookingForMatch = myLookingFor.some((l) => theirLookingFor.includes(l))
    if (lookingForMatch) {
      score += 4
      reasons.push('You have similar networking goals.')
    }

    if (score === 0) return null

    return {
      score,
      reason: reasons[0] || 'You may have common interests.',
      allReasons: reasons,
      user: {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        profilePhoto: profile.profilePhoto,
        jobTitle: profile.jobTitle,
        college: profile.collegeCompanyVisible ? profile.college : undefined,
        company: profile.collegeCompanyVisible ? profile.company : undefined,
        skills: profile.skillsVisible ? theirSkills.slice(0, 5) : undefined,
        interests: profile.interestsVisible ? theirInterests.slice(0, 5) : undefined,
        connectionStatus: 'none',
      },
    }
  }).filter(Boolean)

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  res.json({
    success: true,
    data: scored.slice(0, limit).map(({ user, reason, allReasons }) => ({
      user,
      reason,
      allReasons,
    })),
  })
})

// GET /api/connections/status/:userId
const getConnectionStatus = asyncHandler(async (req, res) => {
  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: req.user.id, targetId: req.params.userId },
        { requesterId: req.params.userId, targetId: req.user.id },
      ],
    },
  })

  if (!connection) {
    return res.json({ success: true, data: { status: 'none', connectionId: null } })
  }

  res.json({
    success: true,
    data: {
      status: connection.status.toLowerCase(),
      connectionId: connection.id,
      isRequester: connection.requesterId === req.user.id,
    },
  })
})

module.exports = {
  sendConnectionRequest,
  getConnections,
  getConnectionRequests,
  acceptConnection,
  rejectConnection,
  removeConnection,
  getRecommendations,
  getConnectionStatus,
}
