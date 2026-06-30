const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const { hashPassword } = require("../utils/hashPassword.js");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const logger = require("../config/logger");
const crypto = require("crypto");


// Get all users------------------------------------------------------------------------
const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    logger.info(`Retrieved ${users.length} users`);
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

// Upload Profile Image ----------------------------------------------------------------
const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
    const cloudinaryResult = await uploadToCloudinary(req.file.path);

    if (!cloudinaryResult) {
      return res.status(500).json({
        message:
          "Failed to store image asset into Cloudinary container system.",
      });
    }
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: cloudinaryResult.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  getAllUser,
  getSingleUser,
  updateUser,
  DeleteUser,
  uploadProfile,
};

