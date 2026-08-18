const mongoose = require('mongoose');
require('dotenv').config();
const Restaurant = require('../src/models/Restaurant');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const res = await Restaurant.updateMany({}, {
    $set: {
      address: '6RMR+8G2, Lewis Rd, Samantarapur, Old Town, Bhubaneswar, Odisha 751002, India',
      coordinates: { lat: 20.2462, lng: 85.8458 }
    }
  });
  console.log('Updated restaurant coordinates:', res);
  process.exit(0);
}

run().catch(console.error);
