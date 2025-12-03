const mongoose = require('mongoose');

// Material schema doesn't exist without an event
const materialSchema = new mongoose.Schema({
    fileName: {type: String},
    fileType: {type: String}, // PDF, PPT, etc.
    url: {type: String}
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: {type: String},
    date: { type: Date, required: true },
    location: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['academic', 'social', 'career', 'sport', 'volunteer'], // temporary
        required: true 
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
        type: String, 
        enum: ['pending', 'published'], // needs improvements (temporary)
        default: 'pending' 
    },
    materials: [materialSchema]
}, { versionKey: false });

module.exports = mongoose.model('Event', eventSchema);