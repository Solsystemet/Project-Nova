const express = require("express");
const { isLoggedIn } = require("../middleware");
const Workspace = require("../models/workspace.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("informationals/home", {
    title: "Home",
    js: [{ src: "../js/workspace.js", attributes: ["defer"] }],
  });
});

router.post(
  "/",
  isLoggedIn,

  async (req, res) => {
    const { title } = req.body;

    const workspace = new Workspace({
      title: "title",
      date: "420/69",
      owner: req.user.id,
      members: [req.user.id],
    });

    await workspace.save();

    res.redirect(`workspaces/${workspace._id}`);
  }
);

router.get("/about", (req, res) => {
  res.render("informationals/about", {
    title: "About",
  });
});
router.get("/manifesto", (req, res) => {
  res.render("informationals/manifesto", {
    title: "Manifesto",
  });
});

module.exports = router;
