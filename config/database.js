// src/database.js

const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

    mongoose.connect(uri) 
    .then(() => {
      console.log('Database connection successful')
    })
    .catch((err) => {
      console.error(`Database connection failed: ${err.message}`);
    });
  }
}

module.exports = new Database();
