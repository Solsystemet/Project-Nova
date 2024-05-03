// Settings for cloudinary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dvemlk9tg",
  api_key: "311233453821727",
  api_secret: "YoU9wumRTz9e8mE6A9MzQVdJeDQ",
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "ProjectNova/ProfilePictures",
  });
  return res;
}

module.exports = handleUpload;
