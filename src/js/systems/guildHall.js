/**
 * ============================================
 * GUILD MASTER - Guild Hall System
 * ============================================
 * Manages farming, fishing, shop, crafting,
 * consumables inventory, and passive healing
 *
 * All data is stored in Supabase for security
 * ============================================
 */

const GuildHallSystem = {
    // ==================== STATE ====================
    _initialized: false,
    _consumables: [], // Player's consumable inventory
    _farmPlots: [],   // Player's farm plots
    _updateInterval: null,
    _loading: false,
    _currentTab: 'farm', // Track current sub-tab

    // Configuration
    config: {
        STARTING_PLOTS: 3,
        MAX_PLOTS: 9,
        PASSIVE_HEAL_INTERVAL: 5000, // Check every 5 seconds
        PASSIVE_HEAL_PERCENT: 0.04,  // 4% per minute
        PASSIVE_HEAL_TICK: 60,       // seconds between heals
    },

    // ==================== INITIALIZATION ====================

    async init() {
        if (this._initialized) return;

        Utils.log('Initializing Guild Hall system...');

        // Load consumables and farm data from database
        await this.loadData();

        // Start passive healing and farm update timer
        this._updateInterval = setInterval(() => {
            this.update();
        }, this.config.PASSIVE_HEAL_INTERVAL);

        this._initialized = true;
    },

    /**
     * Load consumables and farm data from database
     */
    async loadData() {
        const userId = GameState.player?.id;
        if (!userId) return;

        this._loading = true;

        try {
            // Load consumables from database
            const consumables = await DB.consumables.getAll(userId);
            this._consumables = consumables;

            // If no consumables, give starter items
            if (this._consumables.length === 0) {
                await this.giveStarterItems();
            }

            // Load farm plots from database
            const plots = await DB.farmPlots.getAll(userId);

            if (plots.length === 0) {
                // First time - create starter plots
                await this.initFarmPlots();
            } else {
                this._farmPlots = plots;
            }

            Utils.log('Guild Hall data loaded from database');
        } catch (e) {
            Utils.error('Failed to load Guild Hall data:', e);
        }

        this._loading = false;
    },

    /**
     * Give new players some starter items
     */
    async giveStarterItems() {
        await this.addConsumable('wheat_seeds', 5);
        await this.addConsumable('bread', 2);
        Utils.log('Gave starter items to new player');
    },

    /**
     * Initialize farm plots for new player
     */
    async initFarmPlots() {
        const userId = GameState.player?.id;
        this._farmPlots = [];

        for (let i = 0; i < this.config.STARTING_PLOTS; i++) {
            const plot = new FarmPlot({
                userId,
                plotIndex: i,
            });
            this._farmPlots.push(plot);
        }

        await this.savePlots();
    },

    /**
     * Save a single consumable to database
     */
    async saveConsumable(consumable) {
        if (!consumable) return;
        await DB.consumables.save(consumable);
    },

    /**
     * Save all farm plots to database
     */
    async savePlots() {
        if (this._farmPlots.length === 0) return;
        await DB.farmPlots.saveAll(this._farmPlots);
    },

    /**
     * Save a single farm plot to database
     */
    async savePlot(plot) {
        if (!plot) return;
        await DB.farmPlots.save(plot);
    },

    // ==================== UPDATE LOOP ====================

    /**
     * Main update loop - handles passive healing and farm growth
     */
    async update() {
        if (this._loading) return;

        // Update farm plots
        await this.updateFarmPlots();

        // Process passive healing for idle heroes
        await this.processPassiveHealing();
    },

    /**
     * Update farm plot states
     */
    async updateFarmPlots() {
        let changed = false;

        for (const plot of this._farmPlots) {
            if (plot.state === PlotState.GROWING && plot.isReady) {
                plot.state = PlotState.READY;
                changed = true;
            }
        }

        if (changed) {
            await this.savePlots();
            GameState.emit('farmUpdated');
        }
    },

    /**
     * Process passive healing for all idle heroes
     */
    async processPassiveHealing() {
        let anyHealed = false;

        for (const hero of GameState.heroes) {
            if (hero.canPassiveHeal) {
                const result = hero.applyPassiveHeal();
                if (result.healed) {
                    await GameState.updateHero(hero);
                    anyHealed = true;
                    Utils.log(`${hero.name} passively healed ${result.amount} HP`);
                }
            }
        }

        if (anyHealed) {
            GameState.emit('heroHealed');
        }
    },

    // ==================== CONSUMABLES ====================

    get consumables() {
        return this._consumables;
    },

    /**
     * Get consumable stack by item ID
     */
    getConsumable(itemId) {
        return this._consumables.find(c => c.itemId === itemId);
    },

    /**
     * Get count of a consumable
     */
    getCount(itemId) {
        const stack = this.getConsumable(itemId);
        return stack ? stack.count : 0;
    },

    /**
     * Add consumable to inventory
     */
    async addConsumable(itemId, count = 1) {
        let stack = this.getConsumable(itemId);

        if (stack) {
            stack.add(count);
        } else {
            stack = new Consumable({
                itemId,
                userId: GameState.player?.id,
                count,
            });
            this._consumables.push(stack);
        }

        await this.saveConsumable(stack);
        GameState.emit('consumablesChanged');
        return stack;
    },

    /**
     * Remove consumable from inventory
     * @returns {boolean} Success
     */
    async removeConsumable(itemId, count = 1) {
        const stack = this.getConsumable(itemId);
        if (!stack || stack.count < count) {
            return false;
        }

        stack.use(count);

        // Remove empty stacks
        if (stack.count <= 0) {
            this._consumables = this._consumables.filter(c => c.itemId !== itemId);
            await DB.consumables.delete(stack.id);
        } else {
            await this.saveConsumable(stack);
        }

        GameState.emit('consumablesChanged');
        return true;
    },

    /**
     * Check if player has enough of a consumable
     */
    hasConsumable(itemId, count = 1) {
        return this.getCount(itemId) >= count;
    },

    // ==================== FARMING ====================

    get farmPlots() {
        return this._farmPlots;
    },

    /**
     * Plant a seed in a plot
     */
    async plantSeed(plotIndex, seedId) {
        const plot = this._farmPlots[plotIndex];
        if (!plot) {
            Utils.toast('Invalid plot!', 'error');
            return false;
        }

        if (plot.state !== PlotState.EMPTY) {
            Utils.toast('Plot is not empty!', 'error');
            return false;
        }

        // Check if player has the seed
        if (!this.hasConsumable(seedId)) {
            Utils.toast('No seeds available!', 'error');
            return false;
        }

        // Plant the seed
        if (plot.plant(seedId)) {
            await this.removeConsumable(seedId, 1);
            await this.savePlot(plot);
            GameState.emit('farmUpdated');

            const seedData = ConsumableData[seedId];
            Utils.toast(`Planted ${seedData?.name || 'seeds'}!`, 'success');
            return true;
        }

        return false;
    },

    /**
     * Harvest a ready plot
     */
    async harvestPlot(plotIndex) {
        const plot = this._farmPlots[plotIndex];
        if (!plot) {
            Utils.toast('Invalid plot!', 'error');
            return null;
        }

        if (!plot.isReady) {
            Utils.toast('Crop is not ready!', 'error');
            return null;
        }

        const result = plot.harvest();
        if (!result) {
            Utils.toast('Failed to harvest!', 'error');
            return null;
        }

        // Add harvested crops
        await this.addConsumable(result.crop, result.count);

        // Add returned seed if any
        if (result.seedReturned && result.seedId) {
            await this.addConsumable(result.seedId, 1);
        }

        await this.savePlot(plot);
        GameState.emit('farmUpdated');

        const cropData = ConsumableData[result.crop];
        let msg = `Harvested ${result.count}x ${cropData?.name || 'crops'}!`;
        if (result.seedReturned) {
            msg += ' Got a seed back!';
        }
        Utils.toast(msg, 'success');

        return result;
    },

    // ==================== FISHING ====================

    /**
     * Go fishing (instant for now, can add timer later)
     * @returns {Object} { itemId, name, icon } or null
     */
    async goFishing() {
        // Roll for catch
        const totalWeight = FishingData.catches.reduce((sum, c) => sum + c.weight, 0);
        let roll = Math.random() * totalWeight;

        let caught = null;
        for (const catchOption of FishingData.catches) {
            roll -= catchOption.weight;
            if (roll <= 0) {
                caught = catchOption.itemId;
                break;
            }
        }

        if (!caught) {
            caught = FishingData.catches[0].itemId; // Default to common
        }

        // Add to inventory
        await this.addConsumable(caught, 1);

        const fishData = ConsumableData[caught];
        Utils.toast(`Caught a ${fishData?.name || 'fish'}! ${fishData?.icon || '🐟'}`, 'success');

        return {
            itemId: caught,
            name: fishData?.name,
            icon: fishData?.icon,
        };
    },

    // ==================== SHOP ====================

    /**
     * Get items available in the shop
     */
    getShopItems() {
        const items = [];

        // Add all items with a buyPrice
        for (const [id, data] of Object.entries(ConsumableData)) {
            if (data.buyPrice) {
                items.push({
                    itemId: id,
                    ...data,
                });
            }
        }

        return items;
    },

    /**
     * Buy an item from the shop
     */
    async buyItem(itemId, count = 1) {
        const data = ConsumableData[itemId];
        if (!data || !data.buyPrice) {
            Utils.toast('Item not available!', 'error');
            return false;
        }

        const totalCost = data.buyPrice * count;
        if (!await GameState.spendGold(totalCost)) {
            return false;
        }

        await this.addConsumable(itemId, count);
        Utils.toast(`Bought ${count}x ${data.name}!`, 'success');
        return true;
    },

    /**
     * Sell an item
     */
    async sellItem(itemId, count = 1) {
        const data = ConsumableData[itemId];
        if (!data) {
            Utils.toast('Invalid item!', 'error');
            return false;
        }

        if (!this.hasConsumable(itemId, count)) {
            Utils.toast('Not enough items!', 'error');
            return false;
        }

        const totalValue = (data.sellPrice || 1) * count;
        await this.removeConsumable(itemId, count);
        await GameState.addGold(totalValue);

        Utils.toast(`Sold ${count}x ${data.name} for ${totalValue}g!`, 'success');
        return true;
    },

    // ==================== CRAFTING ====================

    /**
     * Get available crafting recipes
     */
    getRecipes() {
        return Object.values(CraftingRecipes);
    },

    /**
     * Check if player can craft a recipe
     */
    canCraft(recipeId) {
        const recipe = CraftingRecipes[recipeId];
        if (!recipe) return false;

        for (const ingredient of recipe.ingredients) {
            if (!this.hasConsumable(ingredient.itemId, ingredient.count)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Craft an item
     */
    async craft(recipeId) {
        const recipe = CraftingRecipes[recipeId];
        if (!recipe) {
            Utils.toast('Invalid recipe!', 'error');
            return false;
        }

        if (!this.canCraft(recipeId)) {
            Utils.toast('Missing ingredients!', 'error');
            return false;
        }

        // Remove ingredients
        for (const ingredient of recipe.ingredients) {
            await this.removeConsumable(ingredient.itemId, ingredient.count);
        }

        // Add result
        await this.addConsumable(recipe.result, recipe.resultCount);

        const resultData = ConsumableData[recipe.result];
        Utils.toast(`Crafted ${recipe.resultCount}x ${resultData?.name || recipe.name}!`, 'success');
        return true;
    },

    // ==================== FEEDING ====================

    /**
     * Feed a consumable to a hero
     */
    async feedHero(heroId, itemId) {
        const hero = GameState.getHero(heroId);
        if (!hero) {
            Utils.toast('Hero not found!', 'error');
            return false;
        }

        if (!hero.needsHealing) {
            Utils.toast(`${hero.name} is already at full health!`, 'info');
            return false;
        }

        const stack = this.getConsumable(itemId);
        if (!stack || stack.count < 1) {
            Utils.toast('No food available!', 'error');
            return false;
        }

        if (!stack.canHeal) {
            Utils.toast('This item cannot heal!', 'error');
            return false;
        }

        // Calculate heal amount
        const healAmount = stack.calcHealAmount(hero.maxHp);

        // Use the food
        await this.removeConsumable(itemId, 1);

        // Heal the hero
        const actualHealed = hero.heal(healAmount);

        // Clear passive heal timer if now full
        if (hero.currentHp >= hero.maxHp) {
            hero.lastHealTick = null;
        }

        await GameState.updateHero(hero);

        const foodData = ConsumableData[itemId];
        Utils.toast(`${hero.name} ate ${foodData?.name || 'food'} and healed ${actualHealed} HP!`, 'success');
        return true;
    },

    /**
     * Get all food items that can heal
     */
    getHealingFood() {
        return this._consumables.filter(c => c.canHeal && c.count > 0);
    },

    // ==================== RENDERING ====================

    render() {
        const container = document.querySelector('#guild-tab .guild-stats');
        if (!container) return;

        const tab = this._currentTab;
        container.innerHTML = `
            <div class="guild-hall-tabs">
                <button class="guild-hall-tab ${tab === 'farm' ? 'active' : ''}" data-section="farm">Farm</button>
                <button class="guild-hall-tab ${tab === 'fishing' ? 'active' : ''}" data-section="fishing">Fishing</button>
                <button class="guild-hall-tab ${tab === 'shop' ? 'active' : ''}" data-section="shop">Shop</button>
                <button class="guild-hall-tab ${tab === 'crafting' ? 'active' : ''}" data-section="crafting">Crafting</button>
                <button class="guild-hall-tab ${tab === 'pantry' ? 'active' : ''}" data-section="pantry">Pantry</button>
            </div>

            <div class="guild-hall-sections">
                <div class="guild-hall-section ${tab === 'farm' ? 'active' : ''}" data-section="farm">
                    ${this.renderFarm()}
                </div>
                <div class="guild-hall-section ${tab === 'fishing' ? 'active' : ''}" data-section="fishing">
                    ${this.renderFishing()}
                </div>
                <div class="guild-hall-section ${tab === 'shop' ? 'active' : ''}" data-section="shop">
                    ${this.renderShop()}
                </div>
                <div class="guild-hall-section ${tab === 'crafting' ? 'active' : ''}" data-section="crafting">
                    ${this.renderCrafting()}
                </div>
                <div class="guild-hall-section ${tab === 'pantry' ? 'active' : ''}" data-section="pantry">
                    ${this.renderPantry()}
                </div>
            </div>
        `;

        this.bindEvents(container);
    },

    renderFarm() {
        const plotsHtml = this._farmPlots.map((plot, index) => {
            let content = '';
            let statusClass = '';

            if (plot.state === PlotState.EMPTY) {
                statusClass = 'empty';
                content = `
                    <div class="plot-empty">
                        <span class="plot-icon">🌱</span>
                        <span>Empty</span>
                    </div>
                `;
            } else if (plot.state === PlotState.GROWING) {
                statusClass = 'growing';
                const seedData = plot.seedData;
                const progress = plot.growthProgress;
                const timeLeft = Math.ceil(plot.timeRemaining);
                content = `
                    <div class="plot-growing">
                        <span class="plot-icon">${seedData?.icon || '🌱'}</span>
                        <div class="plot-progress-bar">
                            <div class="plot-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="plot-time">${Utils.formatTime(timeLeft * 1000)}</span>
                    </div>
                `;
            } else if (plot.state === PlotState.READY) {
                statusClass = 'ready';
                const seedData = plot.seedData;
                const cropData = seedData ? ConsumableData[seedData.growsInto] : null;
                content = `
                    <div class="plot-ready">
                        <span class="plot-icon">${cropData?.icon || '🌾'}</span>
                        <span>Ready!</span>
                        <button class="btn btn-small btn-primary harvest-btn" data-plot="${index}">Harvest</button>
                    </div>
                `;
            }

            return `
                <div class="farm-plot ${statusClass}" data-plot="${index}">
                    ${content}
                </div>
            `;
        }).join('');

        // Seed selection for planting
        const seeds = Object.entries(ConsumableData)
            .filter(([_, data]) => data.type === ConsumableType.SEED)
            .map(([id, data]) => {
                const count = this.getCount(id);
                return `
                    <div class="seed-option ${count > 0 ? '' : 'disabled'}" data-seed="${id}">
                        <span class="seed-icon">${data.icon}</span>
                        <span class="seed-name">${data.name}</span>
                        <span class="seed-count">x${count}</span>
                    </div>
                `;
            }).join('');

        return `
            <div class="farm-section">
                <h3>🌾 Farm Plots</h3>
                <div class="farm-plots-grid">
                    ${plotsHtml}
                </div>
                <div class="seed-selection">
                    <h4>Seeds (click plot to plant):</h4>
                    <div class="seed-options">
                        ${seeds || '<p>No seeds available. Buy some from the shop!</p>'}
                    </div>
                </div>
            </div>
        `;
    },

    renderFishing() {
        return `
            <div class="fishing-section">
                <h3>🎣 Fishing</h3>
                <p>Cast your line and see what you catch!</p>
                <button class="btn btn-primary go-fishing-btn">Go Fishing</button>
                <div class="fishing-catches">
                    <h4>Possible Catches:</h4>
                    ${FishingData.catches.map(c => {
                        const data = ConsumableData[c.itemId];
                        const rarity = c.weight >= 50 ? 'Common' : c.weight >= 20 ? 'Uncommon' : 'Rare';
                        return `
                            <div class="catch-option">
                                <span>${data?.icon || '🐟'}</span>
                                <span>${data?.name || 'Fish'}</span>
                                <span class="catch-rarity">${rarity}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderShop() {
        const items = this.getShopItems();

        const itemsHtml = items.map(item => `
            <div class="shop-item" data-item="${item.itemId}">
                <span class="shop-icon">${item.icon}</span>
                <div class="shop-item-info">
                    <span class="shop-name">${item.name}</span>
                    <span class="shop-desc">${item.description}</span>
                </div>
                <div class="shop-actions">
                    <span class="shop-price">💰 ${item.buyPrice}g</span>
                    <button class="btn btn-small btn-primary buy-btn" data-item="${item.itemId}">Buy</button>
                </div>
            </div>
        `).join('');

        return `
            <div class="shop-section">
                <h3>🏪 Shop</h3>
                <div class="shop-items">
                    ${itemsHtml || '<p>No items available</p>'}
                </div>
            </div>
        `;
    },

    renderCrafting() {
        const recipes = this.getRecipes();

        const recipesHtml = recipes.map(recipe => {
            const canCraft = this.canCraft(recipe.id);
            const resultData = ConsumableData[recipe.result];

            const ingredientsHtml = recipe.ingredients.map(ing => {
                const ingData = ConsumableData[ing.itemId];
                const have = this.getCount(ing.itemId);
                const hasEnough = have >= ing.count;
                return `
                    <span class="ingredient ${hasEnough ? 'has-enough' : 'not-enough'}">
                        ${ingData?.icon || '?'} ${ing.count}/${have}
                    </span>
                `;
            }).join(' + ');

            return `
                <div class="recipe ${canCraft ? 'can-craft' : 'cannot-craft'}" data-recipe="${recipe.id}">
                    <div class="recipe-result">
                        <span class="recipe-icon">${resultData?.icon || recipe.icon}</span>
                        <span class="recipe-name">${resultData?.name || recipe.name}</span>
                    </div>
                    <div class="recipe-ingredients">
                        ${ingredientsHtml}
                    </div>
                    <button class="btn btn-small ${canCraft ? 'btn-primary' : 'btn-secondary'} craft-btn"
                            data-recipe="${recipe.id}" ${canCraft ? '' : 'disabled'}>
                        Craft
                    </button>
                </div>
            `;
        }).join('');

        return `
            <div class="crafting-section">
                <h3>⚒️ Crafting</h3>
                <div class="recipes-list">
                    ${recipesHtml || '<p>No recipes available</p>'}
                </div>
            </div>
        `;
    },

    renderPantry() {
        const items = this._consumables.filter(c => c.count > 0);

        if (items.length === 0) {
            return `
                <div class="pantry-section">
                    <h3>🍽️ Pantry</h3>
                    <p class="empty-pantry">Your pantry is empty. Grow some crops or buy food!</p>
                </div>
            `;
        }

        // Group by type
        const byType = {};
        for (const item of items) {
            const type = item.type;
            if (!byType[type]) byType[type] = [];
            byType[type].push(item);
        }

        const typeNames = {
            [ConsumableType.SEED]: '🌱 Seeds',
            [ConsumableType.CROP]: '🌾 Crops',
            [ConsumableType.FISH]: '🐟 Fish',
            [ConsumableType.FOOD]: '🍞 Food',
        };

        let html = '<div class="pantry-section"><h3>🍽️ Pantry</h3>';

        for (const [type, typeItems] of Object.entries(byType)) {
            html += `<div class="pantry-type"><h4>${typeNames[type] || type}</h4><div class="pantry-items">`;

            for (const item of typeItems) {
                const data = item.data;
                const healInfo = item.canHeal
                    ? `<span class="heal-info">Heals: ${data.healAmount || 0}${data.healPercent ? ` +${Math.round(data.healPercent * 100)}%` : ''}</span>`
                    : '';

                html += `
                    <div class="pantry-item" data-item="${item.itemId}">
                        <span class="pantry-icon">${item.icon}</span>
                        <div class="pantry-item-info">
                            <span class="pantry-name">${item.name} x${item.count}</span>
                            ${healInfo}
                        </div>
                        <div class="pantry-actions">
                            ${item.canHeal ? `<button class="btn btn-small btn-primary feed-btn" data-item="${item.itemId}">Feed Hero</button>` : ''}
                            <button class="btn btn-small btn-secondary sell-btn" data-item="${item.itemId}">Sell (${data?.sellPrice || 1}g)</button>
                        </div>
                    </div>
                `;
            }

            html += '</div></div>';
        }

        html += '</div>';
        return html;
    },

    bindEvents(container) {
        // Tab switching
        container.querySelectorAll('.guild-hall-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const section = tab.dataset.section;
                this._currentTab = section; // Remember current tab

                // Update tab active state
                container.querySelectorAll('.guild-hall-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update section visibility
                container.querySelectorAll('.guild-hall-section').forEach(s => {
                    s.classList.toggle('active', s.dataset.section === section);
                });
            });
        });

        // Farm plot clicking (for planting)
        let selectedSeed = null;
        container.querySelectorAll('.seed-option:not(.disabled)').forEach(opt => {
            opt.addEventListener('click', () => {
                container.querySelectorAll('.seed-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedSeed = opt.dataset.seed;
            });
        });

        container.querySelectorAll('.farm-plot.empty').forEach(plot => {
            plot.addEventListener('click', async () => {
                if (selectedSeed) {
                    await this.plantSeed(parseInt(plot.dataset.plot), selectedSeed);
                    this.render();
                } else {
                    Utils.toast('Select a seed first!', 'info');
                }
            });
        });

        // Harvest buttons
        container.querySelectorAll('.harvest-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await this.harvestPlot(parseInt(btn.dataset.plot));
                this.render();
            });
        });

        // Fishing
        container.querySelector('.go-fishing-btn')?.addEventListener('click', async () => {
            await this.goFishing();
            this.render();
        });

        // Shop buy buttons
        container.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await this.buyItem(btn.dataset.item, 1);
                this.render();
            });
        });

        // Craft buttons
        container.querySelectorAll('.craft-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await this.craft(btn.dataset.recipe);
                this.render();
            });
        });

        // Feed buttons
        container.querySelectorAll('.feed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showFeedModal(btn.dataset.item);
            });
        });

        // Sell buttons
        container.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await this.sellItem(btn.dataset.item, 1);
                this.render();
            });
        });
    },

    /**
     * Show modal to select hero to feed
     */
    showFeedModal(itemId) {
        const heroes = GameState.heroes.filter(h => h.isAvailable && h.needsHealing);

        if (heroes.length === 0) {
            Utils.toast('No heroes need healing!', 'info');
            return;
        }

        const foodData = ConsumableData[itemId];

        const heroesHtml = heroes.map(hero => {
            const healAmount = new Consumable({ itemId }).calcHealAmount(hero.maxHp);
            return `
                <div class="feed-hero-option" data-hero="${hero.id}">
                    <div class="feed-hero-info">
                        <span class="feed-hero-name">${hero.name}</span>
                        <span class="feed-hero-hp">HP: ${hero.currentHp}/${hero.maxHp}</span>
                    </div>
                    <span class="feed-heal-amount">+${healAmount} HP</span>
                </div>
            `;
        }).join('');

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal feed-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <h3>Feed ${foodData?.name || 'Food'} ${foodData?.icon || ''}</h3>
                <p>Select a hero to feed:</p>
                <div class="feed-hero-list">
                    ${heroesHtml}
                </div>
                <button class="btn btn-secondary close-modal">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind events
        modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());

        modal.querySelectorAll('.feed-hero-option').forEach(opt => {
            opt.addEventListener('click', async () => {
                await this.feedHero(opt.dataset.hero, itemId);
                modal.remove();
                this.render();
            });
        });
    },
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GuildHallSystem };
}
