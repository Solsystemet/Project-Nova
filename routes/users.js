const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register", {
    title: "Register",
  });
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email });
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

router.get("/get-users", (req, res) => {
  const users = [];
  async function fillUsers() {
    // TODO: When workspaces are in DB use filter
    for await (const doc of User.find({})) {
      await users.push(doc.username);
    }

    //console.log(users);
    res.json(users);
    res.end();
  }
  fillUsers();
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res) => {
    res.redirect("/workspaces/69");
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
