const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE = 'http://localhost:5001/api';

const vendorAccounts = [
  { email: 'dfnokh2@gmail.com', password: 'VendorPass2026!', restaurant: 'Ritzs Food Lounge & Biryani' },
  { email: 'biryani@feastfleet.com', password: 'VendorPass2026!', restaurant: 'The Royal Biryani & Kebabs' },
  { email: 'odia@feastfleet.com', password: 'VendorPass2026!', restaurant: 'Odisha Dalma & Authentic Odia Thali' },
  { email: 'southindian@feastfleet.com', password: 'VendorPass2026!', restaurant: 'Dakshin Dosa & Idli Express' },
  { email: 'tandoor@feastfleet.com', password: 'VendorPass2026!', restaurant: 'Urban Tandoor & Grill Garden' },
  { email: 'chinese@feastfleet.com', password: 'VendorPass2026!', restaurant: 'Dragon Wok & Dimsum Lounge' },
  { email: 'burger@feastfleet.com', password: 'VendorPass2026!', restaurant: 'The Crust & Patty Burger Co.' },
  { email: 'sweets@feastfleet.com', password: 'VendorPass2026!', restaurant: 'Pahala Rasgulla & Mithai Mahalo' },
];

async function testLogins() {
  console.log('\n=============================================================');
  console.log('🧪 TESTING LIVE AUTHENTICATION FOR ALL RESTAURANT VENDORS');
  console.log('=============================================================\n');

  let successCount = 0;

  for (const account of vendorAccounts) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, password: account.password }),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        console.log(`✅ [LOGIN OK] ${account.restaurant}`);
        console.log(`   • Email: ${data.user.email}`);
        console.log(`   • Name: ${data.user.name}`);
        console.log(`   • Role: ${data.user.role}`);
        console.log(`   • Bound Restaurant ID: ${data.user.restaurantId || 'Yes'}`);
        console.log(`   • Token: ${data.token.slice(0, 20)}...`);
        console.log('-------------------------------------------------------------');
        successCount++;
      } else {
        console.log(`❌ [FAILED] ${account.restaurant} (${account.email}): ${data.message}`);
      }
    } catch (err) {
      console.log(`❌ [ERROR] ${account.restaurant} (${account.email}): ${err.message}`);
    }
  }

  console.log(`\n🎉 Results: ${successCount} / ${vendorAccounts.length} Restaurant Vendor Logins Verified & Working!\n`);
}

testLogins();
