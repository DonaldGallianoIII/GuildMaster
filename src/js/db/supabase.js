/**
 * ============================================
 * GUILD MASTER - Supabase Integration
 * ============================================
 * Database connection and authentication layer.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Supabase project at supabase.com
 * 2. Run the schema SQL from schema.sql
 * 3. Copy your project URL and anon key to config.js
 *
 * This module provides:
 * - Authentication (sign up, sign in, sign out)
 * - Real-time subscriptions
 * - Database operations wrapper
 * ============================================
 */

/**
 * Supabase client singleton
 * Loaded from CDN in index.html or can be bundled
 */
let supabaseClient = null;

/**
 * Initialize Supabase client
 */
function initSupabase() {
    // Check if Supabase is loaded (from CDN)
    if (typeof supabase === 'undefined') {
        Utils.error('Supabase library not loaded. Add the CDN script or check config.');

        // Create mock client for local development without Supabase
        return createMockClient();
    }

    if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes('YOUR_PROJECT')) {
        Utils.log('Supabase not configured. Using local mock mode.');
        return createMockClient();
    }

    supabaseClient = supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
    );

    Utils.log('Supabase client initialized');
    return supabaseClient;
}

/**
 * Create mock client for offline/development mode
 * Stores everything in localStorage
 */
function createMockClient() {
    Utils.log('Creating mock Supabase client (local storage mode)');

    const mockData = {
        users: JSON.parse(localStorage.getItem('gm_users') || '[]'),
        heroes: JSON.parse(localStorage.getItem('gm_heroes') || '[]'),
        hero_skills: JSON.parse(localStorage.getItem('gm_hero_skills') || '[]'),
        items: JSON.parse(localStorage.getItem('gm_items') || '[]'),
        quests: JSON.parse(localStorage.getItem('gm_quests') || '[]'),
        consumables: JSON.parse(localStorage.getItem('gm_consumables') || '[]'),
        farm_plots: JSON.parse(localStorage.getItem('gm_farm_plots') || '[]'),
    };

    // Current user simulation
    let currentUser = JSON.parse(localStorage.getItem('gm_current_user') || 'null');

    const saveToStorage = (table) => {
        localStorage.setItem(`gm_${table}`, JSON.stringify(mockData[table]));
    };

    // Mock query builder
    const createQueryBuilder = (table) => {
        let filters = [];
        let selectColumns = '*';
        let orderColumn = null;
        let orderAsc = true;
        let limitCount = null;
        let singleResult = false;

        const builder = {
            select(columns = '*') {
                selectColumns = columns;
                return builder;
            },

            eq(column, value) {
                filters.push({ type: 'eq', column, value });
                return builder;
            },

            neq(column, value) {
                filters.push({ type: 'neq', column, value });
                return builder;
            },

            in(column, values) {
                filters.push({ type: 'in', column, values });
                return builder;
            },

            order(column, { ascending = true } = {}) {
                orderColumn = column;
                orderAsc = ascending;
                return builder;
            },

            limit(count) {
                limitCount = count;
                return builder;
            },

            single() {
                singleResult = true;
                return builder;
            },

            async then(resolve) {
                let data = [...(mockData[table] || [])];

                // Apply filters
                for (const filter of filters) {
                    if (filter.type === 'eq') {
                        data = data.filter(row => row[filter.column] === filter.value);
                    } else if (filter.type === 'neq') {
                        data = data.filter(row => row[filter.column] !== filter.value);
                    } else if (filter.type === 'in') {
                        data = data.filter(row => filter.values.includes(row[filter.column]));
                    }
                }

                // Apply ordering
                if (orderColumn) {
                    data.sort((a, b) => {
                        if (orderAsc) return a[orderColumn] > b[orderColumn] ? 1 : -1;
                        return a[orderColumn] < b[orderColumn] ? 1 : -1;
                    });
                }

                // Apply limit
                if (limitCount) {
                    data = data.slice(0, limitCount);
                }

                // Single result
                if (singleResult) {
                    data = data[0] || null;
                }

                resolve({ data, error: null });
            },
        };

        return builder;
    };

    // Mock Supabase client
    supabaseClient = {
        auth: {
            getSession: async () => ({
                data: {
                    session: currentUser ? { user: currentUser } : null,
                },
                error: null,
            }),

            getUser: async () => ({
                data: { user: currentUser },
                error: null,
            }),

            signUp: async ({ email, password }) => {
                const user = {
                    id: Utils.uuid(),
                    email,
                    created_at: Utils.now(),
                };
                mockData.users.push(user);
                saveToStorage('users');
                currentUser = user;
                localStorage.setItem('gm_current_user', JSON.stringify(user));
                return { data: { user }, error: null };
            },

            signInWithPassword: async ({ email, password }) => {
                const user = mockData.users.find(u => u.email === email);
                if (user) {
                    currentUser = user;
                    localStorage.setItem('gm_current_user', JSON.stringify(user));
                    return { data: { user }, error: null };
                }
                return { data: null, error: { message: 'Invalid credentials' } };
            },

            signOut: async () => {
                currentUser = null;
                localStorage.removeItem('gm_current_user');
                return { error: null };
            },

            onAuthStateChange: (callback) => {
                // Simple mock - just return current state
                setTimeout(() => {
                    callback('SIGNED_IN', currentUser ? { user: currentUser } : null);
                }, 100);
                return {
                    data: { subscription: { unsubscribe: () => {} } },
                };
            },
        },

        from: (table) => {
            const queryBuilder = createQueryBuilder(table);

            return {
                ...queryBuilder,

                insert: async (rows) => {
                    const rowArray = Array.isArray(rows) ? rows : [rows];
                    const inserted = rowArray.map(row => ({
                        ...row,
                        id: row.id || Utils.uuid(),
                        created_at: row.created_at || Utils.now(),
                    }));
                    mockData[table] = mockData[table] || [];
                    mockData[table].push(...inserted);
                    saveToStorage(table);
                    return { data: inserted, error: null };
                },

                update: (updates) => ({
                    eq: async (column, value) => {
                        mockData[table] = mockData[table] || [];
                        let updated = [];
                        mockData[table] = mockData[table].map(row => {
                            if (row[column] === value) {
                                const newRow = { ...row, ...updates };
                                updated.push(newRow);
                                return newRow;
                            }
                            return row;
                        });
                        saveToStorage(table);
                        return { data: updated, error: null };
                    },
                }),

                upsert: async (rows) => {
                    const rowArray = Array.isArray(rows) ? rows : [rows];
                    mockData[table] = mockData[table] || [];

                    for (const row of rowArray) {
                        const existingIndex = mockData[table].findIndex(r => r.id === row.id);
                        if (existingIndex >= 0) {
                            mockData[table][existingIndex] = { ...mockData[table][existingIndex], ...row };
                        } else {
                            mockData[table].push({
                                ...row,
                                id: row.id || Utils.uuid(),
                                created_at: row.created_at || Utils.now(),
                            });
                        }
                    }
                    saveToStorage(table);
                    return { data: rowArray, error: null };
                },

                delete: () => ({
                    eq: async (column, value) => {
                        mockData[table] = mockData[table] || [];
                        const deleted = mockData[table].filter(row => row[column] === value);
                        mockData[table] = mockData[table].filter(row => row[column] !== value);
                        saveToStorage(table);
                        return { data: deleted, error: null };
                    },
                }),
            };
        },

        channel: (name) => ({
            on: () => ({ subscribe: () => {} }),
        }),

        removeChannel: () => {},
    };

    return supabaseClient;
}

