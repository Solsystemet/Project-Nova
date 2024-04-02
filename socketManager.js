const Issue = require("./models/issue.js");
const GetCurrentTime = require("./utils/Dates.js");

module.exports = (socket, io) => {
  async function GetIssues() {
    const issues = await Issue.find();
    if (!issues) return;
    issues.forEach((issue) => {
      socket.emit(
        "create board",
        issue.title,
        issue._id,
        issue.createdData,
        issue.status
      );
    });
  }
  GetIssues();
  console.log("a user connected");

  socket.on(
    "new task",
    (value, description, priority, label, assignee, laneID) => {
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

      async function SaveIssue() {
        await issue.save();
      }
      SaveIssue();
      io.emit("new task", value, issue._id, createDate);
    }
  );

  socket.on("drag ended", (curTask, bottomTask, curZoneID) => {
    async function UpdateIssueStatus() {
      const issue = await Issue.findById(curTask);
      if (!issue) return;

      issue.status = curZoneID;
      issue.save();
    }
    UpdateIssueStatus();
    io.emit("drag ended", curTask, bottomTask, curZoneID);
  });
};
