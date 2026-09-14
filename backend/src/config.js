const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config();

const origins = (
  process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5174'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

module.exports = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  SECRET_KEY: process.env.SECRET_KEY || 'dev-secret-change-me',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'dev-jwt-secret-change-me',
  MONGODB_URI:
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    'mongodb://localhost:27017/the_clubs',
  CORS_ORIGINS: origins,
  DEMO_PASSWORD: process.env.DEMO_PASSWORD || 'password',
};
