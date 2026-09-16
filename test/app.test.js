const request = require('supertest');
const { createApp } = require('../src/app');

describe('GET /health', () => {
  test('returns 200 and status ok', async () => {
    const app = createApp({ pool: null, apiKey: 'unused' });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
