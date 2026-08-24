const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');

const getSystemDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      const escapedQuery = escapeRegex(search.trim());
      const searchRegex = new RegExp(escapedQuery, 'i');
      query = {
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { content: searchRegex },
        ],
      };
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, content, publishedDate } = req.body;

    if (
      !title ||
      !author ||
      !content ||
      !title.toString().trim() ||
      !author.toString().trim() ||
      !content.toString().trim()
    ) {
      return res.status(400).json({ message: 'Title, Author, and Content are required fields' });
    }

    const newPost = new Post({
      title: title.toString().trim(),
      author: author.toString().trim(),
      content: content.toString().trim(),
      publishedDate: publishedDate || getSystemDate(),
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { title, author, content, publishedDate } = req.body;

    if (
      !title ||
      !author ||
      !content ||
      !title.toString().trim() ||
      !author.toString().trim() ||
      !content.toString().trim()
    ) {
      return res.status(400).json({ message: 'Title, Author, and Content are required fields' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: title.toString().trim(),
        author: author.toString().trim(),
        content: content.toString().trim(),
        publishedDate: publishedDate || getSystemDate(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error updating post', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

module.exports = router;
