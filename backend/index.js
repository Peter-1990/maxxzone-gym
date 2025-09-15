const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

require('dotenv').config()

const PORT = process.env.PORT;

// Updated CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000', // Your local development environment
        'https://maxxzone-gym-uw2w.vercel.app' // Your production frontend
    ],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
require('./DBConn/conn');

const GymRoutes = require('./Routes/gymRoute');
const MembershipRoutes = require('./Routes/membershipRoute');
const MemberRoutes = require('./Routes/memberRoute');
const DietPlanRoutes = require('./Routes/dietPlanRoute')

app.use('/auth',GymRoutes);
app.use('/plans',MembershipRoutes);
app.use('/members', MemberRoutes);
app.use('/diet-plan', DietPlanRoutes)

app.get("/", (req, res) => res.send("API Working"))

app.listen(PORT,()=>{
    console.log("Server is running on Port 4000")
})