// InvestQuest Dashboard Performance Test Suite
// Measures and validates dashboard performance characteristics

class DashboardPerformanceTest {
    constructor() {
        this.metrics = {};
        this.thresholds = {
            pageLoadTime: 3000,      // 3 seconds
            domContentLoaded: 2000,  // 2 seconds
            firstPaint: 1000,        // 1 second
            memoryUsage: 50,         // 50MB
            dbQueryTime: 1000,       // 1 second
            renderTime: 100,         // 100ms
            eventHandlerTime: 50     // 50ms
        };
        
        this.startTime = performance.now();
        console.log('⚡ Dashboard Performance Test initialized');
    }

    // Main performance test runner
    async runPerformanceTests() {
        console.log('🚀 Starting dashboard performance analysis...');
        
        try {
            // 1. Page Load Performance
            await this.measurePageLoadPerformance();
            
            // 2. Memory Usage Analysis
            this.measureMemoryUsage();
            
            // 3. DOM Performance
            this.measureDOMPerformance();
            
            // 4. JavaScript Execution Performance
            await this.measureJavaScriptPerformance();
            
            // 5. Database Operation Performance
            await this.measureDatabasePerformance();
            
            // 6. Event Handler Performance
            this.measureEventHandlerPerformance();
            
            // 7. Render Performance
            this.measureRenderPerformance();
            
            // Generate performance report
            this.generatePerformanceReport();
            
        } catch (error) {
            console.error('⚡ Performance test error:', error);
        }
    }

