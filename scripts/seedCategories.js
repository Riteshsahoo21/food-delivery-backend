const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('../src/models/Category');

const categories = [
  { name: 'Biryani', icon: '🍲', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300' },
  { name: 'Odia Thali', icon: '🍛', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300' },
  { name: 'South Indian', icon: '🥞', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300' },
  { name: 'North Indian', icon: '🥘', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300' },
  { name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
  { name: 'Chinese & Dimsums', icon: '🥟', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300' },
  { name: 'Tandoori & Grills', icon: '🍗', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300' },
  { name: 'Desserts & Sweets', icon: '🍨', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300' },
];

async function seedCategories() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const cat of categories) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await Category.findOneAndUpdate(
      { slug },
      { ...cat, slug, isActive: true },
      { upsert: true, new: true }
    );
  }
  console.log('Categories seeded successfully!');
  process.exit(0);
}

seedCategories().catch(console.error);
