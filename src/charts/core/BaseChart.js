// BaseChart.js - Foundation for all chart components in InvestQuest
class BaseChart {
    constructor(container, config = {}) {
        this.container = typeof container === 'string' 
            ? document.getElementById(container) 
            : container;
            
        if (!this.container) {
            throw new Error('Chart container not found');
        }

        // Default configuration with InvestQuest branding
        this.config = {
            width: '100%',
            height: 400,
            margin: { top: 20, right: 20, bottom: 40, left: 60 },
            animation: true,
            responsive: true,
            theme: 'investquest-default',
            accessibility: true,
            ...config
        };

        // Chart state
        this.svg = null;
        this.data = null;
        this.scales = {};
        this.axes = {};
        this.isInitialized = false;
        this.isDestroyed = false;
        
        // Performance optimization
        this.renderCache = new Map();
        this.animationFrameId = null;
        
        // Event handling
        this.eventListeners = new Map();
        this.resizeObserver = null;
        
        // Accessibility
        this.ariaDescriptions = new Map();
    }

    // Initialize chart
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.loadD3();
            this.applyTheme();
            this.createSVG();
            this.setupScales();
            this.setupAxes();
            this.setupResponsive();
            this.setupAccessibility();
            this.bindEvents();
            this.isInitialized = true;
            
