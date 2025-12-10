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
     * STAT SYSTEM (updated for balance)
     * BST = Level × 20
     * HP = (Level × 40) + DEF
     *
     * Physical Damage = ATK² ÷ (ATK + target DEF)
     * Magical Damage = WILL² ÷ (WILL + target WILL ÷ 2)
     */
    STATS: {
        BST_PER_LEVEL: 20,
        HP_PER_LEVEL: 40,
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
     * MOB TIER SYSTEM (Dynamic scaling based on hero level)
     * levelOffset: How many levels above/below the hero
     * bstMult: Multiplier for BST relative to hero's BST
     * hpMult: HP multiplier (mobs use lower HP formula)
     */
    MOB_TIERS: {
        // Fodder Tiers - easy kills, swarm enemies
        fodder_trash: { levelOffset: -3, bstMult: 0.35, hpMult: 0.5, label: 'Fodder Trash' },
        fodder: { levelOffset: -2, bstMult: 0.5, hpMult: 0.6, label: 'Fodder' },
        fodder_exalted: { levelOffset: -1, bstMult: 0.6, hpMult: 0.7, label: 'Fodder Exalted' },

        // Standard Tiers - fair fights
        standard_weak: { levelOffset: 0, bstMult: 0.7, hpMult: 0.8, label: 'Standard Weak' },
        standard: { levelOffset: 1, bstMult: 0.85, hpMult: 0.9, label: 'Standard' },
        standard_exalted: { levelOffset: 2, bstMult: 1.0, hpMult: 1.0, label: 'Standard Exalted' },

        // Elite Tiers - dangerous, mini-boss
        elite: { levelOffset: 4, bstMult: 1.2, hpMult: 1.2, label: 'Elite' },
        elite_exalted: { levelOffset: 6, bstMult: 1.5, hpMult: 1.5, label: 'Elite Exalted' },

        // Boss Tiers - major threats
        boss: { levelOffset: 10, bstMult: 2.0, hpMult: 2.0, label: 'Boss' },
        boss_legendary: { levelOffset: 15, bstMult: 3.0, hpMult: 3.0, label: 'Legendary Boss' },
    },

    /**
     * FREE HIT SETTINGS (when enemy dies in duel, next enemy gets free attack)
     */
    FREE_HIT: {
        DAMAGE_MULT: 0.5,    // Free hit does 50% damage
        MIN_HP_REMAINING: 1, // Free hit can never kill (leaves at 1 HP minimum)
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
Object.freeze(CONFIG.FREE_HIT);
Object.freeze(CONFIG.INHERITANCE);
Object.freeze(CONFIG.ALIGNMENT);
Object.freeze(CONFIG.SUMMONS);
Object.freeze(CONFIG.UI);
