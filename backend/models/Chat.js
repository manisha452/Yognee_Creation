const mongoose = require('mongoose');

/* ── Message Subdocument ──────────────────────────────────────────
   Embedded directly inside Chat rather than a separate collection.
   This keeps a full conversation in one document — fast to read,
   no joins needed for the common "load whole chat" case.
   When Socket.io is added later, this same schema is what gets
   emitted over the socket on each new message.
──────────────────────────────────────────────────────────────────── */
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'bot', 'admin'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only need createdAt
  }
);

/* ── Chat Schema ──────────────────────────────────────────────────
   One Chat document per customer (1:1 with User). All messages for
   that customer live in `messages`. `lastMessage` + `unreadCount`
   are denormalized fields so the admin inbox list can render fast
   without scanning the messages array of every chat.
──────────────────────────────────────────────────────────────────── */
const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,        // one chat thread per customer
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    messages: [messageSchema],

    // Denormalized fields — updated whenever a message is added.
    // Avoids recomputing "last message" / "unread count" on every
    // admin inbox GET by scanning the full messages array.
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // Unread count is from the ADMIN's perspective — i.e. how many
    // customer messages have arrived since an admin last viewed/replied.
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ── Helper: append a message and update denormalized fields ──────
   Centralizing this on the model means every controller that adds
   a message (customer send, bot reply, admin reply) updates
   lastMessage/lastMessageAt/unreadCount consistently — no risk of
   one route forgetting to bump unreadCount.
──────────────────────────────────────────────────────────────────── */
chatSchema.methods.addMessage = function (sender, text) {
  this.messages.push({ sender, text });
  this.lastMessage = text;
  this.lastMessageAt = new Date();

  // Only customer messages increment the admin's unread count.
  // Bot/admin messages don't need an "unread" badge for the admin.
  if (sender === 'user') {
    this.unreadCount += 1;
  }
  return this;
};

// Mark all customer messages as "seen" by admin (called when admin opens a chat)
chatSchema.methods.markAsRead = function () {
  this.unreadCount = 0;
  return this;
};

module.exports = mongoose.model('Chat', chatSchema);