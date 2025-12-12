/**
 * ============================================
 * GUILD MASTER - Gear Model & Definitions
 * ============================================
 * Equipment system - gear provides stat bonuses and special effects
 *
 * NOTE: In the updated stat system, hero base stats come from
 * level-based BST allocation. Gear provides BONUS stats on top
 * of that, plus special effects via affixes.
 *
 * GEAR SLOTS: weapon, helmet, chest, gloves, boots, amulet, ring1, ring2
 * RARITIES: common, magic, rare, unique, heirloom
 * ============================================
 */

/**
 * Gear slot types
 * @readonly
 * @enum {string}
 */
const GearSlot = {
    WEAPON: 'weapon',
    HELMET: 'helmet',
    CHEST: 'chest',
    GLOVES: 'gloves',
    BOOTS: 'boots',
    AMULET: 'amulet',
    RING1: 'ring1',
    RING2: 'ring2',
};

/**
 * Gear rarity levels
 * @readonly
 * @enum {string}
 */
const GearRarity = {
    COMMON: 'common',
    MAGIC: 'magic',
    RARE: 'rare',
    UNIQUE: 'unique',
    HEIRLOOM: 'heirloom',
};

Object.freeze(GearSlot);
Object.freeze(GearRarity);

/**
 * Base gear templates
 * Each slot has templates with typical stat distributions
 */
const GEAR_TEMPLATES = {
    // ==================== WEAPONS ====================
    weapon: [
        {
            baseName: 'Iron Sword',
            baseStats: { atk: 3 },
            icon: '🗡️',
            itemLevel: 1,
        },
        {
            baseName: 'Steel Longsword',
            baseStats: { atk: 5 },
            icon: '⚔️',
            itemLevel: 5,
        },
        {
            baseName: 'Battle Axe',
            baseStats: { atk: 7, spd: -1 },
            icon: '🪓',
            itemLevel: 8,
        },
        {
            baseName: 'Enchanted Staff',
            baseStats: { will: 5, atk: 1 },
            icon: '🪄',
            itemLevel: 5,
        },
        {
            baseName: 'Assassin Dagger',
            baseStats: { atk: 3, spd: 3 },
            icon: '🔪',
            itemLevel: 6,
        },
    ],

    // ==================== ARMOR ====================
    helmet: [
        {
            baseName: 'Leather Cap',
            baseStats: { def: 1 },
            icon: '🧢',
            itemLevel: 1,
        },
        {
            baseName: 'Iron Helm',
            baseStats: { def: 3 },
            icon: '⛑️',
            itemLevel: 4,
        },
        {
            baseName: 'Wizard Hat',
            baseStats: { will: 2, def: 1 },
            icon: '🎩',
            itemLevel: 3,
        },
    ],

    chest: [
        {
            baseName: 'Cloth Tunic',
            baseStats: { def: 1 },
            icon: '👕',
            itemLevel: 1,
        },
        {
            baseName: 'Chainmail',
            baseStats: { def: 4 },
            icon: '🥋',
            itemLevel: 5,
        },
        {
            baseName: 'Plate Armor',
            baseStats: { def: 7, spd: -2 },
            icon: '🛡️',
            itemLevel: 10,
        },
        {
            baseName: 'Robes of Power',
            baseStats: { will: 4, def: 1 },
            icon: '👘',
            itemLevel: 6,
        },
    ],

    gloves: [
        {
            baseName: 'Leather Gloves',
            baseStats: { atk: 1 },
            icon: '🧤',
            itemLevel: 1,
        },
        {
            baseName: 'Gauntlets',
            baseStats: { atk: 2, def: 1 },
            icon: '🥊',
            itemLevel: 4,
        },
        {
            baseName: 'Swift Bracers',
            baseStats: { spd: 2, atk: 1 },
            icon: '⌚',
            itemLevel: 5,
        },
    ],

    boots: [
        {
            baseName: 'Leather Boots',
            baseStats: { spd: 1 },
            icon: '👢',
            itemLevel: 1,
        },
        {
            baseName: 'Iron Greaves',
            baseStats: { def: 2, spd: 1 },
            icon: '🥾',
            itemLevel: 4,
        },
        {
            baseName: 'Windrunner Boots',
            baseStats: { spd: 4 },
            icon: '👟',
            itemLevel: 7,
        },
    ],

    // ==================== ACCESSORIES ====================
    amulet: [
        {
            baseName: 'Bronze Pendant',
            baseStats: { will: 1 },
            icon: '📿',
            itemLevel: 1,
        },
        {
            baseName: 'Ruby Amulet',
            baseStats: { atk: 2, will: 1 },
            icon: '❤️',
            itemLevel: 5,
        },
        {
            baseName: 'Sapphire Amulet',
            baseStats: { will: 3, def: 1 },
            icon: '💙',
            itemLevel: 5,
        },
    ],

    ring1: [
        {
            baseName: 'Iron Ring',
            baseStats: { def: 1 },
            icon: '💍',
            itemLevel: 1,
        },
        {
            baseName: 'Ring of Power',
            baseStats: { atk: 2 },
            icon: '💎',
            itemLevel: 4,
        },
        {
            baseName: 'Signet Ring',
            baseStats: { will: 2 },
            icon: '🔮',
            itemLevel: 4,
        },
    ],

    ring2: [
        // Same templates as ring1 - rings share pool
        {
            baseName: 'Iron Ring',
            baseStats: { def: 1 },
            icon: '💍',
            itemLevel: 1,
        },
        {
            baseName: 'Ring of Speed',
            baseStats: { spd: 2 },
            icon: '⚡',
            itemLevel: 4,
        },
    ],
};

