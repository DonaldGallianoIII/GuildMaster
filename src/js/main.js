/**
 * ============================================
 * GUILD MASTER - Main Application Entry Point
 * ============================================
 * Initializes the game and coordinates all systems
 * ============================================
 */

const App = {
    // Application state
    _initialized: false,
    _authenticated: false,
    _currentTab: 'heroes',

    /**
     * Initialize the application
     */
    async init() {
        Utils.log('Guild Master starting...');

        try {
            // Initialize Supabase
            initSupabase();

            // Initialize auth UI first
            AuthUI.init();

            // Check for existing session
            const session = await Auth.getSession();

            if (session) {
                // Already authenticated - show game directly
                Utils.log('Existing session found, loading game...');
                await this.startGame(session.user);
            } else {
                // Not authenticated - auth screen is already visible
                Utils.log('No session found, showing auth screen');

                // Listen for successful authentication
                GameState.on('authSuccess', async ({ user }) => {
                    await this.startGame(user);
                });
            }

            // Listen for auth state changes (e.g., session expiry)
            Auth.onAuthStateChange(async (event, session) => {
                Utils.log('Auth state changed:', event);

                if (event === 'SIGNED_OUT' || !session) {
                    this.handleSignOut();
                } else if (event === 'SIGNED_IN' && session && !this._authenticated) {
                    await this.startGame(session.user);
                }
            });

        } catch (error) {
            Utils.error('Failed to initialize:', error);
            Utils.toast('Failed to load game. Please refresh.', 'error');
        }
    },

    /**
     * Start the game after authentication
     */
    async startGame(user) {
        // Prevent double initialization from race condition between
        // initial session check and onAuthStateChange callback
        if (this._authenticated) {
            Utils.log('Already authenticated, skipping duplicate startGame call');
            return;
        }
        this._authenticated = true;

        Utils.log('Starting game for user:', user.id);

        // Hide auth, show game
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');

        // Load player data
        await GameState.loadPlayerData(user.id);

        // Set up UI
        this.initNavigation();
        this.initSystems();
        this.initSignOut();
        this.updatePlayerDisplay();

        // Listen for state events
        this.bindStateEvents();

        this._initialized = true;
        Utils.log('Guild Master initialized successfully!');

        // Show initial tab
        this.switchTab(this._currentTab);
    },

    /**
     * Handle sign out
     */
    handleSignOut() {
        this._authenticated = false;
        this._initialized = false;

        // Show auth, hide game
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');

        // Reset auth UI
        AuthUI._mode = 'login';
        AuthUI.render();
        AuthUI.bindEvents();
    },

    /**
     * Initialize sign out button
     */
    initSignOut() {
        const signOutBtn = document.getElementById('sign-out-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to sign out?')) {
                    await AuthUI.signOut();
                }
            });
        }
    },

    /**
     * Initialize navigation tabs
     */
    initNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    },

    /**
     * Switch to a different tab
     */
    switchTab(tabName) {
        this._currentTab = tabName;

        // Update nav buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update content sections
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Refresh the active tab's content
        this.refreshCurrentTab();
    },

    /**
     * Refresh current tab's content
     */
    refreshCurrentTab() {
        switch (this._currentTab) {
            case 'heroes':
                this.renderHeroes();
                break;
            case 'recruitment':
                RecruitmentSystem.render();
                break;
            case 'quests':
                QuestSystem.render();
                break;
            case 'inventory':
                InventorySystem.render();
                break;
            case 'guild':
                GuildHallSystem.render();
                break;
        }
    },

    /**
     * Initialize all game systems
     */
    async initSystems() {
        RecruitmentSystem.init();
        QuestSystem.init();
        InventorySystem.init();
        PeekSystem.init();
        DevPanel.init();
        await GuildHallSystem.init();
    },

    // Update interval for hero cards showing quest progress
    _heroUpdateInterval: null,

    /**
     * Bind state event handlers
     */
    bindStateEvents() {
        GameState.on('goldChanged', () => this.updatePlayerDisplay());
        GameState.on('heroHired', () => this.renderHeroes());
        GameState.on('heroUpdated', () => this.renderHeroes());
        GameState.on('heroDied', () => this.renderHeroes());
        GameState.on('questStarted', () => this.renderHeroes());
        GameState.on('questCompleted', () => this.renderHeroes());
        GameState.on('heroLevelUp', () => this.renderHeroes());
        // Only re-render heroes for equipment changes if modal is not open
        // (modal handles its own refresh)
        GameState.on('itemEquipped', () => {
            if (!document.getElementById('hero-modal')?.classList.contains('active')) {
                this.renderHeroes();
            }
        });
        GameState.on('itemUnequipped', () => {
            if (!document.getElementById('hero-modal')?.classList.contains('active')) {
                this.renderHeroes();
            }
        });
        GameState.on('heroHealed', () => this.renderHeroes());
        GameState.on('dataLoaded', () => {
            this.updatePlayerDisplay();
            this.refreshCurrentTab();
        });

        // Start hero update interval for quest progress and healing on hero cards
        this._heroUpdateInterval = setInterval(() => {
            if (this._currentTab === 'heroes') {
                this.updateHeroQuestProgress();
                this.updateHeroHealingProgress();
            }
        }, 1000);
    },

    /**
     * Update passive healing progress display on hero cards
     */
    async updateHeroHealingProgress() {
        const healingHeroes = GameState.heroes.filter(h => h.canPassiveHeal);
        if (healingHeroes.length === 0) return;

        let anyHealed = false;

        for (const hero of healingHeroes) {
            const progress = hero.passiveHealProgress;
            const timeLeft = Math.ceil(hero.timeUntilNextHeal);

            // If ready to heal, trigger it immediately instead of waiting for GuildHall interval
            if (progress >= 100 || timeLeft <= 0) {
                const result = hero.applyPassiveHeal();
                if (result.healed) {
                    await GameState.updateHero(hero);
                    anyHealed = true;
                }
            }

            const indicator = document.querySelector(
                `.hero-card[data-hero-id="${hero.id}"] .hero-healing-indicator`
            );
            if (indicator) {
                const progressFill = indicator.querySelector('.healing-progress-fill');
                if (progressFill) {
                    progressFill.style.width = `${hero.passiveHealProgress}%`;
                }

                const currentTimeLeft = Math.ceil(hero.timeUntilNextHeal);
                const timeSpan = indicator.querySelector('span:last-child');
                if (timeSpan) {
                    timeSpan.textContent = currentTimeLeft > 0 ? Utils.formatTime(currentTimeLeft * 1000) : 'Ready';
                }
            }
        }

        if (anyHealed) {
            GameState.emit('heroHealed');
        }
    },

    /**
     * Update quest progress on hero cards (lightweight, no full re-render)
     */
    updateHeroQuestProgress() {
        const heroesOnQuest = GameState.heroes.filter(h => h.state === HeroState.ON_QUEST);
        if (heroesOnQuest.length === 0) return;

        for (const hero of heroesOnQuest) {
            const quest = GameState.activeQuests.find(q => q.heroId === hero.id);
            if (!quest) continue;

            // Update progress bar
            const progressFill = document.querySelector(
                `.hero-card[data-hero-id="${hero.id}"] .quest-progress-fill`
            );
            if (progressFill) {
                progressFill.style.width = `${quest.progressPercent}%`;
            }

            // Update time remaining
            const timeText = document.querySelector(
                `.hero-card[data-hero-id="${hero.id}"] .quest-time-remaining`
            );
            if (timeText) {
                timeText.textContent = Utils.formatTime(quest.timeRemaining);
            }

            // Update HP based on revealed events
            const hpSection = document.querySelector(
                `.hero-card[data-hero-id="${hero.id}"] .hero-card-hp`
            );
            if (hpSection && quest.getCurrentEvents) {
                const combatResults = quest.combatResults;
                const startHp = combatResults?.heroStartingHp ?? hero.maxHp;
                let displayHp = startHp;

                const events = quest.getCurrentEvents();
                for (const event of events) {
                    if (event.type === 'combat_action' && event.data) {
                        if (!event.data.actorIsHero && event.data.damage) {
                            displayHp = Math.max(0, displayHp - event.data.damage);
                        }
                        if (event.data.actorIsHero && event.data.healing) {
                            displayHp = Math.min(hero.maxHp, displayHp + event.data.healing);
                        }
                    }
                }

                const hpFill = hpSection.querySelector('.hp-bar-fill');
                const hpText = hpSection.querySelector('.hp-text');
                if (hpFill) {
                    hpFill.style.width = `${(displayHp / hero.maxHp) * 100}%`;
                }
                if (hpText) {
                    hpText.textContent = `${displayHp} / ${hero.maxHp}`;
                }
            }
        }
    },

    /**
     * Update player info display
     */
    updatePlayerDisplay() {
        const goldEl = document.getElementById('player-gold');
        if (goldEl) {
            goldEl.textContent = GameState.gold.toLocaleString();
        }

        const nameEl = document.getElementById('guild-name');
        if (nameEl) {
            nameEl.textContent = GameState.player?.username || 'Guild Master';
        }
    },

    /**
     * Render heroes tab
     */
    async renderHeroes() {
        const container = document.getElementById('heroes-grid');
        if (!container) return;

        // Filter out dead heroes for main display
        const livingHeroes = GameState.heroes.filter(h => h.state !== HeroState.DEAD);

        await HeroCard.renderList(container, livingHeroes, {
            showActions: true,
            onQuestClick: (hero) => {
                // Switch to quests tab
                this.switchTab('quests');
            },
            onDetailClick: (hero) => {
                Modals.showHeroDetail(hero);
            },
            onClick: (hero) => {
                Modals.showHeroDetail(hero);
            },
            onPeekClick: (quest) => {
                Modals.showCombatLog(quest);
            },
        });
    },
};

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
