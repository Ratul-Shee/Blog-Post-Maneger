const mongoose = require('mongoose');

const DEFAULT_MONGODB_URI =
  'mongodb+srv://ratulshee6_db_user:Il5V1FFpqrQIa7jP@cluster0.bma8xyb.mongodb.net/blog-manager?retryWrites=true&w=majority';

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    const mongoURI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    cachedPromise = mongoose
      .connect(mongoURI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        console.error(`Error connecting to MongoDB: ${error.message}`);
        if (process.env.NODE_ENV !== 'test') {
          console.error('Check your MongoDB Atlas connection string and network access.');
        }
        throw error;
      });
  }

  return cachedPromise;
};

module.exports = connectDB;
