const { Pool } = require('pg');
const { createApp } = require('./src/app');
const { runMigrations } = require('./src/db');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY environment variable is required');
  }

  await runMigrations(pool);

  const app = createApp({ pool, apiKey });
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`siebel-audit-api listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
