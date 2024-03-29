//Express
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { createServer } = require("node:http");
const server = createServer(app);
const { engine } = require("express-handlebars");

//Mongoose (MongoDB)
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect.js");

//Socket.io (WebSockets)
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;
const staticPath = __dirname + "/public";
const GetCurrentTime = require("./utils/Dates.js");

//Models
const Issue = require("./models/issue.js");
const User = require("./models/user.js");

//Routers
const workspace = require("./routes/workspaces.js");
const informational = require("./routes/informational.js");
const userRgister = require("./routes/userRegister.js");
const userLogin = require("./routes/userLogin.js");
const registerUser = require("./routes/registerUser.js");

app.use(express.static("public"));
app.use(cookieParser());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/", informational);
app.use("/workspaces", workspace);
app.use("/register", userRgister);
app.use("/login", userLogin);
app.use("/register-user", registerUser);

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
  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
});

// Delete all issues in collection (only use after you have gotten greenlight from the group)
async function EmptyIssues() {
  await Issue.deleteMany({});
}
