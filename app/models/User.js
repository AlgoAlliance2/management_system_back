const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'professor', 'organizer', 'admin'],
        default: 'student' 
    },
    // Pentru funcționalitatea "Save/Bookmark"
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);