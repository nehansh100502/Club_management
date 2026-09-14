const express = require('express');
const cors = require('cors');

const { CORS_ORIGINS } = require('./config');
const authRoutes = require('./routes/auth');
const clubRoutes = require('./routes/clubs');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

function createApp() {
  const app = express();

  app.use(express.json({ limit: '16mb' }));
  app.use(
    cors({
      origin: CORS_ORIGINS,
      credentials: true,
    })
  );

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/clubs', clubRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/users', userRoutes);

  return app;
}

module.exports = { createApp };
