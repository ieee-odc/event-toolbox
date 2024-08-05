const Notification = require("../models/notificationModel.js");

const getNotifications = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "Bad Request: No user ID provided" });
        }
        const notifications = await Notification.find({ to: userId })
            .populate({ path: "from", select: "fullName avatar" });
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ error: "Bad Request: No user ID provided" });
        }
        const result = await Notification.updateMany(
            { to: userId },
            { $set: { read: true } }
        );

        res.status(200).json({ message: 'All notifications marked as read', result });
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
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
module.exports = { getNotifications, markAllNotificationsAsRead, deleteNotifications };


