const express = require('express')
const router = express.Router()

const {
  getNetworkingIntentOptions, getLookingForOptions, getSkillOptions, getInterestOptions,
} = require('../controllers/usersController')

router.get('/networking-intents', getNetworkingIntentOptions)
router.get('/looking-for', getLookingForOptions)
router.get('/skills', getSkillOptions)
router.get('/interests', getInterestOptions)

module.exports = router
