/**
 * ============================================
 * GUILD MASTER - Quest Model & Definitions
 * ============================================
 * Quests are timed missions heroes can be sent on.
 *
 * QUEST STRUCTURE (Design Doc v2):
 * - 7 Brackets: Novice → Legendary (no level gates, any hero can attempt)
 * - 3 Tags: Swarm (many weak), Standard (mixed), Hunt (few strong)
 * - Enemies scale to hero level, gear is the only edge
 * - Duration based on bracket and tag
 *
 * ROTATION SYSTEM:
 * - Quests appear on the board with expiration timers
 * - Accordion UI organized by bracket
 * - Each bracket shows quests for each tag
 * ============================================
 */

/**
 * Quest brackets (7 tiers, no level gates)
 * @readonly
 * @enum {string}
 */
const QuestBracket = {
    NOVICE: 'novice',
    APPRENTICE: 'apprentice',
    JOURNEYMAN: 'journeyman',
    VETERAN: 'veteran',
    EXPERT: 'expert',
    MASTER: 'master',
    LEGENDARY: 'legendary',
};

/**
 * Quest tags - control encounter structure and reward focus
 * @readonly
 * @enum {string}
 */
const QuestTag = {
    SWARM: 'swarm',       // Many weak enemies, soul farming
    STANDARD: 'standard', // Mixed encounters, balanced
    HUNT: 'hunt',         // Single/few strong enemies, loot focus
};

/**
 * Quest difficulty levels (legacy, mapped from bracket for backwards compatibility)
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

Object.freeze(QuestBracket);
Object.freeze(QuestTag);
Object.freeze(QuestDifficulty);
Object.freeze(QuestStatus);

/**
 * Quest expiration times (how long quest stays on board)
 */
const QUEST_EXPIRATION = {
    // By bracket (in milliseconds)
    novice: 10 * 60 * 1000,
    apprentice: 12 * 60 * 1000,
    journeyman: 15 * 60 * 1000,
    veteran: 18 * 60 * 1000,
    expert: 20 * 60 * 1000,
    master: 25 * 60 * 1000,
    legendary: 30 * 60 * 1000,
};

/**
 * Bracket display names - now pulled from CONFIG.QUEST_BRACKETS
 */
const BRACKET_NAMES = {
    novice: 'Novice Contracts',
    apprentice: 'Apprentice Contracts',
    journeyman: 'Journeyman Contracts',
    veteran: 'Veteran Contracts',
    expert: 'Expert Contracts',
    master: 'Master Contracts',
    legendary: 'Legendary Contracts',
};

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
    // ==================== FODDER MOBS (Easy kills - basic attacks only) ====================
    goblin: {
        id: 'goblin',
        name: 'Goblin',
        tier: 'fodder_trash',
        statDist: { atk: 0.4, will: 0, def: 0.2, spd: 0.4 },
        icon: '👺',
        skills: [],
    },
    rat: {
        id: 'rat',
        name: 'Giant Rat',
        tier: 'fodder_trash',
        statDist: { atk: 0.3, will: 0, def: 0.1, spd: 0.6 },
        icon: '🐀',
        skills: [],
    },
    bat: {
        id: 'bat',
        name: 'Cave Bat',
        tier: 'fodder_trash',
        statDist: { atk: 0.25, will: 0, def: 0.15, spd: 0.6 },
        icon: '🦇',
        skills: [],
    },
    slime: {
        id: 'slime',
        name: 'Slime',
        tier: 'fodder_trash',
        statDist: { atk: 0.2, will: 0.1, def: 0.5, spd: 0.2 },
        icon: '🟢',
        skills: [],
    },
    wolf: {
        id: 'wolf',
        name: 'Wolf',
        tier: 'fodder',
        statDist: { atk: 0.5, will: 0, def: 0.1, spd: 0.4 },
        icon: '🐺',
        skills: [],
    },
    snake: {
        id: 'snake',
        name: 'Viper',
        tier: 'fodder',
        statDist: { atk: 0.45, will: 0, def: 0.1, spd: 0.45 },
        icon: '🐍',
        skills: [],
    },
    boar: {
        id: 'boar',
        name: 'Wild Boar',
        tier: 'fodder',
        statDist: { atk: 0.4, will: 0, def: 0.35, spd: 0.25 },
        icon: '🐗',
        skills: [],
    },
    imp: {
        id: 'imp',
        name: 'Imp',
        tier: 'fodder',
        statDist: { atk: 0.3, will: 0.35, def: 0.1, spd: 0.25 },
        icon: '😈',
        skills: [],
    },
    goblin_brute: {
        id: 'goblin_brute',
        name: 'Goblin Brute',
        tier: 'fodder_exalted',
        statDist: { atk: 0.4, will: 0, def: 0.4, spd: 0.2 },
        icon: '👹',
        skills: ['bash'],
    },
    dire_wolf: {
        id: 'dire_wolf',
        name: 'Dire Wolf',
        tier: 'fodder_exalted',
        statDist: { atk: 0.5, will: 0, def: 0.15, spd: 0.35 },
        icon: '🐕‍🦺',
        skills: ['frenzy'],
    },
    giant_spider: {
        id: 'giant_spider',
        name: 'Giant Spider',
        tier: 'fodder_exalted',
        statDist: { atk: 0.4, will: 0, def: 0.2, spd: 0.4 },
        icon: '🕷️',
        skills: [],
    },

    // ==================== STANDARD MOBS (Fair fights - some skills) ====================
    bandit: {
        id: 'bandit',
        name: 'Bandit',
        tier: 'standard_weak',
        statDist: { atk: 0.4, will: 0, def: 0.3, spd: 0.3 },
        icon: '🥷',
        skills: ['backstab'],
    },
    skeleton: {
        id: 'skeleton',
        name: 'Skeleton',
        tier: 'standard_weak',
        statDist: { atk: 0.35, will: 0.15, def: 0.35, spd: 0.15 },
        icon: '💀',
        skills: [],
    },
    zombie: {
        id: 'zombie',
        name: 'Zombie',
        tier: 'standard_weak',
        statDist: { atk: 0.35, will: 0, def: 0.5, spd: 0.15 },
        icon: '🧟',
        skills: [],
    },
    cultist: {
        id: 'cultist',
        name: 'Cultist',
        tier: 'standard_weak',
        statDist: { atk: 0.2, will: 0.4, def: 0.2, spd: 0.2 },
        icon: '🧙‍♂️',
        skills: ['spark'],
    },
    orc: {
        id: 'orc',
        name: 'Orc Warrior',
        tier: 'standard',
        statDist: { atk: 0.45, will: 0, def: 0.35, spd: 0.2 },
        icon: '👹',
        skills: ['bash'],
    },
    cave_spider: {
        id: 'cave_spider',
        name: 'Cave Spider',
        tier: 'standard',
        statDist: { atk: 0.35, will: 0, def: 0.15, spd: 0.5 },
        icon: '🕸️',
        skills: [],
    },
    harpy: {
        id: 'harpy',
        name: 'Harpy',
        tier: 'standard',
        statDist: { atk: 0.35, will: 0.15, def: 0.15, spd: 0.35 },
        icon: '🦅',
        skills: ['cleave'],
    },
    ghoul: {
        id: 'ghoul',
        name: 'Ghoul',
        tier: 'standard',
        statDist: { atk: 0.4, will: 0.1, def: 0.3, spd: 0.2 },
        icon: '👻',
        skills: ['leech'],
    },
    alpha_wolf: {
        id: 'alpha_wolf',
        name: 'Alpha Wolf',
        tier: 'standard_exalted',
        statDist: { atk: 0.4, will: 0, def: 0.2, spd: 0.4 },
        icon: '🐕',
        skills: ['frenzy'],
    },
    skeleton_mage: {
        id: 'skeleton_mage',
        name: 'Skeleton Mage',
        tier: 'standard_exalted',
        statDist: { atk: 0.1, will: 0.5, def: 0.25, spd: 0.15 },
        icon: '🧙',
        skills: ['spark', 'fireball'],
    },
    orc_berserker: {
        id: 'orc_berserker',
        name: 'Orc Berserker',
        tier: 'standard_exalted',
        statDist: { atk: 0.55, will: 0, def: 0.25, spd: 0.2 },
        icon: '🔥',
        skills: ['frenzy', 'cleave'],
    },
    dark_mage: {
        id: 'dark_mage',
        name: 'Dark Mage',
        tier: 'standard_exalted',
        statDist: { atk: 0.1, will: 0.55, def: 0.2, spd: 0.15 },
        icon: '🌑',
        skills: ['fireball', 'soul_rend'],
    },

    // ==================== ELITE MOBS (Mini-boss - multiple skills) ====================
    bandit_chief: {
        id: 'bandit_chief',
        name: 'Bandit Chief',
        tier: 'elite',
        statDist: { atk: 0.4, will: 0.1, def: 0.3, spd: 0.2 },
        icon: '🦹',
        skills: ['cleave', 'backstab', 'second_wind'],
    },
    wraith: {
        id: 'wraith',
        name: 'Wraith',
        tier: 'elite',
        statDist: { atk: 0.15, will: 0.5, def: 0.15, spd: 0.2 },
        icon: '👻',
        skills: ['soul_rend', 'mana_shield'],
    },
    orc_warlord: {
        id: 'orc_warlord',
        name: 'Orc Warlord',
        tier: 'elite',
        statDist: { atk: 0.45, will: 0, def: 0.35, spd: 0.2 },
        icon: '⚔️',
        skills: ['cleave', 'frenzy', 'second_wind'],
    },
    vampire: {
        id: 'vampire',
        name: 'Vampire',
        tier: 'elite',
        statDist: { atk: 0.35, will: 0.3, def: 0.2, spd: 0.15 },
        icon: '🧛',
        skills: ['leech', 'soul_rend', 'backstab'],
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
    lich: {
        id: 'lich',
        name: 'Lich',
        tier: 'elite_exalted',
        statDist: { atk: 0.1, will: 0.55, def: 0.25, spd: 0.1 },
        icon: '☠️',
        skills: ['soul_rend', 'meteor', 'mana_shield'],
    },
    demon: {
        id: 'demon',
        name: 'Lesser Demon',
        tier: 'elite_exalted',
        statDist: { atk: 0.4, will: 0.3, def: 0.2, spd: 0.1 },
        icon: '👿',
        skills: ['fireball', 'cleave', 'frenzy'],
    },

    // ==================== BOSS MOBS (Major threats - full kit) ====================
    dragon: {
        id: 'dragon',
        name: 'Ancient Dragon',
        tier: 'boss',
        statDist: { atk: 0.4, will: 0.3, def: 0.2, spd: 0.1 },
        icon: '🐉',
        skills: ['cleave', 'meteor', 'fireball', 'frenzy'],
    },
    demon_lord: {
        id: 'demon_lord',
        name: 'Demon Lord',
        tier: 'boss',
        statDist: { atk: 0.35, will: 0.35, def: 0.2, spd: 0.1 },
        icon: '😈',
        skills: ['soul_rend', 'meteor', 'frenzy', 'second_wind'],
    },
    giant: {
        id: 'giant',
        name: 'Mountain Giant',
        tier: 'boss',
        statDist: { atk: 0.45, will: 0, def: 0.4, spd: 0.15 },
        icon: '🗿',
        skills: ['bash', 'cleave', 'block', 'frenzy'],
    },
    hydra: {
        id: 'hydra',
        name: 'Hydra',
        tier: 'boss_legendary',
        statDist: { atk: 0.4, will: 0.2, def: 0.3, spd: 0.1 },
        icon: '🐍',
        skills: ['cleave', 'frenzy', 'second_wind', 'thorns'],
    },

    // ==================== MISSING MOB DEFINITIONS (referenced in themes) ====================
    goblin_shaman: {
        id: 'goblin_shaman',
        name: 'Goblin Shaman',
        tier: 'elite',
        statDist: { atk: 0.15, will: 0.45, def: 0.15, spd: 0.25 },
        icon: '🧙',
        skills: ['fireball', 'spark', 'mana_shield'],
    },
    bandit_leader: {
        id: 'bandit_leader',
        name: 'Bandit Leader',
        tier: 'standard_exalted',
        statDist: { atk: 0.4, will: 0.1, def: 0.3, spd: 0.2 },
        icon: '🦹',
        skills: ['cleave', 'backstab'],
    },
    troll: {
        id: 'troll',
        name: 'Troll',
        tier: 'elite',
        statDist: { atk: 0.5, will: 0.05, def: 0.35, spd: 0.1 },
        icon: '👹',
        skills: ['bash', 'frenzy', 'second_wind'],
    },
    kobold: {
        id: 'kobold',
        name: 'Kobold',
        tier: 'fodder',
        statDist: { atk: 0.3, will: 0.05, def: 0.2, spd: 0.45 },
        icon: '🦎',
        skills: [],
    },
    wyvern: {
        id: 'wyvern',
        name: 'Wyvern',
        tier: 'elite',
        statDist: { atk: 0.45, will: 0.05, def: 0.25, spd: 0.25 },
        icon: '🐉',
        skills: ['cleave', 'frenzy'],
    },
    skeleton_warrior: {
        id: 'skeleton_warrior',
        name: 'Skeleton Warrior',
        tier: 'standard',
        statDist: { atk: 0.45, will: 0.05, def: 0.3, spd: 0.2 },
        icon: '⚔️',
        skills: ['bash'],
    },
    orc_warrior: {
        id: 'orc_warrior',
        name: 'Orc Warrior',
        tier: 'standard',
        statDist: { atk: 0.5, will: 0, def: 0.3, spd: 0.2 },
        icon: '👹',
        skills: ['bash', 'frenzy'],
    },
};

