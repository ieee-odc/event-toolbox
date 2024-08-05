const express = require('express');
const { deleteNotifications, getNotifications, markAllNotificationsAsRead } = require('../controllers/notificationController.js');
const router = express.Router();

router.get('/', getNotifications);
router.delete('/:id', deleteNotifications);
router.patch('/mark-all-as-read', markAllNotificationsAsRead);


module.exports = router;
