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

exports.getAllEvents = async (req, res) => {
    try {
        // Filtering logic to do more
        const { type, status } = req.query;
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status; 
        
        const events = await Event.find(query).populate('organizer', 'name organizationName');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('materials');
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        // Editing / Admin validation 
        const { id } = req.params;
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

        res.status(200).json({ "message": "Event updated successfully", "event": updatedEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.status(200).json({ "message": "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};