require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Ping Redis mỗi 5 phút
setInterval(async () => {
    try {
        const pong = await redis.ping();
    } catch (err) {
        console.error('Redis ping failed:', err);
    }
}, 2 * 60 * 1000); // 5 phút

redis.on('connect', () => console.log('✅ Redis connected!'));
redis.on('error', (err) => console.error('❌ Redis Error:', err));

module.exports = redis;
