import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, updateItem, removeItem, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice >= 999 ? 0 : 79;
  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + shipping + tax;

  const handleCheckout = () => {
    if (!user) { toast.error('Please login to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (!cart?.items?.length) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-7xl mb-4">🛍️</div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
        <Link to="/collection" className="btn-primary">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item._id} className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm">
                <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                  <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200'}
                    alt={product.name} className="w-24 h-28 object-cover rounded-xl"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200'} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-medium text-gray-800 text-sm hover:text-rose-600 line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-full px-1">
                      <button onClick={() => item.quantity > 1 ? updateItem(item._id, item.quantity - 1) : removeItem(item._id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-rose-600 text-lg">−</button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateItem(item._id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-rose-600 text-lg">+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                      {item.quantity > 1 && <div className="text-xs text-gray-400">₹{item.price} each</div>}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem(item._id)} className="self-start text-gray-300 hover:text-red-400 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5% GST)</span>
                <span>₹{tax}</span>
              </div>
              {shipping > 0 && (
                <div className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">
                  Add ₹{(999 - totalPrice).toLocaleString()} more for FREE shipping!
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="w-full btn-primary mt-6 py-3.5 text-base">
              Proceed to Checkout →
            </button>
            <Link to="/collection" className="block text-center text-sm text-gray-500 hover:text-rose-600 mt-3">← Continue Shopping</Link>

            {/* Trust badges */}
            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
              {[['🔒', 'Secure'], ['↩️', '7-Day Return'], ['🚚', 'Fast Ship']].map(([icon, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl">{icon}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
