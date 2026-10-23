const prisma = require('../config/prisma')
const { AppError, asyncHandler } = require('../middleware/errorHandler')

// Helper: get or create skill
const getOrCreateSkill = async (name) => {
  const normalized = name.trim()
  return prisma.skill.upsert({
    where: { name: normalized },
    create: { name: normalized },
    update: {},
  })
}

// Helper: get or create interest
const getOrCreateInterest = async (name) => {
  const normalized = name.trim()
  return prisma.interest.upsert({
    where: { name: normalized },
    create: { name: normalized },
    update: {},
  })
}

// Helper: format profile for response
const formatProfile = (user, currentUserId = null) => {
  const isOwner = currentUserId === user.id
  const profile = user.profile

  if (!profile) return null

  // Check privacy for non-owner
  if (!isOwner && profile.profileVisibility === 'PRIVATE') {
    return { id: user.id, name: `${user.firstName} ${user.lastName}`, isPrivate: true }
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: isOwner ? user.email : undefined,
    role: user.role,
    profilePhoto: profile.profilePhoto,
    about: profile.about,
    careerGoals: isOwner ? profile.careerGoals : undefined,
    jobTitle: profile.jobTitle,
    field: profile.field,
    location: profile.location,
    city: profile.city,
    website: profile.website,
    linkedinUrl: profile.linkedinUrl,
    githubUrl: profile.githubUrl,
    twitterUrl: profile.twitterUrl,
    experienceLevel: profile.experienceLevel,
    college: profile.collegeCompanyVisible || isOwner ? profile.college : undefined,
    company: profile.collegeCompanyVisible || isOwner ? profile.company : undefined,
    skills: (profile.skillsVisible || isOwner) && profile.skills
      ? profile.skills.map((s) => s.skill.name)
      : undefined,
    interests: (profile.interestsVisible || isOwner) && profile.interests
      ? profile.interests.map((i) => i.interest.name)
      : undefined,
    networkingIntents: (profile.networkingIntentVisible || isOwner) && profile.networkingIntents
      ? profile.networkingIntents.map((n) => ({ value: n.intent.value, label: n.intent.label }))
      : undefined,
    lookingFor: (profile.lookingForVisible || isOwner) && profile.lookingForItems
      ? profile.lookingForItems.map((l) => ({ value: l.lookingForOption.value, label: l.lookingForOption.label }))
      : undefined,
    privacy: isOwner ? {
      profileVisibility: profile.profileVisibility,
      skillsVisible: profile.skillsVisible,
      interestsVisible: profile.interestsVisible,
      collegeCompanyVisible: profile.collegeCompanyVisible,
      networkingIntentVisible: profile.networkingIntentVisible,
      lookingForVisible: profile.lookingForVisible,
      attendanceVisibility: profile.attendanceVisibility,
      connectionPreference: profile.connectionPreference,
    } : undefined,
    createdAt: user.createdAt,
  }
}

// GET /api/users/me
const getMyProfile = asyncHandler(async (req, res) => {
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

  if (!user) throw new AppError('User not found.', 404, 'NOT_FOUND')

  res.json({
    success: true,
    data: {
      ...formatProfile(user, req.user.id),
      organizer: user.organizer || null,
    },
  })
})

