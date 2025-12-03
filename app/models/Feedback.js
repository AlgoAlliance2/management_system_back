const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: {type: String},
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
}, { versionKey: false });

module.exports = mongoose.model('Feedback', feedbackSchema);