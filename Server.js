const express = require("express");
const app = express();
const port = 3000;

const staticPath = __dirname + "/public";

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(staticPath + "/html/Kanban.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
