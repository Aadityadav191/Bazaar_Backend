const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload.middleware.js");
const User = require("../models/userModel");

const {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  DeleteUser,
  loginUser,
  uploadProfile,
} = require("../controllers/userController");
const router = express.Router();

//Create User
router.post("/Signup", createUser);

//Get All User
router.get("/allUser", getAllUser);

//Get Single User
router.get("/:id", getSingleUser);

//Update User
router.put("/:id", authMiddleware, updateUser);

//Delete User
router.delete("/:id", authMiddleware, DeleteUser);

//Login User
router.post("/login", loginUser);
router.post("/upload-profile", upload.single("image"), uploadProfile);
module.exports = router;
