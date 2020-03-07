const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const { getPresignedURL } = require('../controllers/upload');

router.get('/upload', authenticateToken, getPresignedURL);

module.exports = router;
