/**
 * ============================================
 * GUILD MASTER - Hero Model
 * ============================================
 * Hero data structure and methods
 *
 * STAT SYSTEM (balance update v2):
 * - BST = Level × 20 (distributed across 4 stats)
 * - HP = (Level × 40) + DEF
 * - Stats: ATK, WILL, DEF, SPD
 *
 * Heroes are recruited with 3 skills and start at level 1.
 * Player allocates their 20 BST at recruitment.
 * ============================================
 */

/**
 * Hero states
 * @readonly
 * @enum {string}
 */
const HeroState = {
    AVAILABLE: 'available',
    ON_QUEST: 'quest',
    INJURED: 'injured',
    RETIRED: 'retired',
    DEAD: 'dead',
};

Object.freeze(HeroState);

/**
 * Hero class
 * Represents a single hero in the guild
 */
class Hero {
    /**
     * Create a new Hero
     * @param {Object} data - Hero data from database or generation
     */
    constructor(data = {}) {
        // Identity
        this.id = data.id || Utils.uuid();
        this.userId = data.userId || data.user_id || null;
        this.name = data.name || 'Unknown Hero';
        this.portraitId = data.portraitId || data.portrait_id || 0;

        // Level & XP
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.skillPoints = data.skillPoints || data.skill_points || 0;

        // Stats (BST allocated by player)
        // NOTE: These are the allocated values, not derived from gear
        this.stats = {
            atk: data.stats?.atk ?? data.atk ?? 0,
            will: data.stats?.will ?? data.will ?? 0,
            def: data.stats?.def ?? data.def ?? 0,
            spd: data.stats?.spd ?? data.spd ?? 0,
        };

        // Current HP (may be less than max if damaged)
        this._currentHp = data.currentHp ?? data.current_hp ?? null;

        // HP bonus from equipment (updated when gear changes)
        this.hpBonus = data.hpBonus ?? data.hp_bonus ?? 0;

        // Skills array - each skill has { skillId, rank, isDoubled, isTripled }
        this.skills = data.skills || [];

        // State
        this.state = data.state || HeroState.AVAILABLE;

        // Quest tracking
        this.currentQuestId = data.currentQuestId || data.current_quest_id || null;

        // Timestamps
        this.createdAt = data.createdAt || data.created_at || Utils.now();
        this.retiredAt = data.retiredAt || data.retired_at || null;
        this.diedAt = data.diedAt || data.died_at || null;

        // Equipped gear (item IDs)
        this.equipment = data.equipment || {
            weapon: null,
            helmet: null,
            chest: null,
            gloves: null,
            boots: null,
            amulet: null,
            ring1: null,
            ring2: null,
        };

        // Summon configuration (for WILL-based summoners)
        // Array of { name, bst, stats: { atk, will, def, spd } }
        this.summonLoadout = data.summonLoadout || data.summon_loadout || [];

        // Hire cost (for recruits only, preserved from generation)
        this.hireCost = data.hireCost ?? null;

        // Conjured weapon commitment (0 = none, up to WILL)
        this.conjuredWeaponWill = data.conjuredWeaponWill || data.conjured_weapon_will || 0;

        // Passive healing tracking (timestamp of last passive heal tick)
        this.lastHealTick = data.lastHealTick || data.last_heal_tick || null;
    }

    // ==================== COMPUTED PROPERTIES ====================

    /**
     * Get Base Stat Total (should equal Level × 10)
     */
    get bst() {
        return this.stats.atk + this.stats.will + this.stats.def + this.stats.spd;
    }

    /**
     * Get expected BST for current level
     */
    get expectedBst() {
        return Utils.calcBST(this.level);
    }

    /**
     * Validate that BST allocation matches level
     */
    get isValidBst() {
        return this.bst === this.expectedBst;
    }

    /**
     * Get max HP: (Level × 20) + DEF + equipment bonus
     */
    get maxHp() {
        return Utils.calcHP(this.level, this.stats.def) + (this.hpBonus || 0);
    }

    /**
     * Get base max HP (without equipment bonus)
     */
    get baseMaxHp() {
        return Utils.calcHP(this.level, this.stats.def);
    }

    /**
     * Get current HP (defaults to max if not set)
     */
    get currentHp() {
        if (this._currentHp === null) return this.maxHp;
        return Math.min(this._currentHp, this.maxHp);
    }

