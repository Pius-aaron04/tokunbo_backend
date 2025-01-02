// auth.js --  Authentication ROUTER

const { Router } = require("express");
const AuthController = require("../controllers/AuthController");
const { body } = require("express-validator");

const authRouter = Router();

authRouter.post("/signup", AuthController.registerUser);
authRouter.post("/signin", AuthController.loginUser);
authRouter.post(
  "/verify_email/confirm-otp",
  body("email").isEmail().notEmpty(),
  body("otp").isLength({ min: 6, max: 6 }).notEmpty(),
  AuthController.verifyUserEmail
);
authRouter.post(
  "/verify_email/request-otp",
  body("email").isEmail().notEmpty(),
  AuthController.requestEmailVerification
);

module.exports = authRouter;
