const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['Motorcycle', 'Scooter', 'Electric EV', 'Cycle'],
      default: 'Motorcycle',
    },
    vehicleModel: {
      type: String,
      default: 'Hero Splendor / TVS Apache',
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    licenseImage: {
      type: String,
      default: '',
    },
    rcImage: {
      type: String,
      default: '',
    },
    aadhaarNumber: {
      type: String,
      trim: true,
    },
    aadhaarFrontImage: {
      type: String,
      default: '',
    },
    aadhaarBackImage: {
      type: String,
      default: '',
    },
    panNumber: {
      type: String,
      trim: true,
    },
    panFrontImage: {
      type: String,
      default: '',
    },
    panBackImage: {
      type: String,
      default: '',
    },
    bankAccountNumber: {
      type: String,
      trim: true,
    },
    bankIfsc: {
      type: String,
      trim: true,
    },
    bankAccountHolder: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      default: 'Bhubaneswar',
    },
    deliveryZone: {
      type: String,
      default: 'Bhubaneswar Zone 1 (Patia / Master Canteen)',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      heading: Number,
      updatedAt: { type: Date, default: Date.now },
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    todayEarnings: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    pendingSettlement: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.DeliveryPartner ||
  mongoose.model('DeliveryPartner', deliveryPartnerSchema);
