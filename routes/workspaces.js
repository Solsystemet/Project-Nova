const express = require("express");
const router = express.Router();

//<link rel="stylesheet" href="../css/Kanban.css" />
//<script src="/socket.io/socket.io.js" defer></script>
//  <script src="../js/socketAPI.js" defer></script>
//  <script src="../js/drag.js" defer></script>
//  <script src="../js/popup.js" module defer></script>
//  <script src="../js/todo.js" defer></script>

router.get("/", (req, res) => {
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
