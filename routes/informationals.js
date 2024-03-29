const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("informationals/home", {
    title: "Home",
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
