const express = require('express');
const userRouter = express.Router();
const authController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

userRouter.post('/login', authController.login);
userRouter.post('/register', authController.register);
userRouter.get('/me', authMiddleware.requireAuth, authController.getMe); // needs token

module.exports = userRouter;