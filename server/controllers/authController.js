const nodemailer = require('nodemailer');

// 1. Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email via Nodemailer
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Account Verification OTP',
    text: `Your OTP for verification is: ${otp}. It will expire shortly.`,
  };

  await transporter.sendMail(mailOptions);
};

// 2. Controller methods (Update existing logic with sendOTPEmail calls)
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Save OTP to your database (e.g., User or OTP model) with an expiration timestamp

    // Send real email via Gmail
    await sendOTPEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent to email successfully!' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // TODO: Verify OTP against saved record in DB
    // Example placeholder validation:
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    return res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ message: 'OTP verification failed' });
  }
};