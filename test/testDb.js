const { newDb } = require('pg-mem');
const { runMigrations } = require('../src/db');

async function createTestPool() {
  const db = newDb();
  const { Pool } = db.adapters.createPg();
  const pool = new Pool();
  await runMigrations(pool);
  return pool;
}

module.exports = { createTestPool };
