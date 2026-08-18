const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
require('dotenv').config();

async function fixOrderPhones() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const orders = await Order.find().populate('customer');
  console.log(`Processing ${orders.length} orders...`);

  let count = 0;
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    const generatedPhone = `98610${String(10000 + i).slice(-5)}`;

    const currentPhone =
      o.deliveryAddress?.contactPhone ||
      o.customer?.phone ||
      generatedPhone;

    const currentName =
      o.deliveryAddress?.contactName ||
      o.customer?.name ||
      'Customer';

    o.deliveryAddress = {
      ...(o.deliveryAddress ? o.deliveryAddress.toObject() : {}),
      contactName: currentName,
      contactPhone: currentPhone
    };

    await o.save();
    count++;
  }

  console.log(`Successfully updated ${count} orders with valid contact phones & names.`);
  await mongoose.disconnect();
}

fixOrderPhones().catch(console.error);
