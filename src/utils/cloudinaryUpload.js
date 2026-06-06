const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "users",
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  uploadToCloudinary,
};
