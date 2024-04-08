const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdData: String,
  status: String,
  labels: [String],
  assignee: String,
  priority: String,
});

const workspaceSchema = new mongoose.Schema({
  title: String,
  date: String,
  owner: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
  ],
  issues: [issueSchema],
});

module.exports = mongoose.model("Workspace", workspaceSchema);
