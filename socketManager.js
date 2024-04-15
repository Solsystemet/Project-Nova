const Issue = require("./models/issue.js");
const Workspace = require("./models/workspace.js");
const GetCurrentTime = require("./utils/Dates.js");
const mongoose = require("mongoose");
module.exports = (socket, io) => {
  console.log("a user connected");

  socket.on("init workspace", async (workspaceID) => {
    console.log("Init workspace: " + workspaceID);
    const workspace = await Workspace.findById(workspaceID);
    if (!workspace) return;
    workspace.issues.forEach((issue) => {
      socket.emit(
        "create board",
        issue._id,
        issue.title,
        issue.description,
        issue.createdData,
        issue.status,
        issue.labels,
        issue.assignee,
        issue.priority
      );
    });
  });

  socket.on(
    "new task",
    (title, description, priority, labels, assignee, laneID, workspaceID) => {
      const createDate = `Created at ${GetCurrentTime()}`;
      const issue = new Issue({
        title: title,
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
        issue._id,
        issue.title,
        issue.description,
        issue.createdData,
        issue.status,
        issue.labels,
        issue.assignee,
        issue.priority
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

  socket.on(
    "modify issue",
    async (id, title, description, priority, labels, assignee, workspaceID) => {
      const workspace = await Workspace.findById(workspaceID);
      const issue = workspace.issues.filter((issue) => issue._id == id);
      if (!issue) return;

      console.log(title);
      issue[0].title = title;
      issue[0].description = description;
      issue[0].priority = priority;
      issue[0].labels = labels;
      issue[0].assignee = assignee;

      workspace.save();

      io.emit(
        "modify issue",
        id,
        title,
        description,
        priority,
        labels,
        assignee
      );
    }
  );
};
