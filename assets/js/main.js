/**
 * Main Application Controller
 * Handles component loading, initialization, form handling, and global functionality
 */

class InteriorDesignApp {
    constructor() {
        this.components = new Map();
        this.isLoaded = false;
        this.loadingScreen = null;
        this.whatsappButton = null;
        this.contactForm = null;
        this.newsletterForm = null;
        
        this.init();
    }

    init() {
        // Initialize immediately for critical functionality
        this.setupLoadingScreen();
        this.setupErrorHandling();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.loadComponents()
            .then(() => {
                this.setupGlobalFeatures();
                this.bindGlobalEvents();
                this.initializeForms();
                this.setupWhatsAppIntegration();
                this.setupSEOFeatures();
                this.finalizeLoading();
            })
            .catch(error => {
                console.error('Failed to initialize app:', error);
                this.handleInitializationError(error);
            });
    }

    async loadComponents() {
        const componentPromises = [
            this.loadComponent('header', 'components/header.html'),
            this.loadComponent('hero', 'components/hero-section.html'),
            this.loadComponent('about', 'components/about-section.html'),
            this.loadComponent('services', 'components/services-section.html'),
            this.loadComponent('portfolio', 'components/portfolio-section.html'),
            this.loadComponent('why-choose', 'components/why-choose-section.html'),
            this.loadComponent('process', 'components/process-section.html'),
            this.loadComponent('testimonials', 'components/testimonials-section.html'),
            this.loadComponent('blog', 'components/blog-section.html'),
            this.loadComponent('contact', 'components/contact-section.html'),
            this.loadComponent('footer', 'components/footer.html')
        ];

        try {
            await Promise.all(componentPromises);
            console.log('✅ All components loaded successfully');
        } catch (error) {
            console.error('❌ Component loading failed:', error);
            throw error;
        }
    }

