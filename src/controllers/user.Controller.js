const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const { hashPassword } = require("../utils/hashPassword.js");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const { sendWelcomeEmail } = require("../utils/sendEmail");
const logger = require("../config/logger");

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
    logger.info(`User created successfully: ${email}`);
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        profilePicture: user.profilePicture,
      },
    });

    //Send Email to alert account creation
    setTimeout(() => {
      sendWelcomeEmail(user.email, user.name).catch((err) =>
        console.error(err),
      );
    }, 10000);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
    logger.error(`Error creating user: ${error.message}`);
  }
};

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

//Login User ----------------------------------------------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // email = email.toLowerCase().trim();
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.warn(`Login failed: User not found (${email})`);
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    logger.warn(`Failed login attempt for email: ${email}`);
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

// Change Password ----------------------------------------------------------------
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Both oldPassword and newPassword fields are strictly required parameters.",
      });
    }
    const user = await User.findById(req.params.id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(500).json({
        success: false,
        message:
          "The target database user record is missing a valid password hash field.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
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
  changePassword,
};
