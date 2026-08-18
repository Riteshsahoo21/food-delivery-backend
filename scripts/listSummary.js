const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const rests = await db.collection('restaurants').find({}).toArray();
  const users = await db.collection('users').find({ role: 'vendor' }).toArray();
  const items = await db.collection('menuitems').find({}).toArray();

  console.log('\n======================================================');
  console.log('🍽️  ALL BHUBANESWAR RESTAURANTS & VENDOR CREDENTIALS');
  console.log('======================================================\n');

  rests.forEach((r, idx) => {
    const user = users.find(u => u._id.toString() === r.owner?.toString());
    const count = items.filter(i => i.restaurant?.toString() === r._id.toString()).length;
    console.log(`${idx + 1}. ${r.name}`);
    console.log(`   • Cuisines: ${r.cuisines?.join(', ')}`);
    console.log(`   • Area: ${r.address}`);
    console.log(`   • Rating: ★ ${r.rating} (${r.ratingCount}) | Time: ${r.deliveryTime}`);
    console.log(`   • Dishes in Menu: ${count} items`);
    console.log(`   • Vendor Portal Login: ${user ? user.email : 'dfnokh2@gmail.com'}`);
    console.log(`   • Vendor Password: ${user ? 'VendorPass2026!' : 'Owner Google / OTP'}`);
    console.log(`   • Restaurant Link: http://localhost:3000/restaurant/${r._id}`);
    console.log('------------------------------------------------------');
  });

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
