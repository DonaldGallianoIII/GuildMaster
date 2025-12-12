/**
 * ============================================
 * GUILD MASTER - Configuration
 * ============================================
 * Game constants, Supabase keys, and settings
 * ============================================
 */

const CONFIG = {
    // ==================== SUPABASE ====================
    SUPABASE_URL: 'https://galeswmxpkdysrvbkinm.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbGVzd214cGtkeXNydmJraW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTU2NDIsImV4cCI6MjA4MDkzMTY0Mn0.2pSJpXmpqrz8QxaJtQFJz6G3qpS71ffPDK295C45BKg',

    // ==================== GAME BALANCE ====================

    /**
     * STAT SYSTEM (updated for balance - Design Doc v2)
     * BST = Level × 100
     * HP = DEF + (Level × 40)
     *
     * Physical Damage = ATK - (DEF × 0.5), min 3
     * Magical Damage = WILL - (target WILL × 0.5), min 3
     */
    STATS: {
        BST_PER_LEVEL: 100,
        HP_PER_LEVEL: 40,
        MIN_DAMAGE: 3,
    },

    /**
     * HERO SETTINGS
     */
    HERO: {
        STARTING_LEVEL: 1,
        MAX_LEVEL: 100,
        SKILL_COUNT: 3,
        XP_BASE: 100,
        XP_SCALING: 1.5,
    },

    /**
     * SKILL SETTINGS
     */
    SKILLS: {
        MAX_RANK_BASE: 5,
        MAX_RANK_DOUBLED: 10,
        MAX_RANK_TRIPLED: 15,
        POINTS_PER_LEVEL: 1,
    },

    /**
     * SKILL RARITY WEIGHTS
     */
    SKILL_RARITY_WEIGHTS: {
        common: 60,
        uncommon: 30,
        rare: 9,
        legendary: 1,
    },

    /**
     * GEAR RARITY WEIGHTS
     */
    GEAR_RARITY_WEIGHTS: {
        common: 60,
        magic: 30,
        rare: 8,
        unique: 2,
    },

    /**
     * RECRUITMENT
     */
    RECRUITMENT: {
        POOL_SIZE: 3,
        REFRESH_COST: 100,
        BASE_HIRE_COST: 200,
        SKILL_COST_MULTIPLIER: {
            common: 1,
            uncommon: 1.5,
            rare: 2.5,
            legendary: 5,
        },
    },

    /**
     * QUEST SETTINGS - Bracket/Tier System
     */
    QUESTS: {
        // Duration per bracket (ms)
        DURATION: {
            novice: 2 * 60 * 1000,       // 2 min
            journeyman: 5 * 60 * 1000,   // 5 min
            expert: 10 * 60 * 1000,      // 10 min
            // Legacy fallbacks
            easy: 2 * 60 * 1000,
            medium: 5 * 60 * 1000,
            hard: 10 * 60 * 1000,
        },
        // Expiration timer per bracket (how long quest stays on board)
        EXPIRATION: {
            novice: 24 * 60 * 60 * 1000,      // 24 hours
            journeyman: 24 * 60 * 60 * 1000,  // 24 hours
            expert: 24 * 60 * 60 * 1000,      // 24 hours
        },
        // Recommended level ranges per bracket
        LEVEL_RANGE: {
            novice: { min: 1, max: 3 },
            journeyman: { min: 4, max: 6 },
            expert: { min: 7, max: 99 },
        },
        // Base gold rewards per bracket (modified by tier)
        GOLD_REWARDS: {
            novice: { min: 30, max: 60 },
            journeyman: { min: 80, max: 150 },
            expert: { min: 200, max: 400 },
            // Legacy fallbacks
            easy: { min: 30, max: 60 },
            medium: { min: 80, max: 150 },
            hard: { min: 200, max: 400 },
        },
        // Base XP per bracket (modified by tier)
        XP_REWARDS: {
            novice: 15,
            journeyman: 50,
            expert: 120,
            // Legacy
            easy: 15,
            medium: 50,
            hard: 120,
        },
        // Tier multipliers for rewards
        TIER_MULTIPLIER: {
            1: 1.0,   // Tier I - base rewards
            2: 1.5,   // Tier II - 50% more
            3: 2.0,   // Tier III - double
        },
        // Number of encounters per tier
        ENCOUNTERS: {
            1: 2,  // Tier I - 2 encounters
            2: 3,  // Tier II - 3 encounters
            3: 4,  // Tier III - 4 encounters
            // Legacy
            easy: 2,
            medium: 3,
            hard: 4,
        },
    },

    /**
     * PER-ENEMY LOOT DROPS
     * Each mob killed rolls for loot based on tier
     */
    ENEMY_LOOT: {
        // Gold drop per mob tier
        GOLD: {
            fodder_trash: { min: 1, max: 3 },
            fodder: { min: 2, max: 5 },
            fodder_exalted: { min: 4, max: 8 },
            standard_weak: { min: 6, max: 12 },
            standard: { min: 8, max: 15 },
            standard_strong: { min: 12, max: 20 },
            elite_lesser: { min: 15, max: 30 },
            elite: { min: 25, max: 50 },
            elite_greater: { min: 40, max: 80 },
            boss_mini: { min: 50, max: 100 },
            boss: { min: 80, max: 150 },
            boss_lord: { min: 150, max: 300 },
        },
        // Gear drop chance per mob tier (0-1)
        GEAR_CHANCE: {
            fodder_trash: 0,
            fodder: 0.02,        // 2%
            fodder_exalted: 0.05, // 5%
            standard_weak: 0.08,
            standard: 0.12,      // 12%
            standard_strong: 0.18,
            elite_lesser: 0.25,
            elite: 0.35,         // 35%
            elite_greater: 0.50,
            boss_mini: 0.60,
            boss: 0.80,          // 80%
            boss_lord: 1.0,      // Guaranteed
        },
        // Gear rarity weights per mob tier
        GEAR_RARITY: {
            fodder: { common: 95, magic: 5, rare: 0, unique: 0 },
            fodder_exalted: { common: 80, magic: 18, rare: 2, unique: 0 },
            standard: { common: 60, magic: 35, rare: 5, unique: 0 },
            standard_strong: { common: 40, magic: 45, rare: 14, unique: 1 },
            elite: { common: 20, magic: 50, rare: 27, unique: 3 },
            elite_greater: { common: 10, magic: 40, rare: 42, unique: 8 },
            boss: { common: 0, magic: 30, rare: 55, unique: 15 },
            boss_lord: { common: 0, magic: 10, rare: 60, unique: 30 },
        },
    },

    /**
     * MOB TIER SYSTEM (Design Doc v2 - Dynamic scaling based on hero level)
     * Enemies are stat templates; tier determines BST multiplier
     * bstMult: Multiplier for BST relative to hero's BST (hero BST = level × 100)
     * hpMult: HP multiplier for enemy survivability
     */
    MOB_TIERS: {
        // Fodder Tiers - easy kills, swarm enemies
        fodder_trash: { bstMult: 0.60, hpMult: 0.6, label: 'Fodder Trash' },
        fodder: { bstMult: 0.70, hpMult: 0.7, label: 'Fodder' },
        fodder_exalted: { bstMult: 0.80, hpMult: 0.8, label: 'Fodder Exalted' },

        // Standard Tiers - fair fights
        standard_weak: { bstMult: 0.85, hpMult: 0.85, label: 'Standard Weak' },
        standard: { bstMult: 0.90, hpMult: 0.9, label: 'Standard' },
        standard_exalted: { bstMult: 1.00, hpMult: 1.0, label: 'Standard Exalted' },

        // Elite Tiers - dangerous, mini-boss
        elite: { bstMult: 1.20, hpMult: 1.2, label: 'Elite' },
        elite_exalted: { bstMult: 1.50, hpMult: 1.5, label: 'Elite Exalted' },

        // Boss Tiers - major threats
        boss: { bstMult: 2.00, hpMult: 2.0, label: 'Boss' },
        boss_legendary: { bstMult: 3.00, hpMult: 3.0, label: 'Legendary Boss' },
    },

    /**
     * FREE HIT SETTINGS (when enemy dies in duel, next enemy gets free attack)
     */
    FREE_HIT: {
        DAMAGE_MULT: 0.5,    // Free hit does 50% damage
        MIN_HP_REMAINING: 1, // Free hit can never kill (leaves at 1 HP minimum)
    },

    /**
     * BETWEEN PACKS (rest period between encounters)
     */
    BETWEEN_PACKS: {
        HEAL_PERCENT: 0.10,  // Heal 10% of max HP between packs
    },

    /**
     * INHERITANCE & RETIREMENT
     */
    INHERITANCE: {
        BONUS_PER_GENERATION: 0.25,
        MIN_LEVEL_TO_RETIRE: 10,
    },

    /**
     * ALIGNMENT
     */
    ALIGNMENT: {
        RETIRE_PEACEFUL: 5,
        SOUL_POWER: -15,
        DARK_QUEST: -3,
    },

    /**
     * SUMMONS
     */
    SUMMONS: {
        HP_PER_BST: 2,
    },

    /**
     * SELL PRICES (gold per item rarity)
     */
    SELL_PRICES: {
        common: 10,
        magic: 30,
        rare: 100,
        unique: 300,
        heirloom: 500,
    },

    /**
     * UI SETTINGS
     */
    UI: {
        TOAST_DURATION: 3000,
        PEEK_UPDATE_INTERVAL: 1000,
        ANIMATION_SPEED: 250,
    },

    /**
     * DEBUG MODE
     * Set via URL parameter: ?debug=true
     * Or check for localhost/development environment
     */
    DEBUG: (() => {
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            return urlParams.get('debug') === 'true';
        }
        // Default to true for localhost, false for production
        return window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1';
    })(),
};

