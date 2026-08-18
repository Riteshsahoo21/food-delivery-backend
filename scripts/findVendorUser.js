const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function findVendor() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('../src/models/User');
  const Restaurant = require('../src/models/Restaurant');

  const user = await User.findOne({ email: 'dfnokh2@gmail.com' });
  console.log('--- USER INFO ---');
  console.log('User Found:', user ? {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isOtpVerified: user.isOtpVerified
  } : 'NOT FOUND');

  if (user) {
    const restaurant = await Restaurant.findOne({ owner: user._id });
    console.log('--- RESTAURANT INFO ---');
    console.log('Restaurant:', restaurant ? {
      id: restaurant._id,
      name: restaurant.name,
      status: restaurant.status,
      address: restaurant.address,
    } : 'None linked to this owner ID');
  }

  process.exit(0);
}

findVendor().catch(err => {
  console.error(err);
  process.exit(1);
});
