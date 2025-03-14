require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const couponRoutes = require('./routes/couponRoute.js');
const Coupon = require('./models/coupon.js');
const Config = require('./models/config.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.set('trust proxy', 1);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed initial data
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(
        Array.from({ length: 10 }, (_, i) => ({
          code: `COUPON${i + 1}`,
          order: i
        }))
      );
      console.log('Seeded coupons');
    }

    if (!await Config.findOne({ name: 'currentIndex' })) {
      await Config.create({ name: 'currentIndex', value: 0 });
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api', couponRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});