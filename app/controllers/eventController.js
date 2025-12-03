const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, type, organizerId } = req.body;
        
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            type,
            organizer: organizerId, // to do: check id!!!!
            status: 'pending' // Default
        });

        await newEvent.save();
        res.status(200).json({ "message": "Event created, waiting for validation", "id": newEvent._id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