Object.freeze(MOB_DEFINITIONS);

/**
 * ============================================
 * QUEST THEMES - Tier-Based System (Bestiary v2)
 * ============================================
 * Themes define flavor (name, icon, mob pools).
 * Encounters are generated based on bracket + tier.
 * Mobs are now sourced from BESTIARY (Design Doc v2).
 *
 * Tier Pack Sizes:
 * - Tier I:   1-2 fodder per encounter (2 encounters)
 * - Tier II:  2-3 fodder per encounter (3 encounters)
 * - Tier III: 2-3 fodder + 1 standard per encounter (4 encounters)
 * ============================================
 */
const QUEST_THEMES = {
    // ==================== NOVICE-APPRENTICE THEMES (VERMIN, LOW BEASTS) ====================
    rat_infestation: {
        id: 'rat_infestation',
        name: 'Rat Infestation',
        description: 'Giant rats have overrun the area.',
        icon: '🐀',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE],
        fodder: ['sewer_rat', 'plague_rat', 'giant_rat'],
        standard: ['giant_rat', 'rat_king'],
        elite: ['rat_king'],
    },
    bat_roost: {
        id: 'bat_roost',
        name: 'Bat Roost',
        description: 'A cave echoing with the screeches of bats.',
        icon: '🦇',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE],
        fodder: ['cave_bat', 'vampire_bat', 'dire_bat'],
        standard: ['swarm_bat', 'blood_wing'],
        elite: ['blood_wing'],
    },
    snake_pit: {
        id: 'snake_pit',
        name: 'Snake Pit',
        description: 'A nest of venomous snakes.',
        icon: '🐍',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE],
        fodder: ['viper', 'constrictor'],
        standard: ['giant_snake', 'king_cobra'],
        elite: ['basilisk'],
    },
    beetle_burrow: {
        id: 'beetle_burrow',
        name: 'Beetle Burrow',
        description: 'Chitinous insects swarm in the darkness.',
        icon: '🪲',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE],
        fodder: ['cockroach', 'giant_beetle', 'scarab'],
        standard: ['stag_beetle', 'fire_beetle'],
        elite: ['emperor_scorpion'],
    },

    // ==================== APPRENTICE-JOURNEYMAN THEMES (BEASTS, GOBLINOID) ====================
    goblin_tunnel: {
        id: 'goblin_tunnel',
        name: 'Goblin Tunnels',
        description: 'A network of tunnels infested with goblins.',
        icon: '🕳️',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE, QuestBracket.JOURNEYMAN],
        fodder: ['goblin_runt', 'goblin', 'goblin_scout'],
        standard: ['goblin_warrior', 'goblin_brute', 'goblin_archer'],
        elite: ['goblin_shaman', 'goblin_chief'],
    },
    wolf_territory: {
        id: 'wolf_territory',
        name: 'Wolf Territory',
        description: 'A forest where wolves have made their home.',
        icon: '🐺',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE, QuestBracket.JOURNEYMAN],
        fodder: ['wolf_pup', 'wolf'],
        standard: ['dire_wolf', 'alpha_wolf'],
        elite: ['worg', 'winter_wolf'],
    },
    boar_thicket: {
        id: 'boar_thicket',
        name: 'Boar Thicket',
        description: 'Wild boars roam this dense forest.',
        icon: '🐗',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE, QuestBracket.JOURNEYMAN],
        fodder: ['wild_boar'],
        standard: ['dire_boar', 'razorback'],
        elite: ['war_boar'],
    },
    spider_nest: {
        id: 'spider_nest',
        name: 'Spider Nest',
        description: 'Webs cover every surface in this lair.',
        icon: '🕷️',
        brackets: [QuestBracket.NOVICE, QuestBracket.APPRENTICE, QuestBracket.JOURNEYMAN],
        fodder: ['spider_hatchling', 'cave_spider'],
        standard: ['giant_spider', 'poison_spider'],
        elite: ['broodmother', 'widow_queen'],
    },
    scorpion_desert: {
        id: 'scorpion_desert',
        name: 'Scorpion Desert',
        description: 'Deadly stingers lurk beneath the sand.',
        icon: '🦂',
        brackets: [QuestBracket.APPRENTICE, QuestBracket.JOURNEYMAN],
        fodder: ['scorpion', 'centipede'],
        standard: ['giant_scorpion', 'giant_centipede'],
        elite: ['emperor_scorpion', 'carrion_crawler'],
    },

    // ==================== JOURNEYMAN-VETERAN THEMES (HUMANOID, ORC_BRUTE, UNDEAD) ====================
    bandit_hideout: {
        id: 'bandit_hideout',
        name: 'Bandit Hideout',
        description: 'A camp of dangerous outlaws.',
        icon: '🏴',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN],
        fodder: ['thug', 'bandit', 'bandit_archer'],
        standard: ['bandit_brute', 'bandit_captain'],
        elite: ['bandit_lord', 'bandit_king'],
    },
    orc_camp: {
        id: 'orc_camp',
        name: 'Orc Camp',
        description: 'Brutal orcs have set up camp here.',
        icon: '👹',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN],
        fodder: ['orc_whelp', 'orc_warrior'],
        standard: ['orc_raider', 'orc_berserker'],
        elite: ['orc_warchief', 'orc_chieftain'],
    },
    skeleton_crypt: {
        id: 'skeleton_crypt',
        name: 'Skeleton Crypt',
        description: 'The dead walk in these ancient halls.',
        icon: '💀',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN],
        fodder: ['skeleton', 'skeleton_warrior'],
        standard: ['skeleton_archer', 'skeleton_knight'],
        elite: ['skeleton_mage', 'skeleton_lord'],
    },
    zombie_graveyard: {
        id: 'zombie_graveyard',
        name: 'Zombie Graveyard',
        description: 'The restless dead rise from their graves.',
        icon: '🧟',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN],
        fodder: ['shambling_corpse', 'zombie', 'bloated_zombie'],
        standard: ['plague_zombie', 'zombie_hulk'],
        elite: ['zombie_lord'],
    },
    pirate_cove: {
        id: 'pirate_cove',
        name: 'Pirate Cove',
        description: 'Cutthroats and rogues stash their loot here.',
        icon: '🏴‍☠️',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN],
        fodder: ['pirate_deckhand', 'pirate'],
        standard: ['pirate_gunner', 'pirate_first_mate'],
        elite: ['pirate_captain', 'dread_pirate'],
    },
    cultist_shrine: {
        id: 'cultist_shrine',
        name: 'Cultist Shrine',
        description: 'Dark rituals are performed at this unholy place.',
        icon: '🕯️',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN, QuestBracket.EXPERT],
        fodder: ['cultist_initiate', 'cultist'],
        standard: ['cultist_zealot', 'dark_acolyte'],
        elite: ['cult_priest', 'cult_fanatic'],
    },
    hobgoblin_fort: {
        id: 'hobgoblin_fort',
        name: 'Hobgoblin Fort',
        description: 'A disciplined tribe of hobgoblins.',
        icon: '🏰',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN],
        fodder: ['hobgoblin', 'hobgoblin_soldier'],
        standard: ['hobgoblin_captain', 'bugbear'],
        elite: ['hobgoblin_warlord', 'hobgoblin_devastator'],
    },
    haunted_manor: {
        id: 'haunted_manor',
        name: 'Haunted Manor',
        description: 'Spirits and ghouls prowl these halls.',
        icon: '👻',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN, QuestBracket.EXPERT],
        fodder: ['ghost', 'ghoul'],
        standard: ['specter', 'crypt_ghoul', 'wraith'],
        elite: ['banshee', 'wight'],
    },
    troll_lair: {
        id: 'troll_lair',
        name: 'Troll Lair',
        description: 'Monstrous trolls dwell in this foul den.',
        icon: '🌉',
        brackets: [QuestBracket.VETERAN, QuestBracket.EXPERT],
        fodder: ['troll_whelp', 'troll'],
        standard: ['cave_troll', 'war_troll'],
        elite: ['dire_troll', 'troll_king'],
    },
    bear_den: {
        id: 'bear_den',
        name: 'Bear Den',
        description: 'Massive bears guard their territory.',
        icon: '🐻',
        brackets: [QuestBracket.JOURNEYMAN, QuestBracket.VETERAN],
        fodder: ['black_bear', 'brown_bear'],
        standard: ['cave_bear', 'dire_bear'],
        elite: ['werebear'],
    },

    // ==================== EXPERT-MASTER THEMES (DRACONIC, DEMON, HIGH-TIER UNDEAD) ====================
    dragon_lair: {
        id: 'dragon_lair',
        name: 'Dragon Lair',
        description: 'A dragon guards its treasure hoard.',
        icon: '🐉',
        brackets: [QuestBracket.EXPERT, QuestBracket.MASTER, QuestBracket.LEGENDARY],
        fodder: ['kobold', 'kobold_warrior', 'kobold_skirmisher'],
        standard: ['drake_hatchling', 'fire_drake', 'wyvern'],
        elite: ['young_dragon', 'adult_dragon'],
        boss: ['ancient_dragon'],
    },
    demon_portal: {
        id: 'demon_portal',
        name: 'Demon Portal',
        description: 'A tear into the demon realm.',
        icon: '🔥',
        brackets: [QuestBracket.EXPERT, QuestBracket.MASTER, QuestBracket.LEGENDARY],
        fodder: ['imp', 'dretch', 'lemure'],
        standard: ['hellhound', 'shadow_demon', 'succubus'],
        elite: ['pit_fiend', 'balor'],
        boss: ['demon_prince'],
    },
    lich_tower: {
        id: 'lich_tower',
        name: 'Lich Tower',
        description: 'A tower of dark necromancy.',
        icon: '🗼',
        brackets: [QuestBracket.EXPERT, QuestBracket.MASTER, QuestBracket.LEGENDARY],
        fodder: ['skeleton', 'skeleton_warrior', 'ghost'],
        standard: ['skeleton_mage', 'wraith', 'wight'],
        elite: ['lich_apprentice', 'lich'],
        boss: ['archlich'],
    },
    giant_fortress: {
        id: 'giant_fortress',
        name: 'Giant Fortress',
        description: 'A mountain fortress of giants.',
        icon: '🏔️',
        brackets: [QuestBracket.VETERAN, QuestBracket.EXPERT, QuestBracket.MASTER],
        fodder: ['orc_warrior', 'orc_raider'],
        standard: ['ogre', 'two_headed_ogre', 'hill_giant'],
        elite: ['stone_giant', 'frost_giant'],
        boss: ['titan'],
    },
    dark_temple: {
        id: 'dark_temple',
        name: 'Dark Temple',
        description: 'A temple to forbidden gods.',
        icon: '⛪',
        brackets: [QuestBracket.EXPERT, QuestBracket.MASTER, QuestBracket.LEGENDARY],
        fodder: ['cultist', 'cultist_zealot', 'dark_acolyte'],
        standard: ['cult_priest', 'cult_fanatic', 'shadow_demon'],
        elite: ['lich', 'balor'],
        boss: ['demon_prince'],
    },
    vampire_castle: {
        id: 'vampire_castle',
        name: 'Vampire Castle',
        description: 'The undead aristocracy rules from here.',
        icon: '🧛',
        brackets: [QuestBracket.EXPERT, QuestBracket.MASTER, QuestBracket.LEGENDARY],
        fodder: ['ghost', 'ghoul', 'vampire_spawn'],
        standard: ['wight', 'revenant', 'vampire'],
        elite: ['vampire_lord', 'nosferatu'],
        boss: ['death_knight'],
    },
    wyvern_eyrie: {
        id: 'wyvern_eyrie',
        name: 'Wyvern Eyrie',
        description: 'Flying terrors nest in the peaks.',
        icon: '🐲',
        brackets: [QuestBracket.VETERAN, QuestBracket.EXPERT, QuestBracket.MASTER],
        fodder: ['wyvern_hatchling', 'kobold_skirmisher'],
        standard: ['wyvern', 'wyvern_matriarch'],
        elite: ['young_dragon'],
        boss: ['adult_dragon'],
    },
    abyssal_rift: {
        id: 'abyssal_rift',
        name: 'Abyssal Rift',
        description: 'Horrors from the deepest hells emerge.',
        icon: '🌀',
        brackets: [QuestBracket.MASTER, QuestBracket.LEGENDARY],
        fodder: ['lemure', 'dretch', 'imp'],
        standard: ['bone_devil', 'chain_devil', 'ice_devil'],
        elite: ['pit_fiend', 'balor'],
        boss: ['demon_prince'],
    },
    mummy_tomb: {
        id: 'mummy_tomb',
        name: 'Mummy Tomb',
        description: 'Ancient kings slumber in eternal unrest.',
        icon: '🏛️',
        brackets: [QuestBracket.VETERAN, QuestBracket.EXPERT, QuestBracket.MASTER],
        fodder: ['skeleton', 'mummy'],
        standard: ['mummy_guardian', 'barrow_wight'],
        elite: ['mummy_lord'],
        boss: ['demilich'],
    },
};

