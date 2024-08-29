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

app.use(cors());

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");

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

const OrganizerRouter = require("./routes/OrganizerRoutes");
router.use("/organizers", OrganizerRouter);

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
