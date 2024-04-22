const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Workspace = require("../models/workspace.js");
const passport = require("passport");
const multer = require("multer");
const { profilePictureStorage } = require("../cloudinary");
const upload = multer({ profilePictureStorage });

router.get("/register", (req, res) => {
  res.render("users/register", {
    title: "Register",
  });
});

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.files);
  const user = new User({
    username,
    email,
    profilePicture: { url: req.file.path, filename: req.file.filename },
  });
  console.log(user);
  const registeredUser = await User.register(user, password);
  console.log(registeredUser);
  req.login(registeredUser, (err) => {
    if (err) return console.log(err);
    res.redirect("/workspaces/69");
  });
});

router.get("/login", (req, res) => {
  res.render("users/login", {
    title: "Login",
  });
});

router.get("/get-users/:id", async (req, res) => {
  const users = [];
  // TODO: When workspaces are in DB use filter
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