/**
 * Affix definitions (prefixes and suffixes)
 */
const AFFIX_POOL = {
    prefixes: [
        { name: 'Heavy', stat: 'atk', minValue: 1, maxValue: 5, weight: 10 },
        { name: 'Fortified', stat: 'def', minValue: 1, maxValue: 5, weight: 10 },
        { name: 'Swift', stat: 'spd', minValue: 1, maxValue: 4, weight: 10 },
        { name: 'Wise', stat: 'will', minValue: 1, maxValue: 5, weight: 10 },
        { name: 'Brutal', stat: 'critChance', minValue: 3, maxValue: 10, weight: 5 },
        { name: 'Vampiric', stat: 'leech', minValue: 2, maxValue: 8, weight: 3 },
    ],
    suffixes: [
        { name: 'of Power', stat: 'atk', minValue: 1, maxValue: 4, weight: 10 },
        { name: 'of the Wall', stat: 'def', minValue: 1, maxValue: 4, weight: 10 },
        { name: 'of Haste', stat: 'spd', minValue: 1, maxValue: 3, weight: 10 },
        { name: 'of the Mind', stat: 'will', minValue: 1, maxValue: 4, weight: 10 },
        { name: 'of Thorns', stat: 'thorns', minValue: 3, maxValue: 8, weight: 5 },
        { name: 'of Life', stat: 'hp', minValue: 5, maxValue: 20, weight: 5 },
    ],
};

Object.freeze(GEAR_TEMPLATES);
Object.freeze(AFFIX_POOL);

/**
 * Gear class
 * Represents a single piece of equipment
 */
class Gear {
    constructor(data = {}) {
        // Identity
        this.id = data.id || Utils.uuid();
        this.userId = data.userId || data.user_id || null;
        this.heroId = data.heroId || data.hero_id || null; // null = in inventory

        // Base info
        this.slot = data.slot || GearSlot.WEAPON;
        this.baseName = data.baseName || data.base_name || 'Unknown Item';
        this.rarity = data.rarity || GearRarity.COMMON;
        this.itemLevel = data.itemLevel || data.item_level || 1;
        this.icon = data.icon || '📦';

        // Stats (base + from affixes)
        this.baseStats = data.baseStats || data.base_stats || {};
        this.affixes = data.affixes || []; // Array of { type, name, stat, value }

        // Heirloom properties
        this.isHeirloom = data.isHeirloom || data.is_heirloom || false;
        this.generation = data.generation || 0;
        this.heirloomName = data.heirloomName || data.heirloom_name || null;
        this.lineage = data.lineage || []; // Array of hero names
        this.souledBy = data.souledBy || data.souled_by || null;

        // Inscriptions (PvP kills)
        this.inscriptions = data.inscriptions || [];

        // Lock status (prevents selling)
        this.isLocked = data.isLocked || data.is_locked || false;

        // Hunger value (Design Doc v2 - affects affix slots)
        // Range: -0.70 (Replete) to +0.70 (Voracious)
        this.hunger = data.hunger ?? 0;

        // Craft count for escalation (1.5x per craft)
        this.craftCount = data.craftCount || data.craft_count || 0;

        // Timestamps
        this.createdAt = data.createdAt || data.created_at || Utils.now();
    }

