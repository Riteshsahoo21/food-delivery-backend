const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function listAllRestaurants() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Restaurant = require('../src/models/Restaurant');

  const restaurants = await Restaurant.find().sort({ createdAt: -1 });
  console.log(`Found ${restaurants.length} restaurants in DB:\n`);

  restaurants.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.status}] ${r.name}`);
    console.log(`   Address: ${r.address}`);
    console.log(`   Cuisine: ${Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine}`);
    console.log(`   Coordinates: lat=${r.coordinates?.lat}, lng=${r.coordinates?.lng}`);
    console.log(`   Owner: ${r.owner}`);
    console.log('--------------------------------------------------');
  });

  process.exit(0);
}

listAllRestaurants().catch(err => {
  console.error(err);
  process.exit(1);
});
