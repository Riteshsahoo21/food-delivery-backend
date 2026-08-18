const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function testZoneUpdate() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('../src/models/User');
  const DeliveryPartner = require('../src/models/DeliveryPartner');

  // Test login to get token
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'driber@gmail.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log('Driver Login Success:', !!token);

  // Switch to Zone 2
  const zoneRes = await fetch('http://localhost:5001/api/delivery/zone', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      deliveryZone: 'Bhubaneswar Zone 2 (Master Canteen / Saheed Nagar / Station)'
    })
  });
  const zoneData = await zoneRes.json();
  console.log('Zone Update Result:', zoneData);

  // Verify in MongoDB
  const partner = await DeliveryPartner.findOne({ user: loginData.user.id });
  console.log('MongoDB Verified Zone:', partner.deliveryZone);

  process.exit(0);
}

testZoneUpdate().catch(err => {
  console.error(err);
  process.exit(1);
});
