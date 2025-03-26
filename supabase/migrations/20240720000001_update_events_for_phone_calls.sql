-- Add new fields to events table for phone calls
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS call_notes TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS call_type TEXT DEFAULT 'phone_call';

-- Enable realtime for events table (only if not already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'events'
  ) THEN
    alter publication supabase_realtime add table events;
  END IF;
END
$$;
