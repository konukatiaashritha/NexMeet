const prisma = require('../config/prisma')
const { AppError, asyncHandler } = require('../middleware/errorHandler')

// GET /api/events/:eventId/community
const getCommunity = asyncHandler(async (req, res) => {
  const { eventId } = req.params

  let community = await prisma.community.findUnique({
    where: { eventId },
    include: {
      event: { select: { title: true, status: true } },
      _count: { select: { posts: { where: { isDeleted: false } } } },
    },
  })

  if (!community) {
    // Auto-create community for published events
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')
    if (event.status !== 'PUBLISHED') throw new AppError('No community available for this event.', 404, 'NOT_FOUND')

    community = await prisma.community.create({
      data: {
        eventId,
        name: `${event.title} Community`,
        description: `Community for ${event.title}`,
      },
      include: {
        event: { select: { title: true, status: true } },
        _count: { select: { posts: { where: { isDeleted: false } } } },
      },
    })
  }

  res.json({
    success: true,
    data: {
      ...community,
      postCount: community._count.posts,
    },
  })
})

// GET /api/events/:eventId/community/posts
const getCommunityPosts = asyncHandler(async (req, res) => {
  const { eventId } = req.params
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, parseInt(req.query.limit) || 20)
  const skip = (page - 1) * limit

  const community = await prisma.community.findUnique({ where: { eventId } })
  if (!community) return res.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      where: { communityId: community.id, isDeleted: false },
      include: {
        author: {
          include: {
            profile: { select: { profilePhoto: true, jobTitle: true } },
          },
        },
        comments: {
          where: { isDeleted: false },
          include: {
            author: {
              include: {
                profile: { select: { profilePhoto: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { comments: { where: { isDeleted: false } } } },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.communityPost.count({ where: { communityId: community.id, isDeleted: false } }),
  ])

  res.json({
    success: true,
    data: posts.map((p) => ({
      ...p,
      commentCount: p._count.comments,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

// POST /api/events/:eventId/community/posts
const createPost = asyncHandler(async (req, res) => {
  const { eventId } = req.params

  // Get or create community
  let community = await prisma.community.findUnique({ where: { eventId } })
  if (!community) {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) throw new AppError('Event not found.', 404, 'NOT_FOUND')
    community = await prisma.community.create({
      data: { eventId, name: `${event.title} Community` },
    })
  }

  const post = await prisma.communityPost.create({
    data: {
      communityId: community.id,
      authorId: req.user.id,
      content: req.body.content,
    },
    include: {
      author: {
        include: {
          profile: { select: { profilePhoto: true, jobTitle: true } },
        },
      },
    },
  })

  res.status(201).json({ success: true, data: post })
})

// PATCH /api/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  const post = await prisma.communityPost.findUnique({ where: { id: req.params.id } })
  if (!post || post.isDeleted) throw new AppError('Post not found.', 404, 'NOT_FOUND')
  if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only edit your own posts.', 403, 'FORBIDDEN')
  }

  const updated = await prisma.communityPost.update({
    where: { id: req.params.id },
    data: { content: req.body.content, isEdited: true },
    include: {
      author: {
        include: {
          profile: { select: { profilePhoto: true, jobTitle: true } },
        },
      },
    },
  })

  res.json({ success: true, data: updated })
})

// DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await prisma.communityPost.findUnique({ where: { id: req.params.id } })
  if (!post || post.isDeleted) throw new AppError('Post not found.', 404, 'NOT_FOUND')
  if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only delete your own posts.', 403, 'FORBIDDEN')
  }

  await prisma.communityPost.update({
    where: { id: req.params.id },
    data: { isDeleted: true },
  })

  res.json({ success: true, data: { message: 'Post deleted.' } })
})

// POST /api/posts/:id/comments
const createComment = asyncHandler(async (req, res) => {
  const post = await prisma.communityPost.findUnique({ where: { id: req.params.id } })
  if (!post || post.isDeleted) throw new AppError('Post not found.', 404, 'NOT_FOUND')

  const comment = await prisma.communityComment.create({
    data: {
      postId: req.params.id,
      authorId: req.user.id,
      content: req.body.content,
    },
    include: {
      author: {
        include: {
          profile: { select: { profilePhoto: true, jobTitle: true } },
        },
      },
    },
  })

  res.status(201).json({ success: true, data: comment })
})

// DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await prisma.communityComment.findUnique({ where: { id: req.params.id } })
  if (!comment || comment.isDeleted) throw new AppError('Comment not found.', 404, 'NOT_FOUND')
  if (comment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You can only delete your own comments.', 403, 'FORBIDDEN')
  }

  await prisma.communityComment.update({
    where: { id: req.params.id },
    data: { isDeleted: true },
  })

  res.json({ success: true, data: { message: 'Comment deleted.' } })
})

// GET /api/communities
const getAllCommunities = asyncHandler(async (req, res) => {
  const communities = await prisma.community.findMany({
    where: { isActive: true },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          category: true,
          startDateTime: true,
          endDateTime: true,
          coverImage: true,
          status: true,
          organizer: { select: { organizationName: true } },
        },
      },
      _count: { select: { posts: { where: { isDeleted: false } } } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  })

  res.json({
    success: true,
    data: communities.map((c) => ({
      ...c,
      postCount: c._count.posts,
    })),
  })
})

module.exports = {
  getCommunity,
  getCommunityPosts,
  createPost,
  updatePost,
  deletePost,
  createComment,
  deleteComment,
  getAllCommunities,
}
