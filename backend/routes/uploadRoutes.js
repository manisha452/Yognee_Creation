const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, cloudinary } = require('../config/cloudinary');

router.post('/image', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: req.file.path, publicId: req.file.filename });
});

router.post('/images', protect, admin, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded' });
  const images = req.files.map(f => ({ url: f.path, publicId: f.filename }));
  res.json({ success: true, images });
});

router.delete('/image', protect, admin, async (req, res) => {
  try {
    const { publicId } = req.body;
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
