// models/user.js

const mongoose = require("mongoose");
const { use } = require("passport");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  pwd_hash: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true
  },
  profilePicture:{
    type: String,
    required: false
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false
  }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
