-- ============================================
-- Migration 003: Add missing columns
-- ============================================
-- Adds columns used in code but missing from original schema

-- Add last_heal_tick to heroes table for passive healing tracking
ALTER TABLE heroes
ADD COLUMN IF NOT EXISTS last_heal_tick TIMESTAMP WITH TIME ZONE;

-- Add skills JSONB column to heroes for embedded skill storage
-- (alternative to hero_skills join table for simpler queries)
ALTER TABLE heroes
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]';

-- Add is_locked to items table for inventory locking feature
ALTER TABLE items
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

-- Create index for locked items queries
CREATE INDEX IF NOT EXISTS idx_items_locked ON items(user_id, is_locked) WHERE is_locked = TRUE;
