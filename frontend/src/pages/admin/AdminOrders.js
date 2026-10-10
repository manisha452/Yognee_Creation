import React, { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { orderAPI, STATUS_STYLES, fmt } from '../../utils/api';
import TrackingSection from '../../pages/admin/Trackingsection';

/* ─── Constants ─────────────────────────────────────────────────── */
// Updated status set per new fulfillment model:
// pending   = order placed, seller hasn't processed yet
// unshipped = seller accepted, product not yet dispatched
// delivered = customer has received the order
// cancelled = order cancelled by customer or seller
// returned  = customer returned a delivered product
const ORDER_STATUSES = ['pending', 'unshipped', 'delivered', 'cancelled', 'returned'];

// Allowed status transitions (drives the "Update Order Status" dropdown options).
// Current status is always included so the admin can leave it unchanged.
//   pending   -> unshipped, cancelled
//   unshipped -> delivered, cancelled
//   delivered -> returned
//   cancelled -> (terminal)
//   returned  -> (terminal)
const STATUS_TRANSITIONS = {
  pending:   ['pending', 'unshipped', 'cancelled'],
  unshipped: ['unshipped', 'delivered', 'cancelled'],
  delivered: ['delivered', 'returned'],
  cancelled: ['cancelled'],
  returned:  ['returned'],
};

const PAYMENT_COLORS = {
  paid:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  unpaid:  'bg-red-50 text-red-600 border border-red-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
};

// Date filter options for the Orders page. Value is sent to the API as
// `dateFilter` alongside page/limit/status. Logic is unchanged — only the
// control used to pick a value (dropdown instead of tabs) has changed.
const DATE_FILTERS = [
  ['today',     'Today'],
  ['yesterday', 'Yesterday'],
  ['last7',     'Last 7 Days'],
  ['last15',    'Last 15 Days'],
  ['last30',    'Last 30 Days'],
  ['older',     'Older'],
];

/* ─── Skeleton Card ─────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="w-[52px] h-[68px] bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-20" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
      <div className="hidden sm:flex flex-col items-center gap-1.5">
        <div className="h-3 bg-gray-100 rounded w-16" />
        <div className="h-5 bg-gray-100 rounded-full w-12" />
      </div>
      <div className="flex flex-col items-end gap-1.5 ml-auto">
        <div className="h-5 bg-gray-100 rounded-full w-20" />
        <div className="h-4 bg-gray-100 rounded w-16" />
        <div className="h-4 bg-gray-100 rounded w-4" />
      </div>
    </div>
  </div>
);

/* ─── Status Badge ──────────────────────────────────────────────── */
// const StatusBadge = ({ status, size = 'sm' }) => {
//   const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium capitalize
//       ${size === 'sm' ? 'text-xs' : 'text-sm'} ${s.badge}`}>
//       <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
//       {status}
//     </span>
//   );
// };

/* ─── Product Row ───────────────────────────────────────────────── */
const ProductRow = ({ item, isLast }) => (
  <div className={`flex gap-3 ${!isLast ? 'pb-3 mb-3 border-b border-gray-50' : ''}`}>
    <img
      src={item.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80'}
      alt={item.name}
      className="w-[70px] h-[90px] object-cover rounded-xl flex-shrink-0 bg-gray-50"
      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80'; }}
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1.5">{item.name}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
        {item.size  && <span>Size: <span className="text-gray-700 font-medium">{item.size}</span></span>}
        {item.color && <span>Color: <span className="text-gray-700 font-medium">{item.color}</span></span>}
        <span>Qty: <span className="text-gray-700 font-medium">{item.quantity}</span></span>
      </div>
      <p className="text-xs text-gray-400 mt-1">Total: <span className="text-gray-700 font-semibold">₹{fmt(item.price * item.quantity)}</span></p>
    </div>
  </div>
);

/* ─── Order Card ────────────────────────────────────────────────── */
const OrderCard = ({ order: initialOrder }) => {
  const [order, setOrder]           = useState(initialOrder);
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [, setNow] = useState(Date.now());
  const [statusForm, setStatusForm] = useState({
    status:         initialOrder.orderStatus || '',
    note:           '',
    trackingNumber: initialOrder.trackingNumber || '',
  });

  useEffect(() => {
    setOrder(initialOrder);
    setStatusForm(prev => ({
      ...prev,
      status:         initialOrder.orderStatus || '',
      trackingNumber: initialOrder.trackingNumber || '',
    }));
  }, [initialOrder]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const items         = order.items || [];
  const firstItem     = items[0];
  const paymentStatus = order.isPaid ? 'paid' : 'unpaid';

  // Only the statuses reachable from the order's current status are selectable.
  // Falls back to the full list if the current status isn't recognized.
  const selectableStatuses = STATUS_TRANSITIONS[order.orderStatus] || ORDER_STATUSES;
  const isTerminalStatus   = selectableStatuses.length === 1 && selectableStatuses[0] === order.orderStatus;

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusForm.status) { toast.error('Select a status'); return; }
    if (!selectableStatuses.includes(statusForm.status)) {
      toast.error('That status change is not allowed from the current status');
      return;
    }
    setUpdatingStatus(true);
    try {
      const res = await orderAPI.updateStatus(order._id, statusForm);
      setOrder(res.data.order);
      toast.success('Order updated successfully!');
      setStatusForm(prev => ({ ...prev, note: '' }));
    } catch {
      toast.error('Failed to update order');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getTimeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return "Just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week ago`;

    const months = Math.floor(days / 30);
    return `${months} month ago`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

      {/* ── COLLAPSED HEADER — always visible ─────────────────────── */}
      <div
        className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 cursor-pointer select-none"
        onClick={() => setIsExpanded(p => !p)}
      >
        {/* Product thumbnail */}
        <img
          src={firstItem?.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80'}
          alt={firstItem?.name || 'Product'}
          className="w-[52px] h-[68px] object-cover rounded-xl flex-shrink-0 bg-gray-50"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80'; }}
        />

        {/* Left: order + customer info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900 tracking-tight">#{order.orderNumber}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{items.length} product{items.length !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{getTimeAgo(order.createdAt)}</p>
          <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">{order.user?.name}</p>
        </div>

        {/* Center: payment — hidden on very small screens */}
        <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0">
          {/* <span className="text-xs text-gray-500 capitalize">
            {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
          </span> */}
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${PAYMENT_COLORS[paymentStatus]}`}>
            {paymentStatus}
          </span>
        </div>

        {/* Right: status + total + chevron */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-auto sm:ml-0">
          {/* <StatusBadge status={order.orderStatus} /> */}
          <span className="text-sm font-bold text-gray-900">₹{fmt(order.totalPrice)}</span>
          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── EXPANDED DETAILS — scrollable, capped height ───────────── */}
      {isExpanded && (
        <div
          className="border-t border-gray-100 bg-gray-50/40 overflow-y-auto max-h-[80vh]
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-gray-300"
        >
          <div className="p-4 sm:p-5 space-y-4">

            {/* ROW 1 — Products (65%) + Shipping Address (35%) */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Products Ordered */}
              <div className="lg:w-[65%] rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Products Ordered</p>
                <div className="max-h-[360px] overflow-y-auto pr-1
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-gray-200
                  [&::-webkit-scrollbar-thumb]:rounded-full">
                  {items.map((item, i) => (
                    <ProductRow key={i} item={item} isLast={i === items.length - 1} />
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="lg:w-[35%] rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Shipping Address</p>
                <p className="text-sm font-semibold text-gray-800">{order.shippingAddress?.name}</p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {order.shippingAddress?.street}
                </p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {[
                    order.shippingAddress?.city,
                    order.shippingAddress?.state,
                    order.shippingAddress?.country,
                  ].filter(Boolean).join(', ')}
                </p>
                {order.shippingAddress?.pincode && (
                  <p className="text-xs text-gray-600 mt-1">PIN: {order.shippingAddress.pincode}</p>
                )}
                {order.shippingAddress?.phone && (
                  <p className="text-xs text-gray-600 mt-0.5"><span className='font-bold'>Mob: </span>{order.shippingAddress.phone}</p>
                )}
              </div>
            </div>

            {/* ROW 3 — Tracking (now a standalone, reusable component) */}
            <TrackingSection
              history={order.statusHistory || []}
              trackingNumber={order.trackingNumber}
              isOpen={trackingOpen}
              onToggle={() => setTrackingOpen(prev => !prev)}
            />

            {/* ROW 4 — Update Status */}
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Update Order Status</p>
              {isTerminalStatus ? (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500">
                  This order is <span className="font-semibold capitalize">{order.orderStatus}</span> — no further status changes are available.
                </div>
              ) : (
                <form onSubmit={handleStatusUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={statusForm.status}
                    onChange={e => setStatusForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all capitalize cursor-pointer sm:col-span-2"
                  >
                    <option value="" disabled>Select new status…</option>
                    {selectableStatuses.map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">📦</span>
                    <input
                      type="text"
                      value={statusForm.trackingNumber}
                      onChange={e => setStatusForm(p => ({ ...p, trackingNumber: e.target.value }))}
                      placeholder="Tracking number (optional)"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-gray-400 text-sm pointer-events-none">📝</span>
                    <textarea
                      rows={1}
                      value={statusForm.note}
                      onChange={e => setStatusForm(p => ({ ...p, note: e.target.value }))}
                      placeholder="Admin note (optional)"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="sm:col-span-2 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-rose-200"
                  >
                    {updatingStatus ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Updating…
                      </>
                    ) : 'Update Status'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Date Filter Dropdown ──────────────────────────────────────── */
const DateFilterDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = DATE_FILTERS.find(([val]) => val === value)?.[1] || 'Filter by Time';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
      >
        {activeLabel}
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-10">
          {DATE_FILTERS.map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => { onChange(val); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-sm transition-colors
                ${value === val
                  ? 'text-rose-600 font-semibold bg-rose-50'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   ADMIN ORDERS PAGE
══════════════════════════════════════════════════════════════════ */
const AdminOrders = () => {
  const [orders, setOrders]         = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [dateFilter, setDateFilter] = useState('today');
  const [page, setPage]             = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAll({ page, limit: 10, status: filterStatus, dateFilter });
      setOrders(res.data.orders || []);
      setPagination(res.data.pagination || {});
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, dateFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // 'returned' stays in this same list/filter set, so selecting the
  // Returned tab continues to surface returned orders on this page.
  const filterTabs = ORDER_STATUSES.map(s => [s, s]);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Page title + Refresh + Date filter dropdown ──────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          {!loading && pagination.total !== undefined && (
            <p className="text-sm text-gray-400 mt-0.5">{pagination.total} orders total</p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh */}
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 104.583 9.582" />
            </svg>
            Refresh
          </button>

          {/* Filter by Time */}
          <DateFilterDropdown
            value={dateFilter}
            onChange={(val) => { setDateFilter(val); setPage(1); }}
          />
        </div>
      </div>

      {/* ── Status filter tabs (unchanged) ───────────────────────── */}
      <div className="flex gap-1.5 flex-wrap bg-white rounded-2xl p-2.5 border border-gray-100 shadow-sm overflow-x-auto">
        {filterTabs.map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setFilterStatus(val); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap
              ${filterStatus === val
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
          >
            {label}
            {val === '' && pagination.total ? (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${filterStatus === '' ? 'bg-rose-500' : 'bg-gray-100 text-gray-500'}`}>
                {pagination.total}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── Order cards ───────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
          {/* <div className="text-5xl mb-3">📭</div> */}
          <p className="text-gray-500 font-medium">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">No orders found for the selected date range.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────── */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            ‹
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && arr[i - 1] !== p - 1) acc.push('…');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '…' ? (
                <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
                    ${page === p
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {p}
                </button>
              )
            )}
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="w-9 h-9 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
