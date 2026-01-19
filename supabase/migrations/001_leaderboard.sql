CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name VARCHAR(20) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  lines INTEGER NOT NULL CHECK (lines >= 0),
  level INTEGER NOT NULL CHECK (level >= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read" ON scores FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON scores FOR INSERT WITH CHECK (true);
