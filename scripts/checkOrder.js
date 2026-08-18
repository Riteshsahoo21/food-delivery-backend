const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function testOrder() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Order = require('../src/models/Order');

  const orderId = '6a841873be89b03059bc5eb3';
  const order = await Order.findById(orderId);
  console.log('Order in DB for id', orderId, ':', order ? {
    id: order._id,
    orderNumber: order.orderNumber,
    status: order.orderStatus,
  } : 'NOT FOUND');

  if (!order) {
    console.log('--- RECENT ORDERS IN DB ---');
    const recent = await Order.find().sort({ createdAt: -1 }).limit(5);
    console.log(recent.map(o => ({ id: o._id, orderNumber: o.orderNumber, status: o.orderStatus })));
  }

  process.exit(0);
}

testOrder().catch(err => {
  console.error(err);
  process.exit(1);
});
