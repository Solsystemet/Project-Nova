const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.params.id);
  res.render("user/userRegister", {
    title: "Register",
    js: [{ src: "../js/UserService.js", attributes: ["defer"] }],
  });
});
module.exports = router;
