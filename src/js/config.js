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
     * STAT SYSTEM (from design doc update)
     * BST = Level × 10
     * HP = (Level × 20) + DEF
     *
     * Physical Damage = ATK² ÷ (ATK + target DEF)
     * Magical Damage = WILL² ÷ (WILL + target WILL ÷ 2)
     */
    STATS: {
        BST_PER_LEVEL: 10,
        HP_PER_LEVEL: 20,
        MIN_DAMAGE: 1,
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
     * QUEST SETTINGS
     */
    QUESTS: {
        DURATION: {
            easy: 2 * 60 * 1000,
            medium: 8 * 60 * 1000,
            hard: 20 * 60 * 1000,
        },
        GOLD_REWARDS: {
            easy: { min: 50, max: 100 },
            medium: { min: 150, max: 300 },
            hard: { min: 400, max: 800 },
        },
        XP_REWARDS: {
            easy: 25,
            medium: 75,
            hard: 200,
        },
        ENCOUNTERS: {
            easy: 4,
            medium: 6,
            hard: 10,
        },
    },

    /**
     * MOB TIER MODIFIERS
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
     * UI SETTINGS
     */
    UI: {
        TOAST_DURATION: 3000,
        PEEK_UPDATE_INTERVAL: 1000,
        ANIMATION_SPEED: 250,
    },

    /**
     * DEBUG MODE
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