    /**
     * Set current HP
     */
    set currentHp(value) {
        this._currentHp = Utils.clamp(value, 0, this.maxHp);
    }

    /**
     * Check if hero is alive
     */
    get isAlive() {
        return this.state !== HeroState.DEAD && this.currentHp > 0;
    }

    /**
     * Check if hero is available for quests
     */
    get isAvailable() {
        return this.state === HeroState.AVAILABLE;
    }

    /**
     * Check if hero needs healing (not at full HP)
     */
    get needsHealing() {
        return this.currentHp < this.maxHp;
    }

    /**
     * Check if hero can passively heal (available and not at full HP)
     */
    get canPassiveHeal() {
        return this.isAvailable && this.needsHealing;
    }

    /**
     * Get time until next passive heal tick (in seconds)
     */
    get timeUntilNextHeal() {
        if (!this.canPassiveHeal) return 0;
        if (!this.lastHealTick) return 0; // Ready to heal immediately

        const elapsed = (Date.now() - new Date(this.lastHealTick).getTime()) / 1000;
        const interval = 60; // 1 minute per tick
        return Math.max(0, interval - elapsed);
    }

    /**
     * Get passive heal progress (0-100%)
     */
    get passiveHealProgress() {
        if (!this.canPassiveHeal) return 0;
        if (!this.lastHealTick) return 100; // Ready now

        const elapsed = (Date.now() - new Date(this.lastHealTick).getTime()) / 1000;
        const interval = 60; // 1 minute per tick
        return Math.min(100, (elapsed / interval) * 100);
    }

    /**
     * Get XP needed for next level
     */
    get xpToNextLevel() {
        // XP_BASE × (XP_SCALING ^ (level - 1))
        return Math.floor(
            CONFIG.HERO.XP_BASE * Math.pow(CONFIG.HERO.XP_SCALING, this.level - 1)
        );
    }

    /**
     * Get available WILL for summons (after conjured weapon commitment)
     */
    get availableSummonBst() {
        return Math.max(0, this.stats.will - this.conjuredWeaponWill);
    }

    /**
     * Get currently committed summon BST
     */
    get committedSummonBst() {
        return this.summonLoadout.reduce((sum, s) => sum + s.bst, 0);
    }

    /**
     * Check if summon loadout is valid (doesn't exceed available WILL)
     */
    get isValidSummonLoadout() {
        return this.committedSummonBst <= this.availableSummonBst;
    }

    // ==================== METHODS ====================

    /**
     * Allocate stats (used during recruitment)
     * @param {Object} stats - { atk, will, def, spd }
     * @returns {boolean} Success
     */
    allocateStats(stats) {
        const total = stats.atk + stats.will + stats.def + stats.spd;
        if (total !== this.expectedBst) {
            Utils.error(`Invalid stat allocation: ${total} !== ${this.expectedBst}`);
            return false;
        }

        this.stats = { ...stats };
        this._currentHp = null; // Reset to max HP
        return true;
    }

    /**
     * Take damage
     * @param {number} amount - Damage to take
     * @returns {Object} { damage, died, overkill }
     */
    takeDamage(amount) {
        const actualDamage = Math.min(amount, this.currentHp);
        const overkill = Math.max(0, amount - this.currentHp);

        this.currentHp -= actualDamage;

        const died = this.currentHp <= 0;
        if (died) {
            this.die();
        }

        return { damage: actualDamage, died, overkill };
    }

    /**
     * Heal hero
     * @param {number} amount - HP to restore
     * @returns {number} Actual amount healed
     */
    heal(amount) {
        const before = this.currentHp;
        this.currentHp = Math.min(this.currentHp + amount, this.maxHp);
        return this.currentHp - before;
    }

    /**
     * Fully restore HP
     */
    fullHeal() {
        this._currentHp = null; // Will return maxHp
        this.lastHealTick = null; // Reset passive heal timer
    }

    /**
     * Update HP bonus from equipment
     * Called when gear is equipped/unequipped
     * @param {number} newBonus - Total HP bonus from all equipment
     */
    updateHpBonus(newBonus) {
        const oldBonus = this.hpBonus || 0;
        this.hpBonus = newBonus;

        // If bonus decreased and currentHp exceeds new max, cap it
        if (newBonus < oldBonus && this._currentHp !== null) {
            const newMax = this.maxHp;
            if (this._currentHp > newMax) {
                this._currentHp = newMax;
            }
        }
    }

