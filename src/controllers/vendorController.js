const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

// @desc    Get Vendor Restaurant Profile
// @route   GET /api/vendor/profile
// @access  Public / Private (Vendor)
exports.getVendorProfile = async (req, res) => {
  try {
    let restaurant = null;
    if (req.user && req.user._id) {
      restaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!restaurant) {
        // This specific registered vendor has not created a restaurant yet
        return res.json({
          success: true,
          restaurant: null,
          isNewVendor: true,
          message: 'Vendor has not completed KYC onboarding',
        });
      }
    } else {
      // Unauthenticated demo fallback
      restaurant = await Restaurant.findOne();
    }

    if (!restaurant) {
      return res.json({ success: true, restaurant: null, isNewVendor: true });
    }

    res.json({
      success: true,
      restaurant,
      isPendingKYC: restaurant.status === 'PENDING',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Onboard Vendor Restaurant & Submit KYC (Section 21)
// @route   POST /api/vendor/onboard
// @access  Public / Private (Vendor)
exports.onboardVendor = async (req, res) => {
  try {
    const {
      name,
      cuisines,
      address,
      coordinates,
      openingHours,
      deliveryTime,
      minOrder,
      priceForTwo,
      isVeg,
      fssai,
      gstin,
      panCard,
      fssaiDoc,
      panCardDoc,
      bankAccount,
      ifscCode,
      accountHolder,
      image,
      banner,
    } = req.body;

    let ownerId = req.user ? req.user._id : null;
    if (!ownerId) {
      const defaultVendorUser = await User.findOne({ role: 'vendor' });
      if (defaultVendorUser) ownerId = defaultVendorUser._id;
    }

    const slug = (name || 'restaurant')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);

    const parsedCuisines = Array.isArray(cuisines)
      ? cuisines
      : (cuisines || 'Multi-Cuisine').split(',').map((c) => c.trim());

    const restaurant = await Restaurant.create({
      owner: ownerId,
      name: name || 'My Restaurant Outlet',
      slug,
      image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      banner: banner || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      cuisines: parsedCuisines,
      address: address || 'Bhubaneswar, Odisha',
      coordinates: coordinates && coordinates.lat ? {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng),
      } : { lat: 20.2462, lng: 85.8458 },
      openingHours: openingHours || '10:00 AM - 11:00 PM',
      deliveryTime: deliveryTime || '25-35 mins',
      minOrder: minOrder ? Number(minOrder) : 150,
      priceForTwo: priceForTwo || '₹400 for two',
      isVeg: Boolean(isVeg),
      status: 'PENDING',
      kyc: {
        fssaiLicense: fssai || '10019022009841',
        gstin: gstin || '07AAAAA0000A1Z5',
        panCard: panCard || 'AAAPB1234K',
        documentUrls: [
          fssaiDoc,
          panCardDoc,
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
        ].filter(Boolean),
      },
    });

    // Create starter sample dishes for the new restaurant
    await MenuItem.create([
      {
        restaurant: restaurant._id,
        name: `${restaurant.name} Signature Dish`,
        category: parsedCuisines[0] || 'Main Course',
        price: 299,
        discountPrice: 249,
        isVeg: Boolean(isVeg),
        isBestseller: true,
        isAvailable: true,
        rating: 4.8,
        image: restaurant.image,
        description: `Chef's special freshly prepared ${restaurant.name} delicacy with authentic herbs & spices.`,
      },
      {
        restaurant: restaurant._id,
        name: 'Gourmet Starter Platter',
        category: 'Starters',
        price: 199,
        isVeg: Boolean(isVeg),
        isAvailable: true,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600',
        description: 'Crispy seasoned appetisers served with mint dip.',
      }
    ]);

    res.status(201).json({
      success: true,
      message: 'Restaurant KYC and outlet onboarding submitted successfully for Super Admin verification!',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Vendor Restaurant Profile & Operating Hours
// @route   PUT /api/vendor/profile
// @access  Public / Private (Vendor)
exports.updateVendorProfile = async (req, res) => {
  try {
    const { name, cuisines, address, coordinates, openingHours, deliveryTime, minOrder, priceForTwo, isOpen, image, banner } = req.body;
    
    let restaurant = null;
    if (req.user && req.user._id) {
      restaurant = await Restaurant.findOne({ owner: req.user._id });
    }
    if (!restaurant) {
      restaurant = await Restaurant.findOne();
    }

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (name) restaurant.name = name;
    if (cuisines) restaurant.cuisines = Array.isArray(cuisines) ? cuisines : cuisines.split(',').map(c => c.trim());
    if (address) restaurant.address = address;
    if (openingHours) restaurant.openingHours = openingHours;
    if (deliveryTime) restaurant.deliveryTime = deliveryTime;
    if (minOrder !== undefined) restaurant.minOrder = minOrder;
    if (priceForTwo) restaurant.priceForTwo = priceForTwo;
    if (isOpen !== undefined) restaurant.isOpen = isOpen;
    if (image) restaurant.image = image;
    if (banner) restaurant.banner = banner;
    if (coordinates && coordinates.lat && coordinates.lng) {
      restaurant.coordinates = {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng),
      };
    }

    await restaurant.save();

    res.json({ success: true, message: 'Restaurant profile updated successfully', restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Menu Items for Vendor
// @route   GET /api/vendor/menu
// @access  Public / Private (Vendor)
exports.getVendorMenu = async (req, res) => {
  try {
    let restaurant = null;
    if (req.user && req.user._id) {
      restaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!restaurant) {
        return res.json({ success: true, count: 0, data: [] });
      }
    } else {
      restaurant = await Restaurant.findOne();
    }

    const items = await MenuItem.find(restaurant ? { restaurant: restaurant._id } : {}).sort({ createdAt: -1 });

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Menu Item
// @route   POST /api/vendor/menu
// @access  Public / Private (Vendor)
exports.createVendorMenuItem = async (req, res) => {
  try {
    const { name, description, price, discountPrice, isVeg, isBestseller, image, category, addons } = req.body;

    let restaurant = null;
    if (req.user && req.user._id) {
      restaurant = await Restaurant.findOne({ owner: req.user._id });
    }
    if (!restaurant) {
      restaurant = await Restaurant.findOne();
    }

    const item = await MenuItem.create({
      restaurant: restaurant ? restaurant._id : undefined,
      name,
      description: description || name,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      isVeg: Boolean(isVeg),
      isBestseller: Boolean(isBestseller),
      image: image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
      category: category || 'Main Course',
      addons: Array.isArray(addons) ? addons : [],
      isAvailable: true,
    });

    res.status(201).json({ success: true, message: 'Dish added to menu', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit Menu Item
// @route   PUT /api/vendor/menu/:id
// @access  Public / Private (Vendor)
exports.updateVendorMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.json({ success: true, message: 'Dish updated', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Menu Item
// @route   DELETE /api/vendor/menu/:id
// @access  Public / Private (Vendor)
exports.deleteVendorMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    res.json({ success: true, message: 'Dish removed from menu' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Live Orders for Vendor Kitchen
// @route   GET /api/vendor/orders
// @access  Public / Private (Vendor)
exports.getVendorOrders = async (req, res) => {
  try {
    let restaurant = null;
    if (req.user && req.user._id) {
      restaurant = await Restaurant.findOne({ owner: req.user._id });
    }
    if (!restaurant) {
      const latestOrder = await Order.findOne().sort({ createdAt: -1 });
      if (latestOrder && latestOrder.restaurant) {
        restaurant = await Restaurant.findById(latestOrder.restaurant);
      }
      if (!restaurant) {
        restaurant = await Restaurant.findOne();
      }
    }

    const orders = await Order.find(restaurant ? { restaurant: restaurant._id } : {})
      .populate('customer', 'name phone email')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Order Status (Accept, Prepare, Ready for Pickup)
// @route   PATCH /api/vendor/orders/:id/status
// @access  Public / Private (Vendor)
exports.updateVendorOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Vendor updated status to ${status}`,
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('order_status_changed', {
        orderId: order._id,
        status,
        timeline: order.timeline,
      });
    }

    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Vendor Earnings & Settlements
// @route   GET /api/vendor/settlements
// @access  Public / Private (Vendor)
exports.getVendorSettlements = async (req, res) => {
  try {
    let restaurant = null;
    if (req.user && req.user._id) {
      restaurant = await Restaurant.findOne({ owner: req.user._id });
    }
    if (!restaurant) {
      restaurant = await Restaurant.findOne();
    }

    const orders = await Order.find(restaurant ? { restaurant: restaurant._id } : {});
    const deliveredOrders = orders.filter(o => o.orderStatus === 'DELIVERED');

    const grossSales = deliveredOrders.reduce((sum, o) => sum + (o.itemTotal || 0), 0);
    const platformCommission = Math.round(grossSales * 0.15); // 15% platform fee
    const netEarnings = grossSales - platformCommission;

    res.json({
      success: true,
      metrics: {
        totalOrders: orders.length,
        deliveredOrders: deliveredOrders.length,
        grossSales,
        platformCommission,
        netEarnings,
        settlementStatus: 'PENDING_PAYOUT',
        settlementSchedule: 'Weekly every Monday',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
