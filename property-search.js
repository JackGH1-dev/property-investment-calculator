/**
 * Property Search System
 * Enhanced property search with Australian property database integration
 */

class PropertySearchManager {
    constructor() {
        this.searchCache = new Map();
        this.searchHistory = JSON.parse(localStorage.getItem('property-search-history') || '[]');
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('🏠 Initializing Property Search System...');
        
        // Initialize search components
        this.setupSearchInterface();
        this.setupAutocomplete();
        this.setupSearchHistory();
        
        this.isInitialized = true;
        console.log('✅ Property Search System initialized');
    }

    setupSearchInterface() {
        const addressField = document.getElementById('propertyAddress');
        if (!addressField) return;

        // Create enhanced search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'property-search-container';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" 
                       id="propertySearchInput" 
                       class="property-search-input"
                       placeholder="Search by address, suburb, or postcode..."
                       autocomplete="off">
                <div class="search-loading" id="searchLoading" style="display: none;">
                    <div class="loading-spinner"></div>
                </div>
            </div>
            <div class="search-results" id="searchResults" style="display: none;"></div>
            <div class="search-filters" id="searchFilters" style="display: none;">
                <div class="filter-group">
                    <label>Property Type:</label>
                    <select id="propertyType">
                        <option value="">All Types</option>
                        <option value="house">House</option>
                        <option value="unit">Unit/Apartment</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Bedrooms:</label>
                    <select id="bedrooms">
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                    </select>
                </div>
            </div>
        `;

        // Replace the original address field
        addressField.parentNode.replaceChild(searchContainer, addressField);
        
        // Add CSS styles
        this.addSearchStyles();
    }

    setupAutocomplete() {
        const searchInput = document.getElementById('propertySearchInput');
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                this.hideSearchResults();
                return;
            }

            // Debounce search
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Handle selection
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.selectFirstResult();
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.property-search-container')) {
                this.hideSearchResults();
            }
        });
    }

    async performSearch(query) {
        console.log('🔍 Searching for property:', query);
        
        // Check cache first
        const cacheKey = query.toLowerCase();
        if (this.searchCache.has(cacheKey)) {
            this.displaySearchResults(this.searchCache.get(cacheKey));
            return;
        }

        this.showLoading(true);

        try {
            // Australian property search implementation
            const results = await this.searchAustralianProperties(query);
            
            // Cache results
            this.searchCache.set(cacheKey, results);
            
            this.displaySearchResults(results);
        } catch (error) {
            console.error('🏠 Property search error:', error);
            this.displaySearchError('Unable to search properties. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async searchAustralianProperties(query) {
        // Use Market Data Service if available
        if (window.marketDataService && window.marketDataService.isInitialized) {
            console.log('🏠 Using Market Data Service for Australian property search');
            
            try {
                const searchQuery = this.parseSearchQuery(query);
                const results = await window.marketDataService.searchProperties(searchQuery);
                
                // Convert to expected format if needed
                return results.map(property => ({
                    ...property,
                    estimatedValue: property.marketData?.estimatedValue || property.estimatedValue || 0,
                    recentSales: property.marketData?.recentSales || []
                }));
            } catch (error) {
                console.warn('🏠 Market Data Service failed, using fallback:', error);
            }
        }
        
        // Fallback to enhanced mock implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResults = [
                    {
                        id: '1',
                        address: '123 Collins Street, Melbourne VIC 3000',
                        suburb: 'Melbourne',
                        state: 'VIC',
                        postcode: '3000',
                        propertyType: 'unit',
                        bedrooms: 2,
                        bathrooms: 2,
                        estimatedValue: 850000,
                        recentSales: [
                            { address: '121 Collins Street', price: 820000, date: '2024-10-15' },
                            { address: '125 Collins Street', price: 880000, date: '2024-11-02' }
                        ]
                    },
                    {
                        id: '2', 
                        address: '456 Brunswick Street, Fitzroy VIC 3065',
                        suburb: 'Fitzroy',
                        state: 'VIC',
                        postcode: '3065',
                        propertyType: 'house',
                        bedrooms: 3,
                        bathrooms: 2,
                        estimatedValue: 1250000,
                        recentSales: [
                            { address: '454 Brunswick Street', price: 1180000, date: '2024-09-20' },
                            { address: '458 Brunswick Street', price: 1320000, date: '2024-11-10' }
                        ]
                    },
                    {
                        id: '3',
                        address: '789 Chapel Street, South Yarra VIC 3141',
                        suburb: 'South Yarra',
                        state: 'VIC',
                        postcode: '3141',
                        propertyType: 'apartment',
                        bedrooms: 1,
                        bathrooms: 1,
                        estimatedValue: 650000,
                        recentSales: [
                            { address: '785 Chapel Street', price: 620000, date: '2024-12-01' },
                            { address: '791 Chapel Street', price: 680000, date: '2024-12-15' }
                        ]
                    }
                ].filter(property => 
                    property.address.toLowerCase().includes(query.toLowerCase()) ||
                    property.suburb.toLowerCase().includes(query.toLowerCase()) ||
                    property.postcode.includes(query)
                );
                
                resolve(mockResults);
            }, 500);
        });
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No properties found. Try a different search term.</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        const resultsHTML = results.map(property => {
            // Enhanced display with market data if available
            const marketData = property.marketData;
            const marketDataHTML = marketData ? `
                <div class="market-data-preview">
                    <span class="estimated-value">Est: $${(marketData.estimatedValue || property.estimatedValue || 0).toLocaleString()}</span>
                    <span class="rental-yield">Yield: ${marketData.rentalYield?.toFixed(1) || 'N/A'}%</span>
                    <span class="price-growth">Growth: ${marketData.priceGrowth?.yearly?.toFixed(1) || 'N/A'}%</span>
                </div>
            ` : property.estimatedValue ? `
                <div class="market-data-preview">
                    <span class="estimated-value">Est: $${property.estimatedValue.toLocaleString()}</span>
                </div>
            ` : '';
            
            return `
                <div class="search-result" data-property-id="${property.id}" onclick="window.propertySearch.selectProperty('${property.id}')">
                    <div class="property-info">
                        <div class="property-address">${property.address}</div>
                        <div class="property-details">
                            ${property.bedrooms} bed, ${property.bathrooms} bath ${property.propertyType}
                        </div>
                        ${marketDataHTML}
                    </div>
                    <div class="property-arrow">→</div>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = resultsHTML;
        resultsContainer.style.display = 'block';
    }

