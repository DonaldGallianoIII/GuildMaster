/**
 * ============================================
 * GUILD MASTER - Quest Model & Definitions
 * ============================================
 * Quests are timed missions heroes can be sent on.
 *
 * QUEST STRUCTURE:
 * - Duration (2-20+ minutes)
 * - Series of encounters (rooms)
 * - Each encounter has mobs to fight
 * - Combat sim runs for each encounter
 * - Loot generated on completion
 *
 * QUEST TYPES:
 * - Overworld: Themed locations with consistent enemies
 * - Rifts: Endgame random content (future)
 * ============================================
 */

/**
 * Quest difficulty levels
 * @readonly
 * @enum {string}
 */
const QuestDifficulty = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
};

/**
 * Quest status
 * @readonly
 * @enum {string}
 */
const QuestStatus = {
    AVAILABLE: 'available',    // On quest board
    ACTIVE: 'active',          // Hero deployed
    COMPLETED: 'completed',    // Successfully finished
    FAILED: 'failed',          // Hero died or retreated
};

Object.freeze(QuestDifficulty);
Object.freeze(QuestStatus);

/**
 * ============================================
 * MOB DEFINITIONS
 * ============================================
 * Enemies have level-based stats similar to heroes
 * Their BST = Level × 10, distributed across stats
 * ============================================
 */
const MOB_DEFINITIONS = {
    // ==================== EASY MOBS ====================
    goblin: {
        id: 'goblin',
        name: 'Goblin',
        level: 1,
        // Stat distribution (out of 10 BST for level 1)
        stats: { atk: 4, will: 0, def: 2, spd: 4 },
        icon: '👺',
        skills: ['strike'],
        tier: 'normal',
    },
    goblin_brute: {
        id: 'goblin_brute',
        name: 'Goblin Brute',
        level: 2,
        stats: { atk: 8, will: 0, def: 8, spd: 4 }, // 20 BST for level 2
        icon: '👹',
        skills: ['strike', 'bash'],
        tier: 'rare',
    },
    wolf: {
        id: 'wolf',
        name: 'Wolf',
        level: 1,
        stats: { atk: 5, will: 0, def: 1, spd: 4 },
        icon: '🐺',
        skills: ['strike'],
        tier: 'normal',
    },
    alpha_wolf: {
        id: 'alpha_wolf',
        name: 'Alpha Wolf',
        level: 3,
        stats: { atk: 12, will: 0, def: 6, spd: 12 },
        icon: '🐕',
        skills: ['strike', 'frenzy'],
        tier: 'rare',
    },

    // ==================== MEDIUM MOBS ====================
    bandit: {
        id: 'bandit',
        name: 'Bandit',
        level: 3,
        stats: { atk: 12, will: 0, def: 8, spd: 10 },
        icon: '🥷',
        skills: ['strike', 'backstab'],
        tier: 'normal',
    },
    bandit_chief: {
        id: 'bandit_chief',
        name: 'Bandit Chief',
        level: 5,
        stats: { atk: 20, will: 5, def: 15, spd: 10 },
        icon: '🦹',
        skills: ['strike', 'cleave', 'second_wind'],
        tier: 'boss',
    },
    skeleton: {
        id: 'skeleton',
        name: 'Skeleton',
        level: 4,
        stats: { atk: 15, will: 5, def: 15, spd: 5 },
        icon: '💀',
        skills: ['strike'],
        tier: 'normal',
    },
    skeleton_mage: {
        id: 'skeleton_mage',
        name: 'Skeleton Mage',
        level: 4,
        stats: { atk: 5, will: 20, def: 10, spd: 5 },
        icon: '🧙',
        skills: ['spark', 'fireball'],
        tier: 'magic',
    },
    cave_spider: {
        id: 'cave_spider',
        name: 'Cave Spider',
        level: 3,
        stats: { atk: 10, will: 0, def: 5, spd: 15 },
        icon: '🕷️',
        skills: ['strike'],
        tier: 'normal',
    },

    // ==================== HARD MOBS ====================
    wraith: {
        id: 'wraith',
        name: 'Wraith',
        level: 6,
        stats: { atk: 10, will: 30, def: 10, spd: 10 },
        icon: '👻',
        skills: ['soul_rend', 'mana_shield'],
        tier: 'magic',
    },
    treant: {
        id: 'treant',
        name: 'Treant',
        level: 7,
        stats: { atk: 25, will: 10, def: 30, spd: 5 },
        icon: '🌳',
        skills: ['bash', 'thorns', 'block'],
        tier: 'rare',
    },
    drake: {
        id: 'drake',
        name: 'Drake',
        level: 8,
        stats: { atk: 30, will: 20, def: 20, spd: 10 },
        icon: '🐲',
        skills: ['cleave', 'fireball'],
        tier: 'magic',
    },
    dragon: {
        id: 'dragon',
        name: 'Ancient Dragon',
        level: 10,
        stats: { atk: 40, will: 30, def: 20, spd: 10 },
        icon: '🐉',
        skills: ['cleave', 'meteor', 'frenzy'],
        tier: 'boss',
    },
};

