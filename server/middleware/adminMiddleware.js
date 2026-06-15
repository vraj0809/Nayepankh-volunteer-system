const sendResponse = require('../utils/sendResponse');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return sendResponse(res, 403, false, 'Access denied. Admin only.');
};

module.exports = adminOnly;