    // ==================== LOCK METHODS ====================

    /**
     * Lock the item to prevent selling
     */
    lock() {
        this.isLocked = true;
    }

    /**
     * Unlock the item to allow selling
     */
    unlock() {
        this.isLocked = false;
    }

    /**
     * Toggle lock status
     */
    toggleLock() {
        this.isLocked = !this.isLocked;
    }

    // ==================== COMPUTED PROPERTIES ====================

    /**
     * Get display name (includes heirloom name if applicable)
     */
    get displayName() {
        if (this.isHeirloom && this.heirloomName) {
            return `${this.heirloomName}'s ${this.baseName}`;
        }
        return this.affixedName;
    }

    /**
     * Get name with affixes
     */
    get affixedName() {
        const prefix = this.affixes.find(a => a.type === 'prefix');
        const suffix = this.affixes.find(a => a.type === 'suffix');

        let name = this.baseName;
        if (prefix) name = `${prefix.name} ${name}`;
        if (suffix) name = `${name} ${suffix.name}`;
        return name;
    }

    /**
     * Get total stats (base + affixes + inheritance bonus)
     */
    get totalStats() {
        const stats = { ...this.baseStats };

        // Add affix stats
        for (const affix of this.affixes) {
            if (['atk', 'will', 'def', 'spd', 'hp'].includes(affix.stat)) {
                stats[affix.stat] = (stats[affix.stat] || 0) + affix.value;
            }
        }

        // Apply inheritance bonus (multiplicative)
        if (this.generation > 0) {
            const bonus = Math.pow(1 + CONFIG.INHERITANCE.BONUS_PER_GENERATION, this.generation);
            for (const stat of Object.keys(stats)) {
                stats[stat] = Math.floor(stats[stat] * bonus);
            }
        }

        return stats;
    }

    /**
     * Get special effects (non-stat affixes)
     */
    get specialEffects() {
        return this.affixes.filter(a =>
            !['atk', 'will', 'def', 'spd', 'hp'].includes(a.stat)
        );
    }

    /**
     * Check if this is an equipped item
     */
    get isEquipped() {
        return this.heroId !== null;
    }

    // ==================== HUNGER SYSTEM (Design Doc v2) ====================

    /**
     * Get hunger label based on hunger value
     * @returns {string} Hunger label (Replete, Nourished, Sated, Neutral, Hungry, Ravenous, Voracious)
     */
    getHungerLabel() {
        const ranges = CONFIG.HUNGER_SYSTEM.RANGES;
        if (this.hunger <= ranges.REPLETE.max) return 'Replete';
        if (this.hunger <= ranges.NOURISHED.max) return 'Nourished';
        if (this.hunger <= ranges.SATED.max) return 'Sated';
        if (this.hunger <= ranges.NEUTRAL.max) return 'Neutral';
        if (this.hunger <= ranges.HUNGRY.max) return 'Hungry';
        if (this.hunger <= ranges.RAVENOUS.max) return 'Ravenous';
        return 'Voracious';
    }

