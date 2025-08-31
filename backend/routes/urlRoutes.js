const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getUrlAnalytics
} = require('../controllers/urlController');
const { getAllUrlsWithAnalytics } = require('../controllers/analyticsController');


router.post('/shorten', shortenUrl);


router.get('/analytics/:shortId', getUrlAnalytics);


router.get('/analytics', getAllUrlsWithAnalytics);


router.get('/:shortId', redirectUrl);

module.exports = router;