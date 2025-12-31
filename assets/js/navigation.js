/**
 * Navigation Manager
 * Handles mobile menu, scroll behavior, sticky header, and navigation interactions
 */

class NavigationManager {
    constructor() {
        this.header = null;
        this.navbar = null;
        this.mobileMenuToggle = null;
        this.navMenu = null;
        this.navLinks = [];
        this.backToTopButton = null;

        this.isMenuOpen = false;
        this.lastScrollPosition = 0;
        this.scrollThreshold = 100;
        this.isScrolling = false;

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupNavigation();
            });
        } else {
            this.setupNavigation();
        }
    }

    setupNavigation() {
        this.cacheElements();
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupBackToTop();
        this.setupActiveNavigation();
        this.setupSmoothScroll();

        console.log('📱 Navigation Manager initialized');
    }

    cacheElements() {
        this.header = document.querySelector('.header');
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.backToTopButton = document.getElementById('back-to-top');

        // Retry if elements not found
        if (!this.backToTopButton) {
            setTimeout(() => {
                this.backToTopButton = document.getElementById('back-to-top');
                if (this.backToTopButton) this.setupBackToTop();
            }, 500);
        }
    }

    setupMobileMenu() {
        if (!this.mobileMenuToggle || !this.navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Toggle menu on button click
        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen &&
                !this.navMenu.contains(e.target) &&
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle resize - close menu when switching to desktop
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            }, 250);
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.navMenu.classList.add('active');
        this.mobileMenuToggle.classList.add('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';

        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Navigation menu opened');
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.mobileMenuToggle.classList.remove('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');

        // Restore body scroll
        document.body.style.overflow = '';

        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Navigation menu closed');
        }
    }

    setupScrollBehavior() {
        if (!this.header) return;

        let scrollTimeout;

        window.addEventListener('scroll', () => {
            // Throttle scroll events
            if (!this.isScrolling) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.isScrolling = false;
                });
                this.isScrolling = true;
            }

            // Update scroll progress
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateScrollProgress();
            }, 10);
        }, { passive: true });
    }

    handleScroll() {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollPosition < 0) return;

        // Header visibility logic
        if (this.header) {
            if (currentScrollPosition < this.scrollThreshold) {
                this.header.classList.remove('hide');
            } else if (currentScrollPosition > this.lastScrollPosition) {
                this.header.classList.add('hide');
            } else {
                this.header.classList.remove('hide');
            }
        }

        this.lastScrollPosition = currentScrollPosition;
        this.updateActiveSection();
        this.updateBackToTopButton();
    }

    updateScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / scrollHeight) * 100;

        document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);

        // Dispatch scroll progress event
        window.dispatchEvent(new CustomEvent('scrollProgress', {
            detail: {
                percent: scrolled,
                position: window.pageYOffset,
                total: scrollHeight
            }
        }));
    }

    setupActiveNavigation() {
        // Highlight active navigation based on current section
        this.updateActiveSection();
    }

    updateActiveSection() {
        if (this.navLinks.length === 0) return;

        const sections = document.querySelectorAll('main > div[id], section[id]');
        const scrollPosition = window.pageYOffset + 150; // Offset for header

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (href && href.includes(`#${currentSection}`)) {
                link.classList.add('active');
            }
        });

        // Store current section globally
        window.currentSection = currentSection;
    }

    setupBackToTop() {
        if (!this.backToTopButton) return;

        this.backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Announce to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Scrolled to top');
            }
        });

        // Initial state
        this.updateBackToTopButton();
    }

    updateBackToTopButton() {
        if (!this.backToTopButton) return;

        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollPosition > 300) {
            this.backToTopButton.classList.add('visible');
        } else {
            this.backToTopButton.classList.remove('visible');
        }
    }

    setupSmoothScroll() {
        // Smooth scroll for anchor links (enhanced version)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');

            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();

                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    this.scrollToElement(targetElement);

                    // Update URL hash without jumping
                    if (history.pushState) {
                        history.pushState(null, null, `#${targetId}`);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            }
        });

        // Handle direct hash navigation on page load
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            }, 500);
        }
    }

    scrollToElement(element) {
        const headerHeight = this.header ? this.header.offsetHeight : 0;
        const targetPosition = element.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Set focus for accessibility
        element.setAttribute('tabindex', '-1');
        element.focus();
    }

    // Public API methods
    openMenu() {
        this.openMobileMenu();
    }

    closeMenu() {
        this.closeMobileMenu();
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    getCurrentSection() {
        return window.currentSection || '';
    }
}

// Initialize navigation manager
const navigationManager = new NavigationManager();

// Export global functions
window.openNav = () => navigationManager.openMenu();
window.closeNav = () => navigationManager.closeMenu();
window.scrollToTop = () => navigationManager.scrollToTop();
window.getCurrentSection = () => navigationManager.getCurrentSection();
window.NavigationManager = navigationManager;

console.log('🧭 Navigation system ready');
