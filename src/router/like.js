const express = require('express');
const router = express.Router();
const { like, unlike, countLikes, createLike } = require('../controllers/like');

router.get('/like', like);
router.get('/likes', countLikes);
router.post('/like', createLike);
router.delete('/unlike', unlike);

module.exports = router;
