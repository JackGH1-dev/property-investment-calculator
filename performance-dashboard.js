/**
 * Performance Dashboard
 * Real-time performance visualization and monitoring interface
 */

class PerformanceDashboard {
    constructor(container) {
        this.container = container;
        this.isInitialized = false;
        this.updateInterval = null;
        this.charts = {};
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📊 Initializing Performance Dashboard...');
        
        // Create dashboard HTML
        this.createDashboardHTML();
        
        // Setup real-time updates
        this.setupRealTimeUpdates();
        
        // Initialize charts if Chart.js is available
        this.initializeCharts();
        
        this.isInitialized = true;
        console.log('✅ Performance Dashboard initialized');
    }

    createDashboardHTML() {
        const dashboardHTML = `
            <div class="performance-dashboard" id="performanceDashboard">
                <div class="dashboard-header">
                    <h3>📊 Performance Monitor</h3>
                    <div class="dashboard-controls">
                        <button class="toggle-btn" id="dashboardToggle">−</button>
                        <button class="export-btn" id="exportMetrics">Export</button>
                    </div>
                </div>
                
                <div class="dashboard-content" id="dashboardContent">
                    <!-- Web Vitals Section -->
                    <div class="metrics-section">
                        <h4>🚀 Web Vitals</h4>
                        <div class="vitals-grid">
                            <div class="vital-metric" data-metric="LCP">
                                <div class="metric-label">LCP</div>
                                <div class="metric-value" id="lcpValue">-</div>
                                <div class="metric-status" id="lcpStatus">measuring...</div>
                            </div>
                            <div class="vital-metric" data-metric="FID">
                                <div class="metric-label">FID</div>
                                <div class="metric-value" id="fidValue">-</div>
                                <div class="metric-status" id="fidStatus">measuring...</div>
                            </div>
                            <div class="vital-metric" data-metric="CLS">
                                <div class="metric-label">CLS</div>
                                <div class="metric-value" id="clsValue">-</div>
                                <div class="metric-status" id="clsStatus">measuring...</div>
                            </div>
                            <div class="vital-metric" data-metric="FCP">
                                <div class="metric-label">FCP</div>
                                <div class="metric-value" id="fcpValue">-</div>
                                <div class="metric-status" id="fcpStatus">measuring...</div>
                            </div>
                        </div>
                    </div>

                    <!-- System Performance -->
                    <div class="metrics-section">
                        <h4>⚡ System Performance</h4>
                        <div class="system-metrics">
                            <div class="system-metric">
                                <label>Memory Usage:</label>
                                <span id="memoryUsage">-</span>
                            </div>
                            <div class="system-metric">
                                <label>Page Load:</label>
                                <span id="pageLoadTime">-</span>
                            </div>
                            <div class="system-metric">
                                <label>DOM Ready:</label>
                                <span id="domReadyTime">-</span>
                            </div>
                            <div class="system-metric">
                                <label>Session:</label>
                                <span id="sessionDuration">-</span>
                            </div>
                        </div>
                    </div>

                    <!-- Feature Usage -->
                    <div class="metrics-section">
                        <h4>🎯 Feature Usage</h4>
                        <div class="feature-usage" id="featureUsage">
                            <div class="usage-placeholder">No feature usage data yet</div>
                        </div>
                    </div>

                    <!-- Error Tracking -->
                    <div class="metrics-section">
                        <h4>🚨 Error Tracking</h4>
                        <div class="error-summary">
                            <div class="error-count">
                                <label>Errors:</label>
                                <span id="errorCount">0</span>
                            </div>
                            <div class="error-list" id="errorList">
                                <div class="no-errors">No errors detected ✅</div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="metrics-section">
                        <h4>📈 Recent Activity</h4>
                        <div class="activity-log" id="activityLog">
                            <div class="activity-placeholder">Monitoring user activity...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (typeof this.container === 'string') {
            const containerElement = document.querySelector(this.container);
            if (containerElement) {
                containerElement.innerHTML = dashboardHTML;
            }
        } else if (this.container) {
            this.container.innerHTML = dashboardHTML;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Dashboard toggle
        const toggleBtn = document.getElementById('dashboardToggle');
        const dashboardContent = document.getElementById('dashboardContent');
        
        if (toggleBtn && dashboardContent) {
            toggleBtn.addEventListener('click', () => {
                const isCollapsed = dashboardContent.style.display === 'none';
                dashboardContent.style.display = isCollapsed ? 'block' : 'none';
                toggleBtn.textContent = isCollapsed ? '−' : '+';
            });
        }

        // Export metrics
        const exportBtn = document.getElementById('exportMetrics');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportMetrics());
        }
    }

    setupRealTimeUpdates() {
        // Update dashboard every 2 seconds
        this.updateInterval = setInterval(() => {
            this.updateDashboard();
        }, 2000);

        // Update immediately
        this.updateDashboard();
    }

    updateDashboard() {
        if (!window.performanceMonitor) return;

        const metrics = window.performanceMonitor.getSessionMetrics();
        
        // Update Web Vitals
        this.updateWebVitals(metrics.webVitals);
        
        // Update system metrics
        this.updateSystemMetrics(metrics);
        
        // Update feature usage
        this.updateFeatureUsage(metrics.featureUsage);
        
        // Update error tracking
        this.updateErrorTracking();
        
        // Update activity log
        this.updateActivityLog();
    }

    updateWebVitals(webVitals) {
        const vitals = [
            { name: 'LCP', value: webVitals.LCP, threshold: 2500, unit: 'ms' },
            { name: 'FID', value: webVitals.FID, threshold: 100, unit: 'ms' },
            { name: 'CLS', value: webVitals.CLS, threshold: 0.1, unit: '', precision: 3 },
            { name: 'FCP', value: webVitals.FCP, threshold: 1800, unit: 'ms' }
        ];

        vitals.forEach(vital => {
            const valueElement = document.getElementById(`${vital.name.toLowerCase()}Value`);
            const statusElement = document.getElementById(`${vital.name.toLowerCase()}Status`);
            
            if (valueElement && statusElement) {
                if (vital.value !== undefined) {
                    const displayValue = vital.precision ? 
                        vital.value.toFixed(vital.precision) : 
                        Math.round(vital.value);
                    
                    valueElement.textContent = `${displayValue}${vital.unit}`;
                    
                    const status = vital.value <= vital.threshold ? 'good' : 
                                 vital.value <= vital.threshold * 2 ? 'needs-improvement' : 'poor';
                    
                    statusElement.textContent = status.replace('-', ' ');
                    statusElement.className = `metric-status ${status}`;
                } else {
                    valueElement.textContent = '-';
                    statusElement.textContent = 'measuring...';
                    statusElement.className = 'metric-status measuring';
                }
            }
        });
    }

    updateSystemMetrics(metrics) {
        // Memory usage
        const memoryElement = document.getElementById('memoryUsage');
        if (memoryElement && window.performanceMonitor) {
            const memoryInfo = window.performanceMonitor.getMemoryInfo();
            if (memoryInfo) {
                memoryElement.textContent = `${memoryInfo.usedJSHeapSize}MB / ${memoryInfo.totalJSHeapSize}MB`;
            } else {
                memoryElement.textContent = 'Not available';
            }
        }

        // Page load time
        const pageLoadElement = document.getElementById('pageLoadTime');
        if (pageLoadElement && metrics.pageMetrics?.pageLoadTime) {
            pageLoadElement.textContent = `${Math.round(metrics.pageMetrics.pageLoadTime)}ms`;
        }

        // DOM ready time
        const domReadyElement = document.getElementById('domReadyTime');
        if (domReadyElement && metrics.pageMetrics?.domContentLoaded) {
            domReadyElement.textContent = `${Math.round(metrics.pageMetrics.domContentLoaded)}ms`;
        }

        // Session duration
        const sessionElement = document.getElementById('sessionDuration');
        if (sessionElement && metrics.sessionDuration) {
            const duration = Math.round(metrics.sessionDuration / 1000);
            sessionElement.textContent = `${duration}s`;
        }
    }

    updateFeatureUsage(featureUsage) {
        const container = document.getElementById('featureUsage');
        if (!container) return;

        if (!featureUsage || Object.keys(featureUsage).length === 0) {
            container.innerHTML = '<div class="usage-placeholder">No feature usage data yet</div>';
            return;
        }

        const usageHTML = Object.entries(featureUsage).map(([feature, usageArray]) => `
            <div class="feature-item">
                <div class="feature-name">${this.formatFeatureName(feature)}</div>
                <div class="feature-count">${usageArray.length}</div>
            </div>
        `).join('');

        container.innerHTML = usageHTML;
    }

    updateErrorTracking() {
        const errorCountElement = document.getElementById('errorCount');
        const errorListElement = document.getElementById('errorList');
        
        if (!errorCountElement || !errorListElement || !window.performanceMonitor) return;

        const errors = window.performanceMonitor.metrics.errors;
        errorCountElement.textContent = errors.length;

        if (errors.length === 0) {
            errorListElement.innerHTML = '<div class="no-errors">No errors detected ✅</div>';
        } else {
            const recentErrors = errors.slice(-3);
            const errorsHTML = recentErrors.map(error => `
                <div class="error-item">
                    <div class="error-type">${error.type}</div>
                    <div class="error-time">${new Date(error.timestamp).toLocaleTimeString()}</div>
                    <div class="error-message">${this.truncateText(error.details.message || 'Unknown error', 50)}</div>
                </div>
            `).join('');
            
            errorListElement.innerHTML = errorsHTML;
        }
    }

    updateActivityLog() {
        const activityElement = document.getElementById('activityLog');
        if (!activityElement || !window.performanceMonitor) return;

        const interactions = window.performanceMonitor.metrics.userInteractions.slice(-5);
        
        if (interactions.length === 0) {
            activityElement.innerHTML = '<div class="activity-placeholder">Monitoring user activity...</div>';
            return;
        }

        const activityHTML = interactions.map(interaction => `
            <div class="activity-item">
                <div class="activity-type">${interaction.type}</div>
                <div class="activity-target">${interaction.target}</div>
                <div class="activity-time">${new Date(interaction.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');

        activityElement.innerHTML = activityHTML;
    }

    formatFeatureName(feature) {
        return feature.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    truncateText(text, maxLength) {
        if (!text) return 'Unknown';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    exportMetrics() {
        if (!window.performanceMonitor) {
            alert('Performance monitor not available');
            return;
        }

        const metrics = window.performanceMonitor.getSessionMetrics();
        const exportData = {
            ...metrics,
            exportedAt: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Create downloadable JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📊 Performance metrics exported');
    }

    initializeCharts() {
        // Initialize charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.createPerformanceChart();
        }
    }

    createPerformanceChart() {
        // This would create visual charts for performance data
        // Placeholder for future chart implementation
        console.log('📈 Charts would be initialized here with Chart.js');
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isInitialized = false;
        console.log('📊 Performance Dashboard destroyed');
    }
}

// Auto-initialize performance dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Look for a performance dashboard container
    const container = document.querySelector('.performance-dashboard-container') || 
                     document.querySelector('#performanceDashboard') ||
                     document.body;
    
    if (container && !window.location.pathname.includes('dashboard')) {
        // Only show on calculator page or other non-dashboard pages
        window.performanceDashboard = new PerformanceDashboard(container);
        
        // Initialize after performance monitor is ready
        setTimeout(() => {
            if (window.performanceDashboard) {
                window.performanceDashboard.init();
            }
        }, 1000);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceDashboard;
}