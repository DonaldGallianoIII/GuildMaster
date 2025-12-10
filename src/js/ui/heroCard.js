/**
 * ============================================
 * GUILD MASTER - Hero Card Component
 * ============================================
 * Renders hero cards for the roster view
 * ============================================
 */

const HeroCard = {
    /**
     * Create a hero card element
     * @param {Hero} hero
     * @param {Object} options
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
            <div class="hero-name">${hero.name}</div>
            <div class="hero-level">Level ${hero.level}</div>
        `;
        headerContent.appendChild(info);

        header.appendChild(headerContent);
        card.appendChild(header);

        // Body
        const body = Utils.createElement('div', { className: 'card-body' });

        // HP Bar
        body.appendChild(UI.createStatBar(hero.currentHp, hero.maxHp, 'hp'));

        // Stats
        body.appendChild(UI.createStatDisplay(hero.stats));

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
     * Render hero list to container
     */
    renderList(container, heroes, options = {}) {
        container.innerHTML = '';

        if (heroes.length === 0) {
            container.appendChild(UI.createEmptyState(
                options.emptyMessage || 'No heroes yet. Visit the Tavern to recruit!'
            ));
            return;
        }

        for (const hero of heroes) {
            container.appendChild(this.create(hero, options));
        }
    },
};

Object.freeze(HeroCard);
