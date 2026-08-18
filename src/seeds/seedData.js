const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const PlatformSettings = require('../models/PlatformSettings');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery_db');
    console.log('🌿 Connected to MongoDB Atlas for full seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await Coupon.deleteMany();
    await PlatformSettings.deleteMany();

    // 1. Create Core Users for each role
    const adminUser = await User.create({
      name: 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@feastfleet.com',
      password: process.env.SUPER_ADMIN_PASSWORD || 'AdminPassword2026!',
      role: 'admin',
      isOtpVerified: true,
    });

    const vendorUser1 = await User.create({
      name: 'Anand Sharma (Vendor)',
      email: 'vendor@royalbiryani.com',
      password: 'VendorPassword2026!',
      role: 'vendor',
      isOtpVerified: true,
    });

    const vendorUser2 = await User.create({
      name: 'Marco Rossi (Pizza Chef)',
      email: 'vendor@artisanpizza.com',
      password: 'VendorPassword2026!',
      role: 'vendor',
      isOtpVerified: true,
    });

    const vendorUser3 = await User.create({
      name: 'Suresh Kumar (Pure Veg)',
      email: 'vendor@greenleafveg.com',
      password: 'VendorPassword2026!',
      role: 'vendor',
      isOtpVerified: true,
    });

    const pendingVendorUser = await User.create({
      name: 'Rajesh Malhotra (Spice Hub)',
      email: 'vendor2@spicehub.com',
      password: 'VendorPassword2026!',
      role: 'vendor',
      isOtpVerified: true,
    });

    const riderUser = await User.create({
      name: 'Vikram Singh (Rider)',
      email: 'rider@feastfleet.com',
      password: 'RiderPassword2026!',
      role: 'delivery',
      isOtpVerified: true,
    });

    const customerUser = await User.create({
      name: 'Rahul Verma (Customer)',
      email: 'customer@feastfleet.com',
      password: 'CustomerPassword2026!',
      role: 'customer',
      isOtpVerified: true,
    });

    // 2. Create Platform Settings
    await PlatformSettings.create({
      commissionPercentage: 15,
      baseDeliveryCharge: 29,
      chargePerKm: 10,
      freeDeliveryThreshold: 500,
      packagingCharge: 25,
      taxPercentage: 5,
    });

    // 3. Create Categories (Section 3 & 30)
    const categories = await Category.insertMany([
      {
        name: 'Biryani',
        slug: 'biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
        itemCount: '24+ Places',
        tag: 'Bestseller',
        isActive: true,
      },
      {
        name: 'Pizzas',
        slug: 'pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
        itemCount: '18+ Places',
        tag: 'Trending',
        isActive: true,
      },
      {
        name: 'Burgers',
        slug: 'burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        itemCount: '15+ Places',
        tag: 'Popular',
        isActive: true,
      },
      {
        name: 'North Indian',
        slug: 'north-indian',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
        itemCount: '32+ Places',
        tag: 'Authentic',
        isActive: true,
      },
      {
        name: 'Chinese & Asian',
        slug: 'chinese',
        image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500',
        itemCount: '20+ Places',
        tag: 'Spicy',
        isActive: true,
      },
      {
        name: 'Desserts & Cakes',
        slug: 'desserts',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
        itemCount: '22+ Places',
        tag: 'Sweet Tooth',
        isActive: true,
      },
    ]);

    // 4. Create Coupons (Section 28)
    await Coupon.insertMany([
      {
        code: 'FEAST50',
        title: '50% OFF up to ₹120',
        subtitle: 'On orders above ₹199 | Valid on all restaurants',
        badge: 'Super Saver',
        discountPercent: 50,
        maxDiscount: 120,
        minOrder: 199,
        isActive: true,
      },
      {
        code: 'FREEDEL',
        title: 'Free Delivery',
        subtitle: 'Zero delivery charge on orders above ₹249',
        badge: 'Limited Time',
        freeDelivery: true,
        minOrder: 249,
        isActive: true,
      },
      {
        code: 'WELCOME100',
        title: 'Flat ₹100 Cashback',
        subtitle: 'On your first order via UPI & Cards',
        badge: 'New User',
        flatDiscount: 100,
        minOrder: 299,
        isActive: true,
      },
      {
        code: 'BOGO2026',
        title: 'Buy 1 Get 1 Free',
        subtitle: 'Applicable on selected Pizzas & Combos',
        badge: 'Weekend Special',
        bogo: true,
        minOrder: 350,
        isActive: true,
      },
    ]);

    // 5. Create Approved & Pending Restaurants (Sections 6, 7, 21)
    const rest1 = await Restaurant.create({
      owner: vendorUser1._id,
      name: 'The Royal Biryani & Kebabs',
      slug: 'the-royal-biryani-and-kebabs',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
      banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      cuisines: ['Biryani', 'Mughlai', 'North Indian', 'Kebabs'],
      rating: 4.8,
      ratingCount: '2.4k+',
      deliveryTime: '25-30 mins',
      distance: '2.1 km',
      deliveryFee: 0,
      minOrder: 150,
      priceForTwo: '₹450 for two',
      isVeg: false,
      featured: true,
      topRated: true,
      offer: '50% OFF up to ₹100',
      address: '42 Nizam Heritage, Central Boulevard, Connaught Place',
      coordinates: { lat: 28.6315, lng: 77.2167 },
      isOpen: true,
      kyc: {
        fssaiLicense: '10019022009841',
        gstin: '07AAAAA0000A1Z5',
        panCard: 'AAAPB1234K',
        documentUrls: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'],
      },
      status: 'APPROVED',
      commissionPercentage: 15,
    });

    const rest2 = await Restaurant.create({
      owner: vendorUser2._id,
      name: 'Artisan Crust Pizza Co.',
      slug: 'artisan-crust-pizza-co',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      banner: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=1200',
      cuisines: ['Pizzas', 'Italian', 'Pasta', 'Desserts'],
      rating: 4.7,
      ratingCount: '1.9k+',
      deliveryTime: '20-25 mins',
      distance: '1.8 km',
      deliveryFee: 29,
      minOrder: 200,
      priceForTwo: '₹600 for two',
      isVeg: false,
      featured: true,
      topRated: true,
      offer: 'Flat ₹125 OFF on ₹399',
      address: 'Shop 14, Silicon Avenue Mall, Cyber City',
      coordinates: { lat: 28.5355, lng: 77.3910 },
      isOpen: true,
      kyc: {
        fssaiLicense: '10020011005672',
        gstin: '07BBBBB2222C3Z8',
        panCard: 'BBBPB5678L',
        documentUrls: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'],
      },
      status: 'APPROVED',
      commissionPercentage: 15,
    });

    const rest3 = await Restaurant.create({
      owner: vendorUser3._id,
      name: 'Green Leaf Pure Veg Delights',
      slug: 'green-leaf-pure-veg-delights',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
      cuisines: ['North Indian', 'Thali', 'Paneer Specials', 'Desserts'],
      rating: 4.9,
      ratingCount: '3.1k+',
      deliveryTime: '25-35 mins',
      distance: '3.0 km',
      deliveryFee: 0,
      minOrder: 180,
      priceForTwo: '₹400 for two',
      isVeg: true,
      featured: true,
      topRated: true,
      offer: 'Free Sweet on ₹299',
      address: '88 Heritage Square, MG Road',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      isOpen: true,
      kyc: {
        fssaiLicense: '10018044007890',
        gstin: '07CCCCC3333D4Z9',
        panCard: 'CCCPC9012N',
        documentUrls: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'],
      },
      status: 'APPROVED',
      commissionPercentage: 15,
    });

    const pendingRest = await Restaurant.create({
      owner: pendingVendorUser._id,
      name: 'Spice Hub Express & Tandoor',
      slug: 'spice-hub-express-and-tandoor',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800',
      banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      cuisines: ['North Indian', 'Tandoori', 'Rolls', 'Biryani'],
      rating: 4.6,
      ratingCount: '500+',
      deliveryTime: '20-25 mins',
      distance: '3.4 km',
      deliveryFee: 29,
      minOrder: 180,
      priceForTwo: '₹350 for two',
      isVeg: false,
      featured: false,
      topRated: false,
      offer: '20% OFF on first order',
      address: 'Plot 18, Commercial Zone, Sector 44',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      isOpen: true,
      kyc: {
        fssaiLicense: '20021033004812',
        gstin: '07DDDDD4444E5Z0',
        panCard: 'DDDPE3456P',
        documentUrls: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'],
      },
      status: 'PENDING',
      commissionPercentage: 15,
    });

    // 6. Create Full Menus for Restaurants (Section 7)
    // Restaurant 1 Items
    const r1Items = await MenuItem.insertMany([
      {
        restaurant: rest1._id,
        name: 'Hyderabadi Dum Biryani (Chicken)',
        description: 'Aromatic basmati rice cooked on slow dum with tender marinated chicken, saffron & authentic spices. Served with Mirchi ka Salan and Raita.',
        price: 349,
        discountPrice: 289,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 840,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
        category: 'Biryani',
        addons: [
          { name: 'Extra Boiled Egg', price: 20 },
          { name: 'Special Salan Portion', price: 35 },
          { name: 'Extra Gulab Jamun (1pc)', price: 40 },
        ],
        isAvailable: true,
      },
      {
        restaurant: rest1._id,
        name: 'Paneer Tikka Dum Biryani',
        description: 'Rich basmati rice layered with charcoal-smoked cottage cheese cubes, caramelized onions & fresh mint leaves.',
        price: 299,
        discountPrice: 249,
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 520,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600',
        category: 'Biryani',
        addons: [
          { name: 'Extra Paneer Cubes', price: 50 },
          { name: 'Extra Mint Raita', price: 30 },
        ],
        isAvailable: true,
      },
      {
        restaurant: rest1._id,
        name: 'Galouti Mutton Kebabs (4 pcs)',
        description: 'Melt-in-mouth Lucknowi minced lamb kebabs infused with 16 royal spices, served with soft mini Mughlai parathas.',
        price: 399,
        discountPrice: 359,
        isVeg: false,
        isBestseller: false,
        rating: 4.8,
        ratingCount: 310,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600',
        category: 'Starters',
        addons: [
          { name: 'Extra Mughlai Paratha (2 pcs)', price: 60 },
          { name: 'Green Mint Chutney', price: 20 },
        ],
        isAvailable: true,
      },
      {
        restaurant: rest1._id,
        name: 'Murgh Malai Tikka (6 pcs)',
        description: 'Boneless chicken chunks marinated in rich cream, cashew paste, cheese, and grilled in tandoor.',
        price: 349,
        discountPrice: 319,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 290,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600',
        category: 'Starters',
        addons: [],
        isAvailable: true,
      },
    ]);

    // Restaurant 2 Items
    await MenuItem.insertMany([
      {
        restaurant: rest2._id,
        name: 'Smoked Truffle & Mushroom Pizza (11")',
        description: 'Wood-fired sourdough crust topped with wild shiitake mushrooms, truffle oil, fresh fior di latte mozzarella & rosemary.',
        price: 499,
        discountPrice: 429,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 460,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
        category: 'Pizzas',
        addons: [
          { name: 'Cheese Burst Crust', price: 90 },
          { name: 'Garlic Herb Butter Dip', price: 35 },
          { name: 'Extra Jalapenos & Olives', price: 45 },
        ],
        isAvailable: true,
      },
      {
        restaurant: rest2._id,
        name: 'Fiery Pepperoni & Hot Honey Pizza (11")',
        description: 'Hand-stretched crust, san marzano tomato sauce, imported pepperoni slices, fresh basil, drizzled with spicy chili honey.',
        price: 549,
        discountPrice: 489,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 680,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600',
        category: 'Pizzas',
        addons: [
          { name: 'Cheese Burst Crust', price: 90 },
          { name: 'Extra Pepperoni', price: 80 },
        ],
        isAvailable: true,
      },
      {
        restaurant: rest2._id,
        name: 'Creamy Truffle Alfredo Fettuccine',
        description: 'Fresh artisanal fettuccine pasta in rich parmesan cream sauce with wild garlic & sautéed button mushrooms.',
        price: 389,
        discountPrice: 339,
        isVeg: true,
        isBestseller: false,
        rating: 4.7,
        ratingCount: 220,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600',
        category: 'Main Course',
        addons: [
          { name: 'Extra Garlic Bread (2 pcs)', price: 50 },
        ],
        isAvailable: true,
      },
    ]);

    // Restaurant 3 Items (Pure Veg)
    await MenuItem.insertMany([
      {
        restaurant: rest3._id,
        name: 'Royal Shahi Paneer with Butter Naan Combo',
        description: 'Silky smooth cashew and tomato gravy with cottage cheese cubes, served with 2 crispy butter tandoori naans and salad.',
        price: 320,
        discountPrice: 279,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 1200,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
        category: 'North Indian',
        addons: [
          { name: 'Extra Butter Naan', price: 45 },
          { name: 'Gulab Jamun (2 pcs)', price: 60 },
        ],
        isAvailable: true,
      },
      {
        restaurant: rest3._id,
        name: 'Dal Makhani Overnight Slow-Cooked',
        description: 'Black lentils slow simmered for 18 hours with butter, cream, and Punjabi tandoori spices.',
        price: 260,
        discountPrice: 220,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 950,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
        category: 'North Indian',
        addons: [
          { name: 'Jeera Rice Bowl', price: 80 },
        ],
        isAvailable: true,
      },
    ]);

    // 7. Create Sample Live Order for Customer (Section 11 & 12)
    const initialOrder = await Order.create({
      orderNumber: 'ORD-10492',
      customer: customerUser._id,
      restaurant: rest1._id,
      deliveryPartner: riderUser._id,
      items: [
        {
          menuItem: r1Items[0]._id,
          name: 'Hyderabadi Dum Biryani (Chicken)',
          price: 289,
          unitPrice: 309,
          quantity: 2,
          isVeg: false,
          addons: [{ name: 'Extra Boiled Egg', price: 20 }],
          instructions: 'Extra spicy, please provide 2 spoons',
        },
      ],
      itemTotal: 618,
      packagingFee: 25,
      deliveryFee: 0,
      taxes: 31,
      discount: 0,
      grandTotal: 674,
      deliveryAddress: {
        type: 'Home',
        title: 'Flat 402, Sunshine Heights',
        address: 'Sector 62, Near IT Park, Block B',
        lat: 28.6139,
        lng: 77.2090,
      },
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      orderStatus: 'PREPARING',
      timeline: [
        { status: 'ORDER_PLACED', timestamp: new Date(Date.now() - 15 * 60 * 1000), note: 'Order placed by customer' },
        { status: 'ACCEPTED', timestamp: new Date(Date.now() - 12 * 60 * 1000), note: 'Restaurant accepted order' },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 8 * 60 * 1000), note: 'Chef preparing food in kitchen' },
      ],
    });

    console.log(`✅ Fully Seeded MongoDB Atlas with Real Data & Live Order: ${initialOrder.orderNumber}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Full Seeding Error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
