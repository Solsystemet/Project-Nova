const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Workspace",
    },
  ],
  profilePicture: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
