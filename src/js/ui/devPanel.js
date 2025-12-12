/**
 * ============================================
 * GUILD MASTER - Developer Panel
 * ============================================
 * Debug tools for testing - only shows when CONFIG.DEBUG is true
 * ============================================
 */

const DevPanel = {
    /**
     * Initialize dev panel
     */
    init() {
        if (!CONFIG.DEBUG) return;

        this.render();
        this.bindEvents();
        Utils.log('Dev panel initialized');
    },

    /**
     * Render the dev panel in Guild Hall tab
     */
    render() {
        const container = document.querySelector('#guild-tab .guild-stats');
        if (!container) return;

        container.innerHTML = `
            <div class="dev-panel">
                <div class="dev-panel-header">
                    <h3>Developer Tools</h3>
                    <span class="dev-badge">DEBUG MODE</span>
                </div>

                <div class="dev-section">
                    <h4>Resources</h4>
                    <div class="dev-controls">
                        <button class="btn btn-gold dev-btn" data-action="add-gold-100">
                            +100 Gold
                        </button>
                        <button class="btn btn-gold dev-btn" data-action="add-gold-1000">
                            +1,000 Gold
                        </button>
                        <button class="btn btn-gold dev-btn" data-action="add-gold-10000">
                            +10,000 Gold
                        </button>
                    </div>
                </div>

                <div class="dev-section">
                    <h4>Heroes</h4>
                    <div class="dev-controls">
                        <button class="btn btn-secondary dev-btn" data-action="add-hero">
                            Generate Random Hero
                        </button>
                        <button class="btn btn-secondary dev-btn" data-action="heal-all">
                            Heal All Heroes
                        </button>
                        <button class="btn btn-secondary dev-btn" data-action="level-up-all">
                            Level Up All Heroes
                        </button>
                    </div>
                </div>

                <div class="dev-section">
                    <h4>Quests</h4>
                    <div class="dev-controls">
                        <button class="btn btn-secondary dev-btn" data-action="refresh-quests">
                            Refresh Quest Board
                        </button>
                        <button class="btn btn-secondary dev-btn" data-action="complete-quests">
                            Complete All Active Quests
                        </button>
                        <button class="btn btn-secondary dev-btn" data-action="speed-up-quests">
                            Speed Up Quests (10x)
                        </button>
                        <button class="btn btn-danger dev-btn" data-action="clear-all-quests">
                            Clear All Quests
                        </button>
                    </div>
                </div>

                <div class="dev-section">
                    <h4>Recruitment</h4>
                    <div class="dev-controls">
                        <button class="btn btn-secondary dev-btn" data-action="refresh-recruits">
                            Refresh Recruits (Free)
                        </button>
                        <button class="btn btn-secondary dev-btn" data-action="legendary-recruit">
                            Spawn Legendary Recruit
                        </button>
                    </div>
                </div>

                <div class="dev-section">
                    <h4>Data</h4>
                    <div class="dev-controls">
                        <button class="btn btn-danger dev-btn" data-action="reset-player">
                            Reset Player Data
                        </button>
                        <button class="btn btn-secondary dev-btn" data-action="export-state">
                            Export Game State
                        </button>
                    </div>
                </div>

                <div class="dev-log">
                    <h4>Console</h4>
                    <div id="dev-console" class="dev-console"></div>
                </div>
            </div>
        `;
    },

    /**
     * Bind event handlers
     */
    bindEvents() {
        const panel = document.querySelector('.dev-panel');
        if (!panel) return;

        panel.addEventListener('click', async (e) => {
            const btn = e.target.closest('.dev-btn');
            if (!btn) return;

            const action = btn.dataset.action;
            await this.handleAction(action);
        });
    },

    /**
     * Handle dev panel actions
     */
    async handleAction(action) {
        this.log(`Action: ${action}`);

        switch (action) {
            // Gold
            case 'add-gold-100':
                await this.addGold(100);
                break;
            case 'add-gold-1000':
                await this.addGold(1000);
                break;
            case 'add-gold-10000':
                await this.addGold(10000);
                break;

            // Souls
            case 'add-souls-100':
                await this.addSouls(100);
                break;

            // Heroes
            case 'add-hero':
                await this.addRandomHero();
                break;
            case 'heal-all':
                await this.healAllHeroes();
                break;
            case 'level-up-all':
                await this.levelUpAllHeroes();
                break;

            // Quests
            case 'refresh-quests':
                this.refreshQuests();
                break;
            case 'complete-quests':
                await this.completeAllQuests();
                break;
            case 'speed-up-quests':
                this.speedUpQuests();
                break;
            case 'clear-all-quests':
                await this.clearAllQuests();
                break;

            // Recruitment
            case 'refresh-recruits':
                this.refreshRecruits();
                break;
            case 'legendary-recruit':
                this.spawnLegendaryRecruit();
                break;

            // Data
            case 'reset-player':
                await this.resetPlayerData();
                break;
            case 'export-state':
                this.exportGameState();
                break;
        }
    },

    /**
     * Add gold to player
     */
    async addGold(amount) {
        await GameState.addGold(amount);
        this.log(`Added ${amount} gold. Total: ${GameState.gold}`);
        Utils.toast(`+${amount} gold (dev)`, 'success');
    },

    /**
     * Add souls to player
     */
    async addSouls(amount) {
        await GameState.addSouls(amount);
        this.log(`Added ${amount} souls. Total: ${GameState.souls}`);
        Utils.toast(`+${amount} souls (dev)`, 'success');
    },

    /**
     * Add a random hero directly to roster
     */
    async addRandomHero() {
        const hero = Hero.generate(Math.floor(Math.random() * 5) + 1);

        // Save to database
        const userId = GameState.player.id;
        await DB.heroes.create(userId, hero);

        // Add to local state
        GameState._state.heroes.push(hero);
        GameState.emit('heroHired', { hero });

        this.log(`Added hero: ${hero.name} (Lvl ${hero.level})`);
        Utils.toast(`New hero: ${hero.name}`, 'success');
    },

    /**
     * Heal all heroes to full HP
     */
    async healAllHeroes() {
        for (const hero of GameState.heroes) {
            hero.currentHp = hero.maxHp;
            hero.state = HeroState.AVAILABLE;
            await DB.heroes.update(hero.id, {
                current_hp: hero.currentHp,
                state: hero.state
            });
        }
        GameState.emit('heroUpdated');
        this.log(`Healed ${GameState.heroes.length} heroes`);
        Utils.toast('All heroes healed', 'success');
    },

    /**
     * Level up all heroes
     */
    async levelUpAllHeroes() {
        for (const hero of GameState.heroes) {
            if (hero.level < CONFIG.HERO.MAX_LEVEL) {
                hero.level += 1;
                hero.skillPoints += CONFIG.SKILLS.POINTS_PER_LEVEL;
                // Recalculate stats
                hero.maxHp = (hero.level * CONFIG.STATS.HP_PER_LEVEL) + hero.stats.def;
                hero.currentHp = hero.maxHp;

                await DB.heroes.update(hero.id, {
                    level: hero.level,
                    skill_points: hero.skillPoints,
                    max_hp: hero.maxHp,
                    current_hp: hero.currentHp
                });
            }
        }
        GameState.emit('heroUpdated');
        this.log(`Leveled up ${GameState.heroes.length} heroes`);
        Utils.toast('All heroes leveled up', 'success');
    },

    /**
     * Refresh quest board
     */
    refreshQuests() {
        GameState.refreshQuestBoard();
        this.log('Quest board refreshed');
        Utils.toast('Quest board refreshed', 'info');
    },

    /**
     * Complete all active quests instantly
     */
    async completeAllQuests() {
        const activeQuests = GameState.activeQuests;

        if (activeQuests.length === 0) {
            this.log('No active quests to complete');
            Utils.toast('No active quests', 'warning');
            return;
        }

        for (const quest of activeQuests) {
            // Simulate successful completion
            quest.status = QuestStatus.COMPLETED;
            quest.completedAt = Utils.now();

            // Give rewards
            const goldReward = quest.rewards?.gold || 100;
            const xpReward = quest.rewards?.xp || 50;

            await GameState.addGold(goldReward);

            // Return hero
            if (quest.heroId) {
                const hero = GameState.heroes.find(h => h.id === quest.heroId);
                if (hero) {
                    hero.state = HeroState.AVAILABLE;
                    hero.xp = (hero.xp || 0) + xpReward;
                    await DB.heroes.update(hero.id, {
                        state: hero.state,
                        xp: hero.xp
                    });
                }
            }
        }

        // Clear active quests
        GameState._state.activeQuests = [];
        GameState.emit('questCompleted');
        GameState.emit('heroUpdated');

        this.log(`Completed ${activeQuests.length} quests`);
        Utils.toast(`${activeQuests.length} quests completed`, 'success');
    },

    /**
     * Speed up quest timers
     */
    speedUpQuests() {
        // Reduce remaining time by 90%
        for (const quest of GameState.activeQuests) {
            if (quest.startedAt && quest.duration) {
                const elapsed = Utils.now() - quest.startedAt;
                const remaining = quest.duration - elapsed;
                if (remaining > 0) {
                    // Move start time forward to speed up
                    quest.startedAt -= remaining * 0.9;
                }
            }
        }
        this.log('Quest timers sped up by 10x');
        Utils.toast('Quests sped up!', 'info');
    },

    /**
     * Clear all quests (available and active) - useful for cleaning stale data
     */
    async clearAllQuests() {
        const userId = GameState.player?.id;
        if (!userId) {
            this.log('No player loaded');
            return;
        }

        let deleted = 0;

        // Clear active quests first (free heroes)
        const activeQuests = [...(GameState._state.activeQuests || [])];
        for (const quest of activeQuests) {
            // Free up any heroes on quests
            if (quest.heroId) {
                const hero = GameState.getHero(quest.heroId);
                if (hero && hero.state === HeroState.ON_QUEST) {
                    hero.state = HeroState.AVAILABLE;
                    hero.currentQuestId = null;
                    await DB.heroes.update(hero.id, {
                        state: HeroState.AVAILABLE,
                        current_quest_id: null,
                    });
                }
            }
            await DB.quests.delete(quest.id);
            deleted++;
        }

        // Clear quest board
        const boardQuests = [...(GameState._state.questBoard || [])];
        for (const quest of boardQuests) {
            await DB.quests.delete(quest.id);
            deleted++;
        }

        // Clear local state
        GameState._state.activeQuests = [];
        GameState._state.questBoard = [];
        GameState.emit('questsUpdated', {});
        GameState.emit('heroUpdated');

        this.log(`Cleared ${deleted} quests`);
        Utils.toast(`Cleared ${deleted} quests`, 'success');

        // Refresh quest board with new quests
        await GameState.refreshQuestBoard();
    },

    /**
     * Refresh recruits for free
     */
    refreshRecruits() {
        GameState.generateRecruits();
        this.log('Recruits refreshed (free)');
        Utils.toast('Recruits refreshed', 'info');
    },

    /**
     * Spawn a legendary recruit
     */
    spawnLegendaryRecruit() {
        const recruit = Hero.generate(10); // High level

        // Force legendary skills
        recruit.skills = recruit.skills.map(skill => ({
            ...skill,
            rarity: 'legendary'
        }));

        // Add to recruits
        GameState._state.recruits.unshift(recruit);
        GameState.emit('recruitsUpdated');

        this.log(`Spawned legendary recruit: ${recruit.name}`);
        Utils.toast(`Legendary recruit: ${recruit.name}`, 'success');
    },

    /**
     * Reset player data (dangerous!)
     */
    async resetPlayerData() {
        if (!confirm('Are you sure? This will reset ALL your progress!')) {
            return;
        }
        if (!confirm('REALLY sure? This cannot be undone!')) {
            return;
        }

        const userId = GameState.player.id;

        // Delete all heroes
        for (const hero of GameState.heroes) {
            await DB.heroes.delete(hero.id);
        }

        // Reset player gold
        await DB.players.update(userId, { gold: 500 });

        // Reset local state
        GameState._state.heroes = [];
        GameState._state.inventory = [];
        GameState._state.activeQuests = [];
        GameState._state.player.gold = 500;

        GameState.refreshQuestBoard();
        GameState.generateRecruits();

        GameState.emit('dataLoaded');

        this.log('Player data reset to starting state');
        Utils.toast('Progress reset', 'warning');
    },

    /**
     * Export current game state
     */
    exportGameState() {
        const state = {
            player: GameState.player,
            heroes: GameState.heroes,
            inventory: GameState.inventory,
            activeQuests: GameState.activeQuests,
            questBoard: GameState.questBoard,
            recruits: GameState.recruits,
            exportedAt: new Date().toISOString()
        };

        const json = JSON.stringify(state, null, 2);

        // Copy to clipboard
        navigator.clipboard.writeText(json).then(() => {
            this.log('Game state exported to clipboard');
            Utils.toast('State copied to clipboard', 'success');
        }).catch(() => {
            // Fallback: log to console
            console.log('=== GAME STATE EXPORT ===');
            console.log(json);
            this.log('Game state logged to browser console');
            Utils.toast('Check browser console (F12)', 'info');
        });
    },

    /**
     * Log to dev console
     */
    log(message) {
        const console = document.getElementById('dev-console');
        if (!console) return;

        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'dev-log-entry';
        entry.innerHTML = `<span class="log-time">[${time}]</span> ${Utils.escapeHtml(message)}`;

        console.appendChild(entry);
        console.scrollTop = console.scrollHeight;

        // Also log to real console
        Utils.log(`[DEV] ${message}`);
    }
};
