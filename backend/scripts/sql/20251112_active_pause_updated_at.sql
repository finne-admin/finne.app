-- Ensure active_pauses has an updated_at column for audit purposes
  ALTER TABLE active_pauses
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
