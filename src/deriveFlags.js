function deriveFlags(payload) {
  const tls = payload.tls_findings || {};
  const tlsOk = Boolean(
    tls.tls1_2_enabled &&
    tls.tls1_3_enabled &&
    tls.sslv3_disabled !== false &&
    tls.tls1_0_disabled !== false &&
    tls.tls1_1_disabled !== false
  );

  const handshakeCert = payload.certificate_handshake || {};
  const discovered = Array.isArray(payload.certificates_discovered) ? payload.certificates_discovered : [];
  const certExpired = Boolean(handshakeCert.expired) || discovered.some((c) => c && c.expired === true);

  const sshOpen = Boolean(payload.ssh_exposure && payload.ssh_exposure.port_22_open);

  const redirect = payload.http_redirect || {};
  const redirectOk = Boolean(redirect.port_80_open && redirect.redirects_to_443);

  return { tls_ok: tlsOk, cert_expired: certExpired, ssh_open: sshOpen, redirect_ok: redirectOk };
}

module.exports = { deriveFlags };
