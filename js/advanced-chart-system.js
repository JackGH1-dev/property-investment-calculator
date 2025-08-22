/**
 * Advanced Chart System - Phase 2 Implementation
 * ProjectionLab-Inspired Financial Visualizations
 */

class AdvancedChartSystem {
    constructor() {
        this.charts = new Map();
        this.themes = this.getProjectionLabThemes();
        this.animations = this.getAnimationConfig();
        this.observers = new Map();
        this.isInitialized = false;
        
        // Performance monitoring integration
        this.perfMonitor = window.performanceMonitor || null;
    }

    /**
     * Initialize the advanced chart system
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Load Chart.js with advanced plugins
            await this.loadChartLibrary();
            
            // Initialize chart containers
            this.setupChartContainers();
            
            // Setup responsive observers
            this.setupResponsiveObservers();
            
            this.isInitialized = true;
            console.log('🎯 Advanced Chart System initialized');
            
            if (this.perfMonitor) {
                this.perfMonitor.trackEvent('chart_system_initialized');
            }
            
        } catch (error) {
            console.error('❌ Chart system initialization failed:', error);
        }
    }

    /**
     * ProjectionLab-inspired color themes
     */
    getProjectionLabThemes() {
        return {
            primary: {
                main: '#1867C0',
                gradient: ['#1867C0', '#26A6A2'],
                accent: '#F59E0B'
            },
            financial: {
                positive: '#10B981',
                negative: '#EF4444',
                neutral: '#6B7280',
                warning: '#F59E0B'
            },
            advanced: {
                probabilityHigh: 'rgba(24, 103, 192, 0.8)',
                probabilityMed: 'rgba(24, 103, 192, 0.5)',
                probabilityLow: 'rgba(24, 103, 192, 0.2)',
                scenario1: '#1867C0',
                scenario2: '#26A6A2',
                scenario3: '#F59E0B'
            }
        };
    }

    /**
     * Animation configuration for smooth interactions
     */
    getAnimationConfig() {
        return {
            duration: 750,
            easing: 'easeInOutCubic',
            delay: (context) => context.dataIndex * 50,
            loop: false,
            onComplete: () => {
                if (this.perfMonitor) {
                    this.perfMonitor.trackEvent('chart_animation_complete');
                }
            }
        };
    }

