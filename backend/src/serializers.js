const User = require('./models/User');
const Club = require('./models/Club');
const ClubMember = require('./models/ClubMember');

async function userToDict(u) {
  const memberships = await ClubMember.find({ userId: u._id });
  const joinedClubIds = memberships.map((m) => m.clubId);
  const d = {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    joinedClubIds,
  };
  if (u.clubId) {
    d.clubId = u.clubId;
  }
  return d;
}

async function clubToDict(c) {
  const head = c.headId ? await User.findById(c.headId) : null;
  const d = {
    id: c._id,
    name: c.name,
    description: c.description || '',
    category: c.category || '',
    memberCount: c.memberCount != null ? c.memberCount : 0,
    headId: c.headId,
    headName: head ? head.name : '',
    headEmail: head ? head.email : '',
    createdAt: c.createdAt,
  };
  if (c.logo) {
    d.logo = c.logo;
  }
  return d;
}

async function eventToDict(e) {
  const club = await Club.findById(e.clubId);
  const d = {
    id: e._id,
    title: e.title,
    description: e.description || '',
    date: e.date,
    time: e.time,
    location: e.location,
    clubId: e.clubId,
    clubName: club ? club.name : '',
    status: e.status,
    createdBy: e.createdBy,
  };
  if (e.attendanceCount != null) {
    d.attendanceCount = e.attendanceCount;
  }
  return d;
}

module.exports = { userToDict, clubToDict, eventToDict };
