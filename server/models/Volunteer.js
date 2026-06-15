const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
  },
  note: { type: String, default: '' },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  college: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  yearOfStudy: { type: String, required: true },
  skills: { type: [String], required: true, default: [] },
  areasOfInterest: { type: [String], required: true, default: [] },
  motivation: { type: String, required: true, minlength: 50 },
  availableHours: { type: String, required: true },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNote: { type: String, default: '' },
  statusHistory: { type: [statusHistorySchema], default: [] },
  registeredAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
volunteerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
