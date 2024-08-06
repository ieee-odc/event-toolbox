const express = require("express");
const {
  deleteNotifications,
  getNotifications,
  markAllNotificationsAsRead,
  addNotification,
} = require("../controllers/NotificationController.js");
const router = express.Router();

router.get("/:userId", getNotifications);
router.post("/add", addNotification);
router.delete("/:id", deleteNotifications);
router.patch("/mark-all-as-read", markAllNotificationsAsRead);

module.exports = router;
