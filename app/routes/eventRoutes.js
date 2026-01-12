const express = require('express');
const eventRouter = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');


eventRouter.get('/approved', authMiddleware.optionalAuth, eventController.getApprovedEvents);
eventRouter.get('/', authMiddleware.requireAuth, eventController.getAllEvents);


eventRouter.post('/', authMiddleware.requireAuth, eventController.createEvent);// crearea unui nou eveniment


eventRouter.get('/allAttending/:id', authMiddleware.requireAuth, eventController.getAllUsersAtending);

eventRouter.post('/:id/attend', authMiddleware.requireAuth, eventController.toggleAttendance);
eventRouter.post('/:id/save', authMiddleware.requireAuth, eventController.toggleSave);

eventRouter.get('/:id', eventController.getEventById);

eventRouter.patch('/:id', authMiddleware.requireAuth, eventController.updateEvent);

eventRouter.delete('/:id', authMiddleware.requireAuth, eventController.deleteEvent);

eventRouter.post('/:id/comments', authMiddleware.requireAuth, eventController.addComment);// Adauga un comentariu la un event

eventRouter.post('/:id/approve', authMiddleware.requireAuth, eventController.approveEvent);// Aprobarea unui eveniment
eventRouter.post('/:id/reject', authMiddleware.requireAuth, eventController.rejectEvent);// Refuzarea unui eveniment
eventRouter.post('/:id/resubmit', authMiddleware.requireAuth, eventController.resubmitEvent);// Retrimiterea unui eveniment

module.exports = eventRouter;