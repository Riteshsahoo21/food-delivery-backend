const dotenv = require('dotenv');
dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function verifyDriverIsolation() {
  console.log('\n=============================================================');
  console.log('🧪 TESTING REAL DRIVER ISOLATION & ONBOARDING DATA (driverhume)');
  console.log('=============================================================\n');

  const email = `driverhume.${Date.now()}@feastfleet.com`;
  const password = 'DriverHumePassword2026!';
  const name = 'driverhume';

  // 1. Register driverhume
  console.log('1️⃣ Registering new user "driverhume" with role "delivery"...');
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
      phone: '+91 99370 12345',
      role: 'delivery',
    }),
  });
  const regData = await regRes.json();
  if (!regData.success || !regData.token) {
    console.error('❌ Failed registration:', regData);
    process.exit(1);
  }
  const token = regData.token;
  console.log(`✅ [SUCCESS] Registered user ${name} (${regData.user.email})`);

  // 2. Check stats for brand new driverhume
  console.log('\n2️⃣ Checking initial stats for newly registered "driverhume"...');
  const statsRes = await fetch(`${API_BASE}/delivery/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const statsData = await statsRes.json();
  console.log('   Stats response:', statsData.stats);

  if (statsData.stats.completedOrders !== 0 || statsData.stats.todayEarnings !== 0) {
    console.error(`❌ FAILED: Expected 0 completed orders & ₹0 earnings, but got:`, statsData.stats);
    process.exit(1);
  }
  console.log('✅ [SUCCESS] driverhume has 0 completed orders and ₹0 earnings (Clean isolated state!)');

  // 3. Check KYC status for brand new driverhume (before submission)
  console.log('\n3️⃣ Checking KYC status before submission...');
  const kycBeforeRes = await fetch(`${API_BASE}/delivery/kyc-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const kycBefore = await kycBeforeRes.json();
  console.log('   KYC Status:', kycBefore.status);

  if (kycBefore.status !== 'NOT_SUBMITTED') {
    console.error(`❌ FAILED: Expected 'NOT_SUBMITTED', got: ${kycBefore.status}`);
    process.exit(1);
  }
  console.log('✅ [SUCCESS] Correctly detected NOT_SUBMITTED for driverhume');

  // 4. Submit KYC for driverhume
  console.log('\n4️⃣ Submitting KYC onboarding form for driverhume...');
  const kycSubRes = await fetch(`${API_BASE}/delivery/register-kyc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      vehicleType: 'Scooter',
      vehicleModel: 'Honda Activa 6G',
      vehicleNumber: 'OD 02 DH 7788',
      licenseNumber: 'OD-02-2025-0088991',
      aadhaarNumber: '7890 1234 5678',
      bankAccountNumber: '987654321122',
      bankIfsc: 'HDFC0001234',
      city: 'Bhubaneswar',
      deliveryZone: 'Bhubaneswar Zone 1 (Patia / KIIT / Infocity / DLF)',
    }),
  });
  const kycSubData = await kycSubRes.json();
  console.log(`✅ [SUCCESS] KYC Submitted: status = ${kycSubData.partner.status}`);

  // 5. Check KYC status after submission
  console.log('\n5️⃣ Checking KYC status after onboarding submission...');
  const kycAfterRes = await fetch(`${API_BASE}/delivery/kyc-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const kycAfter = await kycAfterRes.json();
  console.log('   KYC Status:', kycAfter.status);
  console.log(`   Vehicle: ${kycAfter.partner.vehicleModel} (${kycAfter.partner.vehicleNumber})`);

  if (kycAfter.status !== 'PENDING') {
    console.error(`❌ FAILED: Expected 'PENDING', got: ${kycAfter.status}`);
    process.exit(1);
  }
  console.log('✅ [SUCCESS] driverhume is now PENDING Super Admin Review with their own vehicle details!');

  console.log('\n🎉 ALL DRIVER ISOLATION & ONBOARDING CHECKS PASSED 100%!\n');
  process.exit(0);
}

verifyDriverIsolation().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
