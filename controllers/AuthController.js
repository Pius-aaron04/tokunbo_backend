// controllers/auth.js


const {hashedPassword, verifyPassword, hashPassword, generateToken} = require('../utils/auth_helpers');
const User = require('../models/user');
const HTTP_STATUS = {
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  SERVER_ERROR: 500
}

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
}


module.exports = AuthController;