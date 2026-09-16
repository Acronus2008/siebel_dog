const { validatePayload } = require('../src/validatePayload');

describe('validatePayload', () => {
  test('accepts a minimal valid payload', () => {
    const result = validatePayload({
      hostname: 'siebel-app01',
      scan_timestamp: '2026-09-15T14:00:00Z',
      tls_findings: { tls1_2_enabled: true },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('rejects a payload missing hostname', () => {
    const result = validatePayload({
      scan_timestamp: '2026-09-15T14:00:00Z',
      tls_findings: {},
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('missing required field: hostname');
  });

  test('rejects a non-object payload', () => {
    const result = validatePayload(null);
    expect(result.valid).toBe(false);
  });

  test('rejects a hostname that is not a string', () => {
    const result = validatePayload({
      hostname: 123,
      scan_timestamp: '2026-09-15T14:00:00Z',
      tls_findings: {},
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('hostname must be a string');
  });
});
