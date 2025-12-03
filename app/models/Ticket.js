const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    qrCode: { type: String, required: true },
    dateIssued: { type: Date, default: Date.now },
    isValid: { type: Boolean, default: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
}, { versionKey: false });

module.exports = mongoose.model('Ticket', ticketSchema);