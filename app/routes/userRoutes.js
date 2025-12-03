const express = require('express');
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.login);
userRouter.get('/', userController.getAllUsers); // Admin usage

module.exports = userRouter;