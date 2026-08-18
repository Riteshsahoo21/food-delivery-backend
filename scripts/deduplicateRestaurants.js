require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('../src/models/Restaurant');
const MenuItem = require('../src/models/MenuItem');
const Order = require('../src/models/Order');

async function deduplicateRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery');
    console.log('Connected to MongoDB');

    const all = await Restaurant.find({});
    console.log('Total Restaurants before:', all.length);

    const seenNames = new Set();
    const toDelete = [];

    // Prioritize newer documents (like 6a8406e47692c4bfe6e87c6f) by sorting createdAt / _id descending
    const sorted = all.sort((a, b) => (b.createdAt || b._id).toString().localeCompare((a.createdAt || a._id).toString()));

    for (const rest of sorted) {
      const normalizedName = (rest.name || '').trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        console.log('Found duplicate:', rest.name, rest._id);
        toDelete.push(rest._id);
      } else {
        seenNames.add(normalizedName);
      }
    }

    console.log('Deleting duplicate IDs count:', toDelete.length);
    if (toDelete.length > 0) {
      await Restaurant.deleteMany({ _id: { $in: toDelete } });
    }

    const remaining = await Restaurant.find({});
    console.log('Total Unique Restaurants after deduplication:', remaining.length);
    remaining.forEach((r, i) => console.log(i, r._id, r.name));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error deduplicating restaurants:', err);
  }
}

deduplicateRestaurants();
