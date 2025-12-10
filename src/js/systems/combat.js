/**
 * ============================================
 * GUILD MASTER - Combat Simulation Engine
 * ============================================
 * Real combat simulation running under the hood.
 * This is NOT fake theater - actual damage calculations
 * determine outcomes.
 *
 * COMBAT FLOW:
 * 1. Initialize combatants (hero + summons vs mobs)
 * 2. Determine turn order (SPD)
 * 3. Execute turns until one side is eliminated
 * 4. Return detailed combat log
 *
 * DAMAGE FORMULAS (from design doc):
 * Physical: ATK² ÷ (ATK + target DEF)
 * Magical: WILL² ÷ (WILL + target WILL ÷ 2)
 * ============================================
 */

/**
 * Combat action types
 * @readonly
 * @enum {string}
 */
const CombatActionType = {
    ATTACK: 'attack',
    SKILL: 'skill',
    HEAL: 'heal',
    BUFF: 'buff',
    DEBUFF: 'debuff',
    SUMMON: 'summon',
    TRIGGER: 'trigger',    // Passive/trigger skill activated
    DEATH: 'death',
};

Object.freeze(CombatActionType);

/**
 * Combat result
 */
class CombatResult {
    constructor() {
        this.victory = false;
        this.heroSurvived = true;
        this.rounds = [];
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
        this.enemiesKilled = 0;
        this.loot = [];
        this.xpGained = 0;
        this.goldGained = 0;
    }

    addRound(round) {
        this.rounds.push(round);
    }
}

/**
 * Combat round - contains all actions in a single round
 */
class CombatRound {
    constructor(roundNumber) {
        this.roundNumber = roundNumber;
        this.actions = [];
    }

    addAction(action) {
        this.actions.push(action);
    }
}

/**
 * Single combat action
 */
class CombatAction {
    constructor(data = {}) {
        this.type = data.type || CombatActionType.ATTACK;
        this.actorId = data.actorId || null;
        this.actorName = data.actorName || 'Unknown';
        this.actorIsHero = data.actorIsHero || false;
        this.targetId = data.targetId || null;
        this.targetName = data.targetName || 'Unknown';
        this.skillId = data.skillId || null;
        this.skillName = data.skillName || 'Attack';
        this.damage = data.damage || 0;
        this.damageType = data.damageType || 'physical';
        this.healing = data.healing || 0;
        this.isCritical = data.isCritical || false;
        this.killed = data.killed || false;
        this.description = data.description || '';
    }
}

/**
 * Combatant wrapper - normalizes heroes and mobs for combat
 */
class Combatant {
    constructor(data, isHero = false, isSummon = false) {
        this.id = data.id || Utils.uuid();
        this.name = data.name;
        this.isHero = isHero;
        this.isSummon = isSummon;
        this.isEnemy = !isHero && !isSummon;

        // Stats
        this.stats = { ...data.stats };
        this.level = data.level || 1;

        // HP
        this.maxHp = data.maxHp || Utils.calcHP(this.level, this.stats.def);
        this.currentHp = data.currentHp ?? this.maxHp;

        // Skills
        this.skills = data.skills || [];

        // Combat state
        this.isAlive = true;
        this.buffs = [];
        this.debuffs = [];
        this.cooldowns = {}; // skillId -> rounds remaining

        // Passive tracking
        this.triggeredThisCombat = {}; // For once-per-combat triggers
        this.killCount = 0;

        // Reference to original object (for updating after combat)
        this.original = data;
    }

    get atk() { return this.stats.atk; }
    get will() { return this.stats.will; }
    get def() { return this.stats.def; }
    get spd() { return this.stats.spd; }

    takeDamage(amount) {
        const actual = Math.min(amount, this.currentHp);
        this.currentHp -= actual;
        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.isAlive = false;
        }
        return { actual, killed: !this.isAlive };
    }

    heal(amount) {
        const actual = Math.min(amount, this.maxHp - this.currentHp);
        this.currentHp += actual;
        return actual;
    }

    canUseSkill(skillId) {
        return !this.cooldowns[skillId] || this.cooldowns[skillId] <= 0;
    }

    putOnCooldown(skillId, rounds) {
        this.cooldowns[skillId] = rounds;
    }

    tickCooldowns() {
        for (const skillId of Object.keys(this.cooldowns)) {
            if (this.cooldowns[skillId] > 0) {
                this.cooldowns[skillId]--;
            }
        }
    }
}

/**
 * Main Combat Engine
 */
