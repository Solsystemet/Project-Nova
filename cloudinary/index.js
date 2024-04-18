import { v2 as cloudinary } from "cloudinary";
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dvemlk9tg",
  api_key: "311233453821727",
  api_secret: "YoU9wumRTz9e8mE6A9MzQVdJeDQ",
});

const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ProjectNova",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  profilePictureStorage,
};
