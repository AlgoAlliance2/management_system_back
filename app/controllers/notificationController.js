const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        
        const notifications = await Notification.find({ userId })
            .sort({ date: -1 });

        const formattedNotifications = notifications.map(n => ({
            id: n._id,
            type: n.type,
            title: n.title,
            message: n.message,
            date: n.date,
            read: n.read,
            eventId: n.eventId
        }));

        res.status(200).json(formattedNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        
        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;

        await Notification.updateMany(
            { userId: userId, read: false },
            { read: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.createNotification = async (userId, type, title, message, eventId = null) => {
    try {
        const notification = new Notification({
            userId,
            type,
            title,
            message,
            eventId
        });
        await notification.save();
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deletedNotification = await Notification.findOneAndDelete({ 
            _id: id, 
            userId: userId 
        });

        if (!deletedNotification) {
            return res.status(404).json({ message: "Notification not found or you do not have permission to delete it." });
        }

        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Server error" });
    }
};