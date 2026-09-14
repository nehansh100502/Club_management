const express = require('express');
const { v4: uuidv4 } = require('uuid');

const { jwtRequired, roleRequired } = require('../middleware/auth');
const User = require('../models/User');
const Club = require('../models/Club');
const ClubMember = require('../models/ClubMember');
const Event = require('../models/Event');
const { clubToDict, userToDict } = require('../serializers');

const router = express.Router();

async function resolveHeadId(raw) {
  if (!raw || raw === 'admin') {
    const admin = await User.findOne({ role: 'admin' });
    return admin ? admin._id : '';
  }
  return raw;
}

router.get('/', async (_req, res) => {
  const clubs = await Club.find().sort({ name: 1 });
  res.status(200).json(await Promise.all(clubs.map(clubToDict)));
});

router.get('/my', jwtRequired, async (req, res) => {
  const memberships = await ClubMember.find({ userId: req.userId });
  const clubIds = memberships.map((m) => m.clubId);
  const clubs = clubIds.length ? await Club.find({ _id: { $in: clubIds } }) : [];
  res.status(200).json(await Promise.all(clubs.map(clubToDict)));
});

router.post('/:cid/join', jwtRequired, async (req, res) => {
  const { cid } = req.params;
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const club = await Club.findById(cid);
  if (!club) {
    return res.status(404).json({ message: 'Club not found' });
  }

  const existing = await ClubMember.findOne({ userId: req.userId, clubId: cid });
  if (existing) {
    return res.status(400).json({ message: 'Already a member' });
  }

  await new ClubMember({ userId: req.userId, clubId: cid }).save();
  club.memberCount = (club.memberCount || 0) + 1;
  await club.save();

  res.status(200).json({ message: 'Joined successfully' });
});

router.get('/:cid', async (req, res) => {
  const c = await Club.findById(req.params.cid);
  if (!c) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json(await clubToDict(c));
});

router.get('/:cid/members', jwtRequired, async (req, res) => {
  const { cid } = req.params;
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const club = await Club.findById(cid);
  if (!club) {
    return res.status(404).json({ message: 'Not found' });
  }

  const isAdmin = user.role === 'admin';
  const isHead = user.role === 'club_head' && user.clubId === cid;
  const membership = await ClubMember.findOne({ userId: req.userId, clubId: cid });
  const isMember = !!membership;

  if (!(isAdmin || isHead || isMember)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const memberships = await ClubMember.find({ clubId: cid });
  const userIds = memberships.map((m) => m.userId);
  const users = userIds.length ? await User.find({ _id: { $in: userIds } }) : [];

  res.status(200).json(await Promise.all(users.map(userToDict)));
});

router.post('/', jwtRequired, roleRequired('admin'), async (req, res) => {
  const data = req.body || {};
  const name = (data.name || '').trim();
  if (!name) {
    return res.status(400).json({ message: 'Name required' });
  }

  const headId = await resolveHeadId(data.headId || data.head_id);
  if (!headId) {
    return res.status(400).json({ message: 'Could not resolve club head' });
  }

  const cid = `club-${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const today = new Date().toISOString().slice(0, 10);
  const club = new Club({
    _id: cid,
    name,
    description: data.description || '',
    category: data.category || '',
    memberCount: 0,
    headId,
    createdAt: today,
    logo: data.logo || null,
  });
  await club.save();

  const headUser = await User.findById(headId);
  if (headUser) {
    headUser.clubId = cid;
    headUser.role = 'club_head';
    await headUser.save();
  }

  res.status(201).json(await clubToDict(club));
});

router.put('/:cid', jwtRequired, roleRequired('admin', 'club_head'), async (req, res) => {
  const { cid } = req.params;
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const c = await Club.findById(cid);
  if (!c) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (user.role !== 'admin' && (user.role !== 'club_head' || user.clubId !== cid)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const data = req.body || {};

  if (user.role !== 'admin') {
    if ('description' in data) c.description = data.description || '';
    if ('logo' in data) c.logo = data.logo || null;
  } else {
    if ('name' in data) c.name = data.name;
    if ('description' in data) c.description = data.description || '';
    if ('category' in data) c.category = data.category || '';
    if ('headId' in data || 'head_id' in data) {
      const hid = data.headId || data.head_id;
      const newHeadId = (await resolveHeadId(hid)) || c.headId;
      if (newHeadId !== c.headId) {
        const oldHead = await User.findById(c.headId);
        if (oldHead && oldHead.clubId === c._id) {
          oldHead.clubId = null;
        }
        c.headId = newHeadId;
        const newHead = await User.findById(newHeadId);
        if (newHead) {
          newHead.clubId = c._id;
          newHead.role = 'club_head';
          await newHead.save();
        }
        if (oldHead) {
          const otherHeads = await Club.findOne({ headId: oldHead._id, _id: { $ne: cid } });
          if (!otherHeads && oldHead.role === 'club_head') {
            oldHead.role = 'student';
          }
          await oldHead.save();
        }
      }
    }
    if ('logo' in data) c.logo = data.logo || null;
  }

  await c.save();
  res.status(200).json(await clubToDict(c));
});

router.delete('/:cid', jwtRequired, roleRequired('admin'), async (req, res) => {
  const { cid } = req.params;
  const c = await Club.findById(cid);
  if (!c) {
    return res.status(404).json({ message: 'Not found' });
  }

  await ClubMember.deleteMany({ clubId: cid });
  await User.updateMany({ clubId: cid }, { $set: { clubId: null } });
  await Event.deleteMany({ clubId: cid });
  await c.deleteOne();

  res.status(204).send();
});

module.exports = router;
