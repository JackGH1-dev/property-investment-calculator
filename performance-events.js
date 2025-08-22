/**
 * Performance Events Integration
 * Connects existing features to performance monitoring
 */

// Initialize performance event tracking when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializePerformanceEvents();
});

function initializePerformanceEvents() {
    console.log('🔗 Initializing performance event tracking...');
    
    // Track property search events
    setupPropertySearchTracking();
    
    // Track PDF generation events
    setupPDFGenerationTracking();
    
    // Track market insights events
    setupMarketInsightsTracking();
    
    // Track user feedback events
    setupUserFeedbackTracking();
    
    // Track calculator interaction events
    setupCalculatorTracking();
    
    console.log('✅ Performance event tracking initialized');
}

function setupPropertySearchTracking() {
    // Track property search usage
    document.addEventListener('input', (event) => {
        if (event.target.id === 'address' && window.performanceMonitor) {
            // Debounce search tracking
            clearTimeout(window.searchTrackingTimeout);
            window.searchTrackingTimeout = setTimeout(() => {
                if (event.target.value.length > 3) {
                    window.performanceMonitor.trackFeature('property_search_input', {
                        queryLength: event.target.value.length,
                        hasMarketData: !!(window.marketDataService && window.marketDataService.isInitialized)
                    });
                }
            }, 1000);
        }
    });

    // Track property selection from search results
    document.addEventListener('click', (event) => {
        if (event.target.closest('.search-result') && window.performanceMonitor) {
            const propertyElement = event.target.closest('.search-result');
            const propertyId = propertyElement.getAttribute('data-property-id');
            
            window.performanceMonitor.trackFeature('property_search_selection', {
                propertyId,
                hasMarketData: propertyElement.querySelector('.market-data-preview') !== null
            });
            
            // Dispatch custom event for property selection
            document.dispatchEvent(new CustomEvent('propertySearchUsed', {
                detail: {
                    propertyId,
                    query: document.getElementById('address')?.value,
                    resultsCount: document.querySelectorAll('.search-result').length
                }
            }));
        }
    });
}

function setupPDFGenerationTracking() {
    // Track PDF generation attempts
    document.addEventListener('click', (event) => {
        if ((event.target.matches('.generate-pdf-btn') || 
             event.target.closest('.generate-pdf-btn')) && 
            window.performanceMonitor) {
            
            const startTime = performance.now();
            const reportType = event.target.getAttribute('data-report-type') || 'basic';
            
            window.performanceMonitor.trackFeature('pdf_generation_attempt', {
                reportType,
                timestamp: Date.now()
            });
            
            // Track completion (this would be called from the PDF generator)
            const originalGeneratePDF = window.generatePDF;
            if (originalGeneratePDF) {
                window.generatePDF = function(...args) {
                    const result = originalGeneratePDF.apply(this, args);
                    const generationTime = performance.now() - startTime;
                    
                    if (window.performanceMonitor) {
                        window.performanceMonitor.trackFeature('pdf_generation_success', {
                            reportType,
                            generationTime: Math.round(generationTime)
                        });
                        
                        // Dispatch custom event
                        document.dispatchEvent(new CustomEvent('pdfGenerated', {
                            detail: {
                                reportType,
                                generationTime
                            }
                        }));
                    }
                    
                    return result;
                };
            }
        }
    });
}

