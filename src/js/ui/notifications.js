/**
 * ============================================
 * GUILD MASTER - Notification System
 * ============================================
 * Handles notification bell UI and history
 * Stores notifications in Supabase
 * ============================================
 */

const NotificationSystem = {
    _notifications: [],
    _unreadCount: 0,
    _isOpen: false,
    _initialized: false,

    /**
     * Initialize the notification system
     */
    async init() {
        if (this._initialized) return;

        // Create notification bell in header
        this._createBellUI();

        // Load notifications from Supabase
        await this.refresh();

        // Listen for events that should create notifications
        this._setupEventListeners();

        this._initialized = true;
        Utils.log('Notification system initialized');
    },

    /**
     * Create the notification bell UI (fixed bottom-right)
     */
    _createBellUI() {
        // Check if bell already exists
        if (document.getElementById('notification-bell')) return;

        // Create bell container
        const bellContainer = Utils.createElement('div', {
            id: 'notification-bell',
            className: 'notification-bell',
        });

        bellContainer.innerHTML = `
            <button class="bell-button" title="Notifications">
                <span class="bell-icon"></span>
                <span class="unread-badge hidden">0</span>
            </button>
            <div class="notification-dropdown hidden">
                <div class="notification-header">
                    <h4>Notifications</h4>
                    <button class="mark-all-read-btn" title="Mark all as read">✓</button>
                </div>
                <div class="notification-list">
                    <div class="notification-empty">No notifications</div>
                </div>
            </div>
        `;

        // Append to body for fixed positioning
        document.body.appendChild(bellContainer);

        // Bind events
        const bellButton = bellContainer.querySelector('.bell-button');
        bellButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Double-click to quickly mark all as read
        bellButton.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (this._unreadCount > 0) {
                this.markAllAsRead();
                Utils.toast('All notifications marked as read', 'success');
            }
        });

        const markAllBtn = bellContainer.querySelector('.mark-all-read-btn');
        markAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.markAllAsRead();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!bellContainer.contains(e.target) && this._isOpen) {
                this.closeDropdown();
            }
        });
    },

    /**
     * Setup event listeners for game events
     */
    _setupEventListeners() {
        // Quest completed
        GameState.on('questCompleted', async ({ quest, hero, results }) => {
            if (results.success) {
                const lootCount = results.loot?.length || 0;
                const soulText = results.totalSouls > 0 ? `, ${results.totalSouls} souls` : '';
                await this.create({
                    type: 'quest_complete',
                    title: `Quest Complete: ${quest.name}`,
                    message: `${hero.name} returned with ${results.totalGold}g${soulText} and ${lootCount} items!`,
                    data: {
                        questId: quest.id,
                        heroId: hero.id,
                        gold: results.totalGold,
                        souls: results.totalSouls || 0,
                        xp: results.totalXp,
                        lootCount,
                    },
                });
            } else {
                await this.create({
                    type: 'quest_failed',
                    title: `Quest Failed: ${quest.name}`,
                    message: `${hero.name} did not survive the quest.`,
                    data: {
                        questId: quest.id,
                        heroId: hero.id,
                    },
                });
            }
        });

        // Hero level up
        GameState.on('heroLevelUp', async ({ hero, newLevel }) => {
            await this.create({
                type: 'level_up',
                title: `Level Up!`,
                message: `${hero.name} reached level ${newLevel}!`,
                data: {
                    heroId: hero.id,
                    newLevel,
                },
            });
        });

        // Hero died
        GameState.on('heroDied', async ({ hero }) => {
            if (hero) {
                await this.create({
                    type: 'hero_died',
                    title: `Hero Fallen`,
                    message: `${hero.name} has perished.`,
                    data: {
                        heroId: hero.id,
                        heroName: hero.name,
                    },
                });
            }
        });
    },

    /**
     * Refresh notifications from Supabase
     */
    async refresh() {
        const userId = GameState.player?.id;
        if (!userId) return;

        try {
            this._notifications = await DB.notifications.getAll(userId, 50);
            this._unreadCount = this._notifications.filter(n => !n.is_read).length;
            this._updateUI();
        } catch (e) {
            Utils.error('Failed to refresh notifications:', e);
        }
    },

    /**
     * Create a new notification
     */
    async create(notification) {
        const userId = GameState.player?.id;
        if (!userId) return;

        try {
            await DB.notifications.create({
                userId,
                ...notification,
            });
            await this.refresh();
        } catch (e) {
            Utils.error('Failed to create notification:', e);
        }
    },

    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId) {
        try {
            await DB.notifications.markAsRead(notificationId);
            await this.refresh();
        } catch (e) {
            Utils.error('Failed to mark notification as read:', e);
        }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
        const userId = GameState.player?.id;
        if (!userId) return;

        try {
            await DB.notifications.markAllAsRead(userId);
            await this.refresh();
        } catch (e) {
            Utils.error('Failed to mark all as read:', e);
        }
    },

    /**
     * Toggle dropdown visibility
     */
    toggleDropdown() {
        if (this._isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    },

    /**
     * Open dropdown
     */
    openDropdown() {
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.classList.remove('hidden');
            this._isOpen = true;
        }
    },

    /**
     * Close dropdown
     */
    closeDropdown() {
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
            this._isOpen = false;
        }
    },

    /**
     * Update the UI with current notifications
     */
    _updateUI() {
        // Update badge
        const badge = document.querySelector('.unread-badge');
        if (badge) {
            if (this._unreadCount > 0) {
                badge.textContent = this._unreadCount > 99 ? '99+' : this._unreadCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        // Update notification list
        const list = document.querySelector('.notification-list');
        if (!list) return;

        if (this._notifications.length === 0) {
            list.innerHTML = '<div class="notification-empty">No notifications</div>';
            return;
        }

        list.innerHTML = this._notifications.map(n => this._createNotificationItem(n)).join('');

        // Bind click handlers
        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', async () => {
                const id = item.dataset.id;
                if (!item.classList.contains('read')) {
                    await this.markAsRead(id);
                }
            });
        });
    },

    /**
     * Create HTML for a notification item
     */
    _createNotificationItem(notification) {
        const icon = this._getTypeIcon(notification.type);
        const timeAgo = this._formatTimeAgo(notification.created_at);
        const readClass = notification.is_read ? 'read' : 'unread';

        return `
            <div class="notification-item ${readClass}" data-id="${notification.id}">
                <div class="notification-icon">${icon}</div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    ${notification.message ? `<div class="notification-message">${notification.message}</div>` : ''}
                    <div class="notification-time">${timeAgo}</div>
                </div>
            </div>
        `;
    },

    /**
     * Get icon for notification type
     */
    _getTypeIcon(type) {
        const icons = {
            quest_complete: '✅',
            quest_failed: '💀',
            level_up: '⬆️',
            hero_died: '☠️',
            loot_drop: '💎',
            achievement: '🏆',
            system: '📢',
        };
        return icons[type] || '📌';
    },

    /**
     * Format timestamp as relative time
     */
    _formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    },
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationSystem };
}
