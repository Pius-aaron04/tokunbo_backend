// config/cache.js
const redis = require('redis');

const client = redis.createClient({
    host: process.env.REDIS_HOST ||'127.0.0.1',
    port: process.env.REDIS_PORT ||6379,
});

module.exports = client;