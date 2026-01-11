const express = require('express');
const notificationRouter = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');


notificationRouter.get('/', authMiddleware.requireAuth, notificationController.getUserNotifications);
notificationRouter.patch('/:id/read', authMiddleware.requireAuth, notificationController.markAsRead);
notificationRouter.patch('/read-all', authMiddleware.requireAuth, notificationController.markAllAsRead);

module.exports = notificationRouter;