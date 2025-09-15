const Gym = require('../Models/gym.js');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

// Cookie configuration
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000
});

exports.register = async (req, res) => {
  try {
    const { userName, password, gymName, profilePic, email } = req.body;

    // Validate required fields
    if (!userName || !password || !gymName || !email) {
      return res.status(400).json({
        error: "All fields (userName, password, gymName, email) are required"
      });
    }

    const isExist = await Gym.findOne({ 
      $or: [{ userName }, { email }] 
    });

    if (isExist) {
      return res.status(400).json({
        error: "Username or Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newGym = new Gym({ 
      userName, 
      password: hashedPassword, 
      gymName, 
      profilePic, 
      email 
    });
    
    await newGym.save();

    // Remove password from response
    const gymResponse = { ...newGym.toObject() };
    delete gymResponse.password;

    res.status(201).json({ 
      message: "User registered successfully", 
      success: true, 
      data: gymResponse 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "Server error during registration"
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Validate input
    if (!userName || !password) {
      return res.status(400).json({ 
        error: "Username and password are required" 
      });
    }

    const gym = await Gym.findOne({ userName });
    if (!gym) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, gym.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    // Use consistent JWT secret variable name
    const jwtSecret = process.env.JWT_SecretKey;
    if (!jwtSecret) {
      console.error("JWT Secret is not configured");
      return res.status(500).json({ 
        error: "Server configuration error" 
      });
    }

    const token = jwt.sign(
      { gym_id: gym._id }, 
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const gymResponse = { ...gym.toObject() };
    delete gymResponse.password;

    res.cookie("cookie_token", token, getCookieOptions());
    res.json({ 
      message: "Logged in successfully", 
      success: true, 
      gym: gymResponse, 
      token 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error during login"
    });
  }
}

// Email transporter setup
let transporter;
if (process.env.SENDER_EMAIL && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  console.warn("Email credentials not configured");
}

exports.sendOtp = async (req, res) => {
  try {
    if (!transporter) {
      return res.status(500).json({ 
        error: "Email service not configured" 
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ 
        error: "Email is required" 
      });
    }

    const gym = await Gym.findOne({ email });
    if (!gym) {
      return res.status(400).json({ 
        error: "Email not found" 
      });
    }

    const buffer = crypto.randomBytes(4);
    const token = buffer.readUInt32BE(0) % 900000 + 100000;
    
    gym.resetPasswordToken = token;
    gym.resetPasswordExpires = Date.now() + 3600000;
    await gym.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP - MaxxZone Gym',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your MaxxZone Gym account.</p>
          <p>Your OTP is: <strong>${token}</strong></p>
          <p>This OTP will expire in 1 hour.</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(500).json({ 
          error: "Failed to send OTP email" 
        });
      }
      res.status(200).json({ 
        message: "OTP sent to your email" 
      });
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      error: "Server error during OTP sending"
    });
  }
}

exports.checkOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        error: "Email and OTP are required" 
      });
    }

    const gym = await Gym.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!gym) {
      return res.status(400).json({ 
        error: "OTP is invalid or has expired" 
      });
    }

    res.status(200).json({ 
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("Check OTP error:", error);
    res.status(500).json({
      error: "Server error during OTP verification"
    });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ 
        error: "Email and new password are required" 
      });
    }

    const gym = await Gym.findOne({ email });
    if (!gym) {
      return res.status(400).json({ 
        error: "User not found" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    gym.password = hashedPassword;
    gym.resetPasswordToken = undefined;
    gym.resetPasswordExpires = undefined;

    await gym.save();

    res.status(200).json({ 
      message: "Password reset successfully" 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      error: "Server error during password reset"
    });
  }
}

exports.logout = async (req, res) => {
  try {
    res.clearCookie('cookie_token', getCookieOptions()).json({ 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Server error during logout"
    });
  }
}