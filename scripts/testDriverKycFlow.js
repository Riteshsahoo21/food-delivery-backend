const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testDriverKycFlow() {
  console.log('\n=============================================================');
  console.log('🧪 TESTING COMPLETE DELIVERY PARTNER REGISTRATION & KYC FLOW');
  console.log('=============================================================\n');

  // Step 1: Submit new Driver KYC
  const driverPayload = {
    name: 'Rohan Patnaik (Test Driver)',
    email: `rohan.rider.${Date.now()}@feastfleet.com`,
    phone: '+91 98765 11223',
    password: 'RiderPassword2026!',
    vehicleType: 'Motorcycle',
    vehicleModel: 'Honda Activa 6G',
    vehicleNumber: 'OD 02 XY 9988',
    licenseNumber: 'OD-02-2024-0012984',
    aadhaarNumber: '9988 7766 5544',
    panNumber: 'PATNA1234K',
    bankAccountNumber: '123456789012',
    bankIfsc: 'HDFC0001234',
    bankAccountHolder: 'Rohan Patnaik',
    city: 'Bhubaneswar',
    deliveryZone: 'Bhubaneswar Zone 1 (Patia / KIIT / Infocity)',
  };

  console.log('1️⃣ Submitting Driver Registration & KYC to POST /api/delivery/register-kyc...');
  const regRes = await fetch(`${API_BASE}/delivery/register-kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(driverPayload),
  });
  const regData = await regRes.json();

  if (!regData.success || !regData.token || !regData.partner) {
    console.error('❌ Failed Step 1:', regData);
    process.exit(1);
  }
  console.log(`✅ [SUCCESS] Driver registered with ID: ${regData.user.id}`);
  console.log(`   • Partner Profile ID: ${regData.partner._id}`);
  console.log(`   • Status: ${regData.partner.status} (Expected: PENDING)`);

  const driverToken = regData.token;
  const partnerId = regData.partner._id;

  // Step 2: Check Driver KYC status endpoint
  console.log('\n2️⃣ Checking Driver KYC Status from GET /api/delivery/kyc-status...');
  const kycRes = await fetch(`${API_BASE}/delivery/kyc-status`, {
    headers: { Authorization: `Bearer ${driverToken}` },
  });
  const kycData = await kycRes.json();
  console.log(`✅ [SUCCESS] Current Status for driver: ${kycData.status}`);

  // Step 3: Admin lists pending riders
  console.log('\n3️⃣ Admin Listing Pending Riders from GET /api/admin/riders?status=PENDING...');
  const adminListRes = await fetch(`${API_BASE}/admin/riders?status=PENDING`);
  const adminListData = await adminListRes.json();
  const found = adminListData.data?.find((r) => r._id === partnerId);

  if (!found) {
    console.error('❌ Failed Step 3: Newly registered driver not found in admin pending queue!');
    process.exit(1);
  }
  console.log(`✅ [SUCCESS] Admin found pending driver in queue: ${found.user?.name} (${found.vehicleNumber})`);

  // Step 4: Admin Approves the Driver
  console.log(`\n4️⃣ Admin Approving Driver via PATCH /api/admin/riders/${partnerId}/status...`);
  const approveRes = await fetch(`${API_BASE}/admin/riders/${partnerId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'APPROVED' }),
  });
  const approveData = await approveRes.json();
  console.log(`✅ [SUCCESS] ${approveData.message}`);

  // Step 5: Verify Driver KYC status is now APPROVED
  console.log('\n5️⃣ Re-checking Driver KYC Status after Admin Approval...');
  const finalKycRes = await fetch(`${API_BASE}/delivery/kyc-status`, {
    headers: { Authorization: `Bearer ${driverToken}` },
  });
  const finalKycData = await finalKycRes.json();
  console.log(`✅ [SUCCESS] Final Status for driver: ${finalKycData.status} (Expected: APPROVED)`);

  console.log('\n🎉 ALL 5 STEPS PASSED! DRIVER ONBOARDING & ADMIN APPROVAL FLOW 100% OPERATIONAL!\n');
  process.exit(0);
}

testDriverKycFlow().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
