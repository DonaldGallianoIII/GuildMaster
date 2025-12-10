/**
 * ============================================
 * GUILD MASTER - Modal System
 * ============================================
 * Modal dialogs for detailed views and actions
 * ============================================
 */

const Modals = {
    // Active modal reference
    _current: null,

    /**
     * Show a modal
     */
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('hidden');
        this._current = modal;

        // Close on backdrop click
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.onclick = () => this.hide(modalId);
        }

        // Close on escape key
        document.addEventListener('keydown', this._escHandler);
    },

    /**
     * Hide a modal
     */
    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        this._current = null;
        document.removeEventListener('keydown', this._escHandler);
    },

    /**
     * Hide current modal
     */
    hideCurrent() {
        if (this._current) {
            this._current.classList.add('hidden');
            this._current = null;
        }
        document.removeEventListener('keydown', this._escHandler);
    },

    /**
     * Escape key handler
     */
    _escHandler(e) {
        if (e.key === 'Escape') {
            Modals.hideCurrent();
        }
    },

    // ==================== STAT ALLOCATION MODAL ====================

    /**
     * Show stat allocation modal for recruiting
     */
    showStatAllocation(recruit, onConfirm) {
        const modal = document.getElementById('stat-modal');
        const content = modal.querySelector('.modal-content');

        // Current allocation state
        const level = 1;
        const totalBST = Utils.calcBST(level);
        const allocation = { atk: 0, will: 0, def: 0, spd: 0 };

        const updateUI = () => {
            const remaining = totalBST - (allocation.atk + allocation.will + allocation.def + allocation.spd);
            const hp = Utils.calcHP(level, allocation.def);

            content.innerHTML = `
                <div class="modal-header">
                    <h2>Assign Stats for ${recruit.name}</h2>
                    <button class="modal-close" onclick="Modals.hide('stat-modal')">×</button>
                </div>
                <div class="modal-body">
                    <div class="allocation-info">
                        <div>Level ${level} Hero</div>
                        <div class="bst-remaining">Points Remaining: ${remaining} / ${totalBST}</div>
                    </div>

                    <div class="stat-allocator">
                        ${this._createAllocatorRow('atk', 'ATK', allocation.atk, remaining)}
                        ${this._createAllocatorRow('will', 'WILL', allocation.will, remaining)}
                        ${this._createAllocatorRow('def', 'DEF', allocation.def, remaining)}
                        ${this._createAllocatorRow('spd', 'SPD', allocation.spd, remaining)}
                    </div>

                    <div class="calculated-hp">
                        Calculated HP: <strong>${hp}</strong>
                        <br><small>(Level × 20) + DEF = (${level} × 20) + ${allocation.def}</small>
                    </div>

                    <h4>Skills</h4>
                    <div class="hero-skills" style="margin-bottom: 1rem;">
                        ${recruit.skills.map(s => UI.createSkillTag(s).outerHTML).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="Modals.hide('stat-modal')">Cancel</button>
                    <button class="btn btn-gold" id="confirm-hire" ${remaining !== 0 ? 'disabled' : ''}>
                        Hire (${recruit.hireCost}g)
                    </button>
                </div>
            `;

            // Attach button handlers
            content.querySelectorAll('.allocator-btn').forEach(btn => {
                btn.onclick = () => {
                    const stat = btn.dataset.stat;
                    const delta = parseInt(btn.dataset.delta);
                    const newValue = allocation[stat] + delta;

                    // Validate
                    if (newValue < 0) return;
                    if (delta > 0 && (allocation.atk + allocation.will + allocation.def + allocation.spd) >= totalBST) return;

                    allocation[stat] = newValue;
                    updateUI();
                };
            });

            // Confirm button
            const confirmBtn = content.querySelector('#confirm-hire');
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    if (onConfirm) {
                        onConfirm(allocation);
                    }
                    this.hide('stat-modal');
                };
            }
        };

        updateUI();
        this.show('stat-modal');
    },

    /**
     * Create allocator row HTML
     */
    _createAllocatorRow(stat, label, value, remaining) {
        const maxBar = 20; // Visual max for bar
        const barPercent = (value / maxBar) * 100;

        return `
            <div class="allocator-row stat-${stat}">
                <div class="allocator-label">${label}</div>
                <div class="allocator-controls">
                    <button class="allocator-btn" data-stat="${stat}" data-delta="-1" ${value <= 0 ? 'disabled' : ''}>-</button>
                    <span class="allocator-value">${value}</span>
                    <button class="allocator-btn" data-stat="${stat}" data-delta="1" ${remaining <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <div class="allocator-bar">
                    <div class="allocator-bar-fill" style="width: ${barPercent}%"></div>
                </div>
            </div>
        `;
    },

    // ==================== QUEST ASSIGNMENT MODAL ====================

    /**
     * Show quest assignment modal
     */
    showQuestAssignment(quest, availableHeroes, onConfirm) {
        const modal = document.getElementById('quest-modal');
        const content = modal.querySelector('.modal-content');
        const template = quest.template;

        content.innerHTML = `
            <div class="modal-header">
                <h2>${template?.icon || '⚔️'} ${quest.name}</h2>
                <button class="modal-close" onclick="Modals.hide('quest-modal')">×</button>
            </div>
            <div class="modal-body">
                <p style="font-style: italic; color: var(--color-ink-faded);">
                    ${template?.description || 'An adventure awaits...'}
                </p>

                <div style="display: flex; gap: 1rem; margin: 1rem 0;">
                    ${UI.createDifficultyBadge(quest.difficulty).outerHTML}
                    <span>⏱️ ${Utils.formatDuration(template?.duration || 0)}</span>
                </div>

                <h4>Select a Hero</h4>
                <div id="hero-select-list" class="heroes-grid" style="grid-template-columns: 1fr;">
                    ${availableHeroes.length === 0
                        ? '<p style="color: var(--color-ink-faded);">No heroes available.</p>'
                        : ''
                    }
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="Modals.hide('quest-modal')">Cancel</button>
            </div>
        `;

        // Render hero selection
        const heroList = content.querySelector('#hero-select-list');
        for (const hero of availableHeroes) {
            const card = HeroCard.create(hero, {
                onClick: (h) => {
                    if (onConfirm) onConfirm(h);
                    this.hide('quest-modal');
                },
            });
            heroList.appendChild(card);
        }

        this.show('quest-modal');
    },

    // ==================== HERO DETAIL MODAL ====================

    /**
     * Show hero detail modal
     */
    showHeroDetail(hero) {
        const modal = document.getElementById('hero-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="modal-header">
                <h2>${hero.name}</h2>
                <button class="modal-close" onclick="Modals.hide('hero-modal')">×</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    ${UI.createPortrait(hero.portraitId).outerHTML}
                    <div>
                        <div>Level ${hero.level}</div>
                        <div>XP: ${hero.xp} / ${hero.xpToNextLevel}</div>
                        <div>Skill Points: ${hero.skillPoints}</div>
                    </div>
                </div>

                ${UI.createStatBar(hero.currentHp, hero.maxHp, 'hp').outerHTML}

                <h4 style="margin-top: 1rem;">Stats (BST: ${hero.bst})</h4>
                ${UI.createStatDisplay(hero.stats).outerHTML}

                <h4 style="margin-top: 1rem;">Skills</h4>
                <div class="skills-detail">
                    ${hero.skills.map(s => this._createSkillDetail(s)).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="Modals.hide('hero-modal')">Close</button>
            </div>
        `;

        this.show('hero-modal');
    },

    /**
     * Create skill detail section
     */
    _createSkillDetail(skillRef) {
        const skillId = typeof skillRef === 'string' ? skillRef : skillRef.skillId;
        const skillDef = Skills.get(skillId);
        if (!skillDef) return '';

        const rank = skillRef.rank || 1;
        const maxRank = Skills.getMaxRank(skillRef.isDoubled, skillRef.isTripled);

        return `
            <div class="skill-detail">
                <div class="skill-name">
                    ${skillDef.icon} ${skillDef.name}
                    ${skillRef.isTripled ? '³' : skillRef.isDoubled ? '²' : ''}
                    <span class="skill-rank">(Rank ${rank}/${maxRank})</span>
                </div>
                <div class="skill-description">${skillDef.description}</div>
                <div class="skill-scaling">
                    Type: ${Utils.capitalize(skillDef.damageType)} |
                    Scales: ${skillDef.scaling.map(Utils.capitalize).join(', ') || 'None'}
                </div>
            </div>
        `;
    },

    // ==================== LIVE COMBAT LOG MODAL ====================

    /**
     * Show live combat log for active quest
     */
    _combatLogInterval: null,

    showCombatLog(quest) {
        const modal = document.getElementById('combat-modal');
        const content = modal.querySelector('.modal-content');
        const hero = GameState.getHero(quest.heroId);

        if (!hero) {
            Utils.toast('Hero not found', 'error');
            return;
        }

        // Stop any existing interval
        if (this._combatLogInterval) {
            clearInterval(this._combatLogInterval);
        }

        const updateLog = () => {
            const events = quest.getCurrentEvents();
            const progress = quest.progressPercent;
            const combatResults = quest.combatResults;

            // Calculate current HP based on progress through combat
            let displayHp = hero.currentHp;
            if (combatResults) {
                const startHp = combatResults.heroStartingHp ?? hero.maxHp;
                const endHp = combatResults.heroFinalHp ?? hero.currentHp;
                displayHp = Math.round(startHp + ((endHp - startHp) * (progress / 100)));
                displayHp = Math.max(0, Math.min(hero.maxHp, displayHp));
            }

            // Generate narrative combat log entries
            const logEntries = events.map(event => this._formatCombatEvent(event, hero)).filter(Boolean);

            content.innerHTML = `
                <div class="modal-header">
                    <h2>⚔️ ${quest.name} - Combat Log</h2>
                    <button class="modal-close" onclick="Modals.hideCombatLog()">×</button>
                </div>
                <div class="modal-body">
                    <div class="combat-log-hero">
                        ${UI.createPortrait(hero.portraitId).outerHTML}
                        <div class="combat-log-hero-info">
                            <div class="hero-name">${hero.name}</div>
                            <div class="hero-level">Level ${hero.level}</div>
                            <div class="combat-hp-bar">
                                <div class="hp-bar-fill" style="width: ${(displayHp / hero.maxHp) * 100}%"></div>
                                <span class="hp-text">${displayHp} / ${hero.maxHp} HP</span>
                            </div>
                        </div>
                    </div>

                    <div class="combat-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">${Math.round(progress)}% - ${Utils.formatTime(quest.timeRemaining)} remaining</div>
                    </div>

                    <div class="combat-log-scroll" id="combat-log-entries">
                        ${logEntries.length > 0 ? logEntries.map(entry => `
                            <div class="combat-log-entry ${entry.type}">
                                <span class="log-icon">${entry.icon}</span>
                                <span class="log-text">${entry.text}</span>
                            </div>
                        `).join('') : `
                            <div class="combat-log-entry narrative">
                                <span class="log-icon">🚶</span>
                                <span class="log-text">${hero.name} sets out on the quest...</span>
                            </div>
                        `}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="Modals.hideCombatLog()">Close</button>
                </div>
            `;

            // Auto-scroll to bottom
            const logScroll = content.querySelector('#combat-log-entries');
            if (logScroll) {
                logScroll.scrollTop = logScroll.scrollHeight;
            }

            // Stop updating if quest is complete
            if (quest.isTimeComplete) {
                this.hideCombatLog();
            }
        };

        // Initial render
        updateLog();
        this.show('combat-modal');

        // Update every 500ms
        this._combatLogInterval = setInterval(updateLog, 500);
    },

    hideCombatLog() {
        if (this._combatLogInterval) {
            clearInterval(this._combatLogInterval);
            this._combatLogInterval = null;
        }
        this.hide('combat-modal');
    },

    /**
     * Format a combat event into narrative text
     */
    _formatCombatEvent(event, hero) {
        const heroName = hero?.name || 'Hero';

        switch (event.type) {
            case 'encounter_start': {
                const mobs = event.data.mobs || [];
                const mobList = mobs.join(', ');
                const narratives = [
                    `${heroName} encounters ${mobList}!`,
                    `Enemies appear: ${mobList}!`,
                    `${heroName} faces ${mobs.length > 1 ? 'a group of foes' : 'a foe'}: ${mobList}!`,
                    `The shadows reveal ${mobList}!`,
                ];
                return {
                    type: 'encounter',
                    icon: '⚔️',
                    text: narratives[Math.floor(event.time) % narratives.length],
                };
            }

            case 'combat_action': {
                const { actorName, targetName, damage, healing, killed, isCritical, actorIsHero, description } = event.data;

                // Use provided description or generate one
                if (description) {
                    return {
                        type: actorIsHero ? 'hero-action' : 'enemy-action',
                        icon: killed ? '💀' : (healing ? '💚' : (isCritical ? '💥' : '⚔️')),
                        text: description,
                    };
                }

                // Generate narrative flavor
                const attackVerbs = ['strikes', 'attacks', 'slashes at', 'hits', 'smashes'];
                const critVerbs = ['CRITICALLY HITS', 'delivers a devastating blow to', 'lands a perfect strike on'];
                const killVerbs = ['slays', 'defeats', 'vanquishes', 'destroys'];

                let text;
                if (killed) {
                    const verb = killVerbs[Math.floor(Math.random() * killVerbs.length)];
                    text = `${actorName} ${verb} ${targetName}!`;
                } else if (healing) {
                    text = `${actorName} recovers ${healing} HP!`;
                } else if (isCritical) {
                    const verb = critVerbs[Math.floor(Math.random() * critVerbs.length)];
                    text = `${actorName} ${verb} ${targetName} for ${damage} damage!`;
                } else {
                    const verb = attackVerbs[Math.floor(Math.random() * attackVerbs.length)];
                    text = `${actorName} ${verb} ${targetName} for ${damage} damage.`;
                }

                return {
                    type: actorIsHero ? 'hero-action' : 'enemy-action',
                    icon: killed ? '💀' : (healing ? '💚' : (isCritical ? '💥' : '⚔️')),
                    text,
                };
            }

            case 'encounter_end': {
                if (event.data.victory === false) {
                    return {
                        type: 'danger',
                        icon: '😰',
                        text: `${heroName} is struggling...`,
                    };
                }
                const narratives = [
                    `${heroName} emerges victorious from the battle!`,
                    `The enemies have been defeated!`,
                    `${heroName} catches their breath after the fight.`,
                    `Victory! ${heroName} presses onward.`,
                ];
                return {
                    type: 'victory',
                    icon: event.data.loot ? '💎' : '✓',
                    text: event.data.loot
                        ? `${heroName} finds treasure among the fallen!`
                        : narratives[Math.floor(event.time) % narratives.length],
                };
            }

            case 'quest_complete': {
                if (event.data.success === false) {
                    return {
                        type: 'defeat',
                        icon: '💀',
                        text: `${heroName} has fallen in battle...`,
                    };
                }
                return {
                    type: 'complete',
                    icon: '🏆',
                    text: `${heroName} completes the quest! Earned ${event.data.totalGold}g and ${event.data.totalXp} XP!`,
                };
            }

            default:
                return null;
        }
    },

    // ==================== COMBAT RESULTS MODAL ====================

    /**
     * Show combat results
     */
    showCombatResults(quest, results, hero) {
        const modal = document.getElementById('combat-modal');
        const content = modal.querySelector('.modal-content');

        const isVictory = results.success;
        const resultClass = isVictory ? 'victory' : 'defeat';

        content.innerHTML = `
            <div class="modal-header">
                <h2>Quest ${isVictory ? 'Complete' : 'Failed'}: ${quest.name}</h2>
                <button class="modal-close" onclick="Modals.hide('combat-modal')">×</button>
            </div>
            <div class="modal-body">
                <div class="combat-summary">
                    <div class="combat-result ${resultClass}">
                        <h3>${isVictory ? '⚔️ Victory!' : '💀 Defeat'}</h3>
                        <p>${isVictory ? `${hero.name} returned triumphant!` : `${hero.name} has fallen...`}</p>
                    </div>
                </div>

                ${isVictory ? `
                    <div class="loot-display">
                        <h4 class="loot-header">Rewards</h4>
                        <div style="margin-bottom: 1rem;">
                            <span>💰 ${results.totalGold}g</span>
                            <span style="margin-left: 1rem;">✨ ${results.totalXp} XP</span>
                        </div>
                        ${results.loot.length > 0 ? `
                            <h4>Loot Found</h4>
                            <div class="loot-grid">
                                ${results.loot.map(item => `
                                    <div class="loot-item new ${UI.getRarityClass(item.rarity)}">
                                        <div class="gear-icon">${item.icon}</div>
                                        <div class="gear-name">${item.displayName}</div>
                                        <div class="gear-slot">${Utils.capitalize(item.slot)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                ` : `
                    <div style="text-align: center; padding: 2rem; color: var(--color-blood);">
                        <p>All equipped items have been lost.</p>
                    </div>
                `}

                <details style="margin-top: 1rem;">
                    <summary style="cursor: pointer; color: var(--color-ink-faded);">
                        View Combat Log (${results.encounters.length} encounters)
                    </summary>
                    <div class="combat-rounds">
                        ${results.encounters.map((enc, i) => `
                            <div class="combat-round">
                                <div class="round-header">Encounter ${i + 1}</div>
                                ${enc.result.rounds.slice(0, 3).map(round => `
                                    ${round.actions.map(action => `
                                        <div class="combat-action ${action.killed ? 'action-damage' : ''}">
                                            ${action.description}
                                        </div>
                                    `).join('')}
                                `).join('')}
                                ${enc.result.rounds.length > 3 ? `<div class="combat-action">... and ${enc.result.rounds.length - 3} more rounds</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </details>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="Modals.hide('combat-modal')">Continue</button>
            </div>
        `;

        this.show('combat-modal');
    },
};

Object.freeze(Modals);
