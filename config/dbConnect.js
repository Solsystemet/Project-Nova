const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kasperschnejder:05080369420@cluster0.tqto0z0.mongodb.net/BoardDB?retryWrites=true&w=majority&appName=Cluster0",
      {
        serverSelectionTimeoutMS: 30000, // Increase the timeout
      }
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
