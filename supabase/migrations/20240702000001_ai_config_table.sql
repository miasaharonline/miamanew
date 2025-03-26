-- Create AI configurations table if it doesn't exist
CREATE TABLE IF NOT EXISTS ai_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL DEFAULT 'gpt-4o',
  temperature FLOAT NOT NULL DEFAULT 0.7,
  max_tokens INTEGER NOT NULL DEFAULT 1000,
  response_delay INTEGER NOT NULL DEFAULT 2,
  show_typing_indicator BOOLEAN NOT NULL DEFAULT true,
  auto_pause_on_human BOOLEAN NOT NULL DEFAULT true,
  system_prompt TEXT,
  openai_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own AI configurations" ON ai_configurations;
CREATE POLICY "Users can view their own AI configurations"
  ON ai_configurations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI configurations" ON ai_configurations;
CREATE POLICY "Users can insert their own AI configurations"
  ON ai_configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI configurations" ON ai_configurations;
CREATE POLICY "Users can update their own AI configurations"
  ON ai_configurations FOR UPDATE
  USING (auth.uid() = user_id);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE ai_configurations;
