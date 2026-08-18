async function test() {
  const res = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rider@feastfleet.com', password: 'password123' })
  });
  const data = await res.json();
  console.log('Login result:', data.success, data.user?.name, data.user?.role);

  const kycRes = await fetch('http://localhost:5001/api/delivery/kyc-status', {
    headers: { 'Authorization': `Bearer ${data.token}` }
  });
  const kycData = await kycRes.json();
  console.log('KYC Status:', kycData.status, kycData.partner?.vehicleNumber);
}

test().catch(console.error);
