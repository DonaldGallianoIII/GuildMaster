/**
 * ============================================
 * GUILD MASTER - UI Components
 * ============================================
 * Reusable UI component builders
 * ============================================
 */

const UI = {
    // ==================== STAT DISPLAY ====================

    /**
     * Create stat bar display
     * @param {number} current - Current value
     * @param {number} max - Maximum value
     * @param {string} color - Color theme ('hp', etc.)
     * @param {string} bonusText - Optional bonus indicator (e.g., "+10")
     */
    createStatBar(current, max, color = 'hp', bonusText = null) {
        const percent = Math.max(0, Math.min(100, (current / max) * 100));
        const container = Utils.createElement('div', { className: 'hp-bar-container' });

        const bar = Utils.createElement('div', { className: 'hp-bar' });
        const fill = Utils.createElement('div', {
            className: 'hp-bar-fill',
            style: `width: ${percent}%; background: var(--stat-${color})`,
        });
        bar.appendChild(fill);

        // Show bonus if provided
        const displayText = bonusText
            ? `${current} / ${max} <span class="stat-bonus-positive">(${bonusText})</span>`
            : `${current} / ${max}`;

        const text = Utils.createElement('div', {
            className: 'hp-text',
        });
        text.innerHTML = displayText;

        container.appendChild(bar);
        container.appendChild(text);
        return container;
    },

    /**
     * Create stat display row
     * @param {Object} stats - Base stats { atk, will, def, spd }
     * @param {Object} bonuses - Optional equipment bonuses { atk, will, def, spd }
     */
    createStatDisplay(stats, bonuses = null) {
        const container = Utils.createElement('div', { className: 'hero-stats' });

        const statOrder = ['atk', 'will', 'def', 'spd'];
        const statLabels = {
            atk: 'ATK',
            will: 'WILL',
            def: 'DEF',
            spd: 'SPD',
        };

        for (const stat of statOrder) {
            const item = Utils.createElement('div', {
                className: `stat-item stat-${stat}`,
            });

            const baseValue = stats[stat] || 0;
            const bonusValue = bonuses ? (bonuses[stat] || 0) : 0;
            const totalValue = baseValue + bonusValue;

            if (bonuses && bonusValue !== 0) {
                // Show total with bonus indicator
                const bonusClass = bonusValue > 0 ? 'stat-bonus-positive' : 'stat-bonus-negative';
                const bonusSign = bonusValue > 0 ? '+' : '';
                item.innerHTML = `
                    <span class="stat-label">${statLabels[stat]}</span>
                    <span class="stat-value">
                        ${totalValue}
                        <span class="${bonusClass}">(${bonusSign}${bonusValue})</span>
                    </span>
                `;
            } else {
                item.innerHTML = `
                    <span class="stat-label">${statLabels[stat]}</span>
                    <span class="stat-value">${baseValue}</span>
                `;
            }
            container.appendChild(item);
        }

        return container;
    },

    // ==================== SKILL DISPLAY ====================

    /**
     * Create skill tag
     */
    createSkillTag(skillRef) {
        const skillId = typeof skillRef === 'string' ? skillRef : skillRef.skillId;
        const skillDef = Skills.get(skillId);
        if (!skillDef) return null;

        const rank = skillRef.rank || 1;
        const isDoubled = skillRef.isDoubled || false;
        const isTripled = skillRef.isTripled || false;

        let className = 'skill-tag';
        if (isTripled) className += ' tripled';
        else if (isDoubled) className += ' doubled';

        const maxRank = Skills.getMaxRank(isDoubled, isTripled);
        const multiplier = isTripled ? '³' : isDoubled ? '²' : '';

        return Utils.createElement('span', {
            className,
            title: `${skillDef.description}\nRank: ${rank}/${maxRank}`,
        }, `${skillDef.icon} ${skillDef.name}${multiplier}`);
    },

    /**
     * Create skill list
     */
    createSkillList(skills) {
        const container = Utils.createElement('div', { className: 'hero-skills' });
        for (const skill of skills) {
            const tag = this.createSkillTag(skill);
            if (tag) container.appendChild(tag);
        }
        return container;
    },

    // ==================== STATUS BADGE ====================

    /**
     * Create status badge
     */
    createStatusBadge(state) {
        const labels = {
            [HeroState.AVAILABLE]: 'Ready',
            [HeroState.ON_QUEST]: 'On Quest',
            [HeroState.INJURED]: 'Injured',
            [HeroState.RETIRED]: 'Retired',
            [HeroState.DEAD]: 'Dead',
        };

        const classMap = {
            [HeroState.AVAILABLE]: 'status-available',
            [HeroState.ON_QUEST]: 'status-quest',
            [HeroState.INJURED]: 'status-injured',
            [HeroState.RETIRED]: 'status-retired',
            [HeroState.DEAD]: 'status-injured',
        };

        return Utils.createElement('span', {
            className: `status-badge ${classMap[state] || ''}`,
        }, labels[state] || state);
    },

    // ==================== PROGRESS BAR ====================

    /**
     * Create progress bar (for quests)
     */
    createProgressBar(percent, timeText = '') {
        const container = Utils.createElement('div', { className: 'quest-progress-container' });

        const bar = Utils.createElement('div', { className: 'quest-progress-bar' });
        const fill = Utils.createElement('div', {
            className: 'quest-progress-fill',
            style: `width: ${percent}%`,
        });
        bar.appendChild(fill);

        const text = Utils.createElement('div', {
            className: 'quest-time-remaining',
        }, timeText);

        container.appendChild(bar);
        container.appendChild(text);
        return container;
    },

    // ==================== DIFFICULTY BADGE ====================

    /**
     * Create difficulty badge
     */
    createDifficultyBadge(difficulty) {
        const classMap = {
            [QuestDifficulty.EASY]: 'difficulty-easy',
            [QuestDifficulty.MEDIUM]: 'difficulty-medium',
            [QuestDifficulty.HARD]: 'difficulty-hard',
        };

        return Utils.createElement('span', {
            className: `quest-difficulty ${classMap[difficulty] || ''}`,
        }, Utils.capitalize(difficulty));
    },

    // ==================== RARITY STYLING ====================

    /**
     * Get rarity class
     */
    getRarityClass(rarity) {
        return `rarity-${rarity}`;
    },

    // ==================== BUTTONS ====================

    /**
     * Create button
     */
    createButton(text, type = 'primary', onClick = null) {
        const btn = Utils.createElement('button', {
            className: `btn btn-${type}`,
        }, text);

        if (onClick) {
            btn.addEventListener('click', onClick);
        }

        return btn;
    },

    // ==================== PORTRAITS ====================

    /**
     * Create hero portrait
     * TODO: Replace emoji placeholders with actual images
     */
    createPortrait(portraitId = 0) {
        const portraits = [
            '⚔️', '🛡️', '🏹', '🔮', '💀', '🐉', '👑', '🦁', '🐺', '🦅',
            '🔥', '❄️', '⚡', '🌙', '☀️', '🗡️', '🪓', '🔨', '✨', '💎',
        ];

        return Utils.createElement('div', {
            className: 'hero-portrait',
        }, portraits[portraitId % portraits.length]);
    },

    // ==================== EMPTY STATES ====================

    /**
     * Create empty state message
     */
    createEmptyState(message) {
        return Utils.createElement('div', {
            className: 'empty-state',
        }, [Utils.createElement('p', {}, message)]);
    },

    // ==================== LOADING ====================

    /**
     * Create loading spinner
     */
    createLoading() {
        const container = Utils.createElement('div', { className: 'loading' });
        const spinner = Utils.createElement('div', { className: 'loading-spinner' });
        container.appendChild(spinner);
        return container;
    },
};

Object.freeze(UI);
