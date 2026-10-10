const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/key', protect, (req, res) => {
  res.json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
