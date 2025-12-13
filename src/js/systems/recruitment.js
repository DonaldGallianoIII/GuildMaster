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
     * Flow: Show all 3 skills -> duplicates smash together -> roll more if needed
     */
    async animateSkillReveal(recruit, container, noteContainer, specialNote) {
        const rollWaves = recruit.skillRollWaves;
        if (!rollWaves || rollWaves.length === 0) {
            container.appendChild(UI.createSkillList(recruit.skills));
            if (specialNote) noteContainer.innerHTML = specialNote;
            return;
        }

        const FADE_DURATION = 300;
        const MERGE_DURATION = 500;
        const WAVE_DELAY = 400;

        // Track all skill elements by skillId
        const skillElements = {}; // { skillId: [element1, element2, ...] }
        const finalSkills = {};   // { skillId: stackCount }

        for (let waveIndex = 0; waveIndex < rollWaves.length; waveIndex++) {
            const wave = rollWaves[waveIndex];

            // STEP 1: Show ALL rolled skills fading in (including duplicates)
            const waveElements = [];
            for (const skillId of wave.rolled) {
                const skillDef = Skills.get(skillId);
                if (!skillDef) continue;

                const element = this.createAnimatedSkillTag(skillDef, 1);
                element.classList.add('skill-reveal');
                element.dataset.skillId = skillId;
                container.appendChild(element);
                waveElements.push({ skillId, element });

                // Track all elements for this skill
                if (!skillElements[skillId]) {
                    skillElements[skillId] = [];
                }
                skillElements[skillId].push(element);
            }

            // Wait for all to fade in
            await this.sleep(FADE_DURATION + 100);

            // Remove reveal class
            waveElements.forEach(({ element }) => element.classList.remove('skill-reveal'));

            // STEP 2: Merge duplicates (smash together)
            for (const merge of wave.merges) {
                const elements = skillElements[merge.skillId];
                if (!elements || elements.length < 2) continue;

                const skillDef = Skills.get(merge.skillId);
                if (!skillDef) continue;

                // Keep the first element as the target
                const target = elements[0];
                const duplicates = elements.slice(1);

                // Get target position
                const targetRect = target.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const targetX = targetRect.left - containerRect.left;
                const targetY = targetRect.top - containerRect.top;

                // Animate duplicates flying into target
                target.classList.add('skill-merge-target');

                for (const dup of duplicates) {
                    const dupRect = dup.getBoundingClientRect();
                    const startX = dupRect.left - containerRect.left;
                    const startY = dupRect.top - containerRect.top;

                    // Convert to absolute positioning for animation
                    dup.style.cssText = `
                        position: absolute;
                        left: ${startX}px;
                        top: ${startY}px;
                        z-index: 10;
                        transition: all ${MERGE_DURATION}ms ease-in;
                    `;

                    // Force reflow
                    dup.offsetHeight;

                    // Animate toward target
                    dup.style.left = `${targetX}px`;
                    dup.style.top = `${targetY}px`;
                    dup.style.opacity = '0';
                    dup.style.transform = 'scale(0.3)';
                }

                await this.sleep(MERGE_DURATION);

                // Remove duplicates
                duplicates.forEach(dup => dup.remove());

                // Update target to show new stack
                const multiplier = merge.toStack >= 3 ? '³' : '²';
                target.textContent = `${skillDef.icon} ${skillDef.name}${multiplier}`;
                target.classList.remove('skill-merge-target');
                target.classList.add(merge.toStack >= 3 ? 'tripled' : 'doubled');
                target.classList.add('skill-merged');

                // Update tracking - only keep the merged element
                skillElements[merge.skillId] = [target];
                finalSkills[merge.skillId] = merge.toStack;

                await this.sleep(300);
                target.classList.remove('skill-merged');
            }

            // Track new skills that didn't merge
            for (const skillId of wave.newSkills) {
                if (!finalSkills[skillId]) {
                    finalSkills[skillId] = 1;
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
