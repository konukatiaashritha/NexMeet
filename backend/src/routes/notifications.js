const express = require('express')
const router = express.Router()

const { getNotifications, markAsRead, markAllAsRead, getUnreadCount } = require('../controllers/notificationsController')
const { authenticate } = require('../middleware/auth')

router.get('/', authenticate, getNotifications)
router.get('/unread-count', authenticate, getUnreadCount)
router.patch('/read-all', authenticate, markAllAsRead)
router.patch('/:id/read', authenticate, markAsRead)

module.exports = router
