const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
   console.log(req.params.id);
   res.render("workspaces/workspace", {
      title: "Workspace",
      css: ["../css/workspace.css"],
      js: [
         { src: "/socket.io/socket.io.js", attributes: ["defer"] },
         { src: "../js/socketAPI.js", attributes: ["defer"] },
         { src: "../js/drag.js", attributes: ["module", "defer"] },
         { src: "../js/popup.js", attributes: ["defer"] },
         { src: "../js/todo.js", attributes: ["defer"] },
      ],
   });
});
module.exports = router;
