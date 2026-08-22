const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch((err) => {
  console.error('Initial database connection warning:', err.message);
});

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Blog Post Manager API is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;