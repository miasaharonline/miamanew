-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id TEXT NOT NULL,
  message_id TEXT NOT NULL UNIQUE,
  from_number TEXT NOT NULL,
  body TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  is_from_me BOOLEAN NOT NULL DEFAULT FALSE,
  media_type TEXT,
  chat_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create whatsapp_accounts table
CREATE TABLE IF NOT EXISTS whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT,
  account_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_connected TIMESTAMPTZ
);

-- Create ai_configurations table
CREATE TABLE IF NOT EXISTS ai_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL DEFAULT 'gpt-4o',
  temperature FLOAT NOT NULL DEFAULT 0.7,
  max_tokens INTEGER NOT NULL DEFAULT 1000,
  response_delay INTEGER NOT NULL DEFAULT 2,
  show_typing_indicator BOOLEAN NOT NULL DEFAULT TRUE,
  auto_pause_on_human BOOLEAN NOT NULL DEFAULT TRUE,
  system_prompt TEXT NOT NULL DEFAULT 'You are a helpful WhatsApp assistant that responds to user queries in a friendly, concise manner.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create conversation_stats table
CREATE TABLE IF NOT EXISTS conversation_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_conversations INTEGER NOT NULL DEFAULT 0,
  messages_processed INTEGER NOT NULL DEFAULT 0,
  voice_notes_transcribed INTEGER NOT NULL DEFAULT 0,
  events_created INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (chat_id IN (
    SELECT phone_number FROM whatsapp_accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own WhatsApp accounts"
  ON whatsapp_accounts FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own AI configurations"
  ON ai_configurations FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own conversation stats"
  ON conversation_stats FOR SELECT
  USING (user_id = auth.uid());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_accounts;
