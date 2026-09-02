const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

// Send Register OTP
router.post('/send-register-otp', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      await User.create({
        name,
        email,
        password,
        otp,
        otpExpires,
        isVerified: false,
      });
    }

    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Hashnode Clone',
        html: `<p>Your verification code is: <b>${otp}</b></p>`,
      });
    } catch (err) {
      console.log('Email delivery skipped due to network restriction.');
    }

    // Returns devOtp in response so you can test instantly on screen
    res.status(200).json({
      message: 'OTP generated successfully',
      devOtp: otp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify Register OTP
router.post('/verify-register-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;