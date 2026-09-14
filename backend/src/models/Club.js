const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    memberCount: { type: Number, default: 0 },
    logo: { type: String, default: null },
    headId: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Club', clubSchema);
