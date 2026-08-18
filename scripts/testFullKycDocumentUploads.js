const dotenv = require('dotenv');
dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testFullKycDocumentUploads() {
  console.log('\n=============================================================');
  console.log('🧪 TESTING FULL KYC DOCUMENTS (DL + AADHAAR FRONT/BACK + PAN FRONT/BACK)');
  console.log('=============================================================\n');

  // Helper to upload mock image to /api/upload
  async function uploadMockImage(filename) {
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );
    const blob = new Blob([pngBuffer], { type: 'image/png' });
    const form = new FormData();
    form.append('file', blob, filename);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    return data.url;
  }

  console.log('1️⃣ Uploading all 5 KYC documents to Cloudinary API...');
  const dlUrl = await uploadMockImage('dl_front.png');
  const aadhaarFrontUrl = await uploadMockImage('aadhaar_front.png');
  const aadhaarBackUrl = await uploadMockImage('aadhaar_back.png');
  const panFrontUrl = await uploadMockImage('pan_front.png');
  const panBackUrl = await uploadMockImage('pan_back.png');

  console.log('   ✅ Driving License URL:', dlUrl?.substring(0, 40) + '...');
  console.log('   ✅ Aadhaar Front URL:', aadhaarFrontUrl?.substring(0, 40) + '...');
  console.log('   ✅ Aadhaar Back URL:', aadhaarBackUrl?.substring(0, 40) + '...');
  console.log('   ✅ PAN Front URL:', panFrontUrl?.substring(0, 40) + '...');
  console.log('   ✅ PAN Back URL:', panBackUrl?.substring(0, 40) + '...');

  // Step 2: Register driver with all documents
  const driverEmail = `fullkyc.rider.${Date.now()}@feastfleet.com`;
  const driverPhone = `+91 91240 ${Math.floor(10000 + Math.random() * 90000)}`;

  console.log(`\n2️⃣ Registering driver with all 5 documents (${driverEmail})...`);
  const regRes = await fetch(`${API_BASE}/delivery/register-kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Subrat Mohanty',
      email: driverEmail,
      phone: driverPhone,
      password: 'RiderPassword2026!',
      vehicleType: 'Scooter',
      vehicleModel: 'TVS Ntorq 125',
      vehicleNumber: 'OD 02 NM 5544',
      licenseNumber: 'OD-02-2025-0011223',
      licenseImage: dlUrl,
      aadhaarNumber: '9988 1122 3344',
      aadhaarFrontImage: aadhaarFrontUrl,
      aadhaarBackImage: aadhaarBackUrl,
      panNumber: 'SUBRA1234M',
      panFrontImage: panFrontUrl,
      panBackImage: panBackUrl,
      bankAccountNumber: '123498765432',
      bankIfsc: 'HDFC0001234',
      city: 'Bhubaneswar',
      deliveryZone: 'Bhubaneswar Zone 2 (Master Canteen / Saheed Nagar / Station)',
    }),
  });

  const regData = await regRes.json();
  if (!regData.success || !regData.partner) {
    console.error('❌ Failed registration:', regData);
    process.exit(1);
  }
  console.log(`✅ [SUCCESS] Driver registered! Partner ID: ${regData.partner._id}`);

  // Step 3: Verify Super Admin retrieves all 5 document URLs
  console.log('\n3️⃣ Verifying Super Admin retrieves all 5 uploaded documents...');
  const adminRes = await fetch(`${API_BASE}/admin/riders?status=PENDING`);
  const adminData = await adminRes.json();

  const found = adminData.data?.find((r) => r._id === regData.partner._id);
  if (!found) {
    console.error('❌ Driver not found in Admin pending queue!');
    process.exit(1);
  }

  console.log('   Checking stored documents on Admin side:');
  console.log('   • licenseImage:', !!found.licenseImage);
  console.log('   • aadhaarFrontImage:', !!found.aadhaarFrontImage);
  console.log('   • aadhaarBackImage:', !!found.aadhaarBackImage);
  console.log('   • panFrontImage:', !!found.panFrontImage);
  console.log('   • panBackImage:', !!found.panBackImage);

  if (
    !found.licenseImage ||
    !found.aadhaarFrontImage ||
    !found.aadhaarBackImage ||
    !found.panFrontImage ||
    !found.panBackImage
  ) {
    console.error('❌ Some document URLs are missing in the Admin response!', found);
    process.exit(1);
  }

  console.log('\n🎉 ALL 5 KYC DOCUMENTS (DL + AADHAAR FRONT/BACK + PAN FRONT/BACK) VERIFIED 100%!\n');
  process.exit(0);
}

testFullKycDocumentUploads().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
