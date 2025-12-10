/**
 * ============================================
 * GUILD MASTER - Game State Manager
 * ============================================
 * Central state management for the game.
 * Synchronizes local state with Supabase.
 *
 * STATE STRUCTURE:
 * - player: Current player profile
 * - heroes: Array of player's heroes
 * - inventory: Unequipped items
 * - activeQuests: Quests in progress
 * - recruits: Available recruits at tavern
 * ============================================
 */

const GameState = {
    // ==================== STATE ====================
    _state: {
        initialized: false,
        player: null,
        heroes: [],
        inventory: [],
        activeQuests: [],
        recruits: [],
        questBoard: [],
    },

    // Event listeners
    _listeners: {},

    // ==================== INITIALIZATION ====================

    /**
     * Initialize game state for a user
     */
    async init() {
        Utils.log('Initializing game state...');

        // Check for existing session
        const session = await Auth.getSession();
        if (!session) {
            Utils.log('No session found, showing auth screen');
            this._state.initialized = true;
            this.emit('initialized', { authenticated: false });
            return;
        }

        // Load player data
        await this.loadPlayerData(session.user.id);

        this._state.initialized = true;
        this.emit('initialized', { authenticated: true });
    },

    /**
     * Load all player data from database
     */
    async loadPlayerData(userId) {
        Utils.log('Loading player data for:', userId);

        // Load in parallel
        let [player, heroes, inventory, activeQuests, availableQuests] = await Promise.all([
            DB.players.get(userId),
            DB.heroes.getAll(userId),
            DB.items.getInventory(userId),
            DB.quests.getActive(userId),
            DB.quests.getAvailable(userId),
        ]);

        // If player doesn't exist in database, create them
        if (!player) {
            Utils.log('Player not found in database, creating profile...');
            const user = await Auth.getUser();
            const newPlayer = {
                id: userId,
                email: user?.email || 'unknown',
                username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'Adventurer',
                gold: 500,
            };
            await DB.players.create(newPlayer);
            player = newPlayer;
            Utils.log('Player profile created:', player);
        }

        this._state.player = player;
        this._state.heroes = heroes || [];
        this._state.inventory = inventory || [];
        this._state.activeQuests = activeQuests || [];
        this._state.questBoard = availableQuests || [];

        // Run stat migration for heroes with outdated BST
        await this.migrateHeroStats();

        // Load or generate quest board from Supabase
        await this.loadQuestBoard();

        // Load recruits from localStorage (persists between refreshes)
        this.loadRecruits();

        this.emit('dataLoaded');
        Utils.log('Player data loaded', this._state);
    },

    // ==================== GETTERS ====================

    get player() {
        return this._state.player;
    },

    get heroes() {
        return this._state.heroes;
    },

    get availableHeroes() {
        return this._state.heroes.filter(h => h.state === HeroState.AVAILABLE);
    },

    get inventory() {
        return this._state.inventory;
    },

    get activeQuests() {
        return this._state.activeQuests;
    },

    get recruits() {
        return this._state.recruits;
    },

    get questBoard() {
        return this._state.questBoard;
    },

    get gold() {
        return this._state.player?.gold || 0;
    },

    // ==================== PLAYER ACTIONS ====================

    /**
     * Add gold to player
     */
    async addGold(amount) {
        if (!this._state.player) return;

        this._state.player.gold += amount;
        await DB.players.update(this._state.player.id, {
            gold: this._state.player.gold,
        });

        this.emit('goldChanged', { gold: this._state.player.gold });
    },

    /**
     * Spend gold (returns false if not enough)
     */
    async spendGold(amount) {
        if (!this._state.player || this._state.player.gold < amount) {
            Utils.toast('Not enough gold!', 'error');
            return false;
        }

        this._state.player.gold -= amount;
        await DB.players.update(this._state.player.id, {
            gold: this._state.player.gold,
        });

        this.emit('goldChanged', { gold: this._state.player.gold });
        return true;
    },

    // ==================== HERO MANAGEMENT ====================

    /**
     * Migrate heroes with outdated BST to the new stat system
     * This handles the balance update from 10 BST/level to 20 BST/level
     */
    async migrateHeroStats() {
        let migrated = 0;

        for (const hero of this._state.heroes) {
            // Skip dead/retired heroes
            if (hero.state === HeroState.DEAD || hero.state === HeroState.RETIRED) {
                continue;
            }

            const currentBst = hero.bst;
            const expectedBst = hero.expectedBst;

            // If hero has less BST than expected, they need migration
            if (currentBst < expectedBst) {
                const extraPoints = expectedBst - currentBst;
                Utils.log(`Migrating ${hero.name}: ${currentBst} BST -> ${expectedBst} BST (+${extraPoints})`);

                // Distribute extra points proportionally to existing stat distribution
                // If hero has no stats allocated yet (shouldn't happen), distribute evenly
                if (currentBst === 0) {
                    const perStat = Math.floor(extraPoints / 4);
                    const remainder = extraPoints % 4;
                    hero.stats.atk += perStat + (remainder > 0 ? 1 : 0);
                    hero.stats.spd += perStat + (remainder > 1 ? 1 : 0);
                    hero.stats.def += perStat + (remainder > 2 ? 1 : 0);
                    hero.stats.will += perStat;
                } else {
                    // Proportional distribution based on current allocation
                    const ratios = {
                        atk: hero.stats.atk / currentBst,
                        will: hero.stats.will / currentBst,
                        def: hero.stats.def / currentBst,
                        spd: hero.stats.spd / currentBst,
                    };

                    // Calculate additional points per stat
                    let distributed = 0;
                    const additions = {};
                    for (const stat of ['atk', 'will', 'def', 'spd']) {
                        additions[stat] = Math.floor(extraPoints * ratios[stat]);
                        distributed += additions[stat];
                    }

                    // Distribute remainder to highest ratio stats
                    let remainder = extraPoints - distributed;
                    const sortedStats = Object.entries(ratios)
                        .sort((a, b) => b[1] - a[1])
                        .map(([stat]) => stat);

                    let i = 0;
                    while (remainder > 0) {
                        additions[sortedStats[i % 4]]++;
                        remainder--;
                        i++;
                    }

                    // Apply additions
                    hero.stats.atk += additions.atk;
                    hero.stats.will += additions.will;
                    hero.stats.def += additions.def;
                    hero.stats.spd += additions.spd;
                }

                // Save updated hero
                await DB.heroes.save(hero);
                migrated++;
            }
        }

        if (migrated > 0) {
            Utils.log(`Migrated ${migrated} heroes to new stat system`);
            Utils.toast(`${migrated} hero(es) updated with new stat balance!`, 'success');
        }
    },

    /**
     * Get hero by ID
     */
    getHero(heroId) {
        return this._state.heroes.find(h => h.id === heroId);
    },

    /**
     * Hire a recruit
     * @param {Object} recruitData - Recruit data with skills
     * @param {Object} statAllocation - { atk, will, def, spd }
     */
    async hireRecruit(recruitData, statAllocation) {
        // Calculate hire cost
        const baseCost = CONFIG.RECRUITMENT.BASE_HIRE_COST;
        const skillMod = Skills.calcSkillCostModifier(recruitData.skills);
        const totalCost = Math.floor(baseCost * (1 + skillMod * 0.2));

        // Check gold
        if (!await this.spendGold(totalCost)) {
            return null;
        }

        // Create hero
        const hero = new Hero({
            userId: this._state.player.id,
            name: recruitData.name,
            portraitId: recruitData.portraitId,
            level: 1,
            skills: recruitData.skills,
        });

        // Allocate stats
        if (!hero.allocateStats(statAllocation)) {
            // Refund gold on failure
            await this.addGold(totalCost);
            Utils.toast('Invalid stat allocation!', 'error');
            return null;
        }

        // Save to database
        await DB.heroes.save(hero);

        // Add to state
        this._state.heroes.push(hero);

        // Remove from recruits and save
        this._state.recruits = this._state.recruits.filter(
            r => r.id !== recruitData.id
        );
        this.saveRecruits();

        this.emit('heroHired', { hero });
        Utils.toast(`${hero.name} has joined your guild!`, 'success');

        return hero;
    },

    /**
     * Update hero (after combat, level up, etc.)
     */
    async updateHero(hero) {
        await DB.heroes.save(hero);

        const index = this._state.heroes.findIndex(h => h.id === hero.id);
        if (index >= 0) {
            this._state.heroes[index] = hero;
        }

        this.emit('heroUpdated', { hero });
    },

    /**
     * Kill hero (permadeath)
     */
    async killHero(heroId) {
        const hero = this.getHero(heroId);
        if (!hero) return;

        hero.die();
        await this.updateHero(hero);

        // Remove equipped gear (lost on death)
        const equippedItems = await DB.items.getEquipped(heroId);
        for (const item of equippedItems) {
            await DB.items.delete(item.id);
        }

        this.emit('heroDied', { hero });
        Utils.toast(`${hero.name} has fallen in battle. All equipment lost.`, 'error');
    },

    // ==================== RECRUITMENT ====================

    /**
     * Load recruits from localStorage
     */
    loadRecruits() {
        const userId = this._state.player?.id;
        if (!userId) {
            this.generateRecruits();
            return;
        }

        const storageKey = `guildmaster_recruits_${userId}`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Convert plain objects back to Hero instances
                this._state.recruits = data.map(r => new Hero(r));
                Utils.log('Loaded recruits from localStorage:', this._state.recruits.length);
                this.emit('recruitsRefreshed');
            } catch (e) {
                Utils.error('Failed to load recruits from localStorage:', e);
                this.generateRecruits();
            }
        } else {
            // First time - generate new recruits
            this.generateRecruits();
        }
    },

    /**
     * Save recruits to localStorage
     */
    saveRecruits() {
        const userId = this._state.player?.id;
        if (!userId) return;

        const storageKey = `guildmaster_recruits_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(this._state.recruits));
    },

    /**
     * Generate new recruits (costs gold except first time)
     */
    generateRecruits() {
        this._state.recruits = [];

        for (let i = 0; i < CONFIG.RECRUITMENT.POOL_SIZE; i++) {
            const recruit = this.generateRecruit();
            this._state.recruits.push(recruit);
        }

        // Save to localStorage
        this.saveRecruits();

        this.emit('recruitsRefreshed');
    },

    /**
     * Generate a single recruit
     */
    generateRecruit() {
        // Random name from pool (simplified)
        const names = [
            'Kira', 'Marcus', 'Elena', 'Theron', 'Lyra',
            'Damon', 'Vera', 'Silas', 'Nova', 'Axel',
            'Freya', 'Orion', 'Sage', 'Phoenix', 'Raven',
            'Atlas', 'Luna', 'Felix', 'Ivy', 'Storm',
        ];

        const skills = Skills.rollForRecruit();

        // Return as Hero instance so hireCost is preserved through serialization
        return new Hero({
            id: Utils.uuid(),
            name: Utils.randomChoice(names),
            portraitId: Utils.randomInt(1, 20),
            skills,
            hireCost: this.calcHireCost(skills),
        });
    },

    /**
     * Calculate hire cost for skills
     */
    calcHireCost(skills) {
        const baseCost = CONFIG.RECRUITMENT.BASE_HIRE_COST;
        const skillMod = Skills.calcSkillCostModifier(skills);
        return Math.floor(baseCost * (1 + skillMod * 0.2));
    },

    /**
     * Refresh recruit pool (costs gold)
     */
    async refreshRecruits() {
        if (!await this.spendGold(CONFIG.RECRUITMENT.REFRESH_COST)) {
            return false;
        }

        this.generateRecruits();
        Utils.toast('Found new adventurers!', 'success');
        return true;
    },

    // ==================== QUESTS ====================

    /**
     * Generate a random quest from available templates
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @returns {Quest|null}
     */
    generateRandomQuest(difficulty = null) {
        const templates = Quests.getAllTemplates();
        let available = templates;

        // Filter by difficulty if specified
        if (difficulty) {
            available = templates.filter(t => t.difficulty === difficulty);
        }

        // Filter out templates already on the board
        const boardTemplateIds = this._state.questBoard.map(q => q.templateId);
        available = available.filter(t => !boardTemplateIds.includes(t.id));

        if (available.length === 0) return null;

        const template = Utils.randomChoice(available);
        return Quest.fromTemplate(template.id, this._state.player?.id);
    },

    /**
     * Load quest board from Supabase, generate if empty or incomplete
     */
    async loadQuestBoard() {
        // Check if we have valid quests in the board (already loaded from Supabase)
        const validQuests = this._state.questBoard.filter(q => {
            // Check quest has encounters and isn't expired
            return q.encounters && q.encounters.length > 0 && !q.isExpired;
        });

        // Remove expired quests from database
        for (const quest of this._state.questBoard) {
            if (quest.isExpired) {
                await DB.quests.delete(quest.id);
            }
        }

        this._state.questBoard = validQuests;

        // Generate more quests if we don't have enough
        const targetCounts = { easy: 2, medium: 2, hard: 2 };
        const currentCounts = {
            easy: validQuests.filter(q => q.difficulty === QuestDifficulty.EASY).length,
            medium: validQuests.filter(q => q.difficulty === QuestDifficulty.MEDIUM).length,
            hard: validQuests.filter(q => q.difficulty === QuestDifficulty.HARD).length,
        };

        const newQuests = [];
        for (const [difficulty, target] of Object.entries(targetCounts)) {
            const needed = target - currentCounts[difficulty];
            for (let i = 0; i < needed; i++) {
                const quest = this.generateRandomQuest(difficulty);
                if (quest) {
                    newQuests.push(quest);
                    this._state.questBoard.push(quest);
                }
            }
        }

        // Save new quests to Supabase
        if (newQuests.length > 0) {
            await Promise.all(newQuests.map(q => DB.quests.save(q)));
            Utils.log(`Generated ${newQuests.length} new quest(s) for board`);
        }

        this.emit('questBoardRefreshed');
    },

    /**
     * Refresh quest board (regenerate all)
     */
    async refreshQuestBoard() {
        // Delete all current available quests
        await Promise.all(this._state.questBoard.map(q => DB.quests.delete(q.id)));
        this._state.questBoard = [];

        // Generate fresh board
        const newQuests = [];
        for (let i = 0; i < 2; i++) {
            const easy = this.generateRandomQuest(QuestDifficulty.EASY);
            if (easy) newQuests.push(easy);
        }
        for (let i = 0; i < 2; i++) {
            const medium = this.generateRandomQuest(QuestDifficulty.MEDIUM);
            if (medium) newQuests.push(medium);
        }
        for (let i = 0; i < 2; i++) {
            const hard = this.generateRandomQuest(QuestDifficulty.HARD);
            if (hard) newQuests.push(hard);
        }

        // Save to Supabase
        await Promise.all(newQuests.map(q => DB.quests.save(q)));

        this._state.questBoard = newQuests;
        this.emit('questBoardRefreshed');
    },

    /**
     * Check for expired quests and replace them
     */
    async checkQuestBoardExpiration() {
        let replaced = 0;
        const savePromises = [];

        for (let i = 0; i < this._state.questBoard.length; i++) {
            const quest = this._state.questBoard[i];
            if (quest.isExpired) {
                // Delete expired quest from database
                savePromises.push(DB.quests.delete(quest.id));

                // Generate replacement of same difficulty
                const replacement = this.generateRandomQuest(quest.difficulty);
                if (replacement) {
                    this._state.questBoard[i] = replacement;
                    savePromises.push(DB.quests.save(replacement));
                    replaced++;
                }
            }
        }

        if (replaced > 0) {
            await Promise.all(savePromises);
            this.emit('questBoardRefreshed');
            Utils.log(`Replaced ${replaced} expired quest(s)`);
        }

        return replaced;
    },

    /**
     * Start a quest with a hero
     */
    async startQuest(questTemplateId, heroId) {
        const hero = this.getHero(heroId);
        if (!hero || !hero.isAvailable) {
            Utils.toast('Hero is not available', 'error');
            return null;
        }

        // Find the quest on the board (use existing instance, not new one)
        const boardIndex = this._state.questBoard.findIndex(q => q.templateId === questTemplateId);
        if (boardIndex === -1) {
            Utils.toast('Quest no longer available', 'error');
            return null;
        }

        // Take the quest from the board
        const quest = this._state.questBoard[boardIndex];
        if (!quest) {
            Utils.toast('Invalid quest', 'error');
            return null;
        }

        // Remove from board and generate replacement
        const replacement = this.generateRandomQuest(quest.difficulty);
        if (replacement) {
            this._state.questBoard[boardIndex] = replacement;
            // Save replacement to Supabase
            DB.quests.save(replacement).catch(e => Utils.error('Failed to save replacement quest:', e));
        } else {
            this._state.questBoard.splice(boardIndex, 1);
        }
        this.emit('questBoardRefreshed');

        // Fetch equipped items and calculate gear bonuses for combat
        let gearBonuses = {};
        try {
            const equippedItems = await DB.items.getEquipped(hero.id);
            for (const item of equippedItems) {
                // Add regular stats (atk, will, def, spd, hp)
                const itemStats = item.totalStats;
                for (const [stat, value] of Object.entries(itemStats)) {
                    gearBonuses[stat] = (gearBonuses[stat] || 0) + value;
                }
                // Add special effects (leech, etc.)
                if (item.specialEffects) {
                    for (const effect of item.specialEffects) {
                        if (effect.stat && effect.value) {
                            gearBonuses[effect.stat] = (gearBonuses[effect.stat] || 0) + effect.value;
                        }
                    }
                }
            }
            Utils.log('Gear bonuses for combat:', gearBonuses);
        } catch (e) {
            Utils.error('Failed to fetch gear bonuses:', e);
        }

        // Save hero's starting HP before combat simulation
        const startingHp = hero.currentHp;

        // Pre-run combat simulation with gear bonuses (result is predetermined but revealed over time)
        const combatResults = CombatEngine.runQuest(hero, quest, gearBonuses);

        // Store the final HP for later, but restore hero to starting HP
        // (HP will be revealed progressively during quest and applied at completion)
        combatResults.heroStartingHp = startingHp;
        combatResults.heroFinalHp = hero.currentHp;
        hero.currentHp = startingHp;

        // Start quest with pre-calculated combat events
        quest.start(heroId, combatResults);
        hero.startQuest(quest.id);

        // Save to database
        await Promise.all([
            DB.quests.save(quest),
            DB.heroes.save(hero),
        ]);

        // Update state
        this._state.activeQuests.push(quest);
        this.emit('questStarted', { quest, hero });

        Utils.toast(`${hero.name} embarks on ${quest.name}!`, 'success');
        return quest;
    },

    /**
     * Check and complete any finished quests
     */
    async checkQuestCompletions() {
        for (const quest of this._state.activeQuests) {
            // isReadyToComplete includes both time completion AND early hero death
            if (quest.isReadyToComplete && quest.status === QuestStatus.ACTIVE) {
                // Debug: Log why quest is completing
                Utils.log(`Quest completing: ${quest.name}, timeRemaining: ${quest.timeRemaining}ms, isTimeComplete: ${quest.isTimeComplete}, heroDefeated: ${quest.heroDefeated}, endsAt: ${quest.endsAt}`);
                await this.completeQuest(quest.id);
            }
        }
    },

    /**
     * Complete a quest (use pre-calculated combat results, distribute rewards)
     */
    async completeQuest(questId) {
        const quest = this._state.activeQuests.find(q => q.id === questId);
        if (!quest) return null;

        const hero = this.getHero(quest.heroId);
        if (!hero) return null;

        Utils.log(`Completing quest: ${quest.name}`);

        // Use pre-calculated combat results from quest start
        const results = quest.combatResults || CombatEngine.runQuest(hero, quest);

        // Apply final HP to hero (was deferred from quest start)
        if (results.heroFinalHp !== undefined) {
            hero.currentHp = results.heroFinalHp;
        }

        if (results.success) {
            // Quest succeeded
            quest.complete({
                loot: {
                    gold: results.totalGold,
                    xp: results.totalXp,
                    items: results.loot,
                },
                encounterResults: results.encounters,
            });

            // Award rewards
            await this.addGold(results.totalGold);
            const levelResult = hero.addXp(results.totalXp);
            hero.completeQuest(false);

            // Add loot to inventory
            for (const item of results.loot) {
                item.userId = this._state.player.id;
                await DB.items.save(item);
                this._state.inventory.push(item);
            }

            // Notify
            if (levelResult.leveled) {
                Utils.toast(`${hero.name} leveled up to ${levelResult.newLevel}!`, 'success');
            }
            Utils.toast(
                `${hero.name} returned with ${results.totalGold}g and ${results.loot.length} items!`,
                'success'
            );
        } else {
            // Quest failed - hero died
            quest.fail();
            await this.killHero(hero.id);
        }

        // Save updates
        await Promise.all([
            DB.quests.save(quest),
            hero.isAlive ? DB.heroes.save(hero) : Promise.resolve(),
        ]);

        // Remove from active quests
        this._state.activeQuests = this._state.activeQuests.filter(
            q => q.id !== questId
        );

        this.emit('questCompleted', { quest, hero, results });
        return results;
    },

    // ==================== INVENTORY ====================

    /**
     * Equip item to hero
     */
    async equipItem(itemId, heroId) {
        const item = this._state.inventory.find(i => i.id === itemId);
        const hero = this.getHero(heroId);

        if (!item || !hero) {
            Utils.toast('Invalid item or hero', 'error');
            return false;
        }

        // Unequip existing item in that slot
        const existingItemId = hero.equipment[item.slot];
        if (existingItemId) {
            await this.unequipItem(existingItemId);
        }

        // Equip new item
        item.equip(heroId);
        hero.equipment[item.slot] = item.id;

        // Remove from inventory
        this._state.inventory = this._state.inventory.filter(i => i.id !== itemId);

        // Save
        await Promise.all([
            DB.items.save(item),
            DB.heroes.save(hero),
        ]);

        this.emit('itemEquipped', { item, hero });
        return true;
    },

    /**
     * Unequip item from hero
     */
    async unequipItem(itemId) {
        // Find item in equipped items
        const item = await this.getEquippedItem(itemId);
        if (!item) return false;

        const hero = this.getHero(item.heroId);
        if (!hero) return false;

        // Unequip
        item.unequip();
        hero.equipment[item.slot] = null;

        // Add to inventory
        this._state.inventory.push(item);

        // Save
        await Promise.all([
            DB.items.save(item),
            DB.heroes.save(hero),
        ]);

        this.emit('itemUnequipped', { item, hero });
        return true;
    },

    /**
     * Get equipped item by ID
     */
    async getEquippedItem(itemId) {
        for (const hero of this._state.heroes) {
            const items = await DB.items.getEquipped(hero.id);
            const item = items.find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    },

    // ==================== EVENT SYSTEM ====================

    /**
     * Subscribe to state events
     */
    on(event, callback) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    },

    /**
     * Unsubscribe from event
     */
    off(event, callback) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(
            cb => cb !== callback
        );
    },

    /**
     * Emit event to all listeners
     */
    emit(event, data = {}) {
        Utils.log(`Event: ${event}`, data);
        const listeners = this._listeners[event] || [];
        for (const callback of listeners) {
            try {
                callback(data);
            } catch (err) {
                Utils.error(`Event listener error for ${event}:`, err);
            }
        }
    },
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameState };
}
