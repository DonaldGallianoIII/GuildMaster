/**
 * ============================================
 * GUILD MASTER - Skill Model & Definitions
 * ============================================
 * Skills are innate to heroes - you can't teach new skills,
 * only upgrade the ones they were born with.
 *
 * SKILL MECHANICS:
 * - Heroes roll 3 skills at recruitment
 * - Duplicates merge (doubled/tripled for higher max rank)
 * - Skills have ranks (1-5 base, 1-10 doubled, 1-15 tripled)
 * - Each rank costs 1 skill point
 * ============================================
 */

/**
 * Skill targeting types
 * @readonly
 * @enum {string}
 */
const SkillTarget = {
    SINGLE: 'single',       // One enemy
    CLEAVE: 'cleave',       // 2-3 enemies
    AOE: 'aoe',             // All enemies
    SELF: 'self',           // Caster only
    ALLY: 'ally',           // Single ally
    ALL_ALLIES: 'all_allies', // All allies
};

/**
 * Skill damage types
 * @readonly
 * @enum {string}
 */
const DamageType = {
    PHYSICAL: 'physical',   // Mitigated by DEF
    MAGICAL: 'magical',     // Mitigated by WILL (half rate)
    TRUE: 'true',           // Ignores defenses
    NONE: 'none',           // Utility/buff skills
};

/**
 * Skill activation types
 * @readonly
 * @enum {string}
 */
const SkillActivation = {
    ACTIVE: 'active',       // Used on turn
    PASSIVE: 'passive',     // Always active
    TRIGGER: 'trigger',     // Activates on condition
    SUMMON: 'summon',       // Summons entity
};

Object.freeze(SkillTarget);
Object.freeze(DamageType);
Object.freeze(SkillActivation);

/**
 * ============================================
 * SKILL DEFINITIONS
 * ============================================
 * Each skill has:
 * - id: Unique identifier
 * - name: Display name
 * - description: Flavor text
 * - rarity: common/uncommon/rare/legendary
 * - activation: active/passive/trigger/summon
 * - target: targeting type
 * - damageType: physical/magical/true/none
 * - scaling: Array of stat names that affect damage
 * - baseValue: Base effect value
 * - rankBonus: Additional value per rank
 * - icon: Emoji placeholder (will be replaced with real icons)
 * ============================================
 */
