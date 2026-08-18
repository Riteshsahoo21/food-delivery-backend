const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO for real-time delivery tracking & notifications (Section 12 & 38)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Store io in express app
app.set('io', io);

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(morgan('dev'));

// API Routes (Section 38 & 39)
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'FeastFleet Food Delivery Express Backend API',
    vps: {
      status: 'Ready for VPS deployment',
      realtime: 'Socket.IO Active',
      storage: 'Cloudinary Configured',
      payments: 'Razorpay Configured',
    },
  });
});

// Centralized error handling
app.use(errorHandler);

// Socket.io Real-Time Event Handlers
io.on('connection', (socket) => {
  console.log(`⚡ [Socket.IO] Client connected: ${socket.id}`);

  // Join order room for live tracking
  socket.on('join_order_room', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`📍 [Socket.IO] Client joined order room: order_${orderId}`);
  });

  // Rider updates location
  socket.on('rider_location_update', (data) => {
    io.to(`order_${data.orderId}`).emit('rider_location_update', data);
  });

  // Live Chat between Customer & Driver (No auto-reply bots)
  socket.on('send_chat_message', (data) => {
    if (data && data.orderId) {
      io.to(`order_${data.orderId}`).emit('new_chat_message', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const startServer = (port) => {
  server.listen(port, () => {
    console.log(`🚀 FeastFleet Backend Server running on port ${port}`);
    console.log(`🌐 API Endpoint: http://localhost:${port}/api/health`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, attempting port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

const PORT = parseInt(process.env.PORT || '5001', 10);
startServer(PORT);

module.exports = { app, server, io };
