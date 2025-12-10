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
    async showQuestAssignment(quest, availableHeroes, onConfirm) {
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
                        : '<p style="color: var(--color-ink-faded);">Loading heroes...</p>'
                    }
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="Modals.hide('quest-modal')">Cancel</button>
            </div>
        `;

        this.show('quest-modal');

        // Fetch equipment bonuses for all heroes
        const heroEquipment = {};
        for (const hero of availableHeroes) {
            try {
                const equippedItems = await DB.items.getEquipped(hero.id);
                const bonuses = { atk: 0, will: 0, def: 0, spd: 0 };
                for (const item of equippedItems) {
                    const itemStats = item.totalStats;
                    for (const stat of ['atk', 'will', 'def', 'spd']) {
                        if (itemStats[stat]) {
                            bonuses[stat] += itemStats[stat];
                        }
                    }
                }
                heroEquipment[hero.id] = bonuses;
            } catch (e) {
                heroEquipment[hero.id] = { atk: 0, will: 0, def: 0, spd: 0 };
            }
        }

        // Render hero selection with equipment bonuses
        const heroList = content.querySelector('#hero-select-list');
        heroList.innerHTML = '';

        if (availableHeroes.length === 0) {
            heroList.innerHTML = '<p style="color: var(--color-ink-faded);">No heroes available.</p>';
        } else {
            for (const hero of availableHeroes) {
                const bonuses = heroEquipment[hero.id];
                const hasBonuses = bonuses && Object.values(bonuses).some(v => v !== 0);
                const card = HeroCard.create(hero, {
                    equipmentBonuses: hasBonuses ? bonuses : null,
                    onClick: (h) => {
                        if (onConfirm) onConfirm(h);
                        this.hide('quest-modal');
                    },
                });
                heroList.appendChild(card);
            }
        }
    },

    // ==================== HERO DETAIL MODAL ====================

    /**
     * Show hero detail modal
     */
    async showHeroDetail(hero) {
        const modal = document.getElementById('hero-modal');
        const content = modal.querySelector('.modal-content');

        // Get equipped items for this hero
        const equippedItems = await DB.items.getEquipped(hero.id);
        const equippedBySlot = {};
        for (const item of equippedItems) {
            equippedBySlot[item.slot] = item;
        }

        // Calculate equipment stat bonuses
        const equipmentBonuses = { atk: 0, will: 0, def: 0, spd: 0 };
        for (const item of equippedItems) {
            const itemStats = item.totalStats;
            for (const stat of ['atk', 'will', 'def', 'spd']) {
                if (itemStats[stat]) {
                    equipmentBonuses[stat] += itemStats[stat];
                }
            }
        }

        // Check if there are any bonuses to display
        const hasBonuses = Object.values(equipmentBonuses).some(v => v !== 0);

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
                ${UI.createStatDisplay(hero.stats, hasBonuses ? equipmentBonuses : null).outerHTML}

                <h4 style="margin-top: 1rem;">Equipment</h4>
                <div class="equipment-grid">
                    ${this._createEquipmentSlots(hero, equippedBySlot)}
                </div>

                <h4 style="margin-top: 1rem;">Skills ${hero.skillPoints > 0 ? `<span class="skill-points-badge">${hero.skillPoints} points</span>` : ''}</h4>
                <div class="skills-bubbles" id="hero-skills-container">
                    ${hero.skills.map(s => this._createSkillBubble(s, hero)).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="Modals.hide('hero-modal')">Close</button>
            </div>
        `;

        // Bind equipment slot click handlers
        content.querySelectorAll('.equipment-slot').forEach(slot => {
            slot.addEventListener('click', () => this._handleEquipmentSlotClick(hero, slot.dataset.slot, equippedBySlot));
        });

        // Bind skill upgrade handlers
        this._bindSkillUpgradeHandlers(hero);

        this.show('hero-modal');
    },

    /**
     * Create equipment slots HTML
     */
    _createEquipmentSlots(hero, equippedBySlot) {
        const slots = [
            { key: 'weapon', label: 'Weapon', icon: '⚔️' },
            { key: 'helmet', label: 'Head', icon: '⛑️' },
            { key: 'chest', label: 'Chest', icon: '🥋' },
            { key: 'gloves', label: 'Hands', icon: '🧤' },
            { key: 'boots', label: 'Feet', icon: '👢' },
            { key: 'amulet', label: 'Amulet', icon: '📿' },
            { key: 'ring1', label: 'Ring 1', icon: '💍' },
            { key: 'ring2', label: 'Ring 2', icon: '💍' },
        ];

        return slots.map(slot => {
            const item = equippedBySlot[slot.key];
            if (item) {
                // Equipped item
                const rarityClass = UI.getRarityClass(item.rarity);
                const stats = item.totalStats;
                const statsText = Object.entries(stats)
                    .filter(([_, v]) => v !== 0)
                    .map(([stat, value]) => `${value > 0 ? '+' : ''}${value} ${stat.toUpperCase()}`)
                    .join(', ');

                return `
                    <div class="equipment-slot equipped ${rarityClass}" data-slot="${slot.key}" title="Click to unequip">
                        <div class="slot-icon">${item.icon}</div>
                        <div class="slot-info">
                            <div class="slot-name">${item.displayName}</div>
                            <div class="slot-stats">${statsText || 'No stats'}</div>
                        </div>
                    </div>
                `;
            } else {
                // Empty slot
                return `
                    <div class="equipment-slot empty" data-slot="${slot.key}" title="Click to equip from inventory">
                        <div class="slot-icon">${slot.icon}</div>
                        <div class="slot-info">
                            <div class="slot-label">${slot.label}</div>
                            <div class="slot-empty">Empty</div>
                        </div>
                    </div>
                `;
            }
        }).join('');
    },

    /**
     * Handle equipment slot click
     */
    async _handleEquipmentSlotClick(hero, slotKey, equippedBySlot) {
        const equippedItem = equippedBySlot[slotKey];

        if (equippedItem) {
            // Unequip the item
            await GameState.unequipItem(equippedItem.id);
            Utils.toast(`${equippedItem.displayName} unequipped!`, 'info');
            // Refresh modal
            this.showHeroDetail(hero);
        } else {
            // Show inventory items that can go in this slot
            this._showEquipFromInventory(hero, slotKey);
        }
    },

    /**
     * Show modal to equip item from inventory
     */
    _showEquipFromInventory(hero, slotKey) {
        // Get inventory items that match this slot
        const slotMatch = slotKey.replace(/\d/, ''); // ring1/ring2 -> ring
        const availableItems = GameState.inventory.filter(item => {
            if (slotKey === 'ring1' || slotKey === 'ring2') {
                return item.slot === 'ring1' || item.slot === 'ring2';
            }
            return item.slot === slotKey;
        });

        if (availableItems.length === 0) {
            Utils.toast(`No ${slotKey} items in inventory!`, 'warning');
            return;
        }

        const modal = document.getElementById('hero-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="modal-header">
                <h2>Equip ${Utils.capitalize(slotKey)} for ${hero.name}</h2>
                <button class="modal-close" onclick="Modals.showHeroDetail(GameState.getHero('${hero.id}'))">×</button>
            </div>
            <div class="modal-body">
                <div class="inventory-equip-list">
                    ${availableItems.map(item => {
                        const rarityClass = UI.getRarityClass(item.rarity);
                        const stats = item.totalStats;
                        const statsText = Object.entries(stats)
                            .filter(([_, v]) => v !== 0)
                            .map(([stat, value]) => `${value > 0 ? '+' : ''}${value} ${stat.toUpperCase()}`)
                            .join(', ');

                        return `
                            <div class="inventory-item ${rarityClass}" data-item-id="${item.id}">
                                <div class="item-icon">${item.icon}</div>
                                <div class="item-info">
                                    <div class="item-name">${item.displayName}</div>
                                    <div class="item-stats">${statsText || 'No stats'}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="Modals.showHeroDetail(GameState.getHero('${hero.id}'))">Back</button>
            </div>
        `;

        // Bind click handlers for inventory items
        content.querySelectorAll('.inventory-item').forEach(itemEl => {
            itemEl.addEventListener('click', async () => {
                const itemId = itemEl.dataset.itemId;
                await GameState.equipItem(itemId, hero.id);
                const item = GameState.inventory.find(i => i.id === itemId) || { displayName: 'Item' };
                Utils.toast(`Equipped ${item.displayName || 'item'}!`, 'success');
                // Refresh to show updated equipment
                this.showHeroDetail(hero);
            });
        });
    },

    /**
     * Create interactive skill bubble
     */
    _createSkillBubble(skillRef, hero) {
        const skillId = typeof skillRef === 'string' ? skillRef : skillRef.skillId;
        const skillDef = Skills.get(skillId);
        if (!skillDef) return '';

        const rank = skillRef.rank || 1;
        const maxRank = Skills.getMaxRank(skillRef.isDoubled, skillRef.isTripled);
        const canUpgrade = hero.skillPoints > 0 && rank < maxRank;

        // Calculate current and next effect values
        const currentValue = Skills.calcEffectValue(skillDef, rank);
        const nextValue = rank < maxRank ? Skills.calcEffectValue(skillDef, rank + 1) : null;

        // Format effect value display
        const formatEffect = (val) => {
            if (skillDef.activation === SkillActivation.PASSIVE || skillDef.damageType === DamageType.NONE) {
                return `${(val * 100).toFixed(0)}%`;
            }
            return `${(val * 100).toFixed(0)}%`;
        };

        // Build scaling description
        const scalingText = skillDef.scaling.length > 0
            ? skillDef.scaling.map(s => s.toUpperCase()).join(' + ')
            : 'None';

        // Rarity color class
        const rarityClass = `skill-rarity-${skillDef.rarity}`;
        const doubleClass = skillRef.isTripled ? 'tripled' : skillRef.isDoubled ? 'doubled' : '';

        return `
            <div class="skill-bubble ${rarityClass} ${doubleClass}" data-skill-id="${skillId}">
                <div class="skill-bubble-icon">${skillDef.icon}</div>
                <div class="skill-bubble-content">
                    <div class="skill-bubble-header">
                        <span class="skill-bubble-name">${skillDef.name}${skillRef.isTripled ? '³' : skillRef.isDoubled ? '²' : ''}</span>
                        <span class="skill-bubble-rank">Rank ${rank}/${maxRank}</span>
                    </div>
                    <div class="skill-bubble-desc">${skillDef.description}</div>
                    <div class="skill-bubble-info">
                        <span class="skill-type">${Utils.capitalize(skillDef.activation)}</span>
                        <span class="skill-damage-type">${Utils.capitalize(skillDef.damageType)}</span>
                        <span class="skill-scaling">Scales: ${scalingText}</span>
                    </div>
                    <div class="skill-bubble-effect">
                        <span class="effect-current">Effect: ${formatEffect(currentValue)}</span>
                        ${nextValue ? `<span class="effect-next">→ ${formatEffect(nextValue)}</span>` : '<span class="effect-max">MAX</span>'}
                    </div>
                </div>
                ${canUpgrade ? `
                    <button class="skill-upgrade-btn" data-skill-id="${skillId}" data-hero-id="${hero.id}" title="Spend 1 skill point to upgrade">
                        <span class="upgrade-plus">+</span>
                    </button>
                ` : ''}
            </div>
        `;
    },

    /**
     * Bind skill upgrade button handlers
     */
    _bindSkillUpgradeHandlers(hero) {
        const container = document.getElementById('hero-skills-container');
        if (!container) return;

        container.querySelectorAll('.skill-upgrade-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const skillId = btn.dataset.skillId;
                const heroId = btn.dataset.heroId;

                const currentHero = GameState.getHero(heroId);
                if (!currentHero) return;

                const success = currentHero.upgradeSkill(skillId);
                if (success) {
                    await GameState.updateHero(currentHero);
                    Utils.toast(`Upgraded ${Skills.get(skillId).name}!`, 'success');
                    // Refresh modal to show updated skills
                    this.showHeroDetail(currentHero);
                } else {
                    Utils.toast('Cannot upgrade skill', 'warning');
                }
            });
        });
    },

    // ==================== LIVE COMBAT LOG MODAL ====================

    /**
     * Show live combat log for active quest
     */
    _combatLogInterval: null,
    _seenLogEvents: {},  // Track per quest: { questId: Set() }
    _questDisplayHp: {}, // Track HP per quest: { questId: number }

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

        // Initialize tracking for this quest if needed (don't reset if exists)
        if (!this._seenLogEvents[quest.id]) {
            this._seenLogEvents[quest.id] = new Set();
        }

        const combatResults = quest.combatResults;
        const startHp = combatResults?.heroStartingHp ?? hero.maxHp;

        // Initialize HP tracking if needed
        if (this._questDisplayHp[quest.id] === undefined) {
            this._questDisplayHp[quest.id] = startHp;
        }

        // Build initial HTML structure once
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
                            <div class="hp-bar-fill" id="combat-hp-fill" style="width: ${(this._questDisplayHp[quest.id] / hero.maxHp) * 100}%"></div>
                            <span class="hp-text" id="combat-hp-text">${this._questDisplayHp[quest.id]} / ${hero.maxHp} HP</span>
                        </div>
                    </div>
                </div>

                <div class="combat-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="combat-progress-fill" style="width: ${quest.progressPercent}%"></div>
                    </div>
                    <div class="progress-text" id="combat-progress-text">${Math.round(quest.progressPercent)}% - ${Utils.formatTime(quest.timeRemaining)} remaining</div>
                </div>

                <div class="combat-log-scroll" id="combat-log-entries">
                    <div class="combat-log-entry narrative">
                        <span class="log-icon">🚶</span>
                        <span class="log-text">${hero.name} sets out on the quest...</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="Modals.hideCombatLog()">Close</button>
            </div>
        `;

        // Get references to elements we'll update
        const hpFill = content.querySelector('#combat-hp-fill');
        const hpText = content.querySelector('#combat-hp-text');
        const progressFill = content.querySelector('#combat-progress-fill');
        const progressText = content.querySelector('#combat-progress-text');
        const logEntries = content.querySelector('#combat-log-entries');

        // Rebuild log entries that were already seen
        const events = quest.getCurrentEvents();
        for (const event of events) {
            const eventKey = `${event.time}-${event.type}`;
            if (this._seenLogEvents[quest.id].has(eventKey)) {
                // Re-add previously seen events to the display
                const formatted = this._formatCombatEvent(event, hero);
                if (formatted) {
                    const entry = document.createElement('div');
                    entry.className = `combat-log-entry ${formatted.type}`;
                    entry.innerHTML = `
                        <span class="log-icon">${formatted.icon}</span>
                        <span class="log-text">${formatted.text}</span>
                    `;
                    logEntries.appendChild(entry);
                }
            }
        }

        const updateLog = () => {
            // Guard: if quest was cleaned up, stop updating
            if (!this._seenLogEvents[quest.id]) {
                if (this._combatLogInterval) {
                    clearInterval(this._combatLogInterval);
                    this._combatLogInterval = null;
                }
                return;
            }

            const currentEvents = quest.getCurrentEvents();
            const progress = quest.progressPercent;

            // Update progress bar (no flicker - just update values)
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% - ${Utils.formatTime(quest.timeRemaining)} remaining`;

            // Process new events only
            for (const event of currentEvents) {
                const eventKey = `${event.time}-${event.type}`;
                if (this._seenLogEvents[quest.id].has(eventKey)) continue;
                this._seenLogEvents[quest.id].add(eventKey);

                // Update HP based on combat actions
                if (event.type === 'combat_action' && event.data) {
                    // Hero took damage
                    if (!event.data.actorIsHero && event.data.damage) {
                        this._questDisplayHp[quest.id] = Math.max(0, this._questDisplayHp[quest.id] - event.data.damage);
                    }
                    // Hero healed
                    if (event.data.actorIsHero && event.data.healing) {
                        this._questDisplayHp[quest.id] = Math.min(hero.maxHp, this._questDisplayHp[quest.id] + event.data.healing);
                    }
                }

                // Format and add new log entry
                const formatted = this._formatCombatEvent(event, hero);
                if (formatted) {
                    const entry = document.createElement('div');
                    entry.className = `combat-log-entry ${formatted.type}`;
                    entry.innerHTML = `
                        <span class="log-icon">${formatted.icon}</span>
                        <span class="log-text">${formatted.text}</span>
                    `;
                    logEntries.appendChild(entry);
                }
            }

            // Update HP display
            hpFill.style.width = `${(this._questDisplayHp[quest.id] / hero.maxHp) * 100}%`;
            hpText.textContent = `${this._questDisplayHp[quest.id]} / ${hero.maxHp} HP`;

            // Stop updating if quest is complete
            if (quest.isTimeComplete) {
                this.hideCombatLog();
            }
        };

        // Initial update
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
     * Clean up combat log tracking for a quest
     */
    cleanupCombatLog(questId) {
        delete this._seenLogEvents[questId];
        delete this._questDisplayHp[questId];
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
