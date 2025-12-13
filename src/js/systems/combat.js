/**
 * ============================================
 * GUILD MASTER - Combat Simulation Engine
 * ============================================
 * Real combat simulation running under the hood.
 * This is NOT fake theater - actual damage calculations
 * determine outcomes.
 *
 * COMBAT FLOW (Duelist System):
 * 1. Hero fights mobs 1v1 in sequence within each pack
 * 2. Each duel: faster combatant attacks first (ties = coin flip)
 * 3. When hero kills an enemy, NEXT enemy gets a FREE HIT
 *    - Free hit does 50% damage
 *    - Free hit can never kill (leaves hero at 1 HP minimum)
 * 4. AoE abilities hit all enemies and skip free hit mechanic
 * 5. Continue until all enemies dead or hero dies
 *
 * DAMAGE FORMULAS (from design doc):
 * Physical: ATK² ÷ (ATK + target DEF)
 * Magical: WILL² ÷ (WILL + target WILL ÷ 2)
 * ============================================
 */

/**
 * Combat action types
 * @readonly
 * @enum {string}
 */
const CombatActionType = {
    ATTACK: 'attack',
    SKILL: 'skill',
    HEAL: 'heal',
    BUFF: 'buff',
    DEBUFF: 'debuff',
    SUMMON: 'summon',
    TRIGGER: 'trigger',       // Passive/trigger skill activated
    DEATH: 'death',
    DOT_TICK: 'dot_tick',     // Damage over time tick (poison, burn, bleed)
    HOT_TICK: 'hot_tick',     // Heal over time tick (regen)
    STATUS_APPLY: 'status_apply',   // Status effect applied
    STATUS_EXPIRE: 'status_expire', // Status effect expired
    STATUS_RESIST: 'status_resist', // Status effect resisted
};

Object.freeze(CombatActionType);

/**
 * Status effect types
 * @readonly
 * @enum {string}
 */
const StatusEffectType = {
    // Damage over Time (DoT)
    POISON: 'poison',         // % max HP damage, stacks intensity
    BURN: 'burn',             // Flat magic damage, doesn't stack
    BLEED: 'bleed',           // Flat physical damage, stacks duration

    // Heal over Time (HoT)
    REGEN: 'regen',           // % max HP healing
    LIFESTEAL_BUFF: 'lifesteal_buff', // Temporary lifesteal bonus

    // Crowd Control
    STUN: 'stun',             // Skip turn, 100% hit chance against
    SLOW: 'slow',             // Reduced speed
    ROOT: 'root',             // Can't be moved (future: positioning)
    SILENCE: 'silence',       // Can't use skills, basic attack only
    BLIND: 'blind',           // Reduced hit chance / increased miss

    // Stat Modifiers (Buffs)
    ATK_UP: 'atk_up',
    DEF_UP: 'def_up',
    WILL_UP: 'will_up',
    SPD_UP: 'spd_up',
    CRIT_UP: 'crit_up',
    SHIELD: 'shield',         // Absorbs damage before HP

    // Stat Modifiers (Debuffs)
    ATK_DOWN: 'atk_down',
    DEF_DOWN: 'def_down',
    WILL_DOWN: 'will_down',
    SPD_DOWN: 'spd_down',
    VULNERABLE: 'vulnerable', // Takes increased damage

    // Special
    TAUNT: 'taunt',           // Forces targeting (future: multi-hero)
    MARKED: 'marked',         // Takes bonus damage from next hit
    THORNS: 'thorns',         // Reflect damage to attackers
    UNDYING: 'undying',       // Survive killing blow once
};

Object.freeze(StatusEffectType);

/**
 * Status effect timing - when the effect ticks
 * @readonly
 * @enum {string}
 */
const StatusTiming = {
    START_OF_TURN: 'start_of_turn',   // Ticks before actor acts
    END_OF_TURN: 'end_of_turn',       // Ticks after actor acts
    ON_HIT: 'on_hit',                 // Ticks when target is hit
    ON_ATTACK: 'on_attack',           // Ticks when actor attacks
};

Object.freeze(StatusTiming);

/**
 * Status effect instance
 */
class StatusEffect {
    constructor(data = {}) {
        this.id = data.id || Utils.uuid();
        this.type = data.type || StatusEffectType.POISON;
        this.name = data.name || this.type;
        this.sourceId = data.sourceId || null;      // Who applied it
        this.sourceName = data.sourceName || 'Unknown';

        // Duration
        this.duration = data.duration || 3;          // Turns remaining
        this.maxDuration = data.maxDuration || data.duration || 3;
        this.permanent = data.permanent || false;    // Doesn't expire

        // Effect values
        this.value = data.value || 0;                // Primary value (damage, heal amount, stat modifier)
        this.percentage = data.percentage || false;  // Is value a percentage of max HP?
        this.flatValue = data.flatValue || 0;        // Additional flat value

        // Stacking
        this.stacks = data.stacks || 1;
        this.maxStacks = data.maxStacks || 1;
        this.stackable = data.stackable || false;    // Can stack intensity
        this.refreshable = data.refreshable || true; // Reapplying refreshes duration

        // Timing
        this.timing = data.timing || StatusTiming.START_OF_TURN;

        // Damage type (for DoTs)
        this.damageType = data.damageType || DamageType.TRUE;

        // Visual
        this.icon = data.icon || '❓';
        this.description = data.description || '';
    }

    /**
     * Tick the effect (reduce duration)
     * @returns {boolean} True if effect should be removed
     */
    tick() {
        if (this.permanent) return false;
        this.duration--;
        return this.duration <= 0;
    }

    /**
     * Add stacks (for stackable effects)
     * @param {number} count - Stacks to add
     */
    addStacks(count = 1) {
        if (this.stackable) {
            this.stacks = Math.min(this.stacks + count, this.maxStacks);
        }
    }

    /**
     * Refresh duration (for refreshable effects)
     */
    refresh() {
        if (this.refreshable) {
            this.duration = this.maxDuration;
        }
    }

    /**
     * Calculate effect value (accounting for stacks)
     */
    getEffectiveValue() {
        return this.value * this.stacks;
    }

    /**
     * Clone the effect
     */
    clone() {
        return new StatusEffect({ ...this });
    }
}

/**
 * Status effect definitions - templates for creating effects
 */
