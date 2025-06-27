// middleware/upload.js
const multer = require("multer");
const storage = require("../cloudinary/cloudinary.storage");

const upload = multer({ storage: storage });

module.exports = upload;