// PATCH /api/users/me
const updateMyProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, skills, interests, networkingIntents, lookingFor, ...profileData } = req.body

  // Update user first/last name if provided
  if (firstName || lastName) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
    })
  }

  // Get current profile
  const currentProfile = await prisma.profile.findUnique({
    where: { userId: req.user.id },
  })

  if (!currentProfile) throw new AppError('Profile not found.', 404, 'NOT_FOUND')

  // Handle skills update
  if (skills !== undefined) {
    // Delete existing skills
    await prisma.userSkill.deleteMany({ where: { profileId: currentProfile.id } })
    // Create new skills
    if (skills.length > 0) {
      const skillRecords = await Promise.all(skills.map(getOrCreateSkill))
      await prisma.userSkill.createMany({
        data: skillRecords.map((s) => ({ profileId: currentProfile.id, skillId: s.id })),
        skipDuplicates: true,
      })
    }
  }

  // Handle interests update
  if (interests !== undefined) {
    await prisma.userInterest.deleteMany({ where: { profileId: currentProfile.id } })
    if (interests.length > 0) {
      const interestRecords = await Promise.all(interests.map(getOrCreateInterest))
      await prisma.userInterest.createMany({
        data: interestRecords.map((i) => ({ profileId: currentProfile.id, interestId: i.id })),
        skipDuplicates: true,
      })
    }
  }

  // Handle networking intents
  if (networkingIntents !== undefined) {
    await prisma.userNetworkingIntent.deleteMany({ where: { profileId: currentProfile.id } })
    if (networkingIntents.length > 0) {
      const intents = await prisma.networkingIntentOption.findMany({
        where: { value: { in: networkingIntents } },
      })
      if (intents.length > 0) {
        await prisma.userNetworkingIntent.createMany({
          data: intents.map((i) => ({ profileId: currentProfile.id, intentId: i.id })),
          skipDuplicates: true,
        })
      }
    }
  }

  // Handle looking for
  if (lookingFor !== undefined) {
    await prisma.userLookingFor.deleteMany({ where: { profileId: currentProfile.id } })
    if (lookingFor.length > 0) {
      const options = await prisma.lookingForOption.findMany({
        where: { value: { in: lookingFor } },
      })
      if (options.length > 0) {
        await prisma.userLookingFor.createMany({
          data: options.map((o) => ({ profileId: currentProfile.id, lookingForId: o.id })),
          skipDuplicates: true,
        })
      }
    }
  }

  // Update profile fields
  const updateFields = {}
  const profileFields = ['profilePhoto', 'about', 'careerGoals', 'college', 'company', 'jobTitle', 'field', 'location', 'city', 'experienceLevel', 'website', 'linkedinUrl', 'githubUrl', 'twitterUrl']
  profileFields.forEach((f) => {
    if (profileData[f] !== undefined) updateFields[f] = profileData[f]
  })

  if (Object.keys(updateFields).length > 0) {
    await prisma.profile.update({
      where: { userId: req.user.id },
      data: updateFields,
    })
  }

  // Fetch and return updated profile
  const updated = await prisma.user.findUnique({
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

  res.json({
    success: true,
    data: formatProfile(updated, req.user.id),
  })
})

// PATCH /api/users/me/privacy
const updatePrivacy = asyncHandler(async (req, res) => {
  const privacyFields = ['profileVisibility', 'skillsVisible', 'interestsVisible', 'collegeCompanyVisible', 'networkingIntentVisible', 'lookingForVisible', 'attendanceVisibility', 'connectionPreference']
  const updateData = {}
  privacyFields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f]
  })

  await prisma.profile.update({
    where: { userId: req.user.id },
    data: updateData,
  })

  res.json({
    success: true,
    data: { message: 'Privacy settings updated.' },
  })
})

// GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
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

  if (!user || !user.isActive) throw new AppError('User not found.', 404, 'NOT_FOUND')

  const formatted = formatProfile(user, req.user?.id)

  res.json({
    success: true,
    data: formatted,
  })
})

// GET /api/users/me/saved-events
const getMySavedEvents = asyncHandler(async (req, res) => {
  const saved = await prisma.savedEvent.findMany({
    where: { userId: req.user.id },
    include: {
      event: {
        include: {
          organizer: { select: { organizationName: true, logo: true } },
          _count: { select: { registrations: true } },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  })

  res.json({
    success: true,
    data: saved.map((s) => ({
      ...s.event,
      savedAt: s.savedAt,
      registeredCount: s.event._count.registrations,
    })),
  })
})

// GET /api/users/me/registered-events
const getMyRegisteredEvents = asyncHandler(async (req, res) => {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: req.user.id },
    include: {
      event: {
        include: {
          organizer: { select: { organizationName: true, logo: true } },
          _count: { select: { registrations: true } },
        },
      },
    },
    orderBy: { registeredAt: 'desc' },
  })

  res.json({
    success: true,
    data: registrations.map((r) => ({
      ...r.event,
      registrationStatus: r.status,
      registeredAt: r.registeredAt,
      registeredCount: r.event._count.registrations,
    })),
  })
})

// GET /api/options/networking-intents
const getNetworkingIntentOptions = asyncHandler(async (req, res) => {
  const options = await prisma.networkingIntentOption.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  res.json({ success: true, data: options })
})

// GET /api/options/looking-for
const getLookingForOptions = asyncHandler(async (req, res) => {
  const options = await prisma.lookingForOption.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  res.json({ success: true, data: options })
})

// GET /api/options/skills
const getSkillOptions = asyncHandler(async (req, res) => {
  const { search } = req.query
  const skills = await prisma.skill.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    orderBy: { name: 'asc' },
    take: 50,
  })
  res.json({ success: true, data: skills.map((s) => s.name) })
})

// GET /api/options/interests
const getInterestOptions = asyncHandler(async (req, res) => {
  const { search } = req.query
  const interests = await prisma.interest.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    orderBy: { name: 'asc' },
    take: 50,
  })
  res.json({ success: true, data: interests.map((i) => i.name) })
})

module.exports = {
  getMyProfile,
  updateMyProfile,
  updatePrivacy,
  getUserById,
  getMySavedEvents,
  getMyRegisteredEvents,
  getNetworkingIntentOptions,
  getLookingForOptions,
  getSkillOptions,
  getInterestOptions,
}
