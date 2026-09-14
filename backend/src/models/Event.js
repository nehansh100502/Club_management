const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    clubId: { type: String, required: true },
    status: { type: String, required: true }, // pending | approved | rejected
    createdBy: { type: String, required: true },
    attendanceCount: { type: Number, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Event', eventSchema);