    /**
     * Apply passive healing (4% per tick)
     * @returns {Object} { healed: boolean, amount: number, nowFull: boolean }
     */
    applyPassiveHeal() {
        if (!this.canPassiveHeal) {
            return { healed: false, amount: 0, nowFull: false };
        }

        // Check if enough time has passed since last tick
        if (this.lastHealTick) {
            const elapsed = (Date.now() - new Date(this.lastHealTick).getTime()) / 1000;
            if (elapsed < 60) { // 1 minute between ticks
                return { healed: false, amount: 0, nowFull: false };
            }
        }

        // Calculate 4% of max HP
        const healAmount = Math.max(1, Math.round(this.maxHp * 0.04));
        const actualHealed = this.heal(healAmount);

        // Update tick time
        this.lastHealTick = new Date().toISOString();

        // Check if now at full HP
        const nowFull = this.currentHp >= this.maxHp;
        if (nowFull) {
            this.lastHealTick = null; // Clear timer when full
        }

        return { healed: true, amount: actualHealed, nowFull };
    }

    /**
     * Add XP and check for level up
     * @param {number} amount - XP to add
     * @returns {Object} { leveled, newLevel, skillPointsGained }
     */
    addXp(amount) {
        this.xp += amount;

        let leveled = false;
        let skillPointsGained = 0;

        while (this.xp >= this.xpToNextLevel && this.level < CONFIG.HERO.MAX_LEVEL) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.skillPoints += CONFIG.SKILLS.POINTS_PER_LEVEL;
            skillPointsGained += CONFIG.SKILLS.POINTS_PER_LEVEL;
            leveled = true;

            // Heal to full HP on level up
            this._currentHp = null;  // Will return maxHp (full health)

            Utils.log(`${this.name} leveled up to ${this.level}!`);
        }

