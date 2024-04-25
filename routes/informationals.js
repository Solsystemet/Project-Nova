const express = require("express");
const { isLoggedIn } = require("../middleware");
const Workspace = require("../models/workspace.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("informationals/home", {
    title: "Home",
    css: ["../css/home.css"],
    js: [{ src: "../js/isVisible.js", attributes: ["defer"] }],
  });
});

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
