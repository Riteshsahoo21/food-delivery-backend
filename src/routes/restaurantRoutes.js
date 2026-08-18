const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  submitRestaurantKYC,
} = require('../controllers/restaurantController');
const { protect } = require('../middlewares/auth');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/kyc', protect, submitRestaurantKYC);

module.exports = router;
