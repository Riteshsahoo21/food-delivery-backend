const Razorpay = require('razorpay');

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
  });
} catch (error) {
  console.warn('⚠️ Razorpay initialization warning:', error.message);
}

module.exports = razorpayInstance;
