/**
 * Market Data Service
 * Unified interface for Australian property market data APIs
 */

class MarketDataService {
    constructor() {
        this.providers = {
            domain: new DomainAPI(),
            fallback: new MockDataService()
        };
        this.cache = new MarketDataCache();
        this.rateLimiter = new RateLimiter();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📊 Initializing Market Data Service...');
        
        try {
            // Initialize API providers
            await this.providers.domain.init();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Initialize caching
            await this.cache.init();
            
            this.isInitialized = true;
            console.log('✅ Market Data Service initialized');
        } catch (error) {
            console.error('❌ Market Data Service initialization failed:', error);
            // Fallback to mock service
            this.providers.primary = this.providers.fallback;
        }
    }

    async getPropertyData(address) {
        const cacheKey = `property_${this.sanitizeAddress(address)}`;
        
        try {
            // Check cache first
            const cached = await this.cache.get(cacheKey, 'property_data');
            if (cached) {
                console.log('📊 Using cached property data for:', address);
                return cached;
            }

            // Rate limiting check
            await this.rateLimiter.waitForToken();

            // Fetch from primary provider (Domain API)
            let marketData;
            try {
                marketData = await this.providers.domain.getPropertyData(address);
            } catch (error) {
                console.warn('⚠️ Primary provider failed, using fallback:', error.message);
                marketData = await this.providers.fallback.getPropertyData(address);
            }

            // Cache the result
            await this.cache.set(cacheKey, marketData, 'property_data');

            return marketData;
        } catch (error) {
            console.error('❌ Failed to fetch property data:', error);
            return this.providers.fallback.getPropertyData(address);
        }
    }

    async searchProperties(query) {
        try {
            // Rate limiting check
            await this.rateLimiter.waitForToken();

            // Enhanced search with market data
            const searchResults = await this.providers.domain.searchProperties(query);
            
            // Enhance results with market data (limit to 5 for performance)
            const enhancedResults = await Promise.all(
                searchResults.slice(0, 5).map(async (property) => {
                    try {
                        const marketData = await this.getPropertyData(property.address);
                        return {
                            ...property,
                            marketData: {
                                estimatedValue: marketData.estimatedValue,
                                priceGrowth: marketData.priceGrowth,
                                rentalYield: marketData.rentalYield,
                                recentSales: marketData.recentSales?.slice(0, 3) || []
                            }
                        };
                    } catch (error) {
                        console.warn('⚠️ Failed to enhance property with market data:', error);
                        return property;
                    }
                })
            );

            return enhancedResults;
        } catch (error) {
            console.error('❌ Property search failed:', error);
            return this.providers.fallback.searchProperties(query);
        }
    }

    sanitizeAddress(address) {
        return address.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_');
    }

    setupErrorHandling() {
        // Global error handler for market data operations
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && event.reason.message.includes('Market Data')) {
                console.warn('🚨 Market Data Service Error:', event.reason);
                event.preventDefault();
            }
        });
    }

    // Health check for API availability
    async healthCheck() {
        const results = {
            domain: false,
            fallback: true,
            cache: false
        };

        try {
            results.domain = await this.providers.domain.healthCheck();
        } catch (error) {
            console.warn('Domain API health check failed:', error);
        }

        try {
            results.cache = await this.cache.healthCheck();
        } catch (error) {
            console.warn('Cache health check failed:', error);
        }

        return results;
    }
}

/**
 * Domain API Integration
 * Connects to Domain.com.au APIs for Australian property data
 */
class DomainAPI {
    constructor() {
        this.baseURL = 'https://api.domain.com.au';
        this.apiKey = null;
        this.rateLimiter = new RateLimiter(500, 60000); // 500 requests per minute
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('🏢 Initializing Domain API...');
        
        // Load API configuration
        await this.loadConfiguration();
        
        this.isInitialized = true;
        console.log('✅ Domain API initialized');
    }

    async loadConfiguration() {
        // For development, using mock data
        this.apiKey = 'DOMAIN_API_KEY_PLACEHOLDER';
        console.log('🔑 Domain API configuration loaded (placeholder)');
    }

    async getPropertyData(address) {
        // For MVP, return enhanced mock data
        return this.getEnhancedMockData(address);
    }

    async searchProperties(query) {
        // Enhanced mock property search
        return this.getEnhancedMockSearchResults(query);
    }

