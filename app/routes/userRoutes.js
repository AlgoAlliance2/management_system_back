const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


userRouter.get('/', authMiddleware.requireAuth, userController.getAllUsers);

userRouter.patch('/:id/role', authMiddleware.requireAuth, userController.updateUserRole);

userRouter.delete('/:id', authMiddleware.requireAuth, userController.deleteUser);

module.exports = userRouter;