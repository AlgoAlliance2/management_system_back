const Ticket = require('../models/Ticket');
const crypto = require('crypto'); // node module for random strings

exports.createTicket = async (req, res) => {
    try {
        const { studentId, eventId } = req.body;

        // Generate a random QR string
        const qrCodeData = crypto.randomBytes(16).toString('hex');

        const ticket = new Ticket({
            student: studentId,
            event: eventId,
            qrCode: qrCodeData
        });

        await ticket.save();
        res.status(200).json({ "message": "Registered successfully", "ticket": ticket });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStudentTickets = async (req, res) => {
    try {
        const { studentId } = req.params;
        // Join with Event to see event details in the ticket list
        const tickets = await Ticket.find({ student: studentId }).populate('event');
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
