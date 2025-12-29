/**
 * Form Handler with Multiple Backend Options
 * Supports FormSubmit.co, Web3Forms, and custom backend
 */

class FormHandler {
    constructor() {
        // Configuration - Choose your preferred method
        this.config = {
            // Option 1: FormSubmit.co (Free, no signup needed)
            formSubmit: {
                enabled: true,
                endpoint: 'https://formsubmit.co/ajax/info@aiinterior.in', // Replace with your email
                // Add FormSubmit configuration options
                captcha: false,
                template: 'table'
            },

            // Option 2: Web3Forms (Free, requires API key from web3forms.com)
            web3Forms: {
                enabled: false,
                apiKey: 'YOUR_WEB3FORMS_ACCESS_KEY', // Get from https://web3forms.com
                endpoint: 'https://api.web3forms.com/submit'
            },

            // Option 3: Custom backend API
            customBackend: {
                enabled: false,
                contactEndpoint: '/api/contact.php',
                newsletterEndpoint: '/api/newsletter.php'
            }
        };

        this.init();
    }

    init() {
        console.log('📧 Form Handler initialized');
    }

    /**
     * Submit contact form
     */
    async submitContactForm(data) {
        try {
            // Use FormSubmit.co
            if (this.config.formSubmit.enabled) {
                return await this.submitViaFormSubmit(data);
            }

            // Use Web3Forms
            if (this.config.web3Forms.enabled) {
                return await this.submitViaWeb3Forms(data, 'contact');
            }

            // Use custom backend
            if (this.config.customBackend.enabled) {
                return await this.submitToCustomBackend(
                    this.config.customBackend.contactEndpoint,
                    data
                );
            }

            // Fallback to WhatsApp if no backend is configured
            return await this.fallbackToWhatsApp(data);

        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
    }

    /**
     * Submit newsletter form
     */
    async submitNewsletterForm(data) {
        try {
            // Use FormSubmit.co
            if (this.config.formSubmit.enabled) {
                return await this.submitViaFormSubmit({
                    ...data,
                    _subject: 'New Newsletter Subscription'
                });
            }

            // Use Web3Forms
            if (this.config.web3Forms.enabled) {
                return await this.submitViaWeb3Forms(data, 'newsletter');
            }

            // Use custom backend
            if (this.config.customBackend.enabled) {
                return await this.submitToCustomBackend(
                    this.config.customBackend.newsletterEndpoint,
                    data
                );
            }

            // Fallback - store locally and show message
            return this.handleNewsletterFallback(data);

        } catch (error) {
            console.error('Newsletter submission error:', error);
            throw error;
        }
    }

    /**
     * Submit via FormSubmit.co
     */
    async submitViaFormSubmit(data) {
        const formData = {
            ...data,
            _captcha: this.config.formSubmit.captcha,
            _template: this.config.formSubmit.template
        };

        const response = await fetch(this.config.formSubmit.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`FormSubmit error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            return { success: true, message: 'Form submitted successfully' };
        } else {
            throw new Error(result.message || 'Form submission failed');
        }
    }

    /**
     * Submit via Web3Forms
     */
    async submitViaWeb3Forms(data, formType) {
        const formData = {
            access_key: this.config.web3Forms.apiKey,
            subject: formType === 'contact' ? 'New Contact Form Submission' : 'New Newsletter Subscription',
            from_name: data.name || 'AI Interior Website',
            ...data
        };

        const response = await fetch(this.config.web3Forms.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Web3Forms error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            return { success: true, message: 'Form submitted successfully' };
        } else {
            throw new Error(result.message || 'Form submission failed');
        }
    }

    /**
     * Submit to custom backend
     */
    async submitToCustomBackend(endpoint, data) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Fallback: Open WhatsApp with form data
     */
    async fallbackToWhatsApp(data) {
        const message = this.formatWhatsAppMessage(data);

        if (window.openWhatsApp) {
            window.openWhatsApp(message);
        } else {
            const phoneNumber = '917030400093';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }

        // Simulate successful submission
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Redirected to WhatsApp for direct contact'
                });
            }, 500);
        });
    }

    /**
     * Format contact data for WhatsApp
     */
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

    /**
     * Fallback for newsletter - store locally
     */
    handleNewsletterFallback(data) {
        try {
            // Store newsletter emails locally
            const stored = localStorage.getItem('newsletter_emails') || '[]';
            const emails = JSON.parse(stored);

            if (!emails.includes(data.email)) {
                emails.push(data.email);
                localStorage.setItem('newsletter_emails', JSON.stringify(emails));
            }

            return Promise.resolve({
                success: true,
                message: 'Newsletter subscription stored locally'
            });
        } catch (e) {
            console.warn('Could not store newsletter email:', e);
            return Promise.resolve({
                success: true,
                message: 'Thank you for subscribing!'
            });
        }
    }

    /**
     * Get stored newsletter emails (for admin)
     */
    getNewsletterEmails() {
        try {
            const stored = localStorage.getItem('newsletter_emails') || '[]';
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('Form handler configuration updated');
    }
}

// Create global instance
window.FormHandler = new FormHandler();

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}