Object.freeze(QUEST_THEMES);

/**
 * Get threat tier label for a mob
 * @param {string} mobTier - The mob's tier from MOB_DEFINITIONS
 * @returns {string} Display label like "(Fodder)" or "(Elite)"
 */
function getMobThreatLabel(mobTier) {
    const labels = {
        'fodder_trash': 'Trash',
        'fodder': 'Fodder',
        'fodder_exalted': 'Fodder+',
        'standard_weak': 'Common',
        'standard': 'Common',
        'standard_exalted': 'Common+',
        'elite': 'Elite',
        'elite_exalted': 'Elite+',
        'boss': 'Boss',
        'boss_legendary': 'Boss+',
    };
    return labels[mobTier] || '';
}

/**
 * Helper to check if a mob ID exists in either BESTIARY or MOB_DEFINITIONS
 * @param {string} mobId - The mob ID to check
 * @returns {boolean} True if mob exists
 */
function mobExists(mobId) {
    if (typeof BESTIARY !== 'undefined' && BESTIARY[mobId]) return true;
    if (MOB_DEFINITIONS[mobId]) return true;
    return false;
}

/**
 * Generate encounters based on bracket, tag, and theme (Design Doc v2)
 * Tags: swarm (many weak enemies, 1 per encounter), standard (mixed across encounters), hunt (few strong, all in one)
 * @param {Object} theme - Quest theme with fodder/standard/elite/boss pools
 * @param {string} bracket - Quest bracket (novice, apprentice, journeyman, veteran, expert, master, legendary)
 * @param {string} tag - Quest tag (swarm, standard, hunt)
 * @returns {Array} Array of encounter objects with mob IDs and spawn tiers
 */
