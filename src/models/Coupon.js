const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: { type: String, required: true },
    subtitle: String,
    badge: String,
    discountPercent: Number,
    flatDiscount: Number,
    maxDiscount: Number,
    minOrder: { type: Number, default: 0 },
    freeDelivery: { type: Boolean, default: false },
    bogo: { type: Boolean, default: false },
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    expiryDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
