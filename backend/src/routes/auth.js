const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const { JWT_SECRET_KEY } = require('../config');
const User = require('../models/User');
const Club = require('../models/Club');
const ClubMember = require('../models/ClubMember');
const { userToDict } = require('../serializers');

const router = express.Router();

function hashPassword(pw) {
  return bcrypt.hashSync(pw, 10);
}

function checkPassword(pw, hash) {
  if (!hash) return false;
  return bcrypt.compareSync(pw, hash);
}

function createToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET_KEY);
}

router.post('/login', async (req, res) => {
  const data = req.body || {};
  const email = (data.email || '').trim().toLowerCase();
  const password = data.password || '';
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = await User.findOne({ email });
  if (!user || !checkPassword(password, user.passwordHash || '')) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createToken(user._id);
  return res.status(200).json({ user: await userToDict(user), token });
});

router.post('/signup', async (req, res) => {
  const data = req.body || {};
  const name = (data.name || '').trim();
  const email = (data.email || '').trim().toLowerCase();
  const password = data.password || '';
  let clubId = data.clubId || data.club_id || null;
  if (clubId === '') clubId = null;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password required' });
  }
  if (await User.findOne({ email })) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const uid = `user-${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const user = new User({
    _id: uid,
    email,
    name,
    role: 'student',
    passwordHash: hashPassword(password),
    clubId: clubId || null,
  });
  await user.save();

  if (clubId) {
    const club = await Club.findById(clubId);
    if (club) {
      const existing = await ClubMember.findOne({ userId: uid, clubId });
      if (!existing) {
        await new ClubMember({ userId: uid, clubId }).save();
      }
      club.memberCount = (club.memberCount || 0) + 1;
      await club.save();
    }
  }

  const token = createToken(user._id);
  return res.status(201).json({ user: await userToDict(user), token });
});

module.exports = router;
