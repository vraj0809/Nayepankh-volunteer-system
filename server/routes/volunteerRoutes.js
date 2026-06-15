const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getStatus } = require('../controllers/volunteerController');
const protect = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/status', getStatus);

module.exports = router;
