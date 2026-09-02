const Tag = require('../models/Tag');

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a tag
// @route   POST /api/tags
// @access  Protected
const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const tagExists = await Tag.findOne({ slug });
    if (tagExists) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const tag = await Tag.create({ name, slug });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTags, createTag };