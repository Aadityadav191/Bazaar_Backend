const express = require("express");
const authMiddleware = require("../middleware/auth.Middleware.js");
const upload = require("../middleware/upload.middleware.js");
const User = require("../models/userModel.js");

const {
  getAllUser,
  getSingleUser,
  updateUser,
  DeleteUser,
  uploadProfile,
} = require("../controllers/user.Controller.js");
const {
  createUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController.js");

const router = express.Router();

// ==========================================
// 1. STRICTLY PUBLIC STATIC ROUTES (Put these FIRST)
// ==========================================
router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword); // Now safe from being hijacked
router.post("/reset-password", resetPassword);

// ==========================================
// 2. PUBLIC DYNAMIC ROUTES (Put these NEXT)
// ==========================================
router.get("/allUser", getAllUser);
router.post("/upload-profile", upload.single("ProfilePic"), uploadProfile);
router.get("/:id", getSingleUser); // Moved down so it doesn't intercept "/forgot-password"

// ==========================================
// 3. PROTECTED ROUTES (Require authMiddleware)
// ==========================================
router.put("/change-password/:id", authMiddleware, changePassword); // Secured!
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, DeleteUser);

module.exports = router;