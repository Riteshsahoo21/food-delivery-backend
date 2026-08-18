const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Get all restaurants with search, cuisine, and pure veg filters
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
  try {
    const { search, cuisine, vegOnly, sortBy, category } = req.query;
    let query = { status: 'APPROVED' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (cuisine) {
      query.cuisines = { $in: [new RegExp(cuisine, 'i')] };
    }

    if (vegOnly === 'true') {
      query.isVeg = true;
    }

    let sortOption = { rating: -1 };
    if (sortBy === 'time') sortOption = { deliveryTime: 1 };
    if (sortBy === 'price') sortOption = { minOrder: 1 };

    const restaurants = await Restaurant.find(query).sort(sortOption);

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single restaurant with full menu
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let restaurant = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      restaurant = await Restaurant.findById(req.params.id);
    }

    if (!restaurant) {
      restaurant = await Restaurant.findOne({
        $or: [
          { slug: req.params.id },
          { name: new RegExp(`^${req.params.id}$`, 'i') },
        ],
      });
    }

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const menu = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true });

    res.json({
      success: true,
      restaurant,
      menu,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Restaurant KYC Application
// @route   POST /api/restaurants/kyc
// @access  Private (Vendor / User)
exports.submitRestaurantKYC = async (req, res) => {
  try {
    const { name, cuisines, address, fssaiLicense, gstin, panCard, image } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const restaurant = await Restaurant.create({
      owner: req.user._id,
      name,
      slug,
      image: image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
      cuisines: Array.isArray(cuisines) ? cuisines : [cuisines],
      address,
      kyc: {
        fssaiLicense,
        gstin,
        panCard,
      },
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant KYC submitted for Super Admin approval',
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
