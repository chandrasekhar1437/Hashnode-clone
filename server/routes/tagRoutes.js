const express = require('express');
const router = express.Router();
const { getTags, createTag } = require('../controllers/tagController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getTags).post(protect, createTag);

module.exports = router;