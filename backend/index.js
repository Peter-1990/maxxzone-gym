const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

require('dotenv').config()

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
    const mongoose = require('mongoose');
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
  res.json({
    node_env: process.env.NODE_ENV,
    has_mongodb: !!process.env.MONGODB_URI,
    has_jwt: !!process.env.JWT_SecretKey,
    has_email: !!process.env.SENDER_EMAIL,
    has_email_pass: !!process.env.EMAIL_PASSWORD,
    port: process.env.PORT
  });
});

// ==================== DATABASE CONNECTION ====================
// Import and initialize the database connection
require('./DBConn/conn.js');

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

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "MaxxZone Gym API Working",
    version: "1.0.0",
    documentation: "Visit /api/health for server status"
  });
});

// ==================== ERROR HANDLING ====================
// 404 handler - must be after all routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    available_endpoints: [
      '/api/health',
      '/api/test-db', 
      '/api/test-env',
      '/auth/login',
      '/auth/register',
      '/plans/',
      '/members/',
      '/diet-plan/'
    ]
  });
});

// Global error handler - must be last middleware
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  res.status(error.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
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
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});