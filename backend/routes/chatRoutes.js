const express = require('express');
const router = express.Router();
const { sendMessage, getMyChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware'); // adjust path to your existing auth middleware

// All customer chat routes require a logged-in user
router.post('/send',     protect, sendMessage);
router.get('/my-chat',   protect, getMyChat);

module.exports = router;