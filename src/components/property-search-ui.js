// Advanced Property Search UI Component
// Provides comprehensive property search interface with autocomplete and filtering

class PropertySearchUI {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.api = new PropertySearchAPI();
        this.options = {
            showFilters: true,
            enableMap: false,
            onPropertySelect: null,
            ...options
        };
        
        this.currentSearch = null;
        this.selectedProperty = null;
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const html = `
            <div class="property-search-container">
                <div class="search-header">
                    <h3>🔍 Find Your Investment Property</h3>
                    <p>Search by address, suburb, or postcode</p>
                </div>
                
                <div class="search-input-wrapper">
                    <input type="text" 
                           id="propertySearchInput" 
                           class="search-input" 
                           placeholder="Start typing an address, suburb or postcode..." 
                           autocomplete="off">
                    <div class="search-suggestions" id="searchSuggestions"></div>
                    <button class="search-clear-btn" id="searchClearBtn" style="display: none;">×</button>
                </div>

                ${this.options.showFilters ? this.renderFilters() : ''}

                <div class="search-results" id="searchResults"></div>
                
                <div class="property-details-modal" id="propertyDetailsModal" style="display: none;">
                    <div class="modal-backdrop"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="modalTitle">Property Details</h3>
                            <button class="modal-close" id="modalClose">×</button>
                        </div>
                        <div class="modal-body" id="modalBody"></div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    renderFilters() {
        return `
            <div class="search-filters">
                <div class="filter-group">
                    <label for="propertyTypeFilter">Property Type</label>
                    <select id="propertyTypeFilter">
                        <option value="all">All Types</option>
                        <option value="house">House</option>
                        <option value="unit">Unit/Apartment</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="villa">Villa</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="bedroomsFilter">Bedrooms</label>
                    <select id="bedroomsFilter">
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="priceMinFilter">Min Price</label>
                    <select id="priceMinFilter">
                        <option value="">Any</option>
                        <option value="300000">$300,000+</option>
                        <option value="500000">$500,000+</option>
                        <option value="750000">$750,000+</option>
                        <option value="1000000">$1,000,000+</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="priceMaxFilter">Max Price</label>
                    <select id="priceMaxFilter">
                        <option value="">Any</option>
                        <option value="500000">$500,000</option>
                        <option value="750000">$750,000</option>
                        <option value="1000000">$1,000,000</option>
                        <option value="1500000">$1,500,000</option>
                        <option value="2000000">$2,000,000+</option>
                    </select>
                </div>
                
