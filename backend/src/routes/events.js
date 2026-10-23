const express = require('express')
const router = express.Router()

const {
  getEvents, getEventById, createEvent, updateEvent, deleteEvent, publishEvent,
  getEventAttendees, getEventReviews, createReview, updateReview, deleteReview,
  registerForEvent, cancelRegistration, getRegistrationStatus,
  saveEvent, unsaveEvent, getSavedEvents, getRegisteredEvents,
} = require('../controllers/eventsController')
const { authenticate, optionalAuth, authorize } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

// Event listing & details
router.get('/', optionalAuth, getEvents)
router.get('/saved', authenticate, getSavedEvents)
router.get('/registered', authenticate, getRegisteredEvents)
router.get('/:id', optionalAuth, getEventById)

// Event CRUD (organizers/admins)
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(schemas.createEvent), createEvent)
router.patch('/:id', authenticate, validate(schemas.updateEvent), updateEvent)
router.delete('/:id', authenticate, deleteEvent)
router.post('/:id/publish', authenticate, publishEvent)

// Attendees
router.get('/:id/attendees', optionalAuth, getEventAttendees)

// Registration
router.post('/:id/register', authenticate, registerForEvent)
router.delete('/:id/register', authenticate, cancelRegistration)
router.get('/:id/registration', authenticate, getRegistrationStatus)

// Save/unsave
router.post('/:id/save', authenticate, saveEvent)
router.delete('/:id/save', authenticate, unsaveEvent)

// Reviews
router.get('/:id/reviews', getEventReviews)
router.post('/:id/reviews', authenticate, validate(schemas.createReview), createReview)
router.patch('/reviews/:id', authenticate, updateReview)
router.delete('/reviews/:id', authenticate, deleteReview)

module.exports = router
