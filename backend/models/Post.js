const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide post content'],
      trim: true,
    },
    publishedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Post', postSchema);