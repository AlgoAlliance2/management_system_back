const User = require('../models/User');
const Event = require('../models/Event');



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();
        
        if (!users || users.length === 0) {
             return res.status(404).json({ message: 'No users found' });
        }

        
        const formattedUsers = users.map(user => ({
            ...user,
            id: user._id.toString(),
            _id: undefined  
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};


exports.updateUserRole = async (req, res) => {
    try {
        const targetUserId = req.params.id; 
        const { role, email } = req.body; 
        const requesterId = req.userId; 

        
        const requester = await User.findById(requesterId);
        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can modify users." });
        }

        
        if (targetUserId === requesterId) {
            return res.status(403).json({ message: "You cannot modify your own account via this endpoint." });
        }

        
        const updates = {};

        
        if (role) {
            const validRoles = ['student', 'organizer', 'admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Invalid role specified." });
            }
            updates.role = role;
        }

        
        if (email) {
            updates.email = email;
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Please provide a role or email to update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            updates, 
            { new: true, runValidators: true } 
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }


        res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error while updating user." });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const requesterId = req.userId;

        const { isValidObjectId } = require('mongoose');
        if (!isValidObjectId(targetUserId)) {
            return res.status(400).json({ message: "Invalid User ID format." });
        }

        //Verificare permisiuni admin
        const requester = await User.findById(requesterId);
        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can delete users." });
        }

        if (targetUserId === requesterId) {
            return res.status(403).json({ message: "You cannot delete your own account." });
        }

        const userToDelete = await User.findById(targetUserId);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found." });
        }
        await Event.deleteMany({ organizer: targetUserId });
        await User.findByIdAndDelete(targetUserId);

        res.status(200).json({ 
            success: true, 
            message: `User ${userToDelete.name} and their events have been deleted.` 
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Server error while deleting user." });
    }
};