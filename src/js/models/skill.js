/**
 * ============================================
 * GUILD MASTER - Skill Model & Definitions
 * ============================================
 * Skills are innate to heroes - you can't teach new skills,
 * only upgrade the ones they were born with.
 *
 * SKILL MECHANICS (V3):
 * - Heroes roll 3 skills at recruitment
 * - Duplicates merge (doubled/tripled for higher max rank)
 * - Skills have 15-point trees:
 *   - 1× skill = 5 max points (Early tier only)
 *   - 2× skill = 10 max points (Early + Mid tiers)
 *   - 3× skill = 15 max points (Full tree + Capstone)
 * - Basic attack nerfed to 0.7× ATK (skills are 0.9-1.3×)
 * - 10 Archetypes determine hero art based on skills
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

/**
 * Archetypes - determine hero art based on skills
 * @readonly
 * @enum {string}
 */
const Archetype = {
    PYROMANCER: 'pyromancer',     // Fire mage (WILL)
    CRYOMANCER: 'cryomancer',     // Ice mage (WILL)
    STORMCALLER: 'stormcaller',   // Lightning mage (WILL)
    NECROMANCER: 'necromancer',   // Death magic (WILL)
    PALADIN: 'paladin',           // Holy warrior (ATK/WILL)
    WARRIOR: 'warrior',           // Martial melee (ATK)
    ROGUE: 'rogue',               // Stealth/crit (ATK/SPD)
    BERSERKER: 'berserker',       // Rage fighter (ATK)
    GUARDIAN: 'guardian',         // Tank/protect (DEF)
    SUMMONER: 'summoner',         // Minion master (WILL)
};

/**
 * Skill tree node types
 * @readonly
 * @enum {string}
 */
const NodeType = {
    MINOR: 'minor',       // Small bonuses (+damage, +crit)
    MAJOR: 'major',       // Significant effects (transforms, procs)
    CAPSTONE: 'capstone', // Build-defining (requires 14 points)
};

/**
 * Skill tree tiers
 * @readonly
 * @enum {string}
 */
const TreeTier = {
    EARLY: 'early',   // Points 1-5, accessible to all
    MID: 'mid',       // Points 6-10, requires ² or ³
    DEEP: 'deep',     // Points 11-15, requires ³ only
};

Object.freeze(SkillTarget);
Object.freeze(DamageType);
Object.freeze(SkillActivation);
Object.freeze(Archetype);
Object.freeze(NodeType);
Object.freeze(TreeTier);

/**
 * ============================================
 * SKILL DEFINITIONS (V3 - 50 Skills)
 * ============================================
 * Each skill has:
 * - id: Unique identifier
 * - name: Display name
 * - description: Flavor text
 * - archetype: Which archetype this skill belongs to
 * - activation: active/passive/trigger/summon
 * - target: targeting type
 * - damageType: physical/magical/true/none
 * - scaling: Array of stat names that affect damage
 * - baseValue: Base effect value (damage multiplier or effect strength)
 * - cooldown: Base cooldown (2 for all active, minimum 1)
 * - icon: Emoji icon
 * ============================================
 */
const SKILL_DEFINITIONS = {
    // ==================== PYROMANCER (5 skills) ====================

    fireball: {
        id: 'fireball',
        name: 'Fireball',
        description: 'Launch a ball of fire at a single target.',
        archetype: Archetype.PYROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.1,
        cooldown: 2,
        icon: '🔥',
    },

    flame_wave: {
        id: 'flame_wave',
        name: 'Flame Wave',
        description: 'Unleash a wave of fire hitting all enemies.',
        archetype: Archetype.PYROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.9,
        cooldown: 2,
        icon: '🌊',
    },

    ignite: {
        id: 'ignite',
        name: 'Ignite',
        description: 'Set a target ablaze. Deals damage over time.',
        archetype: Archetype.PYROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.3,           // Initial hit
        dotValue: 0.9,            // Total DOT over 3s
        dotDuration: 3,
        cooldown: 2,
        icon: '🔥',
    },

    fire_shield: {
        id: 'fire_shield',
        name: 'Fire Shield',
        description: 'Flames surround you, damaging melee attackers.',
        archetype: Archetype.PYROMANCER,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.25,          // Reflect 0.25 × WILL to attackers
        icon: '🛡️',
    },

    meteor: {
        id: 'meteor',
        name: 'Meteor',
        description: 'Call down a meteor on all enemies.',
        archetype: Archetype.PYROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.3,
        cooldown: 2,
        icon: '☄️',
    },

    // ==================== CRYOMANCER (5 skills) ====================

    ice_bolt: {
        id: 'ice_bolt',
        name: 'Ice Bolt',
        description: 'Hurl a shard of ice at a single target.',
        archetype: Archetype.CRYOMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.0,
        cooldown: 2,
        icon: '❄️',
    },

    frost_nova: {
        id: 'frost_nova',
        name: 'Frost Nova',
        description: 'Explode with frost, hitting all nearby enemies.',
        archetype: Archetype.CRYOMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.9,
        cooldown: 2,
        icon: '💠',
    },

    frozen_armor: {
        id: 'frozen_armor',
        name: 'Frozen Armor',
        description: 'Coat yourself in ice. +20% DEF.',
        archetype: Archetype.CRYOMANCER,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['def'],
        baseValue: 0.20,          // +20% DEF
        icon: '🧊',
    },

    blizzard: {
        id: 'blizzard',
        name: 'Blizzard',
        description: 'Summon a blizzard damaging all enemies over time.',
        archetype: Archetype.CRYOMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.35,          // Per turn
        dotDuration: 4,
        cooldown: 2,
        icon: '🌨️',
    },

    glacial_spike: {
        id: 'glacial_spike',
        name: 'Glacial Spike',
        description: 'Impale a target with a massive ice spike.',
        archetype: Archetype.CRYOMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.3,
        cooldown: 2,
        icon: '🗡️',
    },

    // ==================== STORMCALLER (5 skills) ====================

    spark: {
        id: 'spark',
        name: 'Spark',
        description: 'Zap a target with lightning.',
        archetype: Archetype.STORMCALLER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.95,
        cooldown: 2,
        icon: '⚡',
    },

    chain_lightning: {
        id: 'chain_lightning',
        name: 'Chain Lightning',
        description: 'Lightning jumps between enemies.',
        archetype: Archetype.STORMCALLER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,  // Chains to 3 more
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.9,
        chainCount: 3,
        chainDecay: 0.20,         // -20% per jump
        cooldown: 2,
        icon: '⛓️',
    },

    thunder_strike: {
        id: 'thunder_strike',
        name: 'Thunder Strike',
        description: 'Call down thunder on a target. High burst.',
        archetype: Archetype.STORMCALLER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.2,
        cooldown: 2,
        icon: '🌩️',
    },

    static_field: {
        id: 'static_field',
        name: 'Static Field',
        description: 'Passive aura shocking nearby enemies each turn.',
        archetype: Archetype.STORMCALLER,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.15,          // Per turn to all enemies
        icon: '💫',
    },

    storm_call: {
        id: 'storm_call',
        name: 'Storm Call',
        description: 'Summon a storm. AOE damage over time.',
        archetype: Archetype.STORMCALLER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.4,           // Per turn
        dotDuration: 3,
        cooldown: 2,
        icon: '🌪️',
    },

    // ==================== NECROMANCER (5 skills) ====================

    soul_rend: {
        id: 'soul_rend',
        name: 'Soul Rend',
        description: 'Tear at target\'s soul. Ignores some defense.',
        archetype: Archetype.NECROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 1.1,
        willResistMult: 0.5,      // Target WILL counts as 50%
        cooldown: 2,
        icon: '👻',
    },

    life_drain: {
        id: 'life_drain',
        name: 'Life Drain',
        description: 'Drain life from target. Heal 50% of damage.',
        archetype: Archetype.NECROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.95,
        healPercent: 0.50,
        cooldown: 2,
        icon: '🩸',
    },

    raise_skeleton: {
        id: 'raise_skeleton',
        name: 'Raise Skeleton',
        description: 'Summon a skeleton warrior.',
        archetype: Archetype.NECROMANCER,
        activation: SkillActivation.SUMMON,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        summonType: 'skeleton',
        summonStatPercent: 0.35,  // 35% caster WILL as ATK/DEF
        cooldown: 2,
        icon: '💀',
    },

    corpse_explosion: {
        id: 'corpse_explosion',
        name: 'Corpse Explosion',
        description: 'Detonate a corpse. Cleave damage.',
        archetype: Archetype.NECROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.CLEAVE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.9,
        corpseHpPercent: 0.20,    // +20% corpse max HP
        requiresCorpse: true,
        cooldown: 2,
        icon: '💥',
    },

    death_mark: {
        id: 'death_mark',
        name: 'Death Mark',
        description: 'Mark target for death. +25% damage taken.',
        archetype: Archetype.NECROMANCER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.25,          // +25% damage taken
        effectDuration: 4,
        cooldown: 2,
        icon: '☠️',
    },

    // ==================== PALADIN (5 skills) ====================

    holy_smite: {
        id: 'holy_smite',
        name: 'Holy Smite',
        description: 'Strike with divine power. Hybrid scaling.',
        archetype: Archetype.PALADIN,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.MAGICAL,
        scaling: ['atk', 'will', 'def'],
        scalingWeights: { atk: 0.35, will: 0.35, def: 0.30 },
        baseValue: 1.0,
        cooldown: 2,
        icon: '✝️',
    },

    lay_on_hands: {
        id: 'lay_on_hands',
        name: 'Lay on Hands',
        description: 'Heal self or ally for 40% max HP.',
        archetype: Archetype.PALADIN,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.40,          // Heal 40% max HP
        cooldown: 2,
        icon: '🙏',
    },

    divine_shield: {
        id: 'divine_shield',
        name: 'Divine Shield',
        description: 'Immune to damage for 1 turn. 4 turn cooldown.',
        archetype: Archetype.PALADIN,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 1.0,           // Full immunity
        effectDuration: 1,
        cooldown: 4,
        icon: '🛡️',
    },

    holy_aura: {
        id: 'holy_aura',
        name: 'Holy Aura',
        description: 'Passive regen. Heal 3% HP per turn.',
        archetype: Archetype.PALADIN,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.03,          // 3% HP per turn
        icon: '✨',
    },

    consecration: {
        id: 'consecration',
        name: 'Consecration',
        description: 'Bless the ground. AOE damage and ally healing.',
        archetype: Archetype.PALADIN,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.MAGICAL,
        scaling: ['will'],
        baseValue: 0.6,
        allyHealPercent: 0.15,    // Heal allies 15%
        cooldown: 2,
        icon: '⭐',
    },

    // ==================== WARRIOR (5 skills) ====================

    cleave: {
        id: 'cleave',
        name: 'Cleave',
        description: 'Powerful swing hitting 2-3 enemies.',
        archetype: Archetype.WARRIOR,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.CLEAVE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 1.0,
        cooldown: 2,
        icon: '🗡️',
    },

    charge: {
        id: 'charge',
        name: 'Charge',
        description: 'Rush an enemy. Stun 1 turn.',
        archetype: Archetype.WARRIOR,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 0.9,
        stunDuration: 1,
        cooldown: 2,
        icon: '🐎',
    },

    whirlwind: {
        id: 'whirlwind',
        name: 'Whirlwind',
        description: 'Spin attack hitting all enemies.',
        archetype: Archetype.WARRIOR,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.AOE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 0.85,
        cooldown: 2,
        icon: '🌀',
    },

    battle_cry: {
        id: 'battle_cry',
        name: 'Battle Cry',
        description: 'Boost ATK by 30% for 3 turns.',
        archetype: Archetype.WARRIOR,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.30,          // +30% ATK
        effectDuration: 3,
        cooldown: 2,
        icon: '📢',
    },

    execute: {
        id: 'execute',
        name: 'Execute',
        description: 'Massive damage to low HP targets.',
        archetype: Archetype.WARRIOR,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 1.0,
        executeBonus: true,       // Bonus vs low HP
        cooldown: 2,
        icon: '⚔️',
    },

    // ==================== ROGUE (5 skills) ====================

    backstab: {
        id: 'backstab',
        name: 'Backstab',
        description: 'Strike from shadows. High crit chance.',
        archetype: Archetype.ROGUE,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk', 'spd'],
        scalingWeights: { atk: 0.7, spd: 0.3 },
        baseValue: 1.1,
        critBonus: 0.20,          // +20% crit chance
        cooldown: 2,
        icon: '🗡️',
    },

    shadow_strike: {
        id: 'shadow_strike',
        name: 'Shadow Strike',
        description: 'Attack from stealth. Guaranteed crit if stealthed.',
        archetype: Archetype.ROGUE,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 1.2,
        stealthCrit: true,
        cooldown: 2,
        icon: '👤',
    },

    evade: {
        id: 'evade',
        name: 'Evade',
        description: 'Passive dodge chance. 15% avoid attacks.',
        archetype: Archetype.ROGUE,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['spd'],
        baseValue: 0.15,          // 15% dodge
        icon: '💨',
    },

    ambush: {
        id: 'ambush',
        name: 'Ambush',
        description: 'Enter stealth. Next attack crits.',
        archetype: Archetype.ROGUE,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 1.0,
        grantsStealth: true,
        cooldown: 2,
        icon: '🥷',
    },

    assassinate: {
        id: 'assassinate',
        name: 'Assassinate',
        description: 'Execute from stealth. Huge damage to low HP.',
        archetype: Archetype.ROGUE,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk', 'spd'],
        scalingWeights: { atk: 0.6, spd: 0.4 },
        baseValue: 1.3,
        executeBonus: true,
        cooldown: 2,
        icon: '☠️',
    },

    // ==================== BERSERKER (5 skills) ====================

    rampage: {
        id: 'rampage',
        name: 'Rampage',
        description: 'Wild attack. Damage increases per hit.',
        archetype: Archetype.BERSERKER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 0.9,
        stackingDamage: 0.10,     // +10% per use this combat
        cooldown: 2,
        icon: '💢',
    },

    frenzy: {
        id: 'frenzy',
        name: 'Frenzy',
        description: 'Passive. Attack faster as HP drops.',
        archetype: Archetype.BERSERKER,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.30,          // Up to +30% SPD at low HP
        icon: '😤',
    },

    blood_rage: {
        id: 'blood_rage',
        name: 'Blood Rage',
        description: 'Sacrifice HP for massive damage boost.',
        archetype: Archetype.BERSERKER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.50,          // +50% damage
        hpCost: 0.15,             // Costs 15% HP
        effectDuration: 3,
        cooldown: 2,
        icon: '🩸',
    },

    reckless_blow: {
        id: 'reckless_blow',
        name: 'Reckless Blow',
        description: 'Devastating attack. Take damage too.',
        archetype: Archetype.BERSERKER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['atk'],
        baseValue: 1.5,
        selfDamagePercent: 0.10,  // Take 10% max HP
        cooldown: 2,
        icon: '💥',
    },

    berserk: {
        id: 'berserk',
        name: 'Berserk',
        description: 'Enter rage. +40% ATK, -20% DEF, 4 turns.',
        archetype: Archetype.BERSERKER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.40,          // +40% ATK
        defPenalty: 0.20,         // -20% DEF
        effectDuration: 4,
        cooldown: 2,
        icon: '🔥',
    },

    // ==================== GUARDIAN (5 skills) ====================

    shield_block: {
        id: 'shield_block',
        name: 'Shield Block',
        description: 'Passive damage reduction scaling with DEF.',
        archetype: Archetype.GUARDIAN,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['def'],
        baseValue: 0.08,          // -8% damage + DEF scaling
        icon: '🛡️',
    },

    taunt: {
        id: 'taunt',
        name: 'Taunt',
        description: 'Force enemy to attack you for 2 turns.',
        archetype: Archetype.GUARDIAN,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SINGLE,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 2,             // 2 turn duration
        cooldown: 2,
        icon: '😠',
    },

    fortify: {
        id: 'fortify',
        name: 'Fortify',
        description: 'Boost DEF and WILL by 30% for 3 turns.',
        archetype: Archetype.GUARDIAN,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.30,          // +30% DEF and WILL
        effectDuration: 3,
        cooldown: 2,
        icon: '🏰',
    },

    retaliate: {
        id: 'retaliate',
        name: 'Retaliate',
        description: 'Counter when hit. 35% chance, 0.5× DEF damage.',
        archetype: Archetype.GUARDIAN,
        activation: SkillActivation.TRIGGER,
        target: SkillTarget.SINGLE,
        damageType: DamageType.PHYSICAL,
        scaling: ['def'],
        baseValue: 0.5,           // 0.5 × DEF damage
        procChance: 0.35,         // 35% trigger
        triggerCondition: 'on_hit',
        icon: '⚡',
    },

    last_stand: {
        id: 'last_stand',
        name: 'Last Stand',
        description: 'At <20% HP: +60% DEF, immune to death 2 turns.',
        archetype: Archetype.GUARDIAN,
        activation: SkillActivation.TRIGGER,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['def'],
        baseValue: 0.60,          // +60% DEF
        triggerCondition: 'hp_below_20',
        effectDuration: 2,
        oncePerQuest: true,
        icon: '🦸',
    },

    // ==================== SUMMONER (5 skills) ====================

    summon_wolf: {
        id: 'summon_wolf',
        name: 'Summon Wolf',
        description: 'Call wolf companion. 45% WILL as ATK, high SPD.',
        archetype: Archetype.SUMMONER,
        activation: SkillActivation.SUMMON,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        summonType: 'wolf',
        summonStatPercent: 0.45,
        cooldown: 2,
        icon: '🐺',
    },

    summon_skeleton: {
        id: 'summon_skeleton',
        name: 'Summon Skeleton',
        description: 'Raise skeleton warrior. 35% WILL as ATK/DEF.',
        archetype: Archetype.SUMMONER,
        activation: SkillActivation.SUMMON,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        summonType: 'skeleton',
        summonStatPercent: 0.35,
        cooldown: 2,
        icon: '💀',
    },

    summon_golem: {
        id: 'summon_golem',
        name: 'Summon Golem',
        description: 'Create stone golem. 65% WILL as DEF, slow.',
        archetype: Archetype.SUMMONER,
        activation: SkillActivation.SUMMON,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: ['will'],
        summonType: 'golem',
        summonStatPercent: 0.65,
        cooldown: 2,
        icon: '🗿',
    },

    command: {
        id: 'command',
        name: 'Command',
        description: 'Buff all summons. +25% damage for 3 turns.',
        archetype: Archetype.SUMMONER,
        activation: SkillActivation.ACTIVE,
        target: SkillTarget.ALL_ALLIES,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.25,          // +25% damage to summons
        effectDuration: 3,
        summonOnly: true,
        cooldown: 2,
        icon: '👆',
    },

    spirit_link: {
        id: 'spirit_link',
        name: 'Spirit Link',
        description: 'Passive. 30% of damage to you goes to summons.',
        archetype: Archetype.SUMMONER,
        activation: SkillActivation.PASSIVE,
        target: SkillTarget.SELF,
        damageType: DamageType.NONE,
        scaling: [],
        baseValue: 0.30,          // 30% damage transfer
        icon: '🔗',
    },
};

