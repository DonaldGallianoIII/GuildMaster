/**
 * ============================================
 * GUILD MASTER - Consumable & Farming Models
 * ============================================
 * Food items, seeds, crops, and crafting recipes
 * ============================================
 */

// ==================== CONSUMABLE TYPES ====================

const ConsumableType = {
    FOOD: 'food',           // Heals HP when fed to hero
    SEED: 'seed',           // Can be planted to grow crops
    CROP: 'crop',           // Raw harvest, used in crafting
    FISH: 'fish',           // From fishing, can be food or crafting
};

Object.freeze(ConsumableType);

// ==================== CONSUMABLE DEFINITIONS ====================

const ConsumableData = {
    // ========== SEEDS ==========
    wheat_seeds: {
        id: 'wheat_seeds',
        name: 'Wheat Seeds',
        type: ConsumableType.SEED,
        icon: '🌾',
        description: 'Basic farming seeds. Grows into wheat.',
        growsInto: 'wheat',
        growthTime: 60, // seconds (1 minute for testing, can adjust)
        yield: { min: 2, max: 4 }, // harvest amount
        seedReturn: 0.5, // 50% chance to get a seed back per harvest
        buyPrice: 10,
        sellPrice: 5,
    },
    carrot_seeds: {
        id: 'carrot_seeds',
        name: 'Carrot Seeds',
        type: ConsumableType.SEED,
        icon: '🥕',
        description: 'Grows crunchy carrots.',
        growsInto: 'carrot',
        growthTime: 90,
        yield: { min: 1, max: 3 },
        seedReturn: 0.4,
        buyPrice: 15,
        sellPrice: 7,
    },
    potato_seeds: {
        id: 'potato_seeds',
        name: 'Potato Seeds',
        type: ConsumableType.SEED,
        icon: '🥔',
        description: 'Hearty potatoes for stews.',
        growsInto: 'potato',
        growthTime: 120,
        yield: { min: 2, max: 5 },
        seedReturn: 0.6,
        buyPrice: 12,
        sellPrice: 6,
    },

    // ========== CROPS (raw harvest) ==========
    wheat: {
        id: 'wheat',
        name: 'Wheat',
        type: ConsumableType.CROP,
        icon: '🌾',
        description: 'Raw wheat. Used to make bread.',
        sellPrice: 8,
    },
    carrot: {
        id: 'carrot',
        name: 'Carrot',
        type: ConsumableType.CROP,
        icon: '🥕',
        description: 'A fresh carrot. Can be eaten raw.',
        healAmount: 5, // Can be eaten directly for small heal
        healPercent: 0, // percentage of max HP
        sellPrice: 12,
    },
    potato: {
        id: 'potato',
        name: 'Potato',
        type: ConsumableType.CROP,
        icon: '🥔',
        description: 'Raw potato. Better when cooked.',
        healAmount: 3,
        healPercent: 0,
        sellPrice: 10,
    },

    // ========== FISH ==========
    common_fish: {
        id: 'common_fish',
        name: 'Common Fish',
        type: ConsumableType.FISH,
        icon: '🐟',
        description: 'A basic fish. Decent meal.',
        healAmount: 8,
        healPercent: 0,
        sellPrice: 15,
    },
    large_fish: {
        id: 'large_fish',
        name: 'Large Fish',
        type: ConsumableType.FISH,
        icon: '🐠',
        description: 'A hefty catch. Very filling.',
        healAmount: 15,
        healPercent: 0,
        sellPrice: 25,
    },
    rare_fish: {
        id: 'rare_fish',
        name: 'Golden Carp',
        type: ConsumableType.FISH,
        icon: '✨🐟',
        description: 'A rare and magical fish.',
        healAmount: 0,
        healPercent: 0.25, // 25% of max HP
        sellPrice: 100,
    },

    // ========== FOOD (crafted or bought) ==========
    bread: {
        id: 'bread',
        name: 'Bread',
        type: ConsumableType.FOOD,
        icon: '🍞',
        description: 'Fresh baked bread. Restores health.',
        healAmount: 20,
        healPercent: 0,
        sellPrice: 30,
        buyPrice: 50, // Buying is more expensive than crafting
    },
    fish_stew: {
        id: 'fish_stew',
        name: 'Fish Stew',
        type: ConsumableType.FOOD,
        icon: '🍲',
        description: 'Hearty fish stew. Very restorative.',
        healAmount: 10,
        healPercent: 0.15, // 15% max HP + flat 10
        sellPrice: 45,
    },
    veggie_soup: {
        id: 'veggie_soup',
        name: 'Veggie Soup',
        type: ConsumableType.FOOD,
        icon: '🥣',
        description: 'Warm vegetable soup.',
        healAmount: 15,
        healPercent: 0.10,
        sellPrice: 35,
    },
    meat_pie: {
        id: 'meat_pie',
        name: 'Meat Pie',
        type: ConsumableType.FOOD,
        icon: '🥧',
        description: 'A filling meat pie. Full heal!',
        healAmount: 0,
        healPercent: 1.0, // Full heal
        sellPrice: 150,
        buyPrice: 250,
    },
};

