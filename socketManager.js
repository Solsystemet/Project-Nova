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
    async (
      value,
      description,
      priority,
      labels,
      assignee,
      laneID,
      workspaceID
    ) => {
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
      const workspace = await Workspace.findById(workspaceID);
      workspace.issues.push(issue);
      await workspace.save();
      io.emit("new task", value, issue._id, createDate);
    }
  );

  socket.on(
    "drag ended",
    async (curTask, bottomTask, curZoneID, workspaceID) => {
      const workspace = await Workspace.findById(workspaceID);
      const issue = workspace.issues.filter((issue) => issue._id == curTask);
      if (!issue) return;

      issue[0].status = curZoneID;
      workspace.save();

      io.emit("drag ended", curTask, bottomTask, curZoneID);
    }
  );
};
