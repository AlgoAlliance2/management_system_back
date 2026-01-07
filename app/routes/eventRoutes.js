const express = require('express');
const eventRouter = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');


eventRouter.get('/approved', authMiddleware.optionalAuth, eventController.getApprovedEvents);
eventRouter.get('/', authMiddleware.requireAuth, eventController.getAllEvents);


eventRouter.post('/', authMiddleware.requireAuth, eventController.createEvent);// create a new event

eventRouter.post('/:id/attend', authMiddleware.requireAuth, eventController.toggleAttendance);// Lets a user join or leave an event’s attendee list
eventRouter.post('/:id/save', authMiddleware.requireAuth, eventController.toggleSave);// Lets a user save or unsave an event to their personal list

eventRouter.get('/:id', eventController.getEventById);

eventRouter.patch('/:id', authMiddleware.requireAuth, eventController.updateEvent);

eventRouter.delete('/:id', authMiddleware.requireAuth, eventController.deleteEvent);

eventRouter.post('/:id/comments', authMiddleware.requireAuth, eventController.addComment);// Add a comment to an event

eventRouter.post('/:id/approve', authMiddleware.requireAuth, eventController.approveEvent);// Approve a pending event
eventRouter.post('/:id/reject', authMiddleware.requireAuth, eventController.rejectEvent);// Reject a pending event

module.exports = eventRouter;