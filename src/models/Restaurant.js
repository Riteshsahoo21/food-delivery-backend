const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please provide restaurant name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
    },
    cuisines: {
      type: [String],
      required: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingCount: {
      type: String,
      default: '100+',
    },
    deliveryTime: {
      type: String,
      default: '25-30 mins',
    },
    distance: {
      type: String,
      default: '2.0 km',
    },
    deliveryFee: {
      type: Number,
      default: 29,
    },
    minOrder: {
      type: Number,
      default: 150,
    },
    priceForTwo: {
      type: String,
      default: '₹400 for two',
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    topRated: {
      type: Boolean,
      default: false,
    },
    offer: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    kyc: {
      fssaiLicense: String,
      gstin: String,
      panCard: String,
      documentUrls: [String],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    commissionPercentage: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
