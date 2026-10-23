const express = require('express')
const router = express.Router()

const {
  createOrganizer, getOrganizer, updateOrganizer, getMyOrganizer,
  getMyOrganizerEvents, getEventRegistrations, getOrganizerAnalytics,
  addEventResource, upsertCertificate,
} = require('../controllers/organizerController')
const { authenticate, authorize } = require('../middleware/auth')

router.post('/', authenticate, createOrganizer)
router.get('/me', authenticate, getMyOrganizer)
router.get('/me/events', authenticate, getMyOrganizerEvents)
router.get('/me/analytics', authenticate, getOrganizerAnalytics)
router.get('/me/events/:eventId/registrations', authenticate, getEventRegistrations)
router.post('/me/events/:eventId/resources', authenticate, addEventResource)
router.post('/me/events/:eventId/certificate', authenticate, upsertCertificate)
router.get('/:id', getOrganizer)
router.patch('/:id', authenticate, updateOrganizer)

module.exports = router
