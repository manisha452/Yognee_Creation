import React from 'react';
import { Link } from 'react-router-dom';

const statusColors = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100   text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100  text-green-700',
  cancelled:  'bg-red-100    text-red-700',
};

const OrdersPanel = ({ recentOrders = [], ordersByStatus = [] }) => {
  const total = ordersByStatus.reduce((a, s) => a + s.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Recent orders table */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-rose-600 hover:underline">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-2.5">
            {recentOrders.slice(0, 6).map(order => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">₹{order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders by status with progress bars */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Orders by Status</h2>
        {ordersByStatus.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {ordersByStatus.map(s => {
              const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
              return (
                <div key={s._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${statusColors[s._id] || 'bg-gray-100 text-gray-600'}`}>
                      {s._id}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">{s.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-rose-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPanel;