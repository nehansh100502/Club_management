const bcrypt = require('bcryptjs');

const { DEMO_PASSWORD } = require('./config');
const User = require('./models/User');
const Club = require('./models/Club');
const ClubMember = require('./models/ClubMember');
const Event = require('./models/Event');

function hash(pw) {
  return bcrypt.hashSync(pw, 10);
}

async function seedDatabase(force = false) {
  if (!force && (await User.findOne())) {
    return;
  }

  if (force) {
    await Event.deleteMany({});
    await ClubMember.deleteMany({});
    await Club.deleteMany({});
    await User.deleteMany({});
  }

  const h = hash(DEMO_PASSWORD);

  // 1. CORE USERS
  const users = [
    ['admin-1', 'admin@university.edu', 'Dr. Eleanor Vance (Dean & Admin)', 'admin', null],
    ['head-1', 'head@university.edu', 'Alex Rivera (Tech Head)', 'club_head', 'club-tech'],
    ['head-arts', 'arts.head@university.edu', 'Sophia Chen (Arts Head)', 'club_head', 'club-arts'],
    ['head-robotics', 'robotics.head@university.edu', 'Priya Patel (Robotics Head)', 'club_head', 'club-robotics'],
    ['head-sports', 'sports.head@university.edu', 'Marcus Johnson (Sports Head)', 'club_head', 'club-sports'],
    ['head-music', "music.head@university.edu", "Liam O'Connor (Music Head)", 'club_head', 'club-music'],
    ['student-1', 'student@university.edu', 'Jordan Lee', 'student', 'club-tech'],
    ['student-2', 'emma.watson@university.edu', 'Emma Watson', 'student', 'club-arts'],
    ['student-3', 'david.kim@university.edu', 'David Kim', 'student', 'club-sports'],
    ['student-4', 'maya.lin@university.edu', 'Maya Lin', 'student', 'club-robotics'],
    ['student-5', 'sam.wilson@university.edu', 'Sam Wilson', 'student', 'club-music'],
  ];

  await User.insertMany(
    users.map(([id, email, name, role, clubId]) => ({
      _id: id,
      email,
      name,
      role,
      passwordHash: h,
      clubId,
    }))
  );

  // 2. CLUBS
  const clubs = [
    {
      _id: 'club-tech',
      name: 'Tech Innovators Club',
      description:
        'Empowering students through cutting-edge hackathons, software architecture workshops, AI labs, and open-source collaboration.',
      category: 'Technology',
      memberCount: 4,
      headId: 'head-1',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
      createdAt: '2026-01-10',
    },
    {
      _id: 'club-arts',
      name: 'Creative Arts & Media',
      description:
        'A vibrant collective for graphic designers, digital painters, photographers, 3D sculptors, and creative visual storytellers.',
      category: 'Arts',
      memberCount: 3,
      headId: 'head-arts',
      logo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15',
    },
    {
      _id: 'club-robotics',
      name: 'Robotics & AI Society',
      description:
        'Designing autonomous rovers, competitive combat bots, edge AI systems, and aerial drone avionics.',
      category: 'Engineering',
      memberCount: 3,
      headId: 'head-robotics',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop&q=80',
      createdAt: '2026-01-12',
    },
    {
      _id: 'club-sports',
      name: 'Campus Athletics & Esports',
      description:
        'Fostering teamwork, physical fitness, intra-university leagues, and competitive collegiate esports tournaments.',
      category: 'Sports',
      memberCount: 3,
      headId: 'head-sports',
      logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
      createdAt: '2026-01-20',
    },
    {
      _id: 'club-music',
      name: 'Harmonix Music Society',
      description:
        'Uniting campus vocalists, instrumentalists, audio engineers, and electronic producers for live stage performances and studio jamming.',
      category: 'Cultural',
      memberCount: 3,
      headId: 'head-music',
      logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      createdAt: '2026-02-01',
    },
    {
      _id: 'club-eco',
      name: 'Green Campus & Sustainability',
      description:
        'Leading zero-waste campus initiatives, solar energy workshops, botanical gardens, and community environmental impact projects.',
      category: 'Social',
      memberCount: 1,
      headId: 'head-1',
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80',
      createdAt: '2026-02-10',
    },
  ];
  await Club.insertMany(clubs);

  // 3. MEMBERSHIPS
  const memberships = [
    ['head-1', 'club-tech'],
    ['student-1', 'club-tech'],
    ['student-3', 'club-tech'],
    ['student-4', 'club-tech'],
    ['head-arts', 'club-arts'],
    ['student-1', 'club-arts'],
    ['student-2', 'club-arts'],
    ['head-robotics', 'club-robotics'],
    ['student-1', 'club-robotics'],
    ['student-4', 'club-robotics'],
    ['head-sports', 'club-sports'],
    ['student-3', 'club-sports'],
    ['student-5', 'club-sports'],
    ['head-music', 'club-music'],
    ['student-2', 'club-music'],
    ['student-5', 'club-music'],
    ['student-1', 'club-eco'],
  ];
  await ClubMember.insertMany(memberships.map(([userId, clubId]) => ({ userId, clubId })));

  // 4. EVENTS (Approved, Pending, Past, Future)
  const events = [
    {
      _id: 'event-hackathon',
      title: 'Annual HackMatrix 2026 Hackathon',
      description:
        '36-hour hackathon focused on Generative AI, Web3, and Sustainable Smart Cities. Mentors from top tech companies and $10k in prize pool.',
      date: '2026-05-20',
      time: '09:00 AM',
      location: 'Innovation Hub & Grand Auditorium',
      clubId: 'club-tech',
      status: 'approved',
      createdBy: 'head-1',
      attendanceCount: 145,
    },
    {
      _id: 'event-art-expo',
      title: 'Spring Visual Arts & Digital Media Gallery',
      description:
        'Exhibition displaying student oil paintings, digital art concepts, UI/UX showcases, and interactive 3D virtual installations.',
      date: '2026-05-28',
      time: '11:00 AM',
      location: 'Central Fine Arts Gallery, Wing C',
      clubId: 'club-arts',
      status: 'approved',
      createdBy: 'head-arts',
      attendanceCount: 92,
    },
    {
      _id: 'event-robotics-showcase',
      title: 'Autonomous Drone & BattleBot Arena 2026',
      description:
        'High-octane obstacle course racing for autonomous quadcopters and competitive 3lb combat bot arena tournament.',
      date: '2026-06-05',
      time: '02:00 PM',
      location: 'Engineering Quadrangle Outdoor Field',
      clubId: 'club-robotics',
      status: 'approved',
      createdBy: 'head-robotics',
      attendanceCount: 118,
    },
    {
      _id: 'event-esports',
      title: 'Inter-College Esports Invitational (Valorant & Rocket League)',
      description:
        'Live-streamed esports championship on campus big screens with shoutcasting, team rivalries, and custom tournament trophies.',
      date: '2026-06-12',
      time: '05:00 PM',
      location: 'Student Union Esports Arena',
      clubId: 'club-sports',
      status: 'approved',
      createdBy: 'head-sports',
      attendanceCount: 180,
    },
    {
      _id: 'event-sunset-jam',
      title: 'Acoustic Sunset Concert & Open Mic',
      description:
        'An evening of acoustic indie covers, jazz fusion, and original student songs under the campus sunset.',
      date: '2026-06-18',
      time: '06:30 PM',
      location: 'Campus Amphitheater Lawn',
      clubId: 'club-music',
      status: 'approved',
      createdBy: 'head-music',
      attendanceCount: 78,
    },
    {
      _id: 'event-past-ai',
      title: 'Deep Learning & LLM Fine-Tuning Bootcamp',
      description:
        'Hands-on workshop training Hugging Face transformer models using university GPU clusters.',
      date: '2026-03-12',
      time: '03:00 PM',
      location: 'Computer Science Lab 304',
      clubId: 'club-tech',
      status: 'approved',
      createdBy: 'head-1',
      attendanceCount: 85,
    },
    {
      _id: 'event-past-photo',
      title: 'Golden Hour Campus Photography Walk',
      description:
        'Practical tutorial on camera aperture, framing architectural lighting, and Adobe Lightroom mobile color grading.',
      date: '2026-03-25',
      time: '04:30 PM',
      location: 'Bell Tower Plaza',
      clubId: 'club-arts',
      status: 'approved',
      createdBy: 'head-arts',
      attendanceCount: 48,
    },
    {
      _id: 'event-pending-cloud',
      title: 'Cloud Native Architecture & Kubernetes Bootcamp',
      description:
        'Deploying microservices and configuring autoscaling CI/CD pipelines with Kubernetes and Terraform.',
      date: '2026-07-02',
      time: '10:00 AM',
      location: 'Innovation Lab Room 202',
      clubId: 'club-tech',
      status: 'pending',
      createdBy: 'head-1',
      attendanceCount: 50,
    },
    {
      _id: 'event-pending-vr',
      title: 'Spatial Audio & Virtual Reality Cinema Experience',
      description:
        'Interactive workshop exploring Unreal Engine 5 spatial environments and Apple Vision / Meta Quest interactive cinema.',
      date: '2026-07-10',
      time: '01:30 PM',
      location: 'Media Arts Studio 105',
      clubId: 'club-arts',
      status: 'pending',
      createdBy: 'head-arts',
      attendanceCount: 35,
    },
    {
      _id: 'event-pending-3v3',
      title: 'Summer 3v3 Street Basketball Tournament',
      description:
        'Fast-paced double elimination 3v3 half-court basketball tournament with music, refreshments, and MVP awards.',
      date: '2026-07-15',
      time: '04:00 PM',
      location: 'Recreation Center Outdoor Courts',
      clubId: 'club-sports',
      status: 'pending',
      createdBy: 'head-sports',
      attendanceCount: 60,
    },
    {
      _id: 'event-rejected-midnight',
      title: 'Midnight Rooftop Fireworks & Drone Light Show',
      description: 'Synchronized drone swarm light show over university bell tower at midnight.',
      date: '2026-07-28',
      time: '11:45 PM',
      location: 'Main Science Building Roof',
      clubId: 'club-robotics',
      status: 'rejected',
      createdBy: 'head-robotics',
      attendanceCount: 0,
    },
  ];
  await Event.insertMany(events);

  console.log('Successfully seeded database with core dummy data.');
}

async function seedIfEmpty() {
  await seedDatabase(false);
}

module.exports = { seedDatabase, seedIfEmpty };
