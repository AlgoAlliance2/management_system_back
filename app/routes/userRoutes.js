const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');



//userController.get('/', authMiddleware.requireAuth, );// Fetch all users, Auth is Required to see all users


//userController.patch('/:id/role', authMiddleware.requireAuth,  );//Update a user's role, Auth is Required to edit an user

module.exports = userController;