/**
 * Utility Functions
 * Common helper functions used across the interior design website
 */

// ==========================================================================
// DOM Utilities
// ==========================================================================

const DOMUtils = {
    /**
     * Query selector with error handling
     */
    $(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`, error);
            return null;
        }
    },

    /**
     * Query all with error handling
     */
    $$(selector, context = document) {
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`, error);
            return [];
        }
    },

    /**
     * Create element with attributes and content
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    },

    /**
     * Get element's offset from document top
     */
    getOffset(element) {
        let top = 0;
        let left = 0;
        
        while (element) {
            top += element.offsetTop;
            left += element.offsetLeft;
            element = element.offsetParent;
        }
        
        return { top, left };
    },

    /**
     * Add multiple event listeners
     */
    addEvents(element, events, handler, options = {}) {
        events.split(' ').forEach(event => {
            element.addEventListener(event.trim(), handler, options);
        });
    },

    /**
     * Remove multiple event listeners
     */
    removeEvents(element, events, handler, options = {}) {
        events.split(' ').forEach(event => {
            element.removeEventListener(event.trim(), handler, options);
        });
    }
};

// ==========================================================================
// Performance Utilities
// ==========================================================================

const PerformanceUtils = {
    /**
     * Debounce function execution
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    /**
     * Throttle function execution
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Request animation frame with fallback
     */
    requestAnimFrame(callback) {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        )(callback);
    },

    /**
     * Cancel animation frame with fallback
     */
    cancelAnimFrame(id) {
        return (
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            function(id) {
                clearTimeout(id);
            }
        )(id);
    },

    /**
     * Measure function execution time
     */
    measurePerformance(func, name = 'Anonymous Function') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`);
        return result;
    }
};

// ==========================================================================
// Data Utilities
// ==========================================================================

const DataUtils = {
    /**
     * Deep clone object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => DataUtils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            Object.keys(obj).forEach(key => {
                clonedObj[key] = DataUtils.deepClone(obj[key]);
            });
            return clonedObj;
        }
    },

    /**
     * Merge objects deeply
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (DataUtils.isObject(target) && DataUtils.isObject(source)) {
            for (const key in source) {
                if (DataUtils.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    DataUtils.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return DataUtils.deepMerge(target, ...sources);
    },

    /**
     * Check if value is object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },

    /**
     * Get nested property safely
     */
    getNestedProperty(obj, path, defaultValue = undefined) {
        const keys = path.split('.');
        let current = obj;

        for (const key of keys) {
            if (current === null || current === undefined || !(key in current)) {
                return defaultValue;
            }
            current = current[key];
        }

        return current;
    },

    /**
     * Set nested property safely
     */
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;

        for (const key of keys) {
            if (!(key in current) || !DataUtils.isObject(current[key])) {
                current[key] = {};
            }
            current = current[key];
        }

        current[lastKey] = value;
        return obj;
    }
};

// ==========================================================================
// Validation Utilities
// ==========================================================================

const ValidationUtils = {
    /**
     * Email validation
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Phone number validation (Indian format)
     */
    isValidPhone(phone) {
        const phoneRegex = /^(\+91|91|0)?[6789]\d{9}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    },

    /**
     * URL validation
     */
    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Empty or whitespace validation
     */
    isEmpty(value) {
        return value === null || value === undefined || 
               (typeof value === 'string' && value.trim() === '');
    },

    /**
     * String length validation
     */
    isValidLength(value, min = 0, max = Infinity) {
        const length = value ? value.length : 0;
        return length >= min && length <= max;
    },

    /**
     * Number range validation
     */
    isInRange(value, min = -Infinity, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    /**
     * Sanitize HTML input
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};

// ==========================================================================
// Format Utilities
// ==========================================================================

const FormatUtils = {
    /**
     * Format currency (Indian Rupees)
     */
    formatCurrency(amount, currency = 'INR') {
        if (typeof amount !== 'number') {
            amount = parseFloat(amount) || 0;
        }

        if (currency === 'INR') {
            // Indian number system formatting
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Format large numbers with suffixes
     */
    formatNumber(num) {
        if (num >= 10000000) {
            return (num / 10000000).toFixed(1) + 'Cr';
        }
        if (num >= 100000) {
            return (num / 100000).toFixed(1) + 'L';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    /**
     * Format date
     */
    formatDate(date, format = 'short') {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const options = {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            datetime: { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
            }
        };

        return new Intl.DateTimeFormat('en-IN', options[format]).format(date);
    },

    /**
     * Format phone number for display
     */
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        
        if (cleaned.length === 11 && cleaned.startsWith('0')) {
            return `${cleaned.slice(0, 6)} ${cleaned.slice(6)}`;
        }
        
        if (cleaned.length === 12 && cleaned.startsWith('91')) {
            return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
        }
        
        return phone;
    },

    /**
     * Truncate text with ellipsis
     */
    truncateText(text, maxLength = 100, suffix = '...') {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    },

    /**
     * Convert to title case
     */
    toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },

    /**
     * Convert to slug (URL-friendly)
     */
    toSlug(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};

// ==========================================================================
// Browser Utilities
// ==========================================================================

const BrowserUtils = {
    /**
     * Detect user agent
     */
    getUserAgent() {
        const ua = navigator.userAgent;
        return {
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
            isDesktop: !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isIOS: /iPad|iPhone|iPod/.test(ua),
            isAndroid: /Android/.test(ua),
            isChrome: /Chrome/.test(ua),
            isFirefox: /Firefox/.test(ua),
            isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
            isEdge: /Edg/.test(ua)
        };
    },

    /**
     * Get viewport dimensions
     */
    getViewport() {
        return {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
    },

    /**
     * Check feature support
     */
    supports: {
        localStorage: (() => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch {
                return false;
            }
        })(),
        
        webp: (() => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('webp') > -1;
        })(),
        
        intersectionObserver: 'IntersectionObserver' in window,
        serviceWorker: 'serviceWorker' in navigator,
        webShare: 'share' in navigator
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                return false;
            }
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                textArea.remove();
                return true;
            } catch {
                textArea.remove();
                return false;
            }
        }
    },

    /**
     * Get scroll position
     */
    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    }
};

// ==========================================================================
// Storage Utilities
// ==========================================================================

const StorageUtils = {
    /**
     * Local storage with JSON support and error handling
     */
    localStorage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('LocalStorage set failed:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('LocalStorage get failed:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('LocalStorage remove failed:', error);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.warn('LocalStorage clear failed:', error);
                return false;
            }
        }
    },

    /**
     * Session storage with JSON support
     */
    sessionStorage: {
        set(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('SessionStorage set failed:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('SessionStorage get failed:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('SessionStorage remove failed:', error);
                return false;
            }
        }
    }
};

// ==========================================================================
// Network Utilities
// ==========================================================================

const NetworkUtils = {
    /**
     * Check online status
     */
    isOnline() {
        return navigator.onLine;
    },

    /**
     * Simple fetch wrapper with timeout
     */
    async fetchWithTimeout(url, options = {}, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    },

    /**
     * Load script dynamically
     */
    loadScript(src, attributes = {}) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            
            Object.entries(attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });

            script.onload = resolve;
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    },

    /**
     * Load CSS dynamically
     */
    loadCSS(href, attributes = {}) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            Object.entries(attributes).forEach(([key, value]) => {
                link.setAttribute(key, value);
            });

            link.onload = resolve;
            link.onerror = reject;
            
            document.head.appendChild(link);
        });
    }
};

// ==========================================================================
// Color Utilities
// ==========================================================================

const ColorUtils = {
    /**
     * Convert hex to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert RGB to hex
     */
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /**
     * Get contrast color (black or white)
     */
    getContrastColor(hexColor) {
        const rgb = ColorUtils.hexToRgb(hexColor);
        if (!rgb) return '#000000';
        
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    },

    /**
     * Lighten color
     */
    lightenColor(hex, percent) {
        const rgb = ColorUtils.hexToRgb(hex);
        if (!rgb) return hex;
        
        const amount = Math.round(2.55 * percent);
        const r = Math.min(255, rgb.r + amount);
        const g = Math.min(255, rgb.g + amount);
        const b = Math.min(255, rgb.b + amount);
        
        return ColorUtils.rgbToHex(r, g, b);
    },

    /**
     * Darken color
     */
    darkenColor(hex, percent) {
        const rgb = ColorUtils.hexToRgb(hex);
        if (!rgb) return hex;
        
        const amount = Math.round(2.55 * percent);
        const r = Math.max(0, rgb.r - amount);
        const g = Math.max(0, rgb.g - amount);
        const b = Math.max(0, rgb.b - amount);
        
        return ColorUtils.rgbToHex(r, g, b);
    }
};

// ==========================================================================
// Export utilities to global scope
// ==========================================================================

// Make utilities available globally
window.Utils = {
    DOM: DOMUtils,
    Performance: PerformanceUtils,
    Data: DataUtils,
    Validation: ValidationUtils,
    Format: FormatUtils,
    Browser: BrowserUtils,
    Storage: StorageUtils,
    Network: NetworkUtils,
    Color: ColorUtils
};

// Legacy support - expose individual utilities
window.$ = DOMUtils.$;
window.$$ = DOMUtils.$$;
window.debounce = PerformanceUtils.debounce;
window.throttle = PerformanceUtils.throttle;

console.log('🔧 Utility functions loaded successfully');