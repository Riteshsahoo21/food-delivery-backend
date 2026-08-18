async function testLogin() {
  const res = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dfnokh2@gmail.com', password: 'password123' })
  });
  const data = await res.json();
  console.log('Login Response:', data);
}
testLogin();
