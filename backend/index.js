require("dotenv").config();
const express = require("express");
const app = express();
require("colors");

const { NotFoundMiddleware } = require("./middleware/not-found");
const { errorHandlerMiddleware } = require("./middleware/error-handler");
const { connectDB } = require("./db/connect");

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000/dashboard"],
    optionsSuccessStatus: 200,
  })
);

const userRoutes = require("./routes/user");
const studentAttendanceRoutes = require("./routes/attendance");
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/studentAttendance", studentAttendanceRoutes);
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
