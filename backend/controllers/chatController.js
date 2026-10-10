const Chat = require('../models/Chat');
const { getAutoReply } = require('../utils/autoReply');

/* ════════════════════════════════════════════════════════════════
   CUSTOMER-FACING ENDPOINTS
════════════════════════════════════════════════════════════════ */

// @POST /api/chat/send
// Customer sends a message → saved → auto-reply generated → saved → return chat
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id; // from auth middleware

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // find existing chat for this user, or create a new thread
    let chat = await Chat.findOne({ user: userId });
    if (!chat) {
      chat = new Chat({ user: userId, status: 'open' });
    }

    // Reopen chat if customer messages again after it was closed
    if (chat.status === 'closed') {
      chat.status = 'open';
    }

    // 1. Save the customer's message
    chat.addMessage('user', text.trim());

    // 2. Generate + save the auto-reply
    //    NOTE: this runs synchronously right after the user message,
    //    which is fine for keyword rules. If this is swapped for an
    //    AI call later, this is the spot to make it async/await an
    //    external service — the rest of the flow doesn't change.
    const autoReplyText = getAutoReply(text);
    chat.addMessage('bot', autoReplyText);
    // Bot replies don't count toward the admin's unread badge,
    // so we decrement back the +1 that addMessage('bot', ...) would
    // NOT have added anyway (addMessage only increments on 'user').
    // (Kept here as an explicit no-op comment so future devs don't
    // "fix" this into double-counting.)

    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/chat/my-chat
// Logged-in customer's own chat history (creates an empty thread on first visit)
const getMyChat = async (req, res) => {
  try {
    const userId = req.user._id;

    let chat = await Chat.findOne({ user: userId }).populate('user', 'name email');

    // If the customer has never chatted before, return an empty shell
    // rather than 404 — simpler for the frontend widget to render.
    if (!chat) {
      return res.status(200).json({
        success: true,
        chat: { messages: [], status: 'open', isNew: true },
      });
    }

    res.status(200).json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════════
   ADMIN-FACING ENDPOINTS
════════════════════════════════════════════════════════════════ */

// @GET /api/admin/chats
// All conversations, newest activity first — for the inbox list (left panel)
const getAllChats = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [chats, total] = await Promise.all([
      Chat.find(query)
        .populate('user', 'name email phone')
        .select('-messages') // exclude full message array — list view only needs metadata
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Chat.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      chats,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/chats/:id
// Full conversation for the right panel. Marks as read for the admin.
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('user', 'name email phone');
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    // Opening a conversation clears the unread badge
    if (chat.unreadCount > 0) {
      chat.markAsRead();
      await chat.save();
    }

    res.status(200).json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/admin/chats/:id/reply
// Admin sends a manual reply
const replyToChat = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    chat.addMessage('admin', text.trim());
    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PATCH /api/admin/chats/:id/status
// Open / close a conversation
const updateChatStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "open" or "closed"' });
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email phone');

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.status(200).json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  sendMessage,
  getMyChat,
  getAllChats,
  getChatById,
  replyToChat,
  updateChatStatus,
};