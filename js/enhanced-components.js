/**
 * Enhanced Components System - Phase 2 Implementation
 * ProjectionLab-Inspired Button and Form Components
 */

class EnhancedComponents {
    constructor() {
        this.components = new Map();
        this.themes = this.getProjectionLabThemes();
        this.animations = this.getAnimationConfig();
        this.isInitialized = false;
        
        // Performance monitoring integration
        this.perfMonitor = window.performanceMonitor || null;
    }

    /**
     * Initialize the enhanced components system
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Initialize component systems
            this.setupButtonComponents();
            this.setupFormComponents();
            this.setupLoadingStates();
            this.setupMicroInteractions();
            
            this.isInitialized = true;
            console.log('🎯 Enhanced Components System initialized');
            
            if (this.perfMonitor) {
                this.perfMonitor.trackEvent('components_system_initialized');
            }
            
        } catch (error) {
            console.error('❌ Enhanced Components initialization failed:', error);
        }
    }

    /**
     * ProjectionLab-inspired design themes
     */
    getProjectionLabThemes() {
        return {
            buttons: {
                primary: {
                    background: 'var(--projectionlab-primary)',
                    hover: '#1554A3',
                    text: '#ffffff',
                    shadow: '0 4px 12px rgba(24, 103, 192, 0.3)'
                },
                secondary: {
                    background: 'var(--projectionlab-secondary)',
                    hover: '#1E8A86',
                    text: '#ffffff',
                    shadow: '0 4px 12px rgba(38, 166, 162, 0.3)'
                },
                accent: {
                    background: 'var(--projectionlab-accent)',
                    hover: '#D97706',
                    text: '#ffffff',
                    shadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                },
                outline: {
                    border: 'var(--projectionlab-primary)',
                    text: 'var(--projectionlab-primary)',
                    hover: 'var(--projectionlab-primary)',
                    shadow: '0 2px 8px rgba(24, 103, 192, 0.2)'
                }
            },
            forms: {
                input: {
                    border: '#D1D5DB',
                    focus: 'var(--projectionlab-primary)',
                    background: '#ffffff',
                    text: '#111827',
                    placeholder: '#6B7280'
                },
                validation: {
                    success: '#10B981',
                    error: '#EF4444',
                    warning: '#F59E0B',
                    info: 'var(--projectionlab-primary)'
                }
            }
        };
    }

    /**
     * Animation configuration for smooth interactions
     */
    getAnimationConfig() {
        return {
            duration: {
                fast: 150,
                normal: 250,
                slow: 400
            },
            easing: {
                ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
                easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
                easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
            }
        };
    }

    /**
     * Setup enhanced button components
     */
    setupButtonComponents() {
        // Find all buttons and enhance them
        const buttons = document.querySelectorAll('button, .btn, input[type="submit"], input[type="button"]');
        
        buttons.forEach(button => {
            this.enhanceButton(button);
        });

        // Setup button click handlers
        this.setupButtonHandlers();
    }

