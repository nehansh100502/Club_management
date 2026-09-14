const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');

async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI);
  return mongoose.connection;
}

module.exports = { connectDB };