function setupMarketInsightsTracking() {
    // Track market insights widget usage
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const marketWidget = document.getElementById('marketInsightsWidget');
                if (marketWidget && marketWidget.style.display !== 'none') {
                    const addressField = document.getElementById('address');
                    if (addressField && addressField.value && window.performanceMonitor) {
                        window.performanceMonitor.trackFeature('market_insights_viewed', {
                            address: addressField.value,
                            dataSource: marketWidget.querySelector('#dataSource')?.textContent || 'unknown'
                        });
                        
                        // Dispatch custom event
                        document.dispatchEvent(new CustomEvent('marketInsightsViewed', {
                            detail: {
                                address: addressField.value,
                                dataSource: 'market_data_service'
                            }
                        }));
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

function setupUserFeedbackTracking() {
    // Track feedback submissions
    document.addEventListener('click', (event) => {
        if (event.target.matches('.feedback-submit-btn') && window.performanceMonitor) {
            const feedbackType = event.target.getAttribute('data-feedback-type') || 'general';
            const rating = document.querySelector('.feedback-rating.selected')?.getAttribute('data-rating');
            
            window.performanceMonitor.trackFeature('user_feedback_submitted', {
                feedbackType,
                rating: rating ? parseInt(rating) : null,
                timestamp: Date.now()
            });
        }
    });
    
    // Track feedback widget display
    document.addEventListener('feedbackDisplayed', (event) => {
        if (window.performanceMonitor) {
            window.performanceMonitor.trackFeature('feedback_widget_shown', {
                trigger: event.detail?.trigger || 'unknown',
                feedbackType: event.detail?.type || 'general'
            });
        }
    });
}

function setupCalculatorTracking() {
    // Track form field interactions
    const formFields = [
        'address', 'purchasePrice', 'deposit', 'rentalIncome', 
        'state', 'isFirstHomeBuyer', 'propertyGrowth', 'rentalGrowth'
    ];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', () => {
                if (window.performanceMonitor) {
                    window.performanceMonitor.trackFeature('calculator_field_updated', {
                        field: fieldId,
                        hasValue: !!field.value,
                        timestamp: Date.now()
                    });
                }
            });
        }
    });
    
    // Track calculation button clicks
    document.addEventListener('click', (event) => {
        if (event.target.matches('#calculateBtn') && window.performanceMonitor) {
            const startTime = performance.now();
            
            window.performanceMonitor.trackFeature('calculation_started', {
                timestamp: Date.now()
            });
            
            // Track calculation completion
            setTimeout(() => {
                const resultsVisible = document.getElementById('results')?.style.display !== 'none';
                const calculationTime = performance.now() - startTime;
                
                if (resultsVisible && window.performanceMonitor) {
                    window.performanceMonitor.trackFeature('calculation_completed', {
                        calculationTime: Math.round(calculationTime),
                        timestamp: Date.now()
                    });
                }
            }, 100);
        }
    });
    
    // Track save button clicks
    document.addEventListener('click', (event) => {
        if (event.target.matches('#saveCalculationBtn') && window.performanceMonitor) {
            window.performanceMonitor.trackFeature('save_button_clicked', {
                authenticated: !!(window.authManager && window.authManager.isAuthenticated()),
                timestamp: Date.now()
            });
        }
    });
}

// Track page performance milestones
function trackPageMilestones() {
    // Track when all scripts are loaded
    window.addEventListener('load', () => {
        if (window.performanceMonitor) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            
            window.performanceMonitor.trackEvent('page_fully_loaded', {
                loadTime,
                scriptsLoaded: {
                    performanceMonitor: !!window.performanceMonitor,
                    marketDataService: !!window.marketDataService,
                    propertySearch: !!window.propertySearchManager,
                    userFeedback: !!window.userFeedbackSystem,
                    authManager: !!window.authManager
                }
            });
        }
    });
    
    // Track when calculator is ready
    const checkCalculatorReady = () => {
        if (window.propertyCalculator && window.performanceMonitor) {
            window.performanceMonitor.trackEvent('calculator_ready', {
                readyTime: performance.now(),
                allServicesLoaded: !!(
                    window.marketDataService &&
                    window.authManager &&
                    window.propertySearchManager
                )
            });
        } else {
            setTimeout(checkCalculatorReady, 100);
        }
    };
    
    checkCalculatorReady();
}

// Track feature initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(trackPageMilestones, 500);
});

// Error tracking for performance-related issues
window.addEventListener('error', (event) => {
    if (window.performanceMonitor && 
        (event.message.includes('performance') || 
         event.message.includes('monitor') ||
         event.message.includes('tracking'))) {
        
        window.performanceMonitor.trackEvent('performance_tracking_error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            timestamp: Date.now()
        });
    }
});

// Export tracking functions for manual use
window.performanceEvents = {
    trackCustomEvent: (eventName, properties) => {
        if (window.performanceMonitor) {
            window.performanceMonitor.track(eventName, properties);
        }
    },
    
    trackFeatureUsage: (featureName, details) => {
        if (window.performanceMonitor) {
            window.performanceMonitor.trackFeature(featureName, details);
        }
    },
    
    trackError: (errorType, details) => {
        if (window.performanceMonitor) {
            window.performanceMonitor.trackError(errorType, details);
        }
    }
};