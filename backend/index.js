const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT || 4000;

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://maxxzone-gym-uw2w.vercel.app',
  'https://maxxzone-gym.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Add error handling middleware for JSON parsing
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  next();
});

// ==================== TEST ENDPOINTS ====================
// Add these before your routes for debugging

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.json({ 
      database_status: states[connectionState] || 'unknown',
      mongodb_uri_set: !!process.env.MONGODB_URI,
      node_env: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test environment variables
app.get('/api/test-env', (req, res) => {
  // Don't expose actual values in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.json({
    node_env: process.env.NODE_ENV,
    has_mongodb: !!process.env.MONGODB_URI,
    has_jwt: !!process.env.JWT_SecretKey,
    has_email: !!process.env.SENDER_EMAIL,
    has_email_pass: !!process.env.EMAIL_PASSWORD,
    port: process.env.PORT,
    // Only show actual values in development
    ...(!isProduction && {
      mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      jwt_secret: process.env.JWT_SecretKey ? 'Set' : 'Not set',
      sender_email: process.env.SENDER_EMAIL ? 'Set' : 'Not set'
    })
  });
});

// Test cookie and auth setup
app.get('/api/test-auth', (req, res) => {
  const token = req.cookies.cookie_token;
  
  res.json({
    cookie_received: !!token,
    cookie_length: token ? token.length : 0,
    cookies: req.cookies
  });
});

// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      throw new Error('MongoDB connection string is missing');
    }

    console.log('🔗 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
    
    // Test the connection with a simple query
    const Gym = require('./Models/gym');
    const count = await Gym.countDocuments();
    console.log(`📊 Total gyms in database: ${count}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't exit process in production to allow for auto-recovery
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// Database connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB connection disconnected');
});

// ==================== ROUTES ====================
// Import routes
const GymRoutes = require('./Routes/gymRoute');
const MembershipRoutes = require('./Routes/membershipRoute');
const MemberRoutes = require('./Routes/memberRoute');
const DietPlanRoutes = require('./Routes/dietPlanRoute');

// Use routes
app.use('/auth', GymRoutes);
app.use('/plans', MembershipRoutes);
app.use('/members', MemberRoutes);
app.use('/diet-plan', DietPlanRoutes);

// ==================== ERROR HANDLING ====================
// 404 handler - must be after all routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler - must be last middleware
app.use((error, req, res, next) => {
  console.error('💥 Global Error Handler:', error);
  
  // Log detailed error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error Stack:', error.stack);
  }
  
  res.status(error.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on Port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});