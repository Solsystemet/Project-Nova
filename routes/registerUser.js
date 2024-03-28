const express = require("express");
const User = require("../models/user.js");
const router = express.Router();

router.get("/:username/:password/:email", (req, res) => {
  const user = new User({
    username: req.params.username,
    password: req.params.password,
    email: req.params.email,
  });

  async function SaveUser() {
    await user.save();
  }
  SaveUser();
  res.cookie("username", req.params.username).send("cookie set"); //Sets username
});
module.exports = router;
