const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../src/models/User');

const vendorEmails = [
  'dfnokh2@gmail.com',
  'biryani@feastfleet.com',
  'odia@feastfleet.com',
  'southindian@feastfleet.com',
  'tandoor@feastfleet.com',
  'chinese@feastfleet.com',
  'burger@feastfleet.com',
  'sweets@feastfleet.com',
  'rider@feastfleet.com',
  'admin@feastfleet.com',
];

async function fixPasswords() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas...');

  for (const email of vendorEmails) {
    const user = await User.findOne({ email });
    if (user) {
      // Pass plain-text password so userSchema.pre('save') hashes it exactly once
      if (email === 'admin@feastfleet.com') {
        user.password = 'AdminPassword2026!';
      } else if (email === 'rider@feastfleet.com') {
        user.password = 'RiderPassword2026!';
      } else {
        user.password = 'VendorPass2026!';
      }
      user.isOtpVerified = true;
      user.isActive = true;
      await user.save();
      console.log(`✅ Set password for ${email}`);
    }
  }

  console.log('\nAll passwords fixed correctly!');
  process.exit(0);
}

fixPasswords().catch(console.error);
