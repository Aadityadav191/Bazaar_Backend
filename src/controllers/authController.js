const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const { hashPassword } = require("../utils/hashPassword.js");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const { sendWelcomeEmail } = require("../utils/sendEmail");
const { sendResetPasswordEmail } = require("../utils/sendEmail.js");
const logger = require("../config/logger");
const crypto = require("crypto");

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

//ForgetPassword Link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    // ------------------Generate token------------------
    // const resetToken = crypto.randomBytes(32).toString("hex");

    // ------------------Generate 6-digit numeric OTP string ------------------
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save hashed token in DB for security
    user.resetPasswordOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry

    await user.save();

    // 4. ---------------Create reset link-------------
    // Match your frontend routing choice. Using query parameters (?token=) is highly recommended!
    // const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    // const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    // 5. Send email
    await sendResetPasswordEmail(user.email, user.name, otp);

    res.status(200).json({
      success: true,
      message: "A 6-digit OTP code has been successfully sent to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const resetPassword = async (req, res) => {
  try {
    // const { token } = req.query; // Extracts the token from the ?token=XYZ query parameter
   const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res
        .status(400)
        .json({ message: "OTP and new password are required." });
    }

    // Hash incoming URL token to match against what's saved in the database
    // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Hash the incoming OTP to match it against database record
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Find user with matching token that hasn't expired yet
    const user = await User.findOne({
      email,
      resetPasswordOTP: hashedOTP,
      resetPasswordExpires: { $gt: Date.now() }, // Token expiration must be greater than current time
    });
  
    if (!user) {
      return res
        .status(400)
        .json({ message: "OTP is invalid or has expired." });
    }

    // Hash and update the new password using your utility function
    user.password = await hashPassword(password);

    // Clear the reset fields so the link can't be used again
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Password has been successfully updated!",
      });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  changePassword,
  loginUser,
  createUser,
};
