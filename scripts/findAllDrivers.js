const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function listDrivers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('../src/models/User');
  const DeliveryPartner = require('../src/models/DeliveryPartner');

  console.log('=== DRIVER USERS IN DATABASE ===');
  const driverUsers = await User.find({ role: { $in: ['driver', 'rider'] } }).sort({ createdAt: -1 });

  for (const u of driverUsers) {
    const kyc = await DeliveryPartner.findOne({ user: u._id });
    console.log({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isOtpVerified: u.isOtpVerified,
      kycStatus: kyc ? kyc.kycStatus : 'NO_KYC_DOC',
      vehicleModel: kyc ? kyc.vehicleModel : u.vehicle,
      licenseNumber: kyc ? kyc.licenseNumber : 'N/A',
      zone: kyc ? kyc.deliveryZone : 'N/A',
      createdAt: u.createdAt
    });
  }

  process.exit(0);
}

listDrivers().catch(err => {
  console.error(err);
  process.exit(1);
});
