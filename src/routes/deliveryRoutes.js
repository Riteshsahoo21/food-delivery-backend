const express = require('express');
const router = express.Router();
const {
  getDeliveryOrders,
  acceptDeliveryOrder,
  updateDeliveryStep,
  updateLocation,
  getDeliveryStats,
  toggleOnlineStatus,
  registerDriverKyc,
  getDriverKycStatus,
  updateDeliveryZone,
  getDriverProfile,
  updateDriverProfile,
} = require('../controllers/deliveryController');
const { optionalProtect } = require('../middlewares/auth');

// Allow driver operations with optional token or active session
router.post('/register-kyc', optionalProtect, registerDriverKyc);
router.get('/kyc-status', optionalProtect, getDriverKycStatus);
router.get('/profile', optionalProtect, getDriverProfile);
router.put('/profile', optionalProtect, updateDriverProfile);
router.get('/orders', optionalProtect, getDeliveryOrders);
router.post('/orders/:id/accept', optionalProtect, acceptDeliveryOrder);
router.patch('/orders/:id/status', optionalProtect, updateDeliveryStep);
router.post('/update-location', optionalProtect, updateLocation);
router.get('/stats', optionalProtect, getDeliveryStats);
router.patch('/toggle-status', optionalProtect, toggleOnlineStatus);
router.patch('/zone', optionalProtect, updateDeliveryZone);

module.exports = router;
