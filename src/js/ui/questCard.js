/**
 * ============================================
 * GUILD MASTER - Quest Card Component
 * ============================================
 * Renders quest cards for quest board and active quests
 * ============================================
 */

const QuestCard = {
    /**
     * Create danger rating bars (cell signal style)
     * @param {Quest} quest - The quest
     * @param {number} heroLevel - Highest hero level
     * @returns {HTMLElement}
     */
    createDangerRating(quest, heroLevel = 1) {
        const recLevel = quest.recommendedLevel || 1;
        const levelDiff = recLevel - heroLevel;

        // Calculate bars (1-4 based on level difference)
        let bars = 2; // Default: moderate
        if (levelDiff <= -2) bars = 1;      // Very easy
        else if (levelDiff <= 0) bars = 2;  // Easy
        else if (levelDiff <= 2) bars = 3;  // Hard
        else bars = 4;                       // Very hard

        const container = Utils.createElement('div', { className: 'danger-rating' });
        container.title = `Recommended: Lv ${recLevel}`;

        for (let i = 1; i <= 4; i++) {
            const bar = Utils.createElement('div', {
                className: `danger-bar ${i <= bars ? 'active' : ''} ${bars >= 3 ? 'warning' : ''} ${bars >= 4 ? 'danger' : ''}`,
            });
            container.appendChild(bar);
        }

        return container;
    },

    /**
     * Create tier badge
     */
    createTierBadge(tier) {
        const tierNames = { 1: 'I', 2: 'II', 3: 'III' };
        return Utils.createElement('span', {
            className: `tier-badge tier-${tier}`,
        }, tierNames[tier] || 'I');
    },

    /**
     * Create a quest board card (available quest)
     */
    createBoardCard(quest, options = {}) {
        const template = quest.template;
        if (!template) return null;

        const card = Utils.createElement('div', {
            className: 'card quest-card',
            dataset: { questId: quest.id || quest.templateId },
        });

        // Header
        const header = Utils.createElement('div', { className: 'card-header' });
        const headerContent = Utils.createElement('div', { className: 'quest-header' });

        const nameSection = Utils.createElement('div');
        nameSection.innerHTML = `
            <div class="quest-name">${Utils.escapeHtml(template.icon)} ${Utils.escapeHtml(quest.name)}</div>
            <div class="quest-duration">⏱️ ${Utils.formatDuration(quest.duration)}</div>
        `;
        headerContent.appendChild(nameSection);

        // Add danger rating (tier badge removed - tier is shown in accordion bar header)
        const badgeSection = Utils.createElement('div', { className: 'quest-badges' });
        const highestHeroLevel = options.heroLevel || 1;
        badgeSection.appendChild(this.createDangerRating(quest, highestHeroLevel));
        headerContent.appendChild(badgeSection);

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
        body.innerHTML = `<p style="color: var(--color-ink-faded); font-style: italic;">${Utils.escapeHtml(template.description)}</p>`;

        // Enemy preview (use quest.encounters which returns selectedEncounters)
        const enemies = Utils.createElement('div', { className: 'quest-enemies' });
        enemies.innerHTML = `<h4>Enemies</h4>`;
        const enemyList = Utils.createElement('div', { className: 'enemy-list' });

        // Get unique enemies from selected encounters with threat labels
        // Track both count and tier (tier comes from encounter.mobTiers, not mob definition)
        const mobData = {}; // { mobId: { count, tier } }
        for (const encounter of quest.encounters) {
            for (let i = 0; i < encounter.mobs.length; i++) {
                const mobId = encounter.mobs[i];
                const tier = encounter.mobTiers ? encounter.mobTiers[i] : null;
                if (!mobData[mobId]) {
                    mobData[mobId] = { count: 0, tier: tier };
                }
                mobData[mobId].count++;
                // Keep the tier from the first encounter (they should be consistent)
                if (!mobData[mobId].tier && tier) {
                    mobData[mobId].tier = tier;
                }
            }
        }

        for (const [mobId, data] of Object.entries(mobData)) {
            const mob = Quests.getMob(mobId);
            if (mob) {
                // Use tier from encounter data, fallback to mob.tier (for legacy mobs)
                const tier = data.tier || mob.tier;
                const threatLabel = tier && typeof getMobThreatLabel === 'function'
                    ? getMobThreatLabel(tier)
                    : '';
                const threatSuffix = threatLabel ? ` (${threatLabel})` : '';
                enemyList.appendChild(Utils.createElement('span', {
                    className: `enemy-tag threat-${(tier || '').split('_')[0]}`,
                }, `${mob.icon} ${mob.name} ×${data.count}${threatSuffix}`));
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
                <div class="quest-name">${Utils.escapeHtml(template?.icon || '⚔️')} ${Utils.escapeHtml(quest.name)}</div>
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
                        <strong>${Utils.escapeHtml(options.hero?.name || 'Hero')} has fallen!</strong>
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
     * Render quest board with vertical accordion and horizontal quest carousels
     */
    renderBoard(container, quests, options = {}) {
        container.innerHTML = '';

        if (quests.length === 0) {
            container.appendChild(UI.createEmptyState('No quests available.'));
            return;
        }

        // Define tiers with plus system naming
        const tiers = {
            'novice': { name: 'Novice', order: 1 },
            'novice_plus': { name: 'Novice+', order: 2 },
            'novice_plus2': { name: 'Novice++', order: 3 },
            'novice_plus3': { name: 'Novice+++', order: 4 },
            'intermediate': { name: 'Intermediate', order: 5 },
            'intermediate_plus': { name: 'Intermediate+', order: 6 },
            'intermediate_plus2': { name: 'Intermediate++', order: 7 },
            'intermediate_plus3': { name: 'Intermediate+++', order: 8 },
            'expert': { name: 'Expert', order: 9 },
        };

        // Map old bracket/tier combo to new tier system
        const mapQuestToTier = (quest) => {
            const bracket = quest.bracket || 'novice';
            const tier = quest.tier || 1;

            if (bracket === 'novice') {
                if (tier === 1) return 'novice';
                if (tier === 2) return 'novice_plus';
                if (tier === 3) return 'novice_plus2';
            } else if (bracket === 'journeyman') {
                if (tier === 1) return 'novice_plus3';
                if (tier === 2) return 'intermediate';
                if (tier === 3) return 'intermediate_plus';
            } else if (bracket === 'expert') {
                if (tier === 1) return 'intermediate_plus2';
                if (tier === 2) return 'intermediate_plus3';
                if (tier === 3) return 'expert';
            }
            return 'novice';
        };

        // Group quests by tier
        const tierGroups = {};
        for (const tierId of Object.keys(tiers)) {
            tierGroups[tierId] = [];
        }

        for (const quest of quests) {
            const tierId = mapQuestToTier(quest);
            if (tierGroups[tierId]) {
                tierGroups[tierId].push(quest);
            }
        }

        // Get highest hero level for danger rating
        const highestHeroLevel = options.heroLevel || 1;

        // Create accordion wrapper
        const accordion = Utils.createElement('div', {
            className: 'quest-tier-accordion',
        });

        // Create tier bars in order
        const sortedTiers = Object.entries(tiers).sort((a, b) => a[1].order - b[1].order);

        for (const [tierId, tierInfo] of sortedTiers) {
            const tierQuests = tierGroups[tierId];

            // Skip empty tiers
            if (tierQuests.length === 0) continue;

            const tierBar = Utils.createElement('div', {
                className: 'tier-bar',
                dataset: { tier: tierId },
            });

            // Tier header (clickable)
            const header = Utils.createElement('div', {
                className: 'tier-bar-header',
            });
            header.innerHTML = `
                <span class="tier-bar-name">${Utils.escapeHtml(tierInfo.name)}</span>
                <span class="tier-bar-count"><span>${tierQuests.length} contracts</span></span>
                <span class="tier-bar-arrow">▶</span>
            `;

            // Click to expand/collapse (accordion - only one open)
            header.addEventListener('click', () => {
                const wasExpanded = tierBar.classList.contains('expanded');

                // Close all other tiers
                accordion.querySelectorAll('.tier-bar.expanded').forEach(bar => {
                    bar.classList.remove('expanded');
                    bar.querySelector('.tier-bar-arrow').textContent = '▶';
                });

                // Toggle this one
                if (!wasExpanded) {
                    tierBar.classList.add('expanded');
                    header.querySelector('.tier-bar-arrow').textContent = '▼';
                }
            });

            tierBar.appendChild(header);

            // Quest carousel (horizontal scroll)
            const carousel = Utils.createElement('div', {
                className: 'tier-quest-carousel',
            });

            const carouselTrack = Utils.createElement('div', {
                className: 'carousel-track',
            });

            for (const quest of tierQuests) {
                const card = this.createBoardCard(quest, { ...options, heroLevel: highestHeroLevel });
                if (card) {
                    card.classList.add('carousel-card');
                    carouselTrack.appendChild(card);
                }
            }

            carousel.appendChild(carouselTrack);
            tierBar.appendChild(carousel);
            accordion.appendChild(tierBar);
        }

        container.appendChild(accordion);
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
