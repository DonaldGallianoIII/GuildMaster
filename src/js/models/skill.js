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