/**
 * Get the Supabase client (initialize if needed)
 */
function getSupabase() {
    if (!supabaseClient) {
        initSupabase();
    }
    return supabaseClient;
}

/**
 * ============================================
 * AUTHENTICATION HELPERS
 * ============================================
 */
const Auth = {
    /**
     * Get current session
     */
    async getSession() {
        const { data, error } = await getSupabase().auth.getSession();
        if (error) {
            Utils.error('Failed to get session:', error);
            return null;
        }
        return data.session;
    },

    /**
     * Get current user
     */
    async getUser() {
        const { data, error } = await getSupabase().auth.getUser();
        if (error) {
            Utils.error('Failed to get user:', error);
            return null;
        }
        return data.user;
    },

    /**
     * Sign up new user
     */
    async signUp(email, password, username) {
        const { data, error } = await getSupabase().auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) {
            Utils.error('Sign up failed:', error);
            return { user: null, error };
        }

        // Create player profile
        if (data.user) {
            await DB.players.create({
                id: data.user.id,
                email: data.user.email,
                username: username || email.split('@')[0],
                gold: 500, // Starting gold
            });
        }

        return { user: data.user, error: null };
    },

    /**
     * Sign in existing user
     */
    async signIn(email, password) {
        const { data, error } = await getSupabase().auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Utils.error('Sign in failed:', error);
            return { user: null, error };
        }

        return { user: data.user, error: null };
    },

    /**
     * Sign out
     */
    async signOut() {
        const { error } = await getSupabase().auth.signOut();
        if (error) {
            Utils.error('Sign out failed:', error);
        }
        return { error };
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback) {
        return getSupabase().auth.onAuthStateChange(callback);
    },
};

