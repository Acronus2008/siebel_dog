const { deriveFlags } = require('../src/deriveFlags');

describe('deriveFlags', () => {
  test('tls_ok is true when 1.2/1.3 are enabled and deprecated protocols are disabled', () => {
    const flags = deriveFlags({
      tls_findings: {
        tls1_2_enabled: true,
        tls1_3_enabled: true,
        sslv3_disabled: true,
        tls1_0_disabled: true,
        tls1_1_disabled: true,
      },
    });
    expect(flags.tls_ok).toBe(true);
  });

  test('tls_ok is false when a deprecated protocol is still enabled', () => {
    const flags = deriveFlags({
      tls_findings: {
        tls1_2_enabled: true,
        tls1_3_enabled: true,
        sslv3_disabled: true,
        tls1_0_disabled: true,
        tls1_1_disabled: false,
      },
    });
    expect(flags.tls_ok).toBe(false);
  });

  test('cert_expired is true if any discovered certificate is expired', () => {
    const flags = deriveFlags({
      tls_findings: {},
      certificate_handshake: { expired: false },
      certificates_discovered: [{ expired: false }, { expired: true }],
    });
    expect(flags.cert_expired).toBe(true);
  });

  test('ssh_open reflects ssh_exposure.port_22_open', () => {
    const flags = deriveFlags({ tls_findings: {}, ssh_exposure: { port_22_open: true } });
    expect(flags.ssh_open).toBe(true);
  });

  test('redirect_ok requires both port_80_open and redirects_to_443', () => {
    const flags = deriveFlags({
      tls_findings: {},
      http_redirect: { port_80_open: true, redirects_to_443: false },
    });
    expect(flags.redirect_ok).toBe(false);
  });
});
