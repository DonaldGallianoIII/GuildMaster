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
     */
    createStatBar(current, max, color = 'hp') {
        const percent = Math.max(0, Math.min(100, (current / max) * 100));
        const container = Utils.createElement('div', { className: 'hp-bar-container' });

        const bar = Utils.createElement('div', { className: 'hp-bar' });
        const fill = Utils.createElement('div', {
            className: 'hp-bar-fill',
            style: `width: ${percent}%; background: var(--stat-${color})`,
        });
        bar.appendChild(fill);

        const text = Utils.createElement('div', {
            className: 'hp-text',
        }, `${current} / ${max}`);

        container.appendChild(bar);
        container.appendChild(text);
        return container;
    },

    /**
     * Create stat display row
     */
    createStatDisplay(stats) {
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
            item.innerHTML = `
                <span class="stat-label">${statLabels[stat]}</span>
                <span class="stat-value">${stats[stat] || 0}</span>
            `;
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
