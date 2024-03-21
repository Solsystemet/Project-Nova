const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;

const staticPath = __dirname + "/public";

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(staticPath + "/html/Kanban.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new task", (value) => {
    console.log("New task With: " + value);

    io.emit("new task", value, uuidv4());
  });

  socket.on("drag ended", (curTask, bottomTask, curZoneID) => {
    console.log(curTask);
    console.log(bottomTask);
    console.log(curZoneID);
    io.emit("drag ended", curTask, bottomTask, curZoneID);
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