    getEnhancedMockData(address) {
        const mockData = {
            address: address,
            suburb: this.extractSuburb(address),
            postcode: '3000',
            state: 'VIC',
            
            estimatedValue: 750000 + Math.floor(Math.random() * 300000),
            valueConfidence: 'medium',
            lastSalePrice: 720000,
            lastSaleDate: new Date('2024-12-01'),
            
            medianPrice: 780000,
            priceGrowth: {
                quarterly: 2.1 + Math.random() * 2,
                yearly: 7.8 + Math.random() * 4,
                fiveYear: 42.5 + Math.random() * 15
            },
            
            medianRent: 620 + Math.floor(Math.random() * 200),
            rentalYield: 4.1 + Math.random() * 2,
            rentalGrowth: 3.2,
            vacancyRate: 1.8,
            
            recentSales: [
                {
                    address: '121 Sample Street',
                    price: 740000 + Math.floor(Math.random() * 100000),
                    date: new Date('2025-01-15'),
                    propertyType: 'House',
                    bedrooms: 3
                },
                {
                    address: '119 Sample Street',
                    price: 695000 + Math.floor(Math.random() * 80000),
                    date: new Date('2025-01-08'),
                    propertyType: 'House',
                    bedrooms: 3
                }
            ],
            
            daysOnMarket: 25 + Math.floor(Math.random() * 20),
            auctionClearanceRate: 70 + Math.floor(Math.random() * 15),
            stockLevels: 'medium',
            
            dataSource: 'Mock Data (Enhanced)',
            lastUpdated: new Date(),
            confidence: 0.7
        };

        console.log('🧪 Enhanced mock property data generated for:', address);
        return mockData;
    }

    getEnhancedMockSearchResults(query) {
        const mockResults = [
            {
                id: 'mock-property-1',
                address: '123 Collins Street, Melbourne VIC 3000',
                suburb: 'Melbourne',
                state: 'VIC',
                postcode: '3000',
                propertyType: 'Apartment',
                bedrooms: 2,
                bathrooms: 1,
                carspaces: 1,
                price: '$650,000 - $700,000'
            },
            {
                id: 'mock-property-2',
                address: '456 Flinders Lane, Melbourne VIC 3000',
                suburb: 'Melbourne',
                state: 'VIC',
                postcode: '3000',
                propertyType: 'House',
                bedrooms: 3,
                bathrooms: 2,
                carspaces: 2,
                price: '$850,000 - $920,000'
            },
            {
                id: 'mock-property-3',
                address: '789 Queen Street, Melbourne VIC 3000',
                suburb: 'Melbourne',
                state: 'VIC',
                postcode: '3000',
                propertyType: 'Townhouse',
                bedrooms: 3,
                bathrooms: 2,
                carspaces: 2,
                price: '$780,000 - $830,000'
            }
        ];

        console.log('🧪 Enhanced mock search results generated');
        return mockResults;
    }

    extractSuburb(address) {
        const parts = address.split(',');
        return parts.length > 1 ? parts[1].trim() : 'Melbourne';
    }

    async healthCheck() {
        return true;
    }
}

/**
 * Market Data Cache
 * Caches market data with TTL for performance optimization
 */
class MarketDataCache {
    constructor() {
        this.cache = new Map();
        this.ttl = {
            property_data: 24 * 60 * 60 * 1000, // 24 hours
            suburb_data: 12 * 60 * 60 * 1000,   // 12 hours
            sales_data: 6 * 60 * 60 * 1000      // 6 hours
        };
    }

    async init() {
        console.log('💾 Market Data Cache initialized');
    }

    async get(key, type = 'property_data') {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.ttl[type]) {
            return cached.data;
        }
        return null;
    }

    async set(key, data, type = 'property_data') {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            type
        });
        
        // Simple cleanup if cache gets too large
        if (this.cache.size > 100) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }

    async healthCheck() {
        return true;
    }
}

/**
 * Rate Limiter
 * Prevents API rate limiting by controlling request frequency
 */
class RateLimiter {
    constructor(maxRequests = 100, timeWindow = 60000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }

    async waitForToken() {
        const now = Date.now();
        
        // Remove old requests outside the time window
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        // If we're at the limit, wait a bit
        if (this.requests.length >= this.maxRequests) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Add current request
        this.requests.push(now);
    }
}

/**
 * Mock Data Service
 * Provides fallback data when APIs are unavailable
 */
class MockDataService {
    constructor() {
        this.isInitialized = true;
    }

    async getPropertyData(address) {
        console.log('🧪 Using mock property data for:', address);
        
        return {
            address: address,
            suburb: 'Sample Suburb',
            postcode: '3000',
            state: 'VIC',
            
            estimatedValue: 750000,
            valueConfidence: 'medium',
            lastSalePrice: 720000,
            lastSaleDate: new Date('2024-12-01'),
            
            medianPrice: 780000,
            priceGrowth: {
                quarterly: 2.1,
                yearly: 7.8,
                fiveYear: 42.5
            },
            
            medianRent: 620,
            rentalYield: 4.1,
            rentalGrowth: 3.2,
            vacancyRate: 1.8,
            
            recentSales: [],
            
            daysOnMarket: 32,
            auctionClearanceRate: 75,
            stockLevels: 'medium',
            
            dataSource: 'Mock Data',
            lastUpdated: new Date(),
            confidence: 0.5
        };
    }

    async searchProperties(query) {
        return [{
            id: 'mock-property-1',
            address: '123 Mock Street, Melbourne VIC 3000',
            suburb: 'Melbourne',
            state: 'VIC',
            postcode: '3000',
            propertyType: 'House',
            bedrooms: 3,
            bathrooms: 2,
            carspaces: 2,
            price: 'Contact Agent'
        }];
    }
}

// Initialize global market data service
window.marketDataService = new MarketDataService();