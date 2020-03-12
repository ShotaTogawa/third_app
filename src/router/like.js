const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const { like, unlike, countLikes, createLike } = require('../controllers/like');

router.get('/like/:photoId', authenticateToken, like);
router.get('/likes/:photoId', authenticateToken, countLikes);
router.post('/like/:photoId', authenticateToken, createLike);
router.delete('/unlike/:photoId', authenticateToken, unlike);

module.exports = router;
