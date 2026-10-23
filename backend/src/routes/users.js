const express = require('express')
const router = express.Router()

const {
  getMyProfile, updateMyProfile, updatePrivacy, getUserById,
  getMySavedEvents, getMyRegisteredEvents,
} = require('../controllers/usersController')
const { authenticate, optionalAuth } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

router.get('/me', authenticate, getMyProfile)
router.patch('/me', authenticate, validate(schemas.updateProfile), updateMyProfile)
router.patch('/me/privacy', authenticate, validate(schemas.updatePrivacy), updatePrivacy)
router.get('/me/saved-events', authenticate, getMySavedEvents)
router.get('/me/registered-events', authenticate, getMyRegisteredEvents)
router.get('/:id', optionalAuth, getUserById)

module.exports = router
