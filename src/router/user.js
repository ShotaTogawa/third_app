const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const {
  updateProfile,
  currentUser,
  user,
  users,
  searchUsers,
  deleteUser
} = require('../controllers/user');

router.get('/user', authenticateToken, currentUser);
router.get('/user/:id', authenticateToken, user);
router.get('/users', authenticateToken, users);
router.get('/user-search', authenticateToken, searchUsers);
router.patch('/user/edit', authenticateToken, updateProfile);
router.delete('/user', authenticateToken, deleteUser);

module.exports = router;
