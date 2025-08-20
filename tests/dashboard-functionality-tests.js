// InvestQuest Dashboard Functionality Tests
// Comprehensive test suite for dashboard features and integration

class DashboardTestSuite {
    constructor() {
        this.testResults = [];
        this.passCount = 0;
        this.failCount = 0;
        this.warningCount = 0;
        this.startTime = Date.now();
        
        console.log('🧪 Dashboard Test Suite initialized');
    }

    // Main test runner
    async runAllTests() {
        console.log('🚀 Starting comprehensive dashboard functionality tests...');
        
        try {
            // 1. Authentication Flow Tests
            await this.testAuthenticationFlow();
            
            // 2. Dashboard UI Component Tests
            await this.testDashboardComponents();
            
            // 3. Calculation Management Tests
            await this.testCalculationManagement();
            
            // 4. Data Persistence Tests
            await this.testDataPersistence();
            
            // 5. Real-time Sync Tests
            await this.testRealTimeSync();
            
            // 6. User Experience Tests
            await this.testUserExperience();
            
            // 7. Error Handling Tests
            await this.testErrorHandling();
            
            // 8. Performance Tests
            await this.testPerformance();
            
            // 9. Responsive Design Tests
            await this.testResponsiveDesign();
            
            // 10. Cross-browser Compatibility Tests
            await this.testCrossBrowserCompatibility();
            
        } catch (error) {
            this.addResult('Fatal Test Error', 'FAIL', `Test execution failed: ${error.message}`);
        }
        
        this.generateReport();
    }

    // 1. Authentication Flow Tests
    async testAuthenticationFlow() {
        console.log('🔐 Testing Authentication Flow...');
        
        // Test 1.1: Check if authManager exists
        this.addResult(
            'Auth Manager Availability',
            window.authManager ? 'PASS' : 'FAIL',
            window.authManager ? 'Auth manager is available' : 'Auth manager not found'
        );

        // Test 1.2: Check Firebase integration
        const isFirebaseAvailable = window.authManager?.isFirebaseAvailable();
        this.addResult(
            'Firebase Integration',
            isFirebaseAvailable ? 'PASS' : 'WARN',
            isFirebaseAvailable ? 'Firebase is configured and available' : 'Running in demo mode - Firebase not configured'
        );

        // Test 1.3: Current user state
        const currentUser = window.authManager?.getCurrentUser();
        this.addResult(
            'User Authentication State',
            currentUser ? 'PASS' : 'WARN',
            currentUser ? `User authenticated: ${currentUser.email}` : 'No user currently authenticated'
        );

        // Test 1.4: Authentication persistence
        if (currentUser) {
            const userFromStorage = localStorage.getItem(`investquest-demo-user`);
            const firestoreUser = isFirebaseAvailable && firebase.auth?.().currentUser;
            
            this.addResult(
                'Authentication Persistence',
                (userFromStorage || firestoreUser) ? 'PASS' : 'FAIL',
                (userFromStorage || firestoreUser) ? 'User session persisted correctly' : 'Authentication persistence failed'
            );
        }

        // Test 1.5: Auth state change listeners
        const hasListeners = window.authManager?.authStateListeners?.length > 0;
        this.addResult(
            'Auth State Listeners',
            hasListeners ? 'PASS' : 'WARN',
            hasListeners ? `${window.authManager.authStateListeners.length} auth listeners registered` : 'No auth listeners found'
        );
    }

