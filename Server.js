const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect.js");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;
const staticPath = __dirname + "/public";
const GetCurrentTime = require("./Utils/Dates.js");

const Issue = require("./models/issue.js");
const User = require("./models/user.js");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(staticPath + "/html/Kanban.html");
});

// Connect to MongoDB
connectDB();

io.on("connection", (socket) => {
  async function GetIssues() {
    const issues = await Issue.find();
    if (!issues) return;
    issues.forEach((issue) => {
      socket.emit("create board", issue.title, issue._id, issue.createdData);
    });
  }
  GetIssues();
  console.log("a user connected");

  socket.on("new user", (username, password, email) => {
    const user = new User({
      username: username,
      password: password,
      email: email,
    });

    async function SaveUser() {
      await user.save();
    }
    SaveUser();
  });

  socket.on("new task", (value, description) => {
    console.log("New task With: " + value);
    const createDate = `Created at ${GetCurrentTime()}`;
    const issue = new Issue({
      title: value,
      description: description,
      createdData: createDate,
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
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  PrintGay();
  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
});

// Delete all issues in collection (only use after you have gotten greenlight from the group)
async function EmptyIssues() {
  await Issue.deleteMany({});
}

function PrintGay() {
  console.log("Gay");
}
