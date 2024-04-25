const Workspace = require("./models/workspace");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

module.exports.isWorkspaceMember = async (req, res, next) => {
  const workspaceID = req.params.id;
  const userID = req.user.id;
  console.log(workspaceID);
  try {
    const workspace = await Workspace.findById(workspaceID);

    if (!workspace.members.includes(userID)) {
      return res.status(403).send("You are not a member of this workspace");
    }
    next();
  } catch (error) {
    console.error("Error in isWorkspaceMember middleware:", error);
    res.status(500).send("Workspace not found");
  }
};
