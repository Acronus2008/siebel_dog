const fs = require('fs');
const path = require('path');

async function runMigrations(pool) {
  const migrationPath = path.join(__dirname, '..', 'migrations', '001_create_audit_results.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  await pool.query(sql);
}

module.exports = { runMigrations };
