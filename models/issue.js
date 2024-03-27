const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdData: String,
  status: String,
});

module.exports = mongoose.model("Issue", issueSchema);
