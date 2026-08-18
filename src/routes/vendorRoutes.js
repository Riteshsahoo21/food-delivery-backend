const express = require('express');
const router = express.Router();
const {
  getVendorProfile,
  updateVendorProfile,
  onboardVendor,
  getVendorMenu,
  createVendorMenuItem,
  updateVendorMenuItem,
  deleteVendorMenuItem,
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorSettlements,
} = require('../controllers/vendorController');
const { optionalProtect } = require('../middlewares/auth');

// Apply optionalProtect so logged-in vendor's own restaurant is identified
router.use(optionalProtect);

// Vendor Profile & KYC Onboarding
router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);
router.post('/onboard', onboardVendor);

// Menu Management
router.get('/menu', getVendorMenu);
router.post('/menu', createVendorMenuItem);
router.put('/menu/:id', updateVendorMenuItem);
router.patch('/menu/:id/availability', updateVendorMenuItem);
router.delete('/menu/:id', deleteVendorMenuItem);

// Orders & Live Kitchen Status
router.get('/orders', getVendorOrders);
router.patch('/orders/:id/status', updateVendorOrderStatus);

// Financial Settlements & Ledger
router.get('/settlements', getVendorSettlements);

module.exports = router;
