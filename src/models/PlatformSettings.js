const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    commissionPercentage: {
      type: Number,
      default: 15,
    },
    baseDeliveryCharge: {
      type: Number,
      default: 29,
    },
    chargePerKm: {
      type: Number,
      default: 10,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 500,
    },
    packagingCharge: {
      type: Number,
      default: 25,
    },
    taxPercentage: {
      type: Number,
      default: 5,
    },
    appName: {
      type: String,
      default: 'FeastFleet',
    },
    contactEmail: {
      type: String,
      default: 'support@feastfleet.com',
    },
    contactPhone: {
      type: String,
      default: '+91 (800) 456-7890',
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.PlatformSettings ||
  mongoose.model('PlatformSettings', platformSettingsSchema);
