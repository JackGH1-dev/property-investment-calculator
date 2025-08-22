/**
 * Market Insights Widget
 * Displays real-time market data and insights for properties
 */

class MarketInsightsWidget {
    constructor(container) {
        this.container = container;
        this.currentData = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📊 Initializing Market Insights Widget...');
        
        // Create widget HTML
        this.createWidgetHTML();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('✅ Market Insights Widget initialized');
    }

    createWidgetHTML() {
        const widgetHTML = `
            <div class="market-insights-widget" id="marketInsightsWidget" style="display: none;">
                <div class="widget-header">
                    <h4>📊 Market Insights</h4>
                    <button class="widget-toggle" id="widgetToggle">−</button>
                </div>
                <div class="widget-content" id="widgetContent">
                    <div class="insight-loading" id="insightLoading" style="display: none;">
                        <div class="loading-spinner"></div>
                        <span>Loading market data...</span>
                    </div>
                    <div class="insight-data" id="insightData" style="display: none;">
                        <div class="insight-grid">
                            <div class="insight-item">
                                <label>Suburb Median:</label>
                                <span class="value" id="suburbMedian">-</span>
                            </div>
                            <div class="insight-item">
                                <label>Price Growth (12m):</label>
                                <span class="value growth" id="priceGrowth">-</span>
                            </div>
                            <div class="insight-item">
                                <label>Rental Yield:</label>
                                <span class="value" id="rentalYield">-</span>
                            </div>
                            <div class="insight-item">
                                <label>Days on Market:</label>
                                <span class="value" id="daysOnMarket">-</span>
                            </div>
                            <div class="insight-item">
                                <label>Vacancy Rate:</label>
                                <span class="value" id="vacancyRate">-</span>
                            </div>
                            <div class="insight-item">
                                <label>Stock Levels:</label>
                                <span class="value" id="stockLevels">-</span>
                            </div>
                        </div>
                        <div class="recent-sales" id="recentSales" style="display: none;">
                            <h5>Recent Sales</h5>
                            <div class="sales-list" id="salesList"></div>
                        </div>
                        <div class="data-source" id="dataSource">
                            <small>Data updated: <span id="lastUpdated">-</span></small>
                        </div>
                    </div>
                    <div class="insight-error" id="insightError" style="display: none;">
                        <p>Unable to load market data at this time.</p>
                        <button class="retry-btn" id="retryBtn">Retry</button>
                    </div>
                </div>
            </div>
        `;

        if (typeof this.container === 'string') {
            const containerElement = document.querySelector(this.container);
            if (containerElement) {
                containerElement.innerHTML = widgetHTML;
            }
        } else if (this.container) {
            this.container.innerHTML = widgetHTML;
        }
    }

