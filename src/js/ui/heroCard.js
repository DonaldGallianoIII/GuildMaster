/**
 * ============================================
 * GUILD MASTER - Hero Card Component
 * ============================================
 * Renders hero cards for the roster view
 * ============================================
 */

// Track render version outside frozen object to prevent race conditions
let _heroCardRenderVersion = 0;

const HeroCard = {
    /**
     * Create a hero card element
     * @param {Hero} hero
     * @param {Object} options
     * @param {Object} options.equipmentBonuses - Pre-calculated equipment stat bonuses
     * @param {Object} options.activeQuest - Active quest if hero is on one
     */
    create(hero, options = {}) {
        const card = Utils.createElement('div', {
            className: `card hero-card ${hero.state}`,
            dataset: { heroId: hero.id },
        });

        // Status badge
        card.appendChild(UI.createStatusBadge(hero.state));

        // Header with portrait and info
        const header = Utils.createElement('div', { className: 'card-header' });
        const headerContent = Utils.createElement('div', { className: 'hero-header' });

        // Portrait
        headerContent.appendChild(UI.createPortrait(hero.portraitId));

        // Info
        const info = Utils.createElement('div', { className: 'hero-info' });
        info.innerHTML = `
            <div class="hero-name">${Utils.escapeHtml(hero.name)}</div>
            <div class="hero-level">Level ${hero.level}</div>
        `;
        headerContent.appendChild(info);

        header.appendChild(headerContent);
        card.appendChild(header);

        // Body
        const body = Utils.createElement('div', { className: 'card-body' });

        // If on quest, show quest progress
        const activeQuest = options.activeQuest;
        if (hero.state === HeroState.ON_QUEST && activeQuest) {
            // Quest name
            const questInfo = Utils.createElement('div', { className: 'hero-quest-info' });
            questInfo.innerHTML = `
                <div class="quest-name-small">${Utils.escapeHtml(activeQuest.template?.icon || '⚔️')} ${Utils.escapeHtml(activeQuest.name)}</div>
            `;
            body.appendChild(questInfo);

            // Quest progress bar
            const progressContainer = Utils.createElement('div', { className: 'quest-progress-container' });
            const progressBar = Utils.createElement('div', { className: 'quest-progress-bar' });
            const progressFill = Utils.createElement('div', {
                className: 'quest-progress-fill',
                dataset: { questId: activeQuest.id },
                style: `width: ${activeQuest.progressPercent}%`,
            });
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);

            const timeRemaining = Utils.createElement('div', {
                className: 'quest-time-remaining',
                dataset: { questId: activeQuest.id },
            }, Utils.formatTime(activeQuest.timeRemaining));
            progressContainer.appendChild(timeRemaining);
            body.appendChild(progressContainer);

            // HP Bar (real-time based on combat events)
            const combatResults = activeQuest.combatResults;
            const startHp = combatResults?.heroStartingHp ?? hero.maxHp;
            let displayHp = startHp;

            // Calculate HP from revealed events
            if (activeQuest.getCurrentEvents) {
                const events = activeQuest.getCurrentEvents();
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
            }

            const hpSection = Utils.createElement('div', {
                className: 'hero-card-hp',
                dataset: { heroId: hero.id, questId: activeQuest.id },
            });
            // Calculate effective maxHp with equipment bonus
            const hpBonus = options.equipmentBonuses?.hp || 0;
            const effectiveMaxHp = hero.maxHp + hpBonus;
            hpSection.appendChild(UI.createStatBar(displayHp, effectiveMaxHp, 'hp', hpBonus > 0 ? `+${hpBonus}` : null));
            body.appendChild(hpSection);
        } else {
            // Normal HP Bar with equipment bonus
            const hpBonus = options.equipmentBonuses?.hp || 0;
            const effectiveMaxHp = hero.maxHp + hpBonus;
            body.appendChild(UI.createStatBar(hero.currentHp, effectiveMaxHp, 'hp', hpBonus > 0 ? `+${hpBonus}` : null));

            // Passive healing indicator (when hero is available and not at full HP)
            if (hero.canPassiveHeal) {
                const healIndicator = Utils.createElement('div', { className: 'hero-healing-indicator' });
                const progress = hero.passiveHealProgress;
                const timeLeft = Math.ceil(hero.timeUntilNextHeal);

                healIndicator.innerHTML = `
                    <span>💚 Resting</span>
                    <div class="healing-progress-bar">
                        <div class="healing-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span>${timeLeft > 0 ? Utils.formatTime(timeLeft * 1000) : 'Ready'}</span>
                `;
                body.appendChild(healIndicator);
            }
        }

        // Stats with equipment bonuses
        const equipBonuses = options.equipmentBonuses;
        const hasBonuses = equipBonuses && Object.values(equipBonuses).some(v => v !== 0);
        body.appendChild(UI.createStatDisplay(hero.stats, hasBonuses ? equipBonuses : null));

        // Skills
        body.appendChild(UI.createSkillList(hero.skills));

        card.appendChild(body);

        // Footer with actions
        if (options.showActions && hero.isAvailable) {
            const footer = Utils.createElement('div', { className: 'card-footer' });

            const questBtn = UI.createButton('Send on Quest', 'primary', () => {
                if (options.onQuestClick) options.onQuestClick(hero);
            });
            footer.appendChild(questBtn);

            const detailBtn = UI.createButton('Details', 'secondary', () => {
                if (options.onDetailClick) options.onDetailClick(hero);
            });
            footer.appendChild(detailBtn);

            card.appendChild(footer);
        } else if (options.showActions && hero.state === HeroState.ON_QUEST) {
            // Show peek button for heroes on quest
            const footer = Utils.createElement('div', { className: 'card-footer' });
            const peekBtn = UI.createButton('View Quest', 'secondary', () => {
                if (options.onPeekClick && options.activeQuest) {
                    options.onPeekClick(options.activeQuest);
                }
            });
            footer.appendChild(peekBtn);
            card.appendChild(footer);
        }

        // Click handler for whole card
        if (options.onClick) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) {
                    options.onClick(hero);
                }
            });
        }

        return card;
    },

    /**
     * Render hero list to container (async to fetch equipment)
     */
    async renderList(container, heroes, options = {}) {
        // Increment version to invalidate any in-progress renders
        const thisRenderVersion = ++_heroCardRenderVersion;

        // Handle empty state
        if (heroes.length === 0) {
            container.innerHTML = '';
            container.appendChild(UI.createEmptyState(
                options.emptyMessage || 'No heroes yet. Visit the Tavern to recruit!'
            ));
            return;
        }

        // Fetch equipment bonuses for all heroes BEFORE clearing container (using cache)
        const heroEquipment = {};
        for (const hero of heroes) {
            try {
                const equippedItems = await GameState.getEquippedItems(hero.id);
                const bonuses = { atk: 0, will: 0, def: 0, spd: 0, hp: 0 };
                for (const item of equippedItems) {
                    const itemStats = item.totalStats;
                    for (const stat of ['atk', 'will', 'def', 'spd', 'hp']) {
                        if (itemStats[stat]) {
                            bonuses[stat] += itemStats[stat];
                        }
                    }
                }
                heroEquipment[hero.id] = bonuses;
            } catch (e) {
                heroEquipment[hero.id] = { atk: 0, will: 0, def: 0, spd: 0, hp: 0 };
            }
        }

        // Check if this render was superseded by a newer one
        if (thisRenderVersion !== _heroCardRenderVersion) {
            return; // Abort - a newer render is in progress
        }

        // Get active quests for heroes
        const heroQuests = {};
        if (GameState.activeQuests) {
            for (const quest of GameState.activeQuests) {
                if (quest.heroId) {
                    heroQuests[quest.heroId] = quest;
                }
            }
        }

        // Build all cards into a fragment first (off-screen)
        const fragment = document.createDocumentFragment();
        for (const hero of heroes) {
            const cardOptions = {
                ...options,
                equipmentBonuses: heroEquipment[hero.id],
                activeQuest: heroQuests[hero.id],
            };
            fragment.appendChild(this.create(hero, cardOptions));
        }

        // Final check before replacing content
        if (thisRenderVersion !== _heroCardRenderVersion) {
            return; // Abort - a newer render started
        }

        // Replace container content all at once (minimizes flash)
        container.innerHTML = '';
        container.appendChild(fragment);
    },
};

Object.freeze(HeroCard);