const STATUS_EFFECT_TEMPLATES = {
    // ==================== DAMAGE OVER TIME ====================
    poison: {
        type: StatusEffectType.POISON,
        name: 'Poison',
        duration: 3,
        value: 0.05,              // 5% max HP per tick
        percentage: true,
        stackable: true,
        maxStacks: 5,
        timing: StatusTiming.START_OF_TURN,
        damageType: DamageType.TRUE,
        icon: '🧪',
        description: 'Taking poison damage each turn',
    },
    burn: {
        type: StatusEffectType.BURN,
        name: 'Burning',
        duration: 2,
        value: 10,                // Flat damage (scales with source WILL)
        percentage: false,
        stackable: false,
        refreshable: true,
        timing: StatusTiming.START_OF_TURN,
        damageType: DamageType.MAGICAL,
        icon: '🔥',
        description: 'Taking fire damage each turn',
    },
    bleed: {
        type: StatusEffectType.BLEED,
        name: 'Bleeding',
        duration: 3,
        value: 8,                 // Flat damage (scales with source ATK)
        percentage: false,
        stackable: false,
        refreshable: true,        // Reapplying adds duration
        timing: StatusTiming.END_OF_TURN,
        damageType: DamageType.PHYSICAL,
        icon: '🩸',
        description: 'Bleeding out each turn',
    },

    // ==================== HEAL OVER TIME ====================
    regen: {
        type: StatusEffectType.REGEN,
        name: 'Regenerating',
        duration: 3,
        value: 0.05,              // 5% max HP per tick
        percentage: true,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '💚',
        description: 'Regenerating health each turn',
    },

    // ==================== CROWD CONTROL ====================
    stun: {
        type: StatusEffectType.STUN,
        name: 'Stunned',
        duration: 1,
        stackable: false,
        refreshable: false,       // Can't extend stun
        timing: StatusTiming.START_OF_TURN,
        icon: '💫',
        description: 'Cannot act this turn',
    },
    slow: {
        type: StatusEffectType.SLOW,
        name: 'Slowed',
        duration: 2,
        value: 0.30,              // 30% speed reduction
        percentage: true,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '🐌',
        description: 'Movement and attack speed reduced',
    },
    silence: {
        type: StatusEffectType.SILENCE,
        name: 'Silenced',
        duration: 2,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '🤐',
        description: 'Cannot use skills',
    },
    blind: {
        type: StatusEffectType.BLIND,
        name: 'Blinded',
        duration: 2,
        value: 0.50,              // 50% miss chance
        percentage: true,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '😵',
        description: 'Attacks may miss',
    },

    // ==================== STAT BUFFS ====================
    atk_up: {
        type: StatusEffectType.ATK_UP,
        name: 'Attack Up',
        duration: 3,
        value: 0.20,              // +20% ATK
        percentage: true,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '⚔️',
        description: 'Attack power increased',
    },
    def_up: {
        type: StatusEffectType.DEF_UP,
        name: 'Defense Up',
        duration: 3,
        value: 0.20,              // +20% DEF
        percentage: true,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '🛡️',
        description: 'Defense increased',
    },
    shield: {
        type: StatusEffectType.SHIELD,
        name: 'Shielded',
        duration: 3,
        value: 50,                // Absorbs 50 damage
        percentage: false,
        stackable: false,
        refreshable: false,
        timing: StatusTiming.ON_HIT,
        icon: '🔰',
        description: 'Absorbing incoming damage',
    },

    // ==================== STAT DEBUFFS ====================
    atk_down: {
        type: StatusEffectType.ATK_DOWN,
        name: 'Attack Down',
        duration: 3,
        value: 0.20,              // -20% ATK
        percentage: true,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '⬇️',
        description: 'Attack power reduced',
    },
    def_down: {
        type: StatusEffectType.DEF_DOWN,
        name: 'Defense Down',
        duration: 3,
        value: 0.20,              // -20% DEF
        percentage: true,
        stackable: false,
        timing: StatusTiming.START_OF_TURN,
        icon: '💔',
        description: 'Defense reduced',
    },
    vulnerable: {
        type: StatusEffectType.VULNERABLE,
        name: 'Vulnerable',
        duration: 2,
        value: 0.25,              // +25% damage taken
        percentage: true,
        stackable: false,
        timing: StatusTiming.ON_HIT,
        icon: '🎯',
        description: 'Taking increased damage',
    },

    // ==================== SPECIAL ====================
    marked: {
        type: StatusEffectType.MARKED,
        name: 'Marked',
        duration: 1,
        value: 0.50,              // +50% damage from next hit
        percentage: true,
        stackable: false,
        timing: StatusTiming.ON_HIT,
        icon: '🔴',
        description: 'Next hit deals bonus damage',
    },
    thorns_buff: {
        type: StatusEffectType.THORNS,
        name: 'Thorns',
        duration: 3,
        value: 0.15,              // Reflect 15% damage
        percentage: true,
        stackable: false,
        timing: StatusTiming.ON_HIT,
        icon: '🌵',
        description: 'Reflecting damage to attackers',
    },
};

Object.freeze(STATUS_EFFECT_TEMPLATES);

/**
 * Combat result
 */
class CombatResult {
    constructor() {
        this.victory = false;
        this.heroSurvived = true;
        this.rounds = [];
        this.events = [];  // Quest-level events (REST between packs, etc.)
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
        this.enemiesKilled = 0;
        this.loot = [];
        this.xpGained = 0;
        this.goldGained = 0;
        this.soulsGained = 0;  // Soul drops from kills (Design Doc v2)
    }

    addRound(round) {
        this.rounds.push(round);
    }
}

/**
 * Combat round - contains all actions in a single round
 */
class CombatRound {
    constructor(roundNumber) {
        this.roundNumber = roundNumber;
        this.actions = [];
    }

    addAction(action) {
        this.actions.push(action);
    }
}

/**
 * Single combat action
 */
class CombatAction {
    constructor(data = {}) {
        this.type = data.type || CombatActionType.ATTACK;
        this.actorId = data.actorId || null;
        this.actorName = data.actorName || 'Unknown';
        this.actorIsHero = data.actorIsHero || false;
        this.targetId = data.targetId || null;
        this.targetName = data.targetName || 'Unknown';
        this.skillId = data.skillId || null;
        this.skillName = data.skillName || 'Attack';
        this.damage = data.damage || 0;
        this.damageType = data.damageType || 'physical';
        this.healing = data.healing || 0;
        this.isCritical = data.isCritical || false;
        this.killed = data.killed || false;
        this.description = data.description || '';
        // Duelist system flags
        this.isAoE = data.isAoE || false;         // Hit multiple targets
        this.isFreeHit = data.isFreeHit || false; // Free hit from previous kill
        this.aoeDamage = data.aoeDamage || [];    // Array of { targetId, targetName, damage, killed }
    }
}

/**
 * Combatant wrapper - normalizes heroes and mobs for combat
 */
class Combatant {
    constructor(data, isHero = false, isSummon = false) {
        this.id = data.id || Utils.uuid();
        this.name = data.name;
        this.isHero = isHero;
        this.isSummon = isSummon;
        this.isEnemy = !isHero && !isSummon;

        // Stats
        this.stats = { ...data.stats };
        this.level = data.level || 1;

        // HP
        this.maxHp = data.maxHp || Utils.calcHP(this.level, this.stats.def);
        this.currentHp = data.currentHp ?? this.maxHp;

        // Skills
        this.skills = data.skills || [];

        // Gear bonuses (for hero only - includes stats like leech from Vampiric affix)
        this.gearBonuses = data.gearBonuses || {};

        // Combat state
        this.isAlive = true;
        this.buffs = [];
        this.debuffs = [];
        this.statusEffects = [];  // All active status effects
        this.cooldowns = {}; // skillId -> rounds remaining

        // Passive tracking
        this.triggeredThisCombat = {}; // For once-per-combat triggers
        this.killCount = 0;

        // Reference to original object (for updating after combat)
        this.original = data;
    }

    get atk() { return this.stats.atk; }
    get will() { return this.stats.will; }
    get def() { return this.stats.def; }
    get spd() { return this.stats.spd; }

