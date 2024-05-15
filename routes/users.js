const express = require("express");
const router = express.Router();
const Workspace = require("../models/workspace.js");
const catchAsync = require("../Utils/catchAsync");

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

router.get("/search-users/:filter", async (req, res) => {
  const users = [];
  const usersDB = await (
    await User.find().where("username")
  ).filter((user) => user.username.includes(req.params.filter));

  console.log(usersDB);
  usersDB.forEach((user) => {
    users.push(user.username);
  });

  res.json(users);
  res.end();
});
router.put("/share-workspace/:workspaceID/:usernames", async (req, res) => {
  console.log(req.params.usernames);
  let users = [];
  const workspace = await Workspace.findById(req.params.workspaceID);
  if (req.params.usernames.includes(",")) {
    let usernames = req.params.usernames.split(",");
    usernames.forEach(async (username) => {
      const user = await User.findOne({ username: username }).exec();

      if (!user.workspaces.includes(workspace._id)) {
        user.workspaces.push(workspace._id);
        workspace.members.push(user._id);
        users.push(user);
        await user.save();
      }
    });
  } else {
    const user = await User.findOne({ username: req.params.usernames }).exec();

    if (!user.workspaces.includes(workspace._id)) {
      user.workspaces.push(workspace._id);
      workspace.members.push(user._id);

      users.push(user);
      await user.save();
    }
  }

  await workspace.save();
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
