const Event = require('../models/Event');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.getAllEvents = async (req, res) => {
    try {
        const currentUserId = req.userId; 
        // sortade dupa cel mai nou
        const events = await Event.find().populate('organizer', 'name').sort({ date: 1 });
        
        let userSavedEvents = [];
        if (currentUserId) {
            const user = await User.findById(currentUserId);
            if (user) {
                userSavedEvents = user.savedEvents.map(id => id.toString());
            }
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
                isSaved: isSaved,
                status: event.status,
                rejectionReason: event.rejectionReason,
                comments: event.comments
            };
        });

        res.status(200).json(formattedEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getApprovedEvents = async (req, res) => {
    try {
        const currentUserId = req.userId;

        
        const events = await Event.find({ status: 'approved' })
            .populate('organizer', 'name')
            .sort({ date: 1 });

        let userSavedEvents = [];
        if (currentUserId) {
            const user = await User.findById(currentUserId);
            if (user) {
                userSavedEvents = user.savedEvents.map(id => id.toString());
            }
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
                isSaved: isSaved,
                status: event.status,
                comments: event.comments
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
      isAttending: false, 
      isSaved: false,
      // --- MAP NEW FIELDS ---
      status: event.status,
      rejectionReason: event.rejectionReason,
      comments: event.comments
    };

    res.status(200).json({ event: formattedEvent });
  } catch (error) {
    console.error("Error loading event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.userId;

        // Verifica sa fie admin
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can approve events." });
        }

        const event = await Event.findByIdAndUpdate(
            eventId,
            { 
                status: 'approved',
                $unset: { rejectionReason: 1 }
            },
            { new: true }
        );

        if (!event) return res.status(404).json({ message: "Event not found" });


        if (event) {
            await createNotification(
                event.organizer,
                'status_update',
                'Eveniment Aprobat!',
                `Evenimentul tău "${event.title}" a fost aprobat și este acum public.`,
                event._id
            );
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rejectEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { reason } = req.body;
        const userId = req.userId;

        // Verifica sa fie admin
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can reject events." });
        }

        if (!reason) {
            return res.status(400).json({ message: "Rejection reason is required." });
        }

        const event = await Event.findByIdAndUpdate(
            eventId,
            { 
                status: 'rejected',
                rejectionReason: reason
            },
            { new: true }
        );

        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.resubmitEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.userId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.organizer.toString() !== userId) {
            return res.status(403).json({ 
                message: "Access denied. Only the organizer can resubmit this event." 
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { 
                status: 'pending',
                $unset: { rejectionReason: 1 } 
            },
            { new: true }
        ).populate('organizer', 'name');

        //Trimit notificare tuturor adminilor
        const admins = await User.find({ role: 'admin' });

        const notifTitle = "Eveniment Retrimis";
        const notifMessage = `Organizatorul "${updatedEvent.organizer.name}" a retrimis evenimentul "${updatedEvent.title}" pentru aprobare.`;

 
        const notificationPromises = admins.map(admin => 
            createNotification(
                admin._id,
                'review_required',
                notifTitle,
                notifMessage,
                updatedEvent._id
            )
        );

        await Promise.all(notificationPromises);

        res.status(200).json(updatedEvent);

    } catch (error) {
        console.error("Error resubmitting event:", error);
        res.status(500).json({ error: "Server error while resubmitting event." });
    }
};


exports.addComment = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { text } = req.body;
        const userId = req.userId; 

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        // Find the Event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Find the User (we need their name for the comment)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create the comment object
        const newComment = {
            userId: user._id,
            userName: user.name,
            text: text,
            date: new Date()
        };

        // Push to array and save
        event.comments.push(newComment);
        await event.save();

        const addedComment = event.comments[event.comments.length - 1];

        res.status(201).json({
            id: addedComment._id,
            userId: addedComment.userId,
            userName: addedComment.userName,
            text: addedComment.text,
            date: addedComment.date
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Server error while adding comment" });
    }
};




exports.getAllUsersAtending = async (req, res) => {
    try {
        const eventId = req.params.id;
        const requesterId = req.userId; 

        const event = await Event.findById(eventId)
            .populate({
                path: 'attendeesList',
                select: '-password' 
            })
            .lean();

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

 
        const requester = await User.findById(requesterId);
        
        const isAdmin = requester.role === 'admin';
        const isOrganizerOfEvent = event.organizer.toString() === requesterId;

        if (!isAdmin && !isOrganizerOfEvent) {
            return res.status(403).json({ 
                message: "Access denied. Only the Admin or the Event Organizer can view the attendee list." 
            });
        }

        const attendees = event.attendeesList;

        if (!attendees || attendees.length === 0) {
             return res.status(200).json([]); 
        }

        const formattedAttendees = attendees.map(user => ({
            ...user,
            id: user._id.toString(),
            _id: undefined
        }));

        res.status(200).json(formattedAttendees);

    } catch (error) {
        console.error("Error fetching event attendees:", error);
        res.status(500).json({ message: 'Error fetching attendees', error: error.message });
    }
};