const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function inspectDriver() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('../src/models/User');
  const DeliveryPartner = require('../src/models/DeliveryPartner');

  const user = await User.findOne({ email: 'driber@gmail.com' });
  console.log('Driver user:', user);

  if (user) {
    // Set password to password123
    user.password = 'password123';
    await user.save();
    console.log('✅ Password set to "password123" for driber@gmail.com');

    const partner = await DeliveryPartner.findOne({ user: user._id });
    console.log('DeliveryPartner doc:', partner);

    // Make sure KYC status is APPROVED
    if (partner) {
      partner.kycStatus = 'APPROVED';
      partner.verificationStatus = 'APPROVED';
      await partner.save();
      console.log('✅ KYC Status marked as APPROVED');
    }
  }

  process.exit(0);
}

inspectDriver().catch(err => {
  console.error(err);
  process.exit(1);
});
