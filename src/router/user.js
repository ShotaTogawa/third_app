const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../controllers/auth");
const { updateProfile, getCurrentUser } = require("../controllers/user");

router.get("/user/:id", authenticateToken, getCurrentUser);
// router.get("/user", authenticateToken, getUsers);
router.patch("/user/edit", authenticateToken, updateProfile);
// router.delete("/user/:id", authenticateToken, deleteUser);

module.exports = router;
