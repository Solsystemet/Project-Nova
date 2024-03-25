const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  laneID: String,
});

module.exports = mongoose.model("Issue", issueSchema);
