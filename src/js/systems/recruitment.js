/**
 * ============================================
 * GUILD MASTER - Recruitment System
 * ============================================
 * Handles the tavern and hiring mechanics
 * ============================================
 */

const RecruitmentSystem = {
    // Track which recruits have already played their animation
    _animatedRecruits: new Set(),

    /**
     * Initialize recruitment UI
     */
    init() {
        this.bindEvents();
        this.render();

        // Listen for state changes
        GameState.on('recruitsRefreshed', () => {
            this._animatedRecruits.clear();  // Reset animations on refresh
            this.render();
        });
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

        // Body - skills with animation container
        const body = Utils.createElement('div', { className: 'card-body' });

        // Check for special rolls using stackCount
        let specialNote = '';
        for (const skill of recruit.skills) {
            if (skill.stackCount >= 3) {
                specialNote = `<div class="skill-special-note tripled">✨ Triple ${Skills.get(skill.skillId)?.name || skill.skillId}!</div>`;
                break;
            } else if (skill.stackCount >= 2) {
                if (!specialNote) {
                    specialNote = `<div class="skill-special-note doubled">⚔️ Double ${Skills.get(skill.skillId)?.name || skill.skillId}</div>`;
                }
            }
        }

        // Container for animated skill reveal
        const skillContainer = Utils.createElement('div', {
            className: 'skill-reveal-container',
            dataset: { recruitId: recruit.id },
        });
        body.appendChild(skillContainer);

        // Special note will be shown after animation
        const noteContainer = Utils.createElement('div', { className: 'skill-special-container' });
        body.appendChild(noteContainer);

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

        // Trigger animation after card is in DOM
        const shouldAnimate = !this._animatedRecruits.has(recruit.id);
        if (shouldAnimate && recruit.skillRollWaves) {
            this._animatedRecruits.add(recruit.id);
            // Use requestAnimationFrame to ensure card is rendered
            requestAnimationFrame(() => {
                this.animateSkillReveal(recruit, skillContainer, noteContainer, specialNote);
            });
        } else {
            // No animation - just show final skills immediately
            skillContainer.appendChild(UI.createSkillList(recruit.skills));
            if (specialNote) {
                noteContainer.innerHTML = specialNote;
            }
        }

        return card;
    },

    /**
     * Animate skill reveal with collision/merge effects
     */
    async animateSkillReveal(recruit, container, noteContainer, specialNote) {
        const rollWaves = recruit.skillRollWaves;
        if (!rollWaves || rollWaves.length === 0) {
            container.appendChild(UI.createSkillList(recruit.skills));
            if (specialNote) noteContainer.innerHTML = specialNote;
            return;
        }

        // Track current skill state for animation
        const currentSkills = {}; // { skillId: { element, stackCount } }
        const FADE_DURATION = 400;
        const MERGE_DURATION = 500;
        const WAVE_DELAY = 300;

        for (let waveIndex = 0; waveIndex < rollWaves.length; waveIndex++) {
            const wave = rollWaves[waveIndex];

            // Process each rolled skill in this wave
            for (let i = 0; i < wave.rolled.length; i++) {
                const skillId = wave.rolled[i];
                const skillDef = Skills.get(skillId);
                if (!skillDef) continue;

                // Check if this is a merge or new skill
                const isMerge = wave.merges.some(m => m.skillId === skillId);

                if (isMerge) {
                    // MERGE ANIMATION: Show incoming skill, then collide with existing
                    const merge = wave.merges.find(m => m.skillId === skillId);
                    const existingData = currentSkills[skillId];

                    if (existingData) {
                        // Create incoming skill element
                        const incoming = this.createAnimatedSkillTag(skillDef, 1);
                        incoming.classList.add('skill-incoming');
                        container.appendChild(incoming);

                        // Wait for fade in
                        await this.sleep(FADE_DURATION);

                        // Trigger merge animation
                        incoming.classList.add('skill-merging');
                        existingData.element.classList.add('skill-merge-target');

                        await this.sleep(MERGE_DURATION / 2);

                        // Remove incoming, update existing to new stack
                        incoming.remove();
                        existingData.stackCount = merge.toStack;

                        // Update the element with new stack count
                        const multiplier = merge.toStack >= 3 ? '³' : '²';
                        existingData.element.textContent = `${skillDef.icon} ${skillDef.name}${multiplier}`;
                        existingData.element.classList.remove('doubled', 'tripled');
                        existingData.element.classList.add(merge.toStack >= 3 ? 'tripled' : 'doubled');
                        existingData.element.classList.remove('skill-merge-target');
                        existingData.element.classList.add('skill-merged');

                        await this.sleep(MERGE_DURATION / 2);
                        existingData.element.classList.remove('skill-merged');
                    }
                } else if (wave.newSkills.includes(skillId)) {
                    // NEW SKILL: Fade in
                    const element = this.createAnimatedSkillTag(skillDef, 1);
                    element.classList.add('skill-reveal');
                    container.appendChild(element);

                    currentSkills[skillId] = { element, stackCount: 1 };

                    // Stagger reveals slightly
                    await this.sleep(FADE_DURATION + 100);
                    element.classList.remove('skill-reveal');
                }
            }

            // Delay between waves
            if (waveIndex < rollWaves.length - 1) {
                await this.sleep(WAVE_DELAY);
            }
        }

        // Show special note after animation completes
        if (specialNote) {
            await this.sleep(200);
            noteContainer.innerHTML = specialNote;
            noteContainer.classList.add('note-reveal');
        }
    },

    /**
     * Create a skill tag element for animation
     */
    createAnimatedSkillTag(skillDef, stackCount = 1) {
        let className = 'skill-tag';
        if (stackCount >= 3) className += ' tripled';
        else if (stackCount >= 2) className += ' doubled';

        const multiplier = stackCount >= 3 ? '³' : stackCount >= 2 ? '²' : '';

        return Utils.createElement('span', {
            className,
            title: skillDef.description,
        }, `${skillDef.icon} ${skillDef.name}${multiplier}`);
    },

    /**
     * Sleep helper for animations
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
