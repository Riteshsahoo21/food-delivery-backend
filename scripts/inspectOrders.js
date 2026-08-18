const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
require('dotenv').config();

async function inspect() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const orders = await Order.find()
    .populate('customer', 'name phone email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  console.log(`Found ${orders.length} orders:`);
  for (const o of orders) {
    console.log({
      id: o._id,
      orderNumber: o.orderNumber,
      restaurant: o.restaurant?.name,
      customerName: o.customer?.name,
      customerPhone: o.customer?.phone,
      deliveryContactName: o.deliveryAddress?.contactName,
      deliveryContactPhone: o.deliveryAddress?.contactPhone,
      deliveryAddressString: o.deliveryAddress?.address,
      grandTotal: o.grandTotal
    });
  }

  await mongoose.disconnect();
}

inspect().catch(console.error);
