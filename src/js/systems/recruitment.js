/**
 * ============================================
 * GUILD MASTER - Recruitment System
 * ============================================
 * Handles the tavern and hiring mechanics
 * ============================================
 */

const RecruitmentSystem = {
    /**
     * Initialize recruitment UI
     */
    init() {
        this.bindEvents();
        this.render();

        // Listen for state changes
        GameState.on('recruitsRefreshed', () => this.render());
        GameState.on('heroHired', () => this.render());
    },

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-recruits');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                await GameState.refreshRecruits();
            });
        }
    },

    /**
     * Render recruit pool
     */
    render() {
        const container = document.getElementById('recruits-pool');
        if (!container) return;

        const recruits = GameState.recruits;
        container.innerHTML = '';

        if (recruits.length === 0) {
            container.appendChild(UI.createEmptyState(
                'No adventurers available. Check back later or scout for new recruits.'
            ));
            return;
        }

        for (const recruit of recruits) {
            container.appendChild(this.createRecruitCard(recruit));
        }
    },

    /**
     * Create a recruit card
     */
    createRecruitCard(recruit) {
        const card = Utils.createElement('div', {
            className: 'card recruit-card',
            dataset: { recruitId: recruit.id },
        });

        // Header
        const header = Utils.createElement('div', { className: 'card-header' });
        const headerContent = Utils.createElement('div', { className: 'hero-header' });

        headerContent.appendChild(UI.createPortrait(recruit.portraitId));

        const info = Utils.createElement('div', { className: 'hero-info' });
        info.innerHTML = `
            <div class="hero-name">${recruit.name}</div>
            <div class="hero-level">Seeking Employment</div>
        `;
        headerContent.appendChild(info);

        header.appendChild(headerContent);
        card.appendChild(header);

        // Body - skills
        const body = Utils.createElement('div', { className: 'card-body' });

        // Check for special rolls
        let specialNote = '';
        for (const skill of recruit.skills) {
            if (skill.isTripled) {
                specialNote = `<div style="color: var(--rarity-rare); font-weight: 600;">✨ Triple ${Skills.get(skill.skillId)?.name || skill.skillId}!</div>`;
                break;
            } else if (skill.isDoubled) {
                specialNote = `<div style="color: var(--rarity-magic);">⚔️ Double ${Skills.get(skill.skillId)?.name || skill.skillId}</div>`;
            }
        }

        if (specialNote) {
            body.innerHTML = specialNote;
        }

        body.appendChild(UI.createSkillList(recruit.skills));

        card.appendChild(body);

        // Footer
        const footer = Utils.createElement('div', { className: 'card-footer' });

        const costSpan = Utils.createElement('span', {
            className: 'hire-cost',
        }, `💰 ${recruit.hireCost}g`);
        footer.appendChild(costSpan);

        const hireBtn = UI.createButton('Hire', 'gold', () => {
            this.showHireModal(recruit);
        });
        footer.appendChild(hireBtn);

        card.appendChild(footer);

        return card;
    },

    /**
     * Show hire modal with stat allocation
     */
    showHireModal(recruit) {
        Modals.showStatAllocation(recruit, async (statAllocation) => {
            const hero = await GameState.hireRecruit(recruit, statAllocation);
            if (hero) {
                // Show success, maybe show the new hero detail
                Modals.showHeroDetail(hero);
            }
        });
    },
};

Object.freeze(RecruitmentSystem);