const SKILL_DEFINITIONS = {
    // ==================== COMMON OFFENSIVE ====================

    strike: {
        id: 'strike',
        name: 'Strike',
        description: 'A basic physical attack. Fast cooldown.',
        rarity: 'common',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 1.0,          // 100% ATK
        rankBonus: 0.05,         // +5% per rank
        cooldown: 2,
        cooldownReduction: { 3: 1, 5: 0 }, // Rank 3: CD 1, Rank 5: CD 0
        icon: '⚔️',
    },

    bash: {
        id: 'bash',
        name: 'Bash',
        description: 'A heavy strike that can stagger.',
        rarity: 'common',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 1.1,
        rankBonus: 0.08,
        cooldown: 2,
        icon: '🔨',
    },

    spark: {
        id: 'spark',
        name: 'Spark',
        description: 'A small bolt of magical energy. Fast cooldown.',
        rarity: 'common',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.0,
        rankBonus: 0.05,
        cooldown: 2,
        cooldownReduction: { 3: 1, 5: 0 }, // Rank 3: CD 1, Rank 5: CD 0
        icon: '✨',
    },

    // ==================== COMMON DEFENSIVE ====================

    block: {
        id: 'block',
        name: 'Block',
        description: 'Reduce incoming physical damage.',
        rarity: 'common',
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['def'],
        baseValue: 0.05,         // 5% damage reduction
        rankBonus: 0.02,         // +2% per rank
        icon: '🛡️',
    },

    focus: {
        id: 'focus',
        name: 'Focus',
        description: 'Concentrate to resist magical effects.',
        rarity: 'common',
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        baseValue: 0.05,
        rankBonus: 0.02,
        icon: '🧘',
    },

    // ==================== UNCOMMON OFFENSIVE ====================

    cleave: {
        id: 'cleave',
        name: 'Cleave',
        description: 'Slash through multiple enemies.',
        rarity: 'uncommon',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.CLEAVE,    // Hits 2-3 targets
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 0.8,                 // Slightly less per target
        rankBonus: 0.10,
        cooldown: 2,
        icon: '🗡️',
    },

    fireball: {
        id: 'fireball',
        name: 'Fireball',
        description: 'Hurl a ball of fire at your foes.',
        rarity: 'uncommon',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.3,
        rankBonus: 0.12,
        cooldown: 2,
        icon: '🔥',
    },

    backstab: {
        id: 'backstab',
        name: 'Backstab',
        description: 'Strike from the shadows. Cooldown reduces with mastery.',
        rarity: 'uncommon',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk', 'spd'],
        baseValue: 1.2,
        rankBonus: 0.03,             // Lower damage scaling
        critBonus: 0.15,             // +15% crit chance
        cooldown: 2,
        cooldownReduction: { 2: 1, 4: 0 }, // Rank 2: CD 1, Rank 4: CD 0
        icon: '🗡️',
    },

    // ==================== UNCOMMON DEFENSIVE/UTILITY ====================

    second_wind: {
        id: 'second_wind',
        name: 'Second Wind',
        description: 'Heal when dropping below 30% HP.',
        rarity: 'uncommon',
        activation: SkillActivation.TRIGGER,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        triggerCondition: 'hp_below_30',
        baseValue: 0.20,            // Heal 20% max HP
        rankBonus: 0.05,            // +5% per rank
        cooldown: 1,                // Once per combat
        icon: '💨',
    },

    leech: {
        id: 'leech',
        name: 'Leech',
        description: 'Heal for a portion of damage dealt.',
        rarity: 'uncommon',
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.05,            // 5% lifesteal
        rankBonus: 0.02,
        icon: '🩸',
    },

    thorns: {
        id: 'thorns',
        name: 'Thorns',
        description: 'Reflect damage back to attackers.',
        rarity: 'uncommon',
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.PHYSICAL,
        scaling: ['def'],
        baseValue: 0.10,            // Reflect 10% damage
        rankBonus: 0.05,
        icon: '🌵',
    },

    // ==================== RARE OFFENSIVE ====================

    execute: {
        id: 'execute',
        name: 'Execute',
        description: 'Deal bonus damage to low HP targets. Cooldown reduces with mastery.',
        rarity: 'rare',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 1.0,
        rankBonus: 0.05,
        // Bonus damage = (1 - target HP%) × 100%
        executeBonus: true,
        cooldown: 2,
        cooldownReduction: { 3: 1, 5: 0 }, // Master executioner
        icon: '💀',
    },

    soul_rend: {
        id: 'soul_rend',
        name: 'Soul Rend',
        description: 'Tear at the enemy\'s essence. Pure magical damage.',
        rarity: 'rare',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.5,
        rankBonus: 0.12,
        cooldown: 2,
        icon: '👻',
    },

    holy_smite: {
        id: 'holy_smite',
        name: 'Holy Smite',
        description: 'Call divine light. Scales with ATK, WILL, and DEF.',
        rarity: 'rare',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['atk', 'will', 'def'],
        // Hybrid scaling: (ATK×0.3) + (WILL×0.3) + (DEF×0.4)
        scalingWeights: { atk: 0.3, will: 0.3, def: 0.4 },
        baseValue: 1.0,
        rankBonus: 0.08,
        cooldown: 2,
        icon: '✝️',
    },

    meteor: {
        id: 'meteor',
        name: 'Meteor',
        description: 'Call down devastation from above.',
        rarity: 'rare',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will', 'spd'],
        scalingWeights: { will: 0.7, spd: 0.3 },
        baseValue: 0.8,            // Lower base for AOE
        rankBonus: 0.15,
        cooldown: 2,
        icon: '☄️',
    },

    // ==================== RARE DEFENSIVE/UTILITY ====================

    mana_shield: {
        id: 'mana_shield',
        name: 'Mana Shield',
        description: 'Absorb damage with magical energy.',
        rarity: 'rare',
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        baseValue: 0.15,           // 15% damage absorbed by WILL
        rankBonus: 0.05,
        icon: '🔮',
    },

    frenzy: {
        id: 'frenzy',
        name: 'Frenzy',
        description: 'Attack faster as HP drops.',
        rarity: 'rare',
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.20,           // +20% speed at low HP
        rankBonus: 0.10,
        icon: '😡',
    },

    retaliate: {
        id: 'retaliate',
        name: 'Retaliate',
        description: 'Counter-attack when struck. Scales with DEF.',
        rarity: 'rare',
        activation: SkillActivation.TRIGGER,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['def'],
        triggerCondition: 'on_hit',
        baseValue: 0.50,           // 50% of DEF as damage
        rankBonus: 0.10,
        procChance: 0.30,          // 30% chance to trigger
        procChanceBonus: 0.05,     // +5% per rank
        icon: '⚡',
    },

    // ==================== RARE SUMMONS ====================

    raise_dead: {
        id: 'raise_dead',
        name: 'Raise Dead',
        description: 'Summon a skeleton warrior.',
        rarity: 'rare',
        activation: SkillActivation.SUMMON,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        summonType: 'skeleton',
        // Summon BST = base + (WILL × scaling)
        baseSummonBst: 2,
        summonBstScaling: 0.5,     // +0.5 BST per rank
        icon: '💀',
    },

    // ==================== LEGENDARY ====================

    whirlwind: {
        id: 'whirlwind',
        name: 'Whirlwind',
        description: 'Spin and strike all enemies. Cooldown reduces with mastery.',
        rarity: 'legendary',
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 0.9,
        rankBonus: 0.08,
        cooldown: 2,
        cooldownReduction: { 3: 1, 5: 0 }, // Master spinner
        icon: '🌀',
    },

    undying: {
        id: 'undying',
        name: 'Undying',
        description: 'Survive a killing blow once per quest.',
        rarity: 'legendary',
        activation: SkillActivation.TRIGGER,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        triggerCondition: 'on_death',
        baseValue: 0.10,           // Revive at 10% HP
        rankBonus: 0.05,           // +5% HP per rank
        cooldown: 1,               // Once per quest
        icon: '♾️',
    },

    ascension: {
        id: 'ascension',
        name: 'Ascension',
        description: 'Transcend mortal limits. All stats scale together.',
        rarity: 'legendary',
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['atk', 'will', 'def', 'spd'],
        baseValue: 0.05,           // +5% to all stats
        rankBonus: 0.02,
        icon: '👼',
    },

    soul_harvest: {
        id: 'soul_harvest',
        name: 'Soul Harvest',
        description: 'Gain power from fallen enemies.',
        rarity: 'legendary',
        activation: SkillActivation.TRIGGER,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        triggerCondition: 'on_kill',
        baseValue: 0.05,           // +5% WILL per kill (temp)
        rankBonus: 0.02,
        icon: '👹',
    },
};

