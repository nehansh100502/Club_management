const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, default: null },
    name: { type: String, required: true },
    role: { type: String, required: true }, // admin | club_head | student
    clubId: { type: String, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
