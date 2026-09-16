const express = require('express');
const { createAuditRouter } = require('./routes/audit');

function createApp({ pool, apiKey }) {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1/siebel-audit', createAuditRouter({ pool, apiKey }));

  app.use((err, req, res, next) => {
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}

module.exports = { createApp };
