import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(
    user?.addresses?.find(a => a.isDefault) || { name: user?.name || '', phone: user?.phone || '', street: '', city: '', state: '', pincode: '' }
  );

  const shipping = totalPrice >= 999 ? 0 : 79;
  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + shipping + tax;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all address fields'); return;
    }
    setStep(2);
  };

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.url || '',
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      if (paymentMethod === 'cod') {
        const res = await orderAPI.create({
          shippingAddress: address, paymentMethod: 'cod',
          items: orderItems, itemsPrice: totalPrice,
          shippingPrice: shipping, taxPrice: tax, totalPrice: grandTotal,
        });
        await clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate(`/orders/${res.data.order._id}`);
        return;
      }

      // Razorpay flow
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment gateway failed to load'); return; }

      const razorRes = await orderAPI.createRazorpay({ amount: grandTotal });
      const { order: rzpOrder, key } = razorRes.data;

      // Create our order first
      const ourOrderRes = await orderAPI.create({
        shippingAddress: address, paymentMethod: 'razorpay',
        items: orderItems, itemsPrice: totalPrice,
        shippingPrice: shipping, taxPrice: tax, totalPrice: grandTotal,
      });
      const ourOrder = ourOrderRes.data.order;

      const options = {
        key,
        amount: rzpOrder.amount,
        currency: 'INR',
        name: 'Zuri Fashion',
        description: `Order #${ourOrder.orderNumber}`,
        order_id: rzpOrder.id,
        prefill: { name: user.name, email: user.email, contact: address.phone },
        theme: { color: '#e11d48' },
        handler: async (response) => {
          try {
            await orderAPI.verifyRazorpay({
              ...response,
              orderId: ourOrder._id,
            });
            await clearCart();
            toast.success('Payment successful! 🎉');
            navigate(`/orders/${ourOrder._id}`);
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-10">
        {[['1', 'Address'], ['2', 'Payment'], ['3', 'Confirm']].map(([num, label], i) => (
          <React.Fragment key={num}>
            <div className={`flex items-center gap-2 ${step >= Number(num) ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step >= Number(num) ? 'border-gray-600 bg-gray-600 text-white' : 'border-gray-300'}`}>{num}</div>
              <span className="text-sm font-medium hidden sm:block">{label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-3 ${step > Number(num) ? 'bg-gray-600' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-5">Delivery Address</h2>

              {/* Saved addresses */}
              {user?.addresses?.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm text-gray-600 mb-3 font-medium">Saved Addresses</p>
                  <div className="grid gap-3">
                    {user.addresses.map((addr, i) => (
                      <button key={i} onClick={() => setAddress(addr)}
                        className={`text-left p-3 rounded-xl border-2 text-sm transition-colors ${JSON.stringify(address) === JSON.stringify(addr) ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-rose-300'}`}>
                        <p className="font-medium">{addr.name} · {addr.phone}</p>
                        <p className="text-gray-500">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3 mb-2">Or enter a new address:</p>
                </div>
              )}

              <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Enter full name', col: 1 },
                  { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', col: 1 },
                  { key: 'street', label: 'Street Address', placeholder: 'House no, street, area', col: 2 },
                  { key: 'city', label: 'City', placeholder: 'City', col: 1 },
                  { key: 'state', label: 'State', placeholder: 'State', col: 1 },
                  { key: 'country', label: 'country', placeholder: 'country', col: 1 },
                  { key: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', col: 1 },

                ].map(field => (
                  <div key={field.key} className={field.col === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input type="text" value={address[field.key] || ''} onChange={e => setAddress(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary w-full py-3.5 text-base">Continue to Payment →</button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-5">Payment Method</h2>

              <div className="space-y-3 mb-6">
                {[
                  { value: 'razorpay', label: 'Pay Online', desc: 'UPI, PhonePe, Paytm, Cards, Net Banking', icon: '💳' },
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                ].map(method => (
                  <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === method.value ? 'border-gray-500 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)} className="text-gray-600" />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'razorpay' && (
                <div className="bg-blue-50 rounded-xl p-4 mb-5 text-sm text-blue-700">
                  <p className="font-medium mb-1">🔒 Secure Payment via Razorpay</p>
                  <p className="text-xs text-blue-600">Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline py-3 px-6">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3 text-base">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-5">Order Confirmation</h2>

              <div className="mb-5 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Delivering to:</p>
                <p className="text-sm text-gray-800 font-semibold">{address.name} · {address.phone}</p>
                <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
              </div>

              <div className="mb-5 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-1">Payment:</p>
                <p className="text-sm text-gray-800 font-semibold">{paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment (Razorpay)'}</p>
              </div>

              <div className="space-y-3 mb-5">
                {cart.items.map(item => (
                  <div key={item._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                    <img src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100'} alt={item.product?.name}
                      className="w-12 h-14 object-cover rounded-lg" onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline py-3 px-6">← Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3.5 text-base disabled:opacity-50">
                  {loading ? '⏳ Processing...' : paymentMethod === 'cod' ? '🎉 Place Order' : '💳 Pay ₹' + grandTotal.toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (GST 5%)</span><span>₹{tax}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
            </div>
            <div className="space-y-2">
              {cart.items.slice(0, 3).map(item => (
                <div key={item._id} className="flex items-center gap-2">
                  <img src={item.product?.images?.[0]?.url} alt="" className="w-10 h-12 object-cover rounded-lg"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.product?.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {cart.items.length > 3 && <p className="text-xs text-gray-400 text-center">+{cart.items.length - 3} more items</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
