const mongoose = require('mongoose');

const DEFAULT_MONGODB_URI =
  'mongodb+srv://ratulshee6_db_user:Il5V1FFpqrQIa7jP@cluster0.bma8xyb.mongodb.net/blog-manager?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      console.error('Check your MongoDB Atlas connection string and network access.');
    }
  }
};

module.exports = connectDB;
