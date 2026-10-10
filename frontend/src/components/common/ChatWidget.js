// components/common/ChatWidget.jsx
//
// Floating support chat widget — bottom-right corner.
// Polls (not sockets, per spec) for simplicity. The polling call is
// isolated in fetchChat() so swapping it for a socket listener later
// is a one-function change, not a rewrite.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext';

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

/* ─── Single message bubble ──────────────────────────────────────── */
const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[78%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <p className="text-[10px] text-gray-400 mb-1 ml-1 font-medium">
            {message.sender === 'bot' ? '🤖 Zuri Bot' : '🧑‍💼 Support Team'}
          </p>
        )}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-rose-600 text-white rounded-br-md'
              : message.sender === 'bot'
                ? 'bg-gray-100 text-gray-700 rounded-bl-md'
                : 'bg-rose-50 text-gray-800 border border-rose-100 rounded-bl-md'
            }`}
        >
          {message.text}
        </div>
        <p className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {fmtTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

/* ─── Typing/sending indicator ───────────────────────────────────── */
const TypingDots = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   ChatWidget
══════════════════════════════════════════════════════════════════ */
const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [sending, setSending]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  const scrollRef = useRef(null);

  /* ── Fetch chat history ─────────────────────────────────────────
     Isolated so this is the single place to swap for a socket
     subscription later (e.g. `socket.on('chat:update', setMessages)`).
  ─────────────────────────────────────────────────────────────────── */
  const fetchChat = useCallback(async () => {
    try {
      const res = await chatAPI.getMyChat();
      const list = res.data.chat?.messages || [];
      setMessages(list);
    } catch (err) {
      console.error('Failed to load chat:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchChat();
  }, [user, fetchChat]);

  // Light polling while the widget is open — replace with Socket.io
  // subscription later; this whole block can simply be deleted then.
  useEffect(() => {
    if (!isOpen || !user) return;
    const interval = setInterval(fetchChat, 8000);
    return () => clearInterval(interval);
  }, [isOpen, user, fetchChat]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    if (!user) {
      // Not logged in — widget still opens, but sending requires auth
      return;
    }

    setSending(true);
    setInput('');

    // Optimistic UI: show the user's message immediately
    const optimisticMsg = { sender: 'user', text, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await chatAPI.send(text);
      // Replace with authoritative server state (includes the bot reply)
      setMessages(res.data.chat.messages);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Roll back optimistic message on failure
      setMessages(prev => prev.filter(m => m !== optimisticMsg));
      setInput(text); // give the text back so the user can retry
    } finally {
      setSending(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen(p => !p);
    setHasUnread(false);
  };

  return (
    <>
      {/* ── Floating toggle button ──────────────────────────────── */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full
          bg-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-300/50
          hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all duration-200
          ${isOpen ? 'rotate-0' : ''}`}
        aria-label="Open support chat"
      >
        <span className="text-lg">{isOpen ? '✕' : '💬'}</span>
        {!isOpen && <span className="hidden sm:inline">Chat With Us</span>}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </button>

      {/* ── Chat panel ───────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed z-50 bottom-0 right-0 sm:bottom-24 sm:right-5
            w-full sm:w-[380px] h-[100dvh] sm:h-[560px] sm:max-h-[80vh]
            bg-white sm:rounded-3xl shadow-2xl border border-gray-100
            flex flex-col overflow-hidden animate-slide-up"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                Z
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Zuri Fashion Support</p>
                <p className="text-rose-100 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block" />
                  Usually replies within minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-xl leading-none p-1"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50">
            {!user ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-gray-600 text-sm font-medium mb-1">Please log in to chat</p>
                <p className="text-gray-400 text-xs">We need to know who you are to help you best</p>
              </div>
            ) : loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                    <div className="h-10 w-40 bg-gray-100 rounded-2xl animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Welcome message — always shown first */}
                <div className="text-center mb-4">
                  <span className="inline-block bg-white text-gray-500 text-xs px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                    Hi 👋 How can we help you today?
                  </span>
                </div>

                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="text-gray-400 text-xs">Send us a message to get started</p>
                  </div>
                )}

                {messages.map((m, i) => <MessageBubble key={i} message={m} />)}

                {sending && <TypingDots />}
              </>
            )}
          </div>

          {/* Input bar */}
          {user && (
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message…"
                disabled={sending}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="w-10 h-10 flex-shrink-0 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-7-9-7-9 7 9 7z" transform="rotate(90 12 12)" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;