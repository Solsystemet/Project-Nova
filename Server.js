//Express
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { createServer } = require("node:http");
const server = createServer(app);
const { engine } = require("express-handlebars");
const session = require("express-session");
app.use(express.urlencoded({ extended: true }));
const ExpressError = require("./Utils/ExpressError.js");

//Passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

//Mongoose (MongoDB)
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect.js");
const MongoStore = require("connect-mongo");

//Socket.io (WebSockets)
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;
const socketManager = require("./socketManager.js");
const staticPath = __dirname + "/public";

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
});

//Models
const User = require("./models/user.js");

//Routers
const workspaces = require("./routes/workspaces.js");
const informationals = require("./routes/informationals.js");
const users = require("./routes/users.js");
const user = require("./models/user.js");

//cookies and sessions
app.use(express.static("public"));
app.use(cookieParser());

const dbUrl =
  "mongodb+srv://kasperschnejder:05080369420@cluster0.tqto0z0.mongodb.net/BoardDB?retryWrites=true&w=majority&appName=Cluster";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "thisShouldBeABetterSecret!",
  },
});

const sessionDaysTillExpire = 7;
const sessionConfig = {
  store,
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

// Runs no matter what route is called
app.use(async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.locals.currentUserUsername = req.user.username;
    res.locals.currentUserId = req.user.id;
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }

  next();
});

//Routes
app.use("/", informationals);
app.use("/", users);
app.use("/workspaces", workspaces);

//throws an error if no route is found
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

//Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  console.log(err);
  res.status(statusCode).render("error", { err });
});

// Connect to MongoDB
connectDB();

io.on("connection", (socket) => socketManager(socket, io));
