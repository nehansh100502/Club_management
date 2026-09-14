const { createApp } = require('./app');
const { connectDB } = require('./db');
const { seedIfEmpty } = require('./seed');
const { PORT } = require('./config');

async function main() {
  await connectDB();
  await seedIfEmpty();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
