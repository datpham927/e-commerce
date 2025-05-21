const { getTestDataService } = require('../services/yourservice')

const getTestDataController = async (req, res) => {
  const data = await getTestDataService();
  res.json({ success: true, data });
};

module.exports = {
  getTestDataController,
};
