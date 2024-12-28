// routes/user.js
const { Router } = require('express');
const User = require('../models/user');
const { authenticateUser } = require('../utils/auth_helpers');

const userRouter = Router();
userRouter.get('/me', authenticateUser, async (req, res) => {
    let user = await User.findOne({_id: req.user.userId}).exec();
    if(!user){
        return res.status(401).json({error: 'Unauthorized'});
    }
    
    user = user.toObject();
    delete user.pwd_hash;
    return res.status(200).json(user);
});

module.exports = userRouter;