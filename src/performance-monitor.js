// InvestQuest Performance Monitor
// Real-time performance tracking and optimization diagnostics

class InvestQuestPerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.startTime = performance.now();
        this.pageLoadStartTime = Date.now();
        this.isEnabled = this.shouldEnableMonitoring();
        
        if (this.isEnabled) {
            this.initializeMonitoring();
        }
    }

    shouldEnableMonitoring() {
        // Enable in development or when URL parameter is set
        return window.location.hostname === 'localhost' || 
               window.location.search.includes('debug=performance') ||
               window.location.search.includes('monitor=true');
    }

    initializeMonitoring() {
        console.log('🔍 InvestQuest Performance Monitor initialized');
        
        // Track page load metrics
        this.trackPageLoad();
        
        // Monitor JavaScript performance
        this.trackJavaScriptMetrics();
        
        // Monitor resource loading
        this.trackResourceLoading();
        
        // Monitor user interactions
        this.trackUserInteractions();
        
        // Monitor memory usage
        this.trackMemoryUsage();
        
        // Set up Web Vitals monitoring
        this.trackWebVitals();
        
        // Display performance dashboard if in debug mode
        if (window.location.search.includes('debug=performance')) {
            this.createPerformanceDashboard();
        }
    }

    // Track critical page load metrics
    trackPageLoad() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.recordMetric('dom_content_loaded', performance.now() - this.startTime);
            });
        }

        // Window Load
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => {
                this.recordMetric('window_load', performance.now() - this.startTime);
                this.analyzePageLoadPerformance();
            });
        }

        // First Paint and First Contentful Paint
        this.trackPaintMetrics();
    }

    trackPaintMetrics() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.recordMetric(entry.name.replace(/-/g, '_'), entry.startTime);
            }
        });
        
        try {
            observer.observe({ entryTypes: ['paint'] });
        } catch (error) {
            console.warn('Paint metrics not supported:', error);
        }
    }

    // Monitor JavaScript performance
    trackJavaScriptMetrics() {
        // Track long tasks (>50ms)
        if ('PerformanceLongTaskTiming' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordLongTask({
                        duration: entry.duration,
                        startTime: entry.startTime,
                        name: entry.name
                    });
                }
            });
            
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        }

        // Track navigation timing
        this.trackNavigationTiming();
    }

    trackNavigationTiming() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    this.recordMetric('dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
                    this.recordMetric('tcp_connection', navigation.connectEnd - navigation.connectStart);
                    this.recordMetric('request_response', navigation.responseEnd - navigation.requestStart);
                    this.recordMetric('dom_processing', navigation.domComplete - navigation.domLoading);
                }
            }, 100);
        });
    }

    // Monitor resource loading performance
    trackResourceLoading() {
        const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'resource') {
                    this.analyzeResourcePerformance(entry);
                }
            }
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
    }

    analyzeResourcePerformance(entry) {
        const resource = {
            name: entry.name,
            type: this.getResourceType(entry.name),
            duration: entry.duration,
            size: entry.transferSize || entry.encodedBodySize,
            cached: entry.transferSize === 0 && entry.encodedBodySize > 0
        };

        // Flag slow resources
        if (resource.duration > 1000) { // >1s
            this.recordIssue('slow_resource', {
                ...resource,
                severity: resource.duration > 3000 ? 'high' : 'medium'
            });
        }

        // Track resource types
        if (!this.metrics.has('resource_types')) {
            this.metrics.set('resource_types', new Map());
        }
        
        const resourceTypes = this.metrics.get('resource_types');
        const count = resourceTypes.get(resource.type) || 0;
        resourceTypes.set(resource.type, count + 1);
    }

    getResourceType(url) {
        if (url.includes('firebase') || url.includes('googleapis')) return 'api';
        if (url.includes('.js')) return 'script';
        if (url.includes('.css')) return 'style';
        if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
        if (url.includes('font')) return 'font';
        return 'other';
    }

    // Monitor user interactions
    trackUserInteractions() {
        // Track calculator performance
        if (window.location.pathname.includes('calculator')) {
            this.monitorCalculatorPerformance();
        }

        // Track authentication performance
        this.monitorAuthenticationPerformance();

        // Track navigation performance
        this.monitorNavigationPerformance();
    }

    monitorCalculatorPerformance() {
        // Track form input performance
        const form = document.getElementById('propertyForm');
        if (form) {
            let inputStartTime;
            
            form.addEventListener('input', () => {
                if (!inputStartTime) {
                    inputStartTime = performance.now();
                }
            }, { passive: true });

            // Monitor when calculation completes
            const resultsContainer = document.getElementById('resultsContainer');
            if (resultsContainer) {
                const observer = new MutationObserver(() => {
                    if (inputStartTime && !resultsContainer.textContent.includes('Enter your property')) {
                        const calculationTime = performance.now() - inputStartTime;
                        this.recordMetric('calculation_time', calculationTime);
                        
                        if (calculationTime > 1000) {
                            this.recordIssue('slow_calculation', {
                                duration: calculationTime,
                                severity: calculationTime > 3000 ? 'high' : 'medium'
                            });
                        }
                        
                        inputStartTime = null;
                    }
                });
                
                observer.observe(resultsContainer, { childList: true, subtree: true });
            }
        }
    }

    monitorAuthenticationPerformance() {
        // Track Firebase Auth performance
        if (window.authManager) {
            const originalInit = window.authManager.init.bind(window.authManager);
            window.authManager.init = async () => {
                const startTime = performance.now();
                const result = await originalInit();
                const duration = performance.now() - startTime;
                
                this.recordMetric('auth_init_time', duration);
                
                if (duration > 2000) {
                    this.recordIssue('slow_auth_init', {
                        duration: duration,
                        severity: 'medium'
                    });
                }
                
                return result;
            };
        }

        // Track sign-in performance
        document.addEventListener('click', (e) => {
            if (e.target.matches('.auth-signin-btn')) {
                const startTime = performance.now();
                
                const checkAuthComplete = () => {
                    if (window.authManager && window.authManager.getCurrentUser()) {
                        const duration = performance.now() - startTime;
                        this.recordMetric('signin_time', duration);
                        
                        if (duration > 5000) {
                            this.recordIssue('slow_signin', {
                                duration: duration,
                                severity: 'medium'
                            });
                        }
                    } else {
                        setTimeout(checkAuthComplete, 100);
                    }
                };
                
                setTimeout(checkAuthComplete, 100);
            }
        });
    }

    monitorNavigationPerformance() {
        // Track page navigation timing
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        const trackNavigation = (url) => {
            const startTime = performance.now();
            setTimeout(() => {
                const duration = performance.now() - startTime;
                this.recordMetric('navigation_time', duration);
            }, 100);
        };
        
        history.pushState = function(...args) {
            trackNavigation(args[2]);
            return originalPushState.apply(history, args);
        };
        
        history.replaceState = function(...args) {
            trackNavigation(args[2]);
            return originalReplaceState.apply(history, args);
        };
    }

    // Monitor memory usage
    trackMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                this.recordMetric('memory_used', memoryInfo.usedJSHeapSize);
                this.recordMetric('memory_total', memoryInfo.totalJSHeapSize);
                this.recordMetric('memory_limit', memoryInfo.jsHeapSizeLimit);
                
                // Check for memory leaks
                const usagePercentage = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
                if (usagePercentage > 80) {
                    this.recordIssue('high_memory_usage', {
                        percentage: usagePercentage,
                        used: memoryInfo.usedJSHeapSize,
                        severity: 'high'
                    });
                }
            }, 5000); // Check every 5 seconds
        }
    }

    // Track Web Vitals
    trackWebVitals() {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.recordMetric('largest_contentful_paint', entry.startTime);
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.recordMetric('first_input_delay', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let cumulativeLayoutShift = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cumulativeLayoutShift += entry.value;
                    this.recordMetric('cumulative_layout_shift', cumulativeLayoutShift);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    // Record performance metrics
    recordMetric(name, value) {
        const existing = this.metrics.get(name) || [];
        existing.push({
            value: Math.round(value * 100) / 100,
            timestamp: Date.now()
        });
        
        // Keep only last 100 measurements
        if (existing.length > 100) {
            existing.shift();
        }
        
        this.metrics.set(name, existing);
        
        if (this.dashboard) {
            this.updateDashboard();
        }
    }

    recordIssue(type, details) {
        if (!this.metrics.has('issues')) {
            this.metrics.set('issues', []);
        }
        
        const issues = this.metrics.get('issues');
        issues.push({
            type,
            details,
            timestamp: Date.now(),
            url: window.location.href
        });
        
        console.warn(`🚨 Performance Issue (${type}):`, details);
    }

    recordLongTask(task) {
        if (!this.metrics.has('long_tasks')) {
            this.metrics.set('long_tasks', []);
        }
        
        const longTasks = this.metrics.get('long_tasks');
        longTasks.push({
            ...task,
            timestamp: Date.now()
        });
        
        console.warn(`🐌 Long Task detected (${task.duration.toFixed(2)}ms):`, task);
    }

    // Analyze overall page load performance
    analyzePageLoadPerformance() {
        const metrics = this.getMetricsSummary();
        const issues = [];
        
        // Check critical metrics
        if (metrics.window_load > 3000) {
            issues.push('Slow page load (>3s)');
        }
        
        if (metrics.first_contentful_paint > 2500) {
            issues.push('Slow First Contentful Paint (>2.5s)');
        }
        
        if (metrics.largest_contentful_paint > 4000) {
            issues.push('Slow Largest Contentful Paint (>4s)');
        }
        
        if (issues.length === 0) {
            console.log('✅ Page load performance is good');
        } else {
            console.warn('⚠️ Page load performance issues:', issues);
        }
    }

    // Get summary of all metrics
    getMetricsSummary() {
        const summary = {};
        
        for (const [name, values] of this.metrics.entries()) {
            if (Array.isArray(values) && values.length > 0) {
                const latest = values[values.length - 1];
                summary[name] = latest.value;
            }
        }
        
        return summary;
    }

    // Create visual performance dashboard
    createPerformanceDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.9); color: white; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; z-index: 10000; max-width: 400px; max-height: 80vh; overflow-y: auto;">
                <div style="font-weight: bold; margin-bottom: 10px; color: #4ade80;">
                    🚀 InvestQuest Performance Monitor
                </div>
                <div id="performance-metrics"></div>
                <div id="performance-issues" style="margin-top: 10px;"></div>
                <div style="margin-top: 10px;">
                    <button onclick="window.performanceMonitor.downloadReport()" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Download Report
                    </button>
                    <button onclick="document.getElementById('performance-dashboard').remove()" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dashboard);
        this.dashboard = dashboard;
        this.updateDashboard();
        
        // Update dashboard every second
        setInterval(() => this.updateDashboard(), 1000);
    }

    updateDashboard() {
        if (!this.dashboard) return;
        
        const metricsDiv = this.dashboard.querySelector('#performance-metrics');
        const issuesDiv = this.dashboard.querySelector('#performance-issues');
        
        const metrics = this.getMetricsSummary();
        
        // Update metrics
        metricsDiv.innerHTML = Object.entries(metrics)
            .filter(([name]) => !name.includes('memory') && !name.includes('resource_types'))
            .map(([name, value]) => {
                const displayName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const unit = name.includes('time') || name.includes('delay') ? 'ms' : 
                            name.includes('paint') ? 'ms' : '';
                const color = this.getMetricColor(name, value);
                
                return `<div style="color: ${color};">${displayName}: ${value}${unit}</div>`;
            })
            .join('');
        
        // Update issues
        const issues = this.metrics.get('issues') || [];
        const recentIssues = issues.slice(-5); // Show last 5 issues
        
        issuesDiv.innerHTML = recentIssues.length > 0 ? 
            `<div style="color: #ef4444; font-weight: bold;">Recent Issues:</div>` +
            recentIssues.map(issue => 
                `<div style="color: #fbbf24; font-size: 11px;">• ${issue.type}: ${JSON.stringify(issue.details)}</div>`
            ).join('') : 
            `<div style="color: #4ade80;">No recent issues 👍</div>`;
    }

    getMetricColor(name, value) {
        // Color coding for different metrics
        if (name.includes('time') || name.includes('delay')) {
            return value < 1000 ? '#4ade80' : value < 3000 ? '#fbbf24' : '#ef4444';
        }
        if (name.includes('paint')) {
            return value < 2500 ? '#4ade80' : value < 4000 ? '#fbbf24' : '#ef4444';
        }
        return '#94a3b8';
    }

    // Download performance report
    downloadReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            metrics: Object.fromEntries(this.metrics),
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `investquest-performance-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Public API methods
    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    startMeasure(name) {
        this.recordMetric(`${name}_start`, performance.now());
    }

    endMeasure(name) {
        const startMetric = this.metrics.get(`${name}_start`);
        if (startMetric && startMetric.length > 0) {
            const startTime = startMetric[startMetric.length - 1].value;
            const duration = performance.now() - startTime;
            this.recordMetric(`${name}_duration`, duration);
            return duration;
        }
        return null;
    }

    // Cleanup
    destroy() {
        // Remove observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove dashboard
        if (this.dashboard) {
            this.dashboard.remove();
        }
        
        console.log('🔍 Performance monitor destroyed');
    }
}

// Initialize performance monitor
window.performanceMonitor = new InvestQuestPerformanceMonitor();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvestQuestPerformanceMonitor;
}

console.log('🔍 Performance monitor script loaded');