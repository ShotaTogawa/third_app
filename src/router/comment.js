const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const {
  comments,
  createComment,
  deleteComment,
  updateComment
} = require('../controllers/comment');
const { check, validationResult } = require('express-validator/check');

router.get('/comment/:photoId', authenticateToken, comments);
router.post(
  '/comment/:photoId',
  authenticateToken,
  [
    check('comment')
      .not()
      .isEmpty()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  createComment
);
router.put('/comment/:commentId', authenticateToken, updateComment);
router.delete('/comment/:commentId', authenticateToken, deleteComment);

module.exports = router;