Object.freeze(SKILL_DEFINITIONS);

/**
 * Skill utility functions
 */
const Skills = {
    /**
     * Get skill definition by ID
     */
    get(skillId) {
        return SKILL_DEFINITIONS[skillId] || null;
    },

    /**
     * Get all skills of a rarity
     */
    getByRarity(rarity) {
        return Object.values(SKILL_DEFINITIONS).filter(s => s.rarity === rarity);
    },

    /**
     * Get all skill IDs
     */
    getAllIds() {
        return Object.keys(SKILL_DEFINITIONS);
    },

    /**
     * Roll random skills for a new recruit
     * @param {number} count - Number of skills to roll (default 3)
     * @returns {Array} Array of { skillId, rank, isDoubled, isTripled }
     */
    rollForRecruit(count = CONFIG.HERO.SKILL_COUNT) {
        const rolled = [];

        for (let i = 0; i < count; i++) {
            // Roll rarity
            const rarity = Utils.weightedRandom(CONFIG.SKILL_RARITY_WEIGHTS);

            // Get skills of that rarity
            const availableSkills = this.getByRarity(rarity);

            if (availableSkills.length === 0) {
                // Fallback to common if no skills of that rarity
                const commonSkills = this.getByRarity('common');
                rolled.push(Utils.randomChoice(commonSkills).id);
            } else {
                rolled.push(Utils.randomChoice(availableSkills).id);
            }
        }

        // Process duplicates - merge into doubled/tripled
        return this.processRolledSkills(rolled);
    },

    /**
     * Process rolled skill IDs into skill objects with doubling/tripling
     * @param {Array} skillIds - Array of skill IDs (may have duplicates)
     * @returns {Array} Processed skill objects
     */
    processRolledSkills(skillIds) {
        const counts = {};
        skillIds.forEach(id => {
            counts[id] = (counts[id] || 0) + 1;
        });

        const result = [];
        for (const [skillId, count] of Object.entries(counts)) {
            result.push({
                skillId,
                rank: 1,
                isDoubled: count === 2,
                isTripled: count >= 3,
            });
        }

        return result;
    },

    /**
     * Calculate skill effect value at a given rank
     * @param {Object} skillDef - Skill definition
     * @param {number} rank - Current rank
     * @returns {number} Effect multiplier
     */
    calcEffectValue(skillDef, rank) {
        return skillDef.baseValue + (skillDef.rankBonus * (rank - 1));
    },

    /**
     * Get max rank for a skill based on doubled/tripled status
     */
    getMaxRank(isDoubled, isTripled) {
        if (isTripled) return CONFIG.SKILLS.MAX_RANK_TRIPLED;
        if (isDoubled) return CONFIG.SKILLS.MAX_RANK_DOUBLED;
        return CONFIG.SKILLS.MAX_RANK_BASE;
    },

    /**
     * Get cooldown for a skill at a specific rank
     * @param {Object} skillDef - Skill definition
     * @param {number} rank - Current rank
     * @returns {number} Cooldown in rounds (0 = no cooldown)
     */
    getCooldownAtRank(skillDef, rank) {
        if (!skillDef || skillDef.activation !== SkillActivation.ACTIVE) {
            return 0; // Passives and triggers have no cooldown
        }

        let cooldown = skillDef.cooldown ?? 2; // Default cooldown is 2

        // Check for cooldown reduction at this rank
        if (skillDef.cooldownReduction) {
            // Find the highest rank threshold we've reached
            for (const [rankThreshold, newCooldown] of Object.entries(skillDef.cooldownReduction)) {
                if (rank >= parseInt(rankThreshold)) {
                    cooldown = newCooldown;
                }
            }
        }

        return cooldown;
    },

    /**
     * Calculate hire cost modifier based on skills
     */
    calcSkillCostModifier(skills) {
        let modifier = 0;
        for (const skill of skills) {
            const def = this.get(skill.skillId);
            if (!def) continue;

            const rarityMult = CONFIG.RECRUITMENT.SKILL_COST_MULTIPLIER[def.rarity] || 1;

            // Doubled/tripled skills cost more
            let countMult = 1;
            if (skill.isTripled) countMult = 3;
            else if (skill.isDoubled) countMult = 2;

            modifier += rarityMult * countMult;
        }
        return modifier;
    },
};

Object.freeze(Skills);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SkillTarget,
        DamageType,
        SkillActivation,
        SKILL_DEFINITIONS,
        Skills,
    };
}
