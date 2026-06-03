const User = require("../models/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const { hashPassword } = require("../utils/hashPassword");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload.js");
// const errorHandler = require("../middleware/errorHandler");

// Create a new user-------------------------------------------------------------------
const createUser = async (req, res) => {
  try {
    const { name, phone, email, address, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      address,
    });
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Get all users------------------------------------------------------------------------
const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

// GET SINGLE USER------------------------------------------------------------------
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user",
      error: error.message,
    });
  }
};

// UPDATE USER ------------------------------------------------------------------
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

//Delete User ----------------------------------------------------------------
const DeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

//Login User ----------------------------------------------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken: token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in user",
      error: error.message,
    });
  }
};

// Upload Profile Image ----------------------------------------------------------------
 const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `/uploads/${req.file.filename}`,
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  DeleteUser,
  loginUser,
  uploadProfile,
};
