CREATE TABLE IF NOT EXISTS audit_results (
  id             SERIAL PRIMARY KEY,
  hostname       TEXT NOT NULL,
  ip             TEXT,
  scan_timestamp TIMESTAMPTZ NOT NULL,
  tls_ok         BOOLEAN,
  cert_expired   BOOLEAN,
  ssh_open       BOOLEAN,
  redirect_ok    BOOLEAN,
  tls_findings            JSONB NOT NULL,
  certificate_handshake   JSONB,
  certificates_discovered JSONB,
  private_key_hygiene     JSONB,
  http_redirect            JSONB,
  ssh_exposure             JSONB,
  raw_payload    JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_results_hostname ON audit_results (hostname);
CREATE INDEX IF NOT EXISTS idx_audit_results_scan_timestamp ON audit_results (scan_timestamp);
