// config/cloudinary.storage.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.config");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "image_url", 
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = storage;