function generateEncountersForTag(theme, bracket, tag) {
    const encounters = [];
    const bracketConfig = CONFIG.QUEST_BRACKETS[bracket];

    if (!bracketConfig) {
        Utils.error(`Unknown quest bracket: ${bracket}`);
        return [];
    }

    const tagConfig = bracketConfig[tag];
    if (!tagConfig) {
        Utils.error(`Unknown quest tag: ${tag} for bracket ${bracket}`);
        return [];
    }

    // Get mob pools from theme, mapped to tier pools
    // Theme has: fodder, standard, elite, boss arrays
    // We map these to the specific tiers in tagConfig.tiers
    const getMobPoolForTier = (tierName) => {
        // Map tier names to theme pools
        if (tierName.startsWith('fodder')) {
            return (Array.isArray(theme.fodder) ? theme.fodder : [theme.fodder]).filter(m => m && mobExists(m));
        } else if (tierName.startsWith('standard')) {
            return (Array.isArray(theme.standard) ? theme.standard : [theme.standard]).filter(m => m && mobExists(m));
        } else if (tierName.startsWith('elite')) {
            const elitePool = (Array.isArray(theme.elite) ? theme.elite : [theme.elite]).filter(m => m && mobExists(m));
            // Fallback to standard if no elite pool
            if (elitePool.length === 0) {
                return (Array.isArray(theme.standard) ? theme.standard : [theme.standard]).filter(m => m && mobExists(m));
            }
            return elitePool;
        } else if (tierName.startsWith('boss')) {
            const bossPool = (Array.isArray(theme.boss) ? theme.boss : [theme.boss]).filter(m => m && mobExists(m));
            // Fallback to elite, then standard if no boss pool
            if (bossPool.length === 0) {
                const elitePool = (Array.isArray(theme.elite) ? theme.elite : [theme.elite]).filter(m => m && mobExists(m));
                if (elitePool.length > 0) return elitePool;
                return (Array.isArray(theme.standard) ? theme.standard : [theme.standard]).filter(m => m && mobExists(m));
            }
            return bossPool;
        }
        // Default fallback
        return (Array.isArray(theme.fodder) ? theme.fodder : [theme.fodder]).filter(m => m && mobExists(m));
    };

    // Determine total enemies (can be fixed number or range)
    const totalEnemies = Array.isArray(tagConfig.enemies)
        ? Utils.randomInt(tagConfig.enemies[0], tagConfig.enemies[1])
        : tagConfig.enemies;

    // Get tier pools and pick random tier for each enemy
    const availableTiers = tagConfig.tiers;

    if (tag === 'swarm') {
        // SWARM: 1 enemy per encounter (encounters = null means totalEnemies separate encounters)
        for (let i = 0; i < totalEnemies; i++) {
            const tier = availableTiers[Math.floor(Math.random() * availableTiers.length)];
            const pool = getMobPoolForTier(tier);
            if (pool.length === 0) continue;

            const mobId = pool[Math.floor(Math.random() * pool.length)];
            encounters.push({
                mobs: [mobId],
                mobTiers: [tier]
            });
        }
    } else if (tag === 'standard') {
        // STANDARD: Distribute enemies across encounters
        const numEncounters = tagConfig.encounters || Math.max(2, totalEnemies);
        const enemiesPerEncounter = Math.floor(totalEnemies / numEncounters);
        const remainder = totalEnemies % numEncounters;

        for (let i = 0; i < numEncounters; i++) {
            const mobs = [];
            const mobTiers = [];

            // Add base enemies to this encounter, plus 1 extra for first 'remainder' encounters
            const enemiesInThisEncounter = enemiesPerEncounter + (i < remainder ? 1 : 0);

            for (let j = 0; j < enemiesInThisEncounter; j++) {
                const tier = availableTiers[Math.floor(Math.random() * availableTiers.length)];
                const pool = getMobPoolForTier(tier);
                if (pool.length === 0) continue;

                const mobId = pool[Math.floor(Math.random() * pool.length)];
                mobs.push(mobId);
                mobTiers.push(tier);
            }

            if (mobs.length > 0) {
                encounters.push({ mobs, mobTiers });
            }
        }
    } else if (tag === 'hunt') {
        // HUNT: All enemies in one encounter (or specified number of encounters)
        const numEncounters = tagConfig.encounters || 1;

        if (numEncounters === 1) {
            // Single encounter with all enemies
            const mobs = [];
            const mobTiers = [];

            for (let i = 0; i < totalEnemies; i++) {
                const tier = availableTiers[Math.floor(Math.random() * availableTiers.length)];
                const pool = getMobPoolForTier(tier);
                if (pool.length === 0) continue;

                const mobId = pool[Math.floor(Math.random() * pool.length)];
                mobs.push(mobId);
                mobTiers.push(tier);
            }

            if (mobs.length > 0) {
                encounters.push({ mobs, mobTiers });
            }
        } else {
            // Multiple encounters for hunt (e.g., Master hunt with 2 bosses)
            const enemiesPerEncounter = Math.ceil(totalEnemies / numEncounters);
            let remainingEnemies = totalEnemies;

            for (let i = 0; i < numEncounters && remainingEnemies > 0; i++) {
                const mobs = [];
                const mobTiers = [];
                const enemiesInThisEncounter = Math.min(enemiesPerEncounter, remainingEnemies);

                for (let j = 0; j < enemiesInThisEncounter; j++) {
                    const tier = availableTiers[Math.floor(Math.random() * availableTiers.length)];
                    const pool = getMobPoolForTier(tier);
                    if (pool.length === 0) continue;

                    const mobId = pool[Math.floor(Math.random() * pool.length)];
                    mobs.push(mobId);
                    mobTiers.push(tier);
                }

                if (mobs.length > 0) {
                    encounters.push({ mobs, mobTiers });
                    remainingEnemies -= mobs.length;
                }
            }
        }
    }

    // Ensure we have at least one encounter
    if (encounters.length === 0) {
        const fallbackTier = availableTiers[0] || 'fodder';
        const pool = getMobPoolForTier(fallbackTier);
        const mobId = pool.length > 0 ? pool[0] : 'sewer_rat';
        encounters.push({
            mobs: [mobId],
            mobTiers: [fallbackTier]
        });
    }

    return encounters;
}

/**
 * Legacy function for backwards compatibility
 * @deprecated Use generateEncountersForTag instead
 */
function generateEncountersForTier(theme, tier) {
    // Map old tier system to new bracket/tag system
    const bracketMap = { 1: 'novice', 2: 'apprentice', 3: 'journeyman' };
    const bracket = bracketMap[tier] || 'novice';
    return generateEncountersForTag(theme, bracket, 'standard');
}

/**
 * ============================================
 * LEGACY QUEST TEMPLATES
 * ============================================
 * Kept for backward compatibility.
 * New quests use QUEST_THEMES + generateEncountersForTier()
 * ============================================
 */
