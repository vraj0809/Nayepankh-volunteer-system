const express = require('express');
const router = express.Router();
const {
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer,
  getStats,
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// All routes require auth + admin
router.use(protect, adminOnly);

router.get('/volunteers', getAllVolunteers);
router.get('/stats', getStats);
router.get('/volunteers/:id', getVolunteerById);
router.put('/volunteers/:id/status', updateVolunteerStatus);
router.delete('/volunteers/:id', deleteVolunteer);

module.exports = router;
