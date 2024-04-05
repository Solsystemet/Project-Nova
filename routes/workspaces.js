const express = require("express");
const { isLoggedIn } = require("../middleware");
const router = express.Router();

router.get("/:id", isLoggedIn, (req, res) => {
  console.log(req.params.id);
  console.log(req.user);
  res.render("workspaces/workspace", {
    title: "Workspace",
    css: ["../css/workspace.css"],
    workspaceID: req.params.id,
    js: [
      { src: "/socket.io/socket.io.js", attributes: ["defer"] },
      { src: "../js/socketAPI.js", attributes: ["defer"] },
      { src: "../js/drag.js", attributes: ["module", "defer"] },
      { src: "../js/popup.js", attributes: ["defer"] },
      { src: "../js/todo.js", attributes: ["defer"] },
      { src: "../js/userConnect.js", attributes: ["defer"] },
      { src: "../js/dropdownMultiple.js", attributes: ["defer"] },
    ],
  });
});

module.exports = router;
