const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const MenuItem = require('../src/models/MenuItem');

const restaurantsData = [
  {
    vendorEmail: 'biryani@feastfleet.com',
    vendorName: 'Farhan Akhtar (Royal Biryani)',
    vendorPhone: '+91 98765 11001',
    restaurant: {
      name: 'The Royal Biryani & Kebabs',
      slug: 'the-royal-biryani-kebabs',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
      cuisines: ['Biryani', 'Mughlai', 'North Indian', 'Kebabs'],
      rating: 4.8,
      ratingCount: '1.2k+',
      deliveryTime: '25-30 mins',
      distance: '2.4 km',
      deliveryFee: 25,
      minOrder: 150,
      priceForTwo: '₹450 for two',
      isVeg: false,
      featured: true,
      topRated: true,
      offer: '40% OFF up to ₹100 | USE ROYAL40',
      address: 'Plot 108, Master Canteen Square, Station Bazar, Bhubaneswar, Odisha 751001',
      coordinates: { lat: 20.2644, lng: 85.8398 },
      isOpen: true,
      status: 'APPROVED',
    },
    menuItems: [
      {
        name: 'Hyderabadi Dum Chicken Biryani',
        description: 'Authentic long-grain basmati rice layered with succulent chicken pieces, saffron, fried onions, and royal spices. Served with Mirchi ka Salan & Raita.',
        price: 289,
        discountPrice: 249,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 340,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        category: 'Biryani Specials',
        addons: [
          { name: 'Extra Boiled Egg', price: 20 },
          { name: 'Extra Mirchi Ka Salan', price: 35 },
          { name: 'Double Masala Portion', price: 40 },
        ],
      },
      {
        name: 'Awadhi Mutton Dum Biryani',
        description: 'Tender baby goat mutton pieces slow-cooked under dum in sealed handi with fragrant aged basmati and desi ghee.',
        price: 389,
        discountPrice: 349,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 210,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
        category: 'Biryani Specials',
        addons: [
          { name: 'Extra Mutton Piece', price: 90 },
          { name: 'Burani Garlic Raita', price: 40 },
        ],
      },
      {
        name: 'Chicken Malai Tikka (6 Pcs)',
        description: 'Boneless chicken cubes marinated in rich cashew paste, hung curd, fresh cream, and grilled to golden perfection in clay tandoor.',
        price: 269,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 180,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
        category: 'Starters & Tandoor',
        addons: [
          { name: 'Mint Chutney & Pickled Onions', price: 25 },
          { name: 'Extra Butter Glaze', price: 20 },
        ],
      },
      {
        name: 'Paneer Tikka Angara',
        description: 'Fresh malai paneer cubes marinated in spicy smoked Kashmiri masala, capsicum, and onions grilled over charcoal.',
        price: 229,
        isVeg: true,
        isBestseller: false,
        rating: 4.7,
        ratingCount: 95,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
        category: 'Starters & Tandoor',
        addons: [{ name: 'Extra Mint Dip', price: 20 }],
      },
      {
        name: 'Garlic Butter Naan (2 Pcs)',
        description: 'Traditional refined flour bread baked in tandoor, topped with roasted minced garlic and dollops of salted butter.',
        price: 65,
        isVeg: true,
        isBestseller: false,
        rating: 4.8,
        ratingCount: 410,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        category: 'Breads & Accompaniments',
        addons: [{ name: 'Cheese Stuffed Layer', price: 35 }],
      },
      {
        name: 'Shahi Royal Phirni',
        description: 'Slow-cooked crushed basmati rice pudding infused with saffron, cardamom, and garnished with roasted pistachios in earthen kulhad.',
        price: 99,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 150,
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        category: 'Desserts',
        addons: [{ name: 'Extra Pistachio Saffron Topping', price: 30 }],
      },
    ],
  },
  {
    vendorEmail: 'odia@feastfleet.com',
    vendorName: 'Debabrata Mohapatra (Odia Kitchen)',
    vendorPhone: '+91 98765 11002',
    restaurant: {
      name: 'Odisha Dalma & Authentic Odia Thali',
      slug: 'odisha-dalma-authentic-odia-thali',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=1200&auto=format&fit=crop&q=80',
      cuisines: ['Authentic Odia', 'Thali', 'Seafood', 'Traditional'],
      rating: 4.9,
      ratingCount: '850+',
      deliveryTime: '20-25 mins',
      distance: '1.8 km',
      deliveryFee: 19,
      minOrder: 120,
      priceForTwo: '₹350 for two',
      isVeg: false,
      featured: true,
      topRated: true,
      offer: 'FLAT ₹75 OFF on Odia Delicacies',
      address: '52/B, Saheed Nagar, Near Pantaloons, Bhubaneswar, Odisha 751007',
      coordinates: { lat: 20.2882, lng: 85.8431 },
      isOpen: true,
      status: 'APPROVED',
    },
    menuItems: [
      {
        name: 'Authentic Temple Style Dalma',
        description: 'Traditional slow-cooked toor dal with raw papaya, pumpkin, brinjal, arbi, and roasted cumin-chilli ghee tadka with fresh grated coconut.',
        price: 139,
        discountPrice: 119,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 290,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
        category: 'Odia Main Course',
        addons: [
          { name: 'Extra Desi Ghee Drizzle', price: 25 },
          { name: 'Fried Badi Chura Bowl', price: 35 },
        ],
      },
      {
        name: 'Special Royal Pakhala Bhata Thali',
        description: 'Fermented water rice served with Badi Chura, Baigana Bhaja (Fried Brinjal), Saga Bhaja, Aloo Bharta, Papad, Lemon, and Green Chilli.',
        price: 199,
        discountPrice: 179,
        isVeg: true,
        isBestseller: true,
        rating: 5.0,
        ratingCount: 420,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        category: 'Pakhala & Thali',
        addons: [
          { name: 'Add Machha Bhaja (Fried Fish)', price: 85 },
          { name: 'Add Sukhua Bhaja', price: 60 },
        ],
      },
      {
        name: 'Chilika Machha Besara (Fish in Mustard Gravy)',
        description: 'Fresh freshwater Rohu/Bhakur fish steaks simmered in traditional pungent Odia yellow mustard paste with raw banana and ambula.',
        price: 249,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 160,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        category: 'Odia Seafood',
        addons: [{ name: 'Extra Fish Piece', price: 75 }],
      },
      {
        name: 'Puri Famous Baked Chenna Poda (250g)',
        description: 'Lord Jagannath’s favorite caramelized baked cottage cheese dessert with cardamom, cashew nuts, and caramelized sugar crust.',
        price: 149,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 380,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        category: 'Traditional Sweets',
        addons: [{ name: 'Upgrade to 500g Box', price: 120 }],
      },
    ],
  },
  {
    vendorEmail: 'southindian@feastfleet.com',
    vendorName: 'Karthik Raman (Dakshin Dosa)',
    vendorPhone: '+91 98765 11003',
    restaurant: {
      name: 'Dakshin Dosa & Idli Express',
      slug: 'dakshin-dosa-idli-express',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200&auto=format&fit=crop&q=80',
      cuisines: ['South Indian', 'Dosa', 'Pure Veg', 'Breakfast'],
      rating: 4.7,
      ratingCount: '950+',
      deliveryTime: '15-20 mins',
      distance: '3.1 km',
      deliveryFee: 20,
      minOrder: 100,
      priceForTwo: '₹250 for two',
      isVeg: true,
      featured: true,
      topRated: true,
      offer: '20% OFF on all South Indian Combos',
      address: 'Infocity Road, Patia, Opposite KIIT Campus 6, Bhubaneswar, Odisha 751024',
      coordinates: { lat: 20.3541, lng: 85.8185 },
      isOpen: true,
      status: 'APPROVED',
    },
    menuItems: [
      {
        name: 'Ghee Mysore Masala Dosa',
        description: 'Crispy golden crepe smeared with spicy red garlic-chutney, stuffed with spiced potato masala and roasted in pure Amul ghee. Served with 3 chutneys & drumstick sambar.',
        price: 149,
        discountPrice: 129,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 310,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
        category: 'Crispy Dosas',
        addons: [
          { name: 'Extra Cheese Topping', price: 35 },
          { name: 'Extra Gunpowder Podi', price: 20 },
        ],
      },
      {
        name: 'Ghee Podi Button Idli (12 Pcs)',
        description: 'Mini bite-sized steamed rice cakes tossed in fiery Karampodi gunpowder and piping hot melted desi ghee.',
        price: 129,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 190,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        category: 'Idli & Vada',
        addons: [{ name: 'Extra Coconut Chutney Cup', price: 15 }],
      },
      {
        name: 'Medu Vada Sambar (2 Pcs)',
        description: 'Crisp on the outside, fluffy inside black gram fritters dunked in hot aromatic Madras sambar.',
        price: 99,
        isVeg: true,
        isBestseller: false,
        rating: 4.7,
        ratingCount: 140,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80',
        category: 'Idli & Vada',
        addons: [{ name: 'Extra Tomato Chutney', price: 15 }],
      },
      {
        name: 'Authentic Filter Coffee (Hot)',
        description: 'Traditional decoction filter coffee brewed with chicory and frothed with full-cream milk in stainless steel davarah.',
        price: 59,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 260,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        category: 'Beverages',
        addons: [{ name: 'Extra Strong Decoction Shot', price: 20 }],
      },
    ],
  },
  {
    vendorEmail: 'tandoor@feastfleet.com',
    vendorName: 'Harpreet Singh (Urban Tandoor)',
    vendorPhone: '+91 98765 11004',
    restaurant: {
      name: 'Urban Tandoor & Grill Garden',
      slug: 'urban-tandoor-grill-garden',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      cuisines: ['North Indian', 'Tandoori', 'Paneer Specials', 'Curries'],
      rating: 4.8,
      ratingCount: '700+',
      deliveryTime: '30-35 mins',
      distance: '4.2 km',
      deliveryFee: 30,
      minOrder: 150,
      priceForTwo: '₹500 for two',
      isVeg: false,
      featured: true,
      topRated: false,
      offer: 'Free Gulab Jamun on orders above ₹299',
      address: 'Plot 420, Khandagiri Square, Near Cave Monuments, Bhubaneswar, Odisha 751030',
      coordinates: { lat: 20.2589, lng: 85.7865 },
      isOpen: true,
      status: 'APPROVED',
    },
    menuItems: [
      {
        name: 'Murgh Makhani (Butter Chicken)',
        description: 'Tandoori smoked chicken tikka simmered in silky tomato, butter, and cashew gravy infused with dried kasuri methi.',
        price: 319,
        discountPrice: 279,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 310,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
        category: 'North Indian Curries',
        addons: [
          { name: 'Extra Cream & Butter Topping', price: 30 },
          { name: 'Boneless Tikka Upgrade', price: 45 },
        ],
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Diced cottage cheese in luscious creamy tomato-onion gravy with a hint of green cardamom and butter.',
        price: 249,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 220,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
        category: 'North Indian Curries',
        addons: [{ name: 'Extra Paneer Cubes (4 Pcs)', price: 40 }],
      },
      {
        name: 'Dal Makhani Slow-Cooked (Bukhara Style)',
        description: 'Black lentils and kidney beans simmered overnight on slow charcoal fire with butter, cream, and aromatic spices.',
        price: 199,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 180,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
        category: 'North Indian Curries',
        addons: [{ name: 'Extra Desi Makhan Cube', price: 20 }],
      },
      {
        name: 'Gulab Jamun with Rabdi (2 Pcs)',
        description: 'Warm fried khoya dumplings soaked in rose sugar syrup served over chilled saffron rabdi.',
        price: 89,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 150,
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        category: 'Desserts',
        addons: [{ name: 'Extra Rabdi Cup', price: 35 }],
      },
    ],
  },
  {
    vendorEmail: 'chinese@feastfleet.com',
    vendorName: 'Chef Lin Wang (Dragon Wok)',
    vendorPhone: '+91 98765 11005',
    restaurant: {
      name: 'Dragon Wok & Dimsum Lounge',
      slug: 'dragon-wok-dimsum-lounge',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1200&auto=format&fit=crop&q=80',
      cuisines: ['Pan-Asian', 'Chinese', 'Dimsums', 'Noodles'],
      rating: 4.7,
      ratingCount: '620+',
      deliveryTime: '25-30 mins',
      distance: '2.1 km',
      deliveryFee: 25,
      minOrder: 150,
      priceForTwo: '₹400 for two',
      isVeg: false,
      featured: false,
      topRated: true,
      offer: '30% OFF up to ₹80 on Asian Bowls',
      address: 'Forum Mart Mall, Kharvel Nagar, Unit 3, Bhubaneswar, Odisha 751001',
      coordinates: { lat: 20.2731, lng: 85.8362 },
      isOpen: true,
      status: 'APPROVED',
    },
    menuItems: [
      {
        name: 'Steamed Chicken Dimsums (6 Pcs)',
        description: 'Delicate translucent wheat wrappers stuffed with minced chicken, spring onion, and ginger. Served with fiery chilli oil dip.',
        price: 189,
        discountPrice: 169,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 190,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
        category: 'Dimsums & Momos',
        addons: [{ name: 'Extra Schezwan Chilli Dip', price: 20 }],
      },
      {
        name: 'Schezwan Chicken Hakka Noodles',
        description: 'Wok-tossed egg noodles with shredded chicken, crunchy bell peppers, cabbage, and home-made spicy Schezwan sauce.',
        price: 219,
        isVeg: false,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 240,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
        category: 'Noodles & Rice',
        addons: [
          { name: 'Add Fried Egg on Top', price: 25 },
          { name: 'Extra Chicken Bits', price: 40 },
        ],
      },
      {
        name: 'Crispy Chilli Honey Babycorn',
        description: 'Batter-fried tender babycorn tossed in wok with bell peppers, sweet honey, and spicy garlic glaze.',
        price: 179,
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        ratingCount: 120,
        image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
        category: 'Starters',
        addons: [{ name: 'Extra Spicy Level', price: 0 }],
      },
    ],
  },
  {
    vendorEmail: 'burger@feastfleet.com',
    vendorName: 'Alex D’Souza (Crust & Patty)',
    vendorPhone: '+91 98765 11006',
    restaurant: {
      name: 'The Crust & Patty Burger Co.',
      slug: 'the-crust-patty-burger-co',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80',
      cuisines: ['Burgers', 'American', 'Crispy Wings', 'Shakes'],
      rating: 4.8,
      ratingCount: '1.1k+',
      deliveryTime: '20-25 mins',
      distance: '3.8 km',
      deliveryFee: 29,
      minOrder: 150,
      priceForTwo: '₹400 for two',
      isVeg: false,
      featured: true,
      topRated: true,
      offer: 'Buy 1 Burger Get 1 Fries FREE',
      address: 'DLF Cyber City, Chandaka Industrial Estate, Patia, Bhubaneswar, Odisha 751024',
      coordinates: { lat: 20.3602, lng: 85.8234 },
      isOpen: true,
      status: 'APPROVED',
    },
    menuItems: [
      {
        name: 'Smoked BBQ Crispy Chicken Burger',
        description: 'Golden fried chicken breast patty drenched in smoky hickory BBQ sauce, cheddar cheese slice, caramelized onions, and iceberg lettuce on toasted brioche.',
        price: 229,
        discountPrice: 199,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 390,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        category: 'Gourmet Burgers',
        addons: [
          { name: 'Add Extra Cheddar Cheese Slice', price: 30 },
          { name: 'Add Crispy Bacon Strips (Chicken)', price: 45 },
          { name: 'Upgrade with Peri Peri Fries & Dip', price: 65 },
        ],
      },
      {
        name: 'Truffle Parmesan Crinkle Fries',
        description: 'Crispy crinkle-cut potato fries drizzled with aromatic white truffle oil, grated parmesan cheese, and parsley.',
        price: 139,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 220,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
        category: 'Sides & Fries',
        addons: [{ name: 'Add Jalapeno Cheese Sauce', price: 30 }],
      },
      {
        name: 'Nutella Belgian Chocolate Thickshake',
        description: 'Rich creamy milkshake blended with authentic Nutella, dark Belgian cocoa, vanilla ice cream, and chocolate fudge.',
        price: 159,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 180,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
        category: 'Thickshakes',
        addons: [{ name: 'Whipped Cream & Choco Chips', price: 25 }],
      },
    ],
  },
  {
    vendorEmail: 'sweets@feastfleet.com',
    vendorName: 'Sasmita Sahoo (Mithai Mahalo)',
    vendorPhone: '+91 98765 11007',
    restaurant: {
      name: 'Pahala Rasgulla & Mithai Mahalo',
      slug: 'pahala-rasgulla-mithai-mahalo',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop&q=80',
      cuisines: ['Sweets', 'Desserts', 'Snacks', 'Chaat'],
      rating: 4.9,
      ratingCount: '1.5k+',
      deliveryTime: '15-20 mins',
      distance: '1.2 km',
      deliveryFee: 15,
      minOrder: 80,
      priceForTwo: '₹200 for two',
      isVeg: true,
      featured: true,
      topRated: true,
      offer: 'FLAT 15% OFF on Mithai Boxes',
      address: 'Bindu Sagar Road, Old Town Heritage Area, Bhubaneswar, Odisha 751002',
      coordinates: { lat: 20.2415, lng: 85.8340 },
      isOpen: true,
      status: 'APPROVED',
    },
    menuItems: [
      {
        name: 'Famous Hot Pahala Rasgulla (6 Pcs)',
        description: 'Authentic brown caramelized soft chenna sponge dumplings soaked in light warm cardamom sugar syrup. Straight from Pahala tradition.',
        price: 120,
        discountPrice: 99,
        isVeg: true,
        isBestseller: true,
        rating: 5.0,
        ratingCount: 650,
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        category: 'Hot Sweets',
        addons: [{ name: 'Pack of 12 Pieces', price: 90 }],
      },
      {
        name: 'Cuttack Famous Dahi Bara Aloo Dum',
        description: 'Soft lentil dumplings soaked in tempered sour curd water, topped with spicy ghuguni aloo dum, sev, onion, and roasted cumin powder.',
        price: 89,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 480,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        category: 'Street Chaat',
        addons: [{ name: 'Extra Dahi Water Cup', price: 15 }],
      },
      {
        name: 'Royal Saffron Rasmalai (2 Pcs)',
        description: 'Patted cottage cheese discs soaked in sweetened condensed saffron milk infused with green cardamom and slivered almonds.',
        price: 99,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 220,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        category: 'Chilled Sweets',
        addons: [{ name: 'Add Extra Pistachio Flakes', price: 20 }],
      },
    ],
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('VendorPass2026!', salt);

    console.log('\n--- SEEDING BHUBANESWAR RESTAURANTS & VENDORS ---\n');

    for (const data of restaurantsData) {
      // 1. Create or Find Vendor User
      let vendorUser = await User.findOne({ email: data.vendorEmail });
      if (!vendorUser) {
        vendorUser = await User.create({
          name: data.vendorName,
          email: data.vendorEmail,
          password: defaultPasswordHash,
          phone: data.vendorPhone,
          role: 'vendor',
          isActive: true,
          isOtpVerified: true,
        });
        console.log(`Created Vendor User: ${data.vendorEmail}`);
      } else {
        vendorUser.password = defaultPasswordHash;
        vendorUser.role = 'vendor';
        await vendorUser.save();
        console.log(`Updated Vendor User: ${data.vendorEmail}`);
      }

      // 2. Create or Update Restaurant
      let restaurant = await Restaurant.findOne({ slug: data.restaurant.slug });
      if (!restaurant) {
        restaurant = await Restaurant.create({
          ...data.restaurant,
          owner: vendorUser._id,
        });
        console.log(`Created Restaurant: ${restaurant.name} (ID: ${restaurant._id})`);
      } else {
        Object.assign(restaurant, data.restaurant);
        restaurant.owner = vendorUser._id;
        await restaurant.save();
        console.log(`Updated Restaurant: ${restaurant.name} (ID: ${restaurant._id})`);
      }

      // 3. Populate Menu Items
      for (const item of data.menuItems) {
        const existingItem = await MenuItem.findOne({
          restaurant: restaurant._id,
          name: item.name,
        });

        if (!existingItem) {
          await MenuItem.create({
            ...item,
            restaurant: restaurant._id,
            isAvailable: true,
          });
          console.log(`  -> Added Dish: ${item.name} (₹${item.price})`);
        } else {
          Object.assign(existingItem, item);
          await existingItem.save();
          console.log(`  -> Updated Dish: ${item.name} (₹${item.price})`);
        }
      }
    }

    console.log('\n=============================================');
    console.log('✅ ALL BHUBANESWAR RESTAURANTS SEEDED SUCCESSFULLY!');
    console.log('=============================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seed();
