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

        // Body
        const body = Utils.createElement('div', { className: 'card-body' });

        // Description
        body.innerHTML = `<p style="color: var(--color-ink-faded); font-style: italic;">${template.description}</p>`;

        // Enemy preview
        const enemies = Utils.createElement('div', { className: 'quest-enemies' });
        enemies.innerHTML = `<h4>Enemies</h4>`;
        const enemyList = Utils.createElement('div', { className: 'enemy-list' });

        // Get unique enemies
        const mobCounts = {};
        for (const encounter of template.encounters) {
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

        // Rewards preview
        const rewards = Utils.createElement('div', { className: 'quest-rewards' });
        rewards.innerHTML = `
            <span>💰 ${template.rewards.gold.min}-${template.rewards.gold.max}g</span>
            <span>✨ ${template.rewards.xp} XP</span>
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
        const card = Utils.createElement('div', {
            className: 'card active-quest-card',
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
                ${UI.createDifficultyBadge(quest.difficulty).outerHTML}
            </div>
        `;
        card.appendChild(header);

        // Body
        const body = Utils.createElement('div', { className: 'card-body' });

        // Progress bar
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

        // Hero HP (calculated based on quest progress)
        if (options.hero) {
            const hpSection = Utils.createElement('div', {
                className: 'peek-hero-hp',
                dataset: { questId: quest.id, heroId: options.hero.id },
            });

            // Calculate current HP based on progress through combat
            let displayHp = options.hero.currentHp;
            const combatResults = quest.combatResults;
            if (combatResults) {
                const startHp = combatResults.heroStartingHp ?? options.hero.maxHp;
                const endHp = combatResults.heroFinalHp ?? options.hero.currentHp;
                const progress = quest.progressPercent / 100;
                displayHp = Math.round(startHp + ((endHp - startHp) * progress));
                displayHp = Math.max(0, Math.min(options.hero.maxHp, displayHp));
            }

            hpSection.appendChild(UI.createStatBar(
                displayHp,
                options.hero.maxHp,
                'hp'
            ));
            body.appendChild(hpSection);
        }

        card.appendChild(body);

        // Footer
        const footer = Utils.createElement('div', { className: 'card-footer' });
        const peekBtn = UI.createButton('Peek', 'secondary', () => {
            if (options.onPeek) options.onPeek(quest);
        });
        footer.appendChild(peekBtn);
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
