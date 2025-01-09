// routes/user.js
const { Router } = require('express');
const { authenticateUser } = require('../utils/auth_helpers');
const UserController = require('../controllers/UserController');

const userRouter = Router();

// Profile endpoints
userRouter.get('/me', authenticateUser, UserController.getMe); // Get logged-in user profile
userRouter.put('/me/update_profile', authenticateUser, UserController.updateMe); // Update profile
userRouter.delete('/me', authenticateUser, UserController.deleteMe); // Delete profile

module.exports = userRouter;
