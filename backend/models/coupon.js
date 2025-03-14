const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Coupon', CouponSchema);