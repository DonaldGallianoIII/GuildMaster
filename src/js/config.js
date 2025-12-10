/**
 * ============================================
 * GUILD MASTER - Configuration
 * ============================================
 * Game constants, Supabase keys, and settings
 *
 * NOTE: Replace Supabase credentials with your own
 * before deploying. Never commit real keys!
 * ============================================
 */

const CONFIG = {
    // ==================== SUPABASE ====================
    // TODO: Replace with your Supabase project credentials
    SUPABASE_URL: 'https://galeswmxpkdysrvbkinm.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbGVzd214cGtkeXNydmJraW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTU2NDIsImV4cCI6MjA4MDkzMTY0Mn0.2pSJpXmpqrz8QxaJtQFJz6G3qpS71ffPDK295C45BKg',

    // ==================== GAME BALANCE ====================

    /**
     * STAT SYSTEM (from design doc update)
     * BST = Level × 10
     * HP = (Level × 20) + DEF
     *
     * Physical Damage = ATK² ÷ (ATK + target DEF)
     * Magical Damage = WILL² ÷ (WILL + target WILL ÷ 2)
     */
    STATS: {
        BST_PER_LEVEL: 10,       // Base Stat Total points per level
        HP_PER_LEVEL: 20,        // Base HP per level (before DEF bonus)
        MIN_DAMAGE: 1,           // Minimum damage per hit
    },

    /**
     * HERO SETTINGS
     */
    HERO: {
        STARTING_LEVEL: 1,
        MAX_LEVEL: 100,          // TBD - may remove cap
        SKILL_COUNT: 3,          // Skills per hero at recruitment
        XP_BASE: 100,            // XP needed for level 2
        XP_SCALING: 1.5,         // XP multiplier per level
    },

    /**
     * SKILL SETTINGS
     */
    SKILLS: {
        MAX_RANK_BASE: 5,        // Normal skill max rank
        MAX_RANK_DOUBLED: 10,    // Doubled skill max rank
        MAX_RANK_TRIPLED: 15,    // Tripled skill max rank
        POINTS_PER_LEVEL: 1,     // Skill points gained per level
    },

    /**
     * SKILL RARITY WEIGHTS
     * Used when rolling skills for new recruits
     */
    SKILL_RARITY_WEIGHTS: {
        common: 60,
        uncommon: 30,
        rare: 9,
        legendary: 1,
    },

    /**
     * GEAR RARITY WEIGHTS
     * Used when generating loot drops
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
        POOL_SIZE: 3,            // Recruits visible at once
        REFRESH_COST: 100,       // Gold to scout new recruits
        BASE_HIRE_COST: 200,     // Base cost to hire (modified by skills)
        SKILL_COST_MULTIPLIER: {
            common: 1,
            uncommon: 1.5,
            rare: 2.5,
            legendary: 5,
        },
    },

    /**
     * QUEST SETTINGS
     */
    QUESTS: {
        // Duration in milliseconds
        DURATION: {
            easy: 2 * 60 * 1000,      // 2 minutes
            medium: 8 * 60 * 1000,    // 8 minutes
            hard: 20 * 60 * 1000,     // 20 minutes
        },
        // Gold rewards (base, random range added)
        GOLD_REWARDS: {
            easy: { min: 50, max: 100 },
            medium: { min: 150, max: 300 },
            hard: { min: 400, max: 800 },
        },
        // XP rewards
        XP_REWARDS: {
            easy: 25,
            medium: 75,
            hard: 200,
        },
        // Encounter count per difficulty
        ENCOUNTERS: {
            easy: 4,
            medium: 6,
            hard: 10,
        },
    },

    /**
     * MOB TIER MODIFIERS
     * Multipliers applied to base mob stats
     */
    MOB_TIERS: {
        normal: { statMult: 1.0, label: 'Normal' },
        magic: { statMult: 1.5, label: 'Enhanced' },
        rare: { statMult: 2.0, label: 'Elite' },
        boss: { statMult: 3.0, label: 'Boss' },
    },

    /**
     * INHERITANCE & RETIREMENT
     */
    INHERITANCE: {
        BONUS_PER_GENERATION: 0.25,  // 25% stat boost per generation
        MIN_LEVEL_TO_RETIRE: 10,     // Level required to retire
    },

    /**
     * ALIGNMENT
     */
    ALIGNMENT: {
        RETIRE_PEACEFUL: 5,      // Good points for peaceful retirement
        SOUL_POWER: -15,         // Evil points for soul powering
        DARK_QUEST: -3,          // Evil points for dark quests
    },

    /**
     * SUMMONS (from stat system update)
     * WILL determines max BST for active summons
     */
    SUMMONS: {
        HP_PER_BST: 2,           // Summon HP = (BST × 2) + DEF
    },

    /**
     * UI SETTINGS
     */
    UI: {
        TOAST_DURATION: 3000,    // Toast notification duration (ms)
        PEEK_UPDATE_INTERVAL: 1000,  // How often to update peek display
        ANIMATION_SPEED: 250,    // Default animation duration (ms)
    },

    /**
     * DEBUG MODE
     * Set to false in production
     */
    DEBUG: true,
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
Object.freeze(CONFIG.QUESTS.GOLD_REWARDS);
Object.freeze(CONFIG.QUESTS.XP_REWARDS);
Object.freeze(CONFIG.QUESTS.ENCOUNTERS);
Object.freeze(CONFIG.MOB_TIERS);
Object.freeze(CONFIG.INHERITANCE);
Object.freeze(CONFIG.ALIGNMENT);
Object.freeze(CONFIG.SUMMONS);
Object.freeze(CONFIG.UI);
