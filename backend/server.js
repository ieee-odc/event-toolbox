const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const socket = require("socket.io");

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: [
      "https://59e0-41-230-216-254.ngrok-free.app",
      "http://localhost:5173",
      "https://f2ac-41-230-216-254.ngrok-free.app",
      "https://secure-totally-doberman.ngrok-free.app",
    ],
  })
);

const allowedOrigins = [
  "https://59e0-41-230-216-254.ngrok-free.app",
  "http://localhost:5173",
  "https://f2ac-41-230-216-254.ngrok-free.app",
  "https://secure-totally-doberman.ngrok-free.app",
];

app.use(cors());

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");

app.use(express.static(buildPath));

// Connect to MongoDB
mongoose.connect(process.env.DBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
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

const NotificationRouter = require("./routes/NotificationRoutes");
router.use("/notification", NotificationRouter);

app.use("/api", router);

// Serve static files for frontend
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });
});

// Create server and socket.io
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (eventId) => {
    socket.join(eventId.toString());
  });

  socket.on("joinOrganizer", (organizerId) => {
    socket.join(organizerId.toString());
  });

  socket.on("addEventParticipant", async (data) => {
    const roomId = data.roomId.toString();
    io.to(roomId).emit("EventParticipantAdded", data.participant);
  });

  socket.on("create-notification", (data) => {
    const organizerId = data.organizerId;
    io.to(organizerId.toString()).emit("new-notification", data.notification);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

module.exports = app; // Export the Express app for testing
