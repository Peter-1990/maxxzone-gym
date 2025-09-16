require('dotenv').config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// For local development: simple connection
if (!isProduction || !isVercel) {
  console.log('🔗 Initializing MongoDB connection (local mode)...');
  
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });

  module.exports = mongoose;
} 
// For Vercel production: serverless connection
else {
  console.log('🔗 Initializing MongoDB connection (serverless mode)...');
  
  // Serverless connection caching
  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  async function connectDB() {
    if (cached.conn) {
      console.log('✅ Using cached database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
      };

      console.log('🔗 Creating new database connection...');
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('✅ MongoDB connected successfully!');
          return mongoose;
        })
        .catch((error) => {
          console.error('❌ MongoDB connection failed:');
          console.error('Error:', error.message);
          cached.promise = null;
          throw error;
        });
    }

    try {
      cached.conn = await cached.promise;
    } catch (error) {
      cached.promise = null;
      throw error;
    }

    return cached.conn;
  }

  module.exports = connectDB;
}