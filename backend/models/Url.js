const mongoose = require('mongoose');
const { isURL } = require('validator');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Please provide a URL'],
    validate: [isURL, 'Please enter a valid URL']
  },
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default:7
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true
  },
  qrCode: {
    type: String
  },
  clickData: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    referrer: String,
    country: String,
    region: String,
    city: String
  }]
});

// Index for expiration
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema);