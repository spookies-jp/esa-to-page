CREATE TABLE IF NOT EXISTS published_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  esa_post_id INTEGER NOT NULL,
  workspace TEXT NOT NULL,
  esa_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slug ON published_articles(slug);
CREATE INDEX IF NOT EXISTS idx_esa_post_id ON published_articles(esa_post_id);