require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../src/models/Order');

async function cleanOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery');
    console.log('Connected to MongoDB');

    // Find the latest order
    const allOrders = await Order.find({}).sort({ createdAt: -1 });
    console.log('Total orders currently in DB:', allOrders.length);

    if (allOrders.length <= 1) {
      console.log('Already 1 or 0 orders. Nothing to delete.');
      await mongoose.disconnect();
      return;
    }

    // Identify the latest customer order (prefer recent active placed order ORD-308057 or latest)
    const latestOrder = allOrders.find(o => o.orderNumber === 'ORD-308057' || o.orderStatus !== 'DELIVERED') || allOrders[0];
    console.log('Retaining single latest order:', latestOrder._id, latestOrder.orderNumber, latestOrder.orderStatus);

    const deleteResult = await Order.deleteMany({ _id: { $ne: latestOrder._id } });
    console.log('Deleted old orders count:', deleteResult.deletedCount);

    const remainingOrders = await Order.find({});
    console.log('Remaining orders in DB:', remainingOrders.length);
    remainingOrders.forEach(o => {
      console.log('->', o._id, o.orderNumber, o.orderStatus, o.createdAt);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error cleaning orders:', err);
  }
}

cleanOrders();
