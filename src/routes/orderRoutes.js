const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrderChat,
  sendOrderChatMessage,
} = require('../controllers/orderController');
const { protect, optionalProtect } = require('../middlewares/auth');

router.post('/', protect, createOrder);
router.post('/:id/verify-payment', protect, verifyPayment);
router.get('/my-orders', optionalProtect, getMyOrders);
router.get('/:id/chat', optionalProtect, getOrderChat);
router.post('/:id/chat', optionalProtect, sendOrderChatMessage);
router.get('/:id', getOrderById);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
