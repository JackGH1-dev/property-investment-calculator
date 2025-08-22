/**
 * Performance Monitoring System - Phase 1 Implementation
 * ProjectionLab-Style Enhancement
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            lcp: null,
            fid: null,
            cls: null,
            fcp: null,
            ttfb: null
        };
        this.observers = new Map();
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // Initialize Web Vitals monitoring
        this.observeLCP();
        this.observeFID();
        this.observeCLS();
        this.observeFCP();
        this.observeTTFB();
        
        // Monitor page lifecycle
        this.monitorPageLifecycle();
        
        // Report metrics when page becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.reportMetrics();
            }
        });
        
        // Report metrics on page unload
        window.addEventListener('beforeunload', () => {
            this.reportMetrics();
        });
    }

    // Largest Contentful Paint
    observeLCP() {
        if (!('PerformanceObserver' in window)) return;
        
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = Math.round(lastEntry.startTime);
            this.logMetric('LCP', this.metrics.lcp, 2500, 4000);
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        this.observers.set('lcp', observer);
    }

    // First Input Delay
    observeFID() {
        if (!('PerformanceObserver' in window)) return;
        
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = Math.round(entry.processingStart - entry.startTime);
                this.logMetric('FID', this.metrics.fid, 100, 300);
            });
        });
        
        observer.observe({ type: 'first-input', buffered: true });
        this.observers.set('fid', observer);
    }

    // Cumulative Layout Shift
    observeCLS() {
        if (!('PerformanceObserver' in window)) return;
        
        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.metrics.cls = Math.round(clsValue * 1000) / 1000;
            this.logMetric('CLS', this.metrics.cls, 0.1, 0.25);
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        this.observers.set('cls', observer);
    }

    // First Contentful Paint
    observeFCP() {
        if (!('PerformanceObserver' in window)) return;
        
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = Math.round(entry.startTime);
                    this.logMetric('FCP', this.metrics.fcp, 1800, 3000);
                }
            });
        });
        
        observer.observe({ type: 'paint', buffered: true });
        this.observers.set('fcp', observer);
    }

    // Time to First Byte
    observeTTFB() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.metrics.ttfb = Math.round(navigation.responseStart - navigation.fetchStart);
            this.logMetric('TTFB', this.metrics.ttfb, 800, 1800);
        }
    }

    // Monitor page lifecycle events
    monitorPageLifecycle() {
        // Page load complete
        window.addEventListener('load', () => {
            const loadTime = Math.round(performance.now() - this.startTime);
            console.log(`🚀 Page load complete: ${loadTime}ms`);
            this.trackEvent('page_load_complete', { duration: loadTime });
        });

        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const domTime = Math.round(performance.now() - this.startTime);
                console.log(`📄 DOM ready: ${domTime}ms`);
                this.trackEvent('dom_content_loaded', { duration: domTime });
            });
        }

        // Resource timing
        setTimeout(() => {
            this.analyzeResourceTiming();
        }, 2000);
    }

    // Analyze resource loading performance
    analyzeResourceTiming() {
        const resources = performance.getEntriesByType('resource');
        const analysis = {
            css: { count: 0, totalSize: 0, avgLoadTime: 0 },
            js: { count: 0, totalSize: 0, avgLoadTime: 0 },
            images: { count: 0, totalSize: 0, avgLoadTime: 0 },
            fonts: { count: 0, totalSize: 0, avgLoadTime: 0 }
        };

        resources.forEach(resource => {
            const duration = resource.responseEnd - resource.startTime;
            const size = resource.transferSize || 0;

            if (resource.name.includes('.css')) {
                analysis.css.count++;
                analysis.css.totalSize += size;
                analysis.css.avgLoadTime += duration;
            } else if (resource.name.includes('.js')) {
                analysis.js.count++;
                analysis.js.totalSize += size;
                analysis.js.avgLoadTime += duration;
            } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
                analysis.images.count++;
                analysis.images.totalSize += size;
                analysis.images.avgLoadTime += duration;
            } else if (resource.name.includes('fonts.googleapis.com') || resource.name.match(/\.(woff|woff2|ttf)$/)) {
                analysis.fonts.count++;
                analysis.fonts.totalSize += size;
                analysis.fonts.avgLoadTime += duration;
            }
        });

        // Calculate averages
        Object.keys(analysis).forEach(type => {
            if (analysis[type].count > 0) {
                analysis[type].avgLoadTime = Math.round(analysis[type].avgLoadTime / analysis[type].count);
                analysis[type].totalSize = Math.round(analysis[type].totalSize / 1024); // KB
            }
        });

        console.log('📊 Resource Analysis:', analysis);
        this.trackEvent('resource_analysis', analysis);
    }

    // Log individual metric with color coding
    logMetric(name, value, good, poor) {
        let status = '🟢 Good';
        let color = '#10b981';

        if (value > poor) {
            status = '🔴 Poor';
            color = '#ef4444';
        } else if (value > good) {
            status = '🟡 Needs Improvement';
            color = '#f59e0b';
        }

        console.log(
            `%c📈 ${name}: ${value}${name === 'CLS' ? '' : 'ms'} ${status}`,
            `color: ${color}; font-weight: bold;`
        );
    }

    // Track custom events
    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...data
        };

        // Send to analytics (placeholder for actual implementation)
        if (window.gtag) {
            window.gtag('event', eventName, eventData);
        }

        // Store locally for debugging
        if (!window.performanceEvents) {
            window.performanceEvents = [];
        }
        window.performanceEvents.push(eventData);
    }

    // Report all metrics
    reportMetrics() {
        const report = {
            metrics: this.metrics,
            timestamp: Date.now(),
            url: window.location.href,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };

        console.log('📊 Performance Report:', report);
        this.trackEvent('performance_report', report);

        // Send beacon if available
        if (navigator.sendBeacon && window.location.origin.includes('investquest')) {
            const data = new Blob([JSON.stringify(report)], { type: 'application/json' });
            navigator.sendBeacon('/api/performance', data);
        }
    }

    // Manual performance mark
    mark(name) {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(name);
            console.log(`🏷️ Performance mark: ${name}`);
        }
    }

    // Measure between marks
    measure(name, startMark, endMark) {
        if ('performance' in window && 'measure' in performance) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name, 'measure')[0];
                console.log(`📏 Performance measure "${name}": ${Math.round(measure.duration)}ms`);
                return measure.duration;
            } catch (e) {
                console.warn('Performance measure failed:', e);
            }
        }
        return null;
    }

    // Cleanup observers
    disconnect() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
    }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for global access
window.performanceMonitor = performanceMonitor;

// Utility functions for manual tracking
window.perfMark = (name) => performanceMonitor.mark(name);
window.perfMeasure = (name, start, end) => performanceMonitor.measure(name, start, end);
window.perfTrack = (event, data) => performanceMonitor.trackEvent(event, data);

console.log('🚀 Performance monitoring initialized - ProjectionLab Style');