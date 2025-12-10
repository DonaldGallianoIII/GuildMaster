/**
 * ============================================
 * GUILD MASTER - Authentication UI
 * ============================================
 * Login and signup forms with security features
 * ============================================
 */

const AuthUI = {
    // Current mode: 'login' or 'signup'
    _mode: 'login',

    // Rate limiting
    _attempts: 0,
    _lastAttempt: 0,
    _lockoutUntil: 0,

    // Constants
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 60000, // 1 minute
    MIN_PASSWORD_LENGTH: 8,

    /**
     * Initialize auth UI
     */
    init() {
        this.render();
        this.bindEvents();
    },

    /**
     * Render the auth screen
     */
    render() {
        const container = document.getElementById('auth-screen');
        if (!container) return;

        container.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h1 class="auth-title">Guild Master</h1>
                    <p class="auth-subtitle">Manage your guild of heroes</p>
                </div>

                <div class="auth-card">
                    <div class="auth-tabs">
                        <button class="auth-tab ${this._mode === 'login' ? 'active' : ''}" data-mode="login">
                            Sign In
                        </button>
                        <button class="auth-tab ${this._mode === 'signup' ? 'active' : ''}" data-mode="signup">
                            Create Account
                        </button>
                    </div>

                    <form id="auth-form" class="auth-form" novalidate>
                        ${this._mode === 'signup' ? `
                            <div class="form-group">
                                <label for="auth-username">Guild Name</label>
                                <input
                                    type="text"
                                    id="auth-username"
                                    name="username"
                                    placeholder="Your guild's name"
                                    maxlength="30"
                                    autocomplete="username"
                                    required
                                >
                                <span class="field-hint">3-30 characters, letters and numbers only</span>
                            </div>
                        ` : ''}

                        <div class="form-group">
                            <label for="auth-email">Email</label>
                            <input
                                type="email"
                                id="auth-email"
                                name="email"
                                placeholder="your@email.com"
                                autocomplete="email"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="auth-password">Password</label>
                            <input
                                type="password"
                                id="auth-password"
                                name="password"
                                placeholder="${this._mode === 'signup' ? 'Min 8 characters' : 'Enter password'}"
                                autocomplete="${this._mode === 'signup' ? 'new-password' : 'current-password'}"
                                minlength="${this.MIN_PASSWORD_LENGTH}"
                                required
                            >
                            ${this._mode === 'signup' ? `
                                <div class="password-strength" id="password-strength">
                                    <div class="strength-bar"></div>
                                    <span class="strength-text"></span>
                                </div>
                            ` : ''}
                        </div>

                        ${this._mode === 'signup' ? `
                            <div class="form-group">
                                <label for="auth-confirm">Confirm Password</label>
                                <input
                                    type="password"
                                    id="auth-confirm"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    autocomplete="new-password"
                                    required
                                >
                            </div>
                        ` : ''}

                        <div id="auth-error" class="auth-error hidden"></div>
                        <div id="auth-success" class="auth-success hidden"></div>

                        <button type="submit" id="auth-submit" class="btn btn-primary auth-submit">
                            ${this._mode === 'login' ? 'Enter the Guild' : 'Create Guild'}
                        </button>
                    </form>

                    <div class="auth-footer">
                        ${this._mode === 'login' ? `
                            <p>New guild master? <a href="#" class="auth-switch" data-mode="signup">Create an account</a></p>
                        ` : `
                            <p>Already have a guild? <a href="#" class="auth-switch" data-mode="login">Sign in</a></p>
                        `}
                    </div>
                </div>

                <div class="auth-features">
                    <div class="feature">
                        <span class="feature-icon">⚔️</span>
                        <span>Recruit Heroes</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📜</span>
                        <span>Complete Quests</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">💰</span>
                        <span>Build Your Fortune</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Bind event handlers
     */
    bindEvents() {
        const container = document.getElementById('auth-screen');
        if (!container) return;

        // Tab switching
        container.addEventListener('click', (e) => {
            const tab = e.target.closest('.auth-tab, .auth-switch');
            if (tab) {
                e.preventDefault();
                const mode = tab.dataset.mode;
                if (mode && mode !== this._mode) {
                    this._mode = mode;
                    this.render();
                    this.bindEvents();
                }
            }
        });

        // Form submission
        const form = document.getElementById('auth-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Password strength checker (signup only)
        const passwordInput = document.getElementById('auth-password');
        if (passwordInput && this._mode === 'signup') {
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value);
            });
        }

        // Real-time validation
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Check rate limiting
        if (this.isLockedOut()) {
            const remaining = Math.ceil((this._lockoutUntil - Date.now()) / 1000);
            this.showError(`Too many attempts. Please wait ${remaining} seconds.`);
            return;
        }

        const form = e.target;
        const submitBtn = document.getElementById('auth-submit');

        // Get form data
        const email = form.email.value.trim();
        const password = form.password.value;
        const username = form.username?.value.trim();
        const confirmPassword = form.confirmPassword?.value;

        // Validate all fields
        if (!this.validateForm(form)) {
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = this._mode === 'login' ? 'Signing in...' : 'Creating account...';

        this.clearMessages();

        try {
            if (this._mode === 'signup') {
                // Sign up
                const { user, error } = await Auth.signUp(email, password, username);

                if (error) {
                    this.recordAttempt();
                    this.showError(this.formatAuthError(error));
                    return;
                }

                // Check if email confirmation is required
                if (user && !user.confirmed_at) {
                    this.showSuccess('Account created! Please check your email to confirm your account.');
                    this._mode = 'login';
                    setTimeout(() => {
                        this.render();
                        this.bindEvents();
                    }, 3000);
                } else {
                    // Auto-login after signup
                    this.showSuccess('Account created! Entering the guild...');
                    this.resetAttempts();
                    setTimeout(() => {
                        this.onAuthSuccess(user);
                    }, 1000);
                }

            } else {
                // Sign in
                const { user, error } = await Auth.signIn(email, password);

                if (error) {
                    this.recordAttempt();
                    this.showError(this.formatAuthError(error));
                    return;
                }

                this.showSuccess('Welcome back, Guild Master!');
                this.resetAttempts();
                setTimeout(() => {
                    this.onAuthSuccess(user);
                }, 500);
            }

        } catch (error) {
            this.recordAttempt();
            this.showError('An unexpected error occurred. Please try again.');
            Utils.error('Auth error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = this._mode === 'login' ? 'Enter the Guild' : 'Create Guild';
        }
    },

    /**
     * Called when authentication succeeds
     */
    onAuthSuccess(user) {
        // Hide auth screen, show game
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');

        // Emit event for main app to handle
        GameState.emit('authSuccess', { user });
    },

    /**
     * Validate the entire form
     */
    validateForm(form) {
        let isValid = true;

        // Validate email
        const email = form.email;
        if (!this.isValidEmail(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        const password = form.password;
        if (this._mode === 'signup') {
            const passwordValidation = this.validatePassword(password.value);
            if (!passwordValidation.valid) {
                this.showFieldError(password, passwordValidation.message);
                isValid = false;
            }

            // Validate password confirmation
            const confirm = form.confirmPassword;
            if (confirm && confirm.value !== password.value) {
                this.showFieldError(confirm, 'Passwords do not match');
                isValid = false;
            }

            // Validate username
            const username = form.username;
            if (username) {
                const usernameValidation = this.validateUsername(username.value);
                if (!usernameValidation.valid) {
                    this.showFieldError(username, usernameValidation.message);
                    isValid = false;
                }
            }
        } else {
            if (password.value.length === 0) {
                this.showFieldError(password, 'Password is required');
                isValid = false;
            }
        }

        return isValid;
    },

    /**
     * Validate individual field on blur
     */
    validateField(input) {
        const name = input.name;
        const value = input.value.trim();

        switch (name) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(input, 'Please enter a valid email');
                }
                break;
            case 'username':
                if (value) {
                    const result = this.validateUsername(value);
                    if (!result.valid) {
                        this.showFieldError(input, result.message);
                    }
                }
                break;
            case 'password':
                if (value && this._mode === 'signup') {
                    const result = this.validatePassword(value);
                    if (!result.valid) {
                        this.showFieldError(input, result.message);
                    }
                }
                break;
            case 'confirmPassword':
                const password = document.getElementById('auth-password')?.value;
                if (value && value !== password) {
                    this.showFieldError(input, 'Passwords do not match');
                }
                break;
        }
    },

    /**
     * Check if email is valid
     */
    isValidEmail(email) {
        // RFC 5322 simplified regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate username
     */
    validateUsername(username) {
        if (username.length < 3) {
            return { valid: false, message: 'Guild name must be at least 3 characters' };
        }
        if (username.length > 30) {
            return { valid: false, message: 'Guild name must be 30 characters or less' };
        }
        if (!/^[a-zA-Z0-9_\s]+$/.test(username)) {
            return { valid: false, message: 'Guild name can only contain letters, numbers, spaces, and underscores' };
        }
        return { valid: true };
    },

    /**
     * Validate password strength
     */
    validatePassword(password) {
        if (password.length < this.MIN_PASSWORD_LENGTH) {
            return { valid: false, message: `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters` };
        }

        // Check for common weak patterns
        const weakPatterns = ['password', '12345678', 'qwerty', 'letmein', 'welcome'];
        if (weakPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
            return { valid: false, message: 'Password is too common. Please choose a stronger password.' };
        }

        return { valid: true };
    },

    /**
     * Calculate and display password strength
     */
    updatePasswordStrength(password) {
        const strengthEl = document.getElementById('password-strength');
        if (!strengthEl) return;

        const bar = strengthEl.querySelector('.strength-bar');
        const text = strengthEl.querySelector('.strength-text');

        const strength = this.calculatePasswordStrength(password);

        bar.className = 'strength-bar';
        bar.classList.add(strength.class);
        bar.style.width = strength.percent + '%';
        text.textContent = strength.label;
        text.className = 'strength-text ' + strength.class;
    },

    /**
     * Calculate password strength score
     */
    calculatePasswordStrength(password) {
        if (!password) {
            return { percent: 0, class: '', label: '' };
        }

        let score = 0;

        // Length
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        // Determine strength level
        if (score <= 2) {
            return { percent: 25, class: 'weak', label: 'Weak' };
        } else if (score <= 4) {
            return { percent: 50, class: 'fair', label: 'Fair' };
        } else if (score <= 5) {
            return { percent: 75, class: 'good', label: 'Good' };
        } else {
            return { percent: 100, class: 'strong', label: 'Strong' };
        }
    },

    /**
     * Format Supabase auth errors for display
     */
    formatAuthError(error) {
        const message = error.message || error.error_description || String(error);

        // Map common errors to user-friendly messages
        const errorMap = {
            'Invalid login credentials': 'Invalid email or password. Please try again.',
            'Email not confirmed': 'Please check your email and confirm your account first.',
            'User already registered': 'An account with this email already exists. Try signing in.',
            'Password should be at least': `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters.`,
            'rate limit': 'Too many requests. Please wait a moment and try again.',
        };

        for (const [key, value] of Object.entries(errorMap)) {
            if (message.toLowerCase().includes(key.toLowerCase())) {
                return value;
            }
        }

        return message;
    },

    /**
     * Show error message
     */
    showError(message) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    },

    /**
     * Show success message
     */
    showSuccess(message) {
        const successEl = document.getElementById('auth-success');
        if (successEl) {
            successEl.textContent = message;
            successEl.classList.remove('hidden');
        }
    },

    /**
     * Clear all messages
     */
    clearMessages() {
        const errorEl = document.getElementById('auth-error');
        const successEl = document.getElementById('auth-success');
        if (errorEl) errorEl.classList.add('hidden');
        if (successEl) successEl.classList.add('hidden');
    },

    /**
     * Show field-specific error
     */
    showFieldError(input, message) {
        input.classList.add('error');
        const group = input.closest('.form-group');
        if (group) {
            let errorSpan = group.querySelector('.field-error');
            if (!errorSpan) {
                errorSpan = document.createElement('span');
                errorSpan.className = 'field-error';
                group.appendChild(errorSpan);
            }
            errorSpan.textContent = message;
        }
    },

    /**
     * Clear field-specific error
     */
    clearFieldError(input) {
        input.classList.remove('error');
        const group = input.closest('.form-group');
        if (group) {
            const errorSpan = group.querySelector('.field-error');
            if (errorSpan) {
                errorSpan.remove();
            }
        }
    },

    // ==================== RATE LIMITING ====================

    /**
     * Record a failed attempt
     */
    recordAttempt() {
        this._attempts++;
        this._lastAttempt = Date.now();

        if (this._attempts >= this.MAX_ATTEMPTS) {
            this._lockoutUntil = Date.now() + this.LOCKOUT_DURATION;
        }
    },

    /**
     * Reset attempt counter
     */
    resetAttempts() {
        this._attempts = 0;
        this._lockoutUntil = 0;
    },

    /**
     * Check if user is locked out
     */
    isLockedOut() {
        if (this._lockoutUntil && Date.now() < this._lockoutUntil) {
            return true;
        }
        // Reset if lockout expired
        if (this._lockoutUntil && Date.now() >= this._lockoutUntil) {
            this.resetAttempts();
        }
        return false;
    },

    // ==================== SIGN OUT ====================

    /**
     * Handle sign out
     */
    async signOut() {
        await Auth.signOut();

        // Show auth screen, hide game
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');

        // Reset to login mode
        this._mode = 'login';
        this.render();
        this.bindEvents();

        Utils.toast('Signed out successfully', 'info');
    }
};
