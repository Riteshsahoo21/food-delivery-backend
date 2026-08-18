const Coupon = require('../models/Coupon');

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate coupon code against cart total
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (cartTotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ₹${coupon.minOrder} required for coupon ${coupon.code}`,
      });
    }

    let discount = 0;
    if (coupon.discountPercent) {
      const calculated = Math.round((cartTotal * coupon.discountPercent) / 100);
      discount = Math.min(calculated, coupon.maxDiscount || calculated);
    } else if (coupon.flatDiscount) {
      discount = coupon.flatDiscount;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        title: coupon.title,
        freeDelivery: coupon.freeDelivery,
        discountAmount: discount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
