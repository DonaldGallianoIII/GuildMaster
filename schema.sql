-- ============================================
-- GUILD MASTER - Supabase Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- to set up the database tables.
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PLAYERS TABLE
-- ============================================
-- Stores player profile and currency
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    gold INTEGER DEFAULT 500,
    alignment INTEGER DEFAULT 0,  -- -100 to +100 (evil to good)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HEROES TABLE
-- ============================================
-- Stores hero data
-- NOTE: Stats are allocated from BST (Level × 10)
CREATE TABLE IF NOT EXISTS heroes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES players(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    portrait_id INTEGER DEFAULT 1,

    -- Progression
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    skill_points INTEGER DEFAULT 0,

    -- Allocated stats (must total Level × 10)
    atk INTEGER DEFAULT 0,
    will INTEGER DEFAULT 0,
    def INTEGER DEFAULT 0,
    spd INTEGER DEFAULT 0,

    -- Current HP (NULL means full)
    current_hp INTEGER,

    -- State: available, quest, injured, retired, dead
    state TEXT DEFAULT 'available',
    current_quest_id UUID,

    -- Equipment slots (item IDs)
    equipment JSONB DEFAULT '{}',

    -- Summon configuration
    summon_loadout JSONB DEFAULT '[]',
    conjured_weapon_will INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retired_at TIMESTAMP WITH TIME ZONE,
    died_at TIMESTAMP WITH TIME ZONE
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_heroes_user_id ON heroes(user_id);
CREATE INDEX IF NOT EXISTS idx_heroes_state ON heroes(state);

-- ============================================
-- HERO SKILLS TABLE
-- ============================================
-- Skills attached to heroes (rolled at recruitment)
CREATE TABLE IF NOT EXISTS hero_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID REFERENCES heroes(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL,
    rank INTEGER DEFAULT 1,
    is_doubled BOOLEAN DEFAULT FALSE,
    is_tripled BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_hero_skills_hero ON hero_skills(hero_id);

-- ============================================
-- ITEMS TABLE
-- ============================================
-- Gear and equipment
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES players(id) ON DELETE CASCADE,
    hero_id UUID REFERENCES heroes(id) ON DELETE SET NULL,  -- NULL = in inventory

    -- Item properties
    slot TEXT NOT NULL,  -- weapon, helmet, chest, gloves, boots, amulet, ring1, ring2
    base_name TEXT NOT NULL,
    rarity TEXT DEFAULT 'common',  -- common, magic, rare, unique, heirloom
    item_level INTEGER DEFAULT 1,
    icon TEXT DEFAULT '📦',

    -- Stats
    base_stats JSONB DEFAULT '{}',
    affixes JSONB DEFAULT '[]',

    -- Heirloom properties
    is_heirloom BOOLEAN DEFAULT FALSE,
    generation INTEGER DEFAULT 0,
    heirloom_name TEXT,
    lineage TEXT[] DEFAULT '{}',
    souled_by TEXT,

    -- PvP inscriptions
    inscriptions JSONB DEFAULT '[]',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_user ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_hero ON items(hero_id);
CREATE INDEX IF NOT EXISTS idx_items_slot ON items(slot);

-- ============================================
-- QUESTS TABLE
-- ============================================
-- Active and completed quests
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES players(id) ON DELETE CASCADE,
    hero_id UUID REFERENCES heroes(id) ON DELETE SET NULL,
    template_id TEXT NOT NULL,

    -- Status: available, active, completed, failed
    status TEXT DEFAULT 'available',

    -- Timing
    started_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Progress
    current_encounter INTEGER DEFAULT 0,
    total_encounters INTEGER DEFAULT 0,

    -- Pre-generated event timeline (for peek system)
    events JSONB DEFAULT '[]',

    -- Results
    encounter_results JSONB DEFAULT '[]',
    loot JSONB DEFAULT '{"gold": 0, "items": [], "xp": 0}'
);

CREATE INDEX IF NOT EXISTS idx_quests_user ON quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_hero ON quests(hero_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);

-- ============================================
-- INSCRIPTIONS TABLE
-- ============================================
-- PvP kill records (separate table for querying)
CREATE TABLE IF NOT EXISTS inscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    victim_name TEXT NOT NULL,
    victim_guild TEXT,
    inscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inscriptions_item ON inscriptions(item_id);

-- ============================================
-- MARKET LISTINGS TABLE
-- ============================================
-- For async player trading (future feature)
CREATE TABLE IF NOT EXISTS market_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES players(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    listed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sold_at TIMESTAMP WITH TIME ZONE,
    buyer_id UUID REFERENCES players(id)
);

CREATE INDEX IF NOT EXISTS idx_market_seller ON market_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_market_item ON market_listings(item_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;

-- Players: users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON players
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON players
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON players
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Heroes: users can only see/edit their own heroes
CREATE POLICY "Users can view own heroes" ON heroes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own heroes" ON heroes
    FOR ALL USING (auth.uid() = user_id);

-- Hero skills: accessible through hero ownership
CREATE POLICY "Users can view own hero skills" ON hero_skills
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM heroes WHERE heroes.id = hero_skills.hero_id
            AND heroes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own hero skills" ON hero_skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM heroes WHERE heroes.id = hero_skills.hero_id
            AND heroes.user_id = auth.uid()
        )
    );

-- Items: users can see own items, or market listings
CREATE POLICY "Users can view own items" ON items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own items" ON items
    FOR ALL USING (auth.uid() = user_id);

-- Quests: users can see/edit own quests
CREATE POLICY "Users can view own quests" ON quests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own quests" ON quests
    FOR ALL USING (auth.uid() = user_id);

-- Inscriptions: viewable by item owner
CREATE POLICY "Users can view inscriptions on own items" ON inscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM items WHERE items.id = inscriptions.item_id
            AND items.user_id = auth.uid()
        )
    );

-- Market: anyone can view listings, only owner can manage
CREATE POLICY "Anyone can view market listings" ON market_listings
    FOR SELECT USING (true);

CREATE POLICY "Sellers can manage own listings" ON market_listings
    FOR ALL USING (auth.uid() = seller_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to players table
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================
-- Uncomment to add test data

-- INSERT INTO players (id, username, gold)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'TestPlayer', 1000);
