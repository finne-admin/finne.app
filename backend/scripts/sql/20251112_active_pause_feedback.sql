-- Add feedback columns to active_pauses for quick lookups
ALTER TABLE active_pauses
  ADD COLUMN IF NOT EXISTS satisfaction_level INTEGER,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
