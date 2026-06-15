const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/sendResponse');

// @desc    Register a new volunteer
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const {
      fullName, email, password, phone, city, state,
      college, degree, yearOfStudy, skills, areasOfInterest,
      motivation, availableHours, linkedinUrl, githubUrl,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendResponse(res, 400, false, 'An account with this email already exists');
    }

    // Create user
    const user = await User.create({
      name: fullName,
      email: email.toLowerCase(),
      password,
      role: 'volunteer',
    });

    // Create volunteer profile
    await Volunteer.create({
      userId: user._id,
      fullName,
      email: email.toLowerCase(),
      phone,
      city,
      state,
      college,
      degree,
      yearOfStudy,
      skills,
      areasOfInterest,
      motivation,
      availableHours,
      linkedinUrl: linkedinUrl || '',
      githubUrl: githubUrl || '',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          note: 'Application submitted',
          changedAt: new Date(),
        },
      ],
    });

    const token = generateToken(user._id, user.role);

    sendResponse(res, 201, true, 'Registration successful! Your application is under review.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, 'Please provide email and password');
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    const token = generateToken(user._id, user.role);

    sendResponse(res, 200, true, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User retrieved', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  sendResponse(res, 200, true, 'Logged out successfully');
};
