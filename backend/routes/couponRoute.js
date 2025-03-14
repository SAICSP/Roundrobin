const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Coupon = require('../models/coupon.js');
const Config = require('../models/config.js');
const Claim = require('../models/claim.js');

router.post('/claim', async (req, res) => {
  try {
    const ip = req.ip;
    let cookieId = req.cookies.couponCookie;

    
    const existingClaim = await Claim.findOne({
      $or: [{ ip }, { cookieId }]
    });

    if (existingClaim) {
      const timeLeft = Math.ceil(
        (existingClaim.createdAt.getTime() + 3600000 - Date.now()) / 60000
      );
      return res.status(429).json({ error: `Try again in ${timeLeft} minutes` });
    }

    
    if (!cookieId) {
      cookieId = uuidv4();
    }

    // Get current coupon index
    const config = await Config.findOneAndUpdate(
      { name: 'currentIndex' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const coupons = await Coupon.find().sort('order');
    const currentIndex = config.value % coupons.length;
    const coupon = coupons[currentIndex];

    
    await Claim.create({ ip, cookieId });

    
    res.cookie('couponCookie', cookieId, {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ coupon: coupon.code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;