/**
 * Comprehensive Performance Monitor
 * Real-time performance tracking, Web Vitals, user analytics, and error reporting
 */

class PerformanceMonitor {
    constructor() {
        this.isInitialized = false;
        this.sessionId = this.generateSessionId();
        this.startTime = performance.now();
        this.metrics = {
            webVitals: {},
            userInteractions: [],
            errors: [],
            pageMetrics: {},
            featureUsage: {}
        };
        this.thresholds = {
            LCP: 2500,  // Largest Contentful Paint
            FID: 100,   // First Input Delay
            CLS: 0.1,   // Cumulative Layout Shift
            FCP: 1800,  // First Contentful Paint
            TTFB: 600   // Time to First Byte
        };
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📊 Initializing Performance Monitor...');
        console.log('🔍 Session ID:', this.sessionId);
        
        try {
            // Initialize Web Vitals tracking
            this.initWebVitals();
            
            // Setup user interaction tracking
            this.setupUserInteractionTracking();
            
            // Initialize error tracking
            this.setupErrorTracking();
            
            // Track page load metrics
            this.trackPageLoadMetrics();
            
            // Setup periodic reporting
            this.setupPeriodicReporting();
            
            // Setup visibility change tracking
            this.setupVisibilityTracking();
            
            this.isInitialized = true;
            console.log('✅ Performance Monitor initialized');
            
            // Log initial performance state
            this.logPerformanceSnapshot('initialization');
            
        } catch (error) {
            console.error('❌ Performance Monitor initialization failed:', error);
        }
    }

    generateSessionId() {
        return 'pm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    }

    initWebVitals() {
        console.log('📈 Initializing Web Vitals tracking...');
        
        // Largest Contentful Paint (LCP)
        this.observeWebVital('largest-contentful-paint', (entry) => {
            const lcp = entry.startTime;
            this.metrics.webVitals.LCP = lcp;
            this.logWebVital('LCP', lcp, this.thresholds.LCP);
        });

        // First Input Delay (FID)
        this.observeWebVital('first-input', (entry) => {
            const fid = entry.processingStart - entry.startTime;
            this.metrics.webVitals.FID = fid;
            this.logWebVital('FID', fid, this.thresholds.FID);
        });

        // Cumulative Layout Shift (CLS)
        this.observeCLS();

        // First Contentful Paint (FCP)
        this.observeWebVital('paint', (entry) => {
            if (entry.name === 'first-contentful-paint') {
                const fcp = entry.startTime;
                this.metrics.webVitals.FCP = fcp;
                this.logWebVital('FCP', fcp, this.thresholds.FCP);
            }
        });

        // Navigation timing for TTFB
        this.trackTTFB();
    }

    observeWebVital(type, callback) {
        try {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(callback);
                });
                observer.observe({ type, buffered: true });
            }
        } catch (error) {
            console.warn('⚠️ Could not observe', type, ':', error);
        }
    }

    observeCLS() {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];

        const entryHandler = (entry) => {
            if (!entry.hadRecentInput) {
                const firstSessionEntry = sessionEntries[0];
                const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 &&
                    entry.startTime - firstSessionEntry.startTime < 5000) {
                    sessionValue += entry.value;
                    sessionEntries.push(entry);
                } else {
                    sessionValue = entry.value;
                    sessionEntries = [entry];
                }

                if (sessionValue > clsValue) {
                    clsValue = sessionValue;
                    this.metrics.webVitals.CLS = clsValue;
                    this.logWebVital('CLS', clsValue, this.thresholds.CLS);
                }
            }
        };

        this.observeWebVital('layout-shift', entryHandler);
    }

    trackTTFB() {
        // Use Navigation Timing API for TTFB
        if ('performance' in window && 'timing' in performance) {
            window.addEventListener('load', () => {
                const ttfb = performance.timing.responseStart - performance.timing.requestStart;
                this.metrics.webVitals.TTFB = ttfb;
                this.logWebVital('TTFB', ttfb, this.thresholds.TTFB);
            });
        }
    }

    logWebVital(name, value, threshold) {
        const status = value <= threshold ? 'GOOD' : value <= threshold * 2 ? 'NEEDS IMPROVEMENT' : 'POOR';
        const color = status === 'GOOD' ? '🟢' : status === 'NEEDS IMPROVEMENT' ? '🟡' : '🔴';
        
        console.log(`${color} ${name}: ${Math.round(value)}ms (${status})`);
        
        // Track in analytics
        this.trackEvent('web_vital', {
            metric: name,
            value: Math.round(value),
            status: status.toLowerCase().replace(/\s+/g, '_'),
            threshold
        });
    }

    setupUserInteractionTracking() {
        console.log('👆 Setting up user interaction tracking...');
        
        // Track clicks on key elements
        document.addEventListener('click', (event) => {
            this.trackUserInteraction('click', event);
        });

        // Track form interactions
        document.addEventListener('input', (event) => {
            if (event.target.matches('input, select, textarea')) {
                this.trackUserInteraction('input', event);
            }
        });

        // Track button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('button, .btn, [role="button"]')) {
                this.trackUserInteraction('button_click', event);
            }
        });

        // Track calculator-specific interactions
        this.setupCalculatorTracking();
    }

    setupCalculatorTracking() {
        // Track calculation events
        document.addEventListener('calculationComplete', (event) => {
            this.trackFeatureUsage('calculation', {
                purchasePrice: event.detail?.purchasePrice,
                state: event.detail?.state,
                calculationTime: event.detail?.processingTime
            });
        });

        // Track property search usage
        document.addEventListener('propertySearchUsed', (event) => {
            this.trackFeatureUsage('property_search', {
                query: event.detail?.query,
                resultsCount: event.detail?.resultsCount
            });
        });

        // Track PDF generation
        document.addEventListener('pdfGenerated', (event) => {
            this.trackFeatureUsage('pdf_generation', {
                reportType: event.detail?.reportType,
                generationTime: event.detail?.generationTime
            });
        });

        // Track market insights usage
        document.addEventListener('marketInsightsViewed', (event) => {
            this.trackFeatureUsage('market_insights', {
                address: event.detail?.address,
                dataSource: event.detail?.dataSource
            });
        });
    }

    trackUserInteraction(type, event) {
        const interaction = {
            type,
            timestamp: Date.now(),
            target: this.getElementSelector(event.target),
            page: window.location.pathname,
            sessionId: this.sessionId
        };

        this.metrics.userInteractions.push(interaction);

        // Limit stored interactions to prevent memory issues
        if (this.metrics.userInteractions.length > 100) {
            this.metrics.userInteractions = this.metrics.userInteractions.slice(-50);
        }

        console.log('👆 User interaction:', interaction);
    }

    trackFeatureUsage(feature, details = {}) {
        const usage = {
            feature,
            timestamp: Date.now(),
            details,
            sessionId: this.sessionId
        };

        if (!this.metrics.featureUsage[feature]) {
            this.metrics.featureUsage[feature] = [];
        }
        
        this.metrics.featureUsage[feature].push(usage);

        console.log('🎯 Feature usage:', usage);
        
        this.trackEvent('feature_usage', {
            feature,
            ...details
        });
    }

    getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    setupErrorTracking() {
        console.log('🚨 Setting up error tracking...');
        
        // Global error handler
        window.addEventListener('error', (event) => {
            this.trackError('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('unhandled_rejection', {
                reason: event.reason?.toString(),
                stack: event.reason?.stack
            });
        });

        // API/Network errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const duration = performance.now() - startTime;
                
                this.trackAPICall(args[0], response.status, duration, true);
                
                return response;
            } catch (error) {
                const duration = performance.now() - startTime;
                this.trackAPICall(args[0], 0, duration, false, error);
                throw error;
            }
        };
    }

    trackError(type, details) {
        const error = {
            type,
            timestamp: Date.now(),
            details,
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.sessionId
        };

        this.metrics.errors.push(error);
        
        console.error('🚨 Error tracked:', error);
        
        // Limit stored errors
        if (this.metrics.errors.length > 20) {
            this.metrics.errors = this.metrics.errors.slice(-10);
        }
    }

    trackAPICall(url, status, duration, success, error = null) {
        const apiCall = {
            url: typeof url === 'string' ? url : url?.toString(),
            status,
            duration: Math.round(duration),
            success,
            error: error?.message,
            timestamp: Date.now()
        };

        console.log(`🌐 API Call: ${apiCall.url} - ${status} (${duration}ms)`);
        
        this.trackEvent('api_call', apiCall);
    }

    trackPageLoadMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const metrics = {
                    pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    firstByte: timing.responseStart - timing.navigationStart,
                    domInteractive: timing.domInteractive - timing.navigationStart,
                    resourceLoadTime: timing.loadEventEnd - timing.domContentLoadedEventEnd
                };

                this.metrics.pageMetrics = metrics;
                console.log('📊 Page load metrics:', metrics);
                
                this.trackEvent('page_load', metrics);
            }, 100);
        });
    }

    setupPeriodicReporting() {
        // Report metrics every 30 seconds
        setInterval(() => {
            this.reportMetrics();
        }, 30000);

        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.reportMetrics(true);
        });
    }

    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden', {
                    timeOnPage: Date.now() - this.startTime
                });
            } else {
                this.trackEvent('page_visible', {
                    timestamp: Date.now()
                });
            }
        });
    }

    trackEvent(eventName, properties = {}) {
        const event = {
            event: eventName,
            properties: {
                ...properties,
                sessionId: this.sessionId,
                timestamp: Date.now(),
                page: window.location.pathname,
                referrer: document.referrer,
                userAgent: navigator.userAgent
            }
        };

        // For now, log to console. In production, send to analytics service
        console.log('📊 Event tracked:', event);
        
        // Store locally for batch sending
        this.storeEventLocally(event);
    }

    storeEventLocally(event) {
        try {
            const events = JSON.parse(localStorage.getItem('performance_events') || '[]');
            events.push(event);
            
            // Keep only last 100 events
            const recentEvents = events.slice(-100);
            localStorage.setItem('performance_events', JSON.stringify(recentEvents));
        } catch (error) {
            console.warn('⚠️ Could not store event locally:', error);
        }
    }

    reportMetrics(isPageUnload = false) {
        const report = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.startTime,
            webVitals: this.metrics.webVitals,
            pageMetrics: this.metrics.pageMetrics,
            featureUsage: Object.keys(this.metrics.featureUsage).map(feature => ({
                feature,
                count: this.metrics.featureUsage[feature].length
            })),
            errorCount: this.metrics.errors.length,
            interactionCount: this.metrics.userInteractions.length,
            isPageUnload
        };

        console.log('📊 Performance report:', report);
        
        // In production, send this to your analytics endpoint
        this.sendToAnalytics(report);
    }

    sendToAnalytics(data) {
        // Mock analytics endpoint - replace with actual service
        if (this.isAnalyticsEnabled()) {
            console.log('📤 Sending to analytics:', data);
            // fetch('/api/analytics', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        }
    }

    isAnalyticsEnabled() {
        // Check if analytics is enabled (e.g., not in development)
        return !window.location.hostname.includes('localhost');
    }

    logPerformanceSnapshot(context) {
        const snapshot = {
            context,
            timestamp: Date.now(),
            memory: this.getMemoryInfo(),
            timing: this.getTimingInfo(),
            features: {
                webVitalsSupported: 'PerformanceObserver' in window,
                intersectionObserverSupported: 'IntersectionObserver' in window,
                localStorageAvailable: this.isLocalStorageAvailable()
            }
        };

        console.log(`📸 Performance snapshot (${context}):`, snapshot);
    }

    getMemoryInfo() {
        if ('memory' in performance) {
            return {
                usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }

    getTimingInfo() {
        if ('timing' in performance) {
            const timing = performance.timing;
            return {
                navigationStart: timing.navigationStart,
                loadComplete: timing.loadEventEnd || null,
                domReady: timing.domContentLoadedEventEnd || null
            };
        }
        return null;
    }

    isLocalStorageAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (error) {
            return false;
        }
    }

    // Public API for manual tracking
    track(eventName, properties) {
        this.trackEvent(eventName, properties);
    }

    trackFeature(featureName, details) {
        this.trackFeatureUsage(featureName, details);
    }

    getSessionMetrics() {
        return {
            sessionId: this.sessionId,
            webVitals: this.metrics.webVitals,
            pageMetrics: this.metrics.pageMetrics,
            featureUsage: this.metrics.featureUsage,
            sessionDuration: Date.now() - this.startTime
        };
    }
}

// Initialize global performance monitor
window.performanceMonitor = new PerformanceMonitor();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.performanceMonitor) {
        window.performanceMonitor.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}