            this.emit('initialized');
        } catch (error) {
            console.error('Chart initialization failed:', error);
            this.emit('error', error);
        }
    }

    // Load D3.js library dynamically
    async loadD3() {
        if (window.d3) return;
        
        try {
            // Load D3 from CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/d3@7';
            script.async = true;
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            
            // Verify D3 loaded correctly
            if (!window.d3) {
                throw new Error('D3.js failed to load');
            }
        } catch (error) {
            console.error('Failed to load D3.js:', error);
            throw new Error('Chart library dependency failed to load');
        }
    }

    // Apply theme configuration
    applyTheme() {
        const theme = InvestQuestChartThemes[this.config.theme] || InvestQuestChartThemes.default;
        this.theme = { ...theme };
        
        // Add theme CSS class to container
        this.container.classList.add(`chart-theme-${this.config.theme}`);
    }

    // Create SVG element
    createSVG() {
        // Clear existing content
        this.container.innerHTML = '';
        
        // Create wrapper for responsive behavior
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-wrapper';
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: ${this.config.height}px;
            min-height: 200px;
        `;
        
        this.container.appendChild(wrapper);
        
        // Create SVG
        this.svg = d3.select(wrapper)
            .append('svg')
            .attr('class', 'investquest-chart')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.getWidth()} ${this.getHeight()}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('background-color', this.theme.background || 'transparent');

        // Create chart group with margins
        this.chartGroup = this.svg.append('g')
            .attr('class', 'chart-content')
            .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

        // Add gradient definitions
        this.addGradientDefinitions();
    }

    // Add gradient definitions for enhanced visuals
    addGradientDefinitions() {
        const defs = this.svg.append('defs');
        
        // Primary gradient
        const primaryGradient = defs.append('linearGradient')
            .attr('id', `gradient-primary-${this.getId()}`)
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', 0).attr('y2', this.getChartHeight());
            
        primaryGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', this.theme.colors.primary)
            .attr('stop-opacity', 0.8);
            
        primaryGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', this.theme.colors.primary)
            .attr('stop-opacity', 0.1);

        // Success gradient
        const successGradient = defs.append('linearGradient')
            .attr('id', `gradient-success-${this.getId()}`)
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', 0).attr('y2', this.getChartHeight());
            
        successGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', this.theme.colors.success)
            .attr('stop-opacity', 0.6);
            
        successGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', this.theme.colors.success)
            .attr('stop-opacity', 0.1);
    }

    // Setup scales (to be overridden by child classes)
    setupScales() {
        // Default implementation - child classes should override
        this.scales.x = d3.scaleLinear();
        this.scales.y = d3.scaleLinear();
    }

    // Setup axes (to be overridden by child classes)
    setupAxes() {
        // Default implementation - child classes should override
        this.axes.x = d3.axisBottom(this.scales.x);
        this.axes.y = d3.axisLeft(this.scales.y);
    }

    // Setup responsive behavior
    setupResponsive() {
        if (!this.config.responsive) return;
        
        // Use ResizeObserver for modern browsers
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                }
                
                this.animationFrameId = requestAnimationFrame(() => {
                    this.handleResize();
                });
            });
            
            this.resizeObserver.observe(this.container);
        } else {
            // Fallback for older browsers
            window.addEventListener('resize', this.handleResize.bind(this));
        }
    }

    // Setup accessibility features
    setupAccessibility() {
        if (!this.config.accessibility) return;
        
        // Add ARIA attributes
        this.svg
            .attr('role', 'img')
            .attr('aria-labelledby', `chart-title-${this.getId()}`)
            .attr('aria-describedby', `chart-desc-${this.getId()}`);

        // Add title and description elements
        this.svg.append('title')
            .attr('id', `chart-title-${this.getId()}`)
            .text(this.config.title || 'Investment Analysis Chart');

        this.svg.append('desc')
            .attr('id', `chart-desc-${this.getId()}`)
            .text(this.config.description || 'Interactive chart showing property investment analysis');
    }

    // Bind event listeners
    bindEvents() {
        // Chart-specific events will be added by child classes
        this.on('resize', this.handleResize.bind(this));
        this.on('themeChange', this.handleThemeChange.bind(this));
    }

    // Handle window/container resize
    handleResize() {
        if (!this.isInitialized || this.isDestroyed) return;
        
        const newWidth = this.container.clientWidth;
        const newHeight = this.container.clientHeight;
        
        // Update viewBox
        this.svg.attr('viewBox', `0 0 ${newWidth} ${newHeight || this.config.height}`);
        
        // Update scales
        this.updateScales();
        
        // Re-render if data exists
        if (this.data) {
            this.render(this.data);
        }
        
        this.emit('resized', { width: newWidth, height: newHeight });
    }

    // Handle theme changes
    handleThemeChange(newTheme) {
        this.container.classList.remove(`chart-theme-${this.config.theme}`);
        this.config.theme = newTheme;
        this.applyTheme();
        
        if (this.data) {
            this.render(this.data);
        }
    }

    // Update scales (to be overridden by child classes)
    updateScales() {
        // Child classes should implement scale updates
    }

    // Main render method (to be overridden by child classes)
    async render(data) {
        if (!this.isInitialized) {
            await this.init();
        }
        
        this.data = data;
        
        // Child classes should implement specific rendering
        console.warn('BaseChart.render() should be overridden by child class');
    }

    // Animation helpers
    animate(selection, duration = null) {
        if (!this.config.animation) {
            return selection;
        }
        
        return selection
            .transition()
            .duration(duration || this.theme.animation?.duration || 800)
            .ease(d3.easeCubicOut);
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event callback for ${event}:`, error);
                }
            });
        }
    }

    // Utility methods
    getId() {
        return this.id || (this.id = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }

    getWidth() {
        return this.container.clientWidth || 800;
    }

    getHeight() {
        return this.config.height;
    }

    getChartWidth() {
        return this.getWidth() - this.config.margin.left - this.config.margin.right;
    }

    getChartHeight() {
        return this.getHeight() - this.config.margin.top - this.config.margin.bottom;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatPercentage(value) {
        return `${(value * 100).toFixed(1)}%`;
    }

    formatNumber(value) {
        return new Intl.NumberFormat('en-AU').format(value);
    }

    // Cache management
    setCacheKey(key, data) {
        this.renderCache.set(key, data);
    }

    getCacheKey(key) {
        return this.renderCache.get(key);
    }

    clearCache() {
        this.renderCache.clear();
    }

    // Cleanup
    destroy() {
        if (this.isDestroyed) return;
        
        // Cancel any pending animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Remove event listeners
        this.eventListeners.clear();
        
        // Clear DOM
        if (this.svg) {
            this.svg.remove();
        }
        
        // Remove theme classes
        this.container.classList.remove(`chart-theme-${this.config.theme}`);
        
        // Clear cache
        this.clearCache();
        
        this.isDestroyed = true;
        this.emit('destroyed');
    }
}

// Export for use in other components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseChart;
} else {
    window.BaseChart = BaseChart;
}