    /**
     * Get max affix slots based on hunger
     * Replete: 5 prefix, 5 suffix (10 total, but harder to find)
     * Sated: 4/4 (8 total)
     * Neutral: 3/3 (6 total, default)
     * Hungry: 3/2 (5 total)
     * Voracious: 2/2 (4 total, but easier to find)
     * @returns {{ prefix: number, suffix: number }}
     */
    getMaxAffixSlots() {
        const hungerLabel = this.getHungerLabel();
        const maxSlots = CONFIG.HUNGER_SYSTEM.MAX_SLOTS[hungerLabel.toUpperCase()];
        return maxSlots || { prefix: 3, suffix: 3 };
    }

    /**
     * Get crafting cost multiplier based on hunger
     * Replete items cost more to craft, Voracious cost less
     * @returns {number}
     */
    getCraftingCostMultiplier() {
        const hungerLabel = this.getHungerLabel();
        return CONFIG.HUNGER_SYSTEM.COST_MULTIPLIER[hungerLabel.toUpperCase()] || 1.0;
    }

    /**
     * Check if item can have more affixes added (based on hunger limit)
     * @param {string} affixType - 'prefix' or 'suffix'
     * @returns {boolean}
     */
    canAddAffix(affixType) {
        const maxSlots = this.getMaxAffixSlots();
        const currentCount = this.affixes.filter(a => a.type === affixType).length;
        return currentCount < maxSlots[affixType];
    }

    // ==================== SOUL CRAFTING (Design Doc v2) ====================

    /**
     * Calculate crafting cost for an operation
     * @param {string} operation - 'slam', 'reroll_magic', 'reroll_rare', 'level_adjust'
     * @returns {number} Soul cost
     */
    getCraftingCost(operation) {
        const baseCosts = {
            slam: CONFIG.SOUL_COSTS.SLAM_BASE,
            reroll_magic: CONFIG.SOUL_COSTS.REROLL_MAGIC,
            reroll_rare: CONFIG.SOUL_COSTS.REROLL_RARE,
            level_adjust: CONFIG.SOUL_COSTS.LEVEL_ADJUST,
        };

        const baseCost = baseCosts[operation] || 100;

        // Apply hunger multiplier (Replete = cheaper, Voracious = expensive)
        const hungerMult = this.getCraftingCostMultiplier();

        // Apply escalation (1.5x per previous craft)
        const escalation = Math.pow(CONFIG.SOUL_COSTS.ESCALATION, this.craftCount);

        return Math.ceil(baseCost * hungerMult * escalation);
    }

    /**
     * SLAM - Add a new affix to the item
     * @param {string} affixType - 'prefix' or 'suffix'
     * @returns {{ success: boolean, affix?: object, error?: string }}
     */
    slam(affixType) {
        // Check if we can add this affix type
        if (!this.canAddAffix(affixType)) {
            return { success: false, error: `No ${affixType} slots available` };
        }

        // Roll the affix (with Voracious multiplier if applicable)
        const hungerLabel = this.getHungerLabel().toUpperCase();
        const valueMult = hungerLabel === 'VORACIOUS' ? CONFIG.HUNGER_SYSTEM.VORACIOUS_AFFIX_MULT : 1.0;
        const affix = GearGenerator.rollAffix(affixType, valueMult);

        if (!affix) {
            return { success: false, error: 'Failed to roll affix' };
        }

        // Add the affix
        this.affixes.push(affix);
        this.craftCount++;

        return { success: true, affix };
    }

    /**
     * REROLL - Reroll all existing affixes
     * @returns {{ success: boolean, affixes?: array, error?: string }}
     */
    reroll() {
        if (this.affixes.length === 0) {
            return { success: false, error: 'No affixes to reroll' };
        }

        // Get Voracious multiplier if applicable
        const hungerLabel = this.getHungerLabel().toUpperCase();
        const valueMult = hungerLabel === 'VORACIOUS' ? CONFIG.HUNGER_SYSTEM.VORACIOUS_AFFIX_MULT : 1.0;

        // Reroll each affix while keeping type and stat
        const newAffixes = [];
        for (const oldAffix of this.affixes) {
            const newAffix = GearGenerator.rollAffix(oldAffix.type, valueMult);
            if (newAffix) {
                newAffixes.push(newAffix);
            }
        }

        this.affixes = newAffixes;
        this.craftCount++;

        return { success: true, affixes: newAffixes };
    }

