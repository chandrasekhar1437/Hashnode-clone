const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hashnode-clone';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Hashnode Clone API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});