 // require('dotenv').config(); Load environment variables
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('DB connection successful!'))
.catch(err => {
  console.error('DB connection error:', err);
});
