const catchSocketAsync = require("./Utils/catchSocketAsync.js");
const Workspace = require("./models/workspace.js");
const User = require("./models/user.js");
const GetCurrentTime = require("./Utils/Dates.js");
const mongoose = require("mongoose");
module.exports = (socket, io) => {
  console.log("a user connected");

  socket.on(
    "init workspace",
    catchSocketAsync(socket, async (workspaceID) => {
      socket.join(workspaceID);

      const workspace = await Workspace.findById(workspaceID)
        .populate("members")
        .lean();
      console.log(workspace);
      if (!workspace) return;

      socket.emit("create board", workspace);
    })
  );

  socket.on(
    "new task",
    catchSocketAsync(
      socket,
      async (
        title,
        description,
        priority,
        labels,
        assignee,
        laneID,
        workspaceID
      ) => {
        const createDate = `Created at ${GetCurrentTime()}`;
        const issue = {
          title: title,
          description: description,
          createdData: createDate,
          assignee: assignee,
          priority: priority,
          status: laneID,
          labels: labels,
        };

        const workspace = await Workspace.findById(workspaceID);
        workspace.issues.push(issue);
        await workspace.save();
        io.to(workspaceID).emit(
          "new task",
          // Thank you Blach :)
          workspace.issues[workspace.issues.length - 1]._id,
          issue.title,
          issue.description,
          issue.createdData,
          issue.status,
          issue.labels,
          issue.assignee,
          issue.priority
        );
      }
    )
  );

  socket.on(
    "drag ended",
    catchSocketAsync(
      socket,
      async (curTask, bottomTask, curZoneID, workspaceID) => {
        const workspace = await Workspace.findById(workspaceID);
        const issue = workspace.issues.filter((issue) => issue._id == curTask);
        if (!issue) return;
        issue[0].status = curZoneID;
        workspace.save();
        io.to(workspaceID).emit("drag ended", curTask, bottomTask, curZoneID);
      }
    )
  );

  socket.on(
    "modify issue",
    catchSocketAsync(
      socket,
      async (
        id,
        title,
        description,
        priority,
        labels,
        assignee,
        workspaceID
      ) => {
        const workspace = await Workspace.findById(workspaceID);
        const issue = workspace.issues.filter((issue) => issue._id == id);
        const user = workspace.members.filter(
          (member) => member._id == assignee
        );
        if (!issue) return;

        if (title) issue[0].title = title;
        if (description) issue[0].description = description;
        if (priority) issue[0].priority = priority;
        if (labels) issue[0].labels = labels;
        if (user[0]._id) issue[0].assignee = user[0]._id;

        workspace.save();

        io.to(workspaceID).emit(
          "modify issue",
          id,
          title,
          description,
          priority,
          labels,
          user[0]._id
        );
      }
    )
  );
};
