const Event = require('../models/Event');
const User = require('../models/User');

exports.getAllEvents = async (req, res) => {
    try {
        const currentUserId = req.userId; // can be null if the user is not logged
        const events = await Event.find().populate('organizer', 'name');
        let userSavedEvents = [];
        if (currentUserId) {
            const user = await User.findById(currentUserId);
            userSavedEvents = user.savedEvents.map(id => id.toString());
        }
        const formattedEvents = events.map(event => {
            const isAttending = currentUserId ? event.attendeesList.includes(currentUserId) : false;
            const isSaved = currentUserId ? userSavedEvents.includes(event._id.toString()) : false;
            return {
                id: event._id,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                category: event.category,
                organizer: event.organizer ? event.organizer.name : 'Unknown',
                organizerId: event.organizer ? event.organizer._id : null,
                imageUrl: event.imageUrl,
                attendees: event.attendeesList.length,
                maxAttendees: event.maxAttendees,
                isAttending: isAttending,
                isSaved: isSaved
            };
        });
        res.status(200).json(formattedEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            organizer: req.userId
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.toggleAttendance = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.userId;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        const index = event.attendeesList.indexOf(userId);
        let isAttending = false;
        if (index === -1) {
            event.attendeesList.push(userId);
            isAttending = true;
        } else {
            event.attendeesList.splice(index, 1);
            isAttending = false;
        }
        await event.save();
        res.status(200).json({
            success: true,
            isAttending,
            attendees: event.attendeesList.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleSave = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.userId;
        const user = await User.findById(userId);
        const index = user.savedEvents.indexOf(eventId);
        let isSaved = false;
        if (index === -1) {
            user.savedEvents.push(eventId);
            isSaved = true;
        } else {
            user.savedEvents.splice(index, 1);
            isSaved = false;
        }
        await user.save();
        res.status(200).json({
            success: true,
            isSaved
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId; // vine din middleware-ul de auth

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evenimentul nu a fost găsit" });
    }

    // Doar organizer-ul are voie să șteargă
    if (event.organizer.toString() !== userId) {
      return res.status(403).json({
        message: "Nu ai permisiunea să ștergi acest eveniment",
      });
    }

    // Curăță referințele din savedEvents (ca să nu rămână id-uri moarte)
    await User.updateMany(
      { savedEvents: eventId },
      { $pull: { savedEvents: eventId } }
    );

    // Șterge evenimentul
    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      success: true,
      message: "Eveniment șters cu succes",
    });
  } catch (error) {
    console.error("Eroare la ștergerea evenimentului:", error);
    res.status(500).json({ message: "Eroare server" });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId; // vine din middleware-ul de auth

    // Găsește evenimentul
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evenimentul nu a fost găsit" });
    }

    // Verifică dacă utilizatorul este organizer-ul evenimentului
    if (event.organizer.toString() !== userId) {
      return res.status(403).json({
        message: "Nu ai permisiunea să editezi acest eveniment",
      });
    }

    // Actualizează doar câmpurile trimise în body
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      maxAttendees,
      imageUrl,
    } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = new Date(date);
    if (time !== undefined) event.time = time;
    if (location !== undefined) event.location = location;
    if (category !== undefined) event.category = category;
    if (maxAttendees !== undefined) event.maxAttendees = Number(maxAttendees);
    if (imageUrl !== undefined) event.imageUrl = imageUrl;

    await event.save();

    // Populăm organizer-ul pentru răspuns consistent cu getAllEvents
    const updatedEvent = await Event.findById(eventId).populate(
      "organizer",
      "name"
    );

    res.status(200).json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Eroare la actualizarea evenimentului:", error);
    res.status(500).json({ message: "Eroare server" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate("organizer", "name");

    if (!event) {
      return res.status(404).json({ message: "Evenimentul nu a fost găsit" });
    }

    // Formatează ca în getAllEvents (pentru consistență în frontend)
    const formattedEvent = {
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      organizer: event.organizer ? event.organizer.name : "Unknown",
      organizerId: event.organizer ? event.organizer._id.toString() : null,
      imageUrl: event.imageUrl,
      attendees: event.attendeesList.length,
      maxAttendees: event.maxAttendees,
      isAttending: false, // Nu calculăm aici, frontend-ul face
      isSaved: false, // Idem
    };

    res.status(200).json({ event: formattedEvent });
  } catch (error) {
    console.error("Eroare la încărcarea evenimentului:", error);
    res.status(500).json({ message: "Eroare server" });
  }
};
