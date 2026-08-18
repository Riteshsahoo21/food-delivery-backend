const mongoose = require('mongoose');
const User = require('../src/models/User');
const DeliveryPartner = require('../src/models/DeliveryPartner');
require('dotenv').config();

async function setVikramSingh() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let vikram = await User.findOne({ email: 'rider@feastfleet.com' });
  if (vikram) {
    vikram.name = 'Vikram Singh (Rider)';
    vikram.phone = '9861099888';
    vikram.password = 'password123';
    vikram.role = 'delivery';
    await vikram.save();
    console.log('Updated Vikram Singh user password cleanly to password123');
  }

  await mongoose.disconnect();
}

setVikramSingh().catch(console.error);
