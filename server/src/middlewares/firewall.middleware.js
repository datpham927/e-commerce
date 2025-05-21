const rateLimit = require('express-rate-limit');
const geoip = require('geoip-lite');

const ipBlocker = (req, res, next) => {
    const ip =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip;

    const geo = geoip.lookup(ip);
    console.log(`🔍 IP request: ${ip} | Country: ${geo?.country || 'Unknown'}`);

    // ❌ Chặn IP từ France (FR)
    if (geo && geo.country === 'FR') {
        return res.status(403).json({
            message: 'Truy cập từ Pháp đã bị chặn bởi firewall',
        });
    }

    next();
};

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Quá nhiều request từ IP này. Vui lòng thử lại sau.',
});

module.exports = {
    ipBlocker,
    apiRateLimiter,
};