const QUEST_TEMPLATES = {
    // ==================== EASY QUESTS (legacy) ====================

    goblin_warren: {
        id: 'goblin_warren',
        name: 'Goblin Warren',
        description: 'A network of tunnels infested with goblins.',
        difficulty: QuestDifficulty.EASY,
        icon: '🕳️',
        encounterVariants: [
            [{ mobs: ['goblin', 'goblin'] }, { mobs: ['goblin', 'goblin', 'goblin'] }],
            [{ mobs: ['goblin', 'goblin'] }, { mobs: ['goblin_brute'] }],
            [{ mobs: ['goblin'] }, { mobs: ['goblin', 'goblin'] }, { mobs: ['goblin_brute'] }],
        ],
    },

    wolf_den: {
        id: 'wolf_den',
        name: 'Wolf Den',
        description: 'A cave where a wolf pack has made its home.',
        difficulty: QuestDifficulty.EASY,
        icon: '🐺',
        encounterVariants: [
            [{ mobs: ['wolf', 'wolf'] }, { mobs: ['wolf'] }],
            [{ mobs: ['wolf'] }, { mobs: ['wolf', 'wolf'] }, { mobs: ['dire_wolf'] }],
            [{ mobs: ['wolf', 'wolf', 'wolf'] }, { mobs: ['dire_wolf'] }],
        ],
    },

    rat_cellar: {
        id: 'rat_cellar',
        name: 'Infested Cellar',
        description: 'Giant rats have overrun the tavern cellar.',
        difficulty: QuestDifficulty.EASY,
        icon: '🐀',
        encounterVariants: [
            [{ mobs: ['rat', 'rat', 'rat'] }, { mobs: ['rat', 'rat'] }],
            [{ mobs: ['rat', 'rat'] }, { mobs: ['rat', 'rat', 'rat', 'rat'] }],
            [{ mobs: ['rat'] }, { mobs: ['rat', 'rat'] }, { mobs: ['rat', 'rat', 'rat'] }],
        ],
    },

    bat_cave: {
        id: 'bat_cave',
        name: 'Bat Cave',
        description: 'A cave echoing with the screeches of bats.',
        difficulty: QuestDifficulty.EASY,
        icon: '🦇',
        encounterVariants: [
            [{ mobs: ['bat', 'bat', 'bat'] }, { mobs: ['bat', 'bat'] }],
            [{ mobs: ['bat', 'bat'] }, { mobs: ['bat', 'bat', 'bat', 'bat'] }],
            [{ mobs: ['bat', 'bat'] }, { mobs: ['giant_spider'] }],
        ],
    },

    slime_pit: {
        id: 'slime_pit',
        name: 'Slime Pit',
        description: 'A bubbling pit of gelatinous creatures.',
        difficulty: QuestDifficulty.EASY,
        icon: '🟢',
        encounterVariants: [
            [{ mobs: ['slime', 'slime'] }, { mobs: ['slime', 'slime', 'slime'] }],
            [{ mobs: ['slime'] }, { mobs: ['slime', 'slime'] }, { mobs: ['slime', 'slime'] }],
            [{ mobs: ['slime', 'slime', 'slime', 'slime'] }],
        ],
    },

    boar_forest: {
        id: 'boar_forest',
        name: 'Boar Thicket',
        description: 'Wild boars roam this dense forest.',
        difficulty: QuestDifficulty.EASY,
        icon: '🐗',
        encounterVariants: [
            [{ mobs: ['boar'] }, { mobs: ['boar', 'boar'] }],
            [{ mobs: ['boar', 'boar'] }, { mobs: ['boar'] }],
            [{ mobs: ['boar'] }, { mobs: ['boar'] }, { mobs: ['boar', 'boar'] }],
        ],
    },

    snake_nest: {
        id: 'snake_nest',
        name: 'Viper Nest',
        description: 'A nest of venomous snakes.',
        difficulty: QuestDifficulty.EASY,
        icon: '🐍',
        encounterVariants: [
            [{ mobs: ['snake', 'snake'] }, { mobs: ['snake', 'snake', 'snake'] }],
            [{ mobs: ['snake'] }, { mobs: ['snake', 'snake'] }, { mobs: ['snake', 'snake'] }],
            [{ mobs: ['snake', 'snake', 'snake'] }, { mobs: ['snake'] }],
        ],
    },

    imp_hideout: {
        id: 'imp_hideout',
        name: 'Imp Hideout',
        description: 'Mischievous imps have set up camp.',
        difficulty: QuestDifficulty.EASY,
        icon: '😈',
        encounterVariants: [
            [{ mobs: ['imp', 'imp'] }, { mobs: ['imp', 'imp', 'imp'] }],
            [{ mobs: ['imp'] }, { mobs: ['imp', 'imp'] }, { mobs: ['imp', 'imp'] }],
            [{ mobs: ['imp', 'imp', 'imp'] }, { mobs: ['goblin_brute'] }],
        ],
    },

    spider_grove: {
        id: 'spider_grove',
        name: 'Spider Grove',
        description: 'Webs cover every tree in this grove.',
        difficulty: QuestDifficulty.EASY,
        icon: '🕷️',
        encounterVariants: [
            [{ mobs: ['giant_spider'] }, { mobs: ['giant_spider'] }],
            [{ mobs: ['bat', 'bat'] }, { mobs: ['giant_spider'] }, { mobs: ['giant_spider'] }],
            [{ mobs: ['giant_spider', 'giant_spider'] }],
        ],
    },

    mushroom_cave: {
        id: 'mushroom_cave',
        name: 'Mushroom Cave',
        description: 'Strange creatures lurk among glowing fungi.',
        difficulty: QuestDifficulty.EASY,
        icon: '🍄',
        encounterVariants: [
            [{ mobs: ['slime', 'slime'] }, { mobs: ['bat', 'bat', 'bat'] }],
            [{ mobs: ['rat', 'rat'] }, { mobs: ['slime'] }, { mobs: ['giant_spider'] }],
            [{ mobs: ['slime', 'bat', 'bat'] }, { mobs: ['slime', 'slime'] }],
        ],
    },

    forest_edge: {
        id: 'forest_edge',
        name: 'Forest Edge',
        description: 'The outskirts of the forest are dangerous.',
        difficulty: QuestDifficulty.EASY,
        icon: '🌲',
        encounterVariants: [
            [{ mobs: ['wolf'] }, { mobs: ['boar'] }, { mobs: ['wolf', 'wolf'] }],
            [{ mobs: ['wolf', 'boar'] }, { mobs: ['dire_wolf'] }],
            [{ mobs: ['snake', 'snake'] }, { mobs: ['wolf'] }, { mobs: ['boar'] }],
        ],
    },

    goblin_scouts: {
        id: 'goblin_scouts',
        name: 'Goblin Scouts',
        description: 'A goblin scouting party needs dealing with.',
        difficulty: QuestDifficulty.EASY,
        icon: '👀',
        encounterVariants: [
            [{ mobs: ['goblin', 'goblin'] }, { mobs: ['goblin', 'goblin'] }],
            [{ mobs: ['goblin'] }, { mobs: ['goblin', 'goblin'] }, { mobs: ['goblin'] }],
            [{ mobs: ['goblin', 'goblin', 'goblin'] }, { mobs: ['goblin_brute'] }],
        ],
    },

    roadside_trouble: {
        id: 'roadside_trouble',
        name: 'Roadside Trouble',
        description: 'Travelers report creatures on the road.',
        difficulty: QuestDifficulty.EASY,
        icon: '🛤️',
        encounterVariants: [
            [{ mobs: ['wolf', 'wolf'] }, { mobs: ['boar'] }],
            [{ mobs: ['goblin', 'goblin'] }, { mobs: ['wolf'] }],
            [{ mobs: ['snake'] }, { mobs: ['wolf'] }, { mobs: ['goblin', 'goblin'] }],
        ],
    },

    well_depths: {
        id: 'well_depths',
        name: 'Well Depths',
        description: 'Something lurks in the village well.',
        difficulty: QuestDifficulty.EASY,
        icon: '💧',
        encounterVariants: [
            [{ mobs: ['slime'] }, { mobs: ['rat', 'rat', 'rat'] }],
            [{ mobs: ['bat', 'bat'] }, { mobs: ['slime', 'slime'] }],
            [{ mobs: ['rat', 'rat'] }, { mobs: ['slime'] }, { mobs: ['giant_spider'] }],
        ],
    },

    old_barn: {
        id: 'old_barn',
        name: 'Abandoned Barn',
        description: 'An old barn now houses unwanted guests.',
        difficulty: QuestDifficulty.EASY,
        icon: '🏚️',
        encounterVariants: [
            [{ mobs: ['rat', 'rat'] }, { mobs: ['bat', 'bat', 'bat'] }],
            [{ mobs: ['wolf'] }, { mobs: ['rat', 'rat'] }, { mobs: ['bat', 'bat'] }],
            [{ mobs: ['goblin', 'goblin'] }, { mobs: ['rat', 'rat', 'rat'] }],
        ],
    },

    hunting_grounds: {
        id: 'hunting_grounds',
        name: 'Hunting Grounds',
        description: 'The lord\'s hunting grounds are overrun.',
        difficulty: QuestDifficulty.EASY,
        icon: '🎯',
        encounterVariants: [
            [{ mobs: ['boar', 'boar'] }, { mobs: ['wolf'] }],
            [{ mobs: ['wolf'] }, { mobs: ['boar'] }, { mobs: ['dire_wolf'] }],
            [{ mobs: ['boar'] }, { mobs: ['wolf', 'wolf'] }, { mobs: ['boar'] }],
        ],
    },

    ruined_watchtower: {
        id: 'ruined_watchtower',
        name: 'Ruined Watchtower',
        description: 'Goblins have taken over an old watchtower.',
        difficulty: QuestDifficulty.EASY,
        icon: '🏰',
        encounterVariants: [
            [{ mobs: ['goblin'] }, { mobs: ['goblin', 'goblin'] }, { mobs: ['goblin_brute'] }],
            [{ mobs: ['goblin', 'goblin'] }, { mobs: ['goblin_brute'] }],
            [{ mobs: ['goblin', 'goblin', 'goblin'] }, { mobs: ['goblin', 'goblin_brute'] }],
        ],
    },

    moonlit_clearing: {
        id: 'moonlit_clearing',
        name: 'Moonlit Clearing',
        description: 'Wolves gather in this clearing at night.',
        difficulty: QuestDifficulty.EASY,
        icon: '🌙',
        encounterVariants: [
            [{ mobs: ['wolf', 'wolf', 'wolf'] }, { mobs: ['dire_wolf'] }],
            [{ mobs: ['wolf', 'wolf'] }, { mobs: ['wolf'] }, { mobs: ['dire_wolf'] }],
            [{ mobs: ['wolf'] }, { mobs: ['wolf', 'wolf'] }, { mobs: ['wolf', 'dire_wolf'] }],
        ],
    },

    // ==================== MEDIUM QUESTS (18 templates) ====================

    bandit_camp: {
        id: 'bandit_camp',
        name: 'Bandit Camp',
        description: 'Outlaws have set up camp in the forest.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '⛺',
        encounterVariants: [
            [{ mobs: ['bandit'] }, { mobs: ['bandit', 'bandit'] }, { mobs: ['bandit_chief'] }],
            [{ mobs: ['bandit', 'bandit'] }, { mobs: ['bandit', 'bandit'] }, { mobs: ['bandit_chief'] }],
            [{ mobs: ['bandit'] }, { mobs: ['bandit_chief'] }],
        ],
    },

    abandoned_mine: {
        id: 'abandoned_mine',
        name: 'Abandoned Mine',
        description: 'Undead and spiders lurk in the darkness.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '⛏️',
        encounterVariants: [
            [{ mobs: ['skeleton'] }, { mobs: ['cave_spider', 'cave_spider'] }, { mobs: ['skeleton_mage'] }],
            [{ mobs: ['skeleton', 'skeleton'] }, { mobs: ['skeleton'] }, { mobs: ['skeleton_mage'] }],
            [{ mobs: ['bat', 'bat', 'bat'] }, { mobs: ['skeleton', 'skeleton'] }, { mobs: ['skeleton_mage'] }],
        ],
    },

    orc_outpost: {
        id: 'orc_outpost',
        name: 'Orc Outpost',
        description: 'An orc war party has made camp.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '⚔️',
        encounterVariants: [
            [{ mobs: ['orc'] }, { mobs: ['orc', 'orc'] }, { mobs: ['orc_berserker'] }],
            [{ mobs: ['orc', 'orc'] }, { mobs: ['orc_berserker'] }, { mobs: ['orc'] }],
            [{ mobs: ['orc'] }, { mobs: ['orc'] }, { mobs: ['orc_warlord'] }],
        ],
    },

    haunted_graveyard: {
        id: 'haunted_graveyard',
        name: 'Haunted Graveyard',
        description: 'The dead do not rest peacefully here.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '⚰️',
        encounterVariants: [
            [{ mobs: ['zombie', 'zombie'] }, { mobs: ['skeleton', 'skeleton'] }, { mobs: ['ghoul'] }],
            [{ mobs: ['skeleton'] }, { mobs: ['zombie', 'zombie', 'zombie'] }, { mobs: ['wraith'] }],
            [{ mobs: ['ghoul'] }, { mobs: ['skeleton', 'skeleton'] }, { mobs: ['skeleton_mage'] }],
        ],
    },

    cultist_shrine: {
        id: 'cultist_shrine',
        name: 'Cultist Shrine',
        description: 'Dark rituals are performed here.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🕯️',
        encounterVariants: [
            [{ mobs: ['cultist', 'cultist'] }, { mobs: ['cultist'] }, { mobs: ['dark_mage'] }],
            [{ mobs: ['cultist'] }, { mobs: ['cultist', 'cultist'] }, { mobs: ['dark_mage'] }],
            [{ mobs: ['imp', 'imp', 'imp'] }, { mobs: ['cultist', 'cultist'] }, { mobs: ['dark_mage'] }],
        ],
    },

    harpy_nest: {
        id: 'harpy_nest',
        name: 'Harpy Cliffs',
        description: 'Harpies roost on these treacherous cliffs.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🦅',
        encounterVariants: [
            [{ mobs: ['harpy'] }, { mobs: ['harpy', 'harpy'] }, { mobs: ['harpy'] }],
            [{ mobs: ['harpy', 'harpy'] }, { mobs: ['harpy'] }, { mobs: ['harpy', 'harpy'] }],
            [{ mobs: ['bat', 'bat', 'bat'] }, { mobs: ['harpy', 'harpy'] }, { mobs: ['harpy', 'harpy'] }],
        ],
    },

    spider_cavern: {
        id: 'spider_cavern',
        name: 'Spider Cavern',
        description: 'A cavern thick with webs and chittering.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🕸️',
        encounterVariants: [
            [{ mobs: ['cave_spider', 'cave_spider'] }, { mobs: ['giant_spider'] }, { mobs: ['cave_spider', 'cave_spider'] }],
            [{ mobs: ['giant_spider'] }, { mobs: ['cave_spider', 'cave_spider', 'cave_spider'] }, { mobs: ['giant_spider'] }],
            [{ mobs: ['cave_spider'] }, { mobs: ['giant_spider', 'giant_spider'] }, { mobs: ['cave_spider', 'cave_spider'] }],
        ],
    },

    smuggler_cove: {
        id: 'smuggler_cove',
        name: 'Smuggler Cove',
        description: 'Pirates and rogues hide their loot here.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🏴‍☠️',
        encounterVariants: [
            [{ mobs: ['bandit', 'bandit'] }, { mobs: ['bandit'] }, { mobs: ['bandit_chief'] }],
            [{ mobs: ['bandit'] }, { mobs: ['bandit', 'bandit', 'bandit'] }, { mobs: ['bandit_chief'] }],
            [{ mobs: ['rat', 'rat', 'rat'] }, { mobs: ['bandit', 'bandit'] }, { mobs: ['bandit_chief'] }],
        ],
    },

    ruined_temple: {
        id: 'ruined_temple',
        name: 'Ruined Temple',
        description: 'Ancient evil stirs in these ruins.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🏛️',
        encounterVariants: [
            [{ mobs: ['skeleton', 'skeleton'] }, { mobs: ['cultist', 'cultist'] }, { mobs: ['wraith'] }],
            [{ mobs: ['zombie', 'zombie'] }, { mobs: ['skeleton_mage'] }, { mobs: ['ghoul', 'ghoul'] }],
            [{ mobs: ['cultist'] }, { mobs: ['skeleton', 'skeleton'] }, { mobs: ['dark_mage'] }],
        ],
    },

    werewolf_territory: {
        id: 'werewolf_territory',
        name: 'Werewolf Territory',
        description: 'Lycanthropes hunt in these woods.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🐾',
        encounterVariants: [
            [{ mobs: ['wolf', 'wolf'] }, { mobs: ['dire_wolf', 'dire_wolf'] }, { mobs: ['alpha_wolf'] }],
            [{ mobs: ['dire_wolf'] }, { mobs: ['wolf', 'wolf', 'wolf'] }, { mobs: ['alpha_wolf'] }],
            [{ mobs: ['wolf', 'dire_wolf'] }, { mobs: ['dire_wolf'] }, { mobs: ['alpha_wolf'] }],
        ],
    },

    undead_crypt: {
        id: 'undead_crypt',
        name: 'Undead Crypt',
        description: 'A crypt where the dead walk.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '💀',
        encounterVariants: [
            [{ mobs: ['skeleton', 'skeleton', 'skeleton'] }, { mobs: ['ghoul'] }, { mobs: ['skeleton_mage'] }],
            [{ mobs: ['zombie', 'zombie'] }, { mobs: ['skeleton', 'skeleton'] }, { mobs: ['wraith'] }],
            [{ mobs: ['ghoul', 'ghoul'] }, { mobs: ['skeleton_mage'] }],
        ],
    },

    troll_bridge: {
        id: 'troll_bridge',
        name: 'Troll Bridge',
        description: 'Something lurks under the old stone bridge.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🌉',
        encounterVariants: [
            [{ mobs: ['orc', 'orc'] }, { mobs: ['orc_berserker'] }],
            [{ mobs: ['goblin_brute', 'goblin_brute'] }, { mobs: ['orc'] }, { mobs: ['orc_berserker'] }],
            [{ mobs: ['orc'] }, { mobs: ['orc', 'goblin_brute'] }, { mobs: ['orc_warlord'] }],
        ],
    },

    dark_forest: {
        id: 'dark_forest',
        name: 'Dark Forest',
        description: 'Darkness pervades this twisted forest.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🌑',
        encounterVariants: [
            [{ mobs: ['wolf', 'wolf'] }, { mobs: ['harpy'] }, { mobs: ['alpha_wolf'] }],
            [{ mobs: ['giant_spider', 'giant_spider'] }, { mobs: ['dire_wolf'] }, { mobs: ['harpy', 'harpy'] }],
            [{ mobs: ['wolf'] }, { mobs: ['giant_spider'] }, { mobs: ['alpha_wolf'] }, { mobs: ['harpy'] }],
        ],
    },

    mage_tower: {
        id: 'mage_tower',
        name: 'Mage Tower Ruins',
        description: 'A wizard\'s tower, now overrun.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🗼',
        encounterVariants: [
            [{ mobs: ['imp', 'imp'] }, { mobs: ['cultist'] }, { mobs: ['dark_mage'] }],
            [{ mobs: ['skeleton'] }, { mobs: ['imp', 'imp', 'imp'] }, { mobs: ['skeleton_mage'] }],
            [{ mobs: ['cultist', 'cultist'] }, { mobs: ['imp', 'imp'] }, { mobs: ['dark_mage'] }],
        ],
    },

    vampire_manor: {
        id: 'vampire_manor',
        name: 'Vampire Manor',
        description: 'A sinister manor with dark secrets.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🏚️',
        encounterVariants: [
            [{ mobs: ['bat', 'bat', 'bat'] }, { mobs: ['ghoul', 'ghoul'] }, { mobs: ['vampire'] }],
            [{ mobs: ['zombie', 'zombie'] }, { mobs: ['ghoul'] }, { mobs: ['vampire'] }],
            [{ mobs: ['skeleton', 'skeleton'] }, { mobs: ['wraith'] }, { mobs: ['vampire'] }],
        ],
    },

    orc_stronghold: {
        id: 'orc_stronghold',
        name: 'Orc Stronghold',
        description: 'The orcs have fortified their position.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🏰',
        encounterVariants: [
            [{ mobs: ['orc', 'orc'] }, { mobs: ['orc', 'orc'] }, { mobs: ['orc_warlord'] }],
            [{ mobs: ['orc'] }, { mobs: ['orc_berserker'] }, { mobs: ['orc', 'orc'] }, { mobs: ['orc_warlord'] }],
            [{ mobs: ['goblin_brute', 'goblin_brute'] }, { mobs: ['orc', 'orc'] }, { mobs: ['orc_warlord'] }],
        ],
    },

    shadow_glen: {
        id: 'shadow_glen',
        name: 'Shadow Glen',
        description: 'Spirits and shadows haunt this glen.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '👤',
        encounterVariants: [
            [{ mobs: ['ghoul'] }, { mobs: ['wraith'] }, { mobs: ['ghoul', 'ghoul'] }],
            [{ mobs: ['skeleton', 'skeleton'] }, { mobs: ['wraith'] }, { mobs: ['skeleton_mage'] }],
            [{ mobs: ['zombie', 'zombie'] }, { mobs: ['ghoul'] }, { mobs: ['wraith'] }],
        ],
    },

    bandit_fortress: {
        id: 'bandit_fortress',
        name: 'Bandit Fortress',
        description: 'The bandits have grown bold.',
        difficulty: QuestDifficulty.MEDIUM,
        icon: '🏴',
        encounterVariants: [
            [{ mobs: ['bandit', 'bandit'] }, { mobs: ['bandit', 'bandit'] }, { mobs: ['bandit_chief'] }, { mobs: ['bandit'] }],
            [{ mobs: ['bandit'] }, { mobs: ['bandit', 'bandit', 'bandit'] }, { mobs: ['bandit_chief'] }],
            [{ mobs: ['bandit', 'bandit'] }, { mobs: ['bandit_chief'] }, { mobs: ['bandit', 'bandit'] }],
        ],
    },

    // ==================== HARD QUESTS (14 templates) ====================

    cursed_forest: {
        id: 'cursed_forest',
        name: 'Cursed Forest',
        description: 'Dark magic has twisted these woods.',
        difficulty: QuestDifficulty.HARD,
        icon: '🌲',
        encounterVariants: [
            [{ mobs: ['wraith'] }, { mobs: ['treant'] }, { mobs: ['wraith', 'wraith'] }],
            [{ mobs: ['harpy', 'harpy'] }, { mobs: ['treant'] }, { mobs: ['wraith'] }, { mobs: ['treant'] }],
            [{ mobs: ['alpha_wolf', 'alpha_wolf'] }, { mobs: ['treant'] }, { mobs: ['wraith', 'wraith'] }],
        ],
    },

    dragons_hollow: {
        id: 'dragons_hollow',
        name: "Dragon's Hollow",
        description: 'The lair of an ancient dragon.',
        difficulty: QuestDifficulty.HARD,
        icon: '🏔️',
        encounterVariants: [
            [{ mobs: ['drake'] }, { mobs: ['drake', 'drake'] }, { mobs: ['dragon'] }],
            [{ mobs: ['drake', 'drake'] }, { mobs: ['drake'] }, { mobs: ['dragon'] }],
            [{ mobs: ['orc_berserker', 'orc_berserker'] }, { mobs: ['drake'] }, { mobs: ['dragon'] }],
        ],
    },

    demon_portal: {
        id: 'demon_portal',
        name: 'Demon Portal',
        description: 'A rift to the infernal planes has opened.',
        difficulty: QuestDifficulty.HARD,
        icon: '🌀',
        encounterVariants: [
            [{ mobs: ['imp', 'imp', 'imp'] }, { mobs: ['demon'] }, { mobs: ['demon'] }, { mobs: ['demon_lord'] }],
            [{ mobs: ['demon'] }, { mobs: ['imp', 'imp'] }, { mobs: ['demon', 'demon'] }, { mobs: ['demon_lord'] }],
            [{ mobs: ['cultist', 'cultist'] }, { mobs: ['demon'] }, { mobs: ['dark_mage'] }, { mobs: ['demon_lord'] }],
        ],
    },

    lich_tower: {
        id: 'lich_tower',
        name: "Lich's Tower",
        description: 'An undead archmage rules from here.',
        difficulty: QuestDifficulty.HARD,
        icon: '☠️',
        encounterVariants: [
            [{ mobs: ['skeleton_mage'] }, { mobs: ['wraith', 'wraith'] }, { mobs: ['ghoul', 'ghoul'] }, { mobs: ['lich'] }],
            [{ mobs: ['skeleton', 'skeleton', 'skeleton'] }, { mobs: ['skeleton_mage', 'skeleton_mage'] }, { mobs: ['lich'] }],
            [{ mobs: ['zombie', 'zombie', 'zombie'] }, { mobs: ['wraith'] }, { mobs: ['ghoul'] }, { mobs: ['lich'] }],
        ],
    },

    giant_mountain: {
        id: 'giant_mountain',
        name: 'Giant Mountain',
        description: 'A mountain giant blocks the pass.',
        difficulty: QuestDifficulty.HARD,
        icon: '⛰️',
        encounterVariants: [
            [{ mobs: ['orc', 'orc'] }, { mobs: ['orc_warlord'] }, { mobs: ['giant'] }],
            [{ mobs: ['orc_berserker', 'orc_berserker'] }, { mobs: ['orc', 'orc'] }, { mobs: ['giant'] }],
            [{ mobs: ['harpy', 'harpy'] }, { mobs: ['drake'] }, { mobs: ['giant'] }],
        ],
    },

    ancient_crypt: {
        id: 'ancient_crypt',
        name: 'Ancient Crypt',
        description: 'A crypt of immense power and danger.',
        difficulty: QuestDifficulty.HARD,
        icon: '🗝️',
        encounterVariants: [
            [{ mobs: ['skeleton_mage'] }, { mobs: ['wraith', 'wraith'] }, { mobs: ['vampire'] }, { mobs: ['lich'] }],
            [{ mobs: ['ghoul', 'ghoul'] }, { mobs: ['skeleton_mage', 'skeleton_mage'] }, { mobs: ['vampire'] }, { mobs: ['lich'] }],
            [{ mobs: ['zombie', 'zombie', 'zombie'] }, { mobs: ['wraith'] }, { mobs: ['vampire'] }, { mobs: ['lich'] }],
        ],
    },

    drake_roost: {
        id: 'drake_roost',
        name: 'Drake Roost',
        description: 'Multiple drakes nest in these peaks.',
        difficulty: QuestDifficulty.HARD,
        icon: '🐲',
        encounterVariants: [
            [{ mobs: ['drake'] }, { mobs: ['drake'] }, { mobs: ['drake', 'drake'] }],
            [{ mobs: ['drake', 'drake'] }, { mobs: ['drake'] }, { mobs: ['drake'] }, { mobs: ['drake'] }],
            [{ mobs: ['harpy', 'harpy'] }, { mobs: ['drake', 'drake'] }, { mobs: ['drake', 'drake'] }],
        ],
    },

    dark_sanctum: {
        id: 'dark_sanctum',
        name: 'Dark Sanctum',
        description: 'A place of terrible dark rituals.',
        difficulty: QuestDifficulty.HARD,
        icon: '🕳️',
        encounterVariants: [
            [{ mobs: ['cultist', 'cultist'] }, { mobs: ['dark_mage', 'dark_mage'] }, { mobs: ['demon'] }, { mobs: ['demon_lord'] }],
            [{ mobs: ['imp', 'imp', 'imp'] }, { mobs: ['cultist', 'cultist'] }, { mobs: ['demon', 'demon'] }, { mobs: ['demon_lord'] }],
            [{ mobs: ['dark_mage'] }, { mobs: ['demon'] }, { mobs: ['vampire'] }, { mobs: ['demon_lord'] }],
        ],
    },

    warlord_camp: {
        id: 'warlord_camp',
        name: 'Warlord Encampment',
        description: 'An army of orcs awaits.',
        difficulty: QuestDifficulty.HARD,
        icon: '⚔️',
        encounterVariants: [
            [{ mobs: ['orc', 'orc', 'orc'] }, { mobs: ['orc_berserker', 'orc_berserker'] }, { mobs: ['orc_warlord'] }, { mobs: ['orc_warlord'] }],
            [{ mobs: ['orc_berserker'] }, { mobs: ['orc', 'orc'] }, { mobs: ['orc_warlord'] }, { mobs: ['orc', 'orc_warlord'] }],
            [{ mobs: ['goblin_brute', 'goblin_brute', 'goblin_brute'] }, { mobs: ['orc_berserker', 'orc_berserker'] }, { mobs: ['orc_warlord', 'orc_warlord'] }],
        ],
    },

    vampire_castle: {
        id: 'vampire_castle',
        name: 'Vampire Castle',
        description: 'The vampire lord\'s ancient fortress.',
        difficulty: QuestDifficulty.HARD,
        icon: '🏰',
        encounterVariants: [
            [{ mobs: ['ghoul', 'ghoul'] }, { mobs: ['wraith', 'wraith'] }, { mobs: ['vampire'] }, { mobs: ['vampire'] }],
            [{ mobs: ['bat', 'bat', 'bat', 'bat'] }, { mobs: ['ghoul', 'ghoul'] }, { mobs: ['vampire', 'vampire'] }],
            [{ mobs: ['skeleton_mage'] }, { mobs: ['wraith'] }, { mobs: ['vampire'] }, { mobs: ['vampire'] }],
        ],
    },

    treant_grove: {
        id: 'treant_grove',
        name: 'Ancient Grove',
        description: 'The treants guard their sacred grove.',
        difficulty: QuestDifficulty.HARD,
        icon: '🌳',
        encounterVariants: [
            [{ mobs: ['alpha_wolf', 'alpha_wolf'] }, { mobs: ['treant'] }, { mobs: ['treant'] }, { mobs: ['treant'] }],
            [{ mobs: ['harpy', 'harpy'] }, { mobs: ['treant', 'treant'] }, { mobs: ['treant'] }],
            [{ mobs: ['dire_wolf', 'dire_wolf'] }, { mobs: ['treant'] }, { mobs: ['treant', 'treant'] }],
        ],
    },

    frozen_depths: {
        id: 'frozen_depths',
        name: 'Frozen Depths',
        description: 'An icy cavern with deadly inhabitants.',
        difficulty: QuestDifficulty.HARD,
        icon: '❄️',
        encounterVariants: [
            [{ mobs: ['skeleton_mage', 'skeleton_mage'] }, { mobs: ['wraith', 'wraith'] }, { mobs: ['lich'] }],
            [{ mobs: ['ghoul', 'ghoul'] }, { mobs: ['skeleton_mage'] }, { mobs: ['wraith'] }, { mobs: ['lich'] }],
            [{ mobs: ['skeleton', 'skeleton', 'skeleton'] }, { mobs: ['wraith', 'wraith'] }, { mobs: ['lich'] }],
        ],
    },

    hydra_swamp: {
        id: 'hydra_swamp',
        name: 'Hydra Swamp',
        description: 'A legendary hydra lurks in these swamps.',
        difficulty: QuestDifficulty.HARD,
        icon: '🐊',
        encounterVariants: [
            [{ mobs: ['snake', 'snake', 'snake'] }, { mobs: ['giant_spider', 'giant_spider'] }, { mobs: ['drake'] }, { mobs: ['hydra'] }],
            [{ mobs: ['ghoul', 'ghoul'] }, { mobs: ['harpy', 'harpy'] }, { mobs: ['drake'] }, { mobs: ['hydra'] }],
            [{ mobs: ['cave_spider', 'cave_spider', 'cave_spider'] }, { mobs: ['wraith'] }, { mobs: ['treant'] }, { mobs: ['hydra'] }],
        ],
    },

    infernal_rift: {
        id: 'infernal_rift',
        name: 'Infernal Rift',
        description: 'A massive tear into the demon realm.',
        difficulty: QuestDifficulty.HARD,
        icon: '🔥',
        encounterVariants: [
            [{ mobs: ['demon'] }, { mobs: ['demon', 'demon'] }, { mobs: ['demon'] }, { mobs: ['demon_lord'] }],
            [{ mobs: ['imp', 'imp', 'imp', 'imp'] }, { mobs: ['demon', 'demon'] }, { mobs: ['demon_lord'] }],
            [{ mobs: ['dark_mage', 'dark_mage'] }, { mobs: ['demon'] }, { mobs: ['demon', 'imp', 'imp'] }, { mobs: ['demon_lord'] }],
        ],
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
        this.themeId = data.themeId || data.theme_id || null; // New: theme-based system
        this.heroId = data.heroId || data.hero_id || null;
        this.userId = data.userId || data.user_id || null;

        // Bracket/Tier system (new)
        this._bracket = data.bracket || null;
        this._tier = data.tier || null;

        // Status
        this.status = data.status || QuestStatus.AVAILABLE;

        // Timing
        this.startedAt = data.startedAt || data.started_at || null;
        this.endsAt = data.endsAt || data.ends_at || null;
        this.completedAt = data.completedAt || data.completed_at || null;

        // Expiration (for quest board rotation)
        this.expiresAt = data.expiresAt || data.expires_at || null;

        // Selected encounters (randomly chosen from template variants or generated from tier)
        this.selectedEncounters = data.selectedEncounters || data.selected_encounters || null;

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

        // Combat results (pre-calculated when quest starts)
        this.combatResults = data.combatResults || data.combat_results || null;
    }

    // ==================== COMPUTED PROPERTIES ====================

    /**
     * Get quest template (legacy) or theme (new)
     */
    get template() {
        // Try new theme system first
        if (this.themeId && QUEST_THEMES[this.themeId]) {
            return QUEST_THEMES[this.themeId];
        }
        // Fall back to legacy templates
        return QUEST_TEMPLATES[this.templateId] || null;
    }

    /**
     * Get quest theme (new system)
     */
    get theme() {
        return QUEST_THEMES[this.themeId] || null;
    }

    /**
     * Get quest bracket (new system)
     */
    get bracket() {
        return this._bracket || QuestBracket.NOVICE;
    }

    /**
     * Get quest tier (legacy - returns 1 for backwards compatibility)
     * @deprecated Use tag instead
     */
    get tier() {
        return this._tier || 1;
    }

    /**
     * Get tier display name (I, II, III) - legacy
     * @deprecated Use tag instead
     */
    get tierName() {
        return TIER_NAMES[this.tier] || 'I';
    }

    /**
     * Get bracket display name
     */
    get bracketName() {
        return BRACKET_NAMES[this.bracket] || 'Novice Contracts';
    }

    /**
     * Get recommended level for this quest
     * Design Doc v2: Based on bracket only (no level gates, but suggests difficulty)
     */
    get recommendedLevel() {
        const range = CONFIG.QUESTS.LEVEL_RANGE[this.bracket] || CONFIG.QUESTS.LEVEL_RANGE.novice;
        // Return middle of range
        return Math.floor((range.min + range.max) / 2);
    }

    /**
     * Get quest name (no Roman numerals - tier is shown via UI tier bar)
     */
    get name() {
        return this.template?.name || 'Unknown Quest';
    }

    /**
     * Get quest difficulty (legacy, mapped from bracket for compatibility)
     */
    get difficulty() {
        // Map bracket to legacy difficulty
        if (this._bracket) {
            const bracketMap = {
                [QuestBracket.NOVICE]: QuestDifficulty.EASY,
                [QuestBracket.JOURNEYMAN]: QuestDifficulty.MEDIUM,
                [QuestBracket.EXPERT]: QuestDifficulty.HARD,
            };
            return bracketMap[this._bracket] || QuestDifficulty.EASY;
        }
        return this.template?.difficulty || QuestDifficulty.EASY;
    }

    /**
     * Get total duration in ms
     */
    get duration() {
        // New system: use bracket duration from QUEST_BRACKETS
        if (this._bracket && CONFIG.QUEST_BRACKETS[this._bracket]) {
            return CONFIG.QUEST_BRACKETS[this._bracket].duration || 2 * 60 * 1000;
        }

        // Legacy fallback: 2 minutes default
        const templateDuration = this.template?.duration;
        const duration = templateDuration || 2 * 60 * 1000;

        // Debug: Log if duration is unexpectedly small
        if (duration < 60000) {
            Utils.warn(`Quest ${this.templateId} has unexpected duration: ${duration}ms`);
        }

        return duration;
    }

    /**
     * Get quest base rewards from bracket (no tier multipliers)
     * Note: This returns quest completion bonus only. Mob drops are calculated separately in combat.
     */
    get rewards() {
        // New system: use QUEST_REWARDS by bracket
        if (this._bracket && CONFIG.QUEST_REWARDS[this._bracket]) {
            const bracketRewards = CONFIG.QUEST_REWARDS[this._bracket];
            return {
                gold: bracketRewards.gold,
                xp: bracketRewards.xp,
            };
        }

        // Legacy fallback: novice rewards
        const fallback = CONFIG.QUEST_REWARDS.novice;
        return {
            gold: fallback.gold,
            xp: fallback.xp,
        };
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
     * Get encounters (selected variant or from legacy template.encounters)
     */
    get encounters() {
        // Use pre-selected encounters if available
        if (this.selectedEncounters && this.selectedEncounters.length > 0) {
            return this.selectedEncounters;
        }
        // Legacy fallback for old quests with template.encounters
        return this.template?.encounters || [];
    }

    /**
     * Check if quest is expired (for quest board rotation)
     */
    get isExpired() {
        if (!this.expiresAt) return false;
        return Date.now() >= new Date(this.expiresAt).getTime();
    }

    /**
     * Get time remaining until expiration (for quest board display)
     */
    get expirationTimeRemaining() {
        if (!this.expiresAt) return Infinity;
        const remaining = new Date(this.expiresAt).getTime() - Date.now();
        return Math.max(0, remaining);
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
                    mobs: this.encounters[i]?.mobs.map(mobId => {
                        const mob = Quests.getMob(mobId);
                        return mob?.name || mobId;
                    }) || [],
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

            // Add REST event if present (between packs healing)
            if (combatData?.events) {
                for (const evt of combatData.events) {
                    if (evt.type === 'REST') {
                        events.push({
                            time: encounterStart + encounterDuration - 25, // Just after encounter end
                            type: 'rest',
                            data: {
                                encounterIndex: i,
                                heal: evt.heal,
                                message: evt.message,
                            },
                        });
                    }
                }
            }
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
                    mobs: encounter.mobs.map(mobId => {
                        const mob = Quests.getMob(mobId);
                        return mob?.name || mobId;
                    }),
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
            theme_id: this.themeId,
            hero_id: this.heroId,
            user_id: this.userId,
            bracket: this._bracket,
            tier: this._tier,
            status: this.status,
            started_at: this.startedAt,
            ends_at: this.endsAt,
            completed_at: this.completedAt,
            expires_at: this.expiresAt,
            selected_encounters: this.selectedEncounters,
            current_encounter: this.currentEncounter,
            total_encounters: this.totalEncounters,
            events: this.events,
            encounter_results: this.encounterResults,
            loot: this.loot,
            combat_results: this.combatResults,
        };
    }

    /**
     * Create from database row
     */
    static fromDatabase(row) {
        return new Quest({
            id: row.id,
            templateId: row.template_id,
            themeId: row.theme_id,
            heroId: row.hero_id,
            userId: row.user_id,
            bracket: row.bracket,
            tier: row.tier,
            status: row.status,
            startedAt: row.started_at,
            endsAt: row.ends_at,
            completedAt: row.completed_at,
            expiresAt: row.expires_at,
            selectedEncounters: row.selected_encounters,
            currentEncounter: row.current_encounter,
            totalEncounters: row.total_encounters,
            events: row.events,
            encounterResults: row.encounter_results,
            loot: row.loot,
            combatResults: row.combat_results,
        });
    }

    /**
     * Create a new quest from a template with random encounter variant (legacy)
     */
    static fromTemplate(templateId, userId) {
        const template = QUEST_TEMPLATES[templateId];
        if (!template) {
            Utils.error(`Unknown quest template: ${templateId}`);
            return null;
        }

        // Select random encounter variant
        let selectedEncounters = [];
        if (template.encounterVariants && template.encounterVariants.length > 0) {
            const variantIndex = Math.floor(Math.random() * template.encounterVariants.length);
            selectedEncounters = template.encounterVariants[variantIndex];
        } else if (template.encounters) {
            // Legacy fallback
            selectedEncounters = template.encounters;
        }

        // Calculate expiration time based on difficulty
        const expirationDuration = QUEST_EXPIRATION[template.difficulty] || QUEST_EXPIRATION.easy;
        const expiresAt = new Date(Date.now() + expirationDuration).toISOString();

        return new Quest({
            templateId,
            userId,
            status: QuestStatus.AVAILABLE,
            selectedEncounters,
            totalEncounters: selectedEncounters.length,
            expiresAt,
        });
    }

    /**
     * Create a new quest from a theme with bracket and tag (Design Doc v2)
     * @param {string} themeId - Theme ID from QUEST_THEMES
     * @param {string} bracket - Bracket (novice, apprentice, journeyman, veteran, expert, master, legendary)
     * @param {string} tag - Tag (swarm, standard, hunt)
     * @param {string} userId - User ID
     */
    static fromTheme(themeId, bracket, tag, userId) {
        const theme = QUEST_THEMES[themeId];
        if (!theme) {
            Utils.error(`Unknown quest theme: ${themeId}`);
            return null;
        }

        // Check if theme is available for this bracket
        if (!theme.brackets.includes(bracket)) {
            Utils.error(`Theme ${themeId} not available for bracket ${bracket}`);
            return null;
        }

        // Generate encounters based on bracket and tag
        const selectedEncounters = generateEncountersForTag(theme, bracket, tag);

        // Calculate expiration time (same for all brackets)
        const expirationDuration = CONFIG.QUESTS.EXPIRATION;
        const expiresAt = new Date(Date.now() + expirationDuration).toISOString();

        return new Quest({
            themeId,
            templateId: themeId, // For compatibility
            userId,
            bracket,
            tag,
            status: QuestStatus.AVAILABLE,
            selectedEncounters,
            totalEncounters: selectedEncounters.length,
            expiresAt,
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
     * Get mob definition - checks BESTIARY first, then legacy MOB_DEFINITIONS
     * @param {string} mobId - The mob ID to look up
     * @returns {Object|null} The mob definition or null if not found
     */
    getMob(mobId) {
        // Check new BESTIARY first (Design Doc v2)
        if (typeof BESTIARY !== 'undefined' && BESTIARY[mobId]) {
            return BESTIARY[mobId];
        }
        // Fall back to legacy MOB_DEFINITIONS for backwards compatibility
        return MOB_DEFINITIONS[mobId] || null;
    },

    /**
     * Create a mob instance with stats scaled to hero level
     * Design Doc v2: Enemies scale to hero BASE BST, elite/boss scale with gear
     * @param {string} mobId - The mob definition ID
     * @param {number} heroLevel - The level of the hero fighting this mob
     * @param {string} tierOverride - Required for BESTIARY mobs (which have no inherent tier)
     * @param {number} heroGearBst - Total BST bonus from hero's gear (for elite/boss scaling)
     */
    createMobInstance(mobId, heroLevel = 1, tierOverride = null, heroGearBst = 0) {
        // Try BESTIARY first, then fall back to legacy MOB_DEFINITIONS
        let def = null;
        let isBestiaryMob = false;

        if (typeof BESTIARY !== 'undefined' && BESTIARY[mobId]) {
            def = BESTIARY[mobId];
            isBestiaryMob = true;
        } else if (MOB_DEFINITIONS[mobId]) {
            def = MOB_DEFINITIONS[mobId];
        }

        if (!def) {
            Utils.warn(`Unknown mob: ${mobId}`);
            return null;
        }

        // BESTIARY mobs have no inherent tier - tier MUST be provided
        // Legacy MOB_DEFINITIONS have a tier field as fallback
        const tier = tierOverride || def.tier || 'fodder';
        const tierConfig = CONFIG.MOB_TIERS[tier];

        if (!tierConfig) {
            Utils.error(`Unknown mob tier: ${tier}`);
            return null;
        }

        // Calculate BST: hero's BASE BST * tier multiplier (Design Doc v2)
        // Elites/Bosses also scale with a portion of hero's gear bonus
        const baseBst = heroLevel * CONFIG.STATS.BST_PER_LEVEL;
        let mobBst = Math.floor(baseBst * tierConfig.bst);

        // Apply gear scaling for elites/bosses (they scale with X% of hero gear)
        if (tierConfig.gearScale > 0 && heroGearBst > 0) {
            mobBst += Math.floor(heroGearBst * tierConfig.gearScale);
        }

        // Distribute BST according to stat distribution (must sum to 1.0)
        const stats = {
            atk: Math.floor(mobBst * (def.statDist.atk || 0)),
            will: Math.floor(mobBst * (def.statDist.will || 0)),
            def: Math.floor(mobBst * (def.statDist.def || 0)),
            spd: Math.floor(mobBst * (def.statDist.spd || 0)),
        };

        // Calculate HP: DEF + (level × 40) scaled by tier HP multiplier
        const baseHp = stats.def + (heroLevel * CONFIG.STATS.HP_PER_LEVEL);
        const hp = Math.floor(baseHp * tierConfig.hp);

        return {
            id: Utils.uuid(),
            mobId: def.id,
            name: def.name,
            level: heroLevel, // Mobs scale to hero level
            tier,
            tierLabel: tierConfig.label,
            stats,
            maxHp: hp,
            currentHp: hp,
            skills: def.skills || ['strike'],
            icon: def.icon,
            // Include bestiary-specific fields if available
            family: def.family || null,
            archetype: def.archetype || null,
            hunger: def.hunger || null,
        };
    },
};

Object.freeze(Quests);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        QuestBracket,
        QuestTag,
        QuestDifficulty,
        QuestStatus,
        QUEST_EXPIRATION,
        TIER_NAMES,
        BRACKET_NAMES,
        MOB_DEFINITIONS,
        QUEST_THEMES,
        QUEST_TEMPLATES,
        generateEncountersForTag,
        generateEncountersForTier, // Legacy
        getMobThreatLabel,
        mobExists,
        Quest,
        Quests,
    };
}
