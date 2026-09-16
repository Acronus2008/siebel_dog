const express = require('express');
const { apiKeyAuth } = require('../authMiddleware');
const { validatePayload } = require('../validatePayload');
const { deriveFlags } = require('../deriveFlags');

function createAuditRouter({ pool, apiKey }) {
  const router = express.Router();
  router.use(apiKeyAuth(apiKey));

  router.post('/', async (req, res) => {
    const { valid, errors } = validatePayload(req.body);
    if (!valid) {
      return res.status(400).json({ error: 'invalid_payload', details: errors });
    }

    const flags = deriveFlags(req.body);
    const p = req.body;

    const result = await pool.query(
      `INSERT INTO audit_results
        (hostname, ip, scan_timestamp, tls_ok, cert_expired, ssh_open, redirect_ok,
         tls_findings, certificate_handshake, certificates_discovered, private_key_hygiene,
         http_redirect, ssh_exposure, raw_payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id`,
      [
        p.hostname,
        p.ip || null,
        p.scan_timestamp,
        flags.tls_ok,
        flags.cert_expired,
        flags.ssh_open,
        flags.redirect_ok,
        JSON.stringify(p.tls_findings || {}),
        JSON.stringify(p.certificate_handshake || {}),
        JSON.stringify(p.certificates_discovered || []),
        JSON.stringify(p.private_key_hygiene || []),
        JSON.stringify(p.http_redirect || {}),
        JSON.stringify(p.ssh_exposure || {}),
        JSON.stringify(p),
      ]
    );

    return res.status(201).json({ id: result.rows[0].id });
  });

  router.get('/', async (req, res) => {
    const { hostname, from, to } = req.query;
    const conditions = [];
    const values = [];

    if (hostname) {
      values.push(hostname);
      conditions.push(`hostname = $${values.length}`);
    }
    if (from) {
      values.push(from);
      conditions.push(`scan_timestamp >= $${values.length}`);
    }
    if (to) {
      values.push(to);
      conditions.push(`scan_timestamp <= $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT id, hostname, ip, scan_timestamp, tls_ok, cert_expired, ssh_open, redirect_ok, created_at
       FROM audit_results ${whereClause}
       ORDER BY scan_timestamp DESC
       LIMIT 100`,
      values
    );

    return res.status(200).json({ results: result.rows });
  });

  return router;
}

module.exports = { createAuditRouter };
