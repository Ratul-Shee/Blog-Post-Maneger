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
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };

    cachedPromise = mongoose
      .connect(mongoURI, opts)
      .then((mongooseInstance) => {
        console.log('MongoDB Connected to Atlas successfully');
        return mongooseInstance;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error(`Error connecting to MongoDB Atlas: ${err.message}`);
        throw err;
      });
  }

  return cachedPromise;
};

module.exports = connectDB;