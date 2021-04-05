require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// API security
app.use(helmet());

// handle CORS Error
app.use(cors());

// MongoDB Connection Setup
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const mDb = mongoose.connection;
  mDb.on("open", () => {
    console.log("mongoDB is connected successfully");
  });
  mDb.on("error", (error) => {
    console.log(error);
  });

  // LOGGER
  app.use(morgan("tiny"));
}

// set body Parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const port = process.env.PORT || 3001;

// LOAD routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
// USE routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

// HANDLE error
const handleError = require("./src/utils/handleError");

app.use((req, res, next) => {
  const error = new Error("Resources is not found!!!");
  error.status = 404;

  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
