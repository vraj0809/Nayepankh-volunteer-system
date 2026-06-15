const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const sendResponse = require('../utils/sendResponse');

// @desc    Get all volunteers (with pagination, search, filters)
// @route   GET /api/admin/volunteers
exports.getAllVolunteers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      city,
      skills,
      yearOfStudy,
      sortBy = 'registeredAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = req.query;

    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }

    // Filter by year of study
    if (yearOfStudy) {
      query.yearOfStudy = yearOfStudy;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.registeredAt = {};
      if (startDate) query.registeredAt.$gte = new Date(startDate);
      if (endDate) query.registeredAt.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [volunteers, total] = await Promise.all([
      Volunteer.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Volunteer.countDocuments(query),
    ]);

    sendResponse(res, 200, true, 'Volunteers retrieved', {
      volunteers,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single volunteer by ID
// @route   GET /api/admin/volunteers/:id
exports.getVolunteerById = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).lean();
    if (!volunteer) {
      return sendResponse(res, 404, false, 'Volunteer not found');
    }
    sendResponse(res, 200, true, 'Volunteer retrieved', volunteer);
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer status (approve/reject)
// @route   PUT /api/admin/volunteers/:id/status
exports.updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return sendResponse(res, 400, false, 'Invalid status. Must be approved, rejected, or pending');
    }

    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return sendResponse(res, 404, false, 'Volunteer not found');
    }

    volunteer.status = status;
    if (adminNote !== undefined) {
      volunteer.adminNote = adminNote;
    }

    // Add to status history
    volunteer.statusHistory.push({
      status,
      note: adminNote || `Status changed to ${status}`,
      changedAt: new Date(),
      changedBy: req.user._id,
    });

    await volunteer.save();

    sendResponse(res, 200, true, `Volunteer ${status} successfully`, volunteer);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete volunteer
// @route   DELETE /api/admin/volunteers/:id
exports.deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return sendResponse(res, 404, false, 'Volunteer not found');
    }

    // Delete user account too
    await User.findByIdAndDelete(volunteer.userId);
    await Volunteer.findByIdAndDelete(req.params.id);

    sendResponse(res, 200, true, 'Volunteer deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'approved' }),
      Volunteer.countDocuments({ status: 'pending' }),
      Volunteer.countDocuments({ status: 'rejected' }),
    ]);

    // Registrations per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRegistrations = await Volunteer.aggregate([
      { $match: { registeredAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$registeredAt' },
            month: { $month: '$registeredAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Top skills
    const skillsAggregation = await Volunteer.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top cities
    const citiesAggregation = await Volunteer.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Recent registrations
    const recentVolunteers = await Volunteer.find()
      .sort({ registeredAt: -1 })
      .limit(5)
      .lean();

    sendResponse(res, 200, true, 'Statistics retrieved', {
      total,
      approved,
      pending,
      rejected,
      monthlyRegistrations,
      topSkills: skillsAggregation,
      topCities: citiesAggregation,
      recentVolunteers,
    });
  } catch (error) {
    next(error);
  }
};
