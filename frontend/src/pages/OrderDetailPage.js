import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-purple-100 text-purple-700 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(res => setOrder(res.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12"><div className="h-96 rounded-2xl shimmer-bg" /></div>;
  if (!order) return <div className="text-center py-20"><h2 className="font-display text-2xl">Order not found</h2><Link to="/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link></div>;

  const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders" className="text-gray-400 hover:text-rose-600">← Orders</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">#{order.orderNumber}</span>
      </div>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Tracking Steps */}
      {order.orderStatus !== 'cancelled' && order.orderStatus !== 'returned' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-5">
          <h2 className="font-semibold text-gray-800 mb-5">Order Tracking</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div className="absolute top-4 left-0 h-0.5 bg-rose-500 z-0 transition-all" style={{ width: currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 100}%` : '0%' }} />
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i <= currentStep ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs capitalize font-medium ${i <= currentStep ? 'text-rose-600' : 'text-gray-400'}`}>{step}</span>
              </div>
            ))}
          </div>
          {order.trackingNumber && <p className="mt-4 text-sm text-gray-600">Tracking: <strong>{order.trackingNumber}</strong></p>}
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-5">
        <h2 className="font-semibold text-gray-800 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <img src={item.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100'} alt={item.name}
                className="w-14 h-16 object-cover rounded-lg" onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100'} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</p>
                <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                <p className="text-xs text-gray-500">₹{item.price} each</p>
              </div>
              <span className="font-semibold text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Delivery Address</h3>
          <p className="text-sm font-medium text-gray-800">{order.shippingAddress.name}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
          <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.street}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.pincode}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Payment Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>{order.isPaid ? '✓ Paid' : 'Pending'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>₹{order.taxPrice}</span></div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/collection" className="btn-primary">Continue Shopping</Link>
        <Link to="/orders" className="btn-outline">All Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
