const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: String,
        price: Number,
        unitPrice: Number,
        quantity: Number,
        isVeg: Boolean,
        addons: [{ name: String, price: Number }],
        instructions: String,
      },
    ],
    itemTotal: { type: Number, required: true },
    packagingFee: { type: Number, default: 15 },
    deliveryFee: { type: Number, default: 25 },
    distanceKm: { type: Number, default: 2.5 },
    driverEarnings: {
      basePay: { type: Number, default: 30 },
      distancePay: { type: Number, default: 25 },
      heavyOrderBonus: { type: Number, default: 0 },
      tip: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 55 },
    },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    couponApplied: {
      code: String,
      discountAmount: Number,
    },
    deliveryAddress: {
      type: { type: String, default: 'Home' },
      title: String,
      address: String,
      contactName: String,
      contactPhone: String,
      lat: Number,
      lng: Number,
      instructions: String,
    },
    riderLocation: {
      lat: Number,
      lng: Number,
      heading: Number,
      distanceRemaining: String,
      durationRemaining: String,
      updatedAt: Date,
    },
    paymentMethod: {
      type: String,
      enum: ['RAZORPAY', 'COD', 'UPI', 'CARD', 'NETBANKING'],
      default: 'RAZORPAY',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    orderStatus: {
      type: String,
      enum: [
        'ORDER_PLACED',
        'ACCEPTED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'ORDER_PLACED',
    },
    timeline: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    chatMessages: [
      {
        id: String,
        sender: { type: String, enum: ['user', 'rider'], default: 'user' },
        senderName: String,
        text: String,
        time: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    cancellationReason: String,
    review: {
      restaurantRating: { type: Number, min: 1, max: 5 },
      restaurantReview: { type: String, default: '' },
      restaurantTags: [String],
      deliveryRating: { type: Number, min: 1, max: 5 },
      deliveryReview: { type: String, default: '' },
      deliveryTags: [String],
      driverTip: { type: Number, default: 0 },
      itemRatings: [
        {
          menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
          name: String,
          rating: { type: Number, min: 1, max: 5 },
          review: String,
        },
      ],
      isRestaurantRated: { type: Boolean, default: false },
      areItemsRated: { type: Boolean, default: false },
      isDeliveryRated: { type: Boolean, default: false },
      isRated: { type: Boolean, default: false },
      ratedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
