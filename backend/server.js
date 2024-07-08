const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
const path = require("path");
const helmet = require("helmet");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(helmet());

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");

app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "same-origin; allow-popups");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.static(buildPath));

mongoose.connect(process.env.DBURI);

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

const ParticipantRouter = require("./routes/ParticipantRoutes");
app.use("/participant", ParticipantRouter);

const ParticipantRouter = require("./routes/ParticipantRoutes");
app.use("/participant", ParticipantRouter);
const EventRouter = require("./routes/EventsRoutes");
app.use("/events", EventRouter);
const authRouter = require("./routes/authRoutes");
app.use("/auth", authRouter);

const WorkshopRouter = require("./routes/WorkshopRoutes");
app.use("/workshop", WorkshopRouter);

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html"),
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
    }
  );
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