                <button class="filter-apply-btn" id="applyFilters">Apply Filters</button>
                <button class="filter-clear-btn" id="clearFilters">Clear</button>
            </div>
        `;
    }

    bindEvents() {
        const searchInput = document.getElementById('propertySearchInput');
        const searchClearBtn = document.getElementById('searchClearBtn');
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        // Search input with debouncing
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                this.clearSuggestions();
                searchClearBtn.style.display = 'none';
                return;
            }
            
            searchClearBtn.style.display = 'block';
            
            // Clear previous timeout
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            // Debounce search
            this.searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Clear search
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchClearBtn.style.display = 'none';
            this.clearSuggestions();
            this.clearResults();
        });

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.clearSuggestions();
            }
        });

        // Filter events
        if (this.options.showFilters) {
            document.getElementById('applyFilters').addEventListener('click', () => {
                this.applyFiltersAndSearch();
            });

            document.getElementById('clearFilters').addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Modal events
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal();
        });
    }

    async performSearch(query) {
        if (!query || query.length < 2) return;
        
        try {
            this.showSearching();
            
            const filters = this.getFilterValues();
            const results = await this.api.searchProperties(query, filters);
            
            this.displaySuggestions(results.suggestions || []);
            this.displayResults(results.properties || []);
            
        } catch (error) {
            console.error('Search failed:', error);
            this.showError('Search failed. Please try again.');
        }
    }

    displaySuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (!suggestions || suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const html = suggestions.map(suggestion => `
            <div class="suggestion-item" data-suggestion="${suggestion}">
                <span class="suggestion-icon">📍</span>
                <span class="suggestion-text">${suggestion}</span>
            </div>
        `).join('');

        suggestionsContainer.innerHTML = html;
        suggestionsContainer.style.display = 'block';

        // Bind click events to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const suggestion = item.dataset.suggestion;
                document.getElementById('propertySearchInput').value = suggestion;
                this.clearSuggestions();
                this.performSearch(suggestion);
            });
        });
    }

    displayResults(properties) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!properties || properties.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>🔍 No properties found matching your search.</p>
                    <p>Try adjusting your search terms or filters.</p>
                </div>
            `;
            return;
        }

        const html = `
            <div class="results-header">
                <h4>Found ${properties.length} Properties</h4>
            </div>
            <div class="results-grid">
                ${properties.map(property => this.renderPropertyCard(property)).join('')}
            </div>
        `;

        resultsContainer.innerHTML = html;
        this.bindPropertyCardEvents();
    }

    renderPropertyCard(property) {
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-image">
                    <img src="${property.images[0]}" alt="${property.address}" loading="lazy">
                    <div class="property-price">$${this.formatPrice(property.price.estimate)}</div>
                </div>
                <div class="property-info">
                    <h5 class="property-address">${property.address}</h5>
                    <div class="property-features">
                        <span class="feature-bed">🛏️ ${property.bedrooms}</span>
                        <span class="feature-bath">🚿 ${property.bathrooms}</span>
                        <span class="feature-car">🚗 ${property.carSpaces}</span>
                        <span class="feature-type">${property.propertyType}</span>
                    </div>
                    <div class="property-rental">
                        <span class="rental-amount">$${property.rental.weekly}/week</span>
                        <span class="rental-yield">${property.rental.yield}% yield</span>
                    </div>
                    <div class="property-market">
                        <span class="market-growth">📈 ${property.marketData.growthRate}% growth</span>
                        <span class="market-days">${property.marketData.daysOnMarket} days</span>
                    </div>
                </div>
                <div class="property-actions">
                    <button class="btn-details" data-property-id="${property.id}">View Details</button>
                    <button class="btn-select" data-property-id="${property.id}">Use This Property</button>
                </div>
            </div>
        `;
    }

    bindPropertyCardEvents() {
        // Details buttons
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const propertyId = e.target.dataset.propertyId;
                await this.showPropertyDetails(propertyId);
            });
        });

        // Select buttons
        document.querySelectorAll('.btn-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const propertyId = e.target.dataset.propertyId;
                this.selectProperty(propertyId);
            });
        });
    }

    async showPropertyDetails(propertyId) {
        try {
            const property = await this.api.getPropertyDetails(propertyId);
            const modal = document.getElementById('propertyDetailsModal');
            const modalBody = document.getElementById('modalBody');
            
            modalBody.innerHTML = this.renderPropertyDetails(property);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('Failed to load property details:', error);
            this.showError('Failed to load property details.');
        }
    }

    renderPropertyDetails(property) {
        return `
            <div class="property-details-content">
                <div class="details-images">
                    <div class="main-image">
                        <img src="${property.images[0]}" alt="Property Image">
                    </div>
                    <div class="thumbnail-images">
                        ${property.images.slice(1).map(img => `
                            <img src="${img}" alt="Property" class="thumbnail">
                        `).join('')}
                    </div>
                </div>
                
                <div class="details-info">
                    <div class="details-description">
                        <h4>Description</h4>
                        <p>${property.description}</p>
                    </div>
                    
                    <div class="details-features">
                        <h4>Features</h4>
                        <div class="features-grid">
                            ${property.features.map(feature => `
                                <span class="feature-tag">${feature}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="details-inspection">
                        <h4>Open Home Inspections</h4>
                        ${property.inspection.openHomes.map(oh => `
                            <div class="inspection-time">
                                <span class="inspection-date">${oh.date}</span>
                                <span class="inspection-time">${oh.time}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="details-agent">
                        <h4>Contact Agent</h4>
                        <div class="agent-info">
                            <p><strong>${property.agent.name}</strong> - ${property.agent.agency}</p>
                            <p>📞 ${property.agent.phone}</p>
                            <p>✉️ ${property.agent.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    selectProperty(propertyId) {
        const propertyCards = document.querySelectorAll('.property-card');
        const selectedCard = document.querySelector(`[data-property-id="${propertyId}"]`);
        
        // Find the property data
        const propertyData = this.currentSearch?.properties?.find(p => p.id === propertyId);
        
        if (!propertyData) return;
        
        // Highlight selected property
        propertyCards.forEach(card => card.classList.remove('selected'));
        selectedCard.classList.add('selected');
        
        this.selectedProperty = propertyData;
        
        // Populate calculator form
        this.populateCalculatorForm(propertyData);
        
        // Trigger callback if provided
        if (this.options.onPropertySelect) {
            this.options.onPropertySelect(propertyData);
        }
        
        // Show success notification
        this.showPropertySelected(propertyData);
    }

    populateCalculatorForm(property) {
        // Populate the main calculator form with property data
        const addressField = document.getElementById('address');
        const stateField = document.getElementById('state');
        const purchasePriceField = document.getElementById('purchasePrice');
        const rentalIncomeField = document.getElementById('rentalIncome');
        
        if (addressField) addressField.value = property.address;
        if (stateField) stateField.value = property.state;
        if (purchasePriceField) purchasePriceField.value = property.price.estimate;
        if (rentalIncomeField) rentalIncomeField.value = property.rental.weekly;
        
        // Trigger form updates
        if (window.propertyCalculator) {
            window.propertyCalculator.calculateStampDuty();
            window.propertyCalculator.updateLoanCalculations();
            window.propertyCalculator.debouncedCalculation();
        }
    }

    getFilterValues() {
        if (!this.options.showFilters) return {};
        
        return {
            propertyType: document.getElementById('propertyTypeFilter')?.value || 'all',
            bedrooms: parseInt(document.getElementById('bedroomsFilter')?.value) || null,
            minPrice: parseInt(document.getElementById('priceMinFilter')?.value) || null,
            maxPrice: parseInt(document.getElementById('priceMaxFilter')?.value) || null
        };
    }

    applyFiltersAndSearch() {
        const searchInput = document.getElementById('propertySearchInput');
        const query = searchInput.value.trim();
        
        if (query) {
            this.performSearch(query);
        }
    }

    clearFilters() {
        document.getElementById('propertyTypeFilter').value = 'all';
        document.getElementById('bedroomsFilter').value = '';
        document.getElementById('priceMinFilter').value = '';
        document.getElementById('priceMaxFilter').value = '';
        
        this.applyFiltersAndSearch();
    }

    clearSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        suggestionsContainer.style.display = 'none';
    }

    clearResults() {
        document.getElementById('searchResults').innerHTML = '';
    }

    closeModal() {
        document.getElementById('propertyDetailsModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    showSearching() {
        document.getElementById('searchResults').innerHTML = `
            <div class="searching-indicator">
                <div class="spinner"></div>
                <p>Searching properties...</p>
            </div>
        `;
    }

    showError(message) {
        document.getElementById('searchResults').innerHTML = `
            <div class="error-message">
                <p>⚠️ ${message}</p>
            </div>
        `;
    }

    showPropertySelected(property) {
        const notification = document.createElement('div');
        notification.className = 'property-selected-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">Property selected: ${property.address}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-AU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    // Public API methods
    getSelectedProperty() {
        return this.selectedProperty;
    }

    clearSelection() {
        this.selectedProperty = null;
        document.querySelectorAll('.property-card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    destroy() {
        this.container.innerHTML = '';
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }
}

// Export for global use
window.PropertySearchUI = PropertySearchUI;