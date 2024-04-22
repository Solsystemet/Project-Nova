const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Workspace = require("../models/workspace.js");
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
  const workspace = await Workspace.findById(req.params.workspaceID);
  if (req.params.usernames.includes(",")) {
    let usernames = req.params.usernames.split(",");
    usernames.forEach(async (username) => {
      const user = await User.findOne({ username: username }).exec();

      if (!user.workspaces.includes(workspace._id)) {
        user.workspaces.push(workspace._id);
        workspace.members.push(user._id);
        await user.save();
      }
    });
  } else {
    const user = await User.findOne({ username: req.params.usernames }).exec();

    if (!user.workspaces.includes(workspace._id)) {
      user.workspaces.push(workspace._id);
      workspace.members.push(user._id);
      await user.save();
    }
  }

  await workspace.save();
  res.json("gey");
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
