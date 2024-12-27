// server.js
require('dotenv').config()
const express = require('express');
const indexRouter = require('./routes/index');

require('./config/database');
const app = express();

app.use(express.json());
app.use('/api', indexRouter);
app.get('/', (req, res) => {
  res.send('-- Tokunbo -- <br />--From The Oversea');
});


app.listen(5000, () => {
  console.log('Server is running on Port 5000');
});
