const mongoose = require("mongoose");
const { envList } = require("../../utils/envUtils");

async function connectToDb() {
  try {
    await mongoose.connect(envList.MONGOURL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connection established");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    throw error;
  }
}

async function disconnectFromDb() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();
  console.log("MongoDB connection closed");
}

module.exports = { connectToDb, disconnectFromDb };
