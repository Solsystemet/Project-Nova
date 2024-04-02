const Issue = require("./models/issue.js");

module.exports = (socket, io) => {
  async function GetIssues() {
    const issues = await Issue.find();
    if (!issues) return;
    issues.forEach((issue) => {
      socket.emit("create board", issue.title, issue._id, issue.createdData);
    });
  }
  GetIssues();
  console.log("a user connected");

  socket.on("new task", (value, description, priority, label, assignee) => {
    console.log("New task With: " + value);
    const createDate = `Created at ${GetCurrentTime()}`;
    const issue = new Issue({
      title: value,
      description: description,
      createdData: createDate,
      label: label,
      assignee: assignee,
      priority: priority,
    });

    async function SaveIssue() {
      await issue.save();
    }
    SaveIssue();
    io.emit("new task", value, issue._id, createDate);
  });

  socket.on("drag ended", (curTask, bottomTask, curZoneID) => {
    console.log(curTask);
    console.log(bottomTask);
    console.log(curZoneID);
    io.emit("drag ended", curTask, bottomTask, curZoneID);
  });
};