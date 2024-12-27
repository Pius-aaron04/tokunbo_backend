// src/database.js

const mongoose = require('mongoose');
const server = '127.0.0.1:27017';
const database = 'playgroung';

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
      console.error('Database connection failed');
    });
  }
}

module.exports = new Database();
