-- ============================================
-- MIGRATION: Add bracket/tier system to quests table
-- ============================================
-- Run this in Supabase SQL Editor if you have an existing database
-- ============================================

-- Add new columns for theme-based quest system
ALTER TABLE quests ADD COLUMN IF NOT EXISTS theme_id TEXT;
ALTER TABLE quests ADD COLUMN IF NOT EXISTS bracket TEXT;
ALTER TABLE quests ADD COLUMN IF NOT EXISTS tier INTEGER;
ALTER TABLE quests ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE quests ADD COLUMN IF NOT EXISTS selected_encounters JSONB DEFAULT '[]';
ALTER TABLE quests ADD COLUMN IF NOT EXISTS combat_results JSONB;

-- Make template_id nullable (new system uses theme_id)
ALTER TABLE quests ALTER COLUMN template_id DROP NOT NULL;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_quests_bracket ON quests(bracket);
CREATE INDEX IF NOT EXISTS idx_quests_expires ON quests(expires_at);

-- Optional: Clean up old available quests that don't have the new fields
-- DELETE FROM quests WHERE status = 'available' AND bracket IS NULL;
