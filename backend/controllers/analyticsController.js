const Url = require('../models/Url');

// @desc    Get all URLs with analytics
// @route   GET /api/url/analytics
// @access  Public
const getAllUrlsWithAnalytics = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllUrlsWithAnalytics
};