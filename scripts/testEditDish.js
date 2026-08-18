async function testEditDish() {
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dfnokh2@gmail.com', password: 'password123' })
  });
  const { token } = await loginRes.json();
  console.log('Vendor login success:', !!token);

  // Fetch menu
  const menuRes = await fetch('http://localhost:5001/api/vendor/menu', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const menuData = await menuRes.json();
  console.log(`Found ${menuData.data?.length || 0} menu items`);

  if (menuData.data && menuData.data.length > 0) {
    const firstDish = menuData.data[0];
    console.log('Updating dish:', firstDish.name, `(${firstDish._id})`);

    const updateRes = await fetch(`http://localhost:5001/api/vendor/menu/${firstDish._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: firstDish.name,
        price: firstDish.price,
        description: firstDish.description + ' (Freshly Prepared)',
        isBestseller: true,
        addons: [{ name: 'Extra Gravy & Raita', price: 40 }]
      })
    });
    const updateData = await updateRes.json();
    console.log('Update success:', updateData.success, updateData.message);
  }
}

testEditDish().catch(console.error);
