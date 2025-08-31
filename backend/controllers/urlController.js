const shortid = require('shortid');
const Url = require('../models/Url');
const { generateQR } = require('./qrController');
const validator = require('validator');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');


const shortenUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresIn } = req.body;

  let normalizedUrl = originalUrl;
  if (!/^https?:\/\//i.test(originalUrl)) {
    normalizedUrl = 'https://' + originalUrl;
  }

  if (!validator.isURL(normalizedUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    let url = await Url.findOne({ originalUrl: normalizedUrl });

    if (url) {
      return res.json(url);
    }


    const shortId = customAlias || shortid.generate();


    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }


    const qrCode = await generateQR(`${process.env.BASE_URL}/${shortId}`);


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


    let targetUrl = url.originalUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    const ipAddress = requestIp.getClientIp(req);
    const geo = geoip.lookup(ipAddress);
    const clickData = {
      timestamp: new Date(),
      ipAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer'),
      country: geo ? geo.country || 'Not Available' : 'Not Available',
      region: geo ? geo.region || 'Not Available' : 'Not Available',
      city: geo ? geo.city || 'Not Available' : 'Not Available',
    };

    url.clicks += 1;
    url.clickData.push(clickData);
    await url.save();

    return res.redirect(301, targetUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getUrlAnalytics = async (req, res) => {
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