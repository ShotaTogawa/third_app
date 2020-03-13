const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const { follow, unfollow } = require('../controllers/follow');

router.post('/follow/:userId', authenticateToken, follow);
router.delete('/unfollow/:userId', authenticateToken, unfollow);

module.exports = router;
