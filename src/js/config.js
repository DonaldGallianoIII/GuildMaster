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
     * bst: Multiplier for BST relative to hero's BASE BST (hero BST = level × 100)
     * hp: HP multiplier for enemy survivability
     * gearScale: How much of hero's gear bonus applies to this tier (0 = none, 0.25 = 25%)
     */
    MOB_TIERS: {
        // Fodder Tiers - easy kills, swarm enemies
        fodder_trash: { bst: 0.75, hp: 0.90, label: 'Trash', gearScale: 0 },
        fodder: { bst: 0.85, hp: 1.00, label: 'Fodder', gearScale: 0 },
        fodder_exalted: { bst: 0.95, hp: 1.10, label: 'Fodder+', gearScale: 0 },

        // Standard Tiers - fair fights
        standard_weak: { bst: 1.05, hp: 1.20, label: 'Common-', gearScale: 0 },
        standard: { bst: 1.15, hp: 1.25, label: 'Common', gearScale: 0 },
        standard_exalted: { bst: 1.25, hp: 1.40, label: 'Common+', gearScale: 0 },

        // Elite Tiers - dangerous, mini-boss (scale with 10% of hero gear)
        elite: { bst: 1.45, hp: 1.70, label: 'Elite', gearScale: 0.10 },
        elite_exalted: { bst: 1.60, hp: 2.20, label: 'Elite+', gearScale: 0.10 },

        // Boss Tiers - major threats (scale with 25% of hero gear)
        boss: { bst: 2.10, hp: 3.20, label: 'Boss', gearScale: 0.25 },
        boss_legendary: { bst: 2.60, hp: 3.70, label: 'Legendary', gearScale: 0.25 },
    },

    /**
     * QUEST TAGS - Control encounter structure and reward focus
     */
    QUEST_TAGS: {
        SWARM: 'swarm',       // Many weak enemies, soul farming
        STANDARD: 'standard', // Mixed encounters, balanced
        HUNT: 'hunt',         // Single/few strong enemies, loot focus
    },

    /**
     * QUEST TAG DISPLAY
     */
    TAG_DISPLAY: {
        swarm: { icon: '🐀', label: 'SWARM', color: 'green' },
        standard: { icon: '📦', label: 'STANDARD', color: 'yellow' },
        hunt: { icon: '⚔️', label: 'HUNT', color: 'red' },
    },

    /**
     * QUEST CONFIG - Bracket × Tag definitions
     * enemies: total enemy count (or [min, max] range)
     * encounters: number of encounters (null = 1 enemy per encounter for swarm)
     * tiers: enemy tier pool to draw from
     */
    QUEST_BRACKETS: {
        novice: {
            name: 'Novice Contracts',
            swarm: { enemies: [3, 4], encounters: null, tiers: ['fodder_trash'] },
            standard: { enemies: 2, encounters: 2, tiers: ['fodder', 'fodder_exalted'] },
            hunt: { enemies: 1, encounters: 1, tiers: ['standard_weak'] },
        },
        apprentice: {
            name: 'Apprentice Contracts',
            swarm: { enemies: [4, 5], encounters: null, tiers: ['fodder'] },
            standard: { enemies: 2, encounters: 2, tiers: ['fodder_exalted', 'standard_weak'] },
            hunt: { enemies: 1, encounters: 1, tiers: ['standard'] },
        },
        journeyman: {
            name: 'Journeyman Contracts',
            swarm: { enemies: [4, 5], encounters: null, tiers: ['fodder_exalted'] },
            standard: { enemies: 2, encounters: 2, tiers: ['standard_weak', 'standard'] },
            hunt: { enemies: 1, encounters: 1, tiers: ['standard_exalted'] },
        },
        veteran: {
            name: 'Veteran Contracts',
            swarm: { enemies: 7, encounters: null, tiers: ['standard_weak'] },
            standard: { enemies: 3, encounters: 3, tiers: ['standard', 'standard_exalted'] },
            hunt: { enemies: 1, encounters: 1, tiers: ['elite'] },
        },
        expert: {
            name: 'Expert Contracts',
            swarm: { enemies: 10, encounters: null, tiers: ['standard_exalted'] },
            standard: { enemies: 5, encounters: 5, tiers: ['standard_exalted', 'elite'] },
            hunt: { enemies: 1, encounters: 1, tiers: ['elite_exalted'] },
        },
        master: {
            name: 'Master Contracts',
            swarm: { enemies: 12, encounters: null, tiers: ['elite'] },
            standard: { enemies: 6, encounters: 6, tiers: ['elite', 'elite_exalted'] },
            hunt: { enemies: 2, encounters: 1, tiers: ['boss'] },
        },
        legendary: {
            name: 'Legendary Contracts',
            swarm: { enemies: 15, encounters: null, tiers: ['elite_exalted'] },
            standard: { enemies: 8, encounters: 8, tiers: ['elite_exalted', 'boss'] },
            hunt: { enemies: 1, encounters: 1, tiers: ['boss_legendary'] },
        },
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

    // ==================== SOUL SYSTEM (Design Doc v2) ====================

    /**
     * SOUL DROPS - Guaranteed souls per kill, scaling by tier
     * Souls are the crafting currency for item modification
     */
    SOUL_DROPS: {
        // Base soul drops by tier
        fodder_trash: { min: 1, max: 2 },
        fodder: { min: 2, max: 4 },
        fodder_exalted: { min: 3, max: 6 },
        standard_weak: { min: 5, max: 8 },
        standard: { min: 7, max: 12 },
        standard_exalted: { min: 10, max: 15 },
        elite: { min: 15, max: 25 },
        elite_exalted: { min: 25, max: 40 },
        boss: { min: 50, max: 75 },
        boss_legendary: { min: 80, max: 100 },
    },

    /**
     * SOUL COSTS - Crafting costs (base values, escalate 1.5x per craft)
     */
    SOUL_COSTS: {
        // Add new affix (SLAM)
        SLAM_BASE: 100,

        // Reroll existing affixes
        REROLL_MAGIC: 25,      // Reroll magic item affixes
        REROLL_RARE: 60,       // Reroll rare item affixes

        // Level adjustment (±3 range from drop level)
        LEVEL_ADJUST: 10,

        // Escalation multiplier per craft on same item
        ESCALATION: 1.5,
    },

    // ==================== HUNGER SYSTEM (Design Doc v2) ====================

    /**
     * SOUL HUNGER - Items have a hunger value affecting affix slots and costs
     * Range: -0.70 (Replete) to +0.70 (Voracious)
     */
    HUNGER_SYSTEM: {
        // Hunger value ranges for labels
        RANGES: {
            REPLETE: { min: -0.70, max: -0.50 },      // Blank drops, 5/5 max slots
            NOURISHED: { min: -0.49, max: -0.25 },   // 4/4 max slots
            SATED: { min: -0.24, max: -0.05 },       // 3/3 max slots
            NEUTRAL: { min: -0.04, max: 0.04 },      // 3/3 max slots (default)
            HUNGRY: { min: 0.05, max: 0.24 },        // 3/3 max slots
            RAVENOUS: { min: 0.25, max: 0.49 },      // 2/2 max slots
            VORACIOUS: { min: 0.50, max: 0.70 },     // 2/2 max slots, 1.5x affix values
        },

        // Max affix slots (prefix/suffix) by hunger tier
        MAX_SLOTS: {
            REPLETE: { prefix: 5, suffix: 5 },
            NOURISHED: { prefix: 4, suffix: 4 },
            SATED: { prefix: 3, suffix: 3 },
            NEUTRAL: { prefix: 3, suffix: 3 },
            HUNGRY: { prefix: 3, suffix: 3 },
            RAVENOUS: { prefix: 2, suffix: 2 },
            VORACIOUS: { prefix: 2, suffix: 2 },
        },

        // Cost multipliers by hunger tier
        COST_MULTIPLIER: {
            REPLETE: 0.5,       // Cheap to craft
            NOURISHED: 0.75,
            SATED: 0.9,
            NEUTRAL: 1.0,
            HUNGRY: 1.1,
            RAVENOUS: 1.25,
            VORACIOUS: 1.5,     // Expensive to craft
        },

        // Special rules
        VORACIOUS_AFFIX_MULT: 1.5,  // Voracious items get 1.5x affix values
        REPLETE_DROPS_BLANK: true,   // Replete items always drop with no affixes

        // Roll distribution (weighted by rarity)
        ROLL_WEIGHTS: {
            common: { min: -0.20, max: 0.20 },   // Narrow range
            magic: { min: -0.35, max: 0.35 },    // Moderate range
            rare: { min: -0.50, max: 0.50 },     // Wide range
            unique: { min: -0.70, max: 0.70 },   // Full range
        },
    },

    /**
     * AFFIX SCALING - Affix values scale with item level
     * At item level N, hero has N * 100 BST
     * Single affix should be ~2-8% of that BST
     */
    AFFIX_SCALING: {
        // Percentage of hero BST per affix
        MIN_ROLL_FACTOR: 0.02,   // 2% of hero BST (min roll)
        MAX_ROLL_FACTOR: 0.08,   // 8% of hero BST (max roll)

        // Weighted roll distribution for affix tier
        TIER_WEIGHTS: {
            low: 50,    // 50% chance: bottom 25% of range
            mid: 30,    // 30% chance: 25-75% of range
            high: 15,   // 15% chance: 75-95% of range
            max: 5,     // 5% chance: top 5% of range
        },

        // Tier roll ranges (percentage of the min-max range)
        TIER_RANGES: {
            low: { min: 0.00, max: 0.25 },
            mid: { min: 0.25, max: 0.75 },
            high: { min: 0.75, max: 0.95 },
            max: { min: 0.95, max: 1.00 },
        },
    },

    /**
     * DEBUG MODE
     * Set via URL parameter: ?debug=false to disable
     * Default: true during development
     */
    DEBUG: (() => {
        // Check URL parameter to explicitly disable
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            return urlParams.get('debug') !== 'false';
        }
        // Default to true during development
        return true;
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
Object.freeze(CONFIG.QUEST_TAGS);
Object.freeze(CONFIG.TAG_DISPLAY);
Object.freeze(CONFIG.QUEST_BRACKETS);
Object.freeze(CONFIG.FREE_HIT);
Object.freeze(CONFIG.BETWEEN_PACKS);
Object.freeze(CONFIG.INHERITANCE);
Object.freeze(CONFIG.ALIGNMENT);
Object.freeze(CONFIG.SUMMONS);
Object.freeze(CONFIG.SELL_PRICES);
Object.freeze(CONFIG.UI);
Object.freeze(CONFIG.SOUL_DROPS);
Object.freeze(CONFIG.SOUL_COSTS);
Object.freeze(CONFIG.HUNGER_SYSTEM);
Object.freeze(CONFIG.HUNGER_SYSTEM.RANGES);
Object.freeze(CONFIG.HUNGER_SYSTEM.MAX_SLOTS);
Object.freeze(CONFIG.HUNGER_SYSTEM.COST_MULTIPLIER);
Object.freeze(CONFIG.HUNGER_SYSTEM.ROLL_WEIGHTS);
Object.freeze(CONFIG.AFFIX_SCALING);
Object.freeze(CONFIG.AFFIX_SCALING.TIER_WEIGHTS);
Object.freeze(CONFIG.AFFIX_SCALING.TIER_RANGES);
