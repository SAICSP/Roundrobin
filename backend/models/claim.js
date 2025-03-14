const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  cookieId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ClaimSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('Claim', ClaimSchema);