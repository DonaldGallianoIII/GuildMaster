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
 * Enemies scale dynamically based on hero level
 * - tier: Determines level offset and BST multiplier from CONFIG.MOB_TIERS
 * - statDist: Percentage distribution of BST across stats (must sum to 1.0)
 * ============================================
 */
const MOB_DEFINITIONS = {
    // ==================== FODDER MOBS (Easy kills) ====================
    goblin: {
        id: 'goblin',
        name: 'Goblin',
        tier: 'fodder_trash',
        statDist: { atk: 0.4, will: 0, def: 0.2, spd: 0.4 },
        icon: '👺',
        skills: ['strike'],
    },
    rat: {
        id: 'rat',
        name: 'Giant Rat',
        tier: 'fodder_trash',
        statDist: { atk: 0.3, will: 0, def: 0.1, spd: 0.6 },
        icon: '🐀',
        skills: ['strike'],
    },
    wolf: {
        id: 'wolf',
        name: 'Wolf',
        tier: 'fodder',
        statDist: { atk: 0.5, will: 0, def: 0.1, spd: 0.4 },
        icon: '🐺',
        skills: ['strike'],
    },
    goblin_brute: {
        id: 'goblin_brute',
        name: 'Goblin Brute',
        tier: 'fodder_exalted',
        statDist: { atk: 0.4, will: 0, def: 0.4, spd: 0.2 },
        icon: '👹',
        skills: ['strike', 'bash'],
    },

    // ==================== STANDARD MOBS (Fair fights) ====================
    bandit: {
        id: 'bandit',
        name: 'Bandit',
        tier: 'standard_weak',
        statDist: { atk: 0.4, will: 0, def: 0.3, spd: 0.3 },
        icon: '🥷',
        skills: ['strike', 'backstab'],
    },
    skeleton: {
        id: 'skeleton',
        name: 'Skeleton',
        tier: 'standard_weak',
        statDist: { atk: 0.35, will: 0.15, def: 0.35, spd: 0.15 },
        icon: '💀',
        skills: ['strike'],
    },
    cave_spider: {
        id: 'cave_spider',
        name: 'Cave Spider',
        tier: 'standard',
        statDist: { atk: 0.35, will: 0, def: 0.15, spd: 0.5 },
        icon: '🕷️',
        skills: ['strike'],
    },
    alpha_wolf: {
        id: 'alpha_wolf',
        name: 'Alpha Wolf',
        tier: 'standard_exalted',
        statDist: { atk: 0.4, will: 0, def: 0.2, spd: 0.4 },
        icon: '🐕',
        skills: ['strike', 'frenzy'],
    },
    skeleton_mage: {
        id: 'skeleton_mage',
        name: 'Skeleton Mage',
        tier: 'standard_exalted',
        statDist: { atk: 0.1, will: 0.5, def: 0.25, spd: 0.15 },
        icon: '🧙',
        skills: ['spark', 'fireball'],
    },

    // ==================== ELITE MOBS (Mini-boss) ====================
    bandit_chief: {
        id: 'bandit_chief',
        name: 'Bandit Chief',
        tier: 'elite',
        statDist: { atk: 0.4, will: 0.1, def: 0.3, spd: 0.2 },
        icon: '🦹',
        skills: ['strike', 'cleave', 'second_wind'],
    },
    wraith: {
        id: 'wraith',
        name: 'Wraith',
        tier: 'elite',
        statDist: { atk: 0.15, will: 0.5, def: 0.15, spd: 0.2 },
        icon: '👻',
        skills: ['soul_rend', 'mana_shield'],
    },
    treant: {
        id: 'treant',
        name: 'Treant',
        tier: 'elite_exalted',
        statDist: { atk: 0.35, will: 0.1, def: 0.45, spd: 0.1 },
        icon: '🌳',
        skills: ['bash', 'thorns', 'block'],
    },
    drake: {
        id: 'drake',
        name: 'Drake',
        tier: 'elite_exalted',
        statDist: { atk: 0.35, will: 0.25, def: 0.25, spd: 0.15 },
        icon: '🐲',
        skills: ['cleave', 'fireball'],
    },

    // ==================== BOSS MOBS (Major threats) ====================
    dragon: {
        id: 'dragon',
        name: 'Ancient Dragon',
        tier: 'boss',
        statDist: { atk: 0.4, will: 0.3, def: 0.2, spd: 0.1 },
        icon: '🐉',
        skills: ['cleave', 'meteor', 'frenzy'],
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
    // ==================== EASY (Simplified for testing) ====================
    goblin_warren: {
        id: 'goblin_warren',
        name: 'Goblin Warren',
        description: 'A network of tunnels infested with goblins.',
        difficulty: QuestDifficulty.EASY,
        duration: CONFIG.QUESTS.DURATION.easy,
        icon: '🕳️',
        encounters: [
            { mobs: ['goblin', 'goblin'] },
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
            { mobs: ['wolf'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.easy,
            xp: CONFIG.QUESTS.XP_REWARDS.easy,
        },
    },

    // ==================== MEDIUM (Simplified for testing) ====================
    bandit_camp: {
        id: 'bandit_camp',
        name: 'Bandit Camp',
        description: 'Outlaws have set up camp in the forest.',
        difficulty: QuestDifficulty.MEDIUM,
        duration: CONFIG.QUESTS.DURATION.medium,
        icon: '⛺',
        encounters: [
            { mobs: ['bandit'] },
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
            { mobs: ['skeleton'] },
            { mobs: ['cave_spider', 'cave_spider'] },
            { mobs: ['skeleton_mage'] },
        ],
        rewards: {
            gold: CONFIG.QUESTS.GOLD_REWARDS.medium,
            xp: CONFIG.QUESTS.XP_REWARDS.medium,
        },
    },

    // ==================== HARD (Simplified for testing) ====================
    cursed_forest: {
        id: 'cursed_forest',
        name: 'Cursed Forest',
        description: 'Dark magic has twisted these woods.',
        difficulty: QuestDifficulty.HARD,
        duration: CONFIG.QUESTS.DURATION.hard,
        icon: '🌲',
        encounters: [
            { mobs: ['wraith'] },
            { mobs: ['treant'] },
            { mobs: ['wraith', 'wraith'] },
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
            { mobs: ['drake'] },
            { mobs: ['drake', 'drake'] },
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
     * Get the time (in ms from quest start) when the hero dies
     * Returns null if hero doesn't die
     */
    get heroDeathTime() {
        if (!this.combatResults || this.combatResults.success !== false) {
            return null;
        }

        // Find the last encounter that had combat (where hero died)
        if (this.events && this.events.length > 0) {
            // Look for encounter_end with victory: false to find when hero died
            for (const event of this.events) {
                if (event.type === 'encounter_end' && event.data.victory === false) {
                    return event.time;
                }
            }
        }

        // Fallback: return full duration if we can't determine exact time
        return this.duration;
    }

    /**
     * Check if hero was defeated AND enough time has passed to reveal it
     * This shows failure only when the quest timeline reaches the death moment
     */
    get heroDefeated() {
        if (!this.combatResults || this.combatResults.success !== false) {
            return false;
        }

        // Check if enough time has elapsed to reveal the death
        const deathTime = this.heroDeathTime;
        if (deathTime === null) return false;

        const elapsed = Date.now() - new Date(this.startedAt).getTime();
        return elapsed >= deathTime;
    }

    /**
     * Check if quest should be completed (either time is up OR hero died AND time has passed)
     */
    get isReadyToComplete() {
        return this.isTimeComplete || this.heroDefeated;
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
     * @param {Object} combatResults - Pre-calculated combat results (optional)
     */
    start(heroId, combatResults = null) {
        this.heroId = heroId;
        this.status = QuestStatus.ACTIVE;
        this.startedAt = Utils.now();
        this.endsAt = new Date(Date.now() + this.duration).toISOString();
        this.currentEncounter = 0;
        this.totalEncounters = this.encounters.length;

        // Store pre-calculated combat results
        this.combatResults = combatResults;

        // Generate event timeline for peek system (using actual combat if available)
        if (combatResults && combatResults.encounters) {
            this.generateEventsFromCombat(combatResults);
        } else {
            this.generateEvents();
        }

        Utils.log(`Quest started: ${this.name}`);
    }

    /**
     * Generate timeline of events from actual combat results
     * Shows real combat actions instead of placeholders
     */
    generateEventsFromCombat(combatResults) {
        const events = [];
        const encounterDuration = this.duration / this.totalEncounters;

        for (let i = 0; i < combatResults.encounters.length; i++) {
            const encResult = combatResults.encounters[i];
            const combatData = encResult.result;
            const encounterStart = i * encounterDuration;

            // Encounter start event
            events.push({
                time: encounterStart,
                type: 'encounter_start',
                data: {
                    encounterIndex: i,
                    mobs: this.encounters[i]?.mobs.map(mobId => MOB_DEFINITIONS[mobId]?.name || mobId) || [],
                },
            });

            // Add actual combat actions as events
            if (combatData && combatData.rounds) {
                const roundDuration = (encounterDuration - 200) / Math.max(combatData.rounds.length, 1);

                for (let r = 0; r < combatData.rounds.length; r++) {
                    const round = combatData.rounds[r];
                    const roundTime = encounterStart + (r * roundDuration) + 100;

                    for (const action of round.actions) {
                        events.push({
                            time: roundTime + (Math.random() * roundDuration * 0.3),
                            type: 'combat_action',
                            data: {
                                encounterIndex: i,
                                description: action.description,
                                damage: action.damage,
                                healing: action.healing,
                                killed: action.killed,
                                actorName: action.actorName,
                                targetName: action.targetName,
                                actorIsHero: action.actorIsHero,
                            },
                        });
                    }
                }
            }

            // Encounter end event
            events.push({
                time: encounterStart + encounterDuration - 50,
                type: 'encounter_end',
                data: {
                    encounterIndex: i,
                    victory: combatData?.victory ?? true,
                    loot: i === combatResults.encounters.length - 1 && combatResults.loot?.length > 0,
                },
            });
        }

        // Quest complete event
        events.push({
            time: this.duration,
            type: 'quest_complete',
            data: {
                success: combatResults.success,
                totalGold: combatResults.totalGold,
                totalXp: combatResults.totalXp,
                lootCount: combatResults.loot?.length || 0,
            },
        });

        this.events = events.sort((a, b) => a.time - b.time);
    }

    /**
     * Generate timeline of placeholder events for peek system (fallback)
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
    }

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
     * Create a mob instance with stats scaled to hero level
     * @param {string} mobId - The mob definition ID
     * @param {number} heroLevel - The level of the hero fighting this mob
     * @param {string} tierOverride - Optional tier override
     */
    createMobInstance(mobId, heroLevel = 1, tierOverride = null) {
        const def = MOB_DEFINITIONS[mobId];
        if (!def) return null;

        const tier = tierOverride || def.tier;
        const tierConfig = CONFIG.MOB_TIERS[tier];

        if (!tierConfig) {
            Utils.error(`Unknown mob tier: ${tier}`);
            return null;
        }

        // Calculate mob level based on hero level + tier offset
        const mobLevel = Math.max(1, heroLevel + tierConfig.levelOffset);

        // Calculate BST: hero's BST * tier multiplier
        const heroBst = heroLevel * CONFIG.STATS.BST_PER_LEVEL;
        const mobBst = Math.floor(heroBst * tierConfig.bstMult);

        // Distribute BST according to stat distribution
        const stats = {
            atk: Math.floor(mobBst * (def.statDist.atk || 0)),
            will: Math.floor(mobBst * (def.statDist.will || 0)),
            def: Math.floor(mobBst * (def.statDist.def || 0)),
            spd: Math.floor(mobBst * (def.statDist.spd || 0)),
        };

        // Calculate HP: base HP formula * tier HP multiplier
        const baseHp = (mobLevel * CONFIG.STATS.HP_PER_LEVEL) + stats.def;
        const hp = Math.floor(baseHp * tierConfig.hpMult);

        return {
            id: Utils.uuid(),
            mobId: def.id,
            name: def.name,
            level: mobLevel,
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
