const request = require('supertest');
const { createApp } = require('../src/app');
const { createTestPool } = require('./testDb');

describe('POST /api/v1/siebel-audit', () => {
  let app;

  beforeEach(async () => {
    const pool = await createTestPool();
    app = createApp({ pool, apiKey: 'test-key' });
  });

  test('returns 201 and an id for a valid payload', async () => {
    const payload = {
      hostname: 'siebel-app01',
      scan_timestamp: '2026-09-15T14:00:00Z',
      tls_findings: { tls1_2_enabled: true, tls1_3_enabled: true },
    };

    const res = await request(app)
      .post('/api/v1/siebel-audit')
      .set('x-api-key', 'test-key')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test('returns 401 without x-api-key', async () => {
    const res = await request(app).post('/api/v1/siebel-audit').send({});
    expect(res.status).toBe(401);
  });

  test('returns 400 for a payload missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/siebel-audit')
      .set('x-api-key', 'test-key')
      .send({ hostname: 'x' });

    expect(res.status).toBe(400);
  });
});
