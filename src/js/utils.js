/**
 * ============================================
 * GUILD MASTER - Utility Functions
 * ============================================
 * Common helper functions used throughout the game
 * ============================================
 */

const Utils = {
    // ==================== RANDOM ====================

    /**
     * Generate random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Pick random element from array
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Weighted random selection
     * @param {Object} weights - { option: weight, ... }
     * @returns {string} Selected option key
     *
     * Example:
     *   weightedRandom({ common: 60, rare: 10 }) => 'common' (usually)
     */
    weightedRandom(weights) {
        const entries = Object.entries(weights);
        const total = entries.reduce((sum, [_, w]) => sum + w, 0);
        let random = Math.random() * total;

        for (const [key, weight] of entries) {
            random -= weight;
            if (random <= 0) return key;
        }

        // Fallback (shouldn't happen)
        return entries[0][0];
    },

    /**
     * Shuffle array in place (Fisher-Yates)
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    // ==================== MATH ====================

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Round to specified decimal places
     */
    round(value, decimals = 0) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    },

    /**
     * Calculate percentage
     */
    percent(value, total) {
        if (total === 0) return 0;
        return (value / total) * 100;
    },

    // ==================== DAMAGE FORMULAS ====================
    // From design doc stat system update

    /**
     * Calculate physical damage
     * Formula: ATK² ÷ (ATK + target DEF)
     * Minimum: CONFIG.STATS.MIN_DAMAGE
     */
    calcPhysicalDamage(attackerATK, targetDEF) {
        if (attackerATK <= 0) return CONFIG.STATS.MIN_DAMAGE;
        const damage = Math.floor((attackerATK * attackerATK) / (attackerATK + targetDEF));
        return Math.max(damage, CONFIG.STATS.MIN_DAMAGE);
    },

    /**
     * Calculate magical damage
     * Formula: WILL² ÷ (WILL + target WILL ÷ 2)
     * Note: WILL provides half protection vs magic compared to DEF vs physical
     * Minimum: CONFIG.STATS.MIN_DAMAGE
     */
    calcMagicalDamage(attackerWILL, targetWILL) {
        if (attackerWILL <= 0) return CONFIG.STATS.MIN_DAMAGE;
        const effectiveResist = targetWILL / 2;
        const damage = Math.floor((attackerWILL * attackerWILL) / (attackerWILL + effectiveResist));
        return Math.max(damage, CONFIG.STATS.MIN_DAMAGE);
    },

    /**
     * Calculate hero HP
     * Formula: (Level × 20) + DEF
     */
    calcHP(level, def) {
        return (level * CONFIG.STATS.HP_PER_LEVEL) + def;
    },

    /**
     * Calculate BST (Base Stat Total) for a level
     * Formula: Level × 10
     */
    calcBST(level) {
        return level * CONFIG.STATS.BST_PER_LEVEL;
    },

    /**
     * Calculate summon HP
     * Formula: (Summon BST × 2) + Summon DEF
     */
    calcSummonHP(summonBST, summonDEF) {
        return (summonBST * CONFIG.SUMMONS.HP_PER_BST) + summonDEF;
    },

    // ==================== TIME ====================

    /**
     * Format milliseconds to MM:SS
     */
    formatTime(ms) {
        // Handle invalid values
        if (!Number.isFinite(ms) || ms < 0) {
            return '--:--';
        }
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    /**
     * Format milliseconds to human readable (e.g., "5 minutes")
     */
    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        const hours = Math.floor(minutes / 60);
        const remainingMins = minutes % 60;
        if (remainingMins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
        return `${hours}h ${remainingMins}m`;
    },

    /**
     * Get timestamp for database
     */
    now() {
        return new Date().toISOString();
    },

    // ==================== STRINGS ====================

    /**
     * Capitalize first letter
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Generate UUID v4
     */
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // ==================== DOM ====================

    /**
     * Query selector shorthand
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * Query selector all shorthand
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Create element with attributes and children
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Attributes to set
     * @param {Array|string} children - Child elements or text
     */
    createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);

        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'className') {
                el.className = value;
            } else if (key === 'dataset') {
                for (const [dataKey, dataValue] of Object.entries(value)) {
                    el.dataset[dataKey] = dataValue;
                }
            } else if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                el.setAttribute(key, value);
            }
        }

        if (typeof children === 'string') {
            el.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    el.appendChild(child);
                }
            });
        }

        return el;
    },

    /**
     * Show toast notification (queued, bottom-left)
     * @param {string} message - Message to display
     * @param {string} type - 'info' | 'success' | 'error' | 'warning'
     */
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = this.createElement('div', {
            className: `toast ${type}`,
        }, message);

        // Insert at beginning so newest appears at bottom (column-reverse)
        container.insertBefore(toast, container.firstChild);

        // Auto-remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-100%)';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.UI.TOAST_DURATION);
    },

    // ==================== VALIDATION ====================

    /**
     * Validate stat allocation totals to BST
     */
    validateStatAllocation(stats, level) {
        const total = stats.atk + stats.will + stats.def + stats.spd;
        const expected = this.calcBST(level);
        return total === expected;
    },

    // ==================== DEBUG ====================

    /**
     * Log only in debug mode
     */
    log(...args) {
        if (CONFIG.DEBUG) {
            console.log('[GuildMaster]', ...args);
        }
    },

    /**
     * Log error (always)
     */
    error(...args) {
        console.error('[GuildMaster ERROR]', ...args);
    },
};

// Freeze to prevent modification
Object.freeze(Utils);
