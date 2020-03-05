const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../controllers/auth')
const {
  updateProfile,
  getCurrentUser,
  getUsers,
  getSearchUsers,
  deleteUser
} = require('../controllers/user')

router.get('/user', authenticateToken, getCurrentUser)
router.get('/users', authenticateToken, getUsers)
router.get('/users/search', authenticateToken, getSearchUsers)
router.patch('/user/edit', authenticateToken, updateProfile)
router.delete('/user', authenticateToken, deleteUser)

module.exports = router
