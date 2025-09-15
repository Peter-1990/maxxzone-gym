const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

require('dotenv').config()

const PORT = process.env.PORT || 4000;

// Updated CORS configuration
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
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Add error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  next();
});

// Database connection
require('./DBConn/conn');

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => res.send("MaxxZone Gym API Working"));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  res.status(error.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});