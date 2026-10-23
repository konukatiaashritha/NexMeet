const express = require('express')
const router = express.Router()

const {
  sendConnectionRequest, getConnections, getConnectionRequests,
  acceptConnection, rejectConnection, removeConnection,
  getRecommendations, getConnectionStatus,
} = require('../controllers/networkingController')
const { authenticate } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

router.get('/', authenticate, getConnections)
router.get('/requests', authenticate, getConnectionRequests)
router.get('/recommendations', authenticate, getRecommendations)
router.get('/status/:userId', authenticate, getConnectionStatus)
router.post('/:userId', authenticate, validate(schemas.sendConnection), sendConnectionRequest)
router.patch('/:id/accept', authenticate, acceptConnection)
router.patch('/:id/reject', authenticate, rejectConnection)
router.delete('/:id', authenticate, removeConnection)

module.exports = router