    async loadComponent(name, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${name}: ${response.status}`);
            }
            
            const html = await response.text();
            const placeholder = document.getElementById(`${name}-section`) || 
                              document.getElementById(`${name}-placeholder`);
            
            if (placeholder) {
                placeholder.innerHTML = html;
                this.components.set(name, placeholder);
            } else {
                console.warn(`Placeholder not found for component: ${name}`);
            }
        } catch (error) {
            console.error(`Failed to load component ${name}:`, error);
            // Load fallback content or show error message
            this.loadFallbackComponent(name);
        }
    }

    loadFallbackComponent(name) {
        const placeholder = document.getElementById(`${name}-section`) || 
                          document.getElementById(`${name}-placeholder`);
        
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="component-error">
                    <p>Unable to load ${name} section. Please refresh the page.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Refresh Page</button>
                </div>
            `;
        }
    }

    setupLoadingScreen() {
        this.loadingScreen = document.getElementById('loading-screen');
        
        // Add loading screen if not present
        if (!this.loadingScreen) {
            this.loadingScreen = document.createElement('div');
            this.loadingScreen.id = 'loading-screen';
            this.loadingScreen.className = 'loading-screen';
            this.loadingScreen.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Designing Your Experience...</p>
            `;
            document.body.prepend(this.loadingScreen);
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.trackError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.trackError(event.reason);
        });
    }

    setupGlobalFeatures() {
        this.setupScrollIndicator();
        this.setupImageLazyLoading();
        this.setupPerformanceOptimizations();
        this.setupAccessibilityFeatures();
        this.setupAnalytics();
    }

    setupScrollIndicator() {
        // Create scroll progress indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-progress';
        scrollIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: var(--scroll-progress, 0%);
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(scrollIndicator);
    }

    setupImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalAssets();
        
        // Setup resource hints
        this.setupResourceHints();
        
        // Monitor performance
        this.monitorPerformance();
    }

    preloadCriticalAssets() {
        const criticalAssets = [
            'assets/css/main.css',
            'assets/images/hero/hero-bg.jpg',
            'assets/fonts/inter.woff2',
            'assets/fonts/playfair-display.woff2'
        ];

        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset;
            
            if (asset.includes('.css')) {
                link.as = 'style';
            } else if (asset.includes('.jpg') || asset.includes('.png')) {
                link.as = 'image';
            } else if (asset.includes('.woff')) {
                link.as = 'font';
                link.type = 'font/woff2';
                link.crossOrigin = 'anonymous';
            }
            
            document.head.appendChild(link);
        });
    }

    setupResourceHints() {
        const hints = [
            { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
            { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossOrigin: true },
            { href: 'https://cdnjs.cloudflare.com', rel: 'dns-prefetch' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.assign(link, hint);
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    
                    if (perfData) {
                        const metrics = {
                            loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                            domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
                            firstByte: Math.round(perfData.responseStart - perfData.navigationStart)
                        };
                        
                        console.log('⚡ Performance Metrics:', metrics);
                        this.trackPerformance(metrics);
                    }
                }, 1000);
            });
        }
    }

    setupAccessibilityFeatures() {
        // Skip navigation link
        this.addSkipNavigation();
        
        // Enhanced focus management
        this.setupFocusManagement();
        
        // Keyboard navigation improvements
        this.setupKeyboardNavigation();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
    }

    addSkipNavigation() {
        const skipNav = document.createElement('a');
        skipNav.href = '#main-content';
        skipNav.textContent = 'Skip to main content';
        skipNav.className = 'skip-nav';
        skipNav.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.2s ease;
        `;
        
        skipNav.addEventListener('focus', () => {
            skipNav.style.top = '6px';
        });
        
        skipNav.addEventListener('blur', () => {
            skipNav.style.top = '-40px';
        });
        
        document.body.prepend(skipNav);
    }

    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal[style*="flex"]');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard support for interactive elements
        document.addEventListener('keydown', (e) => {
            // Portfolio navigation
            if (e.key === 'Enter' && e.target.classList.contains('portfolio-item')) {
                e.target.click();
            }
            
            // Filter navigation
            if (e.key === 'Enter' && e.target.classList.contains('filter-btn')) {
                e.target.click();
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Function to announce to screen readers
        window.announceToScreenReader = (message) => {
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        };
    }

    bindGlobalEvents() {
        // Smooth scroll for all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            }
        });

        // Handle external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="http"]');
            if (link && !link.href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });

        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('Connection lost. Some features may not work.', 'warning');
        });
    }

    smoothScrollTo(target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    handleResize() {
        // Trigger custom resize event for components
        window.dispatchEvent(new CustomEvent('appResize', {
            detail: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }));
    }

    initializeForms() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupFormValidation();
    }

    setupContactForm() {
        this.contactForm = document.getElementById('contact-form');
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleContactSubmission(this.contactForm);
        });
    }

    setupNewsletterForm() {
        this.newsletterForm = document.getElementById('newsletter-form');
        if (!this.newsletterForm) return;

        this.newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleNewsletterSubmission(this.newsletterForm);
        });
    }

    setupFormValidation() {
        // Real-time validation for all forms
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // Basic validation rules
        if (field.required && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        } else if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        // Update field styling and message
        this.updateFieldValidation(field, isValid, message);
        return isValid;
    }

    updateFieldValidation(field, isValid, message) {
        const fieldContainer = field.closest('.form-group') || field.parentElement;
        const errorElement = fieldContainer.querySelector('.field-error') || 
                           this.createErrorElement(fieldContainer);

        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    createErrorElement(container) {
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            display: none;
        `;
        container.appendChild(errorElement);
        return errorElement;
    }

    async handleContactSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate all fields
        const fields = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await this.submitContactForm(data);
            
            this.showNotification('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            this.trackFormSubmission('contact', data);
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleNewsletterSubmission(form) {
        const email = form.querySelector('input[type="email"]').value;

        if (!this.validateField(form.querySelector('input[type="email"]'))) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            await this.submitNewsletterForm({ email });
            this.showNotification('Successfully subscribed to our newsletter!', 'success');
            form.reset();
            this.trackFormSubmission('newsletter', { email });
            
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showNotification('Subscription failed. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    }

    async submitContactForm(data) {
        // Use FormHandler for submission
        if (window.FormHandler) {
            return await window.FormHandler.submitContactForm(data);
        }

        // Fallback to WhatsApp if FormHandler not available
        const message = this.formatWhatsAppMessage(data);
        this.openWhatsApp(message);
        return { success: true, message: 'Redirected to WhatsApp' };
    }

    async submitNewsletterForm(data) {
        // Use FormHandler for submission
        if (window.FormHandler) {
            return await window.FormHandler.submitNewsletterForm(data);
        }

        // Fallback - just acknowledge
        return { success: true, message: 'Thank you for subscribing!' };
    }

    formatWhatsAppMessage(data) {
        let message = `*New Contact Form Inquiry*\n\n`;
        message += `*Name:* ${data.name}\n`;
        message += `*Email:* ${data.email}\n`;
        message += `*Phone:* ${data.phone}\n`;
        if (data.service) {
            message += `*Service:* ${data.service}\n`;
        }
        message += `\n*Message:*\n${data.message}`;
        return message;
    }

    setupWhatsAppIntegration() {
        this.whatsappButton = document.querySelector('.whatsapp-float');
        
        if (this.whatsappButton) {
            // Add click tracking
            this.whatsappButton.addEventListener('click', () => {
                this.trackWhatsAppClick();
            });

            // Add floating animation
            this.animateWhatsAppButton();
        }

        // Setup WhatsApp quick actions
        this.setupWhatsAppQuickActions();
    }

    animateWhatsAppButton() {
        if (!this.whatsappButton) return;

        // Pulse animation every 5 seconds
        setInterval(() => {
            this.whatsappButton.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                this.whatsappButton.style.animation = '';
            }, 1000);
        }, 5000);
    }

    setupWhatsAppQuickActions() {
        // Add quick WhatsApp contact buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-whatsapp]')) {
                e.preventDefault();
                const message = e.target.dataset.whatsapp || 
                              "Hi! I'm interested in your interior design services.";
                this.openWhatsApp(message);
            }
        });
    }

    openWhatsApp(message = '') {
        const phoneNumber = '9748007528'; // Replace with actual number
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        this.trackWhatsAppClick(message);
    }

    setupSEOFeatures() {
        // Dynamic meta tags based on current section
        this.setupDynamicMetaTags();
        
        // Structured data
        this.setupStructuredData();
        
        // Breadcrumbs
        // this.setupBreadcrumbs(); // Disabled breadcrumb navigation
    }

    setupDynamicMetaTags() {
        window.addEventListener('scrollProgress', (e) => {
            const currentSection = window.getCurrentSection?.() || 'home';
            this.updateMetaTags(currentSection);
        });
    }

    updateMetaTags(section) {
        const metaDescriptions = {
            home: 'Professional Interior Design Services in Kolkata - Transforming Spaces, Redefining Comfort',
            about: 'About Interior Studio - 10+ years of interior design excellence in Kolkata',
            services: 'Interior Design Services - Residential, Commercial, Custom Furniture in Kolkata',
            portfolio: 'Interior Design Portfolio - Our Best Projects in Kolkata',
            contact: 'Contact Interior Studio - Get Free Consultation for Your Interior Design Project'
        };

        const description = metaDescriptions[section];
        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
        }
    }

    setupStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Interior Design Studio",
            "description": "Professional Interior Design Services in Kolkata",
            "url": window.location.origin,
            "telephone": "+91-9748007528",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Park Street",
                "addressLocality": "Kolkata",
                "addressRegion": "West Bengal",
                "postalCode": "700016",
                "addressCountry": "IN"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "22.5726",
                "longitude": "88.3639"
            },
            "openingHours": "Mo-Sa 09:00-19:00",
            "priceRange": "$",
            "serviceArea": "Kolkata & Nearby Areas"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // setupBreadcrumbs() {
    //     const breadcrumbContainer = document.createElement('nav');
    //     breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');
    //     breadcrumbContainer.className = 'breadcrumb';
    //     breadcrumbContainer.innerHTML = `
    //         <ol class="breadcrumb-list">
    //             <li><a href="#home">Home</a></li>
    //             <li class="current-section">Interior Design</li>
    //         </ol>
    //     `;
    //
    //     // Insert after header
    //     const header = document.querySelector('.header');
    //     if (header) {
    //         header.after(breadcrumbContainer);
    //     }
    // }

    setupAnalytics() {
        // Initialize Google Analytics if gtag is available
        if (typeof gtag !== 'undefined') {
            this.setupGoogleAnalytics();
        }

        // Setup custom analytics
        this.setupCustomAnalytics();
    }

    setupGoogleAnalytics() {
        // Track page views
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });

        // Track scroll depth
        this.trackScrollDepth();
    }

    setupCustomAnalytics() {
        // Track user interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .nav-link, .portfolio-item')) {
                this.trackInteraction('click', e.target);
            }
        });

        // Track time on page
        this.trackTimeOnPage();
    }

    trackScrollDepth() {
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            'percent': milestone,
                            'event_category': 'engagement'
                        });
                    }
                }
            });
        });
    }

    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    'value': timeOnPage,
                    'event_category': 'engagement'
                });
            }
        });
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Manual close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || colors.info;
    }

    // Tracking methods
    trackFormSubmission(formType, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_type': formType,
                'event_category': 'contact'
            });
        }
    }

    trackWhatsAppClick(message = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'message_type': message ? 'custom' : 'default',
                'event_category': 'contact'
            });
        }
    }

    trackInteraction(action, element) {
        const elementType = element.className.includes('btn') ? 'button' :
                          element.className.includes('nav-link') ? 'navigation' :
                          element.className.includes('portfolio-item') ? 'portfolio' : 'other';

        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'element_type': elementType,
                'element_text': element.textContent?.substring(0, 50) || '',
                'event_category': 'interaction'
            });
        }
    }

    trackError(error) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': error.message || error,
                'fatal': false
            });
        }
    }

    trackPerformance(metrics) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'name': 'page_load',
                'value': metrics.loadTime,
                'event_category': 'performance'
            });
        }
    }

    finalizeLoading() {
        // Hide loading screen
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 500);
        }

        // Mark app as loaded
        this.isLoaded = true;
        document.body.classList.add('app-loaded');

        // Dispatch app ready event
        window.dispatchEvent(new CustomEvent('appReady', {
            detail: { timestamp: Date.now() }
        }));

        console.log('🚀 Interior Design App loaded successfully');
    }

    handleInitializationError(error) {
        console.error('App initialization failed:', error);
        
        // Show error message to user
        if (this.loadingScreen) {
            this.loadingScreen.innerHTML = `
                <div class="error-message">
                    <h3>Loading Error</h3>
                    <p>We're having trouble loading the page. Please refresh and try again.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Refresh Page</button>
                </div>
            `;
        }

        this.trackError(error);
    }

    // Public API methods
    getAppStatus() {
        return {
            isLoaded: this.isLoaded,
            componentsLoaded: this.components.size,
            currentTheme: window.getTheme?.() || 'light',
            currentSection: window.getCurrentSection?.() || 'home'
        };
    }

    reloadComponent(componentName) {
        const componentPath = `components/${componentName}-section.html`;
        return this.loadComponent(componentName, componentPath);
    }
}

// Initialize the application
const app = new InteriorDesignApp();

// Export for global access
window.InteriorDesignApp = app;
window.showNotification = (message, type) => app.showNotification(message, type);
window.openWhatsApp = (message) => app.openWhatsApp(message);
window.getAppStatus = () => app.getAppStatus();

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully');
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

console.log('🏠 Interior Design Website initialized successfully');