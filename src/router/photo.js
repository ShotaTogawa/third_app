const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/auth');
const {
  photo,
  myPhotos,
  searchMyPhotos,
  photos,
  searchPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto
} = require('../controllers/photo');
const { check, validationResult } = require('express-validator/check');

router.get('/photo/:photoId', authenticateToken, photo);
router.get('/my-photos', authenticateToken, myPhotos);
router.get('/my-photos/search', authenticateToken, searchMyPhotos);
router.get('/photos', authenticateToken, photos);
router.get('/photos/search', authenticateToken, searchPhotos);
router.post(
  '/photo',
  authenticateToken,
  [
    check('photoUrl')
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
  createPhoto
);
router.put('/photo/:photoId', authenticateToken, updatePhoto);
router.delete('/photo/:photoId', authenticateToken, deletePhoto);

module.exports = router;
