const crypto = require("crypto");
const User = require("../models/User");
const { sendResetPasswordEmail } = require("../utils/sendEmail");

// 1. User enters email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Save hashed token in DB (important for security)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // 4. Create reset link (frontend URL)
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // 5. Send email
    await sendResetPasswordEmail(user.email, user.name, resetLink);

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};