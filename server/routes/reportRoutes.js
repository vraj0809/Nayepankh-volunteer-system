const express = require('express');
const router = express.Router();
const { exportCSV, exportPDF, getDetailedStats } = require('../controllers/reportController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// All routes require auth + admin
router.use(protect, adminOnly);

router.get('/pdf', exportPDF);
router.get('/csv', exportCSV);
router.get('/stats', getDetailedStats);

module.exports = router;