    selectProperty(propertyId) {
        // Find selected property
        const cacheValues = Array.from(this.searchCache.values()).flat();
        const property = cacheValues.find(p => p.id === propertyId);
        
        if (!property) return;

        console.log('🏠 Selected property:', property);

        // Update the calculator with property data
        this.populateCalculatorFields(property);
        
        // Add to search history
        this.addToSearchHistory(property);
        
        // Hide results
        this.hideSearchResults();
        
        // Update search input
        const searchInput = document.getElementById('propertySearchInput');
        if (searchInput) {
            searchInput.value = property.address;
        }
    }

    populateCalculatorFields(property) {
        // Update calculator fields with property data
        const updates = {
            'propertySearchInput': property.address,
            'purchasePrice': property.estimatedValue || '',
            'propertyType': property.propertyType || ''
        };

        Object.entries(updates).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field && value) {
                field.value = value;
                
                // Trigger change event to update calculations
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        // Display recent sales data if available
        if (property.recentSales && property.recentSales.length > 0) {
            this.displayRecentSales(property.recentSales);
        }

        console.log('✅ Calculator populated with property data');
    }

    displayRecentSales(salesData) {
        // Create recent sales display
        let salesContainer = document.getElementById('recentSalesContainer');
        if (!salesContainer) {
            salesContainer = document.createElement('div');
            salesContainer.id = 'recentSalesContainer';
            salesContainer.className = 'recent-sales-container';
            
            // Insert after property search container
            const searchContainer = document.querySelector('.property-search-container');
            if (searchContainer) {
                searchContainer.parentNode.insertBefore(salesContainer, searchContainer.nextSibling);
            }
        }

        const salesHTML = `
            <div class="recent-sales">
                <h4>📊 Recent Sales in Area</h4>
                <div class="sales-list">
                    ${salesData.map(sale => `
                        <div class="sale-item">
                            <div class="sale-address">${sale.address}</div>
                            <div class="sale-details">
                                <span class="sale-price">$${sale.price.toLocaleString()}</span>
                                <span class="sale-date">${new Date(sale.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        salesContainer.innerHTML = salesHTML;
    }

    addToSearchHistory(property) {
        // Add to beginning of history, remove duplicates, limit to 10
        this.searchHistory = [
            property,
            ...this.searchHistory.filter(p => p.id !== property.id)
        ].slice(0, 10);
        
        localStorage.setItem('property-search-history', JSON.stringify(this.searchHistory));
    }

    setupSearchHistory() {
        if (this.searchHistory.length === 0) return;

        // Add search history dropdown or quick access
        // Implementation for recent searches
    }

    showLoading(show) {
        const loading = document.getElementById('searchLoading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    hideSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    selectFirstResult() {
        const firstResult = document.querySelector('.search-result[data-property-id]');
        if (firstResult) {
            const propertyId = firstResult.getAttribute('data-property-id');
            this.selectProperty(propertyId);
        }
    }

    displaySearchError(message) {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `<div class="search-error">❌ ${message}</div>`;
            resultsContainer.style.display = 'block';
        }
    }

    addSearchStyles() {
        if (document.getElementById('property-search-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'property-search-styles';
        styles.textContent = `
            .property-search-container {
                position: relative;
                margin-bottom: 15px;
            }
            
            .search-input-wrapper {
                position: relative;
            }
            
            .property-search-input {
                width: 100%;
                padding: 12px 40px 12px 16px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            
            .property-search-input:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            
            .search-loading {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #f3f4f6;
                border-top: 2px solid #2563eb;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e1e5e9;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .search-result {
                padding: 16px;
                border-bottom: 1px solid #f3f4f6;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.2s;
            }
            
            .search-result:hover {
                background-color: #f8fafc;
            }
            
            .search-result:last-child {
                border-bottom: none;
            }
            
            .property-address {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 4px;
            }
            
            .property-details {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 4px;
            }
            
            .property-value {
                color: #059669;
                font-weight: 600;
                font-size: 14px;
            }
            
            .property-arrow {
                color: #9ca3af;
                font-size: 18px;
            }
            
            .no-results, .search-error {
                padding: 16px;
                text-align: center;
                color: #6b7280;
            }
            
            .search-error {
                color: #dc2626;
            }
            
            .recent-sales-container {
                margin: 20px 0;
                padding: 16px;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e1e5e9;
            }
            
            .recent-sales h4 {
                margin: 0 0 12px 0;
                color: #1f2937;
            }
            
            .sale-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .sale-item:last-child {
                border-bottom: none;
            }
            
            .sale-address {
                font-weight: 500;
                color: #374151;
            }
            
            .sale-details {
                display: flex;
                gap: 12px;
            }
            
            .sale-price {
                font-weight: 600;
                color: #059669;
            }
            
            .sale-date {
                color: #6b7280;
                font-size: 14px;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize property search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('propertyAddress') || document.querySelector('.property-calculator')) {
        window.propertySearch = new PropertySearchManager();
        window.propertySearch.init();
    }
});