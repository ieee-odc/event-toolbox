const  Notification = require("../models/notificationModel.js");


// Static method to create a test notification
const createTestNotification = async (req, res) => {
    try {
        const userId = req.user_id; // Organizer's ID (authenticated user)
        console.log(userId);
        const notificationType = 'EventRegistration'; // Static notification type for testing
        const participantId ='66854bb54caee387c81e1740';

        // Create a static notification
        const newNotification = new Notification({
            from: participantId,
            to: userId, // This should be a number, not an ObjectId
            type: notificationType
            // message: "Test notification: A participant has registered for your event."
        });

        // Save the notification to the database
        await newNotification.save();

        // Send success response
        res.status(200).json({ message: "Test notification created successfully" });
    } catch (error) {
        console.log("Error in createTestNotification controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getNotifications = async (req, res) => {
    try {
        const userId = req.query.userId; // Extract userId from query parameter
        if (!userId) {
            return res.status(400).json({ error: "Bad Request: No user ID provided" });
        }

        console.log("This is the userId:", userId);

        // Fetch notifications for the user and populate the 'from' field with 'fullName' and 'avatar'
        const notifications = await Notification.find({ to: userId })
            .populate({ path: "from", select: "fullName avatar" }); // Populate additional fields if needed

        // Log the notifications data to see the user who sent each notification
        console.log("Notifications data:", notifications);

        // Mark notifications as read
        //await Notification.updateMany({ to: userId }, { read: true });

        // Send the notifications back in the response
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// server/controllers/notificationController.js

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.body.userId; // Extract userId from request body
        if (!userId) {
            return res.status(400).json({ error: "Bad Request: No user ID provided" });
        }

        console.log("Marking all notifications as read for user ID:", userId);

        // Update all notifications for the user to be marked as read
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






const deleteNotifications = async (req,res) => {
    try{
        const userId= req.user_id;
        await Notification.deleteMany({to: userId});
        res.status(200).json({message: "Notification deleted successfully"});

    }catch(error){
                console.log("Error in deleteNotifications controller :", error);
                res.status(500).json({error: "Internal serevr error"});
    }
};
module.exports = { getNotifications, markAllNotificationsAsRead, deleteNotifications, createTestNotification };


