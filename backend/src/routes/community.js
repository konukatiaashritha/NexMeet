const express = require('express')
const router = express.Router({ mergeParams: true })

const {
  getCommunity, getCommunityPosts, createPost, updatePost, deletePost,
  createComment, deleteComment, getAllCommunities,
} = require('../controllers/communityController')
const { authenticate, optionalAuth } = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')

module.exports = router