Object.freeze(SKILL_DEFINITIONS);

/**
 * ============================================
 * SKILL TREES (15 nodes per skill)
 * ============================================
 * Each tree has 3 tiers:
 * - early: points 1-5 (all heroes)
 * - mid: points 6-10 (requires 2× or 3×)
 * - deep: points 11-15 (requires 3× only, includes capstone)
 */
const SKILL_TREES = {
    // ==================== PYROMANCER TREES ====================
    fireball: {
        early: [
            { id: 'ember', name: 'Ember', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'kindle', name: 'Kindle', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'sparks', name: 'Sparks', type: NodeType.MINOR, cost: 1, effect: '+5% crit chance' },
            { id: 'heat', name: 'Heat', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'ignite', name: 'Ignite', type: NodeType.MAJOR, cost: 1, effect: 'Targets burn for 15% damage over 2s' },
        ],
        mid: [
            { id: 'scorch', name: 'Scorch', type: NodeType.MAJOR, cost: 1, effect: 'Burning targets take +20% fire damage' },
            { id: 'spread', name: 'Spread', type: NodeType.MAJOR, cost: 2, effect: 'Ignite spreads to 1 nearby enemy' },
            { id: 'impact', name: 'Impact', type: NodeType.MAJOR, cost: 1, effect: '+25% damage, removes ignite effect' },
            { id: 'chain_fire', name: 'Chain Fire', type: NodeType.MAJOR, cost: 2, effect: 'Bounces to 1 additional target at 60%' },
            { id: 'inferno', name: 'Inferno', type: NodeType.MAJOR, cost: 1, effect: '+40% damage vs already burning' },
        ],
        deep: [
            { id: 'pyroclasm', name: 'Pyroclasm', type: NodeType.MAJOR, cost: 2, effect: 'Becomes AOE, -30% damage' },
            { id: 'meteor_form', name: 'Meteor Form', type: NodeType.MAJOR, cost: 2, effect: '+50% damage, +1 cooldown' },
            { id: 'soul_fire', name: 'Soul Fire', type: NodeType.MAJOR, cost: 1, effect: 'Burns ignore fire resistance' },
            { id: 'conflagration', name: 'Conflagration', type: NodeType.MAJOR, cost: 1, effect: 'Burning targets explode on death for 50% AOE' },
            { id: 'avatar_of_flame', name: 'Avatar of Flame', type: NodeType.CAPSTONE, cost: 1, effect: 'All fire skills +25% damage, you take 25% less fire' },
        ],
    },
    flame_wave: {
        early: [
            { id: 'wider_wave', name: 'Wider Wave', type: NodeType.MINOR, cost: 1, effect: '+15% damage' },
            { id: 'hotter', name: 'Hotter', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'scald', name: 'Scald', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'burning_ground', name: 'Burning Ground', type: NodeType.MAJOR, cost: 1, effect: 'Leaves fire for 1 turn (0.2× WILL)' },
            { id: 'heat_wave', name: 'Heat Wave', type: NodeType.MINOR, cost: 1, effect: '+5% damage per enemy hit (max 25%)' },
        ],
        mid: [
            { id: 'melt_armor', name: 'Melt Armor', type: NodeType.MAJOR, cost: 2, effect: 'Enemies hit take +15% physical for 2s' },
            { id: 'concentrated', name: 'Concentrated', type: NodeType.MAJOR, cost: 2, effect: 'Cleave instead of AOE, +40% damage' },
            { id: 'backdraft', name: 'Backdraft', type: NodeType.MAJOR, cost: 1, effect: 'If enemies burning, +30% damage' },
            { id: 'push', name: 'Push', type: NodeType.MAJOR, cost: 1, effect: 'Knockback enemies hit' },
            { id: 'napalm', name: 'Napalm', type: NodeType.MAJOR, cost: 1, effect: 'Burning ground lasts +2 turns' },
        ],
        deep: [
            { id: 'firestorm', name: 'Firestorm', type: NodeType.MAJOR, cost: 2, effect: 'Hits twice' },
            { id: 'wall_of_fire', name: 'Wall of Fire', type: NodeType.MAJOR, cost: 2, effect: 'Creates barrier, enemies passing take 0.5× WILL' },
            { id: 'cremation', name: 'Cremation', type: NodeType.MAJOR, cost: 1, effect: '+100% damage vs targets below 20% HP' },
            { id: 'immolation_aura', name: 'Immolation Aura', type: NodeType.MAJOR, cost: 1, effect: 'Also damages enemies adjacent to you passively' },
            { id: 'flame_lord', name: 'Flame Lord', type: NodeType.CAPSTONE, cost: 1, effect: 'Wave CD reduced to 1, +20% base damage' },
        ],
    },
    ignite: {
        early: [
            { id: 'hotter_burn', name: 'Hotter Burn', type: NodeType.MINOR, cost: 1, effect: '+15% DOT damage' },
            { id: 'longer_burn', name: 'Longer Burn', type: NodeType.MINOR, cost: 1, effect: '+1s duration, same damage' },
            { id: 'intense', name: 'Intense', type: NodeType.MINOR, cost: 1, effect: '+15% DOT damage' },
            { id: 'fast_burn', name: 'Fast Burn', type: NodeType.MINOR, cost: 1, effect: '-1s duration, same total (faster)' },
            { id: 'sear', name: 'Sear', type: NodeType.MAJOR, cost: 1, effect: 'Initial hit +50%' },
        ],
        mid: [
            { id: 'stacking_flames', name: 'Stacking Flames', type: NodeType.MAJOR, cost: 2, effect: 'Can stack 2 ignites on same target' },
            { id: 'combustion', name: 'Combustion', type: NodeType.MAJOR, cost: 2, effect: 'When DOT ends, burst for 40% of total' },
            { id: 'spreading_fire', name: 'Spreading Fire', type: NodeType.MAJOR, cost: 1, effect: 'On death, spreads to 2 nearby' },
            { id: 'agony', name: 'Agony', type: NodeType.MAJOR, cost: 1, effect: 'Burning targets deal -15% damage' },
            { id: 'fan_the_flames', name: 'Fan the Flames', type: NodeType.MAJOR, cost: 1, effect: 'Fire attacks refresh ignite duration' },
        ],
        deep: [
            { id: 'triple_stack', name: 'Triple Stack', type: NodeType.MAJOR, cost: 1, effect: 'Can stack 3 ignites' },
            { id: 'incinerate', name: 'Incinerate', type: NodeType.MAJOR, cost: 2, effect: '3× ignite stacks = instant 50% max HP' },
            { id: 'eternal_flame', name: 'Eternal Flame', type: NodeType.MAJOR, cost: 2, effect: 'Ignite doesn\'t expire, must be cleansed' },
            { id: 'phoenix_mark', name: 'Phoenix Mark', type: NodeType.MAJOR, cost: 1, effect: 'Marked targets resurrect as fire allies' },
            { id: 'burning_soul', name: 'Burning Soul', type: NodeType.CAPSTONE, cost: 1, effect: 'Ignite deals true damage' },
        ],
    },
    fire_shield: {
        early: [
            { id: 'hotter_shield', name: 'Hotter Shield', type: NodeType.MINOR, cost: 1, effect: '+15% reflect damage' },
            { id: 'warming', name: 'Warming', type: NodeType.MINOR, cost: 1, effect: '+10% reflect damage' },
            { id: 'heat_aura', name: 'Heat Aura', type: NodeType.MINOR, cost: 1, effect: '+5% fire damage dealt' },
            { id: 'burning_touch', name: 'Burning Touch', type: NodeType.MAJOR, cost: 1, effect: 'Attackers ignited for 2s' },
            { id: 'efficient', name: 'Efficient', type: NodeType.MINOR, cost: 1, effect: '+10% reflect damage' },
        ],
        mid: [
            { id: 'fire_absorption', name: 'Fire Absorption', type: NodeType.MAJOR, cost: 2, effect: 'Take 25% less fire damage' },
            { id: 'blazing_speed', name: 'Blazing Speed', type: NodeType.MAJOR, cost: 1, effect: '+15% SPD while active' },
            { id: 'retribution', name: 'Retribution', type: NodeType.MAJOR, cost: 2, effect: 'Reflect damage = 0.4 × WILL' },
            { id: 'nova_burst', name: 'Nova Burst', type: NodeType.MAJOR, cost: 1, effect: 'Can detonate for 0.6 × WILL AOE (3 turn CD)' },
            { id: 'fuel', name: 'Fuel', type: NodeType.MINOR, cost: 1, effect: '+3% damage per kill (stacks, combat)' },
        ],
        deep: [
            { id: 'inferno_shield', name: 'Inferno Shield', type: NodeType.MAJOR, cost: 2, effect: 'Reflect damages ALL enemies each turn' },
            { id: 'phoenix_cloak', name: 'Phoenix Cloak', type: NodeType.MAJOR, cost: 2, effect: 'On death, 50% chance revive with 20% HP' },
            { id: 'living_flame', name: 'Living Flame', type: NodeType.MAJOR, cost: 1, effect: 'Shield pulses 0.2 × WILL to all enemies/turn' },
            { id: 'cauterize', name: 'Cauterize', type: NodeType.MAJOR, cost: 1, effect: 'Immune to bleed, heal 2% when hit' },
            { id: 'flame_incarnate', name: 'Flame Incarnate', type: NodeType.CAPSTONE, cost: 1, effect: 'All damage you deal becomes fire, +20% fire damage' },
        ],
    },
    meteor: {
        early: [
            { id: 'mass', name: 'Mass', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'velocity', name: 'Velocity', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'crater', name: 'Crater', type: NodeType.MAJOR, cost: 1, effect: 'Leaves burning ground 2 turns' },
            { id: 'impact', name: 'Impact', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'debris', name: 'Debris', type: NodeType.MINOR, cost: 1, effect: '+5% damage, +5% crit' },
        ],
        mid: [
            { id: 'meteor_shower', name: 'Meteor Shower', type: NodeType.MAJOR, cost: 2, effect: '3 meteors at 0.5× each, random targets' },
            { id: 'targeted', name: 'Targeted', type: NodeType.MAJOR, cost: 2, effect: 'Single target, +60% damage, always crits' },
            { id: 'extinction', name: 'Extinction', type: NodeType.MAJOR, cost: 1, effect: '+75% damage vs below 30% HP' },
            { id: 'skyfall', name: 'Skyfall', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1)' },
            { id: 'molten_core', name: 'Molten Core', type: NodeType.MAJOR, cost: 1, effect: 'Kills grant +15% damage next cast' },
        ],
        deep: [
            { id: 'cataclysm', name: 'Cataclysm', type: NodeType.MAJOR, cost: 2, effect: '+50% damage, stuns all 1 turn' },
            { id: 'armageddon', name: 'Armageddon', type: NodeType.MAJOR, cost: 2, effect: 'Once per quest: 3× damage' },
            { id: 'gravity_well', name: 'Gravity Well', type: NodeType.MAJOR, cost: 1, effect: 'Pulls all enemies together before impact' },
            { id: 'scorched_earth', name: 'Scorched Earth', type: NodeType.MAJOR, cost: 1, effect: 'Burning ground permanent this combat' },
            { id: 'world_ender', name: 'World Ender', type: NodeType.CAPSTONE, cost: 1, effect: 'Meteor ignores 50% WILL, +30% damage' },
        ],
    },

    // ==================== CRYOMANCER TREES ====================
    ice_bolt: {
        early: [
            { id: 'sharp_ice', name: 'Sharp Ice', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'cold', name: 'Cold', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'chill', name: 'Chill', type: NodeType.MAJOR, cost: 1, effect: 'Target slowed 20% for 2s' },
            { id: 'frost', name: 'Frost', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'piercing_cold', name: 'Piercing Cold', type: NodeType.MINOR, cost: 1, effect: '+5% crit chance' },
        ],
        mid: [
            { id: 'freeze', name: 'Freeze', type: NodeType.MAJOR, cost: 2, effect: '20% chance to freeze 1s (stun)' },
            { id: 'shatter', name: 'Shatter', type: NodeType.MAJOR, cost: 2, effect: '+60% damage to frozen targets' },
            { id: 'pierce', name: 'Pierce', type: NodeType.MAJOR, cost: 1, effect: 'Passes through, hits 2 targets' },
            { id: 'frostbite', name: 'Frostbite', type: NodeType.MAJOR, cost: 1, effect: 'Chilled take +20% damage from all' },
            { id: 'icicle_barrage', name: 'Icicle Barrage', type: NodeType.MAJOR, cost: 1, effect: '3 bolts at 40% each' },
        ],
        deep: [
            { id: 'flash_freeze', name: 'Flash Freeze', type: NodeType.MAJOR, cost: 2, effect: '50% freeze chance' },
            { id: 'glacial_execution', name: 'Glacial Execution', type: NodeType.MAJOR, cost: 2, effect: 'Frozen below 25% HP = instant kill' },
            { id: 'ice_spear', name: 'Ice Spear', type: NodeType.MAJOR, cost: 1, effect: '+40% damage, pierce 3 targets' },
            { id: 'permafrost', name: 'Permafrost', type: NodeType.MAJOR, cost: 1, effect: 'Freeze duration +2s' },
            { id: 'absolute_zero', name: 'Absolute Zero', type: NodeType.CAPSTONE, cost: 1, effect: 'Frozen targets take 2× damage, shatter heals you 10%' },
        ],
    },
    frost_nova: {
        early: [
            { id: 'colder', name: 'Colder', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'radius', name: 'Radius', type: NodeType.MINOR, cost: 1, effect: '+15% range' },
            { id: 'freeze_chance', name: 'Freeze Chance', type: NodeType.MINOR, cost: 1, effect: '10% freeze chance' },
            { id: 'sharper', name: 'Sharper', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'chill_all', name: 'Chill All', type: NodeType.MAJOR, cost: 1, effect: 'All hit are chilled 2s' },
        ],
        mid: [
            { id: 'flash_freeze_nova', name: 'Flash Freeze', type: NodeType.MAJOR, cost: 2, effect: '+25% freeze chance' },
            { id: 'hypothermia', name: 'Hypothermia', type: NodeType.MAJOR, cost: 1, effect: 'Chilled lose 15% ATK' },
            { id: 'ice_age', name: 'Ice Age', type: NodeType.MAJOR, cost: 1, effect: 'Freeze +1s duration' },
            { id: 'defensive_burst', name: 'Defensive Burst', type: NodeType.MAJOR, cost: 2, effect: 'Gain +25% DEF for 2s' },
            { id: 'blizzard_trail', name: 'Blizzard Trail', type: NodeType.MAJOR, cost: 1, effect: 'Leaves slow field 2s' },
        ],
        deep: [
            { id: 'shatter_nova', name: 'Shatter Nova', type: NodeType.MAJOR, cost: 2, effect: 'Frozen enemies take 2× and unfreeze' },
            { id: 'ice_tomb', name: 'Ice Tomb', type: NodeType.MAJOR, cost: 2, effect: '25% chance to permanently freeze fodder' },
            { id: 'frozen_sanctuary', name: 'Frozen Sanctuary', type: NodeType.MAJOR, cost: 1, effect: 'While enemies frozen, you regen 5% HP/turn' },
            { id: 'chain_freeze', name: 'Chain Freeze', type: NodeType.MAJOR, cost: 1, effect: 'Freeze spreads to adjacent' },
            { id: 'cryomancers_wrath', name: 'Cryomancer\'s Wrath', type: NodeType.CAPSTONE, cost: 1, effect: 'Nova -1 CD (min 1), +30% damage, always chills' },
        ],
    },
    frozen_armor: {
        early: [
            { id: 'thicker_ice', name: 'Thicker Ice', type: NodeType.MINOR, cost: 1, effect: '+5% DEF' },
            { id: 'hardened', name: 'Hardened', type: NodeType.MINOR, cost: 1, effect: '+5% DEF' },
            { id: 'chilling_aura', name: 'Chilling Aura', type: NodeType.MAJOR, cost: 1, effect: 'Attackers become chilled' },
            { id: 'cold_skin', name: 'Cold Skin', type: NodeType.MINOR, cost: 1, effect: '+5% DEF' },
            { id: 'frost_layer', name: 'Frost Layer', type: NodeType.MINOR, cost: 1, effect: '+5% DEF' },
        ],
        mid: [
            { id: 'ice_mirror', name: 'Ice Mirror', type: NodeType.MAJOR, cost: 2, effect: 'Reflect 15% cold damage to attackers' },
            { id: 'shatter_guard', name: 'Shatter Guard', type: NodeType.MAJOR, cost: 1, effect: 'On big hit (>20% HP), AOE frost' },
            { id: 'glacial_fortress', name: 'Glacial Fortress', type: NodeType.MAJOR, cost: 2, effect: '+20% DEF, -10% SPD' },
            { id: 'cold_recovery', name: 'Cold Recovery', type: NodeType.MAJOR, cost: 1, effect: 'Regen 3% HP while above 60% HP' },
            { id: 'frozen_resolve', name: 'Frozen Resolve', type: NodeType.MAJOR, cost: 1, effect: 'Immune to freeze effects' },
        ],
        deep: [
            { id: 'ice_block', name: 'Ice Block', type: NodeType.MAJOR, cost: 2, effect: 'Activate: immune 1 turn, can\'t act (4 turn CD)' },
            { id: 'iceborn', name: 'Iceborn', type: NodeType.MAJOR, cost: 2, effect: 'Fire damage -40%, cold damage heals you' },
            { id: 'living_glacier', name: 'Living Glacier', type: NodeType.MAJOR, cost: 1, effect: 'DEF bonus doubled while standing still' },
            { id: 'frozen_heart', name: 'Frozen Heart', type: NodeType.MAJOR, cost: 1, effect: 'At <30% HP, freeze attackers automatically' },
            { id: 'avatar_of_ice', name: 'Avatar of Ice', type: NodeType.CAPSTONE, cost: 1, effect: '+30% DEF, attackers frozen 50% chance' },
        ],
    },
    blizzard: {
        early: [
            { id: 'colder_wind', name: 'Colder Wind', type: NodeType.MINOR, cost: 1, effect: '+15% DOT damage' },
            { id: 'longer_storm', name: 'Longer Storm', type: NodeType.MINOR, cost: 1, effect: '+1 turn duration' },
            { id: 'harsher', name: 'Harsher', type: NodeType.MINOR, cost: 1, effect: '+10% DOT damage' },
            { id: 'wind_chill', name: 'Wind Chill', type: NodeType.MAJOR, cost: 1, effect: 'Enemies chilled while in blizzard' },
            { id: 'frost_bite', name: 'Frost Bite', type: NodeType.MINOR, cost: 1, effect: '+10% DOT damage' },
        ],
        mid: [
            { id: 'hailstorm', name: 'Hailstorm', type: NodeType.MAJOR, cost: 2, effect: 'Also deals 0.15 × ATK physical' },
            { id: 'whiteout', name: 'Whiteout', type: NodeType.MAJOR, cost: 1, effect: 'Enemies 25% miss chance' },
            { id: 'snowdrift', name: 'Snowdrift', type: NodeType.MAJOR, cost: 1, effect: 'Allies +20% evasion in blizzard' },
            { id: 'bitter_cold', name: 'Bitter Cold', type: NodeType.MAJOR, cost: 2, effect: '-10% SPD per turn in blizzard (stacks)' },
            { id: 'avalanche', name: 'Avalanche', type: NodeType.MAJOR, cost: 1, effect: 'Final turn deals 0.6 × WILL burst' },
        ],
        deep: [
            { id: 'eternal_winter', name: 'Eternal Winter', type: NodeType.MAJOR, cost: 2, effect: 'Duration +4 turns (8 total)' },
            { id: 'freeze_solid', name: 'Freeze Solid', type: NodeType.MAJOR, cost: 2, effect: '15% chance per turn to freeze random enemy' },
            { id: 'eye_of_storm', name: 'Eye of Storm', type: NodeType.MAJOR, cost: 1, effect: 'Caster immune, heals 3%/turn in blizzard' },
            { id: 'arctic_apocalypse', name: 'Arctic Apocalypse', type: NodeType.MAJOR, cost: 1, effect: 'Frozen in blizzard take 3× DOT' },
            { id: 'winters_dominion', name: 'Winter\'s Dominion', type: NodeType.CAPSTONE, cost: 1, effect: 'Blizzard permanent, 50% damage, enemies can\'t flee' },
        ],
    },
    glacial_spike: {
        early: [
            { id: 'sharper_spike', name: 'Sharper', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'larger', name: 'Larger', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'impale', name: 'Impale', type: NodeType.MAJOR, cost: 1, effect: 'Target +15% damage taken for 2s' },
            { id: 'deeper', name: 'Deeper', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'cold_steel', name: 'Cold Steel', type: NodeType.MINOR, cost: 1, effect: '+5% crit chance' },
        ],
        mid: [
            { id: 'frozen_solid', name: 'Frozen Solid', type: NodeType.MAJOR, cost: 2, effect: '30% freeze chance' },
            { id: 'execute_spike', name: 'Execute', type: NodeType.MAJOR, cost: 2, effect: '+50% vs below 25% HP' },
            { id: 'pierce_spike', name: 'Pierce', type: NodeType.MAJOR, cost: 1, effect: '50% damage to enemy behind' },
            { id: 'brittle', name: 'Brittle', type: NodeType.MAJOR, cost: 1, effect: 'Crit damage +40% vs frozen' },
            { id: 'stacking_cold', name: 'Stacking Cold', type: NodeType.MAJOR, cost: 1, effect: '+15% per spike on same target (combat)' },
        ],
        deep: [
            { id: 'skewer', name: 'Skewer', type: NodeType.MAJOR, cost: 2, effect: 'Hits all enemies in a line' },
            { id: 'ice_execution', name: 'Ice Execution', type: NodeType.MAJOR, cost: 2, effect: 'Frozen below 30% = instant kill' },
            { id: 'glacial_tomb', name: 'Glacial Tomb', type: NodeType.MAJOR, cost: 1, effect: 'Kill = corpse becomes ice block ally' },
            { id: 'permafrost_spike', name: 'Permafrost Spike', type: NodeType.MAJOR, cost: 1, effect: 'Frozen take 2.5× damage' },
            { id: 'frozen_annihilation', name: 'Frozen Annihilation', type: NodeType.CAPSTONE, cost: 1, effect: '+50% damage, always freezes, -1 CD (min 1)' },
        ],
    },

    // ==================== STORMCALLER TREES ====================
    spark: {
        early: [
            { id: 'voltage', name: 'Voltage', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'charge', name: 'Charge', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'arc', name: 'Arc', type: NodeType.MAJOR, cost: 1, effect: '25% chance arc to second target 50% damage' },
            { id: 'current', name: 'Current', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'static', name: 'Static', type: NodeType.MINOR, cost: 1, effect: '+5% crit chance' },
        ],
        mid: [
            { id: 'shock', name: 'Shock', type: NodeType.MAJOR, cost: 2, effect: '20% stun chance 1s' },
            { id: 'overcharge', name: 'Overcharge', type: NodeType.MAJOR, cost: 2, effect: '+35% damage, +1 CD' },
            { id: 'static_buildup', name: 'Static Buildup', type: NodeType.MAJOR, cost: 1, effect: '+10% per spark on same target (stacks 5)' },
            { id: 'lightning_speed', name: 'Lightning Speed', type: NodeType.MAJOR, cost: 1, effect: '+5% SPD per cast this combat' },
            { id: 'energize', name: 'Energize', type: NodeType.MAJOR, cost: 1, effect: 'Kill = next skill -1 CD (min 1)' },
        ],
        deep: [
            { id: 'ball_lightning', name: 'Ball Lightning', type: NodeType.MAJOR, cost: 2, effect: 'Orbits you, auto-hits nearest each turn 0.3×' },
            { id: 'thunder_god', name: 'Thunder God', type: NodeType.MAJOR, cost: 2, effect: '+50% damage while above 80% HP' },
            { id: 'chain_arc', name: 'Chain Arc', type: NodeType.MAJOR, cost: 1, effect: 'Arc chains to 3 targets' },
            { id: 'electrocute', name: 'Electrocute', type: NodeType.MAJOR, cost: 1, effect: 'Adds 0.4 × WILL DOT over 2s' },
            { id: 'living_lightning', name: 'Living Lightning', type: NodeType.CAPSTONE, cost: 1, effect: 'Spark -1 CD (min 1), arcs always, +25%' },
        ],
    },
    chain_lightning: {
        early: [
            { id: 'power', name: 'Power', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'reach', name: 'Reach', type: NodeType.MINOR, cost: 1, effect: '+1 chain' },
            { id: 'sustained', name: 'Sustained', type: NodeType.MINOR, cost: 1, effect: 'Only -15% per jump' },
            { id: 'energy', name: 'Energy', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'conductivity', name: 'Conductivity', type: NodeType.MAJOR, cost: 1, effect: 'Wet/metal enemies +20% damage' },
        ],
        mid: [
            { id: 'long_chain', name: 'Long Chain', type: NodeType.MAJOR, cost: 2, effect: '+2 chains (5 total base)' },
            { id: 'fork', name: 'Fork', type: NodeType.MAJOR, cost: 1, effect: 'Can hit same target twice' },
            { id: 'grounding', name: 'Grounding', type: NodeType.MAJOR, cost: 2, effect: 'Final target +50% damage' },
            { id: 'paralysis', name: 'Paralysis', type: NodeType.MAJOR, cost: 1, effect: 'Each jump 10% stun' },
            { id: 'storm_surge', name: 'Storm Surge', type: NodeType.MAJOR, cost: 1, effect: 'Kill during chain = +2 chains' },
        ],
        deep: [
            { id: 'infinite_chain', name: 'Infinite Chain', type: NodeType.MAJOR, cost: 2, effect: 'No chain limit, -10% per jump' },
            { id: 'lightning_rod', name: 'Lightning Rod', type: NodeType.MAJOR, cost: 2, effect: 'Take 10%, chain +40% damage' },
            { id: 'overload_chain', name: 'Overload', type: NodeType.MAJOR, cost: 1, effect: '25% chance double damage per jump' },
            { id: 'thunderstorm', name: 'Thunderstorm', type: NodeType.MAJOR, cost: 1, effect: 'Chains bounce back through' },
            { id: 'storm_master', name: 'Storm Master', type: NodeType.CAPSTONE, cost: 1, effect: 'No damage decay, +30% base' },
        ],
    },
    thunder_strike: {
        early: [
            { id: 'power_strike', name: 'Power', type: NodeType.MINOR, cost: 1, effect: '+12% damage' },
            { id: 'boom', name: 'Boom', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'deafen', name: 'Deafen', type: NodeType.MAJOR, cost: 1, effect: 'Target can\'t skill 1 turn' },
            { id: 'crack', name: 'Crack', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'rumble', name: 'Rumble', type: NodeType.MINOR, cost: 1, effect: '+5% crit' },
        ],
        mid: [
            { id: 'thunder_clap', name: 'Thunder Clap', type: NodeType.MAJOR, cost: 2, effect: 'Becomes Cleave, -20% damage' },
            { id: 'divine_wrath', name: 'Divine Wrath', type: NodeType.MAJOR, cost: 1, effect: '+50% vs demons/undead' },
            { id: 'electrocute_strike', name: 'Electrocute', type: NodeType.MAJOR, cost: 2, effect: '0.4 × WILL DOT over 2s' },
            { id: 'instant', name: 'Instant', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1), costs 10% HP' },
            { id: 'smite', name: 'Smite', type: NodeType.MAJOR, cost: 1, effect: 'Auto-crit vs stunned' },
        ],
        deep: [
            { id: 'judgment', name: 'Judgment', type: NodeType.MAJOR, cost: 2, effect: '+100% vs below 20% HP' },
            { id: 'overload_strike', name: 'Overload', type: NodeType.MAJOR, cost: 2, effect: 'Crits +60% damage, 10% self-damage' },
            { id: 'thunder_god_strike', name: 'Thunder God', type: NodeType.MAJOR, cost: 1, effect: 'Above 80% HP: +40% damage' },
            { id: 'skybreaker', name: 'Skybreaker', type: NodeType.MAJOR, cost: 1, effect: 'AOE instead, -30% damage' },
            { id: 'wrath_of_heaven', name: 'Wrath of Heaven', type: NodeType.CAPSTONE, cost: 1, effect: '+50% damage, stuns, always crits below 50% HP' },
        ],
    },
    static_field: {
        early: [
            { id: 'stronger_field', name: 'Stronger Field', type: NodeType.MINOR, cost: 1, effect: '+15% aura damage' },
            { id: 'wider_field', name: 'Wider Field', type: NodeType.MINOR, cost: 1, effect: '+20% radius' },
            { id: 'charged_air', name: 'Charged Air', type: NodeType.MAJOR, cost: 1, effect: 'Allies +8% crit in field' },
            { id: 'intensity', name: 'Intensity', type: NodeType.MINOR, cost: 1, effect: '+10% aura damage' },
            { id: 'persistence', name: 'Persistence', type: NodeType.MINOR, cost: 1, effect: '+10% aura damage' },
        ],
        mid: [
            { id: 'energy_leech', name: 'Energy Leech', type: NodeType.MAJOR, cost: 2, effect: 'Heal 25% of field damage' },
            { id: 'grounded', name: 'Grounded', type: NodeType.MAJOR, cost: 1, effect: 'Enemies -20% SPD in field' },
            { id: 'arc_flash', name: 'Arc Flash', type: NodeType.MAJOR, cost: 2, effect: 'When hit, 30% chance zap attacker 0.3×' },
            { id: 'unstable', name: 'Unstable', type: NodeType.MAJOR, cost: 1, effect: '+40% damage, 5% shock self' },
            { id: 'magnetic', name: 'Magnetic', type: NodeType.MAJOR, cost: 1, effect: 'Enemies can\'t flee' },
        ],
        deep: [
            { id: 'tesla_coil', name: 'Tesla Coil', type: NodeType.MAJOR, cost: 2, effect: '+10% per enemy in field' },
            { id: 'lightning_prison', name: 'Lightning Prison', type: NodeType.MAJOR, cost: 2, effect: 'Enemies entering field stunned 1s' },
            { id: 'storm_heart', name: 'Storm Heart', type: NodeType.MAJOR, cost: 1, effect: 'Field pulses for 0.3× burst each turn' },
            { id: 'ionize', name: 'Ionize', type: NodeType.MAJOR, cost: 1, effect: 'Enemies in field +30% lightning damage' },
            { id: 'eye_of_the_storm', name: 'Eye of the Storm', type: NodeType.CAPSTONE, cost: 1, effect: 'Field damage 0.25×, heals allies 3%/turn' },
        ],
    },
    storm_call: {
        early: [
            { id: 'stronger', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+12% damage' },
            { id: 'longer', name: 'Longer', type: NodeType.MINOR, cost: 1, effect: '+1 turn duration' },
            { id: 'winds', name: 'Winds', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'thunder', name: 'Thunder', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'eye_safety', name: 'Eye Safety', type: NodeType.MAJOR, cost: 1, effect: 'Caster immune to storm effects' },
        ],
        mid: [
            { id: 'lightning_strikes', name: 'Lightning Strikes', type: NodeType.MAJOR, cost: 2, effect: 'Random enemy takes +0.25× per turn' },
            { id: 'downpour', name: 'Downpour', type: NodeType.MAJOR, cost: 1, effect: 'Enemies "wet" = +30% lightning' },
            { id: 'gale_force', name: 'Gale Force', type: NodeType.MAJOR, cost: 2, effect: '25% miss chance for enemies' },
            { id: 'tempest', name: 'Tempest', type: NodeType.MAJOR, cost: 1, effect: 'Duration +2 turns' },
            { id: 'thunder_wrath', name: 'Thunder Wrath', type: NodeType.MAJOR, cost: 1, effect: 'Final turn 2× damage' },
        ],
        deep: [
            { id: 'supercell', name: 'Supercell', type: NodeType.MAJOR, cost: 2, effect: '25% stun random enemy each turn' },
            { id: 'elemental_fury', name: 'Elemental Fury', type: NodeType.MAJOR, cost: 2, effect: 'Also fire/cold 0.15× each' },
            { id: 'eternal_storm', name: 'Eternal Storm', type: NodeType.MAJOR, cost: 1, effect: 'Storm permanent, 60% damage' },
            { id: 'cataclysm_storm', name: 'Cataclysm', type: NodeType.MAJOR, cost: 1, effect: 'Stuns all enemies first turn' },
            { id: 'storm_lord', name: 'Storm Lord', type: NodeType.CAPSTONE, cost: 1, effect: '+40% damage, -1 CD (min 1), always wets' },
        ],
    },

    // ==================== NECROMANCER TREES ====================
    soul_rend: {
        early: [
            { id: 'deeper_cut', name: 'Deeper Cut', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'soul_siphon', name: 'Soul Siphon', type: NodeType.MAJOR, cost: 1, effect: 'Heal 15% of damage dealt' },
            { id: 'rending', name: 'Rending', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'pain', name: 'Pain', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'torment', name: 'Torment', type: NodeType.MINOR, cost: 1, effect: '+5% crit' },
        ],
        mid: [
            { id: 'spirit_crush', name: 'Spirit Crush', type: NodeType.MAJOR, cost: 2, effect: 'Target -20% damage for 2s' },
            { id: 'rend_asunder', name: 'Rend Asunder', type: NodeType.MAJOR, cost: 2, effect: 'Becomes Cleave, -15% damage' },
            { id: 'dot_rend', name: 'DOT', type: NodeType.MAJOR, cost: 1, effect: '+25% DOT over 2s' },
            { id: 'devour', name: 'Devour', type: NodeType.MAJOR, cost: 1, effect: 'Kill = next rend +30%' },
            { id: 'essence_burn', name: 'Essence Burn', type: NodeType.MAJOR, cost: 1, effect: 'Also 8% max HP true damage' },
        ],
        deep: [
            { id: 'reapers_touch', name: 'Reaper\'s Touch', type: NodeType.MAJOR, cost: 2, effect: '+60% vs below 30% HP' },
            { id: 'soul_tear', name: 'Soul Tear', type: NodeType.MAJOR, cost: 2, effect: 'Target WILL counts as 25% for resist' },
            { id: 'oblivion', name: 'Oblivion', type: NodeType.MAJOR, cost: 1, effect: 'Kills prevent resurrection' },
            { id: 'mass_rend', name: 'Mass Rend', type: NodeType.MAJOR, cost: 1, effect: 'AOE at 60% damage' },
            { id: 'soul_eater', name: 'Soul Eater', type: NodeType.CAPSTONE, cost: 1, effect: '+40% damage, heals 30%, always crits dying' },
        ],
    },
    life_drain: {
        early: [
            { id: 'deeper_drain', name: 'Deeper Drain', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'more_healing', name: 'More Healing', type: NodeType.MINOR, cost: 1, effect: '+10% heal' },
            { id: 'thirst', name: 'Thirst', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'hunger', name: 'Hunger', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'efficient_drain', name: 'Efficient', type: NodeType.MAJOR, cost: 1, effect: 'Heal = 60% of damage' },
        ],
        mid: [
            { id: 'sanguine_feast', name: 'Sanguine Feast', type: NodeType.MAJOR, cost: 2, effect: 'Overheal = temp HP shield' },
            { id: 'mass_drain', name: 'Mass Drain', type: NodeType.MAJOR, cost: 2, effect: 'AOE at 50% damage, heals total' },
            { id: 'vampiric_aura', name: 'Vampiric Aura', type: NodeType.MAJOR, cost: 1, effect: 'Allies leech 5% during your turn' },
            { id: 'essence_thief', name: 'Essence Thief', type: NodeType.MAJOR, cost: 1, effect: 'Target -15% damage dealt' },
            { id: 'crimson_pact', name: 'Crimson Pact', type: NodeType.MAJOR, cost: 1, effect: 'Costs 10% HP, +50% damage' },
        ],
        deep: [
            { id: 'exsanguinate', name: 'Exsanguinate', type: NodeType.MAJOR, cost: 2, effect: 'Kill = cooldown reset to min (1)' },
            { id: 'blood_magic', name: 'Blood Magic', type: NodeType.MAJOR, cost: 2, effect: 'Heal = 80% of damage' },
            { id: 'life_link', name: 'Life Link', type: NodeType.MAJOR, cost: 1, effect: 'Can drain ally to heal self or vice versa' },
            { id: 'drain_soul', name: 'Drain Soul', type: NodeType.MAJOR, cost: 1, effect: 'Damage = 1.2×, ignore 30% WILL' },
            { id: 'vampire_lord', name: 'Vampire Lord', type: NodeType.CAPSTONE, cost: 1, effect: 'Heal = 100%, +30% damage, overheal permanent' },
        ],
    },
    raise_skeleton: {
        early: [
            { id: 'stronger_bones', name: 'Stronger Bones', type: NodeType.MINOR, cost: 1, effect: '+10% skeleton stats' },
            { id: 'hardened_bones', name: 'Hardened', type: NodeType.MINOR, cost: 1, effect: '+10% skeleton stats' },
            { id: 'armed', name: 'Armed', type: NodeType.MINOR, cost: 1, effect: '+10% skeleton stats' },
            { id: 'reinforced', name: 'Reinforced', type: NodeType.MINOR, cost: 1, effect: '+10% skeleton stats' },
            { id: 'skeleton_mage', name: 'Skeleton Mage', type: NodeType.MAJOR, cost: 1, effect: 'Casts Spark instead of melee' },
        ],
        mid: [
            { id: 'skeleton_archer', name: 'Skeleton Archer', type: NodeType.MAJOR, cost: 1, effect: 'Ranged attacks' },
            { id: 'army', name: 'Army', type: NodeType.MAJOR, cost: 2, effect: 'Raise 2 at 75% stats each' },
            { id: 'bone_armor', name: 'Bone Armor', type: NodeType.MAJOR, cost: 1, effect: 'Skeletons +30% DEF' },
            { id: 'unholy_frenzy', name: 'Unholy Frenzy', type: NodeType.MAJOR, cost: 2, effect: '+25% SPD, -15% DEF' },
            { id: 'reassemble', name: 'Reassemble', type: NodeType.MAJOR, cost: 1, effect: 'Revives after 2 turns' },
        ],
        deep: [
            { id: 'bone_giant', name: 'Bone Giant', type: NodeType.MAJOR, cost: 2, effect: 'Single skeleton, 2.5× stats, slow' },
            { id: 'legion', name: 'Legion', type: NodeType.MAJOR, cost: 2, effect: 'Raise 4 at 60% stats' },
            { id: 'exploding_bones', name: 'Exploding Bones', type: NodeType.MAJOR, cost: 1, effect: 'Death = 0.5× WILL AOE' },
            { id: 'command_dead', name: 'Command Dead', type: NodeType.MAJOR, cost: 1, effect: 'Can raise slain enemies' },
            { id: 'lord_of_bones', name: 'Lord of Bones', type: NodeType.CAPSTONE, cost: 1, effect: 'Skeletons +50% stats, unlimited count' },
        ],
    },
    corpse_explosion: {
        early: [
            { id: 'bigger_boom', name: 'Bigger Boom', type: NodeType.MINOR, cost: 1, effect: '+12% damage' },
            { id: 'splatter', name: 'Splatter', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'gore', name: 'Gore', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'visceral', name: 'Visceral', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'wider_blast', name: 'Wider Blast', type: NodeType.MAJOR, cost: 1, effect: 'AOE instead of Cleave' },
        ],
        mid: [
            { id: 'chain_reaction', name: 'Chain Reaction', type: NodeType.MAJOR, cost: 2, effect: 'Can trigger other corpses' },
            { id: 'poison_cloud', name: 'Poison Cloud', type: NodeType.MAJOR, cost: 1, effect: 'Leaves poison 2s' },
            { id: 'bone_shrapnel', name: 'Bone Shrapnel', type: NodeType.MAJOR, cost: 2, effect: 'Physical damage instead' },
            { id: 'volatile_bodies', name: 'Volatile Bodies', type: NodeType.MAJOR, cost: 1, effect: '+35% damage' },
            { id: 'quick_decay', name: 'Quick Decay', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1)' },
        ],
        deep: [
            { id: 'plague_bearer', name: 'Plague Bearer', type: NodeType.MAJOR, cost: 2, effect: 'Kills become plague corpses (auto-explode)' },
            { id: 'deathbomb', name: 'Deathbomb', type: NodeType.MAJOR, cost: 2, effect: 'Corpse damage = 50% corpse max HP' },
            { id: 'corpse_lance', name: 'Corpse Lance', type: NodeType.MAJOR, cost: 1, effect: 'Single target, 2× damage' },
            { id: 'necrotic_burst', name: 'Necrotic Burst', type: NodeType.MAJOR, cost: 1, effect: 'Explosion heals undead allies' },
            { id: 'master_of_death', name: 'Master of Death', type: NodeType.CAPSTONE, cost: 1, effect: 'Enemies killed always leave corpse, +50% damage' },
        ],
    },
    death_mark: {
        early: [
            { id: 'stronger_mark', name: 'Stronger Mark', type: NodeType.MINOR, cost: 1, effect: '+5% damage taken' },
            { id: 'longer_mark', name: 'Longer Mark', type: NodeType.MINOR, cost: 1, effect: '+1s duration' },
            { id: 'deeper_mark', name: 'Deeper Mark', type: NodeType.MINOR, cost: 1, effect: '+5% damage taken' },
            { id: 'lasting', name: 'Lasting', type: NodeType.MINOR, cost: 1, effect: '+1s duration' },
            { id: 'spreading_mark', name: 'Spreading', type: NodeType.MAJOR, cost: 1, effect: 'On death, mark jumps to nearest' },
        ],
        mid: [
            { id: 'mass_mark', name: 'Mass Mark', type: NodeType.MAJOR, cost: 2, effect: 'All enemies, but +15% only' },
            { id: 'execution_mark', name: 'Execution Mark', type: NodeType.MAJOR, cost: 1, effect: '+40% vs below 30% HP' },
            { id: 'hunters_mark', name: 'Hunter\'s Mark', type: NodeType.MAJOR, cost: 2, effect: 'Your attacks can\'t miss marked' },
            { id: 'doomed', name: 'Doomed', type: NodeType.MAJOR, cost: 1, effect: 'Marked can\'t heal' },
            { id: 'mark_of_pain', name: 'Mark of Pain', type: NodeType.MAJOR, cost: 1, effect: 'Marked take 0.15× WILL DOT/turn' },
        ],
        deep: [
            { id: 'reapers_due', name: 'Reaper\'s Due', type: NodeType.MAJOR, cost: 2, effect: 'If survives, take 40% current HP' },
            { id: 'eternal_mark', name: 'Eternal Mark', type: NodeType.MAJOR, cost: 2, effect: 'Mark never expires' },
            { id: 'death_sentence', name: 'Death Sentence', type: NodeType.MAJOR, cost: 1, effect: 'Marked below 15% = instant death' },
            { id: 'mark_of_legion', name: 'Mark of the Legion', type: NodeType.MAJOR, cost: 1, effect: 'Marked takes +10% per ally attacking' },
            { id: 'herald_of_death', name: 'Herald of Death', type: NodeType.CAPSTONE, cost: 1, effect: 'Mark +40% damage, spreads on death always' },
        ],
    },

    // ==================== PALADIN TREES ====================
    holy_smite: {
        early: [
            { id: 'divine_power', name: 'Divine Power', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'righteous', name: 'Righteous', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'holy', name: 'Holy', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'blessed', name: 'Blessed', type: NodeType.MINOR, cost: 1, effect: '+5% crit' },
            { id: 'radiant', name: 'Radiant', type: NodeType.MAJOR, cost: 1, effect: '+40% vs undead/demons' },
        ],
        mid: [
            { id: 'blinding_light', name: 'Blinding Light', type: NodeType.MAJOR, cost: 2, effect: 'Target -25% accuracy 2s' },
            { id: 'consecrate', name: 'Consecrate', type: NodeType.MAJOR, cost: 1, effect: 'Leaves holy ground (heals allies 3%/turn)' },
            { id: 'judgment_smite', name: 'Judgment', type: NodeType.MAJOR, cost: 2, effect: '+30% vs enemies that hit allies' },
            { id: 'zealot', name: 'Zealot', type: NodeType.MAJOR, cost: 1, effect: '+25% damage, -10% DEF' },
            { id: 'purify', name: 'Purify', type: NodeType.MAJOR, cost: 1, effect: 'Removes 1 buff from target' },
        ],
        deep: [
            { id: 'martyrs_blow', name: 'Martyr\'s Blow', type: NodeType.MAJOR, cost: 2, effect: 'Costs 15% HP, +60% damage' },
            { id: 'divine_fury', name: 'Divine Fury', type: NodeType.MAJOR, cost: 2, effect: 'At full HP, always crits' },
            { id: 'exorcism', name: 'Exorcism', type: NodeType.MAJOR, cost: 1, effect: 'Instant kill undead/demon below 25%' },
            { id: 'holy_explosion', name: 'Holy Explosion', type: NodeType.MAJOR, cost: 1, effect: 'Cleave, -20% damage' },
            { id: 'avatar_of_light', name: 'Avatar of Light', type: NodeType.CAPSTONE, cost: 1, effect: '+40% damage, heals you 20% on kill' },
        ],
    },
    lay_on_hands: {
        early: [
            { id: 'greater_heal', name: 'Greater Heal', type: NodeType.MINOR, cost: 1, effect: '+12% healing' },
            { id: 'blessed_touch', name: 'Blessed Touch', type: NodeType.MINOR, cost: 1, effect: '+10% healing' },
            { id: 'soothing', name: 'Soothing', type: NodeType.MINOR, cost: 1, effect: '+10% healing' },
            { id: 'mending', name: 'Mending', type: NodeType.MINOR, cost: 1, effect: '+10% healing' },
            { id: 'self_heal', name: 'Self Heal', type: NodeType.MAJOR, cost: 1, effect: 'Also heals self 25% when healing ally' },
        ],
        mid: [
            { id: 'mass_heal', name: 'Mass Heal', type: NodeType.MAJOR, cost: 2, effect: 'All allies 50% amount' },
            { id: 'overheal', name: 'Overheal', type: NodeType.MAJOR, cost: 1, effect: 'Excess = HP shield' },
            { id: 'cleanse', name: 'Cleanse', type: NodeType.MAJOR, cost: 2, effect: 'Also removes 1 debuff' },
            { id: 'renewal', name: 'Renewal', type: NodeType.MAJOR, cost: 1, effect: '+25% HOT over 2 turns' },
            { id: 'emergency', name: 'Emergency', type: NodeType.MAJOR, cost: 1, effect: '+50% to targets below 30% HP' },
        ],
        deep: [
            { id: 'resurrection', name: 'Resurrection', type: NodeType.MAJOR, cost: 2, effect: 'Revive ally at 25% HP (once/quest)' },
            { id: 'divine_light', name: 'Divine Light', type: NodeType.MAJOR, cost: 2, effect: 'Heal = 1.0 × WILL' },
            { id: 'sacrifice_heal', name: 'Sacrifice', type: NodeType.MAJOR, cost: 1, effect: 'Costs 20% HP, heal +80%' },
            { id: 'beacon', name: 'Beacon', type: NodeType.MAJOR, cost: 1, effect: 'Healed ally +20% damage 2 turns' },
            { id: 'miracle', name: 'Miracle', type: NodeType.CAPSTONE, cost: 1, effect: '-1 CD (min 1), heal +50%, can res once more' },
        ],
    },
    divine_shield: {
        early: [
            { id: 'stronger_shield', name: 'Stronger Shield', type: NodeType.MINOR, cost: 1, effect: '+12% absorb' },
            { id: 'blessed_barrier', name: 'Blessed Barrier', type: NodeType.MINOR, cost: 1, effect: '+10% absorb' },
            { id: 'holy_ward', name: 'Holy Ward', type: NodeType.MINOR, cost: 1, effect: '+10% absorb' },
            { id: 'reinforced_shield', name: 'Reinforced', type: NodeType.MINOR, cost: 1, effect: '+10% absorb' },
            { id: 'sanctuary', name: 'Sanctuary', type: NodeType.MAJOR, cost: 1, effect: 'Can cast on ally' },
        ],
        mid: [
            { id: 'reflective', name: 'Reflective', type: NodeType.MAJOR, cost: 2, effect: '35% blocked reflects back' },
            { id: 'debuff_block', name: 'Debuff Block', type: NodeType.MAJOR, cost: 1, effect: 'Also blocks debuffs' },
            { id: 'renewal_shield', name: 'Renewal', type: NodeType.MAJOR, cost: 2, effect: 'Shield break = heal 20%' },
            { id: 'aura_shield', name: 'Aura Shield', type: NodeType.MAJOR, cost: 1, effect: 'Allies get 30% of your shield' },
            { id: 'steadfast', name: 'Steadfast', type: NodeType.MAJOR, cost: 1, effect: 'Unbroken shield = +25% next' },
        ],
        deep: [
            { id: 'holy_fortress', name: 'Holy Fortress', type: NodeType.MAJOR, cost: 2, effect: 'Shield = 0.8 × WILL' },
            { id: 'martyrdom', name: 'Martyrdom', type: NodeType.MAJOR, cost: 2, effect: 'Absorb ally damage too' },
            { id: 'divine_aegis', name: 'Divine Aegis', type: NodeType.MAJOR, cost: 1, effect: 'Shield persists until broken' },
            { id: 'radiant_barrier', name: 'Radiant Barrier', type: NodeType.MAJOR, cost: 1, effect: 'Damages attackers 0.2× WILL' },
            { id: 'invincible', name: 'Invincible', type: NodeType.CAPSTONE, cost: 1, effect: 'Shield 1.0 × WILL, immune to all while active' },
        ],
    },
    holy_aura: {
        early: [
            { id: 'stronger_aura', name: 'Stronger Aura', type: NodeType.MINOR, cost: 1, effect: '+1% HP regen' },
            { id: 'wider_aura', name: 'Wider Aura', type: NodeType.MINOR, cost: 1, effect: '+1% HP regen' },
            { id: 'blessed_aura', name: 'Blessed Aura', type: NodeType.MINOR, cost: 1, effect: '+1% HP regen' },
            { id: 'holy_presence', name: 'Holy Presence', type: NodeType.MINOR, cost: 1, effect: '+1% HP regen' },
            { id: 'ally_regen', name: 'Ally Regen', type: NodeType.MAJOR, cost: 1, effect: 'Allies also regen 2%' },
        ],
        mid: [
            { id: 'cleansing_aura', name: 'Cleansing Aura', type: NodeType.MAJOR, cost: 2, effect: 'Removes 1 debuff/turn' },
            { id: 'damage_reduction', name: 'Damage Reduction', type: NodeType.MAJOR, cost: 1, effect: 'Allies take -10% damage' },
            { id: 'holy_damage', name: 'Holy Damage', type: NodeType.MAJOR, cost: 2, effect: 'Nearby enemies take 0.1× WILL/turn' },
            { id: 'resist_evil', name: 'Resist Evil', type: NodeType.MAJOR, cost: 1, effect: '+25% vs undead/demons' },
            { id: 'empowering', name: 'Empowering', type: NodeType.MAJOR, cost: 1, effect: 'Allies +10% damage' },
        ],
        deep: [
            { id: 'sanctuary_aura', name: 'Sanctuary', type: NodeType.MAJOR, cost: 2, effect: 'Allies can\'t die while you\'re above 50%' },
            { id: 'divine_protection', name: 'Divine Protection', type: NodeType.MAJOR, cost: 2, effect: 'First fatal hit on ally blocked' },
            { id: 'aura_of_might', name: 'Aura of Might', type: NodeType.MAJOR, cost: 1, effect: 'Allies +20% all stats' },
            { id: 'purifying_light', name: 'Purifying Light', type: NodeType.MAJOR, cost: 1, effect: 'Undead/demons -30% damage' },
            { id: 'avatar_of_hope', name: 'Avatar of Hope', type: NodeType.CAPSTONE, cost: 1, effect: 'Regen 8%, allies 5%, immune CC' },
        ],
    },
    consecration: {
        early: [
            { id: 'stronger_ground', name: 'Stronger Ground', type: NodeType.MINOR, cost: 1, effect: '+12% effects' },
            { id: 'wider_ground', name: 'Wider', type: NodeType.MINOR, cost: 1, effect: '+15% radius' },
            { id: 'holier', name: 'Holier', type: NodeType.MINOR, cost: 1, effect: '+10% effects' },
            { id: 'blessed_ground', name: 'Blessed', type: NodeType.MINOR, cost: 1, effect: '+10% effects' },
            { id: 'extended', name: 'Extended', type: NodeType.MAJOR, cost: 1, effect: '+1 turn duration' },
        ],
        mid: [
            { id: 'holy_fire', name: 'Holy Fire', type: NodeType.MAJOR, cost: 2, effect: 'Enemies burn +20%' },
            { id: 'sanctuary_ground', name: 'Sanctuary', type: NodeType.MAJOR, cost: 1, effect: 'Allies +20% DEF in zone' },
            { id: 'purifying_ground', name: 'Purifying', type: NodeType.MAJOR, cost: 2, effect: 'Cleanses 1 debuff/turn' },
            { id: 'smite_ground', name: 'Smite Ground', type: NodeType.MAJOR, cost: 1, effect: 'Undead/demons 2× damage' },
            { id: 'longer_ground', name: 'Longer', type: NodeType.MAJOR, cost: 1, effect: '+2 turn duration' },
        ],
        deep: [
            { id: 'moving_blessing', name: 'Moving Blessing', type: NodeType.MAJOR, cost: 2, effect: 'Zone follows caster' },
            { id: 'divine_judgment', name: 'Divine Judgment', type: NodeType.MAJOR, cost: 2, effect: 'Enemies can\'t heal in zone' },
            { id: 'eternal_light', name: 'Eternal Light', type: NodeType.MAJOR, cost: 1, effect: 'Zone permanent, 60% effect' },
            { id: 'hallowed_ground', name: 'Hallowed Ground', type: NodeType.MAJOR, cost: 1, effect: 'Allies resurrect in zone (once each)' },
            { id: 'sacred_domain', name: 'Sacred Domain', type: NodeType.CAPSTONE, cost: 1, effect: '+50% all effects, zone is entire battlefield' },
        ],
    },

    // ==================== WARRIOR TREES ====================
    cleave: {
        early: [
            { id: 'wider_arc', name: 'Wider Arc', type: NodeType.MINOR, cost: 1, effect: '+1 target' },
            { id: 'heavier', name: 'Heavier', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'sharper', name: 'Sharper', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'sweeping', name: 'Sweeping', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'rending', name: 'Rending', type: NodeType.MAJOR, cost: 1, effect: 'Bleed 15% over 2s' },
        ],
        mid: [
            { id: 'wide_arc', name: 'Wide Arc', type: NodeType.MAJOR, cost: 2, effect: 'Hits all enemies (AOE)' },
            { id: 'decapitate', name: 'Decapitate', type: NodeType.MAJOR, cost: 1, effect: '+50% vs below 25% HP' },
            { id: 'cleave_through', name: 'Cleave Through', type: NodeType.MAJOR, cost: 2, effect: 'Overkill hits next target' },
            { id: 'intimidate', name: 'Intimidate', type: NodeType.MAJOR, cost: 1, effect: 'Targets -15% damage 2s' },
            { id: 'bloodbath', name: 'Bloodbath', type: NodeType.MAJOR, cost: 1, effect: 'Heal 4% per hit' },
        ],
        deep: [
            { id: 'massacre', name: 'Massacre', type: NodeType.MAJOR, cost: 2, effect: '+25% per target hit' },
            { id: 'whirlwind_cleave', name: 'Whirlwind', type: NodeType.MAJOR, cost: 2, effect: 'Hits twice' },
            { id: 'execution_cleave', name: 'Execution Cleave', type: NodeType.MAJOR, cost: 1, effect: 'Kills reset CD to min (1)' },
            { id: 'terror', name: 'Terror', type: NodeType.MAJOR, cost: 1, effect: '20% chance target flees 1 turn' },
            { id: 'reaper', name: 'Reaper', type: NodeType.CAPSTONE, cost: 1, effect: 'AOE, +40%, heals 10% per kill' },
        ],
    },
    charge: {
        early: [
            { id: 'momentum', name: 'Momentum', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'speed_charge', name: 'Speed', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'impact_charge', name: 'Impact', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'stunning_impact', name: 'Stunning Impact', type: NodeType.MAJOR, cost: 1, effect: 'Stun +1 turn' },
            { id: 'bull_rush', name: 'Bull Rush', type: NodeType.MINOR, cost: 1, effect: '+5% crit' },
        ],
        mid: [
            { id: 'knockdown', name: 'Knockdown', type: NodeType.MAJOR, cost: 2, effect: 'Target knocked down, skip turn' },
            { id: 'trampling', name: 'Trampling', type: NodeType.MAJOR, cost: 1, effect: 'Damage enemies in path' },
            { id: 'unstoppable_charge', name: 'Unstoppable', type: NodeType.MAJOR, cost: 2, effect: 'Immune CC during charge' },
            { id: 'battle_ready', name: 'Battle Ready', type: NodeType.MAJOR, cost: 1, effect: '+20% ATK for 2 turns after' },
            { id: 'quick_charge', name: 'Quick Charge', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1)' },
        ],
        deep: [
            { id: 'devastating_charge', name: 'Devastating', type: NodeType.MAJOR, cost: 2, effect: '+50% damage, stun +1' },
            { id: 'war_path', name: 'War Path', type: NodeType.MAJOR, cost: 2, effect: 'Can charge multiple targets' },
            { id: 'earthquake_charge', name: 'Earthquake', type: NodeType.MAJOR, cost: 1, effect: 'AOE stun on arrival' },
            { id: 'juggernaut', name: 'Juggernaut', type: NodeType.MAJOR, cost: 1, effect: '+30% DEF for 3 turns after' },
            { id: 'unstoppable_force', name: 'Unstoppable Force', type: NodeType.CAPSTONE, cost: 1, effect: '+60% damage, 3s stun, immune all during' },
        ],
    },
    whirlwind: {
        early: [
            { id: 'faster_spin', name: 'Faster Spin', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'sharper_blades', name: 'Sharper', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'momentum_spin', name: 'Momentum', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'dervish', name: 'Dervish', type: NodeType.MINOR, cost: 1, effect: '+5% per enemy (max 25%)' },
            { id: 'razor_wind', name: 'Razor Wind', type: NodeType.MAJOR, cost: 1, effect: 'Bleed 12% over 2s' },
        ],
        mid: [
            { id: 'cyclone', name: 'Cyclone', type: NodeType.MAJOR, cost: 2, effect: 'Hits twice at 55% each' },
            { id: 'unstoppable_spin', name: 'Unstoppable', type: NodeType.MAJOR, cost: 1, effect: 'Immune stun/stagger while spinning' },
            { id: 'blood_cyclone', name: 'Blood Cyclone', type: NodeType.MAJOR, cost: 2, effect: 'Heal 4% per hit' },
            { id: 'tornado', name: 'Tornado', type: NodeType.MAJOR, cost: 1, effect: 'Pulls enemies to you' },
            { id: 'bladestorm', name: 'Bladestorm', type: NodeType.MAJOR, cost: 1, effect: '+1 hit per 3 enemies' },
        ],
        deep: [
            { id: 'death_spin', name: 'Death Spin', type: NodeType.MAJOR, cost: 2, effect: '+35% damage' },
            { id: 'endless_spin', name: 'Endless Spin', type: NodeType.MAJOR, cost: 2, effect: 'Can sustain 8% HP/turn, no CD' },
            { id: 'execution_spin', name: 'Execution Spin', type: NodeType.MAJOR, cost: 1, effect: '+60% vs below 30% HP' },
            { id: 'steel_tornado', name: 'Steel Tornado', type: NodeType.MAJOR, cost: 1, effect: '3 hits at 40% each' },
            { id: 'avatar_of_war', name: 'Avatar of War', type: NodeType.CAPSTONE, cost: 1, effect: '+50% damage, heals 10% per kill, immune CC' },
        ],
    },
    battle_cry: {
        early: [
            { id: 'louder', name: 'Louder', type: NodeType.MINOR, cost: 1, effect: '+5% ATK bonus' },
            { id: 'inspiring', name: 'Inspiring', type: NodeType.MINOR, cost: 1, effect: '+5% ATK bonus' },
            { id: 'rallying', name: 'Rallying', type: NodeType.MINOR, cost: 1, effect: '+5% ATK bonus' },
            { id: 'longer_cry', name: 'Longer', type: NodeType.MINOR, cost: 1, effect: '+1 turn duration' },
            { id: 'war_cry', name: 'War Cry', type: NodeType.MAJOR, cost: 1, effect: 'Enemies -10% damage 2s' },
        ],
        mid: [
            { id: 'battle_roar', name: 'Battle Roar', type: NodeType.MAJOR, cost: 2, effect: 'Also +20% crit damage' },
            { id: 'allies_too', name: 'Allies Too', type: NodeType.MAJOR, cost: 1, effect: 'Allies get 50% of buff' },
            { id: 'fear', name: 'Fear', type: NodeType.MAJOR, cost: 2, effect: '25% chance enemies flee 1 turn' },
            { id: 'adrenaline', name: 'Adrenaline', type: NodeType.MAJOR, cost: 1, effect: 'Also +15% SPD' },
            { id: 'refresh', name: 'Refresh', type: NodeType.MAJOR, cost: 1, effect: 'Kill extends duration 1 turn' },
        ],
        deep: [
            { id: 'berserker_rage', name: 'Berserker Rage', type: NodeType.MAJOR, cost: 2, effect: '+50% ATK, -20% DEF' },
            { id: 'unstoppable_rage', name: 'Unstoppable', type: NodeType.MAJOR, cost: 2, effect: 'Immune CC during buff' },
            { id: 'terrifying', name: 'Terrifying', type: NodeType.MAJOR, cost: 1, effect: 'Enemies can\'t target allies' },
            { id: 'eternal_fury', name: 'Eternal Fury', type: NodeType.MAJOR, cost: 1, effect: 'Buff permanent at 60%' },
            { id: 'warlord', name: 'Warlord', type: NodeType.CAPSTONE, cost: 1, effect: '+50% ATK, allies +30%, immune fear' },
        ],
    },
    execute: {
        early: [
            { id: 'heavier_exec', name: 'Heavier', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'sharper_exec', name: 'Sharper', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'brutal_exec', name: 'Brutal', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'merciless', name: 'Merciless', type: NodeType.MINOR, cost: 1, effect: '+5% execute threshold' },
            { id: 'bloodthirst', name: 'Bloodthirst', type: NodeType.MAJOR, cost: 1, effect: 'Heal 15% on kill' },
        ],
        mid: [
            { id: 'decapitation', name: 'Decapitation', type: NodeType.MAJOR, cost: 2, effect: 'Kills can\'t resurrect' },
            { id: 'cleaving_exec', name: 'Cleaving', type: NodeType.MAJOR, cost: 1, effect: 'Also hits adjacent 50%' },
            { id: 'momentum_exec', name: 'Momentum', type: NodeType.MAJOR, cost: 2, effect: 'Kill = +20% next' },
            { id: 'intimidating', name: 'Intimidating', type: NodeType.MAJOR, cost: 1, effect: 'Kill = enemies -20% damage 2s' },
            { id: 'quick_finish', name: 'Quick Finish', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1)' },
        ],
        deep: [
            { id: 'annihilate', name: 'Annihilate', type: NodeType.MAJOR, cost: 2, effect: '+10% threshold per kill (combat)' },
            { id: 'slaughter', name: 'Slaughter', type: NodeType.MAJOR, cost: 2, effect: 'Threshold 35%' },
            { id: 'endless_kills', name: 'Endless Kills', type: NodeType.MAJOR, cost: 1, effect: 'Kill = CD reset' },
            { id: 'dread', name: 'Dread', type: NodeType.MAJOR, cost: 1, effect: 'Kill = nearby enemies stunned 1s' },
            { id: 'executioner', name: 'Executioner', type: NodeType.CAPSTONE, cost: 1, effect: 'Threshold 40%, +60%, heal 25% on kill' },
        ],
    },

    // ==================== ROGUE TREES ====================
    backstab: {
        early: [
            { id: 'sharper_blade', name: 'Sharper', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'precision', name: 'Precision', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'deadly', name: 'Deadly', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'lethal', name: 'Lethal', type: NodeType.MINOR, cost: 1, effect: '+8% crit' },
            { id: 'twist_knife', name: 'Twist Knife', type: NodeType.MAJOR, cost: 1, effect: 'Crit damage +35%' },
        ],
        mid: [
            { id: 'assassinate_back', name: 'Assassinate', type: NodeType.MAJOR, cost: 2, effect: '+50% vs full HP' },
            { id: 'shadow_strike', name: 'Shadow Strike', type: NodeType.MAJOR, cost: 1, effect: 'Can\'t miss' },
            { id: 'ambush', name: 'Ambush', type: NodeType.MAJOR, cost: 2, effect: 'First combat attack +40%' },
            { id: 'exploit', name: 'Exploit', type: NodeType.MAJOR, cost: 1, effect: 'Ignore 25% DEF' },
            { id: 'dirty_fighting', name: 'Dirty Fighting', type: NodeType.MAJOR, cost: 1, effect: 'Poison 15% over 2s' },
        ],
        deep: [
            { id: 'lacerate', name: 'Lacerate', type: NodeType.MAJOR, cost: 2, effect: 'Crits bleed 30% over 3s' },
            { id: 'kill_confirm', name: 'Kill Confirm', type: NodeType.MAJOR, cost: 2, effect: 'Kill = -1 CD (min 1)' },
            { id: 'death_mark_rogue', name: 'Death Mark', type: NodeType.MAJOR, cost: 1, effect: 'Crits mark +20% damage 2s' },
            { id: 'throat_slit', name: 'Throat Slit', type: NodeType.MAJOR, cost: 1, effect: '+80% vs stunned/staggered' },
            { id: 'master_assassin', name: 'Master Assassin', type: NodeType.CAPSTONE, cost: 1, effect: 'Always crits, +50% damage, ignore 40% DEF' },
        ],
    },
    shadow_strike: {
        early: [
            { id: 'deeper_shadows', name: 'Deeper Shadows', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'quick_strike', name: 'Quick Strike', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'precise', name: 'Precise', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'deadly_strike', name: 'Deadly', type: NodeType.MINOR, cost: 1, effect: '+5% crit' },
            { id: 'from_shadows', name: 'From Shadows', type: NodeType.MAJOR, cost: 1, effect: '+20% if stealthed' },
        ],
        mid: [
            { id: 'vanishing_strike', name: 'Vanishing Strike', type: NodeType.MAJOR, cost: 2, effect: 'Reenter stealth after' },
            { id: 'execute_strike', name: 'Execute', type: NodeType.MAJOR, cost: 1, effect: '+40% vs below 30% HP' },
            { id: 'twin_fangs', name: 'Twin Fangs', type: NodeType.MAJOR, cost: 2, effect: 'Hits twice 60% each' },
            { id: 'crippling', name: 'Crippling', type: NodeType.MAJOR, cost: 1, effect: 'Target -25% SPD 2s' },
            { id: 'shadow_dance', name: 'Shadow Dance', type: NodeType.MAJOR, cost: 1, effect: 'Kill = free attack' },
        ],
        deep: [
            { id: 'death_dealer', name: 'Death Dealer', type: NodeType.MAJOR, cost: 2, effect: '+100% from stealth' },
            { id: 'phantom_blade', name: 'Phantom Blade', type: NodeType.MAJOR, cost: 2, effect: 'Ignore 50% DEF' },
            { id: 'soul_strike', name: 'Soul Strike', type: NodeType.MAJOR, cost: 1, effect: 'True damage from stealth' },
            { id: 'marked_for_death', name: 'Marked for Death', type: NodeType.MAJOR, cost: 1, effect: 'Target takes +30% 3s' },
            { id: 'shadow_master', name: 'Shadow Master', type: NodeType.CAPSTONE, cost: 1, effect: 'Always stealthed, +60%, always crits' },
        ],
    },
    evade: {
        early: [
            { id: 'quicker', name: 'Quicker', type: NodeType.MINOR, cost: 1, effect: '+3% dodge' },
            { id: 'nimble', name: 'Nimble', type: NodeType.MINOR, cost: 1, effect: '+3% dodge' },
            { id: 'agile', name: 'Agile', type: NodeType.MINOR, cost: 1, effect: '+3% dodge' },
            { id: 'reflexes', name: 'Reflexes', type: NodeType.MINOR, cost: 1, effect: '+3% dodge' },
            { id: 'counter_stance', name: 'Counter Stance', type: NodeType.MAJOR, cost: 1, effect: 'Dodge = counter 0.5× ATK' },
        ],
        mid: [
            { id: 'blur', name: 'Blur', type: NodeType.MAJOR, cost: 2, effect: '+10% dodge, +10% SPD' },
            { id: 'acrobatics', name: 'Acrobatics', type: NodeType.MAJOR, cost: 1, effect: 'Immune knockback' },
            { id: 'slippery', name: 'Slippery', type: NodeType.MAJOR, cost: 2, effect: 'Dodge debuffs too' },
            { id: 'riposte', name: 'Riposte', type: NodeType.MAJOR, cost: 1, effect: 'Counter = crit' },
            { id: 'shadow_step', name: 'Shadow Step', type: NodeType.MAJOR, cost: 1, effect: 'Dodge grants stealth' },
        ],
        deep: [
            { id: 'untouchable', name: 'Untouchable', type: NodeType.MAJOR, cost: 2, effect: '35% total dodge' },
            { id: 'ghost', name: 'Ghost', type: NodeType.MAJOR, cost: 2, effect: 'First 2 attacks/combat miss' },
            { id: 'wind_dancer', name: 'Wind Dancer', type: NodeType.MAJOR, cost: 1, effect: '+5% per dodge (combat)' },
            { id: 'deadly_grace', name: 'Deadly Grace', type: NodeType.MAJOR, cost: 1, effect: 'Dodge = next attack +30%' },
            { id: 'phantom', name: 'Phantom', type: NodeType.CAPSTONE, cost: 1, effect: '45% dodge, counter always crits +50%' },
        ],
    },
    ambush: {
        early: [
            { id: 'deeper_stealth', name: 'Deeper Stealth', type: NodeType.MINOR, cost: 1, effect: '+10% next attack' },
            { id: 'patient', name: 'Patient', type: NodeType.MINOR, cost: 1, effect: '+10% next attack' },
            { id: 'calculated', name: 'Calculated', type: NodeType.MINOR, cost: 1, effect: '+10% next attack' },
            { id: 'silent', name: 'Silent', type: NodeType.MINOR, cost: 1, effect: '+10% next attack' },
            { id: 'quick_hide', name: 'Quick Hide', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1)' },
        ],
        mid: [
            { id: 'vanish', name: 'Vanish', type: NodeType.MAJOR, cost: 2, effect: 'Become untargetable' },
            { id: 'preparation', name: 'Preparation', type: NodeType.MAJOR, cost: 1, effect: 'Reset other skill CDs' },
            { id: 'long_stealth', name: 'Long Stealth', type: NodeType.MAJOR, cost: 2, effect: 'Stealth lasts 2 turns' },
            { id: 'opening_strike', name: 'Opening Strike', type: NodeType.MAJOR, cost: 1, effect: 'Stealth attack stuns 1s' },
            { id: 'smoke_bomb', name: 'Smoke Bomb', type: NodeType.MAJOR, cost: 1, effect: 'Enemies -30% accuracy 2s' },
        ],
        deep: [
            { id: 'assassins_mark', name: 'Assassin\'s Mark', type: NodeType.MAJOR, cost: 2, effect: 'Mark target +40% damage from you' },
            { id: 'death_from_shadows', name: 'Death from Shadows', type: NodeType.MAJOR, cost: 2, effect: 'Stealth attack = 2× damage' },
            { id: 'permanent_cloak', name: 'Permanent Cloak', type: NodeType.MAJOR, cost: 1, effect: 'Stay stealthed after attack 50%' },
            { id: 'shadow_clone', name: 'Shadow Clone', type: NodeType.MAJOR, cost: 1, effect: 'Create decoy when stealthing' },
            { id: 'shadow_lord', name: 'Shadow Lord', type: NodeType.CAPSTONE, cost: 1, effect: 'Permanent stealth, +80% from stealth, can\'t be revealed' },
        ],
    },
    assassinate: {
        early: [
            { id: 'lethal_blade', name: 'Lethal', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'fatal', name: 'Fatal', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'deadly_assassinate', name: 'Deadly', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'executioner_blade', name: 'Executioner', type: NodeType.MINOR, cost: 1, effect: '+5% execute threshold' },
            { id: 'quick_kill', name: 'Quick Kill', type: NodeType.MAJOR, cost: 1, effect: 'Execute at 25% HP' },
        ],
        mid: [
            { id: 'massacre_assassin', name: 'Massacre', type: NodeType.MAJOR, cost: 2, effect: 'Kill = +25% next 2s' },
            { id: 'vital_strike', name: 'Vital Strike', type: NodeType.MAJOR, cost: 1, effect: 'Always crits below 40%' },
            { id: 'double_kill', name: 'Double Kill', type: NodeType.MAJOR, cost: 2, effect: 'Kill = free attack on another' },
            { id: 'pain', name: 'Pain', type: NodeType.MAJOR, cost: 1, effect: 'Target can\'t heal 3s' },
            { id: 'relentless', name: 'Relentless', type: NodeType.MAJOR, cost: 1, effect: 'Kill = CD reset' },
        ],
        deep: [
            { id: 'heart_seeker', name: 'Heart Seeker', type: NodeType.MAJOR, cost: 2, effect: 'Ignore 60% DEF' },
            { id: 'marked_execution', name: 'Marked Execution', type: NodeType.MAJOR, cost: 2, effect: 'Execute at 35%' },
            { id: 'chain_kill', name: 'Chain Kill', type: NodeType.MAJOR, cost: 1, effect: 'Kill = attack nearest 50%' },
            { id: 'perfect_kill', name: 'Perfect Kill', type: NodeType.MAJOR, cost: 1, effect: 'Execute heals full' },
            { id: 'angel_of_death', name: 'Angel of Death', type: NodeType.CAPSTONE, cost: 1, effect: 'Execute at 45%, +80%, reset all CDs on kill' },
        ],
    },

    // ==================== BERSERKER TREES ====================
    rampage: {
        early: [
            { id: 'harder_hits', name: 'Harder Hits', type: NodeType.MINOR, cost: 1, effect: '+8% per hit' },
            { id: 'more_fury', name: 'More Fury', type: NodeType.MINOR, cost: 1, effect: '+8% per hit' },
            { id: 'rage_hit', name: 'Rage', type: NodeType.MINOR, cost: 1, effect: '+8% per hit' },
            { id: 'frenzy_hit', name: 'Frenzy', type: NodeType.MINOR, cost: 1, effect: '+8% per hit' },
            { id: 'focused', name: 'Focused', type: NodeType.MAJOR, cost: 1, effect: 'All hits single target, +10% each' },
        ],
        mid: [
            { id: 'wild_swings', name: 'Wild Swings', type: NodeType.MAJOR, cost: 2, effect: '+2 max hits, -8%' },
            { id: 'unrelenting', name: 'Unrelenting', type: NodeType.MAJOR, cost: 1, effect: 'Kill = +2 hits' },
            { id: 'blood_mist', name: 'Blood Mist', type: NodeType.MAJOR, cost: 2, effect: 'Each hit heals 2.5%' },
            { id: 'concussive_rampage', name: 'Concussive', type: NodeType.MAJOR, cost: 1, effect: '10% stagger per hit' },
            { id: 'relentless_rampage', name: 'Relentless', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1)' },
        ],
        deep: [
            { id: 'primal_fury', name: 'Primal Fury', type: NodeType.MAJOR, cost: 2, effect: 'At <20% HP, all crit' },
            { id: 'annihilation', name: 'Annihilation', type: NodeType.MAJOR, cost: 2, effect: 'Single target = +60% total' },
            { id: 'endless_rampage', name: 'Endless Rampage', type: NodeType.MAJOR, cost: 1, effect: 'No hit cap while below 30%' },
            { id: 'bloodstorm', name: 'Bloodstorm', type: NodeType.MAJOR, cost: 1, effect: 'All hits also bleed' },
            { id: 'unstoppable_fury', name: 'Unstoppable Fury', type: NodeType.CAPSTONE, cost: 1, effect: '8 base hits, +50% damage, heal 5%/hit' },
        ],
    },
    frenzy: {
        early: [
            { id: 'rage', name: 'Rage', type: NodeType.MINOR, cost: 1, effect: '+0.2% per 2% missing' },
            { id: 'fury', name: 'Fury', type: NodeType.MINOR, cost: 1, effect: '+0.2% per 2% missing' },
            { id: 'anger', name: 'Anger', type: NodeType.MINOR, cost: 1, effect: '+0.2% per 2% missing' },
            { id: 'wrath', name: 'Wrath', type: NodeType.MINOR, cost: 1, effect: '+0.2% per 2% missing' },
            { id: 'battle_rage', name: 'Battle Rage', type: NodeType.MAJOR, cost: 1, effect: 'Also +0.3% SPD per 2% missing' },
        ],
        mid: [
            { id: 'bloodlust', name: 'Bloodlust', type: NodeType.MAJOR, cost: 2, effect: 'Also +0.5% leech per 5% missing' },
            { id: 'undying_rage', name: 'Undying Rage', type: NodeType.MAJOR, cost: 1, effect: 'At <10% HP, immune death 1 turn' },
            { id: 'pain_is_power', name: 'Pain is Power', type: NodeType.MAJOR, cost: 2, effect: '+15% when damaged' },
            { id: 'berserker_call', name: 'Berserker Call', type: NodeType.MAJOR, cost: 1, effect: 'Activate: take 25% HP, +40% 3s' },
            { id: 'see_red', name: 'See Red', type: NodeType.MAJOR, cost: 1, effect: 'At <20% HP, +25% crit' },
        ],
        deep: [
            { id: 'rampage_mode', name: 'Rampage Mode', type: NodeType.MAJOR, cost: 2, effect: 'At <30% HP, attacks AOE' },
            { id: 'deathwish', name: 'Deathwish', type: NodeType.MAJOR, cost: 2, effect: 'At <10% HP, 2× damage' },
            { id: 'no_retreat', name: 'No Retreat', type: NodeType.MAJOR, cost: 1, effect: 'Can\'t die first fatal hit' },
            { id: 'immortal_rage', name: 'Immortal Rage', type: NodeType.MAJOR, cost: 1, effect: 'At 1 HP, immune 2 turns' },
            { id: 'avatar_of_carnage', name: 'Avatar of Carnage', type: NodeType.CAPSTONE, cost: 1, effect: '+2% per 2% missing, immune below 20%' },
        ],
    },
    blood_rage: {
        early: [
            { id: 'stronger_rage', name: 'Stronger Rage', type: NodeType.MINOR, cost: 1, effect: '+5% damage bonus' },
            { id: 'faster_rage', name: 'Faster Rage', type: NodeType.MINOR, cost: 1, effect: '+5% SPD bonus' },
            { id: 'harder_rage', name: 'Harder Rage', type: NodeType.MINOR, cost: 1, effect: '+5% damage bonus' },
            { id: 'controlled', name: 'Controlled', type: NodeType.MINOR, cost: 1, effect: '-1% HP drain' },
            { id: 'extended_rage', name: 'Extended', type: NodeType.MAJOR, cost: 1, effect: '+1 turn duration' },
        ],
        mid: [
            { id: 'blood_frenzy', name: 'Blood Frenzy', type: NodeType.MAJOR, cost: 2, effect: 'Also +15% crit' },
            { id: 'taste_of_blood', name: 'Taste of Blood', type: NodeType.MAJOR, cost: 1, effect: 'Kills heal 6%' },
            { id: 'uncontrollable', name: 'Uncontrollable', type: NodeType.MAJOR, cost: 2, effect: '+25% damage, can\'t stop' },
            { id: 'crimson_haze', name: 'Crimson Haze', type: NodeType.MAJOR, cost: 1, effect: 'Immune CC' },
            { id: 'final_stand', name: 'Final Stand', type: NodeType.MAJOR, cost: 1, effect: 'If ends below 10%, +100% last turn' },
        ],
        deep: [
            { id: 'hemorrhage', name: 'Hemorrhage', type: NodeType.MAJOR, cost: 2, effect: 'Hits bleed while raging' },
            { id: 'eternal_rage', name: 'Eternal Rage', type: NodeType.MAJOR, cost: 2, effect: 'Can extend with kills' },
            { id: 'blood_god', name: 'Blood God', type: NodeType.MAJOR, cost: 1, effect: 'No HP drain, -10% damage bonus' },
            { id: 'crimson_avatar', name: 'Crimson Avatar', type: NodeType.MAJOR, cost: 1, effect: 'Heal = damage dealt while raging' },
            { id: 'aspect_of_carnage', name: 'Aspect of Carnage', type: NodeType.CAPSTONE, cost: 1, effect: '+60% damage, +40% SPD, heals on kill' },
        ],
    },
    reckless_blow: {
        early: [
            { id: 'heavier_reckless', name: 'Heavier', type: NodeType.MINOR, cost: 1, effect: '+12% damage' },
            { id: 'harder_reckless', name: 'Harder', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'brutal_reckless', name: 'Brutal', type: NodeType.MINOR, cost: 1, effect: '+10% damage' },
            { id: 'pain_tolerance', name: 'Pain Tolerance', type: NodeType.MINOR, cost: 1, effect: '-2% self-damage' },
            { id: 'all_in', name: 'All In', type: NodeType.MAJOR, cost: 1, effect: '+25% damage, +5% self' },
        ],
        mid: [
            { id: 'blood_price', name: 'Blood Price', type: NodeType.MAJOR, cost: 2, effect: 'Kill = heal self-damage' },
            { id: 'mutual_destruction', name: 'Mutual Destruction', type: NodeType.MAJOR, cost: 1, effect: 'Self-damage also hits target' },
            { id: 'fury_fueled', name: 'Fury Fueled', type: NodeType.MAJOR, cost: 2, effect: 'Self-damage triggers Frenzy' },
            { id: 'desperate', name: 'Desperate', type: NodeType.MAJOR, cost: 1, effect: 'At <25% HP, no self-damage' },
            { id: 'scar_tissue', name: 'Scar Tissue', type: NodeType.MAJOR, cost: 1, effect: '-1% self per use (combat)' },
        ],
        deep: [
            { id: 'death_wish_blow', name: 'Death Wish', type: NodeType.MAJOR, cost: 2, effect: 'Self-damage can\'t kill' },
            { id: 'ultimate_recklessness', name: 'Ultimate Recklessness', type: NodeType.MAJOR, cost: 2, effect: '+80% damage, +15% self' },
            { id: 'blood_explosion', name: 'Blood Explosion', type: NodeType.MAJOR, cost: 1, effect: 'Self-damage = AOE to enemies' },
            { id: 'masochism', name: 'Masochism', type: NodeType.MAJOR, cost: 1, effect: 'Self-damage heals instead' },
            { id: 'undying_berserker', name: 'Undying Berserker', type: NodeType.CAPSTONE, cost: 1, effect: '+60% damage, no self-damage, +1 CD' },
        ],
    },
    berserk: {
        early: [
            { id: 'stronger_berserk', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+8% ATK bonus' },
            { id: 'longer_berserk', name: 'Longer', type: NodeType.MINOR, cost: 1, effect: '+1 turn duration' },
            { id: 'harder_berserk', name: 'Harder', type: NodeType.MINOR, cost: 1, effect: '+5% ATK bonus' },
            { id: 'less_penalty', name: 'Less Penalty', type: NodeType.MINOR, cost: 1, effect: '-5% DEF penalty' },
            { id: 'war_paint', name: 'War Paint', type: NodeType.MAJOR, cost: 1, effect: 'Also +15% crit' },
        ],
        mid: [
            { id: 'blood_fury', name: 'Blood Fury', type: NodeType.MAJOR, cost: 2, effect: 'Attacks heal 5%' },
            { id: 'intimidating_roar', name: 'Intimidating Roar', type: NodeType.MAJOR, cost: 1, effect: 'Enemies -20% damage' },
            { id: 'unstoppable_berserk', name: 'Unstoppable', type: NodeType.MAJOR, cost: 2, effect: 'Immune CC' },
            { id: 'feral', name: 'Feral', type: NodeType.MAJOR, cost: 1, effect: '+20% SPD' },
            { id: 'kill_frenzy', name: 'Kill Frenzy', type: NodeType.MAJOR, cost: 1, effect: 'Kill extends 1 turn' },
        ],
        deep: [
            { id: 'primal', name: 'Primal', type: NodeType.MAJOR, cost: 2, effect: '+60% ATK, -30% DEF' },
            { id: 'blood_drunk', name: 'Blood Drunk', type: NodeType.MAJOR, cost: 2, effect: 'Heals 10% per kill' },
            { id: 'savage', name: 'Savage', type: NodeType.MAJOR, cost: 1, effect: 'Attacks AOE while berserking' },
            { id: 'undying_will', name: 'Undying Will', type: NodeType.MAJOR, cost: 1, effect: 'Can\'t die while berserking' },
            { id: 'avatar_of_rage', name: 'Avatar of Rage', type: NodeType.CAPSTONE, cost: 1, effect: '+80% ATK, no DEF penalty, permanent' },
        ],
    },

    // ==================== GUARDIAN TREES ====================
    shield_block: {
        early: [
            { id: 'harder_shield', name: 'Harder Shield', type: NodeType.MINOR, cost: 1, effect: '+2% reduction' },
            { id: 'thicker', name: 'Thicker', type: NodeType.MINOR, cost: 1, effect: '+2% reduction' },
            { id: 'reinforced_block', name: 'Reinforced', type: NodeType.MINOR, cost: 1, effect: '+2% reduction' },
            { id: 'sturdy', name: 'Sturdy', type: NodeType.MINOR, cost: 1, effect: '+2% reduction' },
            { id: 'reactive', name: 'Reactive', type: NodeType.MAJOR, cost: 1, effect: 'Big hit (>15% HP) = counter 0.3× DEF' },
        ],
        mid: [
            { id: 'shield_wall', name: 'Shield Wall', type: NodeType.MAJOR, cost: 2, effect: '+12% block, -10% SPD' },
            { id: 'bulwark', name: 'Bulwark', type: NodeType.MAJOR, cost: 1, effect: 'Can\'t take >25% HP per hit' },
            { id: 'deflect', name: 'Deflect', type: NodeType.MAJOR, cost: 2, effect: '15% negate attack' },
            { id: 'brace', name: 'Brace', type: NodeType.MAJOR, cost: 1, effect: 'Activate: +25% block, skip attack' },
            { id: 'cover', name: 'Cover', type: NodeType.MAJOR, cost: 1, effect: 'Block for lowest HP ally' },
        ],
        deep: [
            { id: 'unbreakable', name: 'Unbreakable', type: NodeType.MAJOR, cost: 2, effect: '0.15× DEF scaling' },
            { id: 'fortress', name: 'Fortress', type: NodeType.MAJOR, cost: 2, effect: '+5% per ally behind' },
            { id: 'perfect_guard', name: 'Perfect Guard', type: NodeType.MAJOR, cost: 1, effect: '25% negate, counter on negate' },
            { id: 'immovable', name: 'Immovable', type: NodeType.MAJOR, cost: 1, effect: 'Immune knockback/pull' },
            { id: 'living_fortress', name: 'Living Fortress', type: NodeType.CAPSTONE, cost: 1, effect: '+20% block, can\'t take >20% HP, counters all' },
        ],
    },
    taunt: {
        early: [
            { id: 'longer_taunt', name: 'Longer', type: NodeType.MINOR, cost: 1, effect: '+1 turn duration' },
            { id: 'stronger_taunt', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+1 turn duration' },
            { id: 'infuriating', name: 'Infuriating', type: NodeType.MINOR, cost: 1, effect: 'Taunted -10% damage' },
            { id: 'mocking', name: 'Mocking', type: NodeType.MINOR, cost: 1, effect: 'Taunted -10% damage' },
            { id: 'mass_taunt', name: 'Mass Taunt', type: NodeType.MAJOR, cost: 1, effect: 'All enemies, 1 turn each' },
        ],
        mid: [
            { id: 'mocking_blow', name: 'Mocking Blow', type: NodeType.MAJOR, cost: 2, effect: 'Also 0.4× ATK damage' },
            { id: 'iron_will', name: 'Iron Will', type: NodeType.MAJOR, cost: 1, effect: '+20% DEF vs taunted' },
            { id: 'revenge', name: 'Revenge', type: NodeType.MAJOR, cost: 2, effect: '+15% damage vs taunted' },
            { id: 'defenders_oath', name: 'Defender\'s Oath', type: NodeType.MAJOR, cost: 1, effect: 'Taunted can\'t target allies (even AOE)' },
            { id: 'provoke', name: 'Provoke', type: NodeType.MAJOR, cost: 1, effect: '-1 CD (min 1), 1 turn duration' },
        ],
        deep: [
            { id: 'martyr', name: 'Martyr', type: NodeType.MAJOR, cost: 2, effect: 'Take 35% ally damage while taunting' },
            { id: 'untouchable_taunt', name: 'Untouchable', type: NodeType.MAJOR, cost: 2, effect: '+30% evasion vs taunted' },
            { id: 'overwhelming_presence', name: 'Overwhelming Presence', type: NodeType.MAJOR, cost: 1, effect: 'Taunted can\'t skill' },
            { id: 'guardian_angel', name: 'Guardian Angel', type: NodeType.MAJOR, cost: 1, effect: 'Allies immune while you have taunt up' },
            { id: 'immortal_guardian', name: 'Immortal Guardian', type: NodeType.CAPSTONE, cost: 1, effect: 'Permanent taunt, +30% DEF, regen 3%/turn' },
        ],
    },
    fortify: {
        early: [
            { id: 'stronger_fortify', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+6% to bonuses' },
            { id: 'harder_fortify', name: 'Harder', type: NodeType.MINOR, cost: 1, effect: '+5% to bonuses' },
            { id: 'tougher', name: 'Tougher', type: NodeType.MINOR, cost: 1, effect: '+5% to bonuses' },
            { id: 'longer_fortify', name: 'Longer', type: NodeType.MINOR, cost: 1, effect: '+1 turn duration' },
            { id: 'iron_skin', name: 'Iron Skin', type: NodeType.MAJOR, cost: 1, effect: 'Immune bleed/poison' },
        ],
        mid: [
            { id: 'aura_fortify', name: 'Aura', type: NodeType.MAJOR, cost: 2, effect: 'Allies get 40% of bonus' },
            { id: 'reactive_fortify', name: 'Reactive', type: NodeType.MAJOR, cost: 1, effect: 'Auto-triggers below 35% (once)' },
            { id: 'absorb', name: 'Absorb', type: NodeType.MAJOR, cost: 2, effect: '+HP shield = 25% DEF' },
            { id: 'unshakeable', name: 'Unshakeable', type: NodeType.MAJOR, cost: 1, effect: 'Immune stun/knockback' },
            { id: 'counter_stance_fortify', name: 'Counter Stance', type: NodeType.MAJOR, cost: 1, effect: 'Counter all attacks 0.25× DEF' },
        ],
        deep: [
            { id: 'last_bastion', name: 'Last Bastion', type: NodeType.MAJOR, cost: 2, effect: 'Can\'t die while fortified' },
            { id: 'mountain', name: 'Mountain', type: NodeType.MAJOR, cost: 2, effect: '+50% to bonuses' },
            { id: 'regenerating', name: 'Regenerating', type: NodeType.MAJOR, cost: 1, effect: 'Regen 5%/turn fortified' },
            { id: 'immunity', name: 'Immunity', type: NodeType.MAJOR, cost: 1, effect: 'Immune all debuffs' },
            { id: 'eternal_bulwark', name: 'Eternal Bulwark', type: NodeType.CAPSTONE, cost: 1, effect: 'Permanent fortify at 80% effect' },
        ],
    },
    retaliate: {
        early: [
            { id: 'more_likely', name: 'More Likely', type: NodeType.MINOR, cost: 1, effect: '+5% proc' },
            { id: 'reflexive', name: 'Reflexive', type: NodeType.MINOR, cost: 1, effect: '+5% proc' },
            { id: 'quick_retaliate', name: 'Quick', type: NodeType.MINOR, cost: 1, effect: '+5% proc' },
            { id: 'ready', name: 'Ready', type: NodeType.MINOR, cost: 1, effect: '+5% proc' },
            { id: 'improved', name: 'Improved', type: NodeType.MAJOR, cost: 1, effect: 'Counter = 0.65× DEF' },
        ],
        mid: [
            { id: 'thorns', name: 'Thorns', type: NodeType.MAJOR, cost: 2, effect: 'Also reflect 12% taken' },
            { id: 'certain', name: 'Certain', type: NodeType.MAJOR, cost: 1, effect: '100% if crit you' },
            { id: 'staggering', name: 'Staggering', type: NodeType.MAJOR, cost: 2, effect: '25% stagger on counter' },
            { id: 'riposte_retaliate', name: 'Riposte', type: NodeType.MAJOR, cost: 1, effect: 'Counter = 0.8× ATK instead' },
            { id: 'punishing', name: 'Punishing', type: NodeType.MAJOR, cost: 1, effect: 'Counter crits below 50%' },
        ],
        deep: [
            { id: 'endless', name: 'Endless', type: NodeType.MAJOR, cost: 2, effect: 'No limit per turn' },
            { id: 'vengeance', name: 'Vengeance', type: NodeType.MAJOR, cost: 2, effect: '+12% per hit this combat' },
            { id: 'devastate', name: 'Devastate', type: NodeType.MAJOR, cost: 1, effect: 'Counter = 1.0× DEF' },
            { id: 'reflect_all', name: 'Reflect All', type: NodeType.MAJOR, cost: 1, effect: 'Reflect 25% all damage' },
            { id: 'retribution_incarnate', name: 'Retribution Incarnate', type: NodeType.CAPSTONE, cost: 1, effect: '100% counter, 1.2× DEF, stagger always' },
        ],
    },
    last_stand: {
        early: [
            { id: 'stronger_stand', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+10% DEF' },
            { id: 'tougher_stand', name: 'Tougher', type: NodeType.MINOR, cost: 1, effect: '+10% DEF' },
            { id: 'harder_stand', name: 'Harder', type: NodeType.MINOR, cost: 1, effect: '+10% DEF' },
            { id: 'longer_stand', name: 'Longer', type: NodeType.MINOR, cost: 1, effect: '+1 turn' },
            { id: 'rally', name: 'Rally', type: NodeType.MAJOR, cost: 1, effect: 'Also heal 20%' },
        ],
        mid: [
            { id: 'defiant', name: 'Defiant', type: NodeType.MAJOR, cost: 2, effect: '+35% damage during' },
            { id: 'indomitable', name: 'Indomitable', type: NodeType.MAJOR, cost: 1, effect: 'Trigger at <30% HP' },
            { id: 'blaze_of_glory', name: 'Blaze of Glory', type: NodeType.MAJOR, cost: 2, effect: 'When ends, AOE 0.8× DEF' },
            { id: 'undying', name: 'Undying', type: NodeType.MAJOR, cost: 1, effect: 'If survive, heal to 30%' },
            { id: 'heroic_sacrifice', name: 'Heroic Sacrifice', type: NodeType.MAJOR, cost: 1, effect: 'Allies immune during your stand' },
        ],
        deep: [
            { id: 'phoenix', name: 'Phoenix', type: NodeType.MAJOR, cost: 2, effect: 'Can use twice per quest' },
            { id: 'legendary', name: 'Legendary', type: NodeType.MAJOR, cost: 2, effect: 'Immune all debuffs during' },
            { id: 'eternal_stand', name: 'Eternal', type: NodeType.MAJOR, cost: 1, effect: 'Duration +2 turns' },
            { id: 'glory', name: 'Glory', type: NodeType.MAJOR, cost: 1, effect: '+80% DEF during' },
            { id: 'immortal_legend', name: 'Immortal Legend', type: NodeType.CAPSTONE, cost: 1, effect: 'Trigger at 40%, heal full after, +100% DEF' },
        ],
    },

    // ==================== SUMMONER TREES ====================
    summon_wolf: {
        early: [
            { id: 'stronger_wolf', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'faster_wolf', name: 'Faster', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'tougher_wolf', name: 'Tougher', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'fiercer', name: 'Fiercer', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'pack', name: 'Pack', type: NodeType.MAJOR, cost: 1, effect: '2 wolves at 75% each' },
        ],
        mid: [
            { id: 'alpha', name: 'Alpha', type: NodeType.MAJOR, cost: 2, effect: 'Single, +60% stats' },
            { id: 'dire_wolf', name: 'Dire Wolf', type: NodeType.MAJOR, cost: 1, effect: '+40% HP, cleave attacks' },
            { id: 'rabid', name: 'Rabid', type: NodeType.MAJOR, cost: 2, effect: 'Attacks bleed' },
            { id: 'swift', name: 'Swift', type: NodeType.MAJOR, cost: 1, effect: '+35% SPD' },
            { id: 'bond', name: 'Bond', type: NodeType.MAJOR, cost: 1, effect: 'Death heals you 25%' },
        ],
        deep: [
            { id: 'spirit_wolf', name: 'Spirit Wolf', type: NodeType.MAJOR, cost: 2, effect: 'Incorporeal, 25% avoid' },
            { id: 'pack_leader', name: 'Pack Leader', type: NodeType.MAJOR, cost: 2, effect: '3 wolves at 65% each' },
            { id: 'primal_wolf', name: 'Primal', type: NodeType.MAJOR, cost: 1, effect: 'Wolf skills: Frenzy, Rampage' },
            { id: 'howl', name: 'Howl', type: NodeType.MAJOR, cost: 1, effect: 'Taunt on summon' },
            { id: 'alpha_predator', name: 'Alpha Predator', type: NodeType.CAPSTONE, cost: 1, effect: 'Wolf = 100% your stats, shares your skills' },
        ],
    },
    summon_skeleton: {
        early: [
            { id: 'stronger_skel', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'armored_skel', name: 'Armored', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'armed_skel', name: 'Armed', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'reinforced_skel', name: 'Reinforced', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'skeleton_mage_summon', name: 'Skeleton Mage', type: NodeType.MAJOR, cost: 1, effect: 'Casts Spark' },
        ],
        mid: [
            { id: 'archer', name: 'Archer', type: NodeType.MAJOR, cost: 1, effect: 'Ranged attacks' },
            { id: 'army_skel', name: 'Army', type: NodeType.MAJOR, cost: 2, effect: '3 at 55% each' },
            { id: 'bone_armor_skel', name: 'Bone Armor', type: NodeType.MAJOR, cost: 1, effect: '+35% DEF' },
            { id: 'reassemble_skel', name: 'Reassemble', type: NodeType.MAJOR, cost: 2, effect: 'Revive after 2 turns' },
            { id: 'exploding', name: 'Exploding', type: NodeType.MAJOR, cost: 1, effect: 'Death = 0.4× WILL AOE' },
        ],
        deep: [
            { id: 'bone_giant_summon', name: 'Bone Giant', type: NodeType.MAJOR, cost: 2, effect: 'Single, 2.5× stats' },
            { id: 'legion_skel', name: 'Legion', type: NodeType.MAJOR, cost: 2, effect: '5 at 45% each' },
            { id: 'champion', name: 'Champion', type: NodeType.MAJOR, cost: 1, effect: 'Has random skill from you' },
            { id: 'command_dead_summon', name: 'Command Dead', type: NodeType.MAJOR, cost: 1, effect: 'Raise slain enemies' },
            { id: 'army_of_darkness', name: 'Army of Darkness', type: NodeType.CAPSTONE, cost: 1, effect: 'Unlimited skeletons, +50% stats' },
        ],
    },
    summon_golem: {
        early: [
            { id: 'stronger_golem', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'tougher_golem', name: 'Tougher', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'heavier_golem', name: 'Heavier', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'harder_golem', name: 'Harder', type: NodeType.MINOR, cost: 1, effect: '+10% stats' },
            { id: 'clay', name: 'Clay', type: NodeType.MAJOR, cost: 1, effect: 'Regen 4%/turn' },
        ],
        mid: [
            { id: 'iron', name: 'Iron', type: NodeType.MAJOR, cost: 2, effect: '+35% DEF, reflects' },
            { id: 'explosive', name: 'Explosive', type: NodeType.MAJOR, cost: 1, effect: 'Detonate for AOE' },
            { id: 'frost_golem', name: 'Frost', type: NodeType.MAJOR, cost: 2, effect: 'Attacks slow' },
            { id: 'guardian_golem', name: 'Guardian', type: NodeType.MAJOR, cost: 1, effect: 'Taunts, protects you' },
            { id: 'blood_golem', name: 'Blood', type: NodeType.MAJOR, cost: 1, effect: 'Heals you 4% when hits' },
        ],
        deep: [
            { id: 'colossus', name: 'Colossus', type: NodeType.MAJOR, cost: 2, effect: '2.5× stats, -40% SPD' },
            { id: 'twin', name: 'Twin', type: NodeType.MAJOR, cost: 2, effect: '2 golems at 70% each' },
            { id: 'molten', name: 'Molten', type: NodeType.MAJOR, cost: 1, effect: 'Fire damage, burns' },
            { id: 'immortal_golem', name: 'Immortal', type: NodeType.MAJOR, cost: 1, effect: 'Revives once per combat' },
            { id: 'titan', name: 'Titan', type: NodeType.CAPSTONE, cost: 1, effect: '3× stats, has your DEF skills' },
        ],
    },
    command: {
        early: [
            { id: 'stronger_command', name: 'Stronger', type: NodeType.MINOR, cost: 1, effect: '+6% bonus' },
            { id: 'louder_command', name: 'Louder', type: NodeType.MINOR, cost: 1, effect: '+5% bonus' },
            { id: 'fiercer_command', name: 'Fiercer', type: NodeType.MINOR, cost: 1, effect: '+5% bonus' },
            { id: 'longer_command', name: 'Longer', type: NodeType.MINOR, cost: 1, effect: '+1 turn' },
            { id: 'battle_orders', name: 'Battle Orders', type: NodeType.MAJOR, cost: 1, effect: 'Also +15% DEF' },
        ],
        mid: [
            { id: 'frenzy_command', name: 'Frenzy', type: NodeType.MAJOR, cost: 2, effect: 'Attack twice, +15% taken' },
            { id: 'heal_pack', name: 'Heal Pack', type: NodeType.MAJOR, cost: 1, effect: 'Also heal 25%' },
            { id: 'coordinated', name: 'Coordinated', type: NodeType.MAJOR, cost: 2, effect: 'All attack same target' },
            { id: 'enrage', name: 'Enrage', type: NodeType.MAJOR, cost: 1, effect: '+30% SPD' },
            { id: 'sacrifice_command', name: 'Sacrifice', type: NodeType.MAJOR, cost: 1, effect: 'Kill one, others +its stats' },
        ],
        deep: [
            { id: 'link_command', name: 'Link', type: NodeType.MAJOR, cost: 2, effect: 'Share HP pool' },
            { id: 'unleash', name: 'Unleash', type: NodeType.MAJOR, cost: 2, effect: 'Double attack this turn' },
            { id: 'empower', name: 'Empower', type: NodeType.MAJOR, cost: 1, effect: '+50% all stats 1 turn' },
            { id: 'eternal_command', name: 'Eternal Command', type: NodeType.MAJOR, cost: 1, effect: 'Buffs permanent' },
            { id: 'overlord', name: 'Overlord', type: NodeType.CAPSTONE, cost: 1, effect: '+60% damage/DEF, attack twice, permanent' },
        ],
    },
    spirit_link: {
        early: [
            { id: 'stronger_link', name: 'Stronger Link', type: NodeType.MINOR, cost: 1, effect: '+5% transfer' },
            { id: 'deeper_link', name: 'Deeper', type: NodeType.MINOR, cost: 1, effect: '+5% transfer' },
            { id: 'wider_link', name: 'Wider', type: NodeType.MINOR, cost: 1, effect: '+5% transfer' },
            { id: 'bonded', name: 'Bonded', type: NodeType.MINOR, cost: 1, effect: '+5% transfer' },
            { id: 'life_link_summoner', name: 'Life Link', type: NodeType.MAJOR, cost: 1, effect: 'Summon death = heal 12%' },
        ],
        mid: [
            { id: 'empathic', name: 'Empathic', type: NodeType.MAJOR, cost: 2, effect: 'Your buffs 40% to summons' },
            { id: 'sacrifice_shield', name: 'Sacrifice Shield', type: NodeType.MAJOR, cost: 1, effect: 'Summon dies for you (once)' },
            { id: 'mend', name: 'Mend', type: NodeType.MAJOR, cost: 2, effect: 'Your healing 50% to summons' },
            { id: 'death_pact', name: 'Death Pact', type: NodeType.MAJOR, cost: 1, effect: 'Take damage to save summon' },
            { id: 'shared_power', name: 'Shared Power', type: NodeType.MAJOR, cost: 1, effect: '+10% your damage per summon' },
        ],
        deep: [
            { id: 'soul_bond', name: 'Soul Bond', type: NodeType.MAJOR, cost: 2, effect: 'Summons revive after 3 turns' },
            { id: 'eternal_link', name: 'Eternal', type: NodeType.MAJOR, cost: 2, effect: 'Linked summons +25% stats' },
            { id: 'hivemind', name: 'Hivemind', type: NodeType.MAJOR, cost: 1, effect: 'You feel no pain (summons take all)' },
            { id: 'one_mind', name: 'One Mind', type: NodeType.MAJOR, cost: 1, effect: 'Your skills usable by summons' },
            { id: 'legion_commander', name: 'Legion Commander', type: NodeType.CAPSTONE, cost: 1, effect: '70% to summons, they +50% stats, revive 2 turns' },
        ],
    },
};

Object.freeze(SKILL_TREES);

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
     * Get all skills of an archetype
     */
    getByArchetype(archetype) {
        return Object.values(SKILL_DEFINITIONS).filter(s => s.archetype === archetype);
    },

    /**
     * Get all skill IDs
     */
    getAllIds() {
        return Object.keys(SKILL_DEFINITIONS);
    },

    /**
     * Roll random skills for a new recruit (V3 - equal chance all skills)
     * @param {number} count - Number of skills to roll (default 3)
     * @returns {Array} Array of { skillId, points, maxPoints, stackCount }
     */
    rollForRecruit(count = 3) {
        const allSkillIds = this.getAllIds();
        const rolled = [];

        for (let i = 0; i < count; i++) {
            // Equal chance for any of the 50 skills
            const skillId = allSkillIds[Math.floor(Math.random() * allSkillIds.length)];
            rolled.push(skillId);
        }

        // Process duplicates - merge into stacked skills
        return this.processRolledSkills(rolled);
    },

    /**
     * Process rolled skill IDs into skill objects with stacking
     * Duplicates merge: 1× = 5 max, 2× = 10 max, 3× = 15 max
     * @param {Array} skillIds - Array of skill IDs (may have duplicates)
     * @returns {Array} Processed skill objects
     */
    processRolledSkills(skillIds) {
        const counts = {};
        skillIds.forEach(id => {
            counts[id] = (counts[id] || 0) + 1;
        });

        const result = [];
        for (const [skillId, stackCount] of Object.entries(counts)) {
            result.push({
                skillId,
                points: 0,           // Points invested in skill tree
                maxPoints: this.getMaxPoints(stackCount),
                stackCount,          // 1, 2, or 3
            });
        }

        return result;
    },

    /**
     * Get max skill tree points based on stack count
     * 1× = 5 points (early tier), 2× = 10 (mid), 3× = 15 (deep + capstone)
     */
    getMaxPoints(stackCount) {
        if (stackCount >= 3) return 15;
        if (stackCount === 2) return 10;
        return 5;
    },

    /**
     * Get accessible tree tiers based on max points
     */
    getAccessibleTiers(maxPoints) {
        const tiers = [TreeTier.EARLY];
        if (maxPoints >= 10) tiers.push(TreeTier.MID);
        if (maxPoints >= 15) tiers.push(TreeTier.DEEP);
        return tiers;
    },

    /**
     * Determine hero's archetype for art based on their skills
     * Returns the archetype with most skills, or random if tied
     * @param {Array} skills - Hero's skills array
     * @returns {string} Archetype enum value
     */
    determineArchetype(skills) {
        const archetypeCounts = {};

        for (const skill of skills) {
            const def = this.get(skill.skillId);
            if (!def || !def.archetype) continue;

            archetypeCounts[def.archetype] = (archetypeCounts[def.archetype] || 0) + 1;
        }

        // Find max count
        let maxCount = 0;
        for (const count of Object.values(archetypeCounts)) {
            if (count > maxCount) maxCount = count;
        }

        // Get all archetypes with max count (handles ties)
        const topArchetypes = Object.entries(archetypeCounts)
            .filter(([_, count]) => count === maxCount)
            .map(([archetype]) => archetype);

        // Random choice among tied archetypes
        if (topArchetypes.length === 0) {
            // Fallback to warrior if no skills
            return Archetype.WARRIOR;
        }

        return topArchetypes[Math.floor(Math.random() * topArchetypes.length)];
    },

    /**
     * Get skill display name with stack indicator
     * e.g., "Fireball", "Fireball²", "Fireball³"
     */
    getDisplayName(skillId, stackCount) {
        const def = this.get(skillId);
        if (!def) return skillId;

        const stackIndicator = stackCount >= 3 ? '³' : stackCount === 2 ? '²' : '';
        return def.name + stackIndicator;
    },

    /**
     * Get cooldown for a skill
     * @param {Object} skillDef - Skill definition
     * @returns {number} Cooldown in rounds (0 = no cooldown)
     */
    getCooldown(skillDef) {
        if (!skillDef || skillDef.activation !== SkillActivation.ACTIVE) {
            return 0; // Passives and triggers have no cooldown
        }
        return skillDef.cooldown ?? 2;
    },

    /**
     * Calculate hire cost modifier based on skills
     * Stack count increases cost
     */
    calcSkillCostModifier(skills) {
        let modifier = 0;
        for (const skill of skills) {
            // Stacked skills cost more (represents better hero)
            modifier += skill.stackCount || 1;
        }
        return modifier;
    },

    /**
     * Get the skill tree for a skill
     * @param {string} skillId
     * @returns {Object|null} { early: [], mid: [], deep: [] }
     */
    getTree(skillId) {
        return SKILL_TREES[skillId] || null;
    },

    /**
     * Get all nodes for a skill as a flat array
     * @param {string} skillId
     * @returns {Array} Array of node objects
     */
    getTreeNodes(skillId) {
        const tree = this.getTree(skillId);
        if (!tree) return [];

        return [
            ...tree.early,
            ...tree.mid,
            ...tree.deep,
        ];
    },

    /**
     * Get unlocked nodes for a hero's skill
     * @param {Object} heroSkill - { skillId, points, maxPoints, stackCount }
     * @returns {Array} Array of unlocked node objects
     */
    getUnlockedNodes(heroSkill) {
        const nodes = this.getTreeNodes(heroSkill.skillId);
        const points = heroSkill.points || 0;
        return nodes.slice(0, points);
    },

    /**
     * Get the next node to unlock for a skill
     * @param {Object} heroSkill - { skillId, points, maxPoints, stackCount }
     * @returns {Object|null} Next node or null if maxed
     */
    getNextNode(heroSkill) {
        const nodes = this.getTreeNodes(heroSkill.skillId);
        const points = heroSkill.points || 0;
        const maxPoints = heroSkill.maxPoints || 5;

        if (points >= maxPoints || points >= nodes.length) {
            return null;
        }

        return nodes[points];
    },

    /**
     * Get skill tree progress info
     * @param {Object} heroSkill
     * @returns {Object} { current, max, tier, nextNode }
     */
    getTreeProgress(heroSkill) {
        const points = heroSkill.points || 0;
        const maxPoints = heroSkill.maxPoints || 5;

        let tier = TreeTier.EARLY;
        if (points > 10) tier = TreeTier.DEEP;
        else if (points > 5) tier = TreeTier.MID;

        return {
            current: points,
            max: maxPoints,
            tier,
            nextNode: this.getNextNode(heroSkill),
            isMaxed: points >= maxPoints,
        };
    },
};

Object.freeze(Skills);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SkillTarget,
        DamageType,
        SkillActivation,
        Archetype,
        NodeType,
        TreeTier,
        SKILL_DEFINITIONS,
        SKILL_TREES,
        Skills,
    };
}
