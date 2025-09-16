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

// ==================== DEBUG ENDPOINTS ====================
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
  res.json({
    node_env: process.env.NODE_ENV,
    has_mongodb: !!process.env.MONGODB_URI,
    has_jwt: !!process.env.JWT_SecretKey,
    has_email: !!process.env.SENDER_EMAIL,
    has_email_pass: !!process.env.EMAIL_PASSWORD,
    port: process.env.PORT
  });
});

// Detailed database debug endpoint - NEW
app.get('/api/debug-db', async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // Try to connect directly to see the actual error
    let connectionError = null;
    let connectionInfo = null;
    
    try {
      // Store original connection state
      const originalState = mongoose.connection.readyState;
      
      // Only try to connect if not already connected
      if (originalState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000
        });
        connectionInfo = {
          connected: true,
          dbName: mongoose.connection.db?.databaseName
        };
      } else {
        connectionInfo = {
          connected: true,
          dbName: mongoose.connection.db?.databaseName,
          alreadyConnected: true
        };
      }
    } catch (error) {
      connectionError = {
        name: error.name,
        message: error.message,
        code: error.code
      };
    } finally {
      // Disconnect if we connected successfully for this test
      if (mongoose.connection.readyState === 1 && connectionInfo && !connectionInfo.alreadyConnected) {
        await mongoose.disconnect();
      }
    }
    
    res.json({ 
      database_status: states[connectionState] || 'unknown',
      mongodb_uri_set: !!process.env.MONGODB_URI,
      connection_error: connectionError,
      connection_info: connectionInfo,
      node_env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: "Debug test failed",
      message: error.message 
    });
  }
});

// Test MongoDB connection with details - NEW
app.get('/api/test-mongo-details', async (req, res) => {
  try {
    // Mask the connection string for security
    const maskedUri = process.env.MONGODB_URI 
      ? process.env.MONGODB_URI.replace(/:[^:]*@/, ':***@')
      : 'Not set';
    
    let connectionResult = null;
    let errorDetails = null;
    
    try {
      // Try to connect
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 8000
      });
      
      connectionResult = {
        success: true,
        dbName: mongoose.connection.db?.databaseName,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      };
      
      // Disconnect after test
      await mongoose.disconnect();
      
    } catch (error) {
      errorDetails = {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
    
    res.json({
      connection_string: maskedUri,
      connection_result: connectionResult,
      error: errorDetails,
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: "Detailed test failed",
      message: error.message 
    });
  }
});

// ==================== DATABASE CONNECTION ====================
// Connect to MongoDB with better error handling
async function connectDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔗 Attempting to connect to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Don't exit process in production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Initialize database connection
connectDatabase();

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
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

// ==================== TEMPORARY FALLBACK ROUTES ====================
// Simple in-memory storage as fallback
const temporaryDB = {
  users: [
    {
      userName: "admin",
      password: "admin123", // For testing only
      gymName: "Test Gym",
      email: "admin@example.com"
    }
  ],
  diets: []
};

// Temporary auth routes (use these if MongoDB is down)
app.post('/auth/temp-login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    
    if (!userName || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    
    const user = temporaryDB.users.find(u => u.userName === userName && u.password === password);
    
    if (user) {
      res.json({
        message: "Logged in successfully (temporary mode)",
        success: true,
        user: {
          userName: user.userName,
          gymName: user.gymName,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
    
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post('/auth/temp-register', async (req, res) => {
  try {
    const { userName, password, gymName, email } = req.body;
    
    if (!userName || !password || !gymName || !email) {
      return res.status(400).json({ error: "All fields required" });
    }
    
    if (temporaryDB.users.find(u => u.userName === userName)) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    temporaryDB.users.push({ userName, password, gymName, email });
    
    res.status(201).json({
      message: "User registered successfully (temporary mode)",
      success: true
    });
    
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// ==================== ROOT ENDPOINT ====================
app.get("/", (req, res) => {
  res.json({ 
    message: "MaxxZone Gym API Working",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      test_db: "/api/test-db",
      debug_db: "/api/debug-db",
      test_env: "/api/test-env",
      temp_login: "/auth/temp-login",
      temp_register: "/auth/temp-register"
    },
    database_status: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ==================== ERROR HANDLING ====================
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
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
  console.log(`🔗 Debug DB: http://localhost:${PORT}/api/debug-db`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});