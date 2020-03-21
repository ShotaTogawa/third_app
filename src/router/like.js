const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const { like, unlike, createLike, favorites } = require('../controllers/like');

router.get('/like/:photoId', authenticateToken, like);
router.post('/like/:photoId', authenticateToken, createLike);
router.delete('/unlike/:photoId', authenticateToken, unlike);
router.get('/favorites', authenticateToken, favorites);

module.exports = router;
