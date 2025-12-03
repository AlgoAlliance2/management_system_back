const express = require('express');
const eventRouter = express.Router();
const eventController = require("../controllers/eventController");

eventRouter.post('/', eventController.createEvent); // Create
eventRouter.get('/', eventController.getAllEvents); // List & Filter
eventRouter.get('/:id', eventController.getEvent); // Details
eventRouter.patch('/:id', eventController.updateEvent); // Edit or Validate
eventRouter.delete('/:id', eventController.deleteEvent); // Delete

module.exports = eventRouter;