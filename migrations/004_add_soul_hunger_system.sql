-- ============================================
-- Migration 004: Add Soul & Hunger System (Design Doc v2)
-- ============================================
-- Adds columns for soul economy and item hunger system
-- Run this AFTER migrations 001-003

-- ============================================
-- PLAYERS TABLE - Add souls currency
-- ============================================
-- Soul currency used for crafting at the Soul Forge
ALTER TABLE players
ADD COLUMN IF NOT EXISTS souls INTEGER DEFAULT 0;

-- Add constraint to prevent negative souls
ALTER TABLE players
ADD CONSTRAINT players_souls_non_negative CHECK (souls >= 0);

-- ============================================
-- ITEMS TABLE - Add hunger and craft tracking
-- ============================================
-- Hunger value: -0.70 (Replete) to +0.70 (Voracious)
-- Affects affix slot limits and crafting costs
ALTER TABLE items
ADD COLUMN IF NOT EXISTS hunger NUMERIC(4,2) DEFAULT 0;

-- Craft count: tracks crafts for cost escalation (1.5x per craft)
ALTER TABLE items
ADD COLUMN IF NOT EXISTS craft_count INTEGER DEFAULT 0;

-- Add constraints
ALTER TABLE items
ADD CONSTRAINT items_hunger_range CHECK (hunger >= -0.70 AND hunger <= 0.70);

ALTER TABLE items
ADD CONSTRAINT items_craft_count_non_negative CHECK (craft_count >= 0);

-- ============================================
-- INDEXES for performance
-- ============================================
-- Index for finding items by hunger (e.g., "show me all Voracious items")
CREATE INDEX IF NOT EXISTS idx_items_hunger ON items(hunger);

-- ============================================
-- UPDATE EXISTING DATA (migrate existing items)
-- ============================================
-- Set hunger to 0 (Neutral) for any existing items that may have NULL
UPDATE items SET hunger = 0 WHERE hunger IS NULL;
UPDATE items SET craft_count = 0 WHERE craft_count IS NULL;

-- Set souls to 0 for any existing players that may have NULL
UPDATE players SET souls = 0 WHERE souls IS NULL;

-- ============================================
-- VERIFICATION QUERIES (optional - run manually to verify)
-- ============================================
-- SELECT COUNT(*) FROM players WHERE souls IS NOT NULL;
-- SELECT COUNT(*) FROM items WHERE hunger IS NOT NULL;
-- SELECT MIN(hunger), MAX(hunger), AVG(hunger) FROM items;
