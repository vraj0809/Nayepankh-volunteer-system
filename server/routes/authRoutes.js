const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// Register
router.post(
  '/register',
  [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('phone')
      .notEmpty().withMessage('Phone number is required')
      .matches(/^\d{10}$/).withMessage('Phone must be exactly 10 digits'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('college').trim().notEmpty().withMessage('College name is required'),
    body('degree').trim().notEmpty().withMessage('Degree is required'),
    body('yearOfStudy')
      .notEmpty().withMessage('Year of study is required')
      .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'])
      .withMessage('Invalid year of study'),
    body('skills')
      .isArray({ min: 1 }).withMessage('Select at least one skill'),
    body('areasOfInterest')
      .isArray({ min: 1 }).withMessage('Select at least one area of interest'),
    body('motivation')
      .trim()
      .notEmpty().withMessage('Motivation is required')
      .isLength({ min: 50 }).withMessage('Motivation must be at least 50 characters'),
    body('availableHours')
      .notEmpty().withMessage('Available hours is required')
      .isIn(['2-4 hours/week', '4-8 hours/week', '8+ hours/week'])
      .withMessage('Invalid available hours option'),
    validateRequest,
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest,
  ],
  login
);

// Get current user
router.get('/me', protect, getMe);

// Logout
router.post('/logout', protect, logout);

module.exports = router;
