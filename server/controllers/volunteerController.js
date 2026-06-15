const Volunteer = require('../models/Volunteer');
const sendResponse = require('../utils/sendResponse');

// @desc    Get own volunteer profile
// @route   GET /api/volunteers/profile
exports.getProfile = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user._id });
    if (!volunteer) {
      return sendResponse(res, 404, false, 'Volunteer profile not found');
    }
    sendResponse(res, 200, true, 'Profile retrieved', volunteer);
  } catch (error) {
    next(error);
  }
};

// @desc    Update own volunteer profile
// @route   PUT /api/volunteers/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      fullName, phone, city, state, college, degree,
      yearOfStudy, skills, areasOfInterest, motivation,
      availableHours, linkedinUrl, githubUrl,
    } = req.body;

    const volunteer = await Volunteer.findOne({ userId: req.user._id });
    if (!volunteer) {
      return sendResponse(res, 404, false, 'Volunteer profile not found');
    }

    // Update allowed fields
    if (fullName) volunteer.fullName = fullName;
    if (phone) volunteer.phone = phone;
    if (city) volunteer.city = city;
    if (state) volunteer.state = state;
    if (college) volunteer.college = college;
    if (degree) volunteer.degree = degree;
    if (yearOfStudy) volunteer.yearOfStudy = yearOfStudy;
    if (skills) volunteer.skills = skills;
    if (areasOfInterest) volunteer.areasOfInterest = areasOfInterest;
    if (motivation) volunteer.motivation = motivation;
    if (availableHours) volunteer.availableHours = availableHours;
    if (linkedinUrl !== undefined) volunteer.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) volunteer.githubUrl = githubUrl;

    await volunteer.save();

    // Also update user name if fullName changed
    if (fullName) {
      req.user.name = fullName;
      await req.user.save();
    }

    sendResponse(res, 200, true, 'Profile updated successfully', volunteer);
  } catch (error) {
    next(error);
  }
};

// @desc    Get own volunteer status
// @route   GET /api/volunteers/status
exports.getStatus = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user._id })
      .select('status adminNote statusHistory registeredAt');
    if (!volunteer) {
      return sendResponse(res, 404, false, 'Volunteer profile not found');
    }
    sendResponse(res, 200, true, 'Status retrieved', volunteer);
  } catch (error) {
    next(error);
  }
};
