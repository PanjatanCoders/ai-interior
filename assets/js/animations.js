/**
 * Animation Management System
 * Handles scroll animations, intersection observers, and interactive effects
 */

class AnimationManager {
    constructor() {
        this.animatedElements = [];
        this.intersectionObserver = null;
        this.scrollAnimations = new Map();
        this.isReducedMotion = false;
        
        this.init();
    }

    init() {
        this.checkReducedMotion();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAnimations();
            });
        } else {
            this.setupAnimations();
        }
    }

    checkReducedMotion() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Listen for changes in motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.handleMotionPreferenceChange();
        });
    }

    handleMotionPreferenceChange() {
        if (this.isReducedMotion) {
            // Disable animations
            document.documentElement.classList.add('reduce-motion');
            this.disableAnimations();
        } else {
            // Re-enable animations
            document.documentElement.classList.remove('reduce-motion');
            this.enableAnimations();
        }
    }

    setupAnimations() {
        if (this.isReducedMotion) {
            document.documentElement.classList.add('reduce-motion');
            return;
        }

        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupTypewriterEffects();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0.1, 0.3, 0.5, 0.7]
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.handleIntersection(entry);
            });
        }, options);

        // Observe elements with animation classes
        this.observeAnimationElements();
    }

    observeAnimationElements() {
        const animationSelectors = [
            '.fade-in-up',
            '.fade-in-left',
            '.fade-in-right',
            '.slide-in-bottom',
            '.slide-in-top',
            '.scale-in',
            '.rotate-in',
            '.card',
            '.service-card',
            '.portfolio-item',
            '.process-step',
            '.testimonial',
            '.advantage-card',
            '.stat-card',
            '.trust-item'
        ];

        animationSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!el.classList.contains('no-animate')) {
                    this.animatedElements.push(el);
                    this.intersectionObserver.observe(el);
                    
                    // Add initial state
                    el.classList.add('animate-element');
                    if (!el.classList.contains('animated')) {
                        el.style.opacity = '0';
                        el.style.transform = this.getInitialTransform(el);
                    }
                }
            });
        });
    }

    getInitialTransform(element) {
        if (element.classList.contains('fade-in-up') || element.classList.contains('slide-in-bottom')) {
            return 'translateY(30px)';
        }
        if (element.classList.contains('fade-in-left')) {
            return 'translateX(-30px)';
        }
        if (element.classList.contains('fade-in-right')) {
            return 'translateX(30px)';
        }
        if (element.classList.contains('slide-in-top')) {
            return 'translateY(-30px)';
        }
        if (element.classList.contains('scale-in')) {
            return 'scale(0.8)';
        }
        if (element.classList.contains('rotate-in')) {
            return 'rotate(-10deg) scale(0.8)';
        }
        return 'translateY(20px)';
    }

    handleIntersection(entry) {
        const element = entry.target;
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            this.animateElement(element);
        }
    }

    animateElement(element) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated');
        
        // Calculate stagger delay for grouped elements
        const delay = this.calculateStaggerDelay(element);
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0) translateY(0) scale(1) rotate(0)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Add bounce effect for special elements
            if (element.classList.contains('bounce-in')) {
                element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }
            
            // Trigger custom animation event
            element.dispatchEvent(new CustomEvent('elementAnimated', {
                detail: { element, timestamp: Date.now() }
            }));
            
        }, delay);
    }

    calculateStaggerDelay(element) {
        // Find if element is part of a group
        const parent = element.closest('.row, .services-grid, .portfolio-grid, .process-steps');
        if (!parent) return 0;
        
        const siblings = Array.from(parent.children).filter(child => 
            child.classList.contains('animate-element')
        );
        
        const index = siblings.indexOf(element);
        return index * 100; // 100ms stagger
    }

    setupScrollAnimations() {
        // Parallax scrolling for hero background
        const heroElements = document.querySelectorAll('.hero-bg img');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }, { passive: true });

        // Header background opacity on scroll
        this.setupHeaderScrollEffect();
    }

    setupHeaderScrollEffect() {
        const header = document.getElementById('main-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(scrolled / 100, 0.95);
            
            header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
            if (window.getTheme && window.getTheme() === 'dark') {
                header.style.backgroundColor = `rgba(26, 26, 26, ${opacity})`;
            }
        }, { passive: true });
    }

    setupHoverEffects() {
        // Enhanced card hover effects
        this.setupCardHoverEffects();
        
        // Button ripple effects
        this.setupButtonRippleEffects();
        
        // Image hover effects
        this.setupImageHoverEffects();
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.card, .service-card, .portfolio-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupButtonRippleEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.isReducedMotion) return;
                
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupImageHoverEffects() {
        const images = document.querySelectorAll('.portfolio-item img, .gallery-item img');
        
        images.forEach(img => {
            const container = img.parentElement;
            
            container.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    img.style.transform = 'scale(1.1)';
                    img.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            });
            
            container.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    }

    setupLoadingAnimations() {
        // Loading screen animation
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transition = 'opacity 0.5s ease';
                    
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 1000);
            });
        }

        // Stagger animation for navigation items
        this.staggerNavItems();
    }

    staggerNavItems() {
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 100 * index);
        });
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            if (this.isReducedMotion) return;
            
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number, .hero-stats .stat-number');
        
        counters.forEach(counter => {
            this.intersectionObserver.observe(counter);
            
            counter.addEventListener('elementAnimated', () => {
                this.animateCounter(counter);
            });
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const start = Date.now();
        const originalText = element.textContent;
        
        const updateCounter = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            // Preserve original formatting
            element.textContent = originalText.replace(/\d+/, current);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }

    setupTypewriterEffects() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            this.intersectionObserver.observe(element);
            
            element.addEventListener('elementAnimated', () => {
                this.typewriterEffect(element);
            });
        });
    }

    typewriterEffect(element) {
        const text = element.textContent;
        const speed = element.dataset.speed || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i > text.length) {
                clearInterval(timer);
                // Remove cursor after animation
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }

    // Floating animation for specific elements
    setupFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            if (this.isReducedMotion) return;
            
            const duration = 3000 + (index * 500); // Varied duration
            const amplitude = 10 + (index * 5); // Varied amplitude
            
            setInterval(() => {
                element.style.transform = `translateY(${amplitude}px)`;
                element.style.transition = `transform ${duration}ms ease-in-out`;
                
                setTimeout(() => {
                    element.style.transform = `translateY(-${amplitude}px)`;
                }, duration / 2);
            }, duration);
        });
    }

    // Text reveal animations
    setupTextRevealAnimations() {
        const textElements = document.querySelectorAll('.text-reveal');
        
        textElements.forEach(element => {
            this.intersectionObserver.observe(element);
            
            element.addEventListener('elementAnimated', () => {
                this.revealText(element);
            });
        });
    }

    revealText(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word">${word}</span>`
        ).join(' ');
        
        const wordElements = element.querySelectorAll('.word');
        
        wordElements.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(20px)';
            word.style.display = 'inline-block';
            
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
                word.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }, index * 100);
        });
    }

    // Scroll-triggered animations for specific sections
    setupSectionAnimations() {
        // Hero section animations
        this.setupHeroAnimations();
        
        // Services section animations
        this.setupServicesAnimations();
        
        // Portfolio section animations
        this.setupPortfolioAnimations();
    }

    setupHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;
        
        // Initial state
        const elements = heroContent.querySelectorAll('h1, p, .btn, .hero-stats');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 200}ms`;
            }, 500);
        });
    }

    setupServicesAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    setupPortfolioAnimations() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                if (this.isReducedMotion) return;
                
                // Pulse animation on click
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // Utility methods
    disableAnimations() {
        // Remove all animations and transitions
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    enableAnimations() {
        // Remove disable animations style
        const disableStyle = document.querySelector('style[data-disable-animations]');
        if (disableStyle) {
            disableStyle.remove();
        }
    }

    // Public methods
    animateElementManually(element, animationType = 'fadeInUp') {
        if (this.isReducedMotion) return;
        
        element.classList.add('animate-element', animationType);
        this.animateElement(element);
    }

    resetAnimation(element) {
        element.classList.remove('animated');
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(element);
    }

    pauseAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    resumeAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }
}

// CSS for additional animations
const animationCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .loading-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .floating-element {
        animation-play-state: var(--animation-play-state, running);
    }
    
    .pulse-animation {
        animation: pulse 2s infinite;
    }
`;

// Inject animation CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Initialize animation manager
const animationManager = new AnimationManager();

// Export for global access
window.AnimationManager = animationManager;

// Utility functions
window.animateElement = (element, type) => animationManager.animateElementManually(element, type);
window.pauseAnimations = () => animationManager.pauseAnimations();
window.resumeAnimations = () => animationManager.resumeAnimations();

console.log('✨ Animation Manager initialized successfully');