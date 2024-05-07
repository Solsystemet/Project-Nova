const express = require("express");
const { isLoggedIn } = require("../middleware");
const Workspace = require("../models/workspace.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("informationals/home", {
    title: "Home",
    css: ["../css/home.css", "../css/navbar.css"],
    js: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js",
        attributes: ["defer"],
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js",
        attributes: ["defer"],
      },
      { src: "../js/homeAnimation.js", attributes: ["defer"] },
      { src: "../js/star-generator.js", attributes: ["defer"] },
    ],
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
