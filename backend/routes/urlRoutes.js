// const express = require('express');
// const router = express.Router();
// const {
//   shortenUrl,
//   redirectUrl,
//   getUrlAnalytics
// } = require('../controllers/urlController');
// const { getAllUrlsWithAnalytics } = require('../controllers/analyticsController');

// // Create short URL
// router.post('/shorten', shortenUrl);

// // Get URL analytics
// router.get('/analytics/:shortId', getUrlAnalytics);

// // Get all URLs with analytics
// router.get('/analytics', getAllUrlsWithAnalytics);

// // Redirect to original URL
// router.get('/:shortId', redirectUrl);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getUrlAnalytics
} = require('../controllers/urlController');
const { getAllUrlsWithAnalytics } = require('../controllers/analyticsController');

// Create short URL
router.post('/shorten', shortenUrl);

// Get URL analytics
router.get('/analytics/:shortId', getUrlAnalytics);

// Get all URLs with analytics
router.get('/analytics', getAllUrlsWithAnalytics);

// Redirect to original URL
router.get('/:shortId', redirectUrl);

module.exports = router;