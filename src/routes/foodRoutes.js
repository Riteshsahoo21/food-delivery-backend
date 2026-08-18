const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  createMenuItem,
  toggleAvailability,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getMenuItems);
router.post('/', protect, authorize('vendor', 'admin'), createMenuItem);
router.patch('/:id/availability', protect, authorize('vendor', 'admin'), toggleAvailability);

module.exports = router;
