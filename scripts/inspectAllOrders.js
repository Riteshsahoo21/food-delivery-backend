const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function inspectOrders() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Order = require('../src/models/Order');
  const Restaurant = require('../src/models/Restaurant');

  const orders = await Order.find().populate('restaurant', 'name address coordinates').sort({ createdAt: -1 });
  console.log(`Found ${orders.length} total orders in DB:\n`);

  orders.forEach((o) => {
    console.log(`Order #${o.orderNumber} (${o._id}):`);
    console.log(`   Status: ${o.orderStatus}`);
    console.log(`   Restaurant: ${o.restaurant?.name} (${o.restaurant?.address})`);
    console.log(`   Delivery Partner: ${o.deliveryPartner}`);
    console.log(`   Total: ₹${o.totalAmount}`);
    console.log('--------------------------------------------------');
  });

  process.exit(0);
}

inspectOrders().catch(err => {
  console.error(err);
  process.exit(1);
});
