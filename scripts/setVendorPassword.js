const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function setVendorPassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('../src/models/User');

  const user = await User.findOne({ email: 'dfnokh2@gmail.com' });
  if (user) {
    // Set password to password123
    user.password = 'password123';
    await user.save();
    console.log('✅ Password successfully set to "password123" for dfnokh2@gmail.com');
  }

  // Also verify login via bcrypt match
  const isMatch = await user.matchPassword('password123');
  console.log('Password match test:', isMatch);

  process.exit(0);
}

setVendorPassword().catch(err => {
  console.error(err);
  process.exit(1);
});
