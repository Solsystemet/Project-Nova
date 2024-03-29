const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.params.id);
  res.render("user/userLogin", {
    title: "Login",
  });
});
module.exports = router;
