const Volunteer = require('../models/Volunteer');
const sendResponse = require('../utils/sendResponse');
const { generateCSV } = require('../utils/csvGenerator');

// @desc    Export volunteers as CSV
// @route   GET /api/reports/csv
exports.exportCSV = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const volunteers = await Volunteer.find(query)
      .sort({ registeredAt: -1 })
      .lean();

    const csv = generateCSV(volunteers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=nayepankh_volunteers.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed statistics for reports
// @route   GET /api/reports/stats
exports.getDetailedStats = async (req, res, next) => {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'approved' }),
      Volunteer.countDocuments({ status: 'pending' }),
      Volunteer.countDocuments({ status: 'rejected' }),
    ]);

    const skillsDistribution = await Volunteer.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const cityDistribution = await Volunteer.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const stateDistribution = await Volunteer.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const yearDistribution = await Volunteer.aggregate([
      { $group: { _id: '$yearOfStudy', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const hoursDistribution = await Volunteer.aggregate([
      { $group: { _id: '$availableHours', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    sendResponse(res, 200, true, 'Detailed statistics retrieved', {
      summary: { total, approved, pending, rejected },
      skillsDistribution,
      cityDistribution,
      stateDistribution,
      yearDistribution,
      hoursDistribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export volunteers as PDF (returns JSON data for client-side PDF generation)
// @route   GET /api/reports/pdf
exports.exportPDF = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const volunteers = await Volunteer.find(query)
      .sort({ registeredAt: -1 })
      .lean();

    const [total, approved, pending, rejected] = await Promise.all([
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'approved' }),
      Volunteer.countDocuments({ status: 'pending' }),
      Volunteer.countDocuments({ status: 'rejected' }),
    ]);

    sendResponse(res, 200, true, 'PDF data retrieved', {
      volunteers,
      stats: { total, approved, pending, rejected },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
