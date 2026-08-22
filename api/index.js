const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../backend/db/db');
const postRoutes = require('../backend/routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected && mongoose.connection.readyState < 1) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('Serverless DB connection error:', err.message);
      return res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
  }
  next();
});

app.use('/api/posts', postRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Blog Post Manager API is running on Vercel!' });
});

module.exports = app;
