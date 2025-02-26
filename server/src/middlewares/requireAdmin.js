const asyncHandle = require("../helper/asyncHandle");

const requireAdmin = asyncHandle(async (req, res, next) => {

    return res.status(401).json({
        success: false,
        message: "Require authentication"
    });
});

module.exports = requireAdmin;
