const mongoose = require('mongoose');
const User = require('../src/models/User');
const DeliveryPartner = require('../src/models/DeliveryPartner');
require('dotenv').config();

async function checkVikram() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const users = await User.find({
    $or: [
      { name: /vikram/i },
      { email: /vikram/i },
      { email: /driber/i },
      { email: /driver/i },
      { role: 'delivery' }
    ]
  });

  console.log(`Found ${users.length} matching driver users:`);
  for (const u of users) {
    const partner = await DeliveryPartner.findOne({ user: u._id });
    console.log({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      partnerFound: !!partner,
      partnerStatus: partner?.status,
      vehicle: partner?.vehicleNumber,
      zone: partner?.deliveryZone,
    });
  }

  await mongoose.disconnect();
}

checkVikram().catch(console.error);
