const express = require("express");
const router = express.Router();
const Workspace = require("../models/workspace.js");
const catchAsync = require("../utils/catchAsync");

// users
const User = require("../models/user.js");
const passport = require("passport");

// image processing and upload
const multer = require("multer");
const handleUpload = require("../cloudinary");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
});
const sharp = require("sharp");

router.get("/register", (req, res) => {
  res.render("users/register", {
    title: "Register",
    css: [
      "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css",
      "../css/circleCrop.css",
    ],
    js: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js",
      },
      { src: "../js/circleCrop.js" },
      { src: "../js/register.js", attributes: ["defer"] },
    ],
  });
});

router.post(
  "/register",
  upload.single("profilePicture"),
  catchAsync(async (req, res) => {
    const { x, y, width, height } = JSON.parse(req.body.cropperImageData);
    console.log(x, y, width, height);
    //crop image
    const buffer = await sharp(req.file.buffer)
      .extract({ left: x, top: y, width, height })
      .toBuffer();

    //upload image to cloudinary
    const b64 = Buffer.from(buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cloudflareResponse = await handleUpload(dataURI);
    console.log(cloudflareResponse.url);

    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
      profilePicture: {
        url: cloudflareResponse.url,
        filename: req.file.originalname,
      },
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return console.log(err);
      res.redirect("/workspaces");
    });
  })
);

router.get("/login", (req, res) => {
  res.render("users/login", {
    title: "Login",
  });
});

router.get("/get-users/:id", async (req, res) => {
  const users = [];
  const workspace = await Workspace.findById(req.params.id);
  await Promise.all(
    workspace.members.map(async (member) => {
      const user = await User.findById(member);
      console.log(user.username);
      users.push(user.username);
    })
  );

  console.log(users);
  res.json(users);
  res.end();
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
module.exports = router;
