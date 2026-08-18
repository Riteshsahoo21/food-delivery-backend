const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      default: 'Foodie Enthusiast',
    },
    customerAvatar: String,
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    restaurantRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    restaurantReview: {
      type: String,
      default: '',
    },
    restaurantTags: [String],
    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    deliveryReview: {
      type: String,
      default: '',
    },
    deliveryTags: [String],
    driverTip: {
      type: Number,
      default: 0,
    },
    itemRatings: [
      {
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: String,
        rating: { type: Number, min: 1, max: 5 },
        review: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
