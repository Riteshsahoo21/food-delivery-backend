const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const Restaurant = require('../src/models/Restaurant');
const User = require('../src/models/User');
require('dotenv').config();

async function checkLocations() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const restaurants = await Restaurant.find().select('name address coordinates');
  console.log('\n--- RESTAURANTS ---');
  for (const r of restaurants) {
    console.log(`${r.name}: ${r.address} => Coords:`, r.coordinates);
  }

  const drivers = await User.find({ role: 'delivery' }).select('name phone location');
  console.log('\n--- DRIVERS ---');
  for (const d of drivers) {
    console.log(`${d.name} (${d.phone}) => Location:`, d.location);
  }

  const recentOrders = await Order.find()
    .populate('restaurant', 'name address coordinates')
    .populate('deliveryPartner', 'name phone location')
    .populate('customer', 'name savedAddresses')
    .sort({ createdAt: -1 })
    .limit(5);

  console.log('\n--- RECENT ORDERS ---');
  for (const o of recentOrders) {
    console.log(`Order #${o.orderNumber} (${o.orderStatus}):`);
    console.log(`  Restaurant: ${o.restaurant?.name} =>`, o.restaurant?.coordinates, o.restaurant?.address);
    console.log(`  Customer DeliveryAddress:`, {
      title: o.deliveryAddress?.title,
      address: o.deliveryAddress?.address,
      lat: o.deliveryAddress?.lat,
      lng: o.deliveryAddress?.lng,
    });
    console.log(`  Driver Partner:`, o.deliveryPartner?.name, '=> Location:', o.deliveryPartner?.location);
  }

  await mongoose.disconnect();
}

checkLocations().catch(console.error);
