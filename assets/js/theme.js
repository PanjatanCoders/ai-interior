/**
 * Theme Manager
 * Handles light/dark theme switching and persistence
 */

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.themeToggleButtons = [];

        this.init();
    }

    init() {
        // Apply theme immediately to prevent flash
        this.applyTheme(this.currentTheme);

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupThemeToggle();
                this.watchSystemTheme();
            });
        } else {
            this.setupThemeToggle();
            this.watchSystemTheme();
        }
    }

    getPreferredTheme() {
        // Default to dark theme
        return 'dark';
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));

        // Store preference
        this.storeTheme(theme);
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        // Set color based on theme
        const color = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';
        metaThemeColor.setAttribute('content', color);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleButtons();

        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Switched to ${newTheme} mode`);
        }
    }

    setupThemeToggle() {
        // Find all theme toggle buttons
        this.themeToggleButtons = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');

        if (this.themeToggleButtons.length === 0) {
            console.warn('No theme toggle buttons found, retrying...');
            // Retry after components load
            setTimeout(() => this.setupThemeToggle(), 500);
            return;
        }

        // Add click handlers
        this.themeToggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });

            // Add keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        });

        // Update button states
        this.updateToggleButtons();
        console.log('✅ Theme toggle buttons initialized');
    }

    updateToggleButtons() {
        this.themeToggleButtons.forEach(button => {
            const icon = button.querySelector('i');

            if (icon) {
                // Update icon
                if (this.currentTheme === 'dark') {
                    icon.className = 'fas fa-sun';
                    button.setAttribute('aria-label', 'Switch to light mode');
                    button.setAttribute('title', 'Switch to light mode');
                } else {
                    icon.className = 'fas fa-moon';
                    button.setAttribute('aria-label', 'Switch to dark mode');
                    button.setAttribute('title', 'Switch to dark mode');
                }
            }

            // Update data attribute
            button.setAttribute('data-current-theme', this.currentTheme);
        });
    }

    watchSystemTheme() {
        // Watch for system theme changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Modern browsers
            if (darkModeQuery.addEventListener) {
                darkModeQuery.addEventListener('change', (e) => {
                    // Only auto-switch if user hasn't manually set a preference
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                        this.updateToggleButtons();
                    }
                });
            }
            // Legacy browsers
            else if (darkModeQuery.addListener) {
                darkModeQuery.addListener((e) => {
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                        this.updateToggleButtons();
                    }
                });
            }
        }
    }

    // Public API
    getTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.updateToggleButtons();
        } else {
            console.warn('Invalid theme:', theme);
        }
    }

    reset() {
        try {
            localStorage.removeItem('theme');
        } catch (e) {
            console.warn('Could not reset theme:', e);
        }
        const systemTheme = this.getPreferredTheme();
        this.applyTheme(systemTheme);
        this.updateToggleButtons();
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export global functions
window.getTheme = () => themeManager.getTheme();
window.setTheme = (theme) => themeManager.setTheme(theme);
window.toggleTheme = () => themeManager.toggleTheme();
window.resetTheme = () => themeManager.reset();
window.ThemeManager = themeManager;

console.log('🎨 Theme Manager initialized');
