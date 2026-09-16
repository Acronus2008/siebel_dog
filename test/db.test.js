const { createTestPool } = require('./testDb');

describe('runMigrations (via createTestPool)', () => {
  test('creates the audit_results table', async () => {
    const pool = await createTestPool();
    const result = await pool.query('SELECT COUNT(*) FROM audit_results');
    // COUNT(*) is a bigint in Postgres: the real `pg` driver stringifies it
    // (e.g. '0') to avoid precision loss, while pg-mem returns a native
    // JS number (0). Number() normalizes both so this assertion is valid
    // against real Postgres and against the pg-mem test double.
    expect(Number(result.rows[0].count)).toBe(0);
  });
});
