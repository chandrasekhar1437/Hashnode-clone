const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const protect = require('../middleware/authMiddleware');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts written by the logged-in user
router.get('/my-posts', protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Post
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, coverImage, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Please add title and content' });
    }

    const post = await Post.create({
      title,
      content,
      coverImage: coverImage || '',
      tags: tags || [],
      author: req.user._id,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;