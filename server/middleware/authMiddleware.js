const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendResponse = require('../utils/sendResponse');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendResponse(res, 401, false, 'Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendResponse(res, 401, false, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, false, 'Token expired, please login again');
    }
    return sendResponse(res, 401, false, 'Not authorized, invalid token');
  }
};

module.exports = protect;
