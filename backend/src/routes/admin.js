const express = require('express')
const router = express.Router()

const {
  getUsers, updateUser, getAdminEvents, updateAdminEvent,
  getAdminOrganizers, verifyOrganizer, getReports, resolveReport, getStats,
} = require('../controllers/adminController')
const { authenticate, authorize } = require('../middleware/auth')

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'))

router.get('/stats', getStats)
router.get('/users', getUsers)
router.patch('/users/:id', updateUser)
router.get('/events', getAdminEvents)
router.patch('/events/:id', updateAdminEvent)
router.get('/organizers', getAdminOrganizers)
router.patch('/organizers/:id/verify', verifyOrganizer)
router.get('/reports', getReports)
router.patch('/reports/:id', resolveReport)

module.exports = router
