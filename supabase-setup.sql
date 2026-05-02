-- ════════════════════════════════════════════════════════════════════════════
-- SUPABASE SETUP — Mahmoud Abdo Portfolio
-- 1. Go to: https://app.supabase.com → Your Project → SQL Editor → New Query
-- 2. Paste this entire file and click RUN
-- ════════════════════════════════════════════════════════════════════════════


-- ── TABLE 1: site_settings (stores profile photo URL) ────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  key        TEXT        UNIQUE NOT NULL,
  value      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 2: clinical_cases ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinical_cases (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  category    TEXT        DEFAULT 'Other',
  description TEXT,
  date        TEXT,
  before_url  TEXT,
  after_url   TEXT,
  extras      TEXT[]      DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 3: digital_cases ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS digital_cases (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  category    TEXT        DEFAULT 'Other',
  description TEXT,
  date        TEXT,
  before_url  TEXT,
  after_url   TEXT,
  extras      TEXT[]      DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE digital_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select digital_cases" ON digital_cases FOR SELECT USING (true);
CREATE POLICY "insert digital_cases" ON digital_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "update digital_cases" ON digital_cases FOR UPDATE USING (true);
CREATE POLICY "delete digital_cases" ON digital_cases FOR DELETE USING (true);


-- ── TABLE 4: certificates ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT        NOT NULL,
  issuer     TEXT,
  date       TEXT,
  file_url   TEXT,
  file_type  TEXT,
  file_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
-- Enable RLS on all tables then allow full access via anon key.
-- The admin password gate in the UI controls who can write.

ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates   ENABLE ROW LEVEL SECURITY;

-- site_settings policies
CREATE POLICY "select site_settings"  ON site_settings FOR SELECT USING (true);
CREATE POLICY "insert site_settings"  ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "update site_settings"  ON site_settings FOR UPDATE USING (true);
CREATE POLICY "delete site_settings"  ON site_settings FOR DELETE USING (true);

-- clinical_cases policies
CREATE POLICY "select clinical_cases" ON clinical_cases FOR SELECT USING (true);
CREATE POLICY "insert clinical_cases" ON clinical_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "update clinical_cases" ON clinical_cases FOR UPDATE USING (true);
CREATE POLICY "delete clinical_cases" ON clinical_cases FOR DELETE USING (true);

-- certificates policies
CREATE POLICY "select certificates"   ON certificates FOR SELECT USING (true);
CREATE POLICY "insert certificates"   ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "update certificates"   ON certificates FOR UPDATE USING (true);
CREATE POLICY "delete certificates"   ON certificates FOR DELETE USING (true);


-- ════════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS  ← do this manually in the Supabase Dashboard
-- ════════════════════════════════════════════════════════════════════════════
--
--  Go to: Storage → New bucket  (repeat 3 times)
--
--   Bucket name: cases          Public: ON
--   Bucket name: certificates   Public: ON
--   Bucket name: profile        Public: ON
--
-- ════════════════════════════════════════════════════════════════════════════
