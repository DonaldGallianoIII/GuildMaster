/**
 * ============================================
 * GUILD MASTER - Quest System
 * ============================================
 * Handles quest board and active quest management
 * ============================================
 */

const QuestSystem = {
    // Update interval for active quests
    _updateInterval: null,

    /**
     * Initialize quest system
     */
    init() {
        this.bindEvents();
        this.render();
        this.startUpdates();

        // Listen for state changes
        GameState.on('questBoardRefreshed', () => this.renderBoard());
        GameState.on('questStarted', () => this.render());
        GameState.on('questCompleted', ({ quest, hero, results }) => {
            this.render();
            // Show results modal
            Modals.showCombatResults(quest, results, hero);
        });
    },

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Events are handled through card callbacks
    },

    /**
     * Start periodic updates for active quests
     */
    startUpdates() {
        if (this._updateInterval) return;

        this._updateInterval = setInterval(() => {
            this.updateActiveQuests();
        }, 1000); // Update every second
    },

    /**
     * Stop updates
     */
    stopUpdates() {
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
            this._updateInterval = null;
        }
    },

    /**
     * Render full quest tab
     */
    render() {
        this.renderActive();
        this.renderBoard();
    },

    /**
     * Render active quests section
     */
    renderActive() {
        const container = document.getElementById('active-quests');
        if (!container) return;

        QuestCard.renderActive(container, GameState.activeQuests, {
            getHero: (heroId) => GameState.getHero(heroId),
            onPeek: (quest) => this.showPeekModal(quest),
        });

        // Start peek system for each active quest
        for (const quest of GameState.activeQuests) {
            PeekSystem.startPeek(quest.id);
        }
    },

    /**
     * Render quest board
     */
    renderBoard() {
        const container = document.getElementById('quest-board');
        if (!container) return;

        QuestCard.renderBoard(container, GameState.questBoard, {
            onAccept: (quest) => this.showAssignmentModal(quest),
        });
    },

    /**
     * Show quest assignment modal
     */
    showAssignmentModal(quest) {
        const availableHeroes = GameState.availableHeroes;
        Modals.showQuestAssignment(quest, availableHeroes, async (hero) => {
            await GameState.startQuest(quest.templateId, hero.id);
        });
    },

    /**
     * Show peek modal (expanded view)
     */
    showPeekModal(quest) {
        // For now, just show hero detail
        const hero = GameState.getHero(quest.heroId);
        if (hero) {
            Modals.showHeroDetail(hero);
        }
    },

    /**
     * Update active quest displays
     */
    updateActiveQuests() {
        // Check for completions
        GameState.checkQuestCompletions();

        // Update progress bars and times
        for (const quest of GameState.activeQuests) {
            // Update progress bar
            const progressFill = document.querySelector(
                `.active-quest-card[data-quest-id="${quest.id}"] .quest-progress-fill`
            );
            if (progressFill) {
                progressFill.style.width = `${quest.progressPercent}%`;
            }

            // Update time remaining
            const timeText = document.querySelector(
                `.active-quest-card[data-quest-id="${quest.id}"] .quest-time-remaining`
            );
            if (timeText) {
                timeText.textContent = Utils.formatTime(quest.timeRemaining);
            }
        }
    },
};

Object.freeze(QuestSystem);