    /**
     * Get available crafting options for this item
     * @returns {Array} Available crafting operations with costs
     */
    getCraftingOptions() {
        const options = [];

        // SLAM options (if slots available)
        if (this.canAddAffix('prefix')) {
            options.push({
                id: 'slam_prefix',
                name: 'Slam Prefix',
                description: 'Add a random prefix',
                cost: this.getCraftingCost('slam'),
                available: true,
            });
        }
        if (this.canAddAffix('suffix')) {
            options.push({
                id: 'slam_suffix',
                name: 'Slam Suffix',
                description: 'Add a random suffix',
                cost: this.getCraftingCost('slam'),
                available: true,
            });
        }

        // REROLL option (if has affixes)
        if (this.affixes.length > 0) {
            const rerollOp = this.rarity === 'rare' ? 'reroll_rare' : 'reroll_magic';
            options.push({
                id: 'reroll',
                name: 'Reroll Affixes',
                description: 'Reroll all affixes (keeps count)',
                cost: this.getCraftingCost(rerollOp),
                available: true,
            });
        }

        return options;
    }

    // ==================== METHODS ====================

    /**
     * Equip to a hero
     * @param {string} heroId
     */
    equip(heroId) {
        this.heroId = heroId;
    }

    /**
     * Unequip (move to inventory)
     */
    unequip() {
        this.heroId = null;
    }

    /**
     * Add inscription (PvP kill)
     */
    addInscription(victimName, victimGuild) {
        this.inscriptions.push({
            victimName,
            victimGuild,
            inscribedAt: Utils.now(),
        });
    }

    /**
     * Upgrade to heirloom (on hero retirement)
     * @param {string} heroName - Name of the retiring hero
     */
    makeHeirloom(heroName) {
        this.isHeirloom = true;
        this.generation++;
        this.heirloomName = heroName;
        this.lineage.push(heroName);
    }

    /**
     * Apply soul power (dark inheritance)
     * @param {string} heroName - Name of the sacrificed hero
     */
    applySoulPower(heroName) {
        this.souledBy = heroName;
        // Soul powering gives an extra generation bonus
        this.generation++;
    }

    /**
     * Convert to database format
     */
    toDatabase() {
        return {
            id: this.id,
            user_id: this.userId,
            hero_id: this.heroId,
            slot: this.slot,
            base_name: this.baseName,
            rarity: this.rarity,
            item_level: this.itemLevel,
            icon: this.icon,
            base_stats: this.baseStats,
            affixes: this.affixes,
            is_heirloom: this.isHeirloom,
            generation: this.generation,
            heirloom_name: this.heirloomName,
            lineage: this.lineage,
            souled_by: this.souledBy,
            inscriptions: this.inscriptions,
            is_locked: this.isLocked,
            hunger: this.hunger,
            craft_count: this.craftCount,
            created_at: this.createdAt,
        };
    }

    /**
     * Create from database row
     */
    static fromDatabase(row) {
        return new Gear({
            id: row.id,
            userId: row.user_id,
            heroId: row.hero_id,
            slot: row.slot,
            baseName: row.base_name,
            rarity: row.rarity,
            itemLevel: row.item_level,
            icon: row.icon,
            baseStats: row.base_stats,
            affixes: row.affixes,
            isHeirloom: row.is_heirloom,
            generation: row.generation,
            heirloomName: row.heirloom_name,
            lineage: row.lineage,
            souledBy: row.souled_by,
            inscriptions: row.inscriptions,
            isLocked: row.is_locked,
            hunger: row.hunger ?? 0,
            craftCount: row.craft_count || 0,
            createdAt: row.created_at,
        });
    }
}

/**
 * Gear generation utilities
 */
const GearGenerator = {
    /**
     * Generate a random piece of gear
     * @param {Object} options
     * @param {string} options.slot - Gear slot (random if not specified)
     * @param {string} options.rarity - Rarity (rolled if not specified)
     * @param {number} options.itemLevel - Item level (affects stats)
     */
    generate(options = {}) {
        // Determine slot
        const slot = options.slot || Utils.randomChoice(Object.values(GearSlot));

        // Determine rarity
        const rarity = options.rarity || Utils.weightedRandom(CONFIG.GEAR_RARITY_WEIGHTS);

        // Get templates for slot
        const templates = GEAR_TEMPLATES[slot] || GEAR_TEMPLATES[slot.replace(/\d/, '')] || GEAR_TEMPLATES.weapon;

        // Filter by item level if specified
        let validTemplates = templates;
        if (options.itemLevel) {
            validTemplates = templates.filter(t => t.itemLevel <= options.itemLevel);
            if (validTemplates.length === 0) validTemplates = templates;
        }

        // Pick random template
        const template = Utils.randomChoice(validTemplates);

        // Scale base stats by item level
        const itemLevel = options.itemLevel || template.itemLevel || 1;
        const scaledStats = {};
        for (const [stat, value] of Object.entries(template.baseStats)) {
            const levelMult = 1 + (itemLevel - 1) * 0.1; // +10% per level
            scaledStats[stat] = Math.floor(value * levelMult);
        }

        // Generate hunger value FIRST (Design Doc v2 - affects affix generation)
        const hunger = options.hunger ?? this.rollHungerByRarity(rarity);

        // Generate affixes based on rarity AND hunger
        const affixes = this.generateAffixes(rarity, hunger);

        return new Gear({
            slot,
            baseName: template.baseName,
            rarity,
            itemLevel,
            icon: template.icon,
            baseStats: scaledStats,
            affixes,
            hunger,
        });
    },

    /**
     * Roll a random hunger value for new gear (legacy - uses full range)
     * @returns {number}
     */
    rollHunger() {
        return this.rollHungerByRarity('rare'); // Default to rare range
    },

    /**
     * Roll hunger value based on item rarity (Design Doc v2)
     * Common items have narrow range, Unique items can be anything
     * @param {string} rarity
     * @returns {number}
     */
    rollHungerByRarity(rarity) {
        const rollWeights = CONFIG.HUNGER_SYSTEM.ROLL_WEIGHTS;
        const range = rollWeights[rarity] || rollWeights.rare;

        // Bell curve within the rarity's range
        const roll1 = Math.random();
        const roll2 = Math.random();
        const combined = (roll1 + roll2) / 2; // Average for bell curve

        // Scale to rarity's range
        const rangeSize = range.max - range.min;
        const scaled = range.min + (combined * rangeSize);

        // Round to 2 decimal places
        return Math.round(scaled * 100) / 100;
    },

    /**
     * Get hunger label from a hunger value (static helper)
     * @param {number} hunger
     * @returns {string}
     */
    getHungerLabelFromValue(hunger) {
        const ranges = CONFIG.HUNGER_SYSTEM.RANGES;
        if (hunger <= ranges.REPLETE.max) return 'REPLETE';
        if (hunger <= ranges.NOURISHED.max) return 'NOURISHED';
        if (hunger <= ranges.SATED.max) return 'SATED';
        if (hunger <= ranges.NEUTRAL.max) return 'NEUTRAL';
        if (hunger <= ranges.HUNGRY.max) return 'HUNGRY';
        if (hunger <= ranges.RAVENOUS.max) return 'RAVENOUS';
        return 'VORACIOUS';
    },

    /**
     * Generate affixes based on rarity AND hunger (Design Doc v2)
     * @param {string} rarity - Item rarity
     * @param {number} hunger - Item hunger value (-0.70 to +0.70)
     */
    generateAffixes(rarity, hunger = 0) {
        const affixes = [];
        const hungerLabel = this.getHungerLabelFromValue(hunger);

        // REPLETE items drop BLANK (Design Doc v2)
        if (hungerLabel === 'REPLETE' && CONFIG.HUNGER_SYSTEM.REPLETE_DROPS_BLANK) {
            return affixes; // Empty array - no affixes
        }

        // Get max slots based on hunger
        const maxSlots = CONFIG.HUNGER_SYSTEM.MAX_SLOTS[hungerLabel] || { prefix: 3, suffix: 3 };

        // Number of affixes by rarity (can be limited by hunger slots)
        const affixCounts = {
            [GearRarity.COMMON]: 0,
            [GearRarity.MAGIC]: Utils.randomInt(1, 2),
            [GearRarity.RARE]: Utils.randomInt(3, 4),
            [GearRarity.UNIQUE]: 2,
            [GearRarity.HEIRLOOM]: 2,
        };

        const targetCount = affixCounts[rarity] || 0;

        // Cap by total available slots (prefix + suffix)
        const maxTotalSlots = maxSlots.prefix + maxSlots.suffix;
        const count = Math.min(targetCount, maxTotalSlots);

        let prefixCount = 0;
        let suffixCount = 0;

        // Voracious items get 1.5x affix values
        const isVoracious = hungerLabel === 'VORACIOUS';
        const valueMult = isVoracious ? CONFIG.HUNGER_SYSTEM.VORACIOUS_AFFIX_MULT : 1.0;

        for (let i = 0; i < count; i++) {
            // Alternate between prefix and suffix, with some randomness
            const isPrefix = (prefixCount <= suffixCount) || Math.random() < 0.5;

            if (isPrefix && prefixCount < maxSlots.prefix) {
                const affix = this.rollAffix('prefix', valueMult);
                if (affix) {
                    affixes.push(affix);
                    prefixCount++;
                }
            } else if (suffixCount < maxSlots.suffix) {
                const affix = this.rollAffix('suffix', valueMult);
                if (affix) {
                    affixes.push(affix);
                    suffixCount++;
                }
            }
        }

        return affixes;
    },

    /**
     * Roll a single affix
     * @param {string} type - 'prefix' or 'suffix'
     * @param {number} valueMult - Multiplier for affix value (1.5x for Voracious)
     */
    rollAffix(type, valueMult = 1.0) {
        const pool = AFFIX_POOL[type === 'prefix' ? 'prefixes' : 'suffixes'];
        if (!pool || pool.length === 0) return null;

        // Weighted selection
        const weights = {};
        pool.forEach((a, i) => { weights[i] = a.weight; });
        const index = parseInt(Utils.weightedRandom(weights));
        const template = pool[index];

        // Roll base value then apply multiplier (Voracious = 1.5x)
        const baseValue = Utils.randomInt(template.minValue, template.maxValue);
        const finalValue = Math.floor(baseValue * valueMult);

        return {
            type,
            name: template.name,
            stat: template.stat,
            value: finalValue,
        };
    },

    /**
     * Generate loot drop from quest
     * @param {string} difficulty - Quest difficulty
     * @param {number} encounterTier - Mob tier (normal/magic/rare/boss)
     */
    generateLoot(difficulty, encounterTier = 'normal') {
        // Base drop chance
        const dropChances = {
            normal: 0.3,
            magic: 0.5,
            rare: 0.7,
            boss: 1.0,
        };

        if (Math.random() > (dropChances[encounterTier] || 0.3)) {
            return null; // No drop
        }

        // Item level based on difficulty
        const itemLevels = {
            easy: Utils.randomInt(1, 3),
            medium: Utils.randomInt(3, 6),
            hard: Utils.randomInt(6, 10),
        };

        // Rarity bonus from tier
        const rarityBonus = {
            normal: 0,
            magic: 10,
            rare: 20,
            boss: 30,
        };

        // Modify rarity weights
        const modifiedWeights = { ...CONFIG.GEAR_RARITY_WEIGHTS };
        modifiedWeights.magic += rarityBonus[encounterTier] || 0;
        modifiedWeights.rare += (rarityBonus[encounterTier] || 0) / 2;

        return this.generate({
            itemLevel: itemLevels[difficulty] || 1,
            rarity: Utils.weightedRandom(modifiedWeights),
        });
    },
};

Object.freeze(GearGenerator);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GearSlot, GearRarity, Gear, GearGenerator, GEAR_TEMPLATES, AFFIX_POOL };
}
