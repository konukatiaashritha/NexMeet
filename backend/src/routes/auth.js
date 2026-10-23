const express = require('express')
const router = express.Router()

const { register, login, logout, getCurrentUser } = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

router.post('/register', validate(schemas.register), register)
router.post('/login', validate(schemas.login), login)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getCurrentUser)

module.exports = router
