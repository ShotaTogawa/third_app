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
  patchPhoto,
  deletePhoto
} = require("../controllers/photo");

router.get("/photo/:photoId", authenticateToken, getPhoto);
router.get("/my-photos", authenticateToken, getMyPhotos);
router.get("/my-photos/search", authenticateToken, getSearchMyPhotos);
router.get("/photos", authenticateToken, getPhotos);
router.get("/photos/search", authenticateToken, getSearchPhotos);
router.post("/photo", authenticateToken, postPhoto);
router.patch("/photo/:photoId", authenticateToken, patchPhoto);
router.delete("/photo/:photoId", authenticateToken, deletePhoto);
