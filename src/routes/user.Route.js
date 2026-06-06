const express = require("express");
const authMiddleware = require("../middleware/auth.Middleware.js");
const upload = require("../middleware/upload.middleware.js");
const User = require("../models/userModel.js");

const {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  DeleteUser,
  loginUser,
  uploadProfile,
} = require("../controllers/user.Controller.js");
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

// 'image' is the name of the field sent from the frontend/Postman
router.post("/upload-profile", upload.single("image"), uploadProfile);  
module.exports = router;
