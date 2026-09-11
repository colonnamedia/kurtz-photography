-- Run this once against your Neon database (SQL editor or psql).

CREATE TABLE IF NOT EXISTS links (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  subtitle    TEXT DEFAULT '',
  url         TEXT NOT NULL,
  image       TEXT DEFAULT '',          -- data URL (uploaded) or hosted image URL
  pinned      BOOLEAN NOT NULL DEFAULT FALSE,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  project_type TEXT DEFAULT '',
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS links_position_idx ON links (position);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
