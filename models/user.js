// models/user.js

const mongoose = require("mongoose");

const userSchema = mongoose.schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  }
  role: {
    type: String,
    required: true
  },
  profilePicture:{
    type: String,
    required: false
  }
});

module.exports = mongoose.model.('User', userSchema);
