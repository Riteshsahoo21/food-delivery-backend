const dotenv = require('dotenv');
dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testCloudinaryDriverKyc() {
  console.log('\n=============================================================');
  console.log('🧪 TESTING CLOUDINARY DRIVING LICENSE UPLOAD & SUBMISSION');
  console.log('=============================================================\n');

  // Step 1: Simulate Cloudinary Document Upload via FormData
  console.log('1️⃣ Uploading sample Driving License image to POST /api/upload (Cloudinary)...');
  
  // Create a minimal 1x1 png buffer for test
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  const blob = new Blob([pngBuffer], { type: 'image/png' });
  const form = new FormData();
  form.append('file', blob, 'odisha_driving_license.png');

  const uploadRes = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: form,
  });
  const uploadData = await uploadRes.json();

  if (!uploadData.success || !uploadData.url) {
    console.error('❌ Upload failed:', uploadData);
    process.exit(1);
  }
  console.log(`✅ [SUCCESS] Document uploaded to Cloudinary: ${uploadData.url.substring(0, 50)}...`);
  const licenseUrl = uploadData.url;

  // Step 2: Submit Driver Registration with Cloudinary License URL
  const driverEmail = `cloudinary.rider.${Date.now()}@feastfleet.com`;
  const driverPhone = `+91 94370 ${Math.floor(10000 + Math.random() * 90000)}`;
  console.log(`\n2️⃣ Submitting Driver KYC with licenseImage for ${driverEmail}...`);

  const regRes = await fetch(`${API_BASE}/delivery/register-kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priyadarshi Jena',
      email: driverEmail,
      phone: driverPhone,
      password: 'RiderPassword2026!',
      vehicleType: 'Motorcycle',
      vehicleModel: 'Yamaha FZ-S V3',
      vehicleNumber: 'OD 02 DL 9900',
      licenseNumber: 'OD-02-2025-0099881',
      licenseImage: licenseUrl,
      aadhaarNumber: '8912 4567 1234',
      bankAccountNumber: '987654320011',
      bankIfsc: 'SBIN0004567',
      city: 'Bhubaneswar',
      deliveryZone: 'Bhubaneswar Zone 1 (Patia / KIIT / Infocity / DLF)',
    }),
  });
  const regData = await regRes.json();

  if (!regData.success || !regData.partner) {
    console.error('❌ Failed registration:', regData);
    process.exit(1);
  }
  console.log(`✅ [SUCCESS] Driver registered! Stored licenseImage: ${regData.partner.licenseImage?.substring(0, 50)}...`);

  // Step 3: Verify Super Admin fetches the uploaded license image
  console.log('\n3️⃣ Checking Super Admin rider queue to verify licenseImage is visible...');
  const adminRes = await fetch(`${API_BASE}/admin/riders?status=PENDING`);
  const adminData = await adminRes.json();

  const found = adminData.data?.find((r) => r._id === regData.partner._id);
  if (!found || !found.licenseImage) {
    console.error('❌ Super Admin did not receive stored licenseImage!', found);
    process.exit(1);
  }
  console.log(`✅ [SUCCESS] Super Admin received DL document for ${found.user?.name}: ${found.licenseImage.substring(0, 50)}...`);

  console.log('\n🎉 ALL CLOUDINARY DOCUMENT UPLOAD & KYC CHECKS PASSED 100%!\n');
  process.exit(0);
}

testCloudinaryDriverKyc().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
