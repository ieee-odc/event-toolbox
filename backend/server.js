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
app.use(cors({
  origin: [
    "https://59e0-41-230-216-254.ngrok-free.app",
    "http://localhost:5173",
    "https://f2ac-41-230-216-254.ngrok-free.app",
    "https://secure-totally-doberman.ngrok-free.app",
  ],
}));

// Static files
const buildPath = path.join(__dirname, "../frontend/dist");
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
router.use("/participant", require("./routes/ParticipantRoutes"));
router.use("/events", require("./routes/EventsRoutes"));
router.use("/auth", require("./routes/authRoutes"));
router.use("/workshop", require("./routes/WorkshopRoutes"));
router.use("/space", require("./routes/SpaceRoutes"));
router.use("/form", require("./routes/FormRoutes"));
router.use("/notification", require("./routes/NotificationRoutes"));
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

  socket.on("addEventParticipant", (data) => {
    io.to(data.roomId).emit("EventParticipantAdded", data.participant);
  });

  socket.on("create-notification", (data) => {
    io.to(data.organizerId.toString()).emit("new-notification", data.notification);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

module.exports = app; // Export the Express app for testing
