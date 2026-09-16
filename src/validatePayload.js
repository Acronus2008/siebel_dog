const REQUIRED_TOP_LEVEL_FIELDS = ['hostname', 'scan_timestamp', 'tls_findings'];

function validatePayload(body) {
  const errors = [];

  if (typeof body !== 'object' || body === null) {
    return { valid: false, errors: ['payload must be a JSON object'] };
  }

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in body)) {
      errors.push(`missing required field: ${field}`);
    }
  }

  if (typeof body.hostname !== 'undefined' && typeof body.hostname !== 'string') {
    errors.push('hostname must be a string');
  }

  if (typeof body.tls_findings !== 'undefined' && typeof body.tls_findings !== 'object') {
    errors.push('tls_findings must be an object');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validatePayload };
