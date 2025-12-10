/**
 * ============================================
 * GUILD MASTER - Quest Card Component
 * ============================================
 * Renders quest cards for quest board and active quests
 * ============================================
 */

const QuestCard = {
    /**
     * Create a quest board card (available quest)
     */
    createBoardCard(quest, options = {}) {
        const template = quest.template;
        if (!template) return null;

        const card = Utils.createElement('div', {
            className: 'card quest-card',
            dataset: { questId: quest.templateId },
        });

        // Header
        const header = Utils.createElement('div', { className: 'card-header' });
        const headerContent = Utils.createElement('div', { className: 'quest-header' });

        const nameSection = Utils.createElement('div');
        nameSection.innerHTML = `
            <div class="quest-name">${template.icon} ${template.name}</div>
            <div class="quest-duration">⏱️ ${Utils.formatDuration(template.duration)}</div>
        `;
        headerContent.appendChild(nameSection);

        headerContent.appendChild(UI.createDifficultyBadge(template.difficulty));

        header.appendChild(headerContent);
        card.appendChild(header);

        // Expiration timer bar
        const expirationSection = Utils.createElement('div', { className: 'quest-expiration' });
        const expirationTime = Utils.formatTime(quest.expirationTimeRemaining);
        expirationSection.innerHTML = `
            <span class="expiration-label">⏰ Expires in:</span>
            <span class="expiration-time" data-quest-id="${quest.templateId}">${expirationTime}</span>
        `;
        card.appendChild(expirationSection);

        // Body
        const body = Utils.createElement('div', { className: 'card-body' });

        // Description
        body.innerHTML = `<p style="color: var(--color-ink-faded); font-style: italic;">${template.description}</p>`;

        // Enemy preview (use quest.encounters which returns selectedEncounters)
        const enemies = Utils.createElement('div', { className: 'quest-enemies' });
        enemies.innerHTML = `<h4>Enemies</h4>`;
        const enemyList = Utils.createElement('div', { className: 'enemy-list' });

        // Get unique enemies from selected encounters
        const mobCounts = {};
        for (const encounter of quest.encounters) {
            for (const mobId of encounter.mobs) {
                mobCounts[mobId] = (mobCounts[mobId] || 0) + 1;
            }
        }

        for (const [mobId, count] of Object.entries(mobCounts)) {
            const mob = Quests.getMob(mobId);
            if (mob) {
                enemyList.appendChild(Utils.createElement('span', {
                    className: 'enemy-tag',
                }, `${mob.icon} ${mob.name} ×${count}`));
            }
        }
        enemies.appendChild(enemyList);
        body.appendChild(enemies);

        // Rewards preview (use quest.rewards which gets from CONFIG based on difficulty)
        const questRewards = quest.rewards;
        const rewards = Utils.createElement('div', { className: 'quest-rewards' });
        rewards.innerHTML = `
            <span>💰 ${questRewards.gold.min}-${questRewards.gold.max}g</span>
            <span>✨ ${questRewards.xp} XP</span>
        `;
        body.appendChild(rewards);

        card.appendChild(body);

        // Footer
        const footer = Utils.createElement('div', { className: 'card-footer' });
        const startBtn = UI.createButton('Accept Contract', 'gold', () => {
            if (options.onAccept) options.onAccept(quest);
        });
        footer.appendChild(startBtn);
        card.appendChild(footer);

        return card;
    },

    /**
     * Create an active quest card (with peek)
     */
    createActiveCard(quest, options = {}) {
        // Check if hero was defeated (pre-calculated combat failed)
        const heroDefeated = quest.heroDefeated;

        const card = Utils.createElement('div', {
            className: `card active-quest-card ${heroDefeated ? 'quest-failed' : ''}`,
            dataset: { questId: quest.id },
        });

        // Event icons container (for flying icons)
        const eventIcons = Utils.createElement('div', { className: 'event-icons' });
        card.appendChild(eventIcons);

        // Header
        const header = Utils.createElement('div', { className: 'card-header' });
        const template = quest.template;

        header.innerHTML = `
            <div class="quest-header">
                <div class="quest-name">${template?.icon || '⚔️'} ${quest.name}</div>
                ${heroDefeated
                    ? '<span class="quest-failed-badge">💀 FAILED</span>'
                    : UI.createDifficultyBadge(quest.difficulty).outerHTML
                }
            </div>
        `;
        card.appendChild(header);

        // Body
        const body = Utils.createElement('div', { className: 'card-body' });

        if (heroDefeated) {
            // Show failed state
            const failedArea = Utils.createElement('div', {
                className: 'quest-failed-area',
            });
            failedArea.innerHTML = `
                <div class="failed-message">
                    <span class="failed-icon">💀</span>
                    <div class="failed-text">
                        <strong>${options.hero?.name || 'Hero'} has fallen!</strong>
                        <p>The quest has ended in defeat.</p>
                    </div>
                </div>
            `;
            body.appendChild(failedArea);
        } else {
            // Progress bar (only show if not defeated)
            const progressBar = UI.createProgressBar(
                quest.progressPercent,
                Utils.formatTime(quest.timeRemaining)
            );
            body.appendChild(progressBar);

            // Peek area
            const peekArea = Utils.createElement('div', {
                className: 'quest-peek-area',
                dataset: { questId: quest.id },
            });
            peekArea.innerHTML = `
                <div class="peek-status">Adventuring...</div>
            `;
            body.appendChild(peekArea);

            // Hero HP (calculated based on revealed combat events)
            if (options.hero) {
                const hpSection = Utils.createElement('div', {
                    className: 'peek-hero-hp',
                    dataset: { questId: quest.id, heroId: options.hero.id },
                });

                // Calculate current HP from revealed damage events
                const combatResults = quest.combatResults;
                const startHp = combatResults?.heroStartingHp ?? options.hero.maxHp;
                let displayHp = startHp;

                // Process revealed events to calculate HP
                if (quest.getCurrentEvents) {
                    const events = quest.getCurrentEvents();
                    for (const event of events) {
                        if (event.type === 'combat_action' && event.data) {
                            if (!event.data.actorIsHero && event.data.damage) {
                                displayHp = Math.max(0, displayHp - event.data.damage);
                            }
                            if (event.data.actorIsHero && event.data.healing) {
                                displayHp = Math.min(options.hero.maxHp, displayHp + event.data.healing);
                            }
                        }
                    }
                }

                hpSection.appendChild(UI.createStatBar(
                    displayHp,
                    options.hero.maxHp,
                    'hp'
                ));
                body.appendChild(hpSection);
            }
        }

        card.appendChild(body);

        // Footer
        const footer = Utils.createElement('div', { className: 'card-footer' });

        if (heroDefeated) {
            // Show "View Results" button for failed quests
            const resultsBtn = UI.createButton('View Results', 'primary', () => {
                if (options.onViewResults) options.onViewResults(quest);
            });
            footer.appendChild(resultsBtn);
        } else {
            const peekBtn = UI.createButton('Peek', 'secondary', () => {
                if (options.onPeek) options.onPeek(quest);
            });
            footer.appendChild(peekBtn);
        }

        card.appendChild(footer);

        return card;
    },

    /**
     * Render quest board
     */
    renderBoard(container, quests, options = {}) {
        container.innerHTML = '';

        if (quests.length === 0) {
            container.appendChild(UI.createEmptyState('No quests available.'));
            return;
        }

        for (const quest of quests) {
            const card = this.createBoardCard(quest, options);
            if (card) container.appendChild(card);
        }
    },

    /**
     * Render active quests
     */
    renderActive(container, quests, options = {}) {
        container.innerHTML = '';

        if (quests.length === 0) {
            container.appendChild(UI.createEmptyState('No active quests. Send a hero!'));
            return;
        }

        for (const quest of quests) {
            const hero = options.getHero ? options.getHero(quest.heroId) : null;
            const card = this.createActiveCard(quest, { ...options, hero });
            container.appendChild(card);
        }
    },
};

Object.freeze(QuestCard);
