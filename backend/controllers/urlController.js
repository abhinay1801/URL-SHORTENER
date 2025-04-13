// const shortid = require('shortid');
// const Url = require('../models/Url');
// const { generateQR } = require('./qrController');
// const validator = require('validator');

// // @desc    Create short URL
// // @route   POST /api/url/shorten
// // @access  Public
// const shortenUrl = async (req, res) => {
//   const { originalUrl, customAlias, expiresIn } = req.body;

//   // Validate URL
//   if (!validator.isURL(originalUrl)) {
//     return res.status(400).json({ error: 'Invalid URL' });
//   }

//   try {
//     // Check if URL already exists
//     let url = await Url.findOne({ originalUrl });

//     if (url) {
//       return res.json(url);
//     }

//     // Create short id
//     const shortId = customAlias || shortid.generate();

//     // Calculate expiration date if provided
//     let expiresAt = null;
//     if (expiresIn) {
//       expiresAt = new Date();
//       expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
//     }

//     // Generate QR code
//     const qrCode = await generateQR(`${process.env.BASE_URL}/${shortId}`);

//     // Create new URL
//     url = new Url({
//       originalUrl,
//       shortId,
//       shortUrl: `${process.env.BASE_URL}/${shortId}`,
//       customAlias: customAlias || null,
//       expiresAt,
//       qrCode
//     });

//     await url.save();

//     res.json(url);
//   } catch (err) {
//     console.error(err);
//     if (err.code === 11000) {
//       return res.status(400).json({ error: 'Custom alias already in use' });
//     }
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // @desc    Redirect to original URL
// // @route   GET /:shortId
// // @access  Public
// const redirectUrl = async (req, res) => {
//   try {
//     const url = await Url.findOne({ shortId: req.params.shortId });

//     if (!url) {
//       return res.status(404).json({ error: 'URL not found' });
//     }

//     // Check if URL has expired
//     if (url.expiresAt && new Date() > url.expiresAt) {
//       return res.status(410).json({ error: 'URL has expired' });
//     }

//     // Update click count and analytics
//     url.clicks += 1;
//     url.clickData.push({
//       ipAddress: req.ip,
//       userAgent: req.get('User-Agent'),
//       referrer: req.get('Referrer'),
//       // Note: In production, you'd want to use a service like ipstack to get location data
//     });
//     await url.save();

//     res.redirect(url.originalUrl);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // @desc    Get URL analytics
// // @route   GET /api/url/analytics/:shortId
// // @access  Public
// const getUrlAnalytics = async (req, res) => {
//   try {
//     const url = await Url.findOne({ shortId: req.params.shortId });

//     if (!url) {
//       return res.status(404).json({ error: 'URL not found' });
//     }

//     res.json({
//       totalClicks: url.clicks,
//       analytics: url.clickData,
//       createdAt: url.createdAt,
//       expiresAt: url.expiresAt,
//       qrCode: url.qrCode
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = {
//   shortenUrl,
//   redirectUrl,
//   getUrlAnalytics
// };

const shortid = require('shortid');
const Url = require('../models/Url');
const { generateQR } = require('./qrController');
const validator = require('validator');

// @desc    Create short URL
// @route   POST /api/url/shorten
// @access  Public
const shortenUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresIn } = req.body;

  // Validate and normalize URL
  let normalizedUrl = originalUrl;
  if (!/^https?:\/\//i.test(originalUrl)) {
    normalizedUrl = 'https://' + originalUrl;
  }

  if (!validator.isURL(normalizedUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Check if URL already exists
    let url = await Url.findOne({ originalUrl: normalizedUrl });

    if (url) {
      return res.json(url);
    }

    // Create short id
    const shortId = customAlias || shortid.generate();

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }

    // Generate QR code
    const qrCode = await generateQR(`${process.env.BASE_URL}/${shortId}`);

    // Create new URL
    url = new Url({
      originalUrl: normalizedUrl,
      shortId,
      shortUrl: `${process.env.BASE_URL}/${shortId}`,
      customAlias: customAlias || null,
      expiresAt,
      qrCode
    });

    await url.save();

    res.json(url);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Custom alias already in use' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Redirect to original URL
// @route   GET /:shortId
// @access  Public
const redirectUrl = async (req, res) => {
    try {
      const url = await Url.findOne({
        $or: [
          { shortId: req.params.shortId },
          { customAlias: req.params.shortId }
        ]
      });
  
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
  
      // Force HTTPS if missing
      let targetUrl = url.originalUrl;
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
  
      // Update analytics
      url.clicks += 1;
      await url.save();
  
      return res.redirect(301, targetUrl);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };

// @desc    Get URL analytics
// @route   GET /api/url/analytics/:shortId
// @access  Public
const getUrlAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      totalClicks: url.clicks,
      analytics: url.clickData,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      qrCode: url.qrCode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrlAnalytics
};