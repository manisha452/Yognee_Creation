import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700',
};

const statusIcons = { pending: '⏳', confirmed: '✅', processing: '⚙️', shipped: '🚚', delivered: '🎉', cancelled: '❌', returned: '↩️' };

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMy()
      .then(res => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-36 rounded-2xl shimmer-bg" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">{orders.length} orders total</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📦</div>
          <h2 className="font-display text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Your orders will appear here once you shop</p>
          <Link to="/collection" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow card-hover">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Order #{order.orderNumber}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {statusIcons[order.orderStatus]} {order.orderStatus}
                  </span>
                  <span className="font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100'}
                      alt={item.name} className="w-12 h-14 object-cover rounded-lg border-2 border-white"
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100'} />
                  ))}
                  {order.items?.length > 3 && <div className="w-12 h-14 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">+{order.items.length - 3}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 line-clamp-1">{order.items?.map(i => i.name).join(', ')}</p>
                  <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length > 1 ? 's' : ''} · {order.paymentMethod?.toUpperCase()}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
