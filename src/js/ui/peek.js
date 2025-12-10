/**
 * ============================================
 * GUILD MASTER - Peek System
 * ============================================
 * Real-time quest progress visualization
 *
 * The peek system shows what's happening on active quests:
 * - Flying event icons (loot, combat, damage)
 * - Current encounter status
 * - Hero HP updates
 * ============================================
 */

const PeekSystem = {
    // Active intervals for updating peek displays
    _intervals: {},

    /**
     * Start peek updates for a quest
     */
    startPeek(questId) {
        if (this._intervals[questId]) return;

        this._intervals[questId] = setInterval(() => {
            this.updatePeek(questId);
        }, CONFIG.UI.PEEK_UPDATE_INTERVAL);

        // Initial update
        this.updatePeek(questId);
    },

    /**
     * Stop peek updates for a quest
     */
    stopPeek(questId) {
        if (this._intervals[questId]) {
            clearInterval(this._intervals[questId]);
            delete this._intervals[questId];
        }
    },

    /**
     * Stop all peek updates
     */
    stopAll() {
        for (const questId of Object.keys(this._intervals)) {
            this.stopPeek(questId);
        }
    },

    /**
     * Update a single quest's peek display
     */
    updatePeek(questId) {
        const quest = GameState.activeQuests.find(q => q.id === questId);
        if (!quest) {
            this.stopPeek(questId);
            return;
        }

        // Stop updating if hero was defeated
        if (quest.heroDefeated) {
            this.stopPeek(questId);
            return;
        }

        // Find the peek area element
        const peekArea = document.querySelector(`.quest-peek-area[data-quest-id="${questId}"]`);
        if (!peekArea) return;

        // Get current events
        const events = quest.getCurrentEvents();
        const latestEvent = events[events.length - 1];

        // Update status text based on latest event
        const statusEl = peekArea.querySelector('.peek-status');
        if (statusEl && latestEvent) {
            statusEl.textContent = this.getEventStatusText(latestEvent, quest);
        }

        // Update progress bar
        const progressFill = document.querySelector(
            `.active-quest-card[data-quest-id="${questId}"] .quest-progress-fill`
        );
        if (progressFill) {
            progressFill.style.width = `${quest.progressPercent}%`;
        }

        // Update time remaining
        const timeText = document.querySelector(
            `.active-quest-card[data-quest-id="${questId}"] .quest-time-remaining`
        );
        if (timeText) {
            timeText.textContent = Utils.formatTime(quest.timeRemaining);
        }

        // Update HP bar based on quest progress
        this.updateHeroHp(quest);

        // Check for new events to animate
        this.checkForNewEvents(questId, events);

        // Check if quest is complete (time up OR hero died)
        if (quest.isReadyToComplete) {
            this.stopPeek(questId);
            // Trigger quest completion (async, but we don't need to wait)
            GameState.checkQuestCompletions().catch(e => console.error('Quest completion error:', e));
        }
    },

    /**
     * Get status text for an event
     */
    getEventStatusText(event, quest) {
        const hero = GameState.getHero(quest.heroId);
        const heroName = hero?.name || 'Hero';

        switch (event.type) {
            case 'encounter_start':
                const mobs = event.data.mobs || [];
                if (mobs.length === 1) {
                    return `${heroName} faces a ${mobs[0]}!`;
                }
                return `${heroName} encounters ${mobs.length} enemies!`;

            case 'combat_action':
                // Real combat action with description
                if (event.data.description) {
                    return event.data.description;
                }
                if (event.data.killed) {
                    return `${event.data.actorName} slays ${event.data.targetName}!`;
                }
                return `${event.data.actorName} attacks ${event.data.targetName}!`;

            case 'combat':
                return `${heroName} is in combat...`;

            case 'damage_taken':
                return `${heroName} takes a hit!`;

            case 'encounter_end':
                if (event.data.victory === false) {
                    return `${heroName} struggles...`;
                }
                if (event.data.loot) {
                    return `${heroName} found treasure!`;
                }
                return `${heroName} presses onward...`;

            case 'quest_complete':
                if (event.data.success === false) {
                    return `${heroName} has fallen...`;
                }
                return `${heroName} is returning victorious!`;

            default:
                return `${heroName} is adventuring...`;
        }
    },

    /**
     * Track seen events and animate new ones
     */
    _seenEvents: {},

    checkForNewEvents(questId, events) {
        if (!this._seenEvents[questId]) {
            this._seenEvents[questId] = new Set();
        }

        const seen = this._seenEvents[questId];
        const container = document.querySelector(
            `.active-quest-card[data-quest-id="${questId}"] .event-icons`
        );
        if (!container) return;

        for (const event of events) {
            const eventKey = `${event.time}-${event.type}`;
            if (seen.has(eventKey)) continue;
            seen.add(eventKey);

            // Animate flying icon
            const icon = this.getEventIcon(event);
            if (icon) {
                this.animateFlyingIcon(container, icon);
            }
        }
    },

    /**
     * Get icon for event type
     */
    getEventIcon(event) {
        switch (event.type) {
            case 'encounter_start':
                return '⚔️';
            case 'combat':
                return '💥';
            case 'damage_taken':
                return '❤️‍🩹';
            case 'encounter_end':
                if (event.data.loot) return '💎';
                return '✓';
            case 'quest_complete':
                return '🏆';
            default:
                return null;
        }
    },

    /**
     * Animate a flying icon
     */
    animateFlyingIcon(container, iconText) {
        const icon = Utils.createElement('span', {
            className: 'event-icon',
        }, iconText);

        container.appendChild(icon);

        // Remove after animation completes
        setTimeout(() => {
            icon.remove();
        }, 2000);
    },

    /**
     * Clean up seen events for completed quests
     */
    cleanupQuest(questId) {
        delete this._seenEvents[questId];
        delete this._questHp[questId];
        this.stopPeek(questId);
    },

    /**
     * Track HP per quest based on revealed damage events
     */
    _questHp: {},

    /**
     * Update hero HP display based on revealed combat events
     */
    updateHeroHp(quest) {
        const hpSection = document.querySelector(`.peek-hero-hp[data-quest-id="${quest.id}"]`);
        if (!hpSection) return;

        const hero = GameState.getHero(quest.heroId);
        if (!hero) return;

        const combatResults = quest.combatResults;
        const startHp = combatResults?.heroStartingHp ?? hero.maxHp;

        // Initialize HP tracking for this quest if needed
        if (this._questHp[quest.id] === undefined) {
            this._questHp[quest.id] = startHp;
        }

        // Get current events and calculate HP from damage events
        const events = quest.getCurrentEvents();
        let calculatedHp = startHp;

        for (const event of events) {
            if (event.type === 'combat_action' && event.data) {
                // Hero took damage
                if (!event.data.actorIsHero && event.data.damage) {
                    calculatedHp = Math.max(0, calculatedHp - event.data.damage);
                }
                // Hero healed
                if (event.data.actorIsHero && event.data.healing) {
                    calculatedHp = Math.min(hero.maxHp, calculatedHp + event.data.healing);
                }
            }
        }

        this._questHp[quest.id] = calculatedHp;

        // Update the stat bar (UI.createStatBar uses .hp-bar-fill and .hp-text)
        const hpFill = hpSection.querySelector('.hp-bar-fill');
        const hpText = hpSection.querySelector('.hp-text');

        if (hpFill) {
            hpFill.style.width = `${(calculatedHp / hero.maxHp) * 100}%`;
        }
        if (hpText) {
            hpText.textContent = `${calculatedHp} / ${hero.maxHp}`;
        }
    },

    /**
     * Initialize peek system for all active quests
     */
    init() {
        for (const quest of GameState.activeQuests) {
            if (quest.status === QuestStatus.ACTIVE) {
                this.startPeek(quest.id);
            }
        }

        // Listen for quest events
        GameState.on('questStarted', ({ quest }) => {
            this.startPeek(quest.id);
        });

        GameState.on('questCompleted', ({ quest }) => {
            this.cleanupQuest(quest.id);
            // Also cleanup modal tracking
            Modals.cleanupCombatLog(quest.id);
        });
    },
};

Object.freeze(PeekSystem);
