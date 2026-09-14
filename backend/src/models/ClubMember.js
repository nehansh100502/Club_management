const mongoose = require('mongoose');

const clubMemberSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    clubId: { type: String, required: true },
  },
  { versionKey: false }
);

clubMemberSchema.index({ userId: 1, clubId: 1 }, { unique: true });

module.exports = mongoose.model('ClubMember', clubMemberSchema);
