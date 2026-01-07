const User = require('../models/User');


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
        const targetUserId = req.params.id; // The user to be updated
        const { role: newRole } = req.body; // The new role
        const requesterId = req.userId; // The admin performing the action

        const validRoles = ['student', 'professor' ,'organizer', 'admin'];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ message: "Invalid role specified." });
        }

        const requester = await User.findById(requesterId);
        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can change roles." });
        }

        // 3. Security Check: Prevent Self-Modification
        // An admin should not be able to change their own role to prevent accidental lockout
        if (targetUserId === requesterId) {
            return res.status(403).json({ message: "You cannot change your own role." });
        }

        // 4. Find and Update the User
        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            { role: newRole },
            { new: true, runValidators: true } // Return the updated document
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Return the updated user data
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
        console.error("Error updating user role:", error);
        res.status(500).json({ error: "Server error while updating role." });
    }
};