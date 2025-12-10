const mongoose = require('mongoose');

// Material schema doesn't exist without an event
const materialSchema = new mongoose.Schema({
    fileName: {type: String},
    fileType: {type: String}, // PDF, PPT, etc.
    url: {type: String}
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true }, // Data calendaristica
    time: { type: String, required: true }, // Interval orar (ex: "14:00 - 16:00")
    location: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['conference', 'workshop', 'student-activity', 'seminar', 'sports', 'cultural'],
        required: true 
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String }, // URL string
    maxAttendees: { type: Number, default: 100 },
    
    // Lista de studenti inscrisi (pentru calculul isAttending si numarul total)
    attendeesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, { versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual field pentru numarul de participanti 
eventSchema.virtual('attendees').get(function() {
    return this.attendeesList ? this.attendeesList.length : 0;
});

module.exports = mongoose.model('Event', eventSchema);