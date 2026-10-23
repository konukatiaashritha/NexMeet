const { z } = require('zod')
const { AppError } = require('./errorHandler')

// Middleware factory for request validation with Zod
const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed.',
          details: errors,
        },
      })
    }

    // Attach validated data back to request
    req.body = result.data.body || req.body
    req.validatedQuery = result.data.query || {}
    req.params = result.data.params || req.params
    next()
  } catch (err) {
    next(err)
  }
}

// Common Zod schemas
const schemas = {
  // Auth
  register: z.object({
    body: z.object({
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
      email: z.string().email(),
      password: z.string().min(8).max(100),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
  }),

  // Profile
  updateProfile: z.object({
    body: z.object({
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      profilePhoto: z.string().url().nullable().optional(),
      about: z.string().max(2000).nullable().optional(),
      careerGoals: z.string().max(1000).nullable().optional(),
      college: z.string().max(200).nullable().optional(),
      company: z.string().max(200).nullable().optional(),
      jobTitle: z.string().max(200).nullable().optional(),
      field: z.string().max(100).nullable().optional(),
      location: z.string().max(200).nullable().optional(),
      city: z.string().max(100).nullable().optional(),
      experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'all']).nullable().optional(),
      skills: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      networkingIntents: z.array(z.string()).optional(),
      lookingFor: z.array(z.string()).optional(),
      website: z.string().url().nullable().optional(),
      linkedinUrl: z.string().url().nullable().optional(),
      githubUrl: z.string().url().nullable().optional(),
      twitterUrl: z.string().url().nullable().optional(),
    }),
  }),

  // Privacy
  updatePrivacy: z.object({
    body: z.object({
      profileVisibility: z.enum(['PUBLIC', 'CONNECTIONS', 'PRIVATE']).optional(),
      skillsVisible: z.boolean().optional(),
      interestsVisible: z.boolean().optional(),
      collegeCompanyVisible: z.boolean().optional(),
      networkingIntentVisible: z.boolean().optional(),
      lookingForVisible: z.boolean().optional(),
      attendanceVisibility: z.enum(['VISIBLE', 'CONNECTIONS_ONLY', 'HIDDEN']).optional(),
      connectionPreference: z.enum(['ANYONE', 'SAME_INTERESTS', 'SAME_EVENTS', 'CONNECTIONS_OF_CONNECTIONS']).optional(),
    }),
  }),

  // Events
  createEvent: z.object({
    body: z.object({
      title: z.string().min(3).max(200),
      description: z.string().min(10),
      category: z.enum(['workshop', 'conference', 'seminar', 'meetup', 'hackathon', 'webinar', 'networking', 'career', 'startup', 'research', 'community', 'lecture', 'tech', 'company', 'college', 'other']),
      startDateTime: z.string().datetime(),
      endDateTime: z.string().datetime(),
      timezone: z.string().default('Asia/Kolkata'),
      location: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      area: z.string().nullable().optional(),
      isOnline: z.boolean().default(false),
      onlineUrl: z.string().url().nullable().optional(),
      capacity: z.number().int().positive().nullable().optional(),
      price: z.number().min(0).default(0),
      registrationDeadline: z.string().datetime().nullable().optional(),
      registrationUrl: z.string().url().nullable().optional(),
      experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'all']).default('all'),
      networkingAvailable: z.boolean().default(false),
      certificateAvailable: z.boolean().default(false),
      skills: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      coverImage: z.string().nullable().optional(),
    }),
  }),

  updateEvent: z.object({
    body: z.object({
      title: z.string().min(3).max(200).optional(),
      description: z.string().min(10).optional(),
      category: z.enum(['workshop', 'conference', 'seminar', 'meetup', 'hackathon', 'webinar', 'networking', 'career', 'startup', 'research', 'community', 'lecture', 'tech', 'company', 'college', 'other']).optional(),
      startDateTime: z.string().datetime().optional(),
      endDateTime: z.string().datetime().optional(),
      timezone: z.string().optional(),
      location: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      area: z.string().nullable().optional(),
      isOnline: z.boolean().optional(),
      onlineUrl: z.string().url().nullable().optional(),
      capacity: z.number().int().positive().nullable().optional(),
      price: z.number().min(0).optional(),
      registrationDeadline: z.string().datetime().nullable().optional(),
      registrationUrl: z.string().url().nullable().optional(),
      experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'all']).optional(),
      networkingAvailable: z.boolean().optional(),
      certificateAvailable: z.boolean().optional(),
      skills: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      coverImage: z.string().nullable().optional(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'ARCHIVED']).optional(),
    }),
  }),

  // Events query
  eventsQuery: z.object({
    query: z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      online: z.enum(['true', 'false']).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      price: z.enum(['free', 'paid']).optional(),
      skill: z.string().optional(),
      experienceLevel: z.string().optional(),
      networkingAvailable: z.enum(['true', 'false']).optional(),
      certificateAvailable: z.enum(['true', 'false']).optional(),
      organizer: z.string().optional(),
      status: z.string().optional(),
      page: z.string().optional().transform((v) => (v ? parseInt(v) : 1)),
      limit: z.string().optional().transform((v) => (v ? Math.min(parseInt(v), 100) : 20)),
      sort: z.enum(['newest', 'oldest', 'startDate', 'price_asc', 'price_desc', 'popular']).optional().default('startDate'),
    }),
  }),

  // Reviews
  createReview: z.object({
    body: z.object({
      rating: z.number().int().min(1).max(5),
      title: z.string().max(200).optional(),
      content: z.string().max(2000).optional(),
    }),
  }),

  // Community
  createPost: z.object({
    body: z.object({
      content: z.string().min(1).max(5000),
    }),
  }),

  createComment: z.object({
    body: z.object({
      content: z.string().min(1).max(2000),
    }),
  }),

  // Connection
  sendConnection: z.object({
    body: z.object({
      message: z.string().max(500).optional(),
    }),
  }),

  // Report
  createReport: z.object({
    body: z.object({
      targetType: z.enum(['USER', 'EVENT', 'COMMUNITY_POST', 'COMMENT']),
      targetId: z.string(),
      reason: z.string().min(5).max(200),
      description: z.string().max(1000).optional(),
    }),
  }),
}

module.exports = { validate, schemas }
