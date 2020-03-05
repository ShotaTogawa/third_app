const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../controllers/auth')
const { updateProfile } = require('../controllers/user')

router.patch('/user/edit', authenticateToken, updateProfile)

module.exports = router