Object.freeze(MOB_DEFINITIONS);

/**
 * ============================================
 * QUEST TEMPLATES
 * ============================================
 * Pre-defined quest locations with themed encounters
 * ============================================
 */
const QUEST_TEMPLATES = {
    // ==================== EASY ====================
    goblin_warren: {
        id: 'goblin_warren',
        name: 'Goblin Warren',
        description: 'A network of tunnels infested with goblins.',
        difficulty: QuestDifficulty.EASY,
        duration: CONFIG.QUESTS.DURATION.easy,
        icon: '🕳️',
        encounters: [
            { mobs: ['goblin', 'goblin', 'goblin'] },
            { mobs: ['goblin', 'goblin', 'goblin'] },
            { mobs: ['goblin', 'goblin', 'goblin'] },
            { mobs: ['goblin_brute'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.easy,
            xp: CONFIG.QUESTS.XP_REWARDS.easy,
        },
    },

    wolf_den: {
        id: 'wolf_den',
        name: 'Wolf Den',
        description: 'A cave where a wolf pack has made its home.',
        difficulty: QuestDifficulty.EASY,
        duration: CONFIG.QUESTS.DURATION.easy,
        icon: '🐺',
        encounters: [
            { mobs: ['wolf', 'wolf'] },
            { mobs: ['wolf', 'wolf', 'wolf'] },
            { mobs: ['wolf', 'wolf'] },
            { mobs: ['alpha_wolf'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.easy,
            xp: CONFIG.QUESTS.XP_REWARDS.easy,
        },
    },

    // ==================== MEDIUM ====================
    bandit_camp: {
        id: 'bandit_camp',
        name: 'Bandit Camp',
        description: 'Outlaws have set up camp in the forest.',
        difficulty: QuestDifficulty.MEDIUM,
        duration: CONFIG.QUESTS.DURATION.medium,
        icon: '⛺',
        encounters: [
            { mobs: ['bandit', 'bandit'] },
            { mobs: ['bandit', 'bandit', 'bandit'] },
            { mobs: ['bandit', 'bandit'] },
            { mobs: ['bandit', 'bandit', 'bandit'] },
            { mobs: ['bandit', 'bandit'] },
            { mobs: ['bandit_chief'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.medium,
            xp: CONFIG.QUESTS.XP_REWARDS.medium,
        },
    },

    abandoned_mine: {
        id: 'abandoned_mine',
        name: 'Abandoned Mine',
        description: 'Undead and spiders lurk in the darkness.',
        difficulty: QuestDifficulty.MEDIUM,
        duration: CONFIG.QUESTS.DURATION.medium,
        icon: '⛏️',
        encounters: [
            { mobs: ['skeleton', 'skeleton'] },
            { mobs: ['cave_spider', 'cave_spider', 'cave_spider'] },
            { mobs: ['skeleton', 'skeleton_mage'] },
            { mobs: ['cave_spider', 'cave_spider'] },
            { mobs: ['skeleton', 'skeleton', 'skeleton_mage'] },
            { mobs: ['skeleton_mage', 'skeleton_mage'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.medium,
            xp: CONFIG.QUESTS.XP_REWARDS.medium,
        },
    },

    // ==================== HARD ====================
    cursed_forest: {
        id: 'cursed_forest',
        name: 'Cursed Forest',
        description: 'Dark magic has twisted these woods.',
        difficulty: QuestDifficulty.HARD,
        duration: CONFIG.QUESTS.DURATION.hard,
        icon: '🌲',
        encounters: [
            { mobs: ['wraith', 'wraith'] },
            { mobs: ['treant'] },
            { mobs: ['wraith', 'wraith', 'wraith'] },
            { mobs: ['treant', 'wraith'] },
            { mobs: ['wraith', 'wraith'] },
            { mobs: ['treant', 'treant'] },
            { mobs: ['wraith', 'wraith', 'wraith'] },
            { mobs: ['treant'] },
            { mobs: ['wraith', 'treant', 'wraith'] },
            { mobs: ['treant', 'treant', 'wraith'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.hard,
            xp: CONFIG.QUESTS.XP_REWARDS.hard,
        },
    },

    dragons_hollow: {
        id: 'dragons_hollow',
        name: "Dragon's Hollow",
        description: 'The lair of an ancient dragon.',
        difficulty: QuestDifficulty.HARD,
        duration: CONFIG.QUESTS.DURATION.hard,
        icon: '🏔️',
        encounters: [
            { mobs: ['drake', 'drake'] },
            { mobs: ['drake', 'drake', 'drake'] },
            { mobs: ['drake', 'drake'] },
            { mobs: ['drake', 'drake', 'drake'] },
            { mobs: ['drake', 'drake'] },
            { mobs: ['drake', 'drake', 'drake'] },
            { mobs: ['drake', 'drake', 'drake'] },
            { mobs: ['drake', 'drake'] },
            { mobs: ['drake', 'drake', 'drake'] },
            { mobs: ['dragon'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.hard,
            xp: CONFIG.QUESTS.XP_REWARDS.hard,
        },
    },
};

Object.freeze(QUEST_TEMPLATES);

/**
 * Quest class
 * Represents an active or completed quest instance
 */
class Quest {
    constructor(data = {}) {
        // Identity
        this.id = data.id || Utils.uuid();
        this.templateId = data.templateId || data.template_id || null;
        this.heroId = data.heroId || data.hero_id || null;
        this.userId = data.userId || data.user_id || null;

        // Status
        this.status = data.status || QuestStatus.AVAILABLE;

        // Timing
        this.startedAt = data.startedAt || data.started_at || null;
        this.endsAt = data.endsAt || data.ends_at || null;
        this.completedAt = data.completedAt || data.completed_at || null;

        // Progress tracking
        this.currentEncounter = data.currentEncounter || data.current_encounter || 0;
        this.totalEncounters = data.totalEncounters || data.total_encounters || 0;

        // Pre-generated timeline of events (for peek system)
        // Array of { time, type, data }
        this.events = data.events || [];

        // Combat results (filled in as encounters complete)
        this.encounterResults = data.encounterResults || data.encounter_results || [];

        // Loot collected
        this.loot = data.loot || {
            gold: 0,
            items: [],
            xp: 0,
        };
    }

    // ==================== COMPUTED PROPERTIES ====================

    /**
     * Get quest template
     */
    get template() {
        return QUEST_TEMPLATES[this.templateId] || null;
    }

    /**
     * Get quest name
     */
    get name() {
        return this.template?.name || 'Unknown Quest';
    }

    /**
     * Get quest difficulty
     */
    get difficulty() {
        return this.template?.difficulty || QuestDifficulty.EASY;
    }

    /**
     * Get total duration in ms
     */
    get duration() {
        return this.template?.duration || CONFIG.QUESTS.DURATION.easy;
    }

    /**
     * Get time remaining in ms
     */
    get timeRemaining() {
        if (!this.endsAt) return 0;
        const remaining = new Date(this.endsAt).getTime() - Date.now();
        return Math.max(0, remaining);
    }

    /**
     * Get progress percentage (0-100)
     */
    get progressPercent() {
        if (!this.startedAt || !this.endsAt) return 0;
        const total = new Date(this.endsAt) - new Date(this.startedAt);
        const elapsed = Date.now() - new Date(this.startedAt);
        return Utils.clamp((elapsed / total) * 100, 0, 100);
    }

    /**
     * Check if quest is complete (time-wise)
     */
    get isTimeComplete() {
        return this.timeRemaining <= 0;
    }

    /**
     * Check if quest is active
     */
    get isActive() {
        return this.status === QuestStatus.ACTIVE;
    }

    /**
     * Get encounters from template
     */
    get encounters() {
        return this.template?.encounters || [];
    }

    // ==================== METHODS ====================

    /**
     * Start the quest with a hero
     * @param {string} heroId
     */
    start(heroId) {
        this.heroId = heroId;
        this.status = QuestStatus.ACTIVE;
        this.startedAt = Utils.now();
        this.endsAt = new Date(Date.now() + this.duration).toISOString();
        this.currentEncounter = 0;
        this.totalEncounters = this.encounters.length;

        // Generate event timeline for peek system
        this.generateEvents();

        Utils.log(`Quest started: ${this.name}`);
    }

    /**
     * Generate timeline of events for peek system
     * Events are pre-calculated so they can be revealed over time
     */
    generateEvents() {
        const events = [];
        const encounterDuration = this.duration / this.totalEncounters;

        for (let i = 0; i < this.totalEncounters; i++) {
            const encounterStart = i * encounterDuration;
            const encounter = this.encounters[i];

            // Encounter start event
            events.push({
                time: encounterStart,
                type: 'encounter_start',
                data: {
                    encounterIndex: i,
                    mobs: encounter.mobs.map(mobId => MOB_DEFINITIONS[mobId]?.name || mobId),
                },
            });

            // Combat events (distributed within encounter)
            const combatEvents = Math.min(encounter.mobs.length, 3);
            for (let j = 0; j < combatEvents; j++) {
                events.push({
                    time: encounterStart + (encounterDuration * (j + 1)) / (combatEvents + 1),
                    type: Math.random() < 0.7 ? 'combat' : 'damage_taken',
                    data: {
                        encounterIndex: i,
                        mobIndex: j,
                    },
                });
            }

            // Encounter end / loot event
            events.push({
                time: encounterStart + encounterDuration - 100,
                type: 'encounter_end',
                data: {
                    encounterIndex: i,
                    loot: Math.random() < 0.3, // 30% chance of loot indicator
                },
            });
        }

        // Quest complete event
        events.push({
            time: this.duration,
            type: 'quest_complete',
            data: {},
        });

        this.events = events.sort((a, b) => a.time - b.time);
    }

    /**
     * Get current event based on elapsed time
     */
    getCurrentEvents() {
        if (!this.startedAt) return [];

        const elapsed = Date.now() - new Date(this.startedAt).getTime();
        return this.events.filter(e => e.time <= elapsed);
    }

    /**
     * Get the most recent event
     */
    getLatestEvent() {
        const current = this.getCurrentEvents();
        return current[current.length - 1] || null;
    },

    /**
     * Complete the quest successfully
     * @param {Object} results - Combat results and loot
     */
    complete(results = {}) {
        this.status = QuestStatus.COMPLETED;
        this.completedAt = Utils.now();
        this.loot = results.loot || this.loot;
        this.encounterResults = results.encounterResults || this.encounterResults;
    }

    /**
     * Fail the quest (hero died)
     */
    fail() {
        this.status = QuestStatus.FAILED;
        this.completedAt = Utils.now();
    }

    /**
     * Convert to database format
     */
    toDatabase() {
        return {
            id: this.id,
            template_id: this.templateId,
            hero_id: this.heroId,
            user_id: this.userId,
            status: this.status,
            started_at: this.startedAt,
            ends_at: this.endsAt,
            completed_at: this.completedAt,
            current_encounter: this.currentEncounter,
            total_encounters: this.totalEncounters,
            events: this.events,
            encounter_results: this.encounterResults,
            loot: this.loot,
        };
    }

    /**
     * Create from database row
     */
    static fromDatabase(row) {
        return new Quest({
            id: row.id,
            templateId: row.template_id,
            heroId: row.hero_id,
            userId: row.user_id,
            status: row.status,
            startedAt: row.started_at,
            endsAt: row.ends_at,
            completedAt: row.completed_at,
            currentEncounter: row.current_encounter,
            totalEncounters: row.total_encounters,
            events: row.events,
            encounterResults: row.encounter_results,
            loot: row.loot,
        });
    }

    /**
     * Create a new quest from a template
     */
    static fromTemplate(templateId, userId) {
        const template = QUEST_TEMPLATES[templateId];
        if (!template) {
            Utils.error(`Unknown quest template: ${templateId}`);
            return null;
        }

        return new Quest({
            templateId,
            userId,
            status: QuestStatus.AVAILABLE,
            totalEncounters: template.encounters.length,
        });
    }
}

/**
 * Quest utilities
 */
const Quests = {
    /**
     * Get all quest templates
     */
    getAllTemplates() {
        return Object.values(QUEST_TEMPLATES);
    },

    /**
     * Get templates by difficulty
     */
    getByDifficulty(difficulty) {
        return Object.values(QUEST_TEMPLATES).filter(t => t.difficulty === difficulty);
    },

    /**
     * Get mob definition
     */
    getMob(mobId) {
        return MOB_DEFINITIONS[mobId] || null;
    },

    /**
     * Create mob instance for combat
     * Returns a combat-ready mob object with calculated stats
     */
    createMobInstance(mobId, tierOverride = null) {
        const def = MOB_DEFINITIONS[mobId];
        if (!def) return null;

        const tier = tierOverride || def.tier;
        const tierMult = CONFIG.MOB_TIERS[tier]?.statMult || 1.0;

        // Scale stats by tier
        const stats = {};
        for (const [stat, value] of Object.entries(def.stats)) {
            stats[stat] = Math.floor(value * tierMult);
        }

        // Calculate HP
        const hp = Utils.calcHP(def.level, stats.def);

        return {
            id: Utils.uuid(),
            mobId: def.id,
            name: def.name,
            level: def.level,
            tier,
            stats,
            maxHp: hp,
            currentHp: hp,
            skills: def.skills || ['strike'],
            icon: def.icon,
        };
    },
};

Object.freeze(Quests);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        QuestDifficulty,
        QuestStatus,
        MOB_DEFINITIONS,
        QUEST_TEMPLATES,
        Quest,
        Quests,
    };
}
