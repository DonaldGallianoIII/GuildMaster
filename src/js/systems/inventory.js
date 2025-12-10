/**
 * ============================================
 * GUILD MASTER - Inventory System
 * ============================================
 * Handles gear display and equipment management
 * ============================================
 */

const InventorySystem = {
    // Current filter
    _filter: 'all',

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
    },

    /**
     * Render inventory grid
     */
    render() {
        const container = document.getElementById('inventory-grid');
        if (!container) return;

        let items = GameState.inventory;

        // Apply filter
        if (this._filter !== 'all') {
            items = items.filter(item => this.matchesFilter(item, this._filter));
        }

        container.innerHTML = '';

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
            className: `card gear-card ${UI.getRarityClass(item.rarity)}`,
            dataset: { itemId: item.id },
        });

        // Header
        const header = Utils.createElement('div', { className: 'card-header' });
        header.innerHTML = `
            <div class="gear-icon">${item.icon}</div>
            <div class="gear-name">${item.displayName}</div>
            <div class="gear-slot">${Utils.capitalize(item.slot)}</div>
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

        // Footer with equip button
        const footer = Utils.createElement('div', { className: 'card-footer' });
        const equipBtn = UI.createButton('Equip', 'primary', () => {
            this.showEquipModal(item);
        });
        footer.appendChild(equipBtn);
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
