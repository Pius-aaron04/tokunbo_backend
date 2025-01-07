// utils/auth_helpers

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_SECRET_KEY;
const jwtExpiry = process.env.JWT_EXPIRY || '1d';

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, jwtKey, { expiresIn: jwtExpiry });
    return token;
};

const verifyToken = (token) => {
    const payload = jwt.verify(token, jwtKey);
    return payload;
};

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    authenticateUser
}