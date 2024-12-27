// auth.js --  Authentication ROUTER

const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const authRouter = Router();

authRouter.post('/signup', AuthController.registerUser);
authRouter.post('/signin', AuthController.loginUser);

module.exports = authRouter;
