const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.log('ℹ️ Running in memory / offline fallback mode if local MongoDB service is not started yet.');
  }
};

module.exports = connectDB;
