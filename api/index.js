const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('../backend/config/db');
const postRoutes = require('../backend/routes/posts');

const app = express();

app.use(cors());
app.use(express.json());

// Ensure MongoDB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Serverless DB connection error:', err.message);
    return res.status(500).json({
      message: 'Failed to connect to MongoDB database',
      error: err.message,
    });
  }
});

app.use('/api/posts', postRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Blog Post Manager API is running on Vercel!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
