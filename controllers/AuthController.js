// controllers/AuthController.js

const redis = require("../config/redis");
const {
  hashedPassword,
  verifyPassword,
  hashPassword,
  generateToken,
} = require("../utils/auth_helpers");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const email = require("../services/email");
const HTTP_STATUS = {
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

class AuthController{
  static createUser = async (payload) => {
    payload.pwd_hash = await hashPassword(payload.password);
    delete payload.password;
    return new User(payload);
  };
  
  static sanitizeUser = (user) => {
    delete user.pwd_hash;
    delete user.__v;
    return user;
  };
  
  static async registerUser(req, res) {
    const payload = req.body;
  
    try {
      const existingUser = await User.findOne({ email: payload.email }).exec();
      if (existingUser) {
        return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email already exists' });
      }
      
      if (!payload.password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: 'Validation Error', 
          message: 'Password is required' 
        });
      }
  
      const newUser = await AuthController.createUser(payload);
      await newUser.save();
  
      const responsePayload = AuthController.sanitizeUser(newUser.toObject());
      return res.status(HTTP_STATUS.CREATED).json({ 
        message: 'User registered successfully', 
        user: responsePayload 
      });
  
    } catch (err) {
      console.error(err);
      const statusCode = err.name === 'ValidationError' ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.SERVER_ERROR;
      return res.status(statusCode).json({ 
        error: 'Registration Error', 
        message: err.message 
      });
    }
  }
  
   static async loginUser(req, res)  {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({email: req.body.email}).exec();
    if(!user){
      return res.status(400).json({error: 'Invalid Credentials'});
    } else {
      const isPasswordValid = await verifyPassword(req.body.password, user.pwd_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid Credentials' });
      }
      const payload = {
        message: 'Login successful',
      }
      payload.user = AuthController.sanitizeUser(user.toObject());
      const accessToken = generateToken(user._id.toString());
      payload.accessToken = accessToken;
      return res.status(200).json(payload);
    }
  }

  static async requestEmailVerification(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const user = await User.findOne({email: req.body.email}).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activeRequest = await redis.get(req.body.email);

    if (activeRequest) {
      return res.status(400).json({ error: 'Email verification request already sent' });
    }
    // otp generation and email service integration
    const emailResult = await email.sendOtp(req.body.email);
    if (emailResult.errorNiche) {
      return res.status(500).json({ error: emailResult.errorNiche });
    }
    try{
      console.log(emailResult.d_ata.otp)
      await redis.set(req.body.email, emailResult.d_ata.otp, {
        EX: 300
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    // send otp to user's email
    return res.status(200).json({message: 'OTP sent successfully'});
  }

  static async verifyUserEmail(req, res) {
    const result = validationResult(req);
    let otp;
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const user = await User.findOne({email: req.body.email}).exec();
    if(!user){
      return res.status(400).json({error: 'Invalid Credentials'});
    } else {
      // check if email is already verified
      if (user.emailVerified) {
        return res.status(400).json({ error: 'Email already verified' });
      }
      // gets and verifies otp from redis
      otp = await redis.get(req.body.email);
      if (!otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
      if (otp !== req.body.otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
      // Update user's email verification status
      user.emailVerified = true;
      await user.save();
      return res.status(200).json({message: 'Email verified successfully'});
    }
  }
}


module.exports = AuthController;
