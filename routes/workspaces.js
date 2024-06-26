const express = require("express");
const { isLoggedIn, isWorkspaceMember } = require("../middleware");
const catchAsync = require("../Utils/catchAsync");
const User = require("../models/user");
const Workspace = require("../models/workspace");
const router = express.Router();

router.get(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id).populate("workspaces").lean();
    console.log(user);
    res.render("workspaces/index", {
      workspaces: user.workspaces,
      title: "Workspaces",
      css: [
        "../css/navbar.css",
        "../css/workspaceList.css",
        "../css/footer.css",
      ],
      js: [{ src: "../js/workspaceList.js", attributes: ["defer"] }],
    });
  })
);

router.post(
  "/",
  isLoggedIn,

  catchAsync(async (req, res) => {
    const { title } = req.body;
    console.log(req.body);
    const user = await User.findById(req.user.id);
    const workspace = new Workspace({
      title: title,
      date: "22/22",
      owner: req.user.id,
      members: [req.user.id],
    });

    await workspace.save();
    user.workspaces.push(workspace.id);
    await user.save();

    res.redirect(`workspaces/${workspace._id}`);
  })
);

router.get("/:id", isLoggedIn, isWorkspaceMember, (req, res) => {
  console.log(req.params.id);
  console.log(req.user);
  res.render("workspaces/workspace", {
    title: "Workspace",
    css: ["../css/workspace.css"],
    workspaceID: req.params.id,
    js: [
      { src: "/socket.io/socket.io.js", attributes: ["defer"] },
      { src: "../js/socketAPI.js", attributes: ["defer"] },
      { src: "../dataObjects/issue.js", attributes: ["defer"] },
      { src: "../js/drag.js", attributes: ["defer"] },
      { src: "../js/popup.js", attributes: ["defer"] },
      { src: "../js/todo.js", attributes: ["defer"] },
      { src: "../js/userConnect.js", attributes: ["defer"] },
      { src: "../js/dropdownMultiple.js", attributes: ["defer"] },
      { src: "../js/issueEdit.js", attributes: ["defer"] },
      { src: "../js/workspace.js", attributes: ["defer"] },
    ],
  });
});

module.exports = router;