/**
 * ============================================
 * DATABASE OPERATIONS
 * ============================================
 */
const DB = {
    /**
     * Player profile operations
     */
    players: {
        async get(userId) {
            const { data, error } = await getSupabase()
                .from('players')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                Utils.error('Failed to get player:', error);
                return null;
            }
            return data;
        },

        async create(player) {
            const { data, error } = await getSupabase()
                .from('players')
                .insert(player);

            if (error) {
                Utils.error('Failed to create player:', error);
                return null;
            }
            return data;
        },

        async update(userId, updates) {
            const { data, error } = await getSupabase()
                .from('players')
                .update(updates)
                .eq('id', userId);

            if (error) {
                Utils.error('Failed to update player:', error);
                return null;
            }
            return data;
        },
    },

    /**
     * Hero operations
     */
    heroes: {
        async getAll(userId) {
            const { data, error } = await getSupabase()
                .from('heroes')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                Utils.error('Failed to get heroes:', error);
                return [];
            }
            return data.map(Hero.fromDatabase);
        },

        async get(heroId) {
            const { data, error } = await getSupabase()
                .from('heroes')
                .select('*')
                .eq('id', heroId)
                .single();

            if (error) {
                Utils.error('Failed to get hero:', error);
                return null;
            }
            return Hero.fromDatabase(data);
        },

        async save(hero) {
            const { data, error } = await getSupabase()
                .from('heroes')
                .upsert(hero.toDatabase());

            if (error) {
                Utils.error('Failed to save hero:', error);
                return null;
            }
            return data;
        },

        async delete(heroId) {
            const { error } = await getSupabase()
                .from('heroes')
                .delete()
                .eq('id', heroId);

            if (error) {
                Utils.error('Failed to delete hero:', error);
                return false;
            }
            return true;
        },
    },

    /**
     * Item/Gear operations
     */
    items: {
        async getAll(userId) {
            const { data, error } = await getSupabase()
                .from('items')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                Utils.error('Failed to get items:', error);
                return [];
            }
            return data.map(Gear.fromDatabase);
        },

        async getInventory(userId) {
            // Get unequipped items
            const { data, error } = await getSupabase()
                .from('items')
                .select('*')
                .eq('user_id', userId)
                .is('hero_id', null);

            if (error) {
                Utils.error('Failed to get inventory:', error);
                return [];
            }
            return data.map(Gear.fromDatabase);
        },

        async getEquipped(heroId) {
            const { data, error } = await getSupabase()
                .from('items')
                .select('*')
                .eq('hero_id', heroId);

            if (error) {
                Utils.error('Failed to get equipped items:', error);
                return [];
            }
            return data.map(Gear.fromDatabase);
        },

        async save(item) {
            const { data, error } = await getSupabase()
                .from('items')
                .upsert(item.toDatabase());

            if (error) {
                Utils.error('Failed to save item:', error);
                return null;
            }
            return data;
        },

        async delete(itemId) {
            const { error } = await getSupabase()
                .from('items')
                .delete()
                .eq('id', itemId);

            if (error) {
                Utils.error('Failed to delete item:', error);
                return false;
            }
            return true;
        },
    },

    /**
     * Quest operations
     */
    quests: {
        async getActive(userId) {
            const { data, error } = await getSupabase()
                .from('quests')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active');

            if (error) {
                Utils.error('Failed to get active quests:', error);
                return [];
            }
            return data.map(Quest.fromDatabase);
        },

        async save(quest) {
            const { data, error } = await getSupabase()
                .from('quests')
                .upsert(quest.toDatabase());

            if (error) {
                Utils.error('Failed to save quest:', error);
                return null;
            }
            return data;
        },

        async complete(questId, results) {
            const { data, error } = await getSupabase()
                .from('quests')
                .update({
                    status: 'completed',
                    completed_at: Utils.now(),
                    loot: results.loot,
                    encounter_results: results.encounterResults,
                })
                .eq('id', questId);

            if (error) {
                Utils.error('Failed to complete quest:', error);
                return null;
            }
            return data;
        },
    },

    /**
     * Consumable operations (food, seeds, crops)
     */
    consumables: {
        async getAll(userId) {
            const { data, error } = await getSupabase()
                .from('consumables')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                Utils.error('Failed to get consumables:', error);
                return [];
            }
            return data.map(Consumable.fromDatabase);
        },

        async save(consumable) {
            const { data, error } = await getSupabase()
                .from('consumables')
                .upsert(consumable.toDatabase());

            if (error) {
                Utils.error('Failed to save consumable:', error);
                return null;
            }
            return data;
        },

        async delete(consumableId) {
            const { error } = await getSupabase()
                .from('consumables')
                .delete()
                .eq('id', consumableId);

            if (error) {
                Utils.error('Failed to delete consumable:', error);
                return false;
            }
            return true;
        },

        async deleteByItemId(userId, itemId) {
            const { error } = await getSupabase()
                .from('consumables')
                .delete()
                .eq('user_id', userId)
                .eq('item_id', itemId);

            if (error) {
                Utils.error('Failed to delete consumable by item_id:', error);
                return false;
            }
            return true;
        },
    },

    /**
     * Farm plot operations
     */
    farmPlots: {
        async getAll(userId) {
            const { data, error } = await getSupabase()
                .from('farm_plots')
                .select('*')
                .eq('user_id', userId)
                .order('plot_index', { ascending: true });

            if (error) {
                Utils.error('Failed to get farm plots:', error);
                return [];
            }
            return data.map(FarmPlot.fromDatabase);
        },

        async save(plot) {
            const { data, error } = await getSupabase()
                .from('farm_plots')
                .upsert(plot.toDatabase());

            if (error) {
                Utils.error('Failed to save farm plot:', error);
                return null;
            }
            return data;
        },

        async saveAll(plots) {
            const { data, error } = await getSupabase()
                .from('farm_plots')
                .upsert(plots.map(p => p.toDatabase()));

            if (error) {
                Utils.error('Failed to save farm plots:', error);
                return null;
            }
            return data;
        },
    },
};

Object.freeze(Auth);
Object.freeze(DB);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initSupabase, getSupabase, Auth, DB };
}
