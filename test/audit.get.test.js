const request = require('supertest');
const { createApp } = require('../src/app');
const { createTestPool } = require('./testDb');

describe('GET /api/v1/siebel-audit', () => {
  let app;

  beforeEach(async () => {
    const pool = await createTestPool();
    app = createApp({ pool, apiKey: 'test-key' });
  });

  test('filters results by hostname', async () => {
    const basePayload = {
      scan_timestamp: '2026-09-15T14:00:00Z',
      tls_findings: { tls1_2_enabled: true },
    };

    await request(app).post('/api/v1/siebel-audit').set('x-api-key', 'test-key')
      .send({ ...basePayload, hostname: 'host-a' });
    await request(app).post('/api/v1/siebel-audit').set('x-api-key', 'test-key')
      .send({ ...basePayload, hostname: 'host-b' });

    const res = await request(app)
      .get('/api/v1/siebel-audit?hostname=host-a')
      .set('x-api-key', 'test-key');

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].hostname).toBe('host-a');
  });

  test('requires a valid x-api-key', async () => {
    const res = await request(app).get('/api/v1/siebel-audit');
    expect(res.status).toBe(401);
  });
});
