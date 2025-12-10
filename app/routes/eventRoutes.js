const express = require('express');
const eventRouter = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

eventRouter.get('/', authMiddleware.optionalAuth, eventController.getAllEvents);// get all events allows userId=null 
eventRouter.post('/', authMiddleware.requireAuth, eventController.createEvent);// create a new event

eventRouter.post('/:id/attend', authMiddleware.requireAuth, eventController.toggleAttendance);// Lets a user join or leave an event’s attendee list
eventRouter.post('/:id/save', authMiddleware.requireAuth, eventController.toggleSave);// Lets a user save or unsave an event to their personal list

module.exports = eventRouter;