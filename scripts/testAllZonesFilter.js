async function testZoneFiltering() {
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'driber@gmail.com', password: 'password123' })
  });
  const { token } = await loginRes.json();

  const zonesToTest = [
    'Bhubaneswar Zone 1 (Rasulgarh / Mancheswar / Vani Vihar)',
    'Bhubaneswar Zone 2 (Patia / KIIT / Infocity / DLF Cybercity)',
    'Bhubaneswar Zone 3 (Master Canteen / Saheed Nagar / Kharvel Nagar)',
    'Bhubaneswar Zone 4 (Old Town / Samantarapur / Lewis Road)',
    'Bhubaneswar Zone 5 (Khandagiri / Jagamara / ITER / Pokhariput)',
    'Bhubaneswar Zone 6 (Nayapalli / Jaydev Vihar / IRC Village / CSPur)'
  ];

  for (const zone of zonesToTest) {
    console.log(`\n======================================================`);
    console.log(`Testing query for: "${zone}"`);
    const res = await fetch(`http://localhost:5001/api/delivery/orders?zone=${encodeURIComponent(zone)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log(`Returned ${data.activeOrders?.length || 0} order(s):`);
    (data.activeOrders || []).forEach(o => {
      console.log(`  - Order #${o.orderNumber} from "${o.restaurant?.name}" (${o.restaurant?.address})`);
    });
  }
}

testZoneFiltering();
