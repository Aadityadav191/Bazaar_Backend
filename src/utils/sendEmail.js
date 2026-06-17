const nodemailer = require("nodemailer");
const welcomeEmailTemplate = require("../../templates/welcomeEmail.js");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ---------------------- Send Welcome Email ------------------
const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Bazaar.com" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Bazaar.com - Your Account is Ready!",
      html: welcomeEmailTemplate(name, email),
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};



// ----------------------- Send Reset Password Email ------------------
const sendResetPasswordEmail = async (email, name, resetLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Bazaar.com",
    html: resetPasswordTemplate(name, resetLink),
  });
};


module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail
};