    takeDamage(amount) {
        const actual = Math.min(amount, this.currentHp);
        this.currentHp -= actual;
        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.isAlive = false;
        }
        return { actual, killed: !this.isAlive };
    }

    heal(amount) {
        const actual = Math.min(amount, this.maxHp - this.currentHp);
        this.currentHp += actual;
        return actual;
    }

    canUseSkill(skillId) {
        return !this.cooldowns[skillId] || this.cooldowns[skillId] <= 0;
    }

    putOnCooldown(skillId, rounds) {
        this.cooldowns[skillId] = rounds;
    }

    tickCooldowns() {
        for (const skillId of Object.keys(this.cooldowns)) {
            if (this.cooldowns[skillId] > 0) {
                this.cooldowns[skillId]--;
            }
        }
    }

    // ==================== STATUS EFFECT METHODS ====================

    /**
     * Apply a status effect to this combatant
     * @param {StatusEffect|string} effect - StatusEffect instance or template name
     * @param {Combatant} source - Who applied the effect
     * @returns {Object} { applied: boolean, action: CombatAction|null }
     */
    applyStatusEffect(effect, source = null) {
        // Create from template if string
        if (typeof effect === 'string') {
            const template = STATUS_EFFECT_TEMPLATES[effect];
            if (!template) {
                Utils.warn(`Unknown status effect template: ${effect}`);
                return { applied: false, action: null };
            }
            effect = new StatusEffect({
                ...template,
                sourceId: source?.id,
                sourceName: source?.name || 'Unknown',
            });
        }

        // Check for existing effect of same type
        const existingIndex = this.statusEffects.findIndex(e => e.type === effect.type);

        if (existingIndex >= 0) {
            const existing = this.statusEffects[existingIndex];

            if (effect.stackable) {
                // Add stacks
                existing.addStacks(1);
                existing.refresh();
            } else if (effect.refreshable) {
                // Refresh duration
                existing.refresh();
            }
            // If not stackable or refreshable, effect is ignored

            return {
                applied: true,
                action: new CombatAction({
                    type: CombatActionType.STATUS_APPLY,
                    actorId: source?.id,
                    actorName: source?.name || 'Unknown',
                    actorIsHero: source?.isHero || false,
                    targetId: this.id,
                    targetName: this.name,
                    description: `${effect.icon} ${this.name} is ${effect.name.toLowerCase()} (${existing.stacks > 1 ? `${existing.stacks} stacks, ` : ''}${existing.duration} turns)`,
                }),
            };
        }

        // Apply new effect
        this.statusEffects.push(effect);

        // Add to buffs/debuffs for backwards compatibility
        if (this.isBuffEffect(effect.type)) {
            this.buffs.push(effect);
        } else {
            this.debuffs.push(effect);
        }

        return {
            applied: true,
            action: new CombatAction({
                type: CombatActionType.STATUS_APPLY,
                actorId: source?.id,
                actorName: source?.name || 'Unknown',
                actorIsHero: source?.isHero || false,
                targetId: this.id,
                targetName: this.name,
                description: `${effect.icon} ${this.name} is now ${effect.name.toLowerCase()} (${effect.duration} turns)`,
            }),
        };
    }

    /**
     * Remove a status effect by type
     * @param {string} effectType - StatusEffectType to remove
     * @returns {StatusEffect|null} Removed effect or null
     */
    removeStatusEffect(effectType) {
        const index = this.statusEffects.findIndex(e => e.type === effectType);
        if (index < 0) return null;

        const removed = this.statusEffects.splice(index, 1)[0];

        // Remove from buffs/debuffs
        if (this.isBuffEffect(effectType)) {
            const buffIndex = this.buffs.findIndex(e => e.type === effectType);
            if (buffIndex >= 0) this.buffs.splice(buffIndex, 1);
        } else {
            const debuffIndex = this.debuffs.findIndex(e => e.type === effectType);
            if (debuffIndex >= 0) this.debuffs.splice(debuffIndex, 1);
        }

        return removed;
    }

    /**
     * Check if combatant has a status effect
     * @param {string} effectType - StatusEffectType to check
     * @returns {StatusEffect|null}
     */
    hasStatusEffect(effectType) {
        return this.statusEffects.find(e => e.type === effectType) || null;
    }

    /**
     * Get all status effects of a specific timing
     * @param {string} timing - StatusTiming
     * @returns {Array<StatusEffect>}
     */
    getEffectsByTiming(timing) {
        return this.statusEffects.filter(e => e.timing === timing);
    }

    /**
     * Process status effects at start of turn
     * @returns {Array<CombatAction>} Actions generated by effects
     */
    processStartOfTurnEffects() {
        const actions = [];
        const effects = this.getEffectsByTiming(StatusTiming.START_OF_TURN);

        for (const effect of effects) {
            const action = this.processEffectTick(effect);
            if (action) actions.push(action);
        }

        return actions;
    }

    /**
     * Process status effects at end of turn
     * @returns {Array<CombatAction>} Actions generated by effects
     */
    processEndOfTurnEffects() {
        const actions = [];
        const effects = this.getEffectsByTiming(StatusTiming.END_OF_TURN);

        for (const effect of effects) {
            const action = this.processEffectTick(effect);
            if (action) actions.push(action);
        }

        // Tick all effect durations and remove expired ones
        const expiredEffects = [];
        for (const effect of this.statusEffects) {
            if (effect.tick()) {
                expiredEffects.push(effect);
            }
        }

        // Remove expired effects and create expiry actions
        for (const expired of expiredEffects) {
            this.removeStatusEffect(expired.type);
            actions.push(new CombatAction({
                type: CombatActionType.STATUS_EXPIRE,
                targetId: this.id,
                targetName: this.name,
                description: `${expired.icon} ${this.name}'s ${expired.name.toLowerCase()} effect faded`,
            }));
        }

        return actions;
    }

    /**
     * Process a single effect tick (DoT damage, HoT healing, etc.)
     * @param {StatusEffect} effect
     * @returns {CombatAction|null}
     */
    processEffectTick(effect) {
        const effectValue = effect.getEffectiveValue();

        // DoT effects
        if ([StatusEffectType.POISON, StatusEffectType.BURN, StatusEffectType.BLEED].includes(effect.type)) {
            let damage = effect.percentage
                ? Math.floor(this.maxHp * effectValue)
                : Math.floor(effectValue + effect.flatValue);

            const { actual, killed } = this.takeDamage(damage);

            return new CombatAction({
                type: CombatActionType.DOT_TICK,
                targetId: this.id,
                targetName: this.name,
                damage: actual,
                damageType: effect.damageType,
                killed,
                description: `${effect.icon} ${this.name} takes ${actual} ${effect.name.toLowerCase()} damage${killed ? ' and dies!' : ''}`,
            });
        }

        // HoT effects
        if (effect.type === StatusEffectType.REGEN) {
            let healing = effect.percentage
                ? Math.floor(this.maxHp * effectValue)
                : Math.floor(effectValue);

            const actual = this.heal(healing);

            return new CombatAction({
                type: CombatActionType.HOT_TICK,
                targetId: this.id,
                targetName: this.name,
                healing: actual,
                description: `${effect.icon} ${this.name} regenerates ${actual} HP`,
            });
        }

        return null;
    }

    /**
     * Get modified stat value accounting for status effects
     * @param {string} stat - Stat name (atk, def, will, spd)
     * @returns {number} Modified stat value
     */
    getModifiedStat(stat) {
        let value = this.stats[stat] || 0;

        // Apply buff/debuff modifiers
        for (const effect of this.statusEffects) {
            if (effect.type === StatusEffectType.ATK_UP && stat === 'atk') {
                value = Math.floor(value * (1 + effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.ATK_DOWN && stat === 'atk') {
                value = Math.floor(value * (1 - effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.DEF_UP && stat === 'def') {
                value = Math.floor(value * (1 + effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.DEF_DOWN && stat === 'def') {
                value = Math.floor(value * (1 - effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.WILL_UP && stat === 'will') {
                value = Math.floor(value * (1 + effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.WILL_DOWN && stat === 'will') {
                value = Math.floor(value * (1 - effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.SPD_UP && stat === 'spd') {
                value = Math.floor(value * (1 + effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.SPD_DOWN && stat === 'spd') {
                value = Math.floor(value * (1 - effect.getEffectiveValue()));
            } else if (effect.type === StatusEffectType.SLOW && stat === 'spd') {
                value = Math.floor(value * (1 - effect.getEffectiveValue()));
            }
        }

        return Math.max(1, value); // Minimum stat of 1
    }

    /**
     * Check if combatant can act (not stunned/incapacitated)
     * @returns {boolean}
     */
    canAct() {
        return this.isAlive && !this.hasStatusEffect(StatusEffectType.STUN);
    }

    /**
     * Check if combatant can use skills (not silenced)
     * @returns {boolean}
     */
    canUseSkills() {
        return !this.hasStatusEffect(StatusEffectType.SILENCE);
    }

    /**
     * Get miss chance from blind effect
     * @returns {number} Miss chance (0-1)
     */
    getMissChance() {
        const blind = this.hasStatusEffect(StatusEffectType.BLIND);
        return blind ? blind.getEffectiveValue() : 0;
    }

    /**
     * Get damage taken multiplier from vulnerable/marked effects
     * @returns {number} Damage multiplier (1 = normal)
     */
    getDamageTakenMultiplier() {
        let multiplier = 1;

        const vulnerable = this.hasStatusEffect(StatusEffectType.VULNERABLE);
        if (vulnerable) {
            multiplier *= (1 + vulnerable.getEffectiveValue());
        }

        const marked = this.hasStatusEffect(StatusEffectType.MARKED);
        if (marked) {
            multiplier *= (1 + marked.getEffectiveValue());
            // Marked is consumed on hit
            this.removeStatusEffect(StatusEffectType.MARKED);
        }

        return multiplier;
    }

    /**
     * Process shield absorption
     * @param {number} damage - Incoming damage
     * @returns {number} Remaining damage after shield
     */
    processShieldAbsorption(damage) {
        const shield = this.hasStatusEffect(StatusEffectType.SHIELD);
        if (!shield) return damage;

        const absorbed = Math.min(damage, shield.value);
        shield.value -= absorbed;

        // Remove shield if depleted
        if (shield.value <= 0) {
            this.removeStatusEffect(StatusEffectType.SHIELD);
        }

        return damage - absorbed;
    }

    /**
     * Check if effect type is a buff (vs debuff)
     * @param {string} effectType
     * @returns {boolean}
     */
    isBuffEffect(effectType) {
        return [
            StatusEffectType.REGEN,
            StatusEffectType.LIFESTEAL_BUFF,
            StatusEffectType.ATK_UP,
            StatusEffectType.DEF_UP,
            StatusEffectType.WILL_UP,
            StatusEffectType.SPD_UP,
            StatusEffectType.CRIT_UP,
            StatusEffectType.SHIELD,
            StatusEffectType.THORNS,
            StatusEffectType.UNDYING,
        ].includes(effectType);
    }

    /**
     * Get all active status effect icons for display
     * @returns {string}
     */
    getStatusIcons() {
        return this.statusEffects.map(e => e.icon).join('');
    }
}

/**
 * Main Combat Engine
 */
const CombatEngine = {
    /**
     * Run a full encounter simulation using duelist system
     * @param {Hero} hero - The hero fighting
     * @param {Array} mobs - Array of mob instances
     * @param {Object} gearBonuses - Optional gear stat bonuses (e.g., { leech: 5 } for 5% lifesteal)
     * @param {Object} questTriggers - Quest-level trigger tracking (for Second Wind, Undying)
     * @returns {CombatResult}
     */
    runEncounter(hero, mobs, gearBonuses = {}, questTriggers = null) {
        Utils.log('Starting combat encounter (duelist mode)');

        const result = new CombatResult();

        // Apply gear stat bonuses to hero's effective stats
        const effectiveStats = {
            atk: hero.stats.atk + (gearBonuses.atk || 0),
            will: hero.stats.will + (gearBonuses.will || 0),
            def: hero.stats.def + (gearBonuses.def || 0),
            spd: hero.stats.spd + (gearBonuses.spd || 0),
        };

        // Calculate effective maxHp with gear bonuses (base + gear HP bonus)
        const baseMaxHp = Utils.calcHP(hero.level, effectiveStats.def);
        const effectiveMaxHp = baseMaxHp + (gearBonuses.hp || 0);

        // Ensure currentHp doesn't exceed new maxHp
        const effectiveCurrentHp = Math.min(hero.currentHp, effectiveMaxHp);

        Utils.log('Effective combat stats:', effectiveStats, 'MaxHP:', effectiveMaxHp, 'Gear bonuses:', gearBonuses);

        // Create hero combatant with gear-enhanced stats
        const heroCombatant = new Combatant({
            id: hero.id,
            name: hero.name,
            stats: effectiveStats,
            level: hero.level,
            maxHp: effectiveMaxHp,
            currentHp: effectiveCurrentHp,
            skills: hero.skills,
            gearBonuses: gearBonuses,
        }, true, false);

        // Create all enemies (for AoE tracking)
        const allEnemies = mobs.map(mob => new Combatant(mob, false, false));

        // Enemy queue for duelist system
        const enemyQueue = [...allEnemies];
        let pendingFreeHit = false; // Track if next enemy gets a free hit

        let roundNumber = 0;
        const MAX_ROUNDS = 100;

        // Fight enemies one at a time
        while (enemyQueue.length > 0 && heroCombatant.isAlive && roundNumber < MAX_ROUNDS) {
            const currentEnemy = enemyQueue[0];
            if (!currentEnemy.isAlive) {
                enemyQueue.shift();
                continue;
            }

            roundNumber++;
            const round = new CombatRound(roundNumber);

            // FREE HIT: Next enemy attacks first if previous enemy died
            if (pendingFreeHit) {
                const freeHitAction = this.executeFreeHit(currentEnemy, heroCombatant);
                if (freeHitAction) {
                    round.addAction(freeHitAction);
                    result.totalDamageTaken += freeHitAction.damage || 0;
                }
                pendingFreeHit = false;
            }

            // Check if hero still alive after free hit
            if (!heroCombatant.isAlive) {
                result.addRound(round);
                break;
            }

            // DUEL: Determine who goes first (speed check with coin flip on ties)
            const heroGoesFirst = this.resolveSpeedCheck(heroCombatant, currentEnemy);
            const duelOrder = heroGoesFirst
                ? [heroCombatant, currentEnemy]
                : [currentEnemy, heroCombatant];

            let heroUsedAoE = false;

            // Execute duel turns
            for (const actor of duelOrder) {
                if (!actor.isAlive) continue;

                if (actor.isHero) {
                    // Skip if enemy already dead (e.g., killed by thorns)
                    if (!currentEnemy.isAlive) continue;

                    // Hero attacks - check for AoE
                    const livingEnemies = allEnemies.filter(e => e.isAlive);
                    const action = this.executeAction(actor, [currentEnemy], livingEnemies, hero);

                    if (action) {
                        round.addAction(action);
                        result.totalDamageDealt += action.damage || 0;

                        // Track if AoE was used
                        if (action.isAoE) {
                            heroUsedAoE = true;
                            // Count all kills from AoE
                            const aoeKills = action.aoeDamage.filter(d => d.killed).length;
                            result.enemiesKilled += aoeKills;
                            actor.killCount += aoeKills;
                        } else {
                            // Single target kill tracking
                            if (action.killed) {
                                result.enemiesKilled++;
                                actor.killCount++;
                            }
                        }
                    }

                    // Check for triggered abilities
                    const triggers = this.checkTriggers(actor, action, allEnemies, hero, questTriggers);
                    triggers.forEach(t => {
                        round.addAction(t);
                        if (t.damage && t.actorIsHero) result.totalDamageDealt += t.damage;
                    });
                } else {
                    // Skip if hero already dead
                    if (!heroCombatant.isAlive) continue;

                    // Enemy attacks hero
                    const action = this.executeAction(actor, [heroCombatant], allEnemies, hero);

                    if (action) {
                        round.addAction(action);
                        result.totalDamageTaken += action.damage || 0;
                    }

                    // Check for hero triggered abilities (thorns, second wind, etc.)
                    const heroTriggers = this.checkTriggers(heroCombatant, action, allEnemies, hero, questTriggers);
                    heroTriggers.forEach(t => round.addAction(t));

                    // Check for enemy triggered abilities (second wind, etc.) - enemies don't use quest triggers
                    const enemyTriggers = this.checkTriggers(actor, action, allEnemies, hero, null);
                    enemyTriggers.forEach(t => round.addAction(t));
                }
            }

            // Remove all dead enemies from queue (AoE can kill multiple)
            while (enemyQueue.length > 0 && !enemyQueue[0].isAlive) {
                enemyQueue.shift();
            }

            // Check if current enemy died and set up free hit for next enemy
            if (!currentEnemy.isAlive && enemyQueue.length > 0) {
                // Only grant free hit if hero used single-target attack (not AoE)
                if (!heroUsedAoE) {
                    pendingFreeHit = true;
                }
            }

            // Tick cooldowns
            heroCombatant.tickCooldowns();
            allEnemies.forEach(e => e.tickCooldowns());

            result.addRound(round);
        }

        // Victory check
        result.victory = heroCombatant.isAlive && allEnemies.every(e => !e.isAlive);
        result.heroSurvived = heroCombatant.isAlive;

        // Update hero's current HP
        hero.currentHp = heroCombatant.currentHp;

        Utils.log(`Combat ended: ${result.victory ? 'Victory' : 'Defeat'}`);
        return result;
    },

    /**
     * Resolve speed check between two combatants
     * Faster goes first, ties resolved by coin flip
     */
    resolveSpeedCheck(a, b) {
        if (a.spd > b.spd) return true;
        if (a.spd < b.spd) return false;
        // Tie: coin flip
        return Math.random() < 0.5;
    },

    /**
     * Execute a free hit (enemy gets free attack when previous enemy dies)
     * Does 50% damage and cannot kill (leaves hero at 1 HP minimum)
     */
    executeFreeHit(enemy, hero) {
        // Calculate normal damage
        let damage = Utils.calcPhysicalDamage(enemy.atk, hero.def);

        // Apply free hit multiplier (50%)
        damage = Math.floor(damage * CONFIG.FREE_HIT.DAMAGE_MULT);

        // Cap damage so hero can't die (leave at minimum HP)
        const maxDamage = hero.currentHp - CONFIG.FREE_HIT.MIN_HP_REMAINING;
        if (damage > maxDamage) {
            damage = Math.max(0, maxDamage);
        }

        // Apply damage
        const { actual } = hero.takeDamage(damage);

        // Ensure hero stays at minimum HP (safety check)
        if (hero.currentHp < CONFIG.FREE_HIT.MIN_HP_REMAINING) {
            hero.currentHp = CONFIG.FREE_HIT.MIN_HP_REMAINING;
            hero.isAlive = true;
        }

        return new CombatAction({
            type: CombatActionType.ATTACK,
            actorId: enemy.id,
            actorName: enemy.name,
            actorIsHero: false,
            targetId: hero.id,
            targetName: hero.name,
            damage: actual,
            damageType: 'physical',
            isFreeHit: true,
            killed: false, // Free hits can never kill
            description: `${enemy.name} capitalizes on the opening and strikes ${hero.name} for ${actual} damage!`,
        });
    },

    /**
     * Execute a single action
     * @param {Combatant} actor - The attacking combatant
     * @param {Array} targets - Primary targets (usually just the current duel opponent)
     * @param {Array} allEnemies - All living enemies (for AoE/cleave)
     * @param {Hero} hero - The hero object for skill lookups
     */
    executeAction(actor, targets, allEnemies, hero) {
        // Select primary target
        const target = this.selectTarget(targets);
        if (!target) return null;

        // Choose skill or basic attack (pass allEnemies for AoE/cleave decisions)
        const { skillId, skillDef } = this.chooseSkill(actor, target, hero, allEnemies);

        // Determine if this is an AoE/cleave attack
        const isAoE = skillDef && (skillDef.target === SkillTarget.AOE);
        const isCleave = skillDef && (skillDef.target === SkillTarget.CLEAVE);

        // Calculate damage
        let damage = 0;
        let damageType = 'physical';
        let isCritical = false;
        let healing = 0;

        if (skillDef) {
            const result = this.calculateSkillDamage(actor, target, skillDef, hero);
            damage = result.damage;
            damageType = result.damageType;
            isCritical = result.isCritical;

            // Handle healing skills
            if (skillDef.target === SkillTarget.SELF && skillDef.baseValue > 0 && skillDef.damageType === DamageType.NONE) {
                healing = Math.floor(actor.maxHp * this.getSkillEffectValue(skillDef, hero, skillId));
                actor.heal(healing);
            }
        } else {
            // Basic attack - physical
            damage = Utils.calcPhysicalDamage(actor.atk, target.def);
        }

        // Handle AoE/cleave multi-target damage
        let aoeDamage = [];
        let anyKilled = false;

        if ((isAoE || isCleave) && actor.isHero) {
            // Get targets for AoE/cleave
            let aoeTargets = allEnemies.filter(e => e.isAlive);
            if (isCleave) {
                // Cleave hits 2-3 targets (current + 1-2 more)
                aoeTargets = aoeTargets.slice(0, Math.min(3, aoeTargets.length));
            }

            // Apply damage to all AoE targets
            for (const aoeTarget of aoeTargets) {
                // Calculate damage for each target
                const dmgResult = skillDef
                    ? this.calculateSkillDamage(actor, aoeTarget, skillDef, hero)
                    : { damage: Utils.calcPhysicalDamage(actor.atk, aoeTarget.def), isCritical: false };

                const { actual: aoeActual, killed: aoeKilled } = aoeTarget.takeDamage(dmgResult.damage);

                aoeDamage.push({
                    targetId: aoeTarget.id,
                    targetName: aoeTarget.name,
                    damage: aoeActual,
                    killed: aoeKilled,
                });

                if (aoeKilled) anyKilled = true;
            }

            // Total damage for lifesteal
            damage = aoeDamage.reduce((sum, d) => sum + d.damage, 0);
        } else {
            // Single target damage
            const { actual, killed } = target.takeDamage(damage);
            damage = actual;
            anyKilled = killed;
        }

        // Lifesteal check (works on total damage for AoE)
        let leechHealing = 0;
        const leechValue = this.getPassiveValue(actor, 'leech', hero);
        if (leechValue > 0 && damage > 0) {
            // Always heal at least 1 HP when leech activates
            leechHealing = Math.max(1, Math.round(damage * leechValue));
            actor.heal(leechHealing);
            healing += leechHealing; // Add to action's healing for combat log
        }

        // Determine primary target killed status
        const primaryKilled = isAoE || isCleave
            ? aoeDamage.find(d => d.targetId === target.id)?.killed || false
            : anyKilled;

        // Create action record
        return new CombatAction({
            type: skillDef ? CombatActionType.SKILL : CombatActionType.ATTACK,
            actorId: actor.id,
            actorName: actor.name,
            actorIsHero: actor.isHero,
            targetId: target.id,
            targetName: target.name,
            skillId,
            skillName: skillDef?.name || 'Attack',
            damage: isAoE || isCleave ? aoeDamage.reduce((sum, d) => sum + d.damage, 0) : damage,
            damageType,
            healing,
            isCritical,
            killed: primaryKilled,
            isAoE: isAoE || isCleave,
            aoeDamage: aoeDamage,
            description: this.describeAction(actor, target, skillDef, damage, primaryKilled, isCritical, isAoE || isCleave, aoeDamage, healing),
        });
    },

    /**
     * Select target for attack
     * Strategy: Focus lowest HP target (only living targets)
     */
    selectTarget(targets) {
        // Filter to only living targets
        const livingTargets = targets.filter(t => t.isAlive && t.currentHp > 0);
        if (livingTargets.length === 0) return null;
        return livingTargets.reduce((lowest, t) =>
            t.currentHp < lowest.currentHp ? t : lowest
        );
    },

    /**
     * Choose which skill to use - smarter AI selection
     * Works for both heroes AND enemies
     *
     * Priorities:
     * 1. Execute skills on low HP targets
     * 2. AoE/Cleave when multiple enemies alive
     * 3. Highest damage skill available
     * 4. Basic attack as fallback (when all skills on cooldown)
     */
    chooseSkill(actor, target, hero, allEnemies = []) {
        // Get all available active skills
        const availableSkills = [];
        for (const skillRef of actor.skills) {
            const skillId = typeof skillRef === 'string' ? skillRef : skillRef.skillId;
            const skillDef = Skills.get(skillId);

            if (!skillDef) continue;
            if (skillDef.activation !== SkillActivation.ACTIVE) continue;
            if (!actor.canUseSkill(skillId)) continue;

            // Get rank (heroes have rank info, enemies use rank 1)
            const rank = actor.isHero && hero
                ? (hero.skills.find(s => s.skillId === skillId)?.rank || 1)
                : 1;

            availableSkills.push({ skillId, skillDef, skillRef, rank });
        }

        // If no skills available (all on cooldown or none exist), return null for basic attack
        if (availableSkills.length === 0) {
            return { skillId: null, skillDef: null };
        }

        // Calculate target HP percentage
        const targetHpPercent = target.currentHp / target.maxHp;

        // Count living enemies (for hero) or allies (for enemy - not used yet)
        const livingEnemies = allEnemies.filter(e => e.isAlive).length;

        // Score each skill based on situation
        let bestSkill = null;
        let bestScore = -1;

        for (const { skillId, skillDef, skillRef, rank } of availableSkills) {
            let score = skillDef.baseValue || 1;

            // Bonus for execute skills when target is low HP
            if (skillDef.executeBonus && targetHpPercent < 0.5) {
                // Execute bonus scales inversely with HP - huge bonus at low HP
                score += (1 - targetHpPercent) * 2;
            }

            // Bonus for AoE/Cleave when multiple enemies (for hero attacking)
            if (actor.isHero) {
                if (skillDef.target === SkillTarget.AOE && livingEnemies > 1) {
                    score += livingEnemies * 0.5; // More enemies = more value
                }
                if (skillDef.target === SkillTarget.CLEAVE && livingEnemies > 1) {
                    score += Math.min(livingEnemies, 3) * 0.4;
                }
            }

            // Bonus for high crit chance skills
            if (skillDef.critBonus) {
                score += skillDef.critBonus;
            }

            // Slight bonus for higher rank skills (more invested = more reliable)
            score += rank * 0.05;

            // Prefer magical damage against low-WILL targets, physical against low-DEF
            if (skillDef.damageType === DamageType.MAGICAL && target.will < target.def) {
                score += 0.2;
            } else if (skillDef.damageType === DamageType.PHYSICAL && target.def < target.will) {
                score += 0.2;
            }

            // Prefer lower cooldown skills slightly (more usable)
            const cooldown = Skills.getCooldownAtRank(skillDef, rank);
            if (cooldown === 0) {
                score += 0.3; // No cooldown is great
            } else if (cooldown === 1) {
                score += 0.1;
            }

            if (score > bestScore) {
                bestScore = score;
                bestSkill = { skillId, skillDef, rank };
            }
        }

        // Apply cooldown to chosen skill (using rank-based cooldown)
        if (bestSkill) {
            const cooldown = Skills.getCooldownAtRank(bestSkill.skillDef, bestSkill.rank);
            if (cooldown > 0) {
                actor.putOnCooldown(bestSkill.skillId, cooldown);
            }
        }

        return bestSkill || { skillId: null, skillDef: null };
    },

    /**
     * Calculate damage for a skill
     */
    calculateSkillDamage(actor, target, skillDef, hero) {
        let damage = 0;
        let damageType = skillDef.damageType || DamageType.PHYSICAL;
        let isCritical = false;

        // Get skill rank for hero skills
        const rank = this.getSkillRank(actor, skillDef.id, hero);
        const effectValue = Skills.calcEffectValue(skillDef, rank);

        if (skillDef.damageType === DamageType.PHYSICAL) {
            const baseDamage = Utils.calcPhysicalDamage(actor.atk, target.def);
            damage = Math.floor(baseDamage * effectValue);
        } else if (skillDef.damageType === DamageType.MAGICAL) {
            const baseDamage = Utils.calcMagicalDamage(actor.will, target.will);
            damage = Math.floor(baseDamage * effectValue);
        } else if (skillDef.damageType === DamageType.TRUE) {
            // True damage ignores defenses
            damage = Math.floor(actor.atk * effectValue);
        }

        // Hybrid scaling (like Holy Smite)
        if (skillDef.scalingWeights) {
            damage = 0;
            for (const [stat, weight] of Object.entries(skillDef.scalingWeights)) {
                const statValue = actor.stats[stat] || 0;
                if (skillDef.damageType === DamageType.MAGICAL) {
                    damage += Utils.calcMagicalDamage(Math.floor(statValue * weight), target.will);
                } else {
                    damage += Utils.calcPhysicalDamage(Math.floor(statValue * weight), target.def);
                }
            }
            damage = Math.floor(damage * effectValue);
        }

        // Execute bonus (bonus damage vs low HP)
        if (skillDef.executeBonus) {
            const missingHpPercent = 1 - (target.currentHp / target.maxHp);
            damage = Math.floor(damage * (1 + missingHpPercent));
        }

        // Critical hit check
        let critChance = 0.05; // Base 5% crit
        if (skillDef.critBonus) {
            critChance += skillDef.critBonus;
        }

        if (Math.random() < critChance) {
            isCritical = true;
            damage = Math.floor(damage * 1.5);
        }

        // Cleave/AoE would be handled differently (TODO: multi-target)

        return { damage: Math.max(damage, CONFIG.STATS.MIN_DAMAGE), damageType, isCritical };
    },

    /**
     * Get skill rank from hero
     */
    getSkillRank(actor, skillId, hero) {
        if (!actor.isHero) return 1;

        const skillRef = hero.skills.find(s => s.skillId === skillId);
        return skillRef?.rank || 1;
    },

    /**
     * Get skill effect value at current rank
     */
    getSkillEffectValue(skillDef, hero, skillId) {
        const rank = hero?.skills?.find(s => s.skillId === skillId)?.rank || 1;
        return Skills.calcEffectValue(skillDef, rank);
    },

    /**
     * Get passive ability value (from skills or gear bonuses)
     * Works for both heroes and enemies
     */
    getPassiveValue(actor, passiveId, hero) {
        let totalValue = 0;

        // Check for skill-based passive (e.g., Leech skill)
        if (actor.isHero && hero) {
            // Hero: use hero object for rank info
            const skillRef = hero.skills.find(s => s.skillId === passiveId);
            if (skillRef) {
                const skillDef = Skills.get(passiveId);
                if (skillDef && skillDef.activation === SkillActivation.PASSIVE) {
                    totalValue += Skills.calcEffectValue(skillDef, skillRef.rank);
                }
            }
        } else {
            // Enemy: check actor's skills (stored as string IDs)
            const hasSkill = actor.skills.some(s =>
                (typeof s === 'string' ? s : s.skillId) === passiveId
            );
            if (hasSkill) {
                const skillDef = Skills.get(passiveId);
                if (skillDef && skillDef.activation === SkillActivation.PASSIVE) {
                    // Enemies use rank 1
                    totalValue += Skills.calcEffectValue(skillDef, 1);
                }
            }
        }

        // Check for gear-based bonus (e.g., Vampiric affix gives 'leech' stat)
        // Gear leech is stored as a percentage value (e.g., 5 means 5%)
        if (actor.gearBonuses && actor.gearBonuses[passiveId]) {
            totalValue += actor.gearBonuses[passiveId] / 100; // Convert from % to decimal
        }

        return totalValue;
    },

    /**
     * Check for triggered abilities (works for both heroes and enemies)
     * @param {Combatant} actor - The combatant to check triggers for
     * @param {CombatAction} lastAction - The last combat action
     * @param {Array} allCombatants - All combatants in the fight
     * @param {Hero} hero - The hero object (for skill ranks)
     * @param {Object} questTriggers - Quest-level trigger tracking (for heroes only)
     */
    checkTriggers(actor, lastAction, allCombatants, hero, questTriggers = null) {
        const triggers = [];

        // Helper to check if actor has a skill
        const hasSkill = (skillId) => {
            if (actor.isHero && hero) {
                return hero.skills.find(s => s.skillId === skillId);
            }
            return actor.skills.some(s => (typeof s === 'string' ? s : s.skillId) === skillId);
        };

        // Helper to get skill rank
        const getSkillRank = (skillId) => {
            if (actor.isHero && hero) {
                const ref = hero.skills.find(s => s.skillId === skillId);
                return ref?.rank || 1;
            }
            return 1; // Enemies use rank 1
        };

        // Check for Second Wind (heal at low HP)
        // Heroes: Uses quest-level tracking with diminishing returns (100%, 50%, 25%, then stops)
        // Enemies: Once per encounter
        if (actor.currentHp < actor.maxHp * 0.3 && actor.currentHp > 0) {
            const secondWindSkill = hasSkill('second_wind');

            // Determine if Second Wind can trigger
            let canTrigger = false;
            let strengthMultiplier = 1.0;

            if (actor.isHero && questTriggers) {
                // Hero uses quest-level tracking with diminishing returns
                const triggerCount = questTriggers.second_wind_count || 0;
                if (triggerCount < 3 && !actor.triggeredThisCombat['second_wind']) {
                    canTrigger = true;
                    // Diminishing returns: 100% -> 50% -> 25%
                    if (triggerCount === 0) strengthMultiplier = 1.0;
                    else if (triggerCount === 1) strengthMultiplier = 0.5;
                    else if (triggerCount === 2) strengthMultiplier = 0.25;
                }
            } else {
                // Enemies: once per encounter (original behavior)
                canTrigger = secondWindSkill && !actor.triggeredThisCombat['second_wind'];
            }

            if (secondWindSkill && canTrigger) {
                const skillDef = Skills.get('second_wind');
                const rank = getSkillRank('second_wind');
                const baseHealPercent = Skills.calcEffectValue(skillDef, rank);
                const healPercent = baseHealPercent * strengthMultiplier;
                const healing = Math.floor(actor.maxHp * healPercent);
                actor.heal(healing);
                actor.triggeredThisCombat['second_wind'] = true;

                // Update quest-level tracking for heroes
                if (actor.isHero && questTriggers) {
                    questTriggers.second_wind_count++;
                }

                const strengthDesc = strengthMultiplier < 1 ? ` (${Math.round(strengthMultiplier * 100)}% strength)` : '';
                triggers.push(new CombatAction({
                    type: CombatActionType.TRIGGER,
                    actorId: actor.id,
                    actorName: actor.name,
                    actorIsHero: actor.isHero,
                    healing,
                    skillId: 'second_wind',
                    skillName: 'Second Wind',
                    description: `${actor.name}'s Second Wind activates${strengthDesc}, healing for ${healing} HP!`,
                }));
            }
        }

        // Check for Undying (survive lethal)
        // Heroes: Once per quest (uses questTriggers)
        // Enemies: Once per encounter
        if (actor.currentHp <= 0) {
            const undyingSkill = hasSkill('undying');

            // Determine if Undying can trigger
            let canTrigger = false;

            if (actor.isHero && questTriggers) {
                // Hero: once per quest
                canTrigger = undyingSkill && !questTriggers.undying_used;
            } else {
                // Enemy: once per encounter
                canTrigger = undyingSkill && !actor.triggeredThisCombat['undying'];
            }

            if (canTrigger) {
                const skillDef = Skills.get('undying');
                const rank = getSkillRank('undying');
                const healPercent = Skills.calcEffectValue(skillDef, rank);
                actor.currentHp = Math.floor(actor.maxHp * healPercent);
                actor.isAlive = true;
                actor.triggeredThisCombat['undying'] = true;

                // Update quest-level tracking for heroes
                if (actor.isHero && questTriggers) {
                    questTriggers.undying_used = true;
                }

                triggers.push(new CombatAction({
                    type: CombatActionType.TRIGGER,
                    actorId: actor.id,
                    actorName: actor.name,
                    actorIsHero: actor.isHero,
                    healing: actor.currentHp,
                    skillId: 'undying',
                    skillName: 'Undying',
                    description: `${actor.name} refuses to die! Undying activates!`,
                }));
            }
        }

        // Thorns damage (when hero is hit by enemy)
        if (lastAction && lastAction.damage > 0 && !lastAction.actorIsHero) {
            const target = allCombatants.find(c => c.id === lastAction.targetId);
            if (target?.isHero) {
                const thornsSkill = hero?.skills.find(s => s.skillId === 'thorns');
                if (thornsSkill) {
                    const skillDef = Skills.get('thorns');
                    const reflectPercent = Skills.calcEffectValue(skillDef, thornsSkill.rank);
                    const thornsDamage = Math.floor(lastAction.damage * reflectPercent);

                    const attacker = allCombatants.find(c => c.id === lastAction.actorId);
                    if (attacker && thornsDamage > 0) {
                        const { killed } = attacker.takeDamage(thornsDamage);

                        triggers.push(new CombatAction({
                            type: CombatActionType.TRIGGER,
                            actorId: target.id,
                            actorName: target.name,
                            actorIsHero: true,
                            targetId: attacker.id,
                            targetName: attacker.name,
                            damage: thornsDamage,
                            killed,
                            skillId: 'thorns',
                            skillName: 'Thorns',
                            description: `${target.name}'s Thorns reflects ${thornsDamage} damage to ${attacker.name}!`,
                        }));
                    }
                }
            }
        }

        return triggers;
    },

    /**
     * Create summons for hero
     */
    createSummons(hero) {
        // TODO: Implement summon system based on WILL and summon loadout
        // For now, return empty array
        return [];
    },

    /**
     * Generate action description text
     */
    describeAction(actor, target, skillDef, damage, killed, isCritical, isAoE = false, aoeDamage = [], healing = 0) {
        const critText = isCritical ? ' CRITICAL!' : '';
        const skillName = skillDef?.name || 'attacks';
        const healText = healing > 0 ? ` Leeches ${healing} HP!` : '';

        // AoE/cleave attack description
        if (isAoE && aoeDamage.length > 0) {
            const totalDamage = aoeDamage.reduce((sum, d) => sum + d.damage, 0);
            const kills = aoeDamage.filter(d => d.killed).map(d => d.targetName);
            const killText = kills.length > 0 ? ` ${kills.join(', ')} slain!` : '';
            const targetNames = aoeDamage.map(d => d.targetName).join(', ');

            return `${actor.name} uses ${skillName} hitting ${targetNames} for ${totalDamage} total damage!${critText}${killText}${healText}`;
        }

        // Single target attack
        const killText = killed ? ` ${target.name} is slain!` : '';
        return `${actor.name} ${skillName} ${target.name} for ${damage} damage!${critText}${killText}${healText}`;
    },

    /**
     * Run all encounters for a quest
     * @param {Hero} hero
     * @param {Quest} quest
     * @param {Object} gearBonuses - Optional gear stat bonuses (e.g., { leech: 5 } for 5% lifesteal)
     * @returns {Object} Full quest results
     */
    runQuest(hero, quest, gearBonuses = {}) {
        const results = {
            success: true,
            heroSurvived: true,
            encounters: [],
            // Reward breakdown
            questXp: 0,       // Base XP from quest completion
            mobXp: 0,         // XP from enemy kills
            totalXp: 0,       // questXp + mobXp
            questGold: 0,     // Base gold from quest completion
            mobGold: 0,       // Gold dropped by enemies
            totalGold: 0,     // questGold + mobGold
            totalSouls: 0,    // Soul drops from kills
            loot: [],
            effectiveMaxHp: null,
        };

        const template = quest.template;
        if (!template) {
            Utils.error('Quest has no template');
            return results;
        }

        // Calculate effective maxHp with gear bonuses for use throughout quest
        const effectiveDef = hero.stats.def + (gearBonuses.def || 0);
        const baseMaxHp = Utils.calcHP(hero.level, effectiveDef);
        const effectiveMaxHp = baseMaxHp + (gearBonuses.hp || 0);
        results.effectiveMaxHp = effectiveMaxHp;

        // Use quest.encounters (selected variant) not template.encounters
        const encounters = quest.encounters;
        if (!encounters || encounters.length === 0) {
            Utils.error('Quest has no encounters');
            return results;
        }

        // Quest-level trigger tracking (persists across all encounters)
        // - second_wind: count of times triggered (0-3, stops at 3)
        // - undying: boolean, once per quest
        const questTriggers = {
            second_wind_count: 0,
            undying_used: false,
        };

        // Calculate total gear BST for elite/boss scaling (sum of atk, def, spd, will bonuses)
        const heroGearBst = (gearBonuses.atk || 0) + (gearBonuses.def || 0) +
                           (gearBonuses.spd || 0) + (gearBonuses.will || 0);

        // Run each encounter
        for (let i = 0; i < encounters.length; i++) {
            const encounter = encounters[i];

            // Create mob instances scaled to hero level (with gear scaling for elite/boss)
            // encounter.mobTiers contains the spawn tier for each mob (for BESTIARY mobs)
            const mobs = encounter.mobs.map((mobId, idx) => {
                const tier = encounter.mobTiers ? encounter.mobTiers[idx] : null;
                return Quests.createMobInstance(mobId, hero.level, tier, heroGearBst);
            }).filter(Boolean);  // Filter out any null mobs (unknown IDs)

            // Skip empty encounters (all mobs failed to create)
            if (mobs.length === 0) {
                Utils.warn(`Encounter ${i} has no valid mobs, skipping`);
                continue;
            }

            // Run combat with gear bonuses and quest-level trigger tracking
            const combatResult = this.runEncounter(hero, mobs, gearBonuses, questTriggers);

            results.encounters.push({
                index: i,
                result: combatResult,
            });

            // Check if hero died
            if (!combatResult.heroSurvived) {
                results.success = false;
                results.heroSurvived = false;
                break;
            }

            // Generate loot from encounter (items drop at hero level)
            const lootItems = mobs.map(mob => {
                const item = GearGenerator.generateLoot(quest.difficulty, mob.tier, hero.level);
                if (item) results.loot.push(item);
                return item;
            }).filter(Boolean);

            // Calculate drops from kills (souls, XP, gold)
            for (const mob of mobs) {
                // Soul drops
                const soulDrops = CONFIG.SOUL_DROPS[mob.tier];
                if (soulDrops) {
                    results.totalSouls += Utils.randomInt(soulDrops.min, soulDrops.max);
                }
                // XP drops
                const xpDrops = CONFIG.ENEMY_LOOT.XP[mob.tier];
                if (xpDrops) {
                    results.mobXp += Utils.randomInt(xpDrops.min, xpDrops.max);
                }
                // Gold drops
                const goldDrops = CONFIG.ENEMY_LOOT.GOLD[mob.tier];
                if (goldDrops) {
                    results.mobGold += Utils.randomInt(goldDrops.min, goldDrops.max);
                }
            }

            // Between packs: hero catches their breath and recovers some health
            if (i < encounters.length - 1) {
                const healAmount = Math.floor(effectiveMaxHp * CONFIG.BETWEEN_PACKS.HEAL_PERCENT);
                if (healAmount > 0 && hero.currentHp < effectiveMaxHp) {
                    const hpBefore = hero.currentHp;
                    hero.currentHp = Math.min(hero.currentHp + healAmount, effectiveMaxHp);
                    const actualHeal = hero.currentHp - hpBefore;
                    if (actualHeal > 0) {
                        Utils.log(`${hero.name} catches their breath and recovers ${actualHeal} HP`);
                    }
                }
            }
        }

        // Calculate rewards if successful
        if (results.success) {
            // Get quest base rewards from bracket (uses new QUEST_REWARDS config)
            const bracketRewards = CONFIG.QUEST_REWARDS[quest.bracket];
            if (bracketRewards) {
                results.questXp = bracketRewards.xp;
                results.questGold = Utils.randomInt(bracketRewards.gold.min, bracketRewards.gold.max);
            }
        }

        // Calculate totals (mob drops are earned regardless of quest success)
        results.totalXp = results.questXp + results.mobXp;
        results.totalGold = results.questGold + results.mobGold;

        return results;
    },
};

Object.freeze(CombatEngine);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CombatActionType,
        CombatResult,
        CombatRound,
        CombatAction,
        Combatant,
        CombatEngine,
    };
}
