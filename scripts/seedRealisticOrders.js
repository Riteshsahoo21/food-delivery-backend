const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Order = require('../src/models/Order');
const Restaurant = require('../src/models/Restaurant');
const User = require('../src/models/User');

async function seedOrders() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas...');

  const restaurants = await Restaurant.find({});
  const riders = await User.find({ role: 'delivery' });
  const users = await User.find({});

  const defaultCustomer = (await User.findOne({ email: 'dfnokh2@gmail.com' })) || users[0];
  const rider = riders[0] || users[0];

  const sampleOrdersData = [
    {
      orderNumber: 'ORD-891468',
      restaurantName: 'Ritzs Food Lounge & Biryani',
      items: [
        { name: 'Special Royal Pakhala Bhata', price: 191, unitPrice: 191, quantity: 1, isVeg: true, addons: [] },
      ],
      itemTotal: 191,
      packagingFee: 25,
      deliveryFee: 29,
      taxes: 10,
      discount: 0,
      grandTotal: 255,
      deliveryAddress: {
        type: 'Home',
        title: '765',
        address: '765, Giani Zail Singh Rd, Basisthanagar, Old Town, Bhubaneswar, Odisha 751002, India',
        lat: 20.234946,
        lng: 85.837766,
      },
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      orderStatus: 'OUT_FOR_DELIVERY',
      createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 25 * 60 * 1000), note: 'Order placed by customer' },
        { status: 'ACCEPTED', timestamp: new Date(Date.now() - 20 * 60 * 1000), note: 'Restaurant accepted order' },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 15 * 60 * 1000), note: 'Food being cooked fresh' },
        { status: 'READY_FOR_PICKUP', timestamp: new Date(Date.now() - 8 * 60 * 1000), note: 'Food packed and ready' },
        { status: 'OUT_FOR_DELIVERY', timestamp: new Date(Date.now() - 5 * 60 * 1000), note: 'Driver picked up food and is en route' },
      ],
    },
    {
      orderNumber: 'ORD-724190',
      restaurantName: 'The Royal Biryani & Kebabs',
      items: [
        { name: 'Hyderabadi Dum Chicken Biryani', price: 249, unitPrice: 289, quantity: 2, isVeg: false, addons: [{ name: 'Extra Boiled Egg', price: 20 }, { name: 'Mirchi Ka Salan', price: 35 }] },
        { name: 'Shahi Royal Phirni', price: 99, unitPrice: 99, quantity: 1, isVeg: true, addons: [] },
      ],
      itemTotal: 677,
      packagingFee: 25,
      deliveryFee: 0,
      taxes: 34,
      discount: 100,
      grandTotal: 636,
      deliveryAddress: {
        type: 'Work',
        title: 'Tech Park DLF',
        address: 'Tower A, Infocity, Patia, Bhubaneswar, Odisha 751024, India',
        lat: 20.3582,
        lng: 85.8214,
      },
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000), // 3 hours ago
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 3 * 3600 * 1000), note: 'Order placed' },
        { status: 'ACCEPTED', timestamp: new Date(Date.now() - 2.8 * 3600 * 1000), note: 'Accepted' },
        { status: 'OUT_FOR_DELIVERY', timestamp: new Date(Date.now() - 2.4 * 3600 * 1000), note: 'Out for delivery' },
        { status: 'DELIVERED', timestamp: new Date(Date.now() - 2.1 * 3600 * 1000), note: 'Order delivered successfully to customer doorstep' },
      ],
    },
    {
      orderNumber: 'ORD-519823',
      restaurantName: 'Odisha Dalma & Authentic Odia Thali',
      items: [
        { name: 'Authentic Temple Style Dalma', price: 119, unitPrice: 119, quantity: 1, isVeg: true, addons: [] },
        { name: 'Chilika Machha Besara (Fish in Mustard Gravy)', price: 249, unitPrice: 249, quantity: 1, isVeg: false, addons: [] },
        { name: 'Puri Famous Baked Chenna Poda (250g)', price: 149, unitPrice: 149, quantity: 1, isVeg: true, addons: [] },
      ],
      itemTotal: 517,
      packagingFee: 25,
      deliveryFee: 19,
      taxes: 26,
      discount: 75,
      grandTotal: 512,
      deliveryAddress: {
        type: 'Home',
        title: 'Saheed Nagar',
        address: 'Plot 45, Maharshi College Rd, Saheed Nagar, Bhubaneswar, Odisha 751007',
        lat: 20.2912,
        lng: 85.8456,
      },
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      createdAt: new Date(Date.now() - 28 * 3600 * 1000), // Yesterday
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 28 * 3600 * 1000), note: 'Order placed' },
        { status: 'DELIVERED', timestamp: new Date(Date.now() - 27.4 * 3600 * 1000), note: 'Delivered' },
      ],
    },
    {
      orderNumber: 'ORD-381902',
      restaurantName: 'The Crust & Patty Burger Co.',
      items: [
        { name: 'Smoked BBQ Crispy Chicken Burger', price: 199, unitPrice: 199, quantity: 2, isVeg: false, addons: [{ name: 'Extra Cheddar Cheese', price: 30 }] },
        { name: 'Truffle Parmesan Crinkle Fries', price: 139, unitPrice: 139, quantity: 1, isVeg: true, addons: [] },
        { name: 'Nutella Belgian Chocolate Thickshake', price: 159, unitPrice: 159, quantity: 2, isVeg: true, addons: [] },
      ],
      itemTotal: 755,
      packagingFee: 25,
      deliveryFee: 0,
      taxes: 38,
      discount: 50,
      grandTotal: 768,
      deliveryAddress: {
        type: 'Home',
        title: 'KIIT Campus 3',
        address: 'Campus 3 Rd, Patia, Bhubaneswar, Odisha 751024',
        lat: 20.3524,
        lng: 85.8172,
      },
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      createdAt: new Date(Date.now() - 52 * 3600 * 1000), // 2 days ago
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 52 * 3600 * 1000), note: 'Order placed' },
        { status: 'DELIVERED', timestamp: new Date(Date.now() - 51.3 * 3600 * 1000), note: 'Delivered' },
      ],
    },
    {
      orderNumber: 'ORD-194582',
      restaurantName: 'Dakshin Dosa & Idli Express',
      items: [
        { name: 'Ghee Mysore Masala Dosa', price: 129, unitPrice: 129, quantity: 2, isVeg: true, addons: [] },
        { name: 'Ghee Podi Button Idli (12 Pcs)', price: 129, unitPrice: 129, quantity: 1, isVeg: true, addons: [] },
        { name: 'Authentic Filter Coffee (Hot)', price: 59, unitPrice: 59, quantity: 2, isVeg: true, addons: [] },
      ],
      itemTotal: 505,
      packagingFee: 25,
      deliveryFee: 0,
      taxes: 25,
      discount: 40,
      grandTotal: 515,
      deliveryAddress: {
        type: 'Home',
        title: 'Chandrasekharpur',
        address: 'Damana Square, Chandrasekharpur, Bhubaneswar, Odisha 751016',
        lat: 20.3241,
        lng: 85.8239,
      },
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      createdAt: new Date(Date.now() - 96 * 3600 * 1000), // 4 days ago
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 96 * 3600 * 1000), note: 'Order placed' },
        { status: 'DELIVERED', timestamp: new Date(Date.now() - 95.4 * 3600 * 1000), note: 'Delivered' },
      ],
    },
  ];

  for (const data of sampleOrdersData) {
    const rest =
      restaurants.find((r) => r.name.toLowerCase().includes(data.restaurantName.toLowerCase().split(' ')[0])) ||
      restaurants[0];

    const existing = await Order.findOne({ orderNumber: data.orderNumber });
    if (!existing) {
      await Order.create({
        ...data,
        restaurant: rest._id,
        customer: defaultCustomer._id,
        deliveryPartner: rider._id,
      });
      console.log(`✅ Created Order: #${data.orderNumber} - ${data.restaurantName} (₹${data.grandTotal})`);
    } else {
      existing.restaurant = rest._id;
      existing.items = data.items;
      existing.grandTotal = data.grandTotal;
      existing.orderStatus = data.orderStatus;
      await existing.save();
      console.log(`Updated Order: #${data.orderNumber}`);
    }
  }

  console.log('\nREALISTIC CUSTOMER ORDERS SEEDED SUCCESSFULLY!');
  process.exit(0);
}

seedOrders().catch(console.error);
