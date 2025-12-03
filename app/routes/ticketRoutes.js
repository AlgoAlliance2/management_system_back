const express = require('express');
const ticketRouter = express.Router();
const ticketController = require("../controllers/ticketController");

ticketRouter.post('/', ticketController.createTicket); // Register for event
ticketRouter.get('/student/:studentId', ticketController.getStudentTickets); // View my tickets

module.exports = ticketRouter;