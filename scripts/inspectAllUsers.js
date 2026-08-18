const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function inspectAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('../src/models/User');
  const DeliveryPartner = require('../src/models/DeliveryPartner');

  console.log('=== ALL USERS IN DB ===');
  const users = await User.find().sort({ createdAt: -1 });
  console.log(users.map(u => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    createdAt: u.createdAt
  })));

  console.log('=== ALL DELIVERY PARTNERS IN DB ===');
  const partners = await DeliveryPartner.find().populate('user').sort({ createdAt: -1 });
  console.log(partners.map(p => ({
    id: p._id,
    user: p.user ? { name: p.user.name, email: p.user.email, role: p.user.role } : p.user,
    kycStatus: p.kycStatus,
    vehicleModel: p.vehicleModel,
    licenseNumber: p.licenseNumber,
    deliveryZone: p.deliveryZone,
    createdAt: p.createdAt
  })));

  process.exit(0);
}

inspectAll().catch(err => {
  console.error(err);
  process.exit(1);
});
