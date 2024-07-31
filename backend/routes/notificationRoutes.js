const express = require('express');
const { protectRoute } = require('../milddleware/protectRoute.js');
const { createTestNotification, deleteNotifications, getNotifications , markAllNotificationsAsRead} = require('../controllers/notificationController.js');
const router = express.Router();

router.get('/', getNotifications);
router.delete('/', deleteNotifications);
router.post('/test-notification', protectRoute, createTestNotification);
router.patch('/mark-all-as-read', markAllNotificationsAsRead);


module.exports = router;
