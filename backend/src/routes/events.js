const express = require('express');
const { v4: uuidv4 } = require('uuid');

const { jwtOptional, jwtRequired, roleRequired } = require('../middleware/auth');
const User = require('../models/User');
const ClubMember = require('../models/ClubMember');
const Event = require('../models/Event');
const { eventToDict } = require('../serializers');

const router = express.Router();

function canManageEvent(user, clubId) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'club_head' && user.clubId === clubId) return true;
  return false;
}

// Role-specific event display:
// - admin: all events
// - club_head: only their club's events
// - student: all events from clubs in which the student is enrolled + approved events
// - guest: approved events only (fallback)
router.get('/', jwtOptional, async (req, res) => {
  const uid = req.userId;

  if (!uid) {
    const events = await Event.find({ status: 'approved' });
    return res.status(200).json(await Promise.all(events.map(eventToDict)));
  }

  const user = await User.findById(uid);
  if (!user) {
    const events = await Event.find({ status: 'approved' });
    return res.status(200).json(await Promise.all(events.map(eventToDict)));
  }

  let events;
  if (user.role === 'admin') {
    events = await Event.find().sort({ date: -1 });
  } else if (user.role === 'club_head') {
    events = await Event.find({ clubId: user.clubId }).sort({ date: -1 });
  } else if (user.role === 'student') {
    const memberships = await ClubMember.find({ userId: uid });
    const clubIds = memberships.map((m) => m.clubId);
    events = await Event.find({
      $or: [{ status: 'approved' }, ...(clubIds.length ? [{ clubId: { $in: clubIds } }] : [])],
    }).sort({ date: -1 });
  } else {
    events = await Event.find({ status: 'approved' });
  }

  res.status(200).json(await Promise.all(events.map(eventToDict)));
});

router.get('/:eid', async (req, res) => {
  const ev = await Event.findById(req.params.eid);
  if (!ev) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json(await eventToDict(ev));
});

router.post('/', jwtRequired, roleRequired('admin', 'club_head'), async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const data = req.body || {};
  const clubId = data.clubId || data.club_id;
  if (!clubId) {
    return res.status(400).json({ message: 'clubId required' });
  }
  if (!canManageEvent(user, clubId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const title = (data.title || '').trim();
  if (!title) {
    return res.status(400).json({ message: 'Title required' });
  }

  const eid = `event-${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const createdBy = data.createdBy || data.created_by || req.userId;
  const status = user.role === 'admin' ? 'approved' : 'pending';

  const ev = new Event({
    _id: eid,
    title,
    description: data.description || '',
    date: data.date || '',
    time: data.time || '',
    location: data.location || '',
    clubId,
    status,
    createdBy,
    attendanceCount: data.attendanceCount != null ? data.attendanceCount : null,
  });
  await ev.save();
  res.status(201).json(await eventToDict(ev));
});

router.put('/:eid', jwtRequired, roleRequired('admin', 'club_head'), async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const ev = await Event.findById(req.params.eid);
  if (!ev) {
    return res.status(404).json({ message: 'Not found' });
  }
  if (!canManageEvent(user, ev.clubId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (user.role === 'club_head' && ev.status === 'approved') {
    return res.status(403).json({ message: 'Approved events cannot be modified by club heads' });
  }

  const data = req.body || {};
  for (const key of ['title', 'description', 'date', 'time', 'location']) {
    if (key in data) {
      ev[key] = data[key] || '';
    }
  }
  if ('status' in data && user.role === 'admin') {
    ev.status = data.status;
  }
  if ('attendanceCount' in data) {
    ev.attendanceCount = data.attendanceCount;
  }
  await ev.save();
  res.status(200).json(await eventToDict(ev));
});

router.delete('/:eid', jwtRequired, roleRequired('admin', 'club_head'), async (req, res) => {
  const user = await User.findById(req.userId);

  const ev = await Event.findById(req.params.eid);
  if (!ev) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (!canManageEvent(user, ev.clubId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await ev.deleteOne();
  res.status(204).send();
});

router.post('/:eid/approve', jwtRequired, roleRequired('admin'), async (req, res) => {
  const ev = await Event.findById(req.params.eid);
  if (!ev) {
    return res.status(404).json({ message: 'Not found' });
  }
  ev.status = 'approved';
  await ev.save();
  res.status(200).json(await eventToDict(ev));
});

router.post('/:eid/reject', jwtRequired, roleRequired('admin'), async (req, res) => {
  const ev = await Event.findById(req.params.eid);
  if (!ev) {
    return res.status(404).json({ message: 'Not found' });
  }
  ev.status = 'rejected';
  await ev.save();
  res.status(200).json(await eventToDict(ev));
});

module.exports = router;
