const express = require('express');
const authroutes = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

authroutes.post('/login', authController.login);
authroutes.post('/register', authController.register);
authroutes.get('/me', authMiddleware.requireAuth, authController.getMe); // needs token

module.exports = authroutes;