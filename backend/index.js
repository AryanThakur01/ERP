require("dotenv").config();
const express = require("express");
const app = express();
require("colors");

const { NotFoundMiddleware } = require("./middleware/not-found");
const { errorHandlerMiddleware } = require("./middleware/error-handler");
const { connectDB } = require("./db/connect");

app.use(express.json());

const userRoutes = require("./routes/user");
app.use("/api/v1/auth", userRoutes);
app.use(errorHandlerMiddleware);
app.use(NotFoundMiddleware);

const start = () => {
  app.listen(
    process.env.PORT,
    console.log("BACKEND PORT: ".green, process.env.PORT.blue)
  );
  connectDB();
};
start();
