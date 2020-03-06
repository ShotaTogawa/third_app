const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../controllers/auth')
const {
  photo,
  myPhotos,
  searchMyPhotos,
  photos,
  searchPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto
} = require('../controllers/photo')

router.get('/photo/:photoId', authenticateToken, photo)
router.get('/my-photos', authenticateToken, myPhotos)
router.get('/my-photos/search', authenticateToken, searchMyPhotos)
router.get('/photos', authenticateToken, photos)
router.get('/photos/search', authenticateToken, searchPhotos)
router.post('/photo', authenticateToken, createPhoto)
router.put('/photo/:photoId', authenticateToken, updatePhoto)
router.delete('/photo/:photoId', authenticateToken, deletePhoto)

module.exports = router