        return { leveled, newLevel: this.level, skillPointsGained };
    }

    /**
     * Mark hero as on quest
     * @param {string} questId - Quest ID
     */
    startQuest(questId) {
        if (!this.isAvailable) {
            Utils.error(`Hero ${this.name} is not available for quests`);
            return false;
        }

        this.state = HeroState.ON_QUEST;
        this.currentQuestId = questId;
        return true;
    }

    /**
     * Complete quest and return to available
     * @param {boolean} injured - Whether hero was injured
     */
    completeQuest(injured = false) {
        this.currentQuestId = null;

        if (injured) {
            this.state = HeroState.INJURED;
            // TODO: Set injury recovery timer
        } else {
            this.state = HeroState.AVAILABLE;
        }
    }

    /**
     * Retire hero (requires meeting level threshold)
     * @returns {boolean} Success
     */
    retire() {
        if (this.level < CONFIG.INHERITANCE.MIN_LEVEL_TO_RETIRE) {
            Utils.error(`Hero must be level ${CONFIG.INHERITANCE.MIN_LEVEL_TO_RETIRE} to retire`);
            return false;
        }

        if (this.state !== HeroState.AVAILABLE) {
            Utils.error('Hero must be available to retire');
            return false;
        }

        this.state = HeroState.RETIRED;
        this.retiredAt = Utils.now();
        return true;
    }

    /**
     * Kill hero (permadeath)
     */
    die() {
        this.state = HeroState.DEAD;
        this.diedAt = Utils.now();
        this.currentHp = 0;
        Utils.log(`${this.name} has died. RIP.`);
    }

    /**
     * Calculate physical damage this hero would deal
     * @param {number} targetDef - Target's DEF stat
     */
    calcPhysicalDamage(targetDef) {
        return Utils.calcPhysicalDamage(this.stats.atk, targetDef);
    }

    /**
     * Calculate magical damage this hero would deal
     * @param {number} targetWill - Target's WILL stat
     */
    calcMagicalDamage(targetWill) {
        return Utils.calcMagicalDamage(this.stats.will, targetWill);
    }

    /**
     * Calculate hybrid damage (for conjured weapons)
     * @param {number} targetDef - Target's DEF
     * @param {number} targetWill - Target's WILL
     * @returns {Object} { physical, magical, total }
     */
    calcHybridDamage(targetDef, targetWill) {
        const physical = this.calcPhysicalDamage(targetDef);
        const magical = this.conjuredWeaponWill > 0
            ? Utils.calcMagicalDamage(this.conjuredWeaponWill, targetWill)
            : 0;
        return {
            physical,
            magical,
            total: physical + magical,
        };
    }

    /**
     * Get skill by ID
     * @param {string} skillId
     * @returns {Object|null} Skill data or null
     */
    getSkill(skillId) {
        return this.skills.find(s => s.skillId === skillId) || null;
    }

    /**
     * Upgrade a skill by spending skill points (V3: skill tree system)
     * @param {string} skillId
     * @returns {Object|false} { success, nodeUnlocked } or false on failure
     */
    upgradeSkill(skillId) {
        const skill = this.getSkill(skillId);
        if (!skill) {
            Utils.error(`Hero doesn't have skill: ${skillId}`);
            return false;
        }

        if (this.skillPoints < 1) {
            Utils.error('Not enough skill points');
            return false;
        }

        // Check if skill tree is at max
        const maxPoints = skill.maxPoints || 5;
        const currentPoints = skill.points || 0;

        if (currentPoints >= maxPoints) {
            Utils.error('Skill already at max points');
            return false;
        }

        // Spend the point
        skill.points = currentPoints + 1;
        this.skillPoints--;

        Utils.log(`${this.name} invested point ${skill.points}/${maxPoints} in ${skillId}`);
        return { success: true, newPoints: skill.points, maxPoints };
    }

    /**
     * Get total skill points invested across all skills
     * @returns {number}
     */
    getTotalSkillPointsInvested() {
        return this.skills.reduce((sum, skill) => sum + (skill.points || 0), 0);
    }

    /**
     * Get remaining skill points that could be allocated
     * @returns {number}
     */
    getUnspentSkillPoints() {
        return this.skillPoints;
    }

    /**
     * Check if a specific skill tree node is unlocked
     * @param {string} skillId
     * @param {number} nodeIndex - 0-14 for the 15 nodes
     * @returns {boolean}
     */
    isSkillNodeUnlocked(skillId, nodeIndex) {
        const skill = this.getSkill(skillId);
        if (!skill) return false;
        return (skill.points || 0) > nodeIndex;
    }

    /**
     * Convert to database format
     */
    toDatabase() {
        return {
            id: this.id,
            user_id: this.userId,
            name: this.name,
            portrait_id: this.portraitId,
            level: this.level,
            xp: this.xp,
            skill_points: this.skillPoints,
            atk: this.stats.atk,
            will: this.stats.will,
            def: this.stats.def,
            spd: this.stats.spd,
            current_hp: this._currentHp,
            state: this.state,
            current_quest_id: this.currentQuestId,
            created_at: this.createdAt,
            retired_at: this.retiredAt,
            died_at: this.diedAt,
            equipment: this.equipment,
            summon_loadout: this.summonLoadout,
            conjured_weapon_will: this.conjuredWeaponWill,
            skills: this.skills, // JSONB column in Supabase
            last_heal_tick: this.lastHealTick,
        };
    }

    /**
     * Create hero from database row
     */
    static fromDatabase(row) {
        // Parse skills from JSON if stored as string
        let skills = row.skills;
        if (typeof skills === 'string') {
            try {
                skills = JSON.parse(skills);
            } catch (e) {
                skills = [];
            }
        }

        return new Hero({
            id: row.id,
            userId: row.user_id,
            name: row.name,
            portraitId: row.portrait_id,
            level: row.level,
            xp: row.xp,
            skillPoints: row.skill_points,
            stats: {
                atk: row.atk,
                will: row.will,
                def: row.def,
                spd: row.spd,
            },
            currentHp: row.current_hp,
            state: row.state,
            currentQuestId: row.current_quest_id,
            createdAt: row.created_at,
            retiredAt: row.retired_at,
            diedAt: row.died_at,
            equipment: row.equipment,
            summonLoadout: row.summon_loadout,
            conjuredWeaponWill: row.conjured_weapon_will,
            skills: skills || [], // Include skills from database
            lastHealTick: row.last_heal_tick,
        });
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Hero, HeroState };
}
