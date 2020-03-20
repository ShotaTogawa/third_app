const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const {
  follow,
  unfollow,
  follower,
  followee
} = require('../controllers/follow');

router.post('/follow/:userId', authenticateToken, follow);
router.delete('/unfollow/:userId', authenticateToken, unfollow);
router.get('/follower', authenticateToken, follower);
router.get('/followee', authenticateToken, followee);

module.exports = router;
