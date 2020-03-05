const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../controllers/auth");
const {
  getPhoto,
  getMyPhotos,
  getSearchMyPhotos,
  getPhotos,
  getSearchPhotos,
  postPhoto,
  putPhoto,
  deletePhoto
} = require("../controllers/photo");

router.get("/photo/:photoId", authenticateToken, getPhoto);
router.get("/my-photos", authenticateToken, getMyPhotos);
router.get("/my-photos/search", authenticateToken, getSearchMyPhotos);
router.get("/photos", authenticateToken, getPhotos);
router.get("/photos/search", authenticateToken, getSearchPhotos);
router.post("/photo", authenticateToken, postPhoto);
router.put("/photo/:photoId", authenticateToken, putPhoto);
router.delete("/photo/:photoId", authenticateToken, deletePhoto);

module.exports = router;
