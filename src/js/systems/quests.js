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
            onViewResults: (quest) => this.resolveFailedQuest(quest),
        });

        // Start peek system for each active quest (only for non-defeated)
        for (const quest of GameState.activeQuests) {
            if (!quest.heroDefeated) {
                PeekSystem.startPeek(quest.id);
            }
        }
    },

    /**
     * Resolve a failed quest (hero died) - called when clicking "View Results"
     */
    async resolveFailedQuest(quest) {
        // Complete the quest immediately (will handle hero death)
        await GameState.completeQuest(quest.id);
    },

    /**
     * Render quest board with accordions
     */
    renderBoard() {
        const container = document.getElementById('quest-board');
        if (!container) return;

        // Get highest hero level for danger rating
        const highestHeroLevel = GameState.heroes.reduce((max, h) => Math.max(max, h.level || 1), 1);

        QuestCard.renderBoard(container, GameState.questBoard, {
            onAccept: (quest) => this.showAssignmentModal(quest),
            heroLevel: highestHeroLevel,
        });
    },

    /**
     * Show quest assignment modal
     */
    showAssignmentModal(quest) {
        const availableHeroes = GameState.availableHeroes;
        Modals.showQuestAssignment(quest, availableHeroes, async (hero) => {
            // Use quest.id for new system, fall back to templateId for legacy
            await GameState.startQuest(quest.id || quest.templateId, hero.id);
        });
    },

    /**
     * Show peek modal (expanded view with combat log)
     */
    showPeekModal(quest) {
        Modals.showCombatLog(quest);
    },

    /**
     * Update active quest displays
     */
    updateActiveQuests() {
        // Check for completions (time-based)
        GameState.checkQuestCompletions();

        // Check for expired quest board quests
        GameState.checkQuestBoardExpiration();

        // Check for newly defeated heroes and re-render if needed
        let needsRerender = false;
        for (const quest of GameState.activeQuests) {
            if (quest.heroDefeated) {
                // Check if we already rendered this as failed
                const card = document.querySelector(`.active-quest-card[data-quest-id="${quest.id}"]`);
                if (card && !card.classList.contains('quest-failed')) {
                    // Stop the peek system for this quest
                    PeekSystem.stopPeek(quest.id);
                    needsRerender = true;
                }
            }
        }

        if (needsRerender) {
            this.renderActive();
            return; // Skip individual updates since we just re-rendered
        }

        // Update progress bars and times for non-defeated quests
        for (const quest of GameState.activeQuests) {
            if (quest.heroDefeated) continue; // Skip defeated quests

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

        // Update quest board expiration timers
        this.updateQuestBoardTimers();
    },

    /**
     * Update expiration timers on quest board
     */
    updateQuestBoardTimers() {
        for (const quest of GameState.questBoard) {
            const timeEl = document.querySelector(`.expiration-time[data-quest-id="${quest.templateId}"]`);
            if (timeEl) {
                const remaining = quest.expirationTimeRemaining;
                timeEl.textContent = Utils.formatTime(remaining);

                // Add urgent class if under 2 minutes
                const expirationSection = timeEl.closest('.quest-expiration');
                if (expirationSection) {
                    if (remaining < 2 * 60 * 1000) {
                        expirationSection.classList.add('urgent');
                    } else {
                        expirationSection.classList.remove('urgent');
                    }
                }
            }
        }
    },
};

Object.freeze(QuestSystem);
