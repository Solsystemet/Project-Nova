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
        issue.priority,
        issue.labels,
        issue.assignee,
        issue.status
      );
    });
  });

  socket.on(
    "new task",
    (value, description, priority, labels, assignee, laneID, workspaceID) => {
      const createDate = `Created at ${GetCurrentTime()}`;
      const issue = new Issue({
        title: value,
        description: description,
        createdData: createDate,
        assignee: assignee,
        priority: priority,
        status: laneID,
        labels: labels,
      });
      async function SaveIssueToWorkspace() {
        const workspace = await Workspace.findById(workspaceID);
        workspace.issues.push(issue);
        await workspace.save();
      }
      SaveIssueToWorkspace();
      io.emit(
        "new task",
        value,
        issue._id,
        createDate,
        priority,
        labels,
        assignee
      );
    }
  );

  socket.on("drag ended", (curTask, bottomTask, curZoneID, workspaceID) => {
    async function UpdateIssueStatus() {
      const workspace = await Workspace.findById(workspaceID);
      const issue = workspace.issues.filter((issue) => issue._id == curTask);
      if (!issue) return;

      issue[0].status = curZoneID;
      workspace.save();
    }
    UpdateIssueStatus();
    io.emit("drag ended", curTask, bottomTask, curZoneID);
  });
};
