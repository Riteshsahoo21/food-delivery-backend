async function testDeliveryOrders() {
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'driber@gmail.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log('Driver Login Success:', !!token);

  const zoneName = 'Bhubaneswar Zone 1 (Rasulgarh / Mancheswar / Vani Vihar)';
  const res = await fetch(`http://localhost:5001/api/delivery/orders?zone=${encodeURIComponent(zoneName)}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('--- ACTIVE ORDERS RETURNED FOR DRIVER ---');
  console.log('Count:', data.activeOrders?.length);
  if (data.activeOrders) {
    data.activeOrders.forEach(o => {
      console.log(`Order #${o.orderNumber} (${o._id}):`);
      console.log(`  Restaurant: ${o.restaurant?.name} (${o.restaurant?.address})`);
      console.log(`  Status: ${o.orderStatus}`);
      console.log(`  isZoneMatch: ${o.isZoneMatch}`);
      console.log(`  Assigned Partner: ${o.deliveryPartner}`);
    });
  }
}

testDeliveryOrders();
