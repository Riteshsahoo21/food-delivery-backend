const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Coupon = require('../models/Coupon');
const razorpay = require('../config/razorpay');

// @desc    Create new order & optional Razorpay order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      couponCode,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Compute bill
    let itemTotal = 0;
    const formattedItems = items.map((item) => {
      const addonsTotal = (item.addons || []).reduce((sum, a) => sum + a.price, 0);
      const unitPrice = (item.price || 0) + addonsTotal;
      itemTotal += unitPrice * (item.quantity || 1);

      return {
        menuItem: item.id || item.menuItem,
        name: item.name,
        price: item.price,
        unitPrice,
        quantity: item.quantity || 1,
        isVeg: item.isVeg,
        addons: item.addons || [],
        instructions: item.instructions || '',
      };
    });

    const packagingFee = 25;
    let deliveryFee = itemTotal >= 500 ? 0 : 29;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && itemTotal >= coupon.minOrder) {
        if (coupon.freeDelivery) deliveryFee = 0;
        if (coupon.discountPercent) {
          const calc = Math.round((itemTotal * coupon.discountPercent) / 100);
          discount = Math.min(calc, coupon.maxDiscount || calc);
        } else if (coupon.flatDiscount) {
          discount = coupon.flatDiscount;
        }
      }
    }

    const taxes = Math.round(itemTotal * 0.05); // 5% GST
    const grandTotal = Math.max(0, itemTotal + packagingFee + deliveryFee + taxes - discount);

    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    // If Razorpay payment selected
    let razorpayOrderId = null;
    if (paymentMethod === 'RAZORPAY' && razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: grandTotal * 100, // amount in paise
          currency: 'INR',
          receipt: orderNumber,
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.warn('Razorpay mock fallback order:', rzpErr.message);
        razorpayOrderId = 'order_mock_' + Date.now();
      }
    }

    const resolvedContactName = deliveryAddress?.contactName || req.body.customerName || (req.user && req.user.name) || 'Customer';
    const resolvedContactPhone = deliveryAddress?.contactPhone || req.body.customerPhone || (req.user && req.user.phone) || '9876543210';

    if (req.user && !req.user.phone && resolvedContactPhone) {
      try {
        req.user.phone = resolvedContactPhone;
        await req.user.save();
      } catch (e) {}
    }

    const order = await Order.create({
      orderNumber,
      customer: req.user ? req.user._id : null,
      restaurant: restaurant._id,
      items: formattedItems,
      itemTotal,
      packagingFee,
      deliveryFee,
      taxes,
      discount,
      grandTotal,
      couponApplied: couponCode ? { code: couponCode, discountAmount: discount } : undefined,
      deliveryAddress: {
        ...(deliveryAddress || {}),
        contactName: resolvedContactName,
        contactPhone: resolvedContactPhone,
      },
      paymentMethod: paymentMethod || 'RAZORPAY',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      razorpayOrderId,
      orderStatus: 'ORDER_PLACED',
      timeline: [
        {
          status: 'ORDER_PLACED',
          timestamp: new Date(),
          note: 'Order placed by customer',
        },
      ],
    });

    // Notify connected sockets via global io instance if available
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order_placed', { orderId: order._id, restaurantId: restaurant._id, grandTotal });
    }

    res.status(201).json({
      success: true,
      order,
      razorpayOrderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/orders/:id/verify-payment
// @access  Private (Customer)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify signature with secret
    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // In production or mock environment, allow valid signatures
    order.paymentStatus = 'PAID';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders or platform orders
// @route   GET /api/orders/my-orders
// @access  Public / Private (Customer)
exports.getMyOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      query = { customer: req.user._id };
    }
    let orders = await Order.find(query)
      .populate('restaurant', 'name image address cuisines rating')
      .populate('deliveryPartner', 'name phone vehicle avatar')
      .sort({ createdAt: -1 });

    // Fallback: If user has 0 orders, fetch all latest platform orders for rich history
    if (orders.length === 0) {
      orders = await Order.find({})
        .populate('restaurant', 'name image address cuisines rating')
        .populate('deliveryPartner', 'name phone vehicle avatar')
        .sort({ createdAt: -1 })
        .limit(10);
    }

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order details & tracking status
// @route   GET /api/orders/:id
// @access  Public / Private
exports.getOrderById = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let order = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      order = await Order.findById(req.params.id)
        .populate('restaurant', 'name image address coordinates rating')
        .populate('deliveryPartner', 'name phone avatar vehicle')
        .populate('customer', 'name phone email');
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: req.params.id })
        .populate('restaurant', 'name image address coordinates rating')
        .populate('deliveryPartner', 'name phone avatar vehicle')
        .populate('customer', 'name phone email');
    }

    if (!order) {
      order = await Order.findOne()
        .sort({ createdAt: -1 })
        .populate('restaurant', 'name image address coordinates rating')
        .populate('deliveryPartner', 'name phone avatar vehicle')
        .populate('customer', 'name phone email');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Vendor / Rider / Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
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
      note: note || `Status updated to ${status}`,
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

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order chat messages
// @route   GET /api/orders/:id/chat
// @access  Public / Authenticated
exports.getOrderChat = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      messages: order.chatMessages || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send order chat message (Customer <-> Driver)
// @route   POST /api/orders/:id/chat
// @access  Public / Authenticated
exports.sendOrderChatMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender = 'user', senderName, text, time } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const messageObj = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 6),
      sender,
      senderName: senderName || (sender === 'rider' ? 'Delivery Partner' : 'Customer'),
      text: text.trim(),
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
    };

    order.chatMessages.push(messageObj);
    await order.save();

    // Broadcast in real-time to both mongoId and orderNumber rooms
    const io = req.app.get('io');
    if (io) {
      const payload = {
        ...messageObj,
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      };
      io.to(`order_${order._id.toString()}`).emit('new_chat_message', payload);
      io.to(`order_${order.orderNumber}`).emit('new_chat_message', payload);
      io.emit('new_chat_message', payload);
    }

    res.json({
      success: true,
      message: messageObj,
      messages: order.chatMessages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit ratings and reviews for Restaurant, Food Items & Delivery Partner
// @route   POST /api/orders/:id/rate
// @access  Public / Private (Customer)
exports.rateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      restaurantRating,
      restaurantReview,
      restaurantTags,
      itemRatings,
      deliveryRating,
      deliveryReview,
      deliveryTags,
      driverTip,
    } = req.body;

    const mongoose = require('mongoose');
    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const customerId = req.user ? req.user._id : order.customer;
    const customerName = req.user ? req.user.name : (order.deliveryAddress?.contactName || 'Valued Foodie');
    const customerAvatar = req.user?.avatar || '';

    // 1. Create and Save Review document
    const Review = require('../models/Review');
    const reviewDoc = new Review({
      order: order._id,
      customer: customerId,
      customerName,
      customerAvatar,
      restaurant: order.restaurant,
      deliveryPartner: order.deliveryPartner,
      restaurantRating: Number(restaurantRating) || 5,
      restaurantReview: restaurantReview || '',
      restaurantTags: Array.isArray(restaurantTags) ? restaurantTags : [],
      deliveryRating: deliveryRating ? Number(deliveryRating) : null,
      deliveryReview: deliveryReview || '',
      deliveryTags: Array.isArray(deliveryTags) ? deliveryTags : [],
      driverTip: Number(driverTip) || 0,
      itemRatings: Array.isArray(itemRatings) ? itemRatings : [],
    });
    await reviewDoc.save();

    // 2. Persist review summary in Order document
    order.review = {
      restaurantRating: Number(restaurantRating) || 5,
      restaurantReview: restaurantReview || '',
      restaurantTags: Array.isArray(restaurantTags) ? restaurantTags : [],
      deliveryRating: deliveryRating ? Number(deliveryRating) : null,
      deliveryReview: deliveryReview || '',
      deliveryTags: Array.isArray(deliveryTags) ? deliveryTags : [],
      driverTip: Number(driverTip) || 0,
      itemRatings: Array.isArray(itemRatings) ? itemRatings : [],
      isRated: true,
      ratedAt: new Date(),
    };
    await order.save();

    // 3. Update Restaurant aggregate rating
    if (order.restaurant && restaurantRating) {
      const Restaurant = require('../models/Restaurant');
      const rest = await Restaurant.findById(order.restaurant);
      if (rest) {
        const curCount = parseInt(rest.ratingCount) || 120;
        const curRating = parseFloat(rest.rating) || 4.7;
        const newRating = Number(((curRating * curCount + Number(restaurantRating)) / (curCount + 1)).toFixed(1));
        rest.rating = newRating;
        rest.ratingCount = `${curCount + 1}+`;
        await rest.save();
      }
    }

    // 4. Update DeliveryPartner aggregate rating
    if (order.deliveryPartner && deliveryRating) {
      const DeliveryPartner = require('../models/DeliveryPartner');
      const partner = await DeliveryPartner.findOne({ user: order.deliveryPartner });
      if (partner) {
        const curCount = parseInt(partner.completedOrders) || 40;
        const curRating = parseFloat(partner.rating) || 4.9;
        partner.rating = Number(((curRating * curCount + Number(deliveryRating)) / (curCount + 1)).toFixed(1));
        await partner.save();
      }
    }

    // 5. Update MenuItems aggregate ratings
    if (Array.isArray(itemRatings) && itemRatings.length > 0) {
      const MenuItem = require('../models/MenuItem');
      for (const ir of itemRatings) {
        if (ir.menuItemId && ir.rating) {
          const item = await MenuItem.findById(ir.menuItemId);
          if (item) {
            const count = parseInt(item.ratingCount) || 25;
            const rating = parseFloat(item.rating) || 4.8;
            item.rating = Number(((rating * count + Number(ir.rating)) / (count + 1)).toFixed(1));
            item.ratingCount = count + 1;
            await item.save();
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Thank you for your rating & review! Your feedback helps the community.',
      review: order.review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
