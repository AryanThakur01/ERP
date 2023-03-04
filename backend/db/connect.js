const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const connectDB = expressAsyncHandler(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DATABASE CONNECTED".green);
});

module.exports = { connectDB };
