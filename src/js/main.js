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
    _currentTab: 'heroes',

    /**
     * Initialize the application
     */
    async init() {
        Utils.log('Guild Master starting...');

        try {
            // Initialize Supabase (or mock for local dev)
            initSupabase();

            // Initialize game state
            await GameState.init();

            // Set up UI
            this.initNavigation();
            this.initSystems();
            this.updatePlayerDisplay();

            // Listen for state events
            this.bindStateEvents();

            this._initialized = true;
            Utils.log('Guild Master initialized successfully!');

            // Show initial tab
            this.switchTab(this._currentTab);

        } catch (error) {
            Utils.error('Failed to initialize:', error);
            Utils.toast('Failed to load game. Please refresh.', 'error');
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
        }
    },

    /**
     * Initialize all game systems
     */
    initSystems() {
        RecruitmentSystem.init();
        QuestSystem.init();
        InventorySystem.init();
        PeekSystem.init();
    },

    /**
     * Bind state event handlers
     */
    bindStateEvents() {
        GameState.on('goldChanged', () => this.updatePlayerDisplay());
        GameState.on('heroHired', () => this.renderHeroes());
        GameState.on('heroUpdated', () => this.renderHeroes());
        GameState.on('heroDied', () => this.renderHeroes());
        GameState.on('dataLoaded', () => {
            this.updatePlayerDisplay();
            this.refreshCurrentTab();
        });
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
    renderHeroes() {
        const container = document.getElementById('heroes-grid');
        if (!container) return;

        // Filter out dead heroes for main display
        const livingHeroes = GameState.heroes.filter(h => h.state !== HeroState.DEAD);

        HeroCard.renderList(container, livingHeroes, {
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
