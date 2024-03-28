const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
   res.render("informational/home", {
      title: "Home",
   });
});
router.get("/about", (req, res) => {
   res.render("informational/about", {
      title: "About",
   });
});
router.get("/manifesto", (req, res) => {
   res.render("informational/manifesto", {
      title: "Manifesto",
   });
});

module.exports = router;
