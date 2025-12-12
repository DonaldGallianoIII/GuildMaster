/**
 * ============================================
 * GUILD MASTER - Inventory System
 * ============================================
 * Handles gear display and equipment management
 * ============================================
 */

const InventorySystem = {
    // Current filter and sort
    _filter: 'all',
    _sort: 'newest',

    // Multi-select mode
    _selectedItems: new Set(),

    /**
     * Initialize inventory UI
     */
    init() {
        this.bindEvents();
        this.render();

        // Listen for state changes
        GameState.on('itemEquipped', () => this.render());
        GameState.on('itemUnequipped', () => this.render());
        GameState.on('questCompleted', () => this.render());
        GameState.on('itemSold', () => this.render());
    },

    /**
     * Clear all selections
     */
    clearSelection() {
        this._selectedItems.clear();
        this.updateSelectionUI();
    },

    /**
     * Toggle item selection
     */
    toggleSelection(itemId) {
        if (this._selectedItems.has(itemId)) {
            this._selectedItems.delete(itemId);
        } else {
            this._selectedItems.add(itemId);
        }
        this.updateSelectionUI();
    },

    /**
     * Update selection UI (checkboxes and action bar)
     */
    updateSelectionUI() {
        // Update checkboxes
        document.querySelectorAll('.gear-card').forEach(card => {
            const itemId = card.dataset.itemId;
            const checkbox = card.querySelector('.item-select-checkbox');
            if (checkbox) {
                checkbox.checked = this._selectedItems.has(itemId);
            }
            card.classList.toggle('selected', this._selectedItems.has(itemId));
        });

        // Update action bar
        const actionBar = document.getElementById('inventory-action-bar');
        if (actionBar) {
            const selectedCount = this._selectedItems.size;
            actionBar.style.display = selectedCount > 0 ? 'flex' : 'none';

            const countSpan = actionBar.querySelector('.selected-count');
            if (countSpan) {
                countSpan.textContent = `${selectedCount} selected`;
            }

            // Calculate total sell value
            const totalValue = this.getSelectedSellValue();
            const valueSpan = actionBar.querySelector('.total-sell-value');
            if (valueSpan) {
                valueSpan.textContent = `${totalValue}g`;
            }
        }
    },

    /**
     * Get total sell value of selected items (excluding locked)
     */
    getSelectedSellValue() {
        let total = 0;
        for (const itemId of this._selectedItems) {
            const item = GameState.inventory.find(i => i.id === itemId);
            if (item && !item.isLocked) {
                total += GameState.getSellPrice(item);
            }
        }
        return total;
    },

    /**
     * Sell all selected items (excluding locked)
     */
    async sellSelected() {
        const itemsToSell = [];
        for (const itemId of this._selectedItems) {
            const item = GameState.inventory.find(i => i.id === itemId);
            if (item && !item.isLocked) {
                itemsToSell.push(item);
            }
        }

        if (itemsToSell.length === 0) {
            Utils.toast('No sellable items selected (locked items excluded)', 'warning');
            return;
        }

        let totalGold = 0;
        for (const item of itemsToSell) {
            const price = GameState.getSellPrice(item);
            totalGold += price;
            await GameState.sellItem(item.id);
        }

        this._selectedItems.clear();
        Utils.toast(`Sold ${itemsToSell.length} items for ${totalGold}g!`, 'success');
        this.render();
    },

    /**
     * Toggle lock on item
     */
    async toggleItemLock(itemId) {
        const item = GameState.inventory.find(i => i.id === itemId);
        if (!item) return;

        item.toggleLock();
        await DB.items.save(item);

        Utils.toast(item.isLocked ? `${item.displayName} locked` : `${item.displayName} unlocked`, 'info');
        this.render();
    },

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Apply filter
                this._filter = btn.dataset.filter;
                this.render();
            });
        });

        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Apply sort
                this._sort = btn.dataset.sort;
                this.render();
            });
        });
    },

    /**
     * Render inventory grid
     */
    render() {
        const container = document.getElementById('inventory-grid');
        if (!container) return;

        // Clean up selection - remove items that are no longer in inventory
        const inventoryIds = new Set(GameState.inventory.map(i => i.id));
        for (const itemId of this._selectedItems) {
            if (!inventoryIds.has(itemId)) {
                this._selectedItems.delete(itemId);
            }
        }

        let items = [...GameState.inventory]; // Clone to avoid mutating original

        // Apply filter
        if (this._filter !== 'all') {
            items = items.filter(item => this.matchesFilter(item, this._filter));
        }

        // Apply sort
        items = this.sortItems(items, this._sort);

        container.innerHTML = '';

        // Add action bar for multi-select
        this.renderActionBar(container);

        if (items.length === 0) {
            container.appendChild(UI.createEmptyState(
                this._filter === 'all'
                    ? 'No items in your armory. Complete quests to find loot!'
                    : `No ${this._filter}s found.`
            ));
            return;
        }

        for (const item of items) {
            container.appendChild(this.createGearCard(item));
        }

        // Update selection UI state
        this.updateSelectionUI();
    },

    /**
     * Render the action bar for multi-select operations
     */
    renderActionBar(container) {
        let actionBar = document.getElementById('inventory-action-bar');

        if (!actionBar) {
            actionBar = Utils.createElement('div', {
                id: 'inventory-action-bar',
                className: 'inventory-action-bar',
            });

            actionBar.innerHTML = `
                <span class="selected-count">0 selected</span>
                <span class="total-sell-value-label">Total: <span class="total-sell-value">0g</span></span>
                <button class="btn btn-primary sell-selected-btn">Sell Selected</button>
                <button class="btn btn-secondary clear-selection-btn">Clear</button>
            `;

            // Bind action bar events
            actionBar.querySelector('.sell-selected-btn').addEventListener('click', () => {
                this.sellSelected();
            });

            actionBar.querySelector('.clear-selection-btn').addEventListener('click', () => {
                this.clearSelection();
            });
        }

        actionBar.style.display = this._selectedItems.size > 0 ? 'flex' : 'none';
        container.parentNode.insertBefore(actionBar, container);
    },

    /**
     * Sort items by criteria
     */
    sortItems(items, sortBy) {
        const rarityOrder = { common: 0, magic: 1, rare: 2, unique: 3, heirloom: 4 };
        const slotOrder = { weapon: 0, helmet: 1, chest: 2, gloves: 3, boots: 4, amulet: 5, ring1: 6, ring2: 7 };

        return items.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'rarity':
                    return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
                case 'slot':
                    return (slotOrder[a.slot] || 99) - (slotOrder[b.slot] || 99);
                case 'name':
                    return a.displayName.localeCompare(b.displayName);
                default:
                    return 0;
            }
        });
    },

    /**
     * Check if item matches filter
     */
    matchesFilter(item, filter) {
        switch (filter) {
            case 'weapon':
                return item.slot === 'weapon';
            case 'armor':
                return ['helmet', 'chest', 'gloves', 'boots'].includes(item.slot);
            case 'accessory':
                return ['amulet', 'ring1', 'ring2'].includes(item.slot);
            default:
                return true;
        }
    },

    /**
     * Create gear card
     */
    createGearCard(item) {
        const card = Utils.createElement('div', {
            className: `card gear-card ${UI.getRarityClass(item.rarity)}${item.isLocked ? ' item-locked' : ''}${this._selectedItems.has(item.id) ? ' selected' : ''}`,
            dataset: { itemId: item.id },
        });

        // Selection checkbox
        const selectWrapper = Utils.createElement('div', { className: 'item-select-wrapper' });
        const checkbox = Utils.createElement('input', {
            type: 'checkbox',
            className: 'item-select-checkbox',
        });
        checkbox.checked = this._selectedItems.has(item.id);
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            this.toggleSelection(item.id);
        });
        selectWrapper.appendChild(checkbox);

        // Lock indicator
        if (item.isLocked) {
            const lockIcon = Utils.createElement('span', { className: 'lock-indicator' });
            lockIcon.textContent = '🔒';
            lockIcon.title = 'This item is locked';
            selectWrapper.appendChild(lockIcon);
        }

        card.appendChild(selectWrapper);

        // Header
        const header = Utils.createElement('div', { className: 'card-header' });
        header.innerHTML = `
            <div class="gear-icon">${Utils.escapeHtml(item.icon)}</div>
            <div class="gear-name">${Utils.escapeHtml(item.displayName)}</div>
            <div class="gear-slot">${Utils.escapeHtml(Utils.capitalize(item.slot))}</div>
        `;
        card.appendChild(header);

        // Body - stats
        const body = Utils.createElement('div', { className: 'card-body' });

        // Stats
        const stats = item.totalStats;
        const statsHtml = Object.entries(stats)
            .filter(([_, v]) => v !== 0)
            .map(([stat, value]) => `
                <div class="gear-stat">
                    <span>${stat.toUpperCase()}</span>
                    <span class="gear-stat-positive">${value > 0 ? '+' : ''}${value}</span>
                </div>
            `).join('');

        if (statsHtml) {
            body.innerHTML = `<div class="gear-stats">${statsHtml}</div>`;
        }

        // Special effects
        const effects = item.specialEffects;
        if (effects.length > 0) {
            const affixesDiv = Utils.createElement('div', { className: 'gear-affixes' });
            for (const effect of effects) {
                const affixEl = Utils.createElement('div', { className: 'affix' });
                affixEl.textContent = `${effect.name}: +${effect.value}% ${effect.stat}`;
                affixesDiv.appendChild(affixEl);
            }
            body.appendChild(affixesDiv);
        }

        // Heirloom info
        if (item.isHeirloom) {
            body.innerHTML += `
                <div class="heirloom-info">
                    <div class="heirloom-generation">${this.getGenerationText(item.generation)} Generation Heirloom</div>
                    <div class="heirloom-lineage">Lineage: ${item.lineage.join(' → ')}</div>
                </div>
            `;
        }

        card.appendChild(body);

        // Footer with equip, lock, and sell buttons
        const footer = Utils.createElement('div', { className: 'card-footer' });

        // Lock/Unlock button
        const lockBtn = UI.createButton(item.isLocked ? '🔓' : '🔒', 'icon', async () => {
            await this.toggleItemLock(item.id);
        });
        lockBtn.className = `btn btn-icon lock-btn${item.isLocked ? ' locked' : ''}`;
        lockBtn.title = item.isLocked ? 'Unlock item' : 'Lock item';
        footer.appendChild(lockBtn);

        const equipBtn = UI.createButton('Equip', 'primary', () => {
            this.showEquipModal(item);
        });
        footer.appendChild(equipBtn);

        const sellPrice = GameState.getSellPrice(item);
        if (item.isLocked) {
            const lockedBtn = UI.createButton('Locked', 'secondary');
            lockedBtn.disabled = true;
            lockedBtn.title = 'Unlock this item to sell it';
            footer.appendChild(lockedBtn);
        } else {
            const sellBtn = UI.createButton(`Sell (${sellPrice}g)`, 'secondary', async () => {
                await GameState.sellItem(item.id);
                this.render();
            });
            footer.appendChild(sellBtn);
        }
        card.appendChild(footer);

        return card;
    },

    /**
     * Get generation text (1st, 2nd, 3rd, etc.)
     */
    getGenerationText(gen) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = gen % 100;
        return gen + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    },

    /**
     * Show equip modal to select hero
     */
    showEquipModal(item) {
        const availableHeroes = GameState.availableHeroes;

        if (availableHeroes.length === 0) {
            Utils.toast('No available heroes to equip!', 'warning');
            return;
        }

        // Simple selection - could be expanded into a proper modal
        const modal = document.getElementById('hero-modal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="modal-header">
                <h2>Equip ${item.displayName}</h2>
                <button class="modal-close" onclick="Modals.hide('hero-modal')">×</button>
            </div>
            <div class="modal-body">
                <p>Select a hero to equip this item:</p>
                <div id="equip-hero-list" class="heroes-grid" style="grid-template-columns: 1fr;"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="Modals.hide('hero-modal')">Cancel</button>
            </div>
        `;

        const heroList = content.querySelector('#equip-hero-list');
        for (const hero of availableHeroes) {
            const card = HeroCard.create(hero, {
                onClick: async (h) => {
                    await GameState.equipItem(item.id, h.id);
                    Modals.hide('hero-modal');
                    Utils.toast(`${item.displayName} equipped to ${h.name}!`, 'success');
                },
            });
            heroList.appendChild(card);
        }

        Modals.show('hero-modal');
    },
};

Object.freeze(InventorySystem);