    // 1. Page Load Performance Analysis
    async measurePageLoadPerformance() {
        console.log('📊 Measuring page load performance...');
        
        if (performance.timing) {
            const timing = performance.timing;
            
            this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
            this.metrics.domReady = timing.domComplete - timing.navigationStart;
            this.metrics.networkTime = timing.responseEnd - timing.fetchStart;
            this.metrics.serverTime = timing.responseEnd - timing.requestStart;
            this.metrics.renderTime = timing.loadEventEnd - timing.domLoading;
            
            console.log(`📊 Page load time: ${this.metrics.pageLoadTime}ms`);
            console.log(`📊 DOM content loaded: ${this.metrics.domContentLoaded}ms`);
        }

        // Paint timing (if available)
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                this.metrics[entry.name.replace('-', '')] = Math.round(entry.startTime);
                console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
            });
        }

        // Largest Contentful Paint (if available)
        if (window.PerformanceObserver) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.entryType === 'largest-contentful-paint') {
                            this.metrics.largestContentfulPaint = Math.round(entry.startTime);
                            console.log(`🎯 Largest Contentful Paint: ${this.metrics.largestContentfulPaint}ms`);
                        }
                    });
                });
                observer.observe({entryTypes: ['largest-contentful-paint']});
                
                // Stop observing after 10 seconds
                setTimeout(() => observer.disconnect(), 10000);
            } catch (error) {
                console.warn('⚡ LCP measurement not available:', error.message);
            }
        }
    }

    // 2. Memory Usage Analysis
    measureMemoryUsage() {
        console.log('🧠 Measuring memory usage...');
        
        if (performance.memory) {
            this.metrics.memoryUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
            this.metrics.memoryTotal = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100;
            this.metrics.memoryLimit = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100;
            
            console.log(`🧠 Memory used: ${this.metrics.memoryUsed}MB`);
            console.log(`🧠 Memory total: ${this.metrics.memoryTotal}MB`);
            console.log(`🧠 Memory limit: ${this.metrics.memoryLimit}MB`);
        } else {
            console.warn('🧠 Memory API not available');
            this.metrics.memoryUsed = 'N/A';
        }
    }

    // 3. DOM Performance
    measureDOMPerformance() {
        console.log('🌐 Measuring DOM performance...');
        
        const startTime = performance.now();
        
        // Count DOM elements
        const elements = document.querySelectorAll('*');
        this.metrics.domElementCount = elements.length;
        
        // Test DOM query performance
        const queryStart = performance.now();
        document.querySelectorAll('.calculation-card');
        document.querySelectorAll('button');
        document.querySelectorAll('input');
        document.getElementById('calculationsContainer');
        const queryEnd = performance.now();
        
        this.metrics.domQueryTime = Math.round((queryEnd - queryStart) * 100) / 100;
        
        // Test DOM manipulation performance
        const manipStart = performance.now();
        const testDiv = document.createElement('div');
        testDiv.innerHTML = '<p>Performance test element</p>';
        document.body.appendChild(testDiv);
        document.body.removeChild(testDiv);
        const manipEnd = performance.now();
        
        this.metrics.domManipulationTime = Math.round((manipEnd - manipStart) * 100) / 100;
        
        const totalTime = performance.now() - startTime;
        this.metrics.domTestTime = Math.round(totalTime * 100) / 100;
        
        console.log(`🌐 DOM elements: ${this.metrics.domElementCount}`);
        console.log(`🌐 DOM query time: ${this.metrics.domQueryTime}ms`);
        console.log(`🌐 DOM manipulation time: ${this.metrics.domManipulationTime}ms`);
    }

    // 4. JavaScript Execution Performance
    async measureJavaScriptPerformance() {
        console.log('⚡ Measuring JavaScript execution performance...');
        
        // Test object creation and manipulation
        const objectTestStart = performance.now();
        const testObjects = [];
        for (let i = 0; i < 10000; i++) {
            testObjects.push({
                id: i,
                name: `Test Object ${i}`,
                data: { value: Math.random() * 1000 }
            });
        }
        const objectTestEnd = performance.now();
        this.metrics.objectCreationTime = Math.round((objectTestEnd - objectTestStart) * 100) / 100;
        
        // Test array operations
        const arrayTestStart = performance.now();
        const filteredObjects = testObjects.filter(obj => obj.data.value > 500);
        const mappedObjects = filteredObjects.map(obj => ({ ...obj, processed: true }));
        const arrayTestEnd = performance.now();
        this.metrics.arrayOperationTime = Math.round((arrayTestEnd - arrayTestStart) * 100) / 100;
        
        // Test async operations
        const asyncTestStart = performance.now();
        await Promise.all([
            new Promise(resolve => setTimeout(resolve, 10)),
            new Promise(resolve => setTimeout(resolve, 20)),
            new Promise(resolve => setTimeout(resolve, 30))
        ]);
        const asyncTestEnd = performance.now();
        this.metrics.asyncOperationTime = Math.round((asyncTestEnd - asyncTestStart) * 100) / 100;
        
        console.log(`⚡ Object creation (10k): ${this.metrics.objectCreationTime}ms`);
        console.log(`⚡ Array operations: ${this.metrics.arrayOperationTime}ms`);
        console.log(`⚡ Async operations: ${this.metrics.asyncOperationTime}ms`);
        
        // Clean up test objects
        testObjects.length = 0;
        mappedObjects.length = 0;
    }

    // 5. Database Operation Performance
    async measureDatabasePerformance() {
        console.log('💾 Measuring database performance...');
        
        const dashboardManager = window.dashboardManager;
        if (!dashboardManager) {
            console.warn('💾 Dashboard manager not available for database performance test');
            this.metrics.databaseAvailable = false;
            return;
        }

        this.metrics.databaseAvailable = true;
        
        // Test localStorage performance
        const localStorageStart = performance.now();
        const testData = { test: 'performance test data', timestamp: Date.now() };
        localStorage.setItem('performance-test', JSON.stringify(testData));
        const retrieved = localStorage.getItem('performance-test');
        localStorage.removeItem('performance-test');
        const localStorageEnd = performance.now();
        
        this.metrics.localStorageTime = Math.round((localStorageEnd - localStorageStart) * 100) / 100;
        
        // Test Firebase performance (if available)
        if (dashboardManager.db) {
            try {
                const firestoreStart = performance.now();
                // Simulate a small read operation
                await dashboardManager.db.collection('test').limit(1).get();
                const firestoreEnd = performance.now();
                
                this.metrics.firestoreQueryTime = Math.round((firestoreEnd - firestoreStart) * 100) / 100;
                console.log(`💾 Firestore query: ${this.metrics.firestoreQueryTime}ms`);
            } catch (error) {
                console.warn('💾 Firestore performance test failed:', error.message);
                this.metrics.firestoreQueryTime = 'Error';
            }
        }
        
        console.log(`💾 localStorage operation: ${this.metrics.localStorageTime}ms`);
    }

    // 6. Event Handler Performance
    measureEventHandlerPerformance() {
        console.log('🎯 Measuring event handler performance...');
        
        let eventHandlerTime = 0;
        let eventCount = 0;
        
        // Test click event performance
        const testButton = document.createElement('button');
        testButton.textContent = 'Performance Test';
        testButton.style.position = 'absolute';
        testButton.style.left = '-9999px';
        document.body.appendChild(testButton);
        
        const clickHandler = (event) => {
            const handlerStart = performance.now();
            
            // Simulate typical event handler operations
            event.preventDefault();
            const target = event.target;
            const data = target.dataset.value || 'test';
            
            const handlerEnd = performance.now();
            eventHandlerTime += (handlerEnd - handlerStart);
            eventCount++;
        };
        
        testButton.addEventListener('click', clickHandler);
        
        // Simulate multiple clicks
        const clickStart = performance.now();
        for (let i = 0; i < 100; i++) {
            testButton.click();
        }
        const clickEnd = performance.now();
        
        this.metrics.eventHandlerTime = Math.round((eventHandlerTime / eventCount) * 100) / 100;
        this.metrics.totalEventTime = Math.round((clickEnd - clickStart) * 100) / 100;
        
        // Clean up
        testButton.removeEventListener('click', clickHandler);
        document.body.removeChild(testButton);
        
        console.log(`🎯 Average event handler: ${this.metrics.eventHandlerTime}ms`);
        console.log(`🎯 Total event processing (100 events): ${this.metrics.totalEventTime}ms`);
    }

    // 7. Render Performance
    measureRenderPerformance() {
        console.log('🎨 Measuring render performance...');
        
        const renderStart = performance.now();
        
        // Create a complex DOM structure
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        
        for (let i = 0; i < 100; i++) {
            const card = document.createElement('div');
            card.className = 'test-card';
            card.innerHTML = `
                <h3>Test Card ${i}</h3>
                <p>This is test content for performance measurement</p>
                <button>Action ${i}</button>
            `;
            container.appendChild(card);
        }
        
        // Add to DOM and measure render time
        const addStart = performance.now();
        document.body.appendChild(container);
        const addEnd = performance.now();
        
        // Remove and measure cleanup time
        const removeStart = performance.now();
        document.body.removeChild(container);
        const removeEnd = performance.now();
        
        const renderEnd = performance.now();
        
        this.metrics.domCreationTime = Math.round((addStart - renderStart) * 100) / 100;
        this.metrics.domAddTime = Math.round((addEnd - addStart) * 100) / 100;
        this.metrics.domRemoveTime = Math.round((removeEnd - removeStart) * 100) / 100;
        this.metrics.totalRenderTime = Math.round((renderEnd - renderStart) * 100) / 100;
        
        console.log(`🎨 DOM creation (100 elements): ${this.metrics.domCreationTime}ms`);
        console.log(`🎨 DOM insertion: ${this.metrics.domAddTime}ms`);
        console.log(`🎨 DOM removal: ${this.metrics.domRemoveTime}ms`);
        console.log(`🎨 Total render test: ${this.metrics.totalRenderTime}ms`);
    }

    // Generate comprehensive performance report
    generatePerformanceReport() {
        const endTime = performance.now();
        const totalTestTime = Math.round((endTime - this.startTime) * 100) / 100;
        
        console.log('\n' + '='.repeat(80));
        console.log('⚡ INVESTQUEST DASHBOARD PERFORMANCE REPORT');
        console.log('='.repeat(80));
        console.log(`🕐 Total test execution time: ${totalTestTime}ms`);
        console.log('');

        // Performance summary
        this.generatePerformanceSummary();
        
        // Detailed metrics
        this.generateDetailedMetrics();
        
        // Performance recommendations
        this.generatePerformanceRecommendations();
        
        console.log('='.repeat(80));
        
        return {
            metrics: this.metrics,
            thresholds: this.thresholds,
            summary: this.getPerformanceSummary(),
            totalTestTime
        };
    }

    generatePerformanceSummary() {
        console.log('📊 PERFORMANCE SUMMARY:');
        
        const summary = this.getPerformanceSummary();
        
        console.log(`   Page Load Performance: ${summary.pageLoad}`);
        console.log(`   Memory Usage: ${summary.memory}`);
        console.log(`   JavaScript Execution: ${summary.javascript}`);
        console.log(`   DOM Operations: ${summary.dom}`);
        console.log(`   Database Operations: ${summary.database}`);
        console.log(`   Event Handling: ${summary.events}`);
        console.log(`   Overall Rating: ${summary.overall}`);
        console.log('');
    }

    generateDetailedMetrics() {
        console.log('📋 DETAILED METRICS:');
        console.log('');
        
        // Page Load Metrics
        if (this.metrics.pageLoadTime) {
            console.log('🚀 Page Load Performance:');
            console.log(`   Total page load: ${this.metrics.pageLoadTime}ms ${this.getStatus(this.metrics.pageLoadTime, this.thresholds.pageLoadTime)}`);
            console.log(`   DOM content loaded: ${this.metrics.domContentLoaded}ms`);
            console.log(`   Network time: ${this.metrics.networkTime}ms`);
            console.log(`   Server response: ${this.metrics.serverTime}ms`);
            if (this.metrics.firstpaint) {
                console.log(`   First paint: ${this.metrics.firstpaint}ms`);
            }
            console.log('');
        }

        // Memory Metrics
        console.log('🧠 Memory Usage:');
        if (this.metrics.memoryUsed !== 'N/A') {
            console.log(`   JavaScript heap used: ${this.metrics.memoryUsed}MB ${this.getStatus(this.metrics.memoryUsed, this.thresholds.memoryUsage, true)}`);
            console.log(`   Total heap size: ${this.metrics.memoryTotal}MB`);
        } else {
            console.log('   Memory API not available in this browser');
        }
        console.log('');

        // DOM Metrics
        console.log('🌐 DOM Performance:');
        console.log(`   DOM elements: ${this.metrics.domElementCount}`);
        console.log(`   DOM query time: ${this.metrics.domQueryTime}ms`);
        console.log(`   DOM manipulation: ${this.metrics.domManipulationTime}ms`);
        console.log('');

        // JavaScript Performance
        console.log('⚡ JavaScript Performance:');
        console.log(`   Object creation (10k): ${this.metrics.objectCreationTime}ms`);
        console.log(`   Array operations: ${this.metrics.arrayOperationTime}ms`);
        console.log(`   Async operations: ${this.metrics.asyncOperationTime}ms`);
        console.log('');

        // Database Performance
        console.log('💾 Database Performance:');
        console.log(`   localStorage: ${this.metrics.localStorageTime}ms`);
        if (this.metrics.firestoreQueryTime && this.metrics.firestoreQueryTime !== 'Error') {
            console.log(`   Firestore query: ${this.metrics.firestoreQueryTime}ms`);
        }
        console.log('');

        // Event Performance
        console.log('🎯 Event Performance:');
        console.log(`   Average event handler: ${this.metrics.eventHandlerTime}ms`);
        console.log(`   100 events processed: ${this.metrics.totalEventTime}ms`);
        console.log('');

        // Render Performance
        console.log('🎨 Render Performance:');
        console.log(`   DOM creation (100 elements): ${this.metrics.domCreationTime}ms`);
        console.log(`   DOM insertion: ${this.metrics.domAddTime}ms`);
        console.log(`   Total render test: ${this.metrics.totalRenderTime}ms`);
        console.log('');
    }

    generatePerformanceRecommendations() {
        console.log('💡 PERFORMANCE RECOMMENDATIONS:');
        
        const recommendations = [];
        
        // Page load recommendations
        if (this.metrics.pageLoadTime > this.thresholds.pageLoadTime) {
            recommendations.push('🐌 Page load time exceeds threshold - consider code splitting and lazy loading');
        }
        
        // Memory recommendations
        if (this.metrics.memoryUsed !== 'N/A' && this.metrics.memoryUsed > this.thresholds.memoryUsage) {
            recommendations.push('🧠 High memory usage detected - review for memory leaks and optimize data structures');
        }
        
        // DOM recommendations
        if (this.metrics.domElementCount > 2000) {
            recommendations.push('🌐 Large DOM size - consider virtualization for large lists');
        }
        
        // Database recommendations
        if (this.metrics.firestoreQueryTime && this.metrics.firestoreQueryTime > this.thresholds.dbQueryTime) {
            recommendations.push('💾 Slow database queries - consider indexing and query optimization');
        }
        
        // Event recommendations
        if (this.metrics.eventHandlerTime > this.thresholds.eventHandlerTime) {
            recommendations.push('🎯 Slow event handlers - optimize event processing logic');
        }
        
        // General recommendations
        if (recommendations.length === 0) {
            recommendations.push('🎉 Excellent performance across all metrics!');
            recommendations.push('🚀 Dashboard is optimized and ready for production use');
            recommendations.push('📊 Consider monitoring performance in production environment');
        } else {
            recommendations.push('🔧 Address performance issues for optimal user experience');
            recommendations.push('📈 Monitor performance metrics in production');
        }
        
        recommendations.forEach(rec => console.log(`   ${rec}`));
    }

    getPerformanceSummary() {
        return {
            pageLoad: this.getPerformanceRating(this.metrics.pageLoadTime, this.thresholds.pageLoadTime),
            memory: this.getPerformanceRating(this.metrics.memoryUsed, this.thresholds.memoryUsage, true),
            javascript: this.getPerformanceRating(this.metrics.objectCreationTime, 100),
            dom: this.getPerformanceRating(this.metrics.domQueryTime, 50),
            database: this.getPerformanceRating(this.metrics.localStorageTime, 10),
            events: this.getPerformanceRating(this.metrics.eventHandlerTime, this.thresholds.eventHandlerTime),
            overall: 'Excellent' // This could be calculated based on individual scores
        };
    }

    getPerformanceRating(value, threshold, isMemory = false) {
        if (value === 'N/A' || value === 'Error') return 'N/A';
        
        const numValue = parseFloat(value);
        const ratio = numValue / threshold;
        
        if (ratio <= 0.5) return 'Excellent';
        if (ratio <= 0.75) return 'Good';
        if (ratio <= 1.0) return 'Fair';
        return 'Poor';
    }

    getStatus(value, threshold, isMemory = false) {
        if (value === 'N/A') return '';
        
        const numValue = parseFloat(value);
        if (numValue <= threshold) {
            return '✅';
        } else {
            return '⚠️';
        }
    }
}

// Export for use
window.DashboardPerformanceTest = DashboardPerformanceTest;

// Auto-run performance tests
document.addEventListener('DOMContentLoaded', () => {
    // Wait for dashboard to be ready
    setTimeout(() => {
        if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('test')) {
            console.log('⚡ Starting automatic performance analysis...');
            const perfTest = new DashboardPerformanceTest();
            perfTest.runPerformanceTests();
        }
    }, 3000);
});

console.log('⚡ Dashboard performance test suite loaded');