// Freeze config to prevent accidental modification
Object.freeze(CONFIG);
Object.freeze(CONFIG.STATS);
Object.freeze(CONFIG.HERO);
Object.freeze(CONFIG.SKILLS);
Object.freeze(CONFIG.SKILL_RARITY_WEIGHTS);
Object.freeze(CONFIG.GEAR_RARITY_WEIGHTS);
Object.freeze(CONFIG.RECRUITMENT);
Object.freeze(CONFIG.QUESTS);
Object.freeze(CONFIG.QUESTS.DURATION);
Object.freeze(CONFIG.QUESTS.EXPIRATION);
Object.freeze(CONFIG.QUESTS.LEVEL_RANGE);
Object.freeze(CONFIG.QUESTS.GOLD_REWARDS);
Object.freeze(CONFIG.QUESTS.XP_REWARDS);
Object.freeze(CONFIG.QUESTS.TIER_MULTIPLIER);
Object.freeze(CONFIG.QUESTS.ENCOUNTERS);
Object.freeze(CONFIG.ENEMY_LOOT);
Object.freeze(CONFIG.ENEMY_LOOT.GOLD);
Object.freeze(CONFIG.ENEMY_LOOT.GEAR_CHANCE);
Object.freeze(CONFIG.ENEMY_LOOT.GEAR_RARITY);
Object.freeze(CONFIG.MOB_TIERS);
Object.freeze(CONFIG.FREE_HIT);
Object.freeze(CONFIG.BETWEEN_PACKS);
Object.freeze(CONFIG.INHERITANCE);
Object.freeze(CONFIG.ALIGNMENT);
Object.freeze(CONFIG.SUMMONS);
Object.freeze(CONFIG.SELL_PRICES);
Object.freeze(CONFIG.UI);
