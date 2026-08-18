require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../src/models/Order');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery');
  const res = await Order.updateMany(
    { orderStatus: 'DELIVERED' },
    { $set: { paymentStatus: 'PAID' } }
  );
  console.log('Successfully updated delivered orders paymentStatus to PAID:', res);
  await mongoose.disconnect();
}

run().catch(console.error);
