const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, createRazorpayOrder, verifyRazorpayPayment, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/admin/all', admin, getAllOrders);
router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.get('/:id', getOrder);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
