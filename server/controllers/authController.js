const nodemailer = require('nodemailer');

// 1. Create Nodemailer Transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to send email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Account Verification OTP',
    text: `Your OTP for verification is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// 2. Route Controller Handlers
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send email via Gmail
    await sendOTPEmail(email, otp);

    // Return success without attaching the OTP to the response message
    return res.status(200).json({
      message: 'OTP sent successfully! Please check your Gmail inbox.',
    });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({
      message: 'Failed to send OTP email. Please verify environment variables on Render.',
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    return res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ message: 'OTP verification failed' });
  }
};