const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect.js");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;
const staticPath = __dirname + "/public";

const Issue = require("./models/issue.js");

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
      socket.emit("create board", issue.title, issue._id);
    });
  }
  GetIssues();
  console.log("a user connected");

  socket.on("new task", (value) => {
    console.log("New task With: " + value);
    const issue = new Issue({ title: value });

    async function SaveIssue() {
      await issue.save();
    }
    SaveIssue();
    io.emit("new task", value, issue._id);
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
  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
});
