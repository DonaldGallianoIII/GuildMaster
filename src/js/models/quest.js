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
 * ROTATION SYSTEM:
 * - Quests appear on the board with expiration timers
 * - When expired, quest is replaced with a new one
 * - Encounter compositions are randomized from variants
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
 * Quest expiration times (how long quest stays on board)
 */
const QUEST_EXPIRATION = {
    easy: 10 * 60 * 1000,      // 10 minutes
    medium: 15 * 60 * 1000,    // 15 minutes
    hard: 20 * 60 * 1000,      // 20 minutes
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
};

Object.freeze(MOB_DEFINITIONS);

/**
 * ============================================
 * QUEST TEMPLATES (50 total)
 * ============================================
 * Templates with encounter variants for randomization.
 * When a quest spawns, one variant is randomly selected.
 * ============================================
 */
const QUEST_TEMPLATES = {
    // ==================== EASY QUESTS (18 templates) ====================

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
        this.heroId = data.heroId || data.hero_id || null;
        this.userId = data.userId || data.user_id || null;

        // Status
        this.status = data.status || QuestStatus.AVAILABLE;

        // Timing
        this.startedAt = data.startedAt || data.started_at || null;
        this.endsAt = data.endsAt || data.ends_at || null;
        this.completedAt = data.completedAt || data.completed_at || null;

        // Expiration (for quest board rotation)
        this.expiresAt = data.expiresAt || data.expires_at || null;

        // Selected encounters (randomly chosen from template variants)
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
        return this.template?.duration || CONFIG.QUESTS.DURATION[this.difficulty] || CONFIG.QUESTS.DURATION.easy;
    }

    /**
     * Get quest rewards based on difficulty
     */
    get rewards() {
        const diff = this.difficulty;
        return {
            gold: CONFIG.QUESTS.GOLD_REWARDS[diff] || CONFIG.QUESTS.GOLD_REWARDS.easy,
            xp: CONFIG.QUESTS.XP_REWARDS[diff] || CONFIG.QUESTS.XP_REWARDS.easy,
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
            heroId: row.hero_id,
            userId: row.user_id,
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
     * Create a new quest from a template with random encounter variant
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
        QUEST_EXPIRATION,
        MOB_DEFINITIONS,
        QUEST_TEMPLATES,
        Quest,
        Quests,
    };
}
