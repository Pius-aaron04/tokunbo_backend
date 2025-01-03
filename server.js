// server.js
require('dotenv').config()
const express = require('express');
const indexRouter = require('./routes/index');

// establish database connection
require('./config/database');
//establish redis connection
require('./config/redis').connect();
const app = express();

app.use(express.json());
app.use('/api', indexRouter);
app.get('/', (req, res) => {
  res.send('-- Tokunbo -- <br />--From The Oversea');
});


app.listen(5000, () => {
  console.log('Server is running on Port 5000');
});
