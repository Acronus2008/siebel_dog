const express = require('express');
const request = require('supertest');
const { apiKeyAuth } = require('../src/authMiddleware');

function buildTestApp(expectedKey) {
  const app = express();
  app.get('/protected', apiKeyAuth(expectedKey), (req, res) => {
    res.status(200).json({ ok: true });
  });
  return app;
}

describe('apiKeyAuth', () => {
  test('rejects requests without an x-api-key header', async () => {
    const app = buildTestApp('secret123');
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'unauthorized' });
  });

  test('rejects requests with the wrong key', async () => {
    const app = buildTestApp('secret123');
    const res = await request(app).get('/protected').set('x-api-key', 'wrong');
    expect(res.status).toBe(401);
  });

  test('allows requests with the correct key', async () => {
    const app = buildTestApp('secret123');
    const res = await request(app).get('/protected').set('x-api-key', 'secret123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
