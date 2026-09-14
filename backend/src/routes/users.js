const express = require('express');

const { jwtRequired, roleRequired } = require('../middleware/auth');
const User = require('../models/User');
const Club = require('../models/Club');
const { userToDict } = require('../serializers');

const router = express.Router();

router.get('/', jwtRequired, roleRequired('admin'), async (_req, res) => {
  const users = await User.find().sort({ email: 1 });
  res.status(200).json(await Promise.all(users.map(userToDict)));
});

router.put('/:uid/role', jwtRequired, roleRequired('admin'), async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid);
  if (!user) {
    return res.status(404).json({ message: 'Not found' });
  }
  const data = req.body || {};
  const role = data.role;
  if (!['admin', 'club_head', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  if (role !== 'club_head') {
    // If demoted from club_head, clear club_id
    user.clubId = null;
    // If they were head of any club, reassign to admin or clear
    const clubs = await Club.find({ headId: uid });
    const admin = await User.findOne({ role: 'admin' });
    const adminId = admin ? admin._id : '';
    for (const c of clubs) {
      c.headId = adminId;
      await c.save();
    }
  }

  user.role = role;
  await user.save();
  res.status(200).json(await userToDict(user));
});

module.exports = router;
