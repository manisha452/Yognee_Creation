const express = require('express');
const router = express.Router();
const {
  getAllChats,
  getChatById,
  replyToChat,
  updateChatStatus,
} = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware'); // adjust path as needed

// All admin chat routes require login + admin role
router.get('/',              protect, admin, getAllChats);
router.get('/:id',            protect, admin, getChatById);
router.post('/:id/reply',     protect, admin, replyToChat);
router.patch('/:id/status',   protect, admin, updateChatStatus);

module.exports = router;