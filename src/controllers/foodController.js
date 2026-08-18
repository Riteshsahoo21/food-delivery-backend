const MenuItem = require('../models/MenuItem');

// @desc    Get menu items (by restaurant or popular)
// @route   GET /api/food
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId, category, bestseller, search } = req.query;
    let query = { isAvailable: true };

    if (restaurantId) query.restaurant = restaurantId;
    if (category) query.category = category;
    if (bestseller === 'true') query.isBestseller = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await MenuItem.find(query).populate('restaurant', 'name rating deliveryTime');

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/food
// @access  Private (Vendor / Admin)
exports.createMenuItem = async (req, res) => {
  try {
    const { restaurant, name, description, price, discountPrice, isVeg, isBestseller, image, category, addons } = req.body;

    const item = await MenuItem.create({
      restaurant,
      name,
      description,
      price,
      discountPrice,
      isVeg,
      isBestseller,
      image,
      category,
      addons,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle item availability
// @route   PATCH /api/food/:id/availability
// @access  Private (Vendor)
exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({
      success: true,
      isAvailable: item.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
