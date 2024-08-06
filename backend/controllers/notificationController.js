const Counter = require("../models/CounterModel.js");
const Notification = require("../models/NotificationModel.js");

const addNotification = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalNotification" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    console.log(counter.seq);
    console.log(req.body);
    const newNotification = new Notification({ id: counter.seq, ...req.body });
    await newNotification.save();
    res.status(201).json({
      status: "success",
      message: "Added Notification",
      notification: newNotification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "Bad Request: No user ID provided" });
    }
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "fullName avatar",
    });
    res.status(200).json({
      message: "Retrieved notifications",
      notifications,
    });
  } catch (error) {
    console.log("Error in getNotifications controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "Bad Request: No user ID provided" });
    }
    const result = await Notification.updateMany(
      { to: userId },
      { $set: { read: true } }
    );

    res
      .status(200)
      .json({ message: "All notifications marked as read", result });
  } catch (error) {
    console.log("Error in markAllNotificationsAsRead controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports = {
  getNotifications,
  markAllNotificationsAsRead,
  deleteNotifications,
  addNotification,
};