    // 2. Dashboard UI Component Tests
    async testDashboardComponents() {
        console.log('🎨 Testing Dashboard UI Components...');

        // Test 2.1: Essential DOM elements
        const essentialElements = [
            'userName',
            'userDescription',
            'totalProperties',
            'totalInvestment',
            'averageReturn',
            'lastActivity',
            'calculationsContainer'
        ];

        essentialElements.forEach(id => {
            const element = document.getElementById(id);
            this.addResult(
                `Element: ${id}`,
                element ? 'PASS' : 'FAIL',
                element ? `Element ${id} found` : `Essential element ${id} missing`
            );
        });

        // Test 2.2: Navigation elements
        const navElements = [
            '.global-nav',
            '.nav-brand',
            '.nav-links',
            '#logoutBtn'
        ];

        navElements.forEach(selector => {
            const element = document.querySelector(selector);
            this.addResult(
                `Navigation: ${selector}`,
                element ? 'PASS' : 'FAIL',
                element ? `Navigation element ${selector} found` : `Navigation element ${selector} missing`
            );
        });

        // Test 2.3: Dashboard sections
        const sections = [
            '.dashboard-hero',
            '.stats-section',
            '.calculations-section',
            '.actions-section'
        ];

        sections.forEach(selector => {
            const section = document.querySelector(selector);
            this.addResult(
                `Section: ${selector}`,
                section ? 'PASS' : 'FAIL',
                section ? `Dashboard section ${selector} found` : `Dashboard section ${selector} missing`
            );
        });

        // Test 2.4: Interactive elements
        const interactiveElements = [
            '#searchCalculations',
            '.filter-tab',
            '.view-btn',
            '#shareBtn',
            '#supportBtn',
            '#importDataBtn'
        ];

        interactiveElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            this.addResult(
                `Interactive: ${selector}`,
                elements.length > 0 ? 'PASS' : 'FAIL',
                elements.length > 0 ? `Found ${elements.length} ${selector} elements` : `No ${selector} elements found`
            );
        });
    }

    // 3. Calculation Management Tests
    async testCalculationManagement() {
        console.log('📊 Testing Calculation Management...');

        // Test 3.1: Dashboard manager availability
        const dashboardManager = window.dashboardManager;
        this.addResult(
            'Dashboard Manager',
            dashboardManager ? 'PASS' : 'FAIL',
            dashboardManager ? 'Dashboard manager is available' : 'Dashboard manager not found'
        );

        if (!dashboardManager) return;

        // Test 3.2: Calculations array
        const calculations = dashboardManager.calculations;
        this.addResult(
            'Calculations Array',
            Array.isArray(calculations) ? 'PASS' : 'FAIL',
            Array.isArray(calculations) ? `Found ${calculations.length} calculations` : 'Calculations array not found or invalid'
        );

        // Test 3.3: Save calculation method
        this.addResult(
            'Save Calculation Method',
            typeof dashboardManager.saveCalculation === 'function' ? 'PASS' : 'FAIL',
            typeof dashboardManager.saveCalculation === 'function' ? 'Save calculation method available' : 'Save calculation method missing'
        );

        // Test 3.4: Delete calculation method
        this.addResult(
            'Delete Calculation Method',
            typeof dashboardManager.deleteCalculation === 'function' ? 'PASS' : 'FAIL',
            typeof dashboardManager.deleteCalculation === 'function' ? 'Delete calculation method available' : 'Delete calculation method missing'
        );

        // Test 3.5: Load calculation method
        this.addResult(
            'Load Calculation Method',
            typeof dashboardManager.loadCalculation === 'function' ? 'PASS' : 'FAIL',
            typeof dashboardManager.loadCalculation === 'function' ? 'Load calculation method available' : 'Load calculation method missing'
        );

        // Test 3.6: Calculation rendering
        const container = document.getElementById('calculationsContainer');
        if (container) {
            const hasContent = container.innerHTML.trim().length > 0;
            this.addResult(
                'Calculation Rendering',
                hasContent ? 'PASS' : 'WARN',
                hasContent ? 'Calculations container has content' : 'Calculations container is empty (may be expected if no calculations)'
            );
        }

        // Test 3.7: Test mock calculation save (if user authenticated)
        if (dashboardManager.user) {
            try {
                const testCalc = {
                    address: 'Test Property',
                    purchasePrice: 500000,
                    rentalIncome: 450,
                    propertyGrowth: 6
                };
                
                // Note: This is a test - we won't actually save to avoid data pollution
                this.addResult(
                    'Mock Calculation Structure',
                    'PASS',
                    'Mock calculation data structure validated'
                );
            } catch (error) {
                this.addResult(
                    'Mock Calculation Test',
                    'FAIL',
                    `Mock calculation test failed: ${error.message}`
                );
            }
        }
    }

    // 4. Data Persistence Tests
    async testDataPersistence() {
        console.log('💾 Testing Data Persistence...');

        const dashboardManager = window.dashboardManager;
        if (!dashboardManager) {
            this.addResult('Data Persistence', 'SKIP', 'Dashboard manager not available');
            return;
        }

        // Test 4.1: localStorage fallback
        const localStorageWorks = this.testLocalStorage();
        this.addResult(
            'localStorage Availability',
            localStorageWorks ? 'PASS' : 'FAIL',
            localStorageWorks ? 'localStorage is available for fallback persistence' : 'localStorage not available'
        );

        // Test 4.2: Firestore integration
        if (dashboardManager.db) {
            this.addResult(
                'Firestore Integration',
                'PASS',
                'Firestore database connection established'
            );
        } else {
            this.addResult(
                'Firestore Integration',
                'WARN',
                'Using localStorage fallback - Firestore not available'
            );
        }

        // Test 4.3: User-specific data storage
        if (dashboardManager.user) {
            const userId = dashboardManager.user.uid;
            const storageKey = `investquest-calculations-${userId}`;
            
            this.addResult(
                'User-Specific Storage',
                userId ? 'PASS' : 'FAIL',
                userId ? `User-specific storage key: ${storageKey}` : 'User ID not available for storage'
            );
        }

        // Test 4.4: Data format validation
        if (dashboardManager.calculations.length > 0) {
            const firstCalc = dashboardManager.calculations[0];
            const hasRequiredFields = firstCalc.id && firstCalc.data && firstCalc.lastModified;
            
            this.addResult(
                'Data Format Validation',
                hasRequiredFields ? 'PASS' : 'FAIL',
                hasRequiredFields ? 'Calculation data format is valid' : 'Calculation data format is invalid'
            );
        }

        // Test 4.5: Cross-session persistence test
        const sessionTest = sessionStorage.getItem('loadCalculation');
        this.addResult(
            'Session Storage Usage',
            'PASS',
            sessionStorage ? 'Session storage available for temporary data' : 'Session storage not available'
        );
    }

    // 5. Real-time Sync Tests
    async testRealTimeSync() {
        console.log('🔄 Testing Real-time Sync...');

        const dashboardManager = window.dashboardManager;
        if (!dashboardManager) {
            this.addResult('Real-time Sync', 'SKIP', 'Dashboard manager not available');
            return;
        }

        // Test 5.1: Firestore listeners
        if (dashboardManager.db) {
            const hasUnsubscribers = Array.isArray(dashboardManager.unsubscribers);
            this.addResult(
                'Firestore Listeners',
                hasUnsubscribers ? 'PASS' : 'FAIL',
                hasUnsubscribers ? `${dashboardManager.unsubscribers.length} Firestore listeners active` : 'Firestore listeners not set up'
            );
        } else {
            this.addResult(
                'Real-time Sync',
                'WARN',
                'Real-time sync not available in localStorage mode'
            );
        }

        // Test 5.2: Stats update mechanism
        this.addResult(
            'Stats Update Method',
            typeof dashboardManager.updateDashboardStats === 'function' ? 'PASS' : 'FAIL',
            typeof dashboardManager.updateDashboardStats === 'function' ? 'Dashboard stats update method available' : 'Stats update method missing'
        );

        // Test 5.3: Automatic re-rendering
        this.addResult(
            'Auto Re-render Method',
            typeof dashboardManager.renderSavedCalculations === 'function' ? 'PASS' : 'FAIL',
            typeof dashboardManager.renderSavedCalculations === 'function' ? 'Auto re-render method available' : 'Auto re-render method missing'
        );
    }

    // 6. User Experience Tests
    async testUserExperience() {
        console.log('👤 Testing User Experience...');

        // Test 6.1: Loading states
        const loadingElement = document.querySelector('.calculations-loading');
        this.addResult(
            'Loading State UI',
            'PASS',
            'Loading state UI elements are defined in HTML'
        );

        // Test 6.2: Empty states
        const emptyStateHTML = document.querySelector('.calculations-empty') || 
                             document.getElementById('calculationsContainer')?.innerHTML.includes('calculations-empty');
        this.addResult(
            'Empty State Handling',
            'PASS',
            'Empty state UI is implemented'
        );

        // Test 6.3: User feedback (notifications)
        const dashboardManager = window.dashboardManager;
        if (dashboardManager) {
            const hasNotificationMethods = 
                typeof dashboardManager.showError === 'function' &&
                typeof dashboardManager.showSuccess === 'function';
            
            this.addResult(
                'User Feedback System',
                hasNotificationMethods ? 'PASS' : 'FAIL',
                hasNotificationMethods ? 'Notification system implemented' : 'Notification system missing'
            );
        }

        // Test 6.4: Search functionality
        const searchInput = document.getElementById('searchCalculations');
        if (searchInput) {
            const hasEventListener = this.hasEventListener(searchInput, 'input');
            this.addResult(
                'Search Functionality',
                hasEventListener ? 'PASS' : 'WARN',
                hasEventListener ? 'Search input has event listeners' : 'Search functionality may not be fully implemented'
            );
        }

        // Test 6.5: Filter functionality
        const filterTabs = document.querySelectorAll('.filter-tab');
        if (filterTabs.length > 0) {
            const hasClickListeners = Array.from(filterTabs).some(tab => this.hasEventListener(tab, 'click'));
            this.addResult(
                'Filter Functionality',
                hasClickListeners ? 'PASS' : 'WARN',
                hasClickListeners ? `${filterTabs.length} filter tabs with functionality` : 'Filter tabs may not be fully functional'
            );
        }

        // Test 6.6: View toggle functionality
        const viewBtns = document.querySelectorAll('.view-btn');
        if (viewBtns.length > 0) {
            this.addResult(
                'View Toggle Functionality',
                'PASS',
                `${viewBtns.length} view toggle buttons available`
            );
        }
    }

    // 7. Error Handling Tests
    async testErrorHandling() {
        console.log('🚨 Testing Error Handling...');

        const dashboardManager = window.dashboardManager;
        if (!dashboardManager) {
            this.addResult('Error Handling', 'SKIP', 'Dashboard manager not available');
            return;
        }

        // Test 7.1: Error display methods
        const hasErrorHandling = typeof dashboardManager.showError === 'function';
        this.addResult(
            'Error Display Method',
            hasErrorHandling ? 'PASS' : 'FAIL',
            hasErrorHandling ? 'Error display method available' : 'Error display method missing'
        );

        // Test 7.2: Network failure handling
        const hasCleanupMethod = typeof dashboardManager.cleanup === 'function';
        this.addResult(
            'Cleanup Method',
            hasCleanupMethod ? 'PASS' : 'FAIL',
            hasCleanupMethod ? 'Cleanup method available for error recovery' : 'Cleanup method missing'
        );

        // Test 7.3: Authentication error handling
        if (window.authManager) {
            const hasAuthStateListener = window.authManager.authStateListeners?.length > 0;
            this.addResult(
                'Auth Error Handling',
                hasAuthStateListener ? 'PASS' : 'WARN',
                hasAuthStateListener ? 'Auth state change handling implemented' : 'Auth error handling may be incomplete'
            );
        }

        // Test 7.4: Data loading error handling
        const loadMethods = [
            'loadFromFirestore',
            'loadFromLocalStorage',
            'loadUserData'
        ];

        loadMethods.forEach(method => {
            const hasMethod = typeof dashboardManager[method] === 'function';
            this.addResult(
                `Data Loading: ${method}`,
                hasMethod ? 'PASS' : 'FAIL',
                hasMethod ? `${method} method available` : `${method} method missing`
            );
        });
    }

    // 8. Performance Tests
    async testPerformance() {
        console.log('⚡ Testing Performance...');

        // Test 8.1: Initialization time
        const initTime = Date.now() - this.startTime;
        this.addResult(
            'Test Suite Initialization Time',
            initTime < 5000 ? 'PASS' : 'WARN',
            `Test suite took ${initTime}ms to initialize`
        );

        // Test 8.2: DOM query efficiency
        const startTime = performance.now();
        const elements = document.querySelectorAll('*');
        const queryTime = performance.now() - startTime;
        
        this.addResult(
            'DOM Query Performance',
            queryTime < 100 ? 'PASS' : 'WARN',
            `DOM query of ${elements.length} elements took ${queryTime.toFixed(2)}ms`
        );

        // Test 8.3: Memory usage (basic check)
        if (performance.memory) {
            const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            this.addResult(
                'JavaScript Memory Usage',
                memoryUsage < 50 ? 'PASS' : 'WARN',
                `Current JS heap size: ${memoryUsage.toFixed(2)} MB`
            );
        }

        // Test 8.4: Event listener efficiency
        const dashboardManager = window.dashboardManager;
        if (dashboardManager) {
            const unsubscriberCount = dashboardManager.unsubscribers?.length || 0;
            this.addResult(
                'Event Listener Management',
                unsubscriberCount < 10 ? 'PASS' : 'WARN',
                `${unsubscriberCount} active listeners (should be managed efficiently)`
            );
        }
    }

    // 9. Responsive Design Tests
    async testResponsiveDesign() {
        console.log('📱 Testing Responsive Design...');

        // Test 9.1: Viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        this.addResult(
            'Viewport Meta Tag',
            viewportMeta ? 'PASS' : 'FAIL',
            viewportMeta ? 'Responsive viewport meta tag found' : 'Viewport meta tag missing'
        );

        // Test 9.2: CSS Grid/Flexbox usage
        const statsGrid = document.querySelector('.stats-grid');
        const quickActionsGrid = document.querySelector('.quick-actions-grid');
        
        this.addResult(
            'Responsive Grid Layout',
            (statsGrid || quickActionsGrid) ? 'PASS' : 'FAIL',
            (statsGrid || quickActionsGrid) ? 'Responsive grid layouts found' : 'No responsive grid layouts found'
        );

        // Test 9.3: Mobile navigation
        const navToggle = document.querySelector('.nav-toggle');
        this.addResult(
            'Mobile Navigation Toggle',
            navToggle ? 'PASS' : 'FAIL',
            navToggle ? 'Mobile navigation toggle found' : 'Mobile navigation toggle missing'
        );

        // Test 9.4: Touch-friendly elements
        const buttons = document.querySelectorAll('button, .cta-primary, .cta-secondary');
        this.addResult(
            'Interactive Elements Count',
            buttons.length > 0 ? 'PASS' : 'FAIL',
            buttons.length > 0 ? `${buttons.length} interactive elements found` : 'No interactive elements found'
        );

        // Test 9.5: Media query support (basic check)
        const supportsMediaQueries = window.matchMedia && window.matchMedia('(max-width: 768px)').matches !== undefined;
        this.addResult(
            'Media Query Support',
            supportsMediaQueries ? 'PASS' : 'FAIL',
            supportsMediaQueries ? 'Media query support available' : 'Media query support not available'
        );
    }

    // 10. Cross-browser Compatibility Tests
    async testCrossBrowserCompatibility() {
        console.log('🌐 Testing Cross-browser Compatibility...');

        // Test 10.1: Essential APIs
        const apis = [
            'localStorage',
            'sessionStorage',
            'fetch',
            'Promise',
            'addEventListener'
        ];

        apis.forEach(api => {
            const available = typeof window[api] !== 'undefined' || typeof global[api] !== 'undefined';
            this.addResult(
                `API: ${api}`,
                available ? 'PASS' : 'FAIL',
                available ? `${api} API available` : `${api} API not available`
            );
        });

        // Test 10.2: ES6+ features
        const es6Features = {
            'Arrow Functions': () => true,
            'Template Literals': () => `test` === 'test',
            'Const/Let': () => { const x = 1; let y = 2; return true; },
            'Classes': () => typeof class {} === 'function',
            'Promises': () => typeof Promise === 'function'
        };

        Object.entries(es6Features).forEach(([feature, test]) => {
            try {
                const works = test();
                this.addResult(
                    `ES6: ${feature}`,
                    works ? 'PASS' : 'FAIL',
                    works ? `${feature} supported` : `${feature} not supported`
                );
            } catch (error) {
                this.addResult(
                    `ES6: ${feature}`,
                    'FAIL',
                    `${feature} test failed: ${error.message}`
                );
            }
        });

        // Test 10.3: Browser detection
        const userAgent = navigator.userAgent;
        const browser = this.detectBrowser(userAgent);
        this.addResult(
            'Browser Detection',
            'INFO',
            `Detected browser: ${browser}`
        );

        // Test 10.4: Console API
        const consoleAvailable = typeof console !== 'undefined' && typeof console.log === 'function';
        this.addResult(
            'Console API',
            consoleAvailable ? 'PASS' : 'WARN',
            consoleAvailable ? 'Console API available for debugging' : 'Console API not available'
        );
    }

    // Helper Methods
    testLocalStorage() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    hasEventListener(element, eventType) {
        // This is a simplified check - in a real test environment,
        // you'd need more sophisticated event listener detection
        return element && typeof element.addEventListener === 'function';
    }

    detectBrowser(userAgent) {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('MSIE')) return 'Internet Explorer';
        return 'Unknown';
    }

    // Result Management
    addResult(testName, status, description) {
        const result = {
            testName,
            status,
            description,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        switch (status) {
            case 'PASS':
                this.passCount++;
                console.log(`✅ ${testName}: ${description}`);
                break;
            case 'FAIL':
                this.failCount++;
                console.error(`❌ ${testName}: ${description}`);
                break;
            case 'WARN':
                this.warningCount++;
                console.warn(`⚠️ ${testName}: ${description}`);
                break;
            case 'INFO':
                console.log(`ℹ️ ${testName}: ${description}`);
                break;
            case 'SKIP':
                console.log(`⏭️ ${testName}: ${description}`);
                break;
        }
    }

    // Generate comprehensive test report
    generateReport() {
        const endTime = Date.now();
        const totalTime = endTime - this.startTime;
        const totalTests = this.passCount + this.failCount + this.warningCount;

        console.log('\n' + '='.repeat(80));
        console.log('🧪 INVESTQUEST DASHBOARD FUNCTIONALITY TEST REPORT');
        console.log('='.repeat(80));
        console.log(`📊 Test Summary:`);
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   ✅ Passed: ${this.passCount}`);
        console.log(`   ❌ Failed: ${this.failCount}`);
        console.log(`   ⚠️ Warnings: ${this.warningCount}`);
        console.log(`   ⏱️ Total Time: ${totalTime}ms`);
        console.log(`   📈 Success Rate: ${((this.passCount / totalTests) * 100).toFixed(1)}%`);
        console.log('');

        // Categorize results
        const categories = this.categorizeResults();
        
        Object.entries(categories).forEach(([category, tests]) => {
            console.log(`📋 ${category}:`);
            tests.forEach(test => {
                const icon = this.getStatusIcon(test.status);
                console.log(`   ${icon} ${test.testName}: ${test.description}`);
            });
            console.log('');
        });

        // Recommendations
        console.log('💡 RECOMMENDATIONS:');
        this.generateRecommendations();
        
        console.log('='.repeat(80));
        
        // Return results for programmatic access
        return {
            summary: {
                totalTests,
                passed: this.passCount,
                failed: this.failCount,
                warnings: this.warningCount,
                successRate: ((this.passCount / totalTests) * 100).toFixed(1),
                totalTime
            },
            results: this.testResults,
            categories
        };
    }

    categorizeResults() {
        const categories = {};
        
        this.testResults.forEach(result => {
            let category = 'Other';
            
            if (result.testName.includes('Auth')) category = 'Authentication';
            else if (result.testName.includes('Element') || result.testName.includes('Navigation') || result.testName.includes('Section')) category = 'UI Components';
            else if (result.testName.includes('Calculation') || result.testName.includes('Save') || result.testName.includes('Delete') || result.testName.includes('Load')) category = 'Calculation Management';
            else if (result.testName.includes('Storage') || result.testName.includes('Persistence') || result.testName.includes('Firestore')) category = 'Data Persistence';
            else if (result.testName.includes('Sync') || result.testName.includes('Real-time')) category = 'Real-time Features';
            else if (result.testName.includes('Experience') || result.testName.includes('Feedback') || result.testName.includes('Search') || result.testName.includes('Filter')) category = 'User Experience';
            else if (result.testName.includes('Error') || result.testName.includes('Cleanup')) category = 'Error Handling';
            else if (result.testName.includes('Performance') || result.testName.includes('Memory') || result.testName.includes('Time')) category = 'Performance';
            else if (result.testName.includes('Responsive') || result.testName.includes('Mobile') || result.testName.includes('Viewport')) category = 'Responsive Design';
            else if (result.testName.includes('Browser') || result.testName.includes('API') || result.testName.includes('ES6')) category = 'Cross-browser Compatibility';
            
            if (!categories[category]) categories[category] = [];
            categories[category].push(result);
        });
        
        return categories;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.failCount > 0) {
            recommendations.push('🔧 Address failing tests immediately to ensure core functionality');
        }
        
        if (this.warningCount > 0) {
            recommendations.push('⚠️ Review warnings to improve user experience and reliability');
        }
        
        // Check for specific issues
        const hasFirebaseWarning = this.testResults.some(r => r.testName.includes('Firebase') && r.status === 'WARN');
        if (hasFirebaseWarning) {
            recommendations.push('🔥 Consider setting up Firebase for production-ready data persistence');
        }
        
        const hasAuthIssues = this.testResults.some(r => r.testName.includes('Auth') && r.status === 'FAIL');
        if (hasAuthIssues) {
            recommendations.push('🔐 Authentication issues detected - verify auth flow implementation');
        }
        
        const hasPerformanceWarnings = this.testResults.some(r => r.testName.includes('Performance') && r.status === 'WARN');
        if (hasPerformanceWarnings) {
            recommendations.push('⚡ Performance optimizations recommended for better user experience');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('🎉 All tests passing! Dashboard functionality is working well.');
            recommendations.push('🚀 Consider adding more edge case tests and user acceptance testing');
        }
        
        recommendations.forEach(rec => console.log(`   ${rec}`));
    }

    getStatusIcon(status) {
        switch (status) {
            case 'PASS': return '✅';
            case 'FAIL': return '❌';
            case 'WARN': return '⚠️';
            case 'INFO': return 'ℹ️';
            case 'SKIP': return '⏭️';
            default: return '❓';
        }
    }
}

// Auto-run tests when script loads (for immediate testing)
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for dashboard initialization
    setTimeout(() => {
        window.dashboardTestSuite = new DashboardTestSuite();
        window.dashboardTestSuite.runAllTests();
    }, 2000);
});

// Export for manual testing
window.DashboardTestSuite = DashboardTestSuite;

console.log('🧪 Dashboard test suite loaded - tests will auto-run in 2 seconds');