const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');



// Fetch all users, Auth is Required to see all users
router.get('/', authMiddleware.requireAuth, userController.getAllUsers);


//Update a user's role, Auth is Required to edit an user
router.patch('/:id/role', authMiddleware.requireAuth, userController.updateRole);

module.exports = router;