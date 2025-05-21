const express = require('express');
const { getTestDataController } = require('../controllers/yourcontroller');

const router = express.Router();

router.get('/', getTestDataController);

module.exports = router; // ✅ chỉ export router, KHÔNG export object như { router }
