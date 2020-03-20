const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const {
  follow,
  unfollow,
  followers,
  followees
} = require('../controllers/follow');

router.post('/follow/:userId', authenticateToken, follow);
router.delete('/unfollow/:userId', authenticateToken, unfollow);
router.get('/follower', authenticateToken, followers);
router.get('/followee', authenticateToken, followees);

module.exports = router;
