require("dotenv").config();
const express = require("express");
const app = express();
require("colors");

const { NotFoundMiddleware } = require("./middleware/not-found");

app.use(express.json());

const userRoutes = require("./routes/user");
app.use("/api/v1/auth", userRoutes);
app.use(NotFoundMiddleware);

const start = () => {
  app.listen(
    process.env.PORT,
    console.log("BACKEND PORT: ".blue, process.env.PORT.yellow)
  );
};
start();
