//Express
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { createServer } = require("node:http");
const server = createServer(app);
const { engine } = require("express-handlebars");
const session = require("express-session");
app.use(express.urlencoded({ extended: true }));

//Passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

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
const workspaces = require("./routes/workspaces.js");
const informationals = require("./routes/informationals.js");
const users = require("./routes/users.js");

//cookies and sessions
app.use(express.static("public"));
app.use(cookieParser());
const sessionDaysTillExpire = 7;
const sessionConfig = {
  secret: "thisShouldBeABetterSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * sessionDaysTillExpire,
  },
};
app.use(session(sessionConfig));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Template Engine initialization
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//Routes
app.use("/", informationals);
app.use("/", users);
app.use("/workspaces", workspaces);

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
