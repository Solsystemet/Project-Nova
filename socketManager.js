const Issue = require("./models/issue.js");
const Workspace = require("./models/workspace.js");
const GetCurrentTime = require("./utils/Dates.js");

module.exports = (socket, io) => {
  console.log("a user connected");

  socket.on("init workspace", async (workspaceID) => {
      console.log("Init workspace: " + workspaceID);
      const workspace = await Workspace.findById(workspaceID);
      if (!workspace) return;
      workspace.issues.forEach((issue) => {
        socket.emit(
          "create board",
          issue.title,
          issue._id,
          issue.createdData,
          issue.status
        );
      });
  });

  socket.on(
    "new task",
    (value, description, priority, label, assignee, laneID, workspaceID) => {
      console.log("New task With: " + value);
      const createDate = `Created at ${GetCurrentTime()}`;
      const issue = new Issue({
        title: value,
        description: description,
        createdData: createDate,
        label: label,
        assignee: assignee,
        priority: priority,
        status: laneID,
      });

      async function SaveIssueToWorkspace() {
        const workspace = await Workspace.findById(workspaceID);
        workspace.issues.push(issue);
        await workspace.save();
      }
      SaveIssueToWorkspace();
      io.emit("new task", value, issue._id, createDate);
    }
  );

  socket.on("drag ended", (curTask, bottomTask, curZoneID, workspaceID) => {
    async function UpdateIssueStatus() {
      const workspace = await Workspace.findById(workspaceID);
      const issue = workspace.issues.filter((issue) => (issue._id = curTask));
      console.log(issue);
      if (!issue) return;

      issue[0].status = curZoneID;
      console.log(curZoneID);
      workspace.save();
    }
    UpdateIssueStatus();
    io.emit("drag ended", curTask, bottomTask, curZoneID);
  });
};
