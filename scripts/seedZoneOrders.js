const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function seedZoneOrders() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Restaurant = require('../src/models/Restaurant');
  const Order = require('../src/models/Order');
  const User = require('../src/models/User');

  const customer = await User.findOne({ role: 'customer' }) || await User.findOne();

  // Find restaurants in each zone
  const ritzs = await Restaurant.findOne({ name: /ritzs/i });
  const burger = await Restaurant.findOne({ name: /Crust & Patty/i });
  const biryani = await Restaurant.findOne({ name: /Royal Biryani/i });
  const sweets = await Restaurant.findOne({ name: /Pahala/i });
  const tandoor = await Restaurant.findOne({ name: /Urban Tandoor/i });

  console.log('Found restaurants for zones:', {
    rasulgarh: ritzs?.name,
    patia: burger?.name,
    masterCanteen: biryani?.name,
    oldTown: sweets?.name,
    khandagiri: tandoor?.name
  });

  const ordersToCreate = [];

  // Zone 1: Rasulgarh
  if (ritzs) {
    ordersToCreate.push({
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customer: customer._id,
      restaurant: ritzs._id,
      deliveryPartner: null,
      orderStatus: 'READY_FOR_PICKUP',
      itemTotal: 440,
      grandTotal: 480,
      packagingFee: 20,
      deliveryFee: 20,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      items: [
        { name: 'Chicken Dum Biryani (Full Handi)', quantity: 2, price: 220, isVeg: false }
      ],
      deliveryAddress: {
        address: 'Plot 45, Mancheswar Industrial Estate, Rasulgarh, Bhubaneswar',
        title: 'Mancheswar Office',
        lat: 20.2980,
        lng: 85.8650
      },
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 25 * 60000), note: 'Order placed by customer' },
        { status: 'ACCEPTED', timestamp: new Date(Date.now() - 20 * 60000), note: 'Kitchen accepted order' },
        { status: 'READY_FOR_PICKUP', timestamp: new Date(Date.now() - 5 * 60000), note: 'Order packed & ready for courier pickup' }
      ]
    });
  }

  // Zone 2: Patia
  if (burger) {
    ordersToCreate.push({
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customer: customer._id,
      restaurant: burger._id,
      deliveryPartner: null,
      orderStatus: 'READY_FOR_PICKUP',
      itemTotal: 480,
      grandTotal: 520,
      packagingFee: 20,
      deliveryFee: 20,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      items: [
        { name: 'Double Smash Cheeseburger', quantity: 2, price: 240, isVeg: false }
      ],
      deliveryAddress: {
        address: 'Tower 4, DLF Cybercity Residences, Patia, Bhubaneswar',
        title: 'Apartment 402',
        lat: 20.3620,
        lng: 85.8250
      },
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 20 * 60000), note: 'Order placed by customer' },
        { status: 'READY_FOR_PICKUP', timestamp: new Date(Date.now() - 3 * 60000), note: 'Burgers boxed and ready for pickup' }
      ]
    });
  }

  // Zone 3: Master Canteen / Saheed Nagar
  if (biryani) {
    ordersToCreate.push({
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customer: customer._id,
      restaurant: biryani._id,
      deliveryPartner: null,
      orderStatus: 'READY_FOR_PICKUP',
      itemTotal: 600,
      grandTotal: 650,
      packagingFee: 25,
      deliveryFee: 25,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      items: [
        { name: 'Mutton Kacchi Biryani', quantity: 1, price: 380, isVeg: false }
      ],
      deliveryAddress: {
        address: 'House 18, Kharvel Nagar, Saheed Nagar, Bhubaneswar',
        title: 'Home',
        lat: 20.2740,
        lng: 85.8380
      },
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 30 * 60000), note: 'Order placed by customer' },
        { status: 'READY_FOR_PICKUP', timestamp: new Date(Date.now() - 8 * 60000), note: 'Royal handi packed and ready' }
      ]
    });
  }

  // Zone 4: Old Town
  if (sweets) {
    ordersToCreate.push({
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customer: customer._id,
      restaurant: sweets._id,
      deliveryPartner: null,
      orderStatus: 'READY_FOR_PICKUP',
      itemTotal: 280,
      grandTotal: 320,
      packagingFee: 20,
      deliveryFee: 20,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      items: [
        { name: 'Hot Spongy Pahala Rasgulla (Box of 10)', quantity: 1, price: 200, isVeg: true }
      ],
      deliveryAddress: {
        address: 'Lane 3, Samantarapur, Near Toll Gate, Old Town, Bhubaneswar',
        title: 'Residence',
        lat: 20.2440,
        lng: 85.8420
      },
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 18 * 60000), note: 'Order placed by customer' },
        { status: 'READY_FOR_PICKUP', timestamp: new Date(Date.now() - 4 * 60000), note: 'Sweets boxed and ready for pickup' }
      ]
    });
  }

  // Zone 5: Khandagiri
  if (tandoor) {
    ordersToCreate.push({
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customer: customer._id,
      restaurant: tandoor._id,
      deliveryPartner: null,
      orderStatus: 'READY_FOR_PICKUP',
      itemTotal: 450,
      grandTotal: 490,
      packagingFee: 20,
      deliveryFee: 20,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      items: [
        { name: 'Tandoori Chicken (Half)', quantity: 1, price: 290, isVeg: false }
      ],
      deliveryAddress: {
        address: 'B-Block, ITER College Road, Khandagiri, Bhubaneswar',
        title: 'Student Hostel',
        lat: 20.2550,
        lng: 85.7920
      },
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 22 * 60000), note: 'Order placed by customer' },
        { status: 'READY_FOR_PICKUP', timestamp: new Date(Date.now() - 6 * 60000), note: 'Tandoor dishes fresh from clay oven' }
      ]
    });
  }

  console.log(`Creating ${ordersToCreate.length} zone-specific test orders...`);
  for (const o of ordersToCreate) {
    const created = await Order.create(o);
    console.log(`✅ Created Order #${created.orderNumber} for restaurant: ${o.restaurant}`);
  }

  process.exit(0);
}

seedZoneOrders().catch(err => {
  console.error(err);
  process.exit(1);
});
