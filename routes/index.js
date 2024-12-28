// index.js

const { Router } = require('express');
const AuthRouter = require('./auth');
const indexRouter = Router();

indexRouter.use('/auth', AuthRouter);
indexRouter.use('/users', require('./users'));

indexRouter.get('/', (req, res) => res.send('API Root'));

module.exports = indexRouter;
