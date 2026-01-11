const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['reminder', 'update', 'event', 'review_required', 'status_update'],
        required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    date: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Notification', notificationSchema);