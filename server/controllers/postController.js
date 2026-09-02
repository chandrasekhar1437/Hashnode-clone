const Post = require('../models/Post');
const Tag = require('../models/Tag');

// Helper function to create URL slug
const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// @desc    Get all published posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name email avatarUrl')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name email bio avatarUrl')
      .populate('tags', 'name slug');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Protected
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, status, tags } = req.body;

    let slug = slugify(title);
    const slugExists = await Post.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150),
      coverImage: coverImage || '',
      status: status || 'published',
      author: req.user._id,
      tags: tags || [],
    });

    const fullPost = await Post.findById(post._id)
      .populate('author', 'name email avatarUrl')
      .populate('tags', 'name slug');

    res.status(201).json(fullPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Protected
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, excerpt, coverImage, status, tags } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.status = status || post.status;
    if (tags) post.tags = tags;

    const updatedPost = await post.save();
    const fullPost = await Post.findById(updatedPost._id)
      .populate('author', 'name email avatarUrl')
      .populate('tags', 'name slug');

    res.json(fullPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Protected
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost };