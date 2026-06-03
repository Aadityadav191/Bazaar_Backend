// import cloudinary from "../config/cloudinary.js";
const cloudinary = require("../config/cloudinary.js");

const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath);

  return result;
};


module.exports = { uploadToCloudinary };