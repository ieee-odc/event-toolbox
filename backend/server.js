const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const socket = require("socket.io");

app.use(bodyParser.json());
const path = require("path");
const helmet = require("helmet");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://59e0-41-230-216-254.ngrok-free.app",
  "http://localhost:5173",
  "https://f2ac-41-230-216-254.ngrok-free.app",
  "https://secure-totally-doberman.ngrok-free.app",
];

// Create a function to check if the origin is allowed

app.use(cors());
// app.use(helmet());

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");

// app.use((req, res, next) => {
//   res.header("Cross-Origin-Opener-Policy", "same-origin; allow-popups");
//   res.header("Cross-Origin-Embedder-Policy", "require-corp");
//   next();
// });

app.use(express.static(buildPath));

mongoose.connect(process.env.DBURI);

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

const router = express.Router();
const ParticipantRouter = require("./routes/ParticipantRoutes");
router.use("/participant", ParticipantRouter);
const EventRouter = require("./routes/EventsRoutes");
router.use("/events", EventRouter);
const authRouter = require("./routes/authRoutes");
router.use("/auth", authRouter);

const WorkshopRouter = require("./routes/WorkshopRoutes");
router.use("/workshop", WorkshopRouter);

const SpaceRouter = require("./routes/SpaceRoutes");
router.use("/space", SpaceRouter);

const FormRouter = require("./routes/FormRoutes");
router.use("/form", FormRouter);
const NotificationRouter = require("./routes/notificationRoutes");
app.use("/notification", NotificationRouter);

app.use("/api", router);
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

const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (eventId) => {
    socket.join(eventId.toString());
  });

  socket.on("addEventParticipant", async (data) => {
    const eventId = data.eventId;
    io.to(eventId.toString()).emit("EventParticipantAdded", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
