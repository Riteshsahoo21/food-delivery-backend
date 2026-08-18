const express = require('express');
const router = express.Router();
const {
  getDashboardKPIs,
  getAllAdminRestaurants,
  getAllAdminRiders,
  getSingleAdminRider,
  updateRestaurantStatus,
  updateRiderStatus,
  updateCommission,
} = require('../controllers/adminController');

router.get('/kpis', getDashboardKPIs);
router.get('/restaurants', getAllAdminRestaurants);
router.get('/riders', getAllAdminRiders);
router.get('/riders/:id', getSingleAdminRider);
router.patch('/restaurants/:id/status', updateRestaurantStatus);
router.patch('/riders/:id/status', updateRiderStatus);
router.patch('/settings/commission', updateCommission);

module.exports = router;
