const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items, itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice } = req.body;

    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No order items' });

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      discountAmount: discountAmount || 0,
      totalPrice,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug').populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/orders/razorpay/create
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ success: true, order: razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/orders/razorpay/verify
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: 'confirmed',
      paymentResult: { razorpay_order_id, razorpay_payment_id, razorpay_signature, status: 'paid' },
      $push: { statusHistory: { status: 'confirmed', note: 'Payment verified' } }
    }, { new: true });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: GET /api/orders/admin/all
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query)
    ]);
    res.json({ success: true, orders, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const update = {
      orderStatus: status,
      $push: { statusHistory: { status, note: note || `Status updated to ${status}` } }
    };
    if (status === 'delivered') { update.isDelivered = true; update.deliveredAt = Date.now(); }
    if (trackingNumber) update.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true }).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrder, createRazorpayOrder, verifyRazorpayPayment, getAllOrders, updateOrderStatus };