    /**
     * Load Chart.js with required plugins
     */
    async loadChartLibrary() {
        return new Promise((resolve, reject) => {
            if (window.Chart) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
            script.onload = () => {
                // Register additional plugins if available
                this.registerChartPlugins();
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Register additional Chart.js plugins
     */
    registerChartPlugins() {
        if (window.Chart) {
            // Register zoom plugin if available
            Chart.register(...Object.values(Chart.controllers));
        }
    }

    /**
     * Setup responsive chart containers
     */
    setupChartContainers() {
        const containers = document.querySelectorAll('[data-chart-type]');
        containers.forEach(container => {
            const observer = new IntersectionObserver(
                (entries) => this.handleChartVisibility(entries),
                { threshold: 0.1 }
            );
            observer.observe(container);
            this.observers.set(container.id, observer);
        });
    }

    /**
     * Handle chart visibility for performance optimization
     */
    handleChartVisibility(entries) {
        entries.forEach(entry => {
            const chartId = entry.target.id;
            if (entry.isIntersecting) {
                this.activateChart(chartId);
            } else {
                this.deactivateChart(chartId);
            }
        });
    }

    /**
     * Create advanced projection chart with probability cone
     */
    createProjectionChart(containerId, data, options = {}) {
        const canvas = this.getOrCreateCanvas(containerId, 'projection');
        const ctx = canvas.getContext('2d');

        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    // Main projection line
                    {
                        label: 'Expected Property Value',
                        data: data.expectedValues,
                        borderColor: this.themes.primary.main,
                        backgroundColor: `${this.themes.primary.main}20`,
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointBackgroundColor: this.themes.primary.main,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    },
                    // Optimistic scenario
                    {
                        label: '75th Percentile',
                        data: data.optimisticValues,
                        borderColor: this.themes.advanced.probabilityHigh,
                        backgroundColor: `${this.themes.advanced.probabilityHigh}10`,
                        borderWidth: 1,
                        borderDash: [5, 5],
                        fill: '+1',
                        tension: 0.4,
                        pointRadius: 0
                    },
                    // Pessimistic scenario  
                    {
                        label: '25th Percentile',
                        data: data.pessimisticValues,
                        borderColor: this.themes.advanced.probabilityLow,
                        backgroundColor: `${this.themes.advanced.probabilityLow}10`,
                        borderWidth: 1,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: options.title || 'Property Value Projection',
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: 'Inter'
                        },
                        color: '#111827'
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.themes.primary.main,
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: (context) => `Year ${context[0].dataIndex + 1}`,
                            label: (context) => {
                                const value = context.parsed.y;
                                return `${context.dataset.label}: $${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Years',
                            font: {
                                family: 'Inter',
                                size: 14,
                                weight: '600'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Property Value ($)',
                            font: {
                                family: 'Inter',
                                size: 14,
                                weight: '600'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                animation: this.animations
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(containerId, chart);
        
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('projection_chart_created', {
                dataPoints: data.labels.length,
                datasets: config.data.datasets.length
            });
        }

        return chart;
    }

    /**
     * Create cash flow comparison chart
     */
    createCashFlowChart(containerId, data, options = {}) {
        const canvas = this.getOrCreateCanvas(containerId, 'cashflow');
        const ctx = canvas.getContext('2d');

        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Annual Cash Flow',
                    data: data.cashFlows,
                    backgroundColor: data.cashFlows.map(cf => 
                        cf >= 0 ? this.themes.financial.positive + '80' : this.themes.financial.negative + '80'
                    ),
                    borderColor: data.cashFlows.map(cf => 
                        cf >= 0 ? this.themes.financial.positive : this.themes.financial.negative
                    ),
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || 'Cash Flow Analysis',
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: 'Inter'
                        },
                        color: '#111827'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.themes.primary.main,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                const prefix = value >= 0 ? '+' : '';
                                return `Cash Flow: ${prefix}$${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Years',
                            font: { family: 'Inter', size: 14, weight: '600' }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Cash Flow ($)',
                            font: { family: 'Inter', size: 14, weight: '600' }
                        },
                        ticks: {
                            callback: function(value) {
                                const prefix = value >= 0 ? '+' : '';
                                return prefix + '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                animation: this.animations
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(containerId, chart);
        return chart;
    }

    /**
     * Create scenario comparison chart
     */
    createScenarioChart(containerId, scenarios, options = {}) {
        const canvas = this.getOrCreateCanvas(containerId, 'scenario');
        const ctx = canvas.getContext('2d');

        const datasets = scenarios.map((scenario, index) => ({
            label: scenario.name,
            data: scenario.values,
            borderColor: Object.values(this.themes.advanced)[index] || this.themes.primary.main,
            backgroundColor: `${Object.values(this.themes.advanced)[index] || this.themes.primary.main}20`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6
        }));

        const config = {
            type: 'line',
            data: {
                labels: scenarios[0].labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: options.title || 'Scenario Comparison',
                        font: { size: 18, weight: 'bold', family: 'Inter' },
                        color: '#111827'
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { family: 'Inter', size: 12 }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Years' }
                    },
                    y: {
                        title: { display: true, text: 'Value ($)' },
                        ticks: {
                            callback: (value) => '$' + value.toLocaleString()
                        }
                    }
                },
                animation: this.animations
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(containerId, chart);
        return chart;
    }

    /**
     * Get or create canvas element
     */
    getOrCreateCanvas(containerId, chartType) {
        let canvas = document.querySelector(`#${containerId} canvas`);
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = `${containerId}-canvas`;
            canvas.setAttribute('data-chart-type', chartType);
            
            const container = document.getElementById(containerId);
            if (container) {
                container.appendChild(canvas);
            }
        }
        return canvas;
    }

    /**
     * Update existing chart with new data
     */
    updateChart(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        chart.data = newData;
        chart.update('active');
        
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('chart_updated', { chartId });
        }
    }

    /**
     * Destroy chart and cleanup
     */
    destroyChart(chartId) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.destroy();
            this.charts.delete(chartId);
        }

        const observer = this.observers.get(chartId);
        if (observer) {
            observer.disconnect();
            this.observers.delete(chartId);
        }
    }

    /**
     * Setup responsive observers
     */
    setupResponsiveObservers() {
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                const chartId = entry.target.id;
                const chart = this.charts.get(chartId);
                if (chart) {
                    chart.resize();
                }
            });
        });

        // Observe all chart containers
        this.charts.forEach((chart, containerId) => {
            const container = document.getElementById(containerId);
            if (container) {
                resizeObserver.observe(container);
            }
        });
    }

    /**
     * Activate chart (for performance optimization)
     */
    activateChart(chartId) {
        const chart = this.charts.get(chartId);
        if (chart && chart.canvas) {
            chart.canvas.style.opacity = '1';
            chart.update('none');
        }
    }

    /**
     * Deactivate chart (for performance optimization)
     */
    deactivateChart(chartId) {
        const chart = this.charts.get(chartId);
        if (chart && chart.canvas) {
            chart.canvas.style.opacity = '0.7';
        }
    }

    /**
     * Export chart as image
     */
    exportChart(chartId, format = 'png') {
        const chart = this.charts.get(chartId);
        if (!chart) return null;

        const url = chart.toBase64Image(format, 1.0);
        return url;
    }

    /**
     * Cleanup all charts and observers
     */
    cleanup() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
        
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Initialize and export
const advancedChartSystem = new AdvancedChartSystem();
window.advancedChartSystem = advancedChartSystem;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => advancedChartSystem.init());
} else {
    advancedChartSystem.init();
}

console.log('🎯 Advanced Chart System loaded - ProjectionLab Style');