const CombatEngine = {
    /**
     * Run a full encounter simulation
     * @param {Hero} hero - The hero fighting
     * @param {Array} mobs - Array of mob instances
     * @returns {CombatResult}
     */
    runEncounter(hero, mobs) {
        Utils.log('Starting combat encounter');

        const result = new CombatResult();

        // Create combatants
        const heroCombatant = new Combatant({
            id: hero.id,
            name: hero.name,
            stats: hero.stats,
            level: hero.level,
            maxHp: hero.maxHp,
            currentHp: hero.currentHp,
            skills: hero.skills,
        }, true, false);

        // Create hero summons if any
        const summons = this.createSummons(hero);

        const enemies = mobs.map(mob => new Combatant(mob, false, false));

        // All combatants
        let allCombatants = [heroCombatant, ...summons, ...enemies];

        // Combat loop
        let roundNumber = 0;
        const MAX_ROUNDS = 100; // Safety limit

        while (roundNumber < MAX_ROUNDS) {
            roundNumber++;
            const round = new CombatRound(roundNumber);

            // Get living combatants
            const livingAllies = allCombatants.filter(c => (c.isHero || c.isSummon) && c.isAlive);
            const livingEnemies = allCombatants.filter(c => c.isEnemy && c.isAlive);

            // Check win/loss conditions
            if (livingEnemies.length === 0) {
                result.victory = true;
                result.heroSurvived = heroCombatant.isAlive;
                break;
            }

            if (!heroCombatant.isAlive && livingAllies.length === 0) {
                result.victory = false;
                result.heroSurvived = false;
                break;
            }

            // Determine turn order (sort by SPD, descending)
            const turnOrder = allCombatants
                .filter(c => c.isAlive)
                .sort((a, b) => b.spd - a.spd);

            // Execute turns
            for (const actor of turnOrder) {
                if (!actor.isAlive) continue;

                // Get valid targets
                const targets = actor.isEnemy
                    ? allCombatants.filter(c => (c.isHero || c.isSummon) && c.isAlive)
                    : allCombatants.filter(c => c.isEnemy && c.isAlive);

                if (targets.length === 0) continue;

                // Execute action
                const action = this.executeAction(actor, targets, allCombatants, hero);
                if (action) {
                    round.addAction(action);

                    // Track damage
                    if (actor.isHero || actor.isSummon) {
                        result.totalDamageDealt += action.damage || 0;
                    } else {
                        result.totalDamageTaken += action.damage || 0;
                    }

                    // Track kills
                    if (action.killed && (actor.isHero || actor.isSummon)) {
                        result.enemiesKilled++;
                        actor.killCount++;
                    }
                }

                // Check for triggered abilities
                const triggers = this.checkTriggers(actor, action, allCombatants, hero);
                triggers.forEach(t => round.addAction(t));
            }

            // End of round - tick cooldowns
            allCombatants.forEach(c => c.tickCooldowns());

            result.addRound(round);
        }

        // Update hero's current HP
        hero.currentHp = heroCombatant.currentHp;

        Utils.log(`Combat ended: ${result.victory ? 'Victory' : 'Defeat'}`);
        return result;
    },

    /**
     * Execute a single action
     */
    executeAction(actor, targets, allCombatants, hero) {
        // Select target (simple: lowest HP enemy)
        const target = this.selectTarget(targets);
        if (!target) return null;

        // Choose skill or basic attack
        const { skillId, skillDef } = this.chooseSkill(actor, target, hero);

        // Calculate damage
        let damage = 0;
        let damageType = 'physical';
        let isCritical = false;
        let healing = 0;

        if (skillDef) {
            const result = this.calculateSkillDamage(actor, target, skillDef, hero);
            damage = result.damage;
            damageType = result.damageType;
            isCritical = result.isCritical;

            // Handle healing skills
            if (skillDef.target === SkillTarget.SELF && skillDef.baseValue > 0 && skillDef.damageType === DamageType.NONE) {
                healing = Math.floor(actor.maxHp * this.getSkillEffectValue(skillDef, hero, skillId));
                actor.heal(healing);
            }
        } else {
            // Basic attack - physical
            damage = Utils.calcPhysicalDamage(actor.atk, target.def);
        }

        // Apply damage
        const { actual, killed } = target.takeDamage(damage);

        // Lifesteal check
        const leechValue = this.getPassiveValue(actor, 'leech', hero);
        if (leechValue > 0 && damage > 0) {
            const leechHeal = Math.floor(damage * leechValue);
            actor.heal(leechHeal);
        }

        // Create action record
        return new CombatAction({
            type: skillDef ? CombatActionType.SKILL : CombatActionType.ATTACK,
            actorId: actor.id,
            actorName: actor.name,
            actorIsHero: actor.isHero,
            targetId: target.id,
            targetName: target.name,
            skillId,
            skillName: skillDef?.name || 'Attack',
            damage: actual,
            damageType,
            healing,
            isCritical,
            killed,
            description: this.describeAction(actor, target, skillDef, actual, killed, isCritical),
        });
    },

    /**
     * Select target for attack
     * Strategy: Focus lowest HP target
     */
    selectTarget(targets) {
        if (targets.length === 0) return null;
        return targets.reduce((lowest, t) =>
            t.currentHp < lowest.currentHp ? t : lowest
        );
    },

    /**
     * Choose which skill to use
     */
    chooseSkill(actor, target, hero) {
        // For now, simple logic: use first available active skill
        for (const skillRef of actor.skills) {
            const skillId = typeof skillRef === 'string' ? skillRef : skillRef.skillId;
            const skillDef = Skills.get(skillId);

            if (!skillDef) continue;
            if (skillDef.activation !== SkillActivation.ACTIVE) continue;
            if (!actor.canUseSkill(skillId)) continue;

            // Check cooldown-based skills
            if (skillDef.cooldown) {
                actor.putOnCooldown(skillId, skillDef.cooldown);
            }

            return { skillId, skillDef };
        }

        // Fallback to basic attack
        return { skillId: null, skillDef: null };
    },

    /**
     * Calculate damage for a skill
     */
    calculateSkillDamage(actor, target, skillDef, hero) {
        let damage = 0;
        let damageType = skillDef.damageType || DamageType.PHYSICAL;
        let isCritical = false;

        // Get skill rank for hero skills
        const rank = this.getSkillRank(actor, skillDef.id, hero);
        const effectValue = Skills.calcEffectValue(skillDef, rank);

        if (skillDef.damageType === DamageType.PHYSICAL) {
            const baseDamage = Utils.calcPhysicalDamage(actor.atk, target.def);
            damage = Math.floor(baseDamage * effectValue);
        } else if (skillDef.damageType === DamageType.MAGICAL) {
            const baseDamage = Utils.calcMagicalDamage(actor.will, target.will);
            damage = Math.floor(baseDamage * effectValue);
        } else if (skillDef.damageType === DamageType.TRUE) {
            // True damage ignores defenses
            damage = Math.floor(actor.atk * effectValue);
        }

        // Hybrid scaling (like Holy Smite)
        if (skillDef.scalingWeights) {
            damage = 0;
            for (const [stat, weight] of Object.entries(skillDef.scalingWeights)) {
                const statValue = actor.stats[stat] || 0;
                if (skillDef.damageType === DamageType.MAGICAL) {
                    damage += Utils.calcMagicalDamage(Math.floor(statValue * weight), target.will);
                } else {
                    damage += Utils.calcPhysicalDamage(Math.floor(statValue * weight), target.def);
                }
            }
            damage = Math.floor(damage * effectValue);
        }

        // Execute bonus (bonus damage vs low HP)
        if (skillDef.executeBonus) {
            const missingHpPercent = 1 - (target.currentHp / target.maxHp);
            damage = Math.floor(damage * (1 + missingHpPercent));
        }

        // Critical hit check
        let critChance = 0.05; // Base 5% crit
        if (skillDef.critBonus) {
            critChance += skillDef.critBonus;
        }

        if (Math.random() < critChance) {
            isCritical = true;
            damage = Math.floor(damage * 1.5);
        }

        // Cleave/AoE would be handled differently (TODO: multi-target)

        return { damage: Math.max(damage, CONFIG.STATS.MIN_DAMAGE), damageType, isCritical };
    },

    /**
     * Get skill rank from hero
     */
    getSkillRank(actor, skillId, hero) {
        if (!actor.isHero) return 1;

        const skillRef = hero.skills.find(s => s.skillId === skillId);
        return skillRef?.rank || 1;
    },

    /**
     * Get skill effect value at current rank
     */
    getSkillEffectValue(skillDef, hero, skillId) {
        const rank = hero?.skills?.find(s => s.skillId === skillId)?.rank || 1;
        return Skills.calcEffectValue(skillDef, rank);
    },

    /**
     * Get passive ability value
     */
    getPassiveValue(actor, passiveId, hero) {
        if (!actor.isHero) return 0;

        const skillRef = hero.skills.find(s => s.skillId === passiveId);
        if (!skillRef) return 0;

        const skillDef = Skills.get(passiveId);
        if (!skillDef || skillDef.activation !== SkillActivation.PASSIVE) return 0;

        return Skills.calcEffectValue(skillDef, skillRef.rank);
    },

    /**
     * Check for triggered abilities
     */
    checkTriggers(actor, lastAction, allCombatants, hero) {
        const triggers = [];

        // Check for Second Wind (heal at low HP)
        if (actor.isHero && actor.currentHp < actor.maxHp * 0.3) {
            const secondWind = hero.skills.find(s => s.skillId === 'second_wind');
            if (secondWind && !actor.triggeredThisCombat['second_wind']) {
                const skillDef = Skills.get('second_wind');
                const healPercent = Skills.calcEffectValue(skillDef, secondWind.rank);
                const healing = Math.floor(actor.maxHp * healPercent);
                actor.heal(healing);
                actor.triggeredThisCombat['second_wind'] = true;

                triggers.push(new CombatAction({
                    type: CombatActionType.TRIGGER,
                    actorId: actor.id,
                    actorName: actor.name,
                    actorIsHero: true,
                    healing,
                    skillId: 'second_wind',
                    skillName: 'Second Wind',
                    description: `${actor.name}'s Second Wind activates, healing for ${healing} HP!`,
                }));
            }
        }

        // Check for Undying (survive lethal)
        if (actor.isHero && actor.currentHp <= 0 && !actor.triggeredThisCombat['undying']) {
            const undying = hero.skills.find(s => s.skillId === 'undying');
            if (undying) {
                const skillDef = Skills.get('undying');
                const healPercent = Skills.calcEffectValue(skillDef, undying.rank);
                actor.currentHp = Math.floor(actor.maxHp * healPercent);
                actor.isAlive = true;
                actor.triggeredThisCombat['undying'] = true;

                triggers.push(new CombatAction({
                    type: CombatActionType.TRIGGER,
                    actorId: actor.id,
                    actorName: actor.name,
                    actorIsHero: true,
                    healing: actor.currentHp,
                    skillId: 'undying',
                    skillName: 'Undying',
                    description: `${actor.name} refuses to die! Undying activates!`,
                }));
            }
        }

        // Thorns damage (when hit)
        if (lastAction && lastAction.damage > 0 && !lastAction.actorIsHero) {
            const target = allCombatants.find(c => c.id === lastAction.targetId);
            if (target?.isHero) {
                const thorns = hero.skills.find(s => s.skillId === 'thorns');
                if (thorns) {
                    const skillDef = Skills.get('thorns');
                    const reflectPercent = Skills.calcEffectValue(skillDef, thorns.rank);
                    const thornsDamage = Math.floor(lastAction.damage * reflectPercent);

                    const attacker = allCombatants.find(c => c.id === lastAction.actorId);
                    if (attacker && thornsDamage > 0) {
                        const { killed } = attacker.takeDamage(thornsDamage);

                        triggers.push(new CombatAction({
                            type: CombatActionType.TRIGGER,
                            actorId: target.id,
                            actorName: target.name,
                            actorIsHero: true,
                            targetId: attacker.id,
                            targetName: attacker.name,
                            damage: thornsDamage,
                            killed,
                            skillId: 'thorns',
                            skillName: 'Thorns',
                            description: `${target.name}'s Thorns reflects ${thornsDamage} damage to ${attacker.name}!`,
                        }));
                    }
                }
            }
        }

        return triggers;
    },

    /**
     * Create summons for hero
     */
    createSummons(hero) {
        // TODO: Implement summon system based on WILL and summon loadout
        // For now, return empty array
        return [];
    },

    /**
     * Generate action description text
     */
    describeAction(actor, target, skillDef, damage, killed, isCritical) {
        const critText = isCritical ? ' CRITICAL!' : '';
        const killText = killed ? ` ${target.name} is slain!` : '';
        const skillName = skillDef?.name || 'attacks';

        return `${actor.name} ${skillName} ${target.name} for ${damage} damage!${critText}${killText}`;
    },

    /**
     * Run all encounters for a quest
     * @param {Hero} hero
     * @param {Quest} quest
     * @returns {Object} Full quest results
     */
    runQuest(hero, quest) {
        const results = {
            success: true,
            heroSurvived: true,
            encounters: [],
            totalXp: 0,
            totalGold: 0,
            loot: [],
        };

        const template = quest.template;
        if (!template) {
            Utils.error('Quest has no template');
            return results;
        }

        // Run each encounter
        for (let i = 0; i < template.encounters.length; i++) {
            const encounter = template.encounters[i];

            // Create mob instances
            const mobs = encounter.mobs.map(mobId => Quests.createMobInstance(mobId));

            // Run combat
            const combatResult = this.runEncounter(hero, mobs);

            results.encounters.push({
                index: i,
                result: combatResult,
            });

            // Check if hero died
            if (!combatResult.heroSurvived) {
                results.success = false;
                results.heroSurvived = false;
                break;
            }

            // Generate loot from encounter
            const lootItems = mobs.map(mob => {
                const item = GearGenerator.generateLoot(quest.difficulty, mob.tier);
                if (item) results.loot.push(item);
                return item;
            }).filter(Boolean);
        }

        // Calculate rewards if successful
        if (results.success) {
            const rewards = template.rewards;
            results.totalXp = rewards.xp;
            results.totalGold = Utils.randomInt(rewards.gold.min, rewards.gold.max);
        }

        return results;
    },
};

Object.freeze(CombatEngine);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CombatActionType,
        CombatResult,
        CombatRound,
        CombatAction,
        Combatant,
        CombatEngine,
    };
}
