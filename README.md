🏋️‍♂️ MaxxZone Gym Management System
https://img.shields.io/badge/React-18.2.0-blue
https://img.shields.io/badge/Node.js-16.0+-green
https://img.shields.io/badge/MongoDB-Atlas-success
https://img.shields.io/badge/Deployed-Vercel-black

A comprehensive gym management web application built with the MERN stack, designed to streamline gym operations, member management, and diet planning.

✨ Features
🔐 Authentication System
User registration and login for gym owners

JWT-based authentication with secure cookies

Password reset functionality with OTP verification via email

Secure logout with token invalidation

💪 Membership Management
Create and manage multiple membership plans

Track member subscriptions and renewals

Membership expiration alerts and notifications

🥗 Diet Plan Management
Create customized diet plans with calorie tracking

Organize meals by time zones (breakfast, lunch, dinner, snacks)

Track nutritional information and calorie counts

Assign diet plans to members

👥 Member Management
Comprehensive member profiles and records

Attendance tracking and workout progress

Membership status monitoring

Communication tools for member engagement

🛠️ Technology Stack
Frontend
React 18.2.0 with functional components and hooks

Material-UI for modern, responsive UI components

React Router for navigation

Axios for API communication

React Toastify for notifications

Backend
Node.js with Express.js server

MongoDB Atlas cloud database

Mongoose ODM for database operations

JWT for authentication

bcryptjs for password hashing

Nodemailer for email services

Deployment
Vercel for frontend deployment

Vercel for backend serverless functions

MongoDB Atlas for cloud database

🚀 Quick Start
Prerequisites
Node.js 16.0 or higher

MongoDB Atlas account

Gmail account for email services

Installation
Clone the repository

bash
git clone https://github.com/your-username/maxxzone-gym.git
cd maxxzone-gym
Backend Setup

bash
cd backend
npm install
Create a .env file:

text
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SecretKey=your_super_strong_jwt_secret
SENDER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
PORT=4000
NODE_ENV=development
Frontend Setup

bash
cd frontend
npm install
Create a .env file:

text
REACT_APP_BACKEND_URL=http://localhost:4000
Run Development Servers

bash
# Backend (from /backend directory)
npm start

# Frontend (from /frontend directory)  
npm start
📦 Project Structure
text
maxxzone-gym/
├── backend/
│   ├── controllers/
│   │   ├── gymController.js
│   │   └── dietPlanController.js
│   ├── models/
│   │   ├── gym.js
│   │   ├── member.js
│   │   └── dietPlan.js
│   ├── routes/
│   │   ├── gymRoute.js
│   │   ├── memberRoute.js
│   │   └── dietPlanRoute.js
│   ├── DBConn/
│   │   └── conn.js
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── public/
└── README.md
🌐 API Endpoints
Authentication
POST /auth/register - Register new gym owner

POST /auth/login - User login

POST /auth/reset-password/sendOtp - Send password reset OTP

POST /auth/reset-password/checkOtp - Verify OTP

POST /auth/reset-password - Reset password

POST /auth/logout - User logout

Diet Plans
GET /diet-plan/all - Get all diet plans

POST /diet-plan/add - Create new diet plan

PUT /diet-plan/update/:id - Update diet plan

DELETE /diet-plan/delete/:id - Delete diet plan

Memberships
GET /plans/all - Get all membership plans

POST /plans/add - Create new membership plan

Members
GET /members/all - Get all members

POST /members/add - Add new member

🔧 Configuration
Environment Variables
Backend requires:

MONGODB_URI: MongoDB Atlas connection string

JWT_SecretKey: Secret key for JWT tokens

SENDER_EMAIL: Gmail address for sending emails

EMAIL_PASSWORD: Gmail app password

NODE_ENV: Environment (development/production)

MongoDB Setup
Create MongoDB Atlas account

Create a cluster and database

Add IP whitelist (0.0.0.0/0 for all access)

Create database user with read/write permissions

Get connection string

Email Setup
Enable 2-factor authentication on Gmail

Generate app-specific password

Use app password in EMAIL_PASSWORD variable

🚀 Deployment
Frontend (Vercel)
bash
npm run build
vercel --prod
Backend (Vercel)
bash
vercel --prod
Environment Variables on Vercel
Set all environment variables in Vercel dashboard:

Project → Settings → Environment Variables

📱 Usage
Gym Owner Registration: Create your gym account

Membership Plans: Set up different membership tiers

Member Management: Add and manage gym members

Diet Plans: Create customized diet plans for members

Tracking: Monitor member attendance and progress

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the ISC License - see the LICENSE.md file for details.

🆘 Support
If you have any questions or issues, please open an issue on GitHub or contact at my email: harip3279@gmail.com

🙏 Acknowledgments
Material-UI for amazing React components

MongoDB Atlas for reliable database hosting

Vercel for seamless deployment

React community for excellent documentation and support

⭐ Star this repo if you found it helpful!

Built with ❤️ using the MERN stack