    /**
     * Enhance individual button
     */
    enhanceButton(button) {
        if (button.classList.contains('enhanced')) return;
        
        // Add enhanced class
        button.classList.add('enhanced');
        
        // Determine button type
        const buttonType = this.getButtonType(button);
        
        // Apply ProjectionLab styling
        this.applyButtonStyling(button, buttonType);
        
        // Add ripple effect container
        this.addRippleEffect(button);
        
        // Add loading state capability
        this.addLoadingState(button);
        
        // Track component creation
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('button_enhanced', { type: buttonType });
        }
    }

    /**
     * Determine button type from classes or context
     */
    getButtonType(button) {
        if (button.classList.contains('btn-primary') || button.type === 'submit') return 'primary';
        if (button.classList.contains('btn-secondary')) return 'secondary';
        if (button.classList.contains('btn-accent')) return 'accent';
        if (button.classList.contains('btn-outline')) return 'outline';
        return 'primary'; // Default
    }

    /**
     * Apply ProjectionLab button styling
     */
    applyButtonStyling(button, type) {
        const theme = this.themes.buttons[type];
        
        // Base styles for all enhanced buttons
        button.style.cssText += `
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            border: none;
            cursor: pointer;
            transition: all ${this.animations.duration.normal}ms ${this.animations.easing.ease};
            min-height: 48px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        `;

        // Type-specific styles
        if (type === 'outline') {
            button.style.cssText += `
                background: transparent;
                border: 2px solid ${theme.border};
                color: ${theme.text};
                box-shadow: ${theme.shadow};
            `;
        } else {
            button.style.cssText += `
                background: ${theme.background};
                color: ${theme.text};
                box-shadow: ${theme.shadow};
            `;
        }

        // Add hover and focus states via CSS
        this.addButtonStateStyles(button, type);
    }

    /**
     * Add CSS for button hover and focus states
     */
    addButtonStateStyles(button, type) {
        const theme = this.themes.buttons[type];
        const buttonId = button.id || `btn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        if (!button.id) button.id = buttonId;

        // Create CSS rules for this button
        const styleId = `enhanced-btn-${buttonId}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const hoverColor = type === 'outline' ? theme.hover : theme.hover;
        const hoverStyles = type === 'outline' 
            ? `background: ${theme.hover}; color: #ffffff; transform: translateY(-2px);`
            : `background: ${hoverColor}; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);`;

        styleElement.textContent = `
            #${buttonId}:hover:not(:disabled) {
                ${hoverStyles}
            }
            #${buttonId}:focus {
                outline: 2px solid ${theme.background || theme.border};
                outline-offset: 2px;
            }
            #${buttonId}:active {
                transform: translateY(0);
                transition-duration: ${this.animations.duration.fast}ms;
            }
            #${buttonId}:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
        `;
    }

    /**
     * Add ripple effect to button
     */
    addRippleEffect(button) {
        button.addEventListener('click', (e) => {
            if (button.disabled) return;

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation ${this.animations.duration.slow}ms ease-out;
                pointer-events: none;
                z-index: 0;
            `;

            button.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, this.animations.duration.slow);
        });

        // Add ripple animation CSS
        this.addRippleCSS();
    }

    /**
     * Add ripple animation CSS
     */
    addRippleCSS() {
        if (document.getElementById('ripple-animation-css')) return;

        const style = document.createElement('style');
        style.id = 'ripple-animation-css';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add loading state capability to button
     */
    addLoadingState(button) {
        const originalText = button.textContent;
        const originalHTML = button.innerHTML;

        button.setLoadingState = (loading = true) => {
            if (loading) {
                button.disabled = true;
                button.classList.add('loading');
                button.innerHTML = `
                    <div class="loading-spinner"></div>
                    <span>${originalText}</span>
                `;
            } else {
                button.disabled = false;
                button.classList.remove('loading');
                button.innerHTML = originalHTML;
            }
        };
    }

    /**
     * Setup form component enhancements
     */
    setupFormComponents() {
        // Enhance input fields
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => this.enhanceInput(input));

        // Enhance form labels
        const labels = document.querySelectorAll('label');
        labels.forEach(label => this.enhanceLabel(label));

        // Setup form validation
        this.setupFormValidation();
    }

    /**
     * Enhance individual input field
     */
    enhanceInput(input) {
        if (input.classList.contains('enhanced') || input.type === 'hidden') return;

        input.classList.add('enhanced');
        const theme = this.themes.forms.input;

        // Apply enhanced styling
        input.style.cssText += `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid ${theme.border};
            border-radius: 8px;
            font-size: 16px;
            font-family: 'Inter', sans-serif;
            background: ${theme.background};
            color: ${theme.text};
            transition: all ${this.animations.duration.normal}ms ${this.animations.easing.ease};
            min-height: 48px;
            box-sizing: border-box;
        `;

        // Add focus and validation styles
        this.addInputStateStyles(input);

        // Add floating label effect if needed
        this.setupFloatingLabel(input);
    }

    /**
     * Add CSS for input states
     */
    addInputStateStyles(input) {
        const inputId = input.id || `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!input.id) input.id = inputId;

        const styleId = `enhanced-input-${inputId}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const theme = this.themes.forms;

        styleElement.textContent = `
            #${inputId}:focus {
                outline: none;
                border-color: ${theme.input.focus};
                box-shadow: 0 0 0 3px rgba(24, 103, 192, 0.1);
            }
            #${inputId}::placeholder {
                color: ${theme.input.placeholder};
                opacity: 1;
            }
            #${inputId}.error {
                border-color: ${theme.validation.error};
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }
            #${inputId}.success {
                border-color: ${theme.validation.success};
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }
            #${inputId}.warning {
                border-color: ${theme.validation.warning};
                box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
            }
        `;
    }

    /**
     * Setup floating label effect
     */
    setupFloatingLabel(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label || label.classList.contains('floating-setup')) return;

        label.classList.add('floating-setup');
        const container = input.parentNode;

        // Create floating label container
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-input-container';
        floatingContainer.style.cssText = `
            position: relative;
            margin-bottom: 16px;
        `;

        // Move input and label to floating container
        container.insertBefore(floatingContainer, input);
        floatingContainer.appendChild(input);
        floatingContainer.appendChild(label);

        // Style the floating label
        label.style.cssText += `
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 0 4px;
            font-size: 16px;
            color: ${this.themes.forms.input.placeholder};
            transition: all ${this.animations.duration.normal}ms ${this.animations.easing.ease};
            pointer-events: none;
            z-index: 1;
        `;

        // Handle floating label states
        const updateLabelState = () => {
            if (input.value || input === document.activeElement) {
                label.style.cssText += `
                    top: 0;
                    transform: translateY(-50%);
                    font-size: 12px;
                    color: ${this.themes.forms.input.focus};
                `;
            } else {
                label.style.cssText += `
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 16px;
                    color: ${this.themes.forms.input.placeholder};
                `;
            }
        };

        input.addEventListener('focus', updateLabelState);
        input.addEventListener('blur', updateLabelState);
        input.addEventListener('input', updateLabelState);

        // Initial state
        updateLabelState();
    }

    /**
     * Enhance form labels
     */
    enhanceLabel(label) {
        if (label.classList.contains('enhanced') || label.classList.contains('floating-setup')) return;

        label.classList.add('enhanced');
        label.style.cssText += `
            font-weight: 600;
            font-size: 14px;
            color: #374151;
            margin-bottom: 6px;
            display: block;
            font-family: 'Inter', sans-serif;
        `;
    }

    /**
     * Setup form validation system
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldErrors(input));
            });
        });
    }

    /**
     * Handle form submission with validation
     */
    handleFormSubmit(e) {
        const form = e.target;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            this.showFormError(form, 'Please correct the errors below');
        }
    }

    /**
     * Validate individual field
     */
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');

        // Clear previous states
        input.classList.remove('error', 'success', 'warning');

        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Number validation
        else if (type === 'number' && value && isNaN(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        }
        // Custom validation
        else if (input.dataset.validate) {
            const result = this.customValidation(input, value);
            if (!result.valid) {
                isValid = false;
                errorMessage = result.message;
            }
        }

        // Apply validation state
        if (!isValid) {
            input.classList.add('error');
            this.showFieldError(input, errorMessage);
        } else if (value) {
            input.classList.add('success');
            this.hideFieldError(input);
        }

        return isValid;
    }

    /**
     * Custom validation rules
     */
    customValidation(input, value) {
        const rule = input.dataset.validate;

        switch (rule) {
            case 'currency':
                const isValidCurrency = /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/.test(value);
                return {
                    valid: isValidCurrency,
                    message: 'Please enter a valid currency amount'
                };
            case 'percentage':
                const num = parseFloat(value);
                const isValidPercentage = !isNaN(num) && num >= 0 && num <= 100;
                return {
                    valid: isValidPercentage,
                    message: 'Please enter a percentage between 0 and 100'
                };
            default:
                return { valid: true };
        }
    }

    /**
     * Utility functions
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Show field error
     */
    showFieldError(input, message) {
        this.hideFieldError(input); // Remove existing error

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: ${this.themes.forms.validation.error};
            font-size: 12px;
            margin-top: 4px;
            font-family: 'Inter', sans-serif;
        `;
        errorElement.textContent = message;

        input.parentNode.appendChild(errorElement);
    }

    /**
     * Hide field error
     */
    hideFieldError(input) {
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Clear field errors
     */
    clearFieldErrors(input) {
        input.classList.remove('error', 'warning');
        this.hideFieldError(input);
    }

    /**
     * Setup loading states
     */
    setupLoadingStates() {
        // Add loading spinner CSS
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid #ffffff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .enhanced.loading {
                opacity: 0.8;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup micro-interactions
     */
    setupMicroInteractions() {
        // Add subtle hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.card, .metric-card, .nav-links a');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
                element.style.transition = `transform ${this.animations.duration.normal}ms ${this.animations.easing.ease}`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Setup button handlers
     */
    setupButtonHandlers() {
        // Handle calculate button specifically
        const calculateBtn = document.querySelector('#calculateBtn, .calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', async () => {
                calculateBtn.setLoadingState(true);
                
                // Simulate calculation time
                setTimeout(() => {
                    calculateBtn.setLoadingState(false);
                }, 1500);
            });
        }
    }

    /**
     * Create enhanced button programmatically
     */
    createButton(text, type = 'primary', options = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `btn btn-${type}`;
        
        if (options.id) button.id = options.id;
        if (options.onClick) button.addEventListener('click', options.onClick);
        
        this.enhanceButton(button);
        
        return button;
    }

    /**
     * Cleanup and destroy
     */
    cleanup() {
        this.components.clear();
        
        // Remove dynamic styles
        const dynamicStyles = document.querySelectorAll('[id^="enhanced-btn-"], [id^="enhanced-input-"]');
        dynamicStyles.forEach(style => style.remove());
    }
}

// Initialize and export
const enhancedComponents = new EnhancedComponents();
window.enhancedComponents = enhancedComponents;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => enhancedComponents.init());
} else {
    enhancedComponents.init();
}

console.log('🎯 Enhanced Components System loaded - ProjectionLab Style');