    setupEventListeners() {
        // Widget toggle functionality
        const toggleBtn = document.getElementById('widgetToggle');
        const widgetContent = document.getElementById('widgetContent');
        
        if (toggleBtn && widgetContent) {
            toggleBtn.addEventListener('click', () => {
                const isCollapsed = widgetContent.style.display === 'none';
                widgetContent.style.display = isCollapsed ? 'block' : 'none';
                toggleBtn.textContent = isCollapsed ? '−' : '+';
            });
        }

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                if (this.currentData && this.currentData.address) {
                    this.updateData(this.currentData.address);
                }
            });
        }

        // Listen for property address changes
        const addressField = document.getElementById('propertyAddress');
        if (addressField) {
            addressField.addEventListener('blur', (event) => {
                const address = event.target.value.trim();
                if (address && address.length > 10) {
                    this.updateData(address);
                }
            });
        }
    }

    async updateData(address) {
        if (!address || address.length < 5) {
            this.hideWidget();
            return;
        }

        console.log('📊 Updating market insights for:', address);
        this.showWidget();
        this.showLoading();

        try {
            let marketData;

            // Use Market Data Service if available
            if (window.marketDataService && window.marketDataService.isInitialized) {
                marketData = await window.marketDataService.getPropertyData(address);
            } else {
                // Fallback to mock data
                marketData = this.getMockMarketData(address);
            }

            this.currentData = { address, ...marketData };
            this.displayData(marketData);
            
        } catch (error) {
            console.error('📊 Failed to update market insights:', error);
            this.showError();
        }
    }

    showWidget() {
        const widget = document.getElementById('marketInsightsWidget');
        if (widget) {
            widget.style.display = 'block';
        }
    }

    hideWidget() {
        const widget = document.getElementById('marketInsightsWidget');
        if (widget) {
            widget.style.display = 'none';
        }
    }

    showLoading() {
        this.hideAllStates();
        const loading = document.getElementById('insightLoading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    showError() {
        this.hideAllStates();
        const error = document.getElementById('insightError');
        if (error) {
            error.style.display = 'block';
        }
    }

    hideAllStates() {
        const states = ['insightLoading', 'insightData', 'insightError'];
        states.forEach(stateId => {
            const element = document.getElementById(stateId);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    displayData(data) {
        this.hideAllStates();
        
        const dataContainer = document.getElementById('insightData');
        if (dataContainer) {
            dataContainer.style.display = 'block';
        }

        // Update basic market metrics
        this.updateElement('suburbMedian', `$${data.medianPrice?.toLocaleString() || 'N/A'}`);
        
        const growthValue = data.priceGrowth?.yearly;
        if (growthValue !== undefined) {
            const growthElement = document.getElementById('priceGrowth');
            if (growthElement) {
                growthElement.textContent = `${growthValue.toFixed(1)}%`;
                growthElement.className = `value growth ${growthValue >= 0 ? 'positive' : 'negative'}`;
            }
        } else {
            this.updateElement('priceGrowth', 'N/A');
        }
        
        this.updateElement('rentalYield', data.rentalYield ? `${data.rentalYield.toFixed(1)}%` : 'N/A');
        this.updateElement('daysOnMarket', data.daysOnMarket ? `${data.daysOnMarket} days` : 'N/A');
        this.updateElement('vacancyRate', data.vacancyRate ? `${data.vacancyRate.toFixed(1)}%` : 'N/A');
        this.updateElement('stockLevels', this.capitalizeFirst(data.stockLevels || 'N/A'));

        // Update recent sales if available
        if (data.recentSales && data.recentSales.length > 0) {
            this.displayRecentSales(data.recentSales);
        } else {
            const recentSales = document.getElementById('recentSales');
            if (recentSales) {
                recentSales.style.display = 'none';
            }
        }

        // Update data source and timestamp
        const source = data.dataSource || 'Unknown';
        const timestamp = data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : 'Unknown';
        this.updateElement('lastUpdated', `${timestamp} (${source})`);
    }

    displayRecentSales(sales) {
        const recentSalesContainer = document.getElementById('recentSales');
        const salesList = document.getElementById('salesList');
        
        if (!recentSalesContainer || !salesList) return;

        const salesHTML = sales.slice(0, 5).map(sale => `
            <div class="sale-item">
                <div class="sale-address">${sale.address}</div>
                <div class="sale-details">
                    <span class="sale-price">$${sale.price?.toLocaleString() || 'N/A'}</span>
                    <span class="sale-date">${sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
        `).join('');

        salesList.innerHTML = salesHTML;
        recentSalesContainer.style.display = 'block';
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getMockMarketData(address) {
        // Generate realistic mock data based on address
        const random = this.getSeededRandom(address);
        
        return {
            address,
            suburb: this.extractSuburb(address),
            medianPrice: 700000 + Math.floor(random() * 400000),
            priceGrowth: {
                quarterly: -1 + random() * 6,
                yearly: -2 + random() * 12,
                fiveYear: 20 + random() * 40
            },
            rentalYield: 3 + random() * 3,
            rentalGrowth: random() * 6,
            vacancyRate: 1 + random() * 4,
            daysOnMarket: 20 + Math.floor(random() * 40),
            stockLevels: ['low', 'medium', 'high'][Math.floor(random() * 3)],
            recentSales: this.generateMockSales(address, random),
            dataSource: 'Mock Data',
            lastUpdated: new Date()
        };
    }

    generateMockSales(address, random) {
        const basePrice = 700000 + Math.floor(random() * 400000);
        const sales = [];
        
        for (let i = 0; i < 3; i++) {
            sales.push({
                address: `${120 + i * 2} Mock Street`,
                price: basePrice + Math.floor(random() * 100000) - 50000,
                date: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000),
                propertyType: 'House',
                bedrooms: 2 + Math.floor(random() * 3)
            });
        }
        
        return sales;
    }

    extractSuburb(address) {
        const parts = address.split(',');
        return parts.length > 1 ? parts[1].trim() : 'Melbourne';
    }

    getSeededRandom(seed) {
        // Simple seeded random number generator for consistent mock data
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return function() {
            hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
            hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
            hash = hash ^ (hash >>> 16);
            return (hash >>> 0) / 4294967296;
        };
    }

    // Public method to trigger updates from external scripts
    refreshData() {
        if (this.currentData && this.currentData.address) {
            this.updateData(this.currentData.address);
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Look for a market insights container
    const container = document.querySelector('.market-insights-container') || 
                     document.querySelector('#marketInsights') ||
                     document.querySelector('.calculator-container');
    
    if (container) {
        window.marketInsightsWidget = new MarketInsightsWidget(container);
        window.marketInsightsWidget.init();
    }
});

// Also initialize when property search is used
document.addEventListener('propertySelected', (event) => {
    if (window.marketInsightsWidget && event.detail.address) {
        window.marketInsightsWidget.updateData(event.detail.address);
    }
});