Object.freeze(ConsumableData);

// ==================== CRAFTING RECIPES ====================

const CraftingRecipes = {
    bread: {
        id: 'bread',
        name: 'Bread',
        icon: '🍞',
        result: 'bread',
        resultCount: 1,
        ingredients: [
            { itemId: 'wheat', count: 3 },
        ],
        craftTime: 5, // seconds
    },
    fish_stew: {
        id: 'fish_stew',
        name: 'Fish Stew',
        icon: '🍲',
        result: 'fish_stew',
        resultCount: 1,
        ingredients: [
            { itemId: 'common_fish', count: 2 },
            { itemId: 'potato', count: 1 },
        ],
        craftTime: 10,
    },
    veggie_soup: {
        id: 'veggie_soup',
        name: 'Veggie Soup',
        icon: '🥣',
        result: 'veggie_soup',
        resultCount: 1,
        ingredients: [
            { itemId: 'carrot', count: 2 },
            { itemId: 'potato', count: 1 },
        ],
        craftTime: 8,
    },
};

Object.freeze(CraftingRecipes);

// ==================== FISHING DATA ====================

const FishingData = {
    // Catch rates (weights, higher = more common)
    catches: [
        { itemId: 'common_fish', weight: 70 },
        { itemId: 'large_fish', weight: 25 },
        { itemId: 'rare_fish', weight: 5 },
    ],
    baseCatchTime: 30, // seconds per catch attempt
};

Object.freeze(FishingData);

// ==================== CONSUMABLE CLASS ====================

class Consumable {
    constructor(data = {}) {
        this.id = data.id || Utils.uuid();
        this.itemId = data.itemId; // Reference to ConsumableData
        this.userId = data.userId;
        this.count = data.count || 1;
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    get data() {
        return ConsumableData[this.itemId];
    }

    get name() {
        return this.data?.name || 'Unknown';
    }

    get icon() {
        return this.data?.icon || '?';
    }

    get type() {
        return this.data?.type || ConsumableType.FOOD;
    }

    get description() {
        return this.data?.description || '';
    }

    get sellPrice() {
        return this.data?.sellPrice || 0;
    }

    get buyPrice() {
        return this.data?.buyPrice || this.sellPrice * 2;
    }

    /**
     * Calculate heal amount for a hero
     */
    calcHealAmount(heroMaxHp) {
        const data = this.data;
        if (!data) return 0;

        let heal = data.healAmount || 0;
        if (data.healPercent) {
            heal += Math.floor(heroMaxHp * data.healPercent);
        }
        return heal;
    }

    /**
     * Check if this consumable can heal
     */
    get canHeal() {
        const data = this.data;
        return data && ((data.healAmount > 0) || (data.healPercent > 0));
    }

    /**
     * Use one of this consumable (decrease count)
     */
    use(amount = 1) {
        this.count = Math.max(0, this.count - amount);
        return this.count;
    }

    /**
     * Add to stack
     */
    add(amount = 1) {
        this.count += amount;
        return this.count;
    }

    /**
     * Convert to database format
     */
    toDatabase() {
        return {
            id: this.id,
            item_id: this.itemId,
            user_id: this.userId,
            count: this.count,
            created_at: this.createdAt,
        };
    }

    /**
     * Create from database row
     */
    static fromDatabase(row) {
        return new Consumable({
            id: row.id,
            itemId: row.item_id,
            userId: row.user_id,
            count: row.count,
            createdAt: row.created_at,
        });
    }
}

// ==================== FARM PLOT CLASS ====================

const PlotState = {
    EMPTY: 'empty',
    GROWING: 'growing',
    READY: 'ready',
};

Object.freeze(PlotState);

class FarmPlot {
    constructor(data = {}) {
        this.id = data.id || Utils.uuid();
        this.userId = data.userId;
        this.plotIndex = data.plotIndex || 0; // Which plot number (0-based)
        this.seedId = data.seedId || null; // What's planted
        this.plantedAt = data.plantedAt || null; // When planted
        this.state = data.state || PlotState.EMPTY;
    }

    get seedData() {
        return this.seedId ? ConsumableData[this.seedId] : null;
    }

    /**
     * Get growth progress (0-100%)
     */
    get growthProgress() {
        if (this.state === PlotState.EMPTY || !this.plantedAt) return 0;
        if (this.state === PlotState.READY) return 100;

        const seed = this.seedData;
        if (!seed) return 0;

        const elapsed = (Date.now() - new Date(this.plantedAt).getTime()) / 1000;
        const progress = Math.min(100, (elapsed / seed.growthTime) * 100);
        return Math.floor(progress);
    }

    /**
     * Get time remaining in seconds
     */
    get timeRemaining() {
        if (this.state !== PlotState.GROWING || !this.plantedAt) return 0;

        const seed = this.seedData;
        if (!seed) return 0;

        const elapsed = (Date.now() - new Date(this.plantedAt).getTime()) / 1000;
        return Math.max(0, seed.growthTime - elapsed);
    }

    /**
     * Check if ready to harvest
     */
    get isReady() {
        if (this.state === PlotState.READY) return true;
        if (this.state !== PlotState.GROWING) return false;
        return this.growthProgress >= 100;
    }

    /**
     * Plant a seed
     */
    plant(seedId) {
        if (this.state !== PlotState.EMPTY) {
            return false;
        }

        const seed = ConsumableData[seedId];
        if (!seed || seed.type !== ConsumableType.SEED) {
            return false;
        }

        this.seedId = seedId;
        this.plantedAt = new Date().toISOString();
        this.state = PlotState.GROWING;
        return true;
    }

    /**
     * Harvest the crop
     * @returns {Object} { crop: string, count: number, seedReturned: boolean } or null
     */
    harvest() {
        if (!this.isReady) return null;

        const seed = this.seedData;
        if (!seed) return null;

        // Calculate yield
        const yieldCount = Utils.randomInt(seed.yield.min, seed.yield.max);

        // Check for seed return
        const seedReturned = Math.random() < seed.seedReturn;

        // Reset plot
        const cropId = seed.growsInto;
        this.seedId = null;
        this.plantedAt = null;
        this.state = PlotState.EMPTY;

        return {
            crop: cropId,
            count: yieldCount,
            seedReturned,
            seedId: seedReturned ? seed.id : null,
        };
    }

    /**
     * Update state (call periodically)
     */
    update() {
        if (this.state === PlotState.GROWING && this.isReady) {
            this.state = PlotState.READY;
        }
    }

    /**
     * Convert to database format
     */
    toDatabase() {
        return {
            id: this.id,
            user_id: this.userId,
            plot_index: this.plotIndex,
            seed_id: this.seedId,
            planted_at: this.plantedAt,
            state: this.state,
        };
    }

    /**
     * Create from database row
     */
    static fromDatabase(row) {
        return new FarmPlot({
            id: row.id,
            userId: row.user_id,
            plotIndex: row.plot_index,
            seedId: row.seed_id,
            plantedAt: row.planted_at,
            state: row.state,
        });
    }
}

// ==================== EXPORTS ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ConsumableType,
        ConsumableData,
        CraftingRecipes,
        FishingData,
        Consumable,
        PlotState,
        FarmPlot,
    };
}
