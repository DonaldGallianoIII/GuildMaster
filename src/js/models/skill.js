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
        Skills,
    };
}
