// DBConn/conn.js - Fixed Version
require('dotenv').config();
const mongoose = require("mongoose");

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// Debug: Log the connection string (but don't show password in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔗 Attempting to connect to MongoDB...');
  const maskedUri = process.env.MONGODB_URI 
    ? process.env.MONGODB_URI.replace(/:[^:]*@/, ':***@')
    : 'Not set';
  console.log('Connection string:', maskedUri);
}

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  
  // Verify connection by checking database stats
  mongoose.connection.db.admin().ping((err, result) => {
    if (err) {
      console.error('❌ MongoDB ping failed:', err);
    } else {
      console.log('📊 MongoDB ping successful:', result);
    }
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  
  // Provide specific troubleshooting tips based on error type
  if (err.name === 'MongoNetworkError') {
    console.log('💡 Network error tips:');
    console.log('1. Check your MongoDB Atlas IP whitelist');
    console.log('2. Verify your connection string');
    console.log('3. Check your internet connection');
  } else if (err.name === 'MongoServerError') {
    console.log('💡 Authentication error tips:');
    console.log('1. Check your username and password');
    console.log('2. Verify database user permissions in MongoDB Atlas');
  }
  
  // Don't exit process in production - let the server try to reconnect
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// MongoDB connection events for better debugging
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔁 MongoDB connection reestablished');
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = mongoose;
