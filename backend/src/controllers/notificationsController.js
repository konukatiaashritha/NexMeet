const prisma = require('../config/prisma')
const { asyncHandler } = require('../middleware/errorHandler')

// GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, parseInt(req.query.limit) || 20)
  const skip = (page - 1) * limit
  const unreadOnly = req.query.unread === 'true'

  const where = {
    userId: req.user.id,
    ...(unreadOnly ? { isRead: false } : {}),
  }

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: req.user.id, isRead: false } }),
  ])

  res.json({
    success: true,
    data: notifications,
    meta: { unreadCount },
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

// PATCH /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data: { isRead: true },
  })

  res.json({ success: true, data: { message: 'Notification marked as read.' } })
})

// PATCH /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, isRead: false },
    data: { isRead: true },
  })

  res.json({ success: true, data: { message: 'All notifications marked as read.' } })
})

// GET /api/notifications/unread-count
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await prisma.notification.count({
    where: { userId: req.user.id, isRead: false },
  })

  res.json({ success: true, data: { count } })
})

module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount }
