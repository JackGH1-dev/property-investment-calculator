/**
 * Performance Optimizer
 * Handles Firebase loading optimization and general performance improvements
 */

class PerformanceOptimizer {
    constructor() {
        this.isInitialized = false;
        this.firebaseInitialized = false;
        this.performanceMetrics = {
            startTime: performance.now(),
            loadTimes: {},
            errors: []
        };
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('⚡ Initializing Performance Optimizer...');
        
        // Prevent duplicate Firebase loading
        this.preventDuplicateFirebaseLoading();
        
        // Optimize script loading
        this.optimizeScriptLoading();
        
        // Add performance monitoring
        this.setupPerformanceMonitoring();
        
        // Optimize calculations
        this.optimizeCalculations();
        
        this.isInitialized = true;
        console.log('✅ Performance Optimizer initialized');
    }

    preventDuplicateFirebaseLoading() {
        // Check if Firebase is already loaded
        if (window.firebase && window.firebase.apps && window.firebase.apps.length > 0) {
            console.log('🔥 Firebase already initialized, skipping duplicate loading');
            this.firebaseInitialized = true;
            return;
        }

        // Prevent multiple Firebase initializations
        const originalFirebaseInitialize = window.firebase?.initializeApp;
        if (originalFirebaseInitialize) {
            window.firebase.initializeApp = function(...args) {
                if (window.firebase.apps.length > 0) {
                    console.log('🔥 Preventing duplicate Firebase initialization');
                    return window.firebase.apps[0];
                }
                return originalFirebaseInitialize.apply(this, args);
            };
        }

        // Create a global Firebase initialization manager
        window.firebaseInitManager = {
            initialized: false,
            initializing: false,
            callbacks: [],
            
            async ensureInitialized() {
                if (this.initialized) return Promise.resolve();
                if (this.initializing) {
                    return new Promise(resolve => {
                        this.callbacks.push(resolve);
                    });
                }
                
                this.initializing = true;
                
                try {
                    // Initialize Firebase once
                    if (window.authManager && typeof window.authManager.init === 'function') {
                        await window.authManager.init();
                    }
                    
                    this.initialized = true;
                    this.initializing = false;
                    
                    // Call all waiting callbacks
                    this.callbacks.forEach(callback => callback());
                    this.callbacks = [];
                    
                    console.log('🔥 Firebase initialization completed');
                } catch (error) {
                    console.error('🔥 Firebase initialization failed:', error);
                    this.initializing = false;
                    throw error;
                }
            }
        };
    }

    optimizeScriptLoading() {
        // Preload critical resources
        const criticalResources = [
            'styles.css',
            'auth-production.js',
            'script.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });

        // Lazy load non-critical scripts
        this.lazyLoadNonCriticalScripts();
    }

    lazyLoadNonCriticalScripts() {
        // Scripts that can be loaded after initial page load
        const nonCriticalScripts = [
            'property-search.js',
            'pdf-report-generator.js'
        ];

        // Load these scripts after the page is fully loaded
        window.addEventListener('load', () => {
            nonCriticalScripts.forEach(script => {
                const scriptElement = document.createElement('script');
                scriptElement.src = script;
                scriptElement.async = true;
                document.body.appendChild(scriptElement);
            });
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorWebVitals();
        
        // Monitor custom performance metrics
        this.monitorCustomMetrics();
        
        // Setup performance observer
        this.setupPerformanceObserver();
    }

    monitorWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.performanceMetrics.lcp = lastEntry.startTime;
            console.log('⚡ LCP:', lastEntry.startTime.toFixed(2), 'ms');
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                console.log('⚡ FID:', (entry.processingStart - entry.startTime).toFixed(2), 'ms');
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.performanceMetrics.cls = clsValue;
            console.log('⚡ CLS:', clsValue.toFixed(4));
        }).observe({ entryTypes: ['layout-shift'] });
    }

    monitorCustomMetrics() {
        // Authentication timing
        const authStart = performance.now();
        document.addEventListener('authenticationComplete', () => {
            const authTime = performance.now() - authStart;
            this.performanceMetrics.authTime = authTime;
            console.log('⚡ Authentication Time:', authTime.toFixed(2), 'ms');
        });

        // Calculation timing
        window.addEventListener('calculationComplete', (e) => {
            this.performanceMetrics.calculationTime = e.detail.duration;
            console.log('⚡ Calculation Time:', e.detail.duration.toFixed(2), 'ms');
        });

        // Page load complete
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.performanceMetrics.startTime;
            this.performanceMetrics.totalLoadTime = loadTime;
            console.log('⚡ Total Load Time:', loadTime.toFixed(2), 'ms');
        });
    }

    setupPerformanceObserver() {
        // Monitor resource loading
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 1000) { // Log slow resources
                    console.warn('⚠️ Slow resource loading:', entry.name, entry.duration.toFixed(2), 'ms');
                }
            });
        }).observe({ entryTypes: ['resource'] });

        // Monitor long tasks
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 50) { // Tasks over 50ms
                    console.warn('⚠️ Long task detected:', entry.duration.toFixed(2), 'ms');
                }
            });
        }).observe({ entryTypes: ['longtask'] });
    }

    optimizeCalculations() {
        // Create a calculation cache
        window.calculationCache = new Map();
        
        // Debounce calculation updates
        window.debouncedCalculation = this.debounce((data) => {
            this.performOptimizedCalculation(data);
        }, 300);

        console.log('⚡ Calculation optimization ready');
    }

    performOptimizedCalculation(data) {
        const cacheKey = this.generateCacheKey(data);
        
        // Check cache first
        if (window.calculationCache.has(cacheKey)) {
            const cached = window.calculationCache.get(cacheKey);
            console.log('⚡ Using cached calculation result');
            this.displayCachedResult(cached);
            return;
        }

        const startTime = performance.now();
        
        // Perform calculation
        try {
            const result = this.executeCalculation(data);
            
            // Cache the result
            window.calculationCache.set(cacheKey, result);
            
            // Clean cache if it gets too large
            if (window.calculationCache.size > 100) {
                const firstKey = window.calculationCache.keys().next().value;
                window.calculationCache.delete(firstKey);
            }
            
            const duration = performance.now() - startTime;
            
            // Dispatch performance event
            window.dispatchEvent(new CustomEvent('calculationComplete', {
                detail: { duration, cached: false }
            }));
            
            console.log('⚡ Calculation completed in', duration.toFixed(2), 'ms');
            
        } catch (error) {
            console.error('⚡ Calculation error:', error);
            this.performanceMetrics.errors.push({
                type: 'calculation',
                error: error.message,
                timestamp: Date.now()
            });
        }
    }

    generateCacheKey(data) {
        // Create a cache key from calculation inputs
        const keyData = {
            purchasePrice: data.purchasePrice,
            deposit: data.deposit,
            interestRate: data.interestRate,
            loanTerm: data.loanTerm,
            rentalIncome: data.rentalIncome,
            propertyGrowth: data.propertyGrowth,
            rentalGrowth: data.rentalGrowth
        };
        
        return JSON.stringify(keyData);
    }

    executeCalculation(data) {
        // This would call the actual calculation logic
        if (window.propertyCalculator && window.propertyCalculator.generateProjections) {
            return window.propertyCalculator.generateProjections(data);
        }
        return null;
    }

    displayCachedResult(result) {
        // Display the cached calculation result
        if (window.propertyCalculator && window.propertyCalculator.displayResults) {
            window.propertyCalculator.displayResults(result);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance reporting
    getPerformanceReport() {
        return {
            ...this.performanceMetrics,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };
    }

    // Memory optimization
    optimizeMemory() {
        // Clean up event listeners
        window.addEventListener('beforeunload', () => {
            if (window.calculationCache) {
                window.calculationCache.clear();
            }
            
            // Clear intervals and timeouts
            for (let i = 1; i < 99999; i++) {
                clearTimeout(i);
                clearInterval(i);
            }
        });

        // Garbage collection hint for memory-intensive operations
        if (window.gc) {
            setInterval(() => {
                if (performance.memory && performance.memory.usedJSHeapSize > 50000000) { // 50MB
                    console.log('⚡ Suggesting garbage collection');
                    window.gc();
                }
            }, 30000);
        }
    }

    // Network optimization
    optimizeNetwork() {
        // Service worker for caching (if supported)
        if ('serviceWorker' in navigator) {
            this.setupServiceWorker();
        }

        // Prefetch likely navigation targets
        this.prefetchLikelyNavigation();
    }

    setupServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('⚡ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('⚡ Service Worker registration failed:', error);
            });
    }

    prefetchLikelyNavigation() {
        // Prefetch dashboard if user is on calculator
        if (window.location.pathname.includes('calculator')) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = 'dashboard.html';
            document.head.appendChild(link);
        }
    }
}

// Initialize performance optimizer immediately
const performanceOptimizer = new PerformanceOptimizer();
performanceOptimizer.init();

// Make it globally available
window.performanceOptimizer = performanceOptimizer;