// pages/admin/AdminChat.jsx
//
// Premium support-inbox style layout: left = conversation list,
// right = full thread + reply box. Mirrors the Shopify inbox pattern.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminChatAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const fmtTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const SENDER_STYLES = {
  user:  { align: 'justify-start', bubble: 'bg-gray-100 text-gray-800 rounded-bl-md',          label: null },
  bot:   { align: 'justify-end',   bubble: 'bg-blue-50 text-blue-700 border border-blue-100 rounded-br-md', label: '🤖 Auto-reply' },
  admin: { align: 'justify-end',   bubble: 'bg-rose-600 text-white rounded-br-md',              label: '🧑‍💼 You' },
};

/* ─── Conversation list item (left panel) ───────────────────────── */
const ConversationItem = ({ chat, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 border-b border-gray-50 transition-colors relative
      ${isActive ? 'bg-rose-50' : 'hover:bg-gray-50'}`}
  >
    {chat.unreadCount > 0 && (
      <span className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full" />
    )}
    <div className="flex items-center justify-between mb-1 pr-4">
      <p className="text-sm font-semibold text-gray-900 truncate">{chat.user?.name || 'Unknown'}</p>
      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{fmtDate(chat.lastMessageAt)}</span>
    </div>
    <p className="text-xs text-gray-500 truncate pr-4">{chat.lastMessage || 'No messages yet'}</p>
    <div className="flex items-center gap-2 mt-2">
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize
        ${chat.status === 'open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
        {chat.status}
      </span>
      {chat.unreadCount > 0 && (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500 text-white">
          {chat.unreadCount} new
        </span>
      )}
    </div>
  </button>
);

/* ─── Message bubble (right panel) ───────────────────────────────── */
const AdminMessageBubble = ({ message }) => {
  const s = SENDER_STYLES[message.sender] || SENDER_STYLES.user;
  return (
    <div className={`flex ${s.align} mb-3`}>
      <div className="max-w-[70%]">
        {s.label && <p className="text-[10px] text-gray-400 mb-1 text-right">{s.label}</p>}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${s.bubble}`}>
          {message.text}
        </div>
        <p className={`text-[10px] text-gray-400 mt-1 ${s.align === 'justify-end' ? 'text-right' : ''}`}>
          {fmtTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

/* ─── Skeleton for inbox list ─────────────────────────────────────── */
const ListSkeleton = () => (
  <div className="divide-y divide-gray-50">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="p-4 animate-pulse space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-24" />
        <div className="h-3 bg-gray-100 rounded w-40" />
        <div className="h-4 bg-gray-100 rounded-full w-14" />
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   ADMIN CHAT PAGE
══════════════════════════════════════════════════════════════════ */
const AdminChat = () => {
  const [chats, setChats]             = useState([]);
  const [pagination, setPagination]   = useState({});
  const [loadingList, setLoadingList] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage]               = useState(1);

  const [activeChat, setActiveChat]       = useState(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyText, setReplyText]         = useState('');
  const [sendingReply, setSendingReply]   = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const scrollRef = useRef(null);

  /* ── Fetch inbox list ───────────────────────────────────────────── */
  const fetchChats = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await adminChatAPI.getAll({ page, limit: 20, status: filterStatus });
      setChats(res.data.chats || []);
      setPagination(res.data.pagination || {});
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      setLoadingList(false);
    }
  }, [page, filterStatus]);

  useEffect(() => { fetchChats(); }, [fetchChats]);

  // Light polling to surface new incoming messages
  useEffect(() => {
    const interval = setInterval(fetchChats, 15000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  /* ── Open a conversation ───────────────────────────────────────── */
  const openChat = async (chatId) => {
    setLoadingThread(true);
    try {
      const res = await adminChatAPI.getOne(chatId);
      setActiveChat(res.data.chat);
      // Optimistically clear the unread badge in the list too
      setChats(prev => prev.map(c => (c._id === chatId ? { ...c, unreadCount: 0 } : c)));
    } catch {
      toast.error('Failed to load conversation');
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat]);

  /* ── Send admin reply ──────────────────────────────────────────── */
  const handleReply = async (e) => {
    e.preventDefault();
    const text = replyText.trim();
    if (!text || !activeChat) return;

    setSendingReply(true);
    try {
      const res = await adminChatAPI.reply(activeChat._id, text);
      setActiveChat(res.data.chat);
      setReplyText('');
      // refresh list so lastMessage/lastMessageAt reflect the new reply
      fetchChats();
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  /* ── Toggle open/closed ────────────────────────────────────────── */
  const handleStatusToggle = async () => {
    if (!activeChat) return;
    const newStatus = activeChat.status === 'open' ? 'closed' : 'open';
    setUpdatingStatus(true);
    try {
      const res = await adminChatAPI.updateStatus(activeChat._id, newStatus);
      setActiveChat(res.data.chat);
      toast.success(`Conversation marked as ${newStatus}`);
      fetchChats();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filterTabs = [
    ['', 'All'],
    ['open', 'Open'],
    ['closed', 'Closed'],
  ];

  return (
    <div className="space-y-5 animate-fade-in h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Support Chat</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {pagination.total !== undefined ? `${pagination.total} conversations` : 'Customer conversations'}
        </p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex" style={{ minHeight: '600px' }}>

        {/* ── LEFT PANEL: conversation list ─────────────────────── */}
        <div className={`${activeChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 flex-col border-r border-gray-100 flex-shrink-0`}>

          {/* Filter tabs */}
          <div className="flex gap-1.5 p-3 border-b border-gray-100">
            {filterTabs.map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setFilterStatus(val); setPage(1); }}
                className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                  ${filterStatus === val ? 'bg-rose-600 text-white shadow-sm shadow-rose-200' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <ListSkeleton />
            ) : chats.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-400 text-sm">No conversations yet</p>
              </div>
            ) : (
              chats.map(chat => (
                <ConversationItem
                  key={chat._id}
                  chat={chat}
                  isActive={activeChat?._id === chat._id}
                  onClick={() => openChat(chat._id)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-1.5 p-3 border-t border-gray-100">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                    ${page === p ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: conversation thread ──────────────────── */}
        <div className={`${activeChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col min-w-0`}>
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="text-5xl mb-3">👈</div>
              <p className="text-gray-500 font-medium">Select a conversation</p>
              <p className="text-gray-400 text-sm mt-1">Choose a customer from the list to view their messages</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="lg:hidden text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    ←
                  </button>
                  <div className="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm flex-shrink-0">
                    {activeChat.user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{activeChat.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{activeChat.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleStatusToggle}
                  disabled={updatingStatus}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex-shrink-0 capitalize disabled:opacity-50
                    ${activeChat.status === 'open'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'}`}
                >
                  {updatingStatus ? '…' : activeChat.status === 'open' ? 'Mark Closed' : 'Reopen Chat'}
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50/50">
                {loadingThread ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                        <div className="h-10 w-48 bg-gray-100 rounded-2xl animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : activeChat.messages?.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">No messages in this conversation yet</p>
                ) : (
                  activeChat.messages?.map((m, i) => <AdminMessageBubble key={i} message={m} />)
                )}
              </div>

              {/* Reply box */}
              <form onSubmit={handleReply} className="flex items-center gap-2 p-4 border-t border-gray-100 flex-shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply…"
                  disabled={sendingReply}
                  className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all disabled:bg-gray-50"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sendingReply}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-colors flex-shrink-0"
                >
                  {sendingReply ? 'Sending…' : 'Send Reply'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;