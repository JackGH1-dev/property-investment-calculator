// API Proxy Service for Secure External API Calls
// Handles Google Places API and other external services securely

console.log('🌐 Loading API Proxy Service');

class APIProxyService {
    constructor() {
        this.proxyEndpoints = new Map();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.requestQueue = new Map();
        this.rateLimiter = new Map();
        
        this.initializeProxyEndpoints();
        console.log('🌐 APIProxyService initialized');
    }

    // Initialize proxy endpoints
    initializeProxyEndpoints() {
        // These endpoints would be handled by your server/serverless functions
        this.proxyEndpoints.set('places_autocomplete', '/api/places/autocomplete');
        this.proxyEndpoints.set('places_details', '/api/places/details');
        this.proxyEndpoints.set('geocoding', '/api/geocoding');
        this.proxyEndpoints.set('reverse_geocoding', '/api/reverse-geocoding');
    }

    // Get proxy endpoint
    getProxyEndpoint(service) {
        return this.proxyEndpoints.get(service);
    }

    // Rate limiting for API calls
    async checkRateLimit(service, userId = 'anonymous') {
        const key = `${service}_${userId}`;
        const now = Date.now();
        const windowSize = 60 * 1000; // 1 minute
        const maxRequests = 10; // 10 requests per minute
        
        if (!this.rateLimiter.has(key)) {
            this.rateLimiter.set(key, []);
        }
        
        const requests = this.rateLimiter.get(key);
        
        // Clean old requests
        const validRequests = requests.filter(timestamp => now - timestamp < windowSize);
        
        if (validRequests.length >= maxRequests) {
            console.warn(`🌐 Rate limit exceeded for ${service}`);
            return false;
        }
        
        validRequests.push(now);
        this.rateLimiter.set(key, validRequests);
        
        return true;
    }

    // Generic proxy call method
    async makeProxyCall(service, params = {}, options = {}) {
        const endpoint = this.getProxyEndpoint(service);
        if (!endpoint) {
            throw new Error(`Unknown service: ${service}`);
        }

        // Check rate limit
        const userId = window.authManager?.getCurrentUser()?.uid || 'anonymous';
        if (!(await this.checkRateLimit(service, userId))) {
            throw new Error('Rate limit exceeded. Please wait before making more requests.');
        }

        // Generate cache key
        const cacheKey = `${service}_${JSON.stringify(params)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log(`🌐 Returning cached result for ${service}`);
                return cached.data;
            } else {
                this.cache.delete(cacheKey);
            }
        }

        // Check if request is already in progress
        if (this.requestQueue.has(cacheKey)) {
            console.log(`🌐 Request already in progress for ${service}, waiting...`);
            return await this.requestQueue.get(cacheKey);
        }

        // Create request promise
        const requestPromise = this.executeProxyCall(endpoint, params, options);
        this.requestQueue.set(cacheKey, requestPromise);

        try {
            const result = await requestPromise;
            
            // Cache successful results
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
            
            return result;
        } finally {
            // Clean up request queue
            this.requestQueue.delete(cacheKey);
        }
    }

    // Execute the actual proxy call
    async executeProxyCall(endpoint, params, options) {
        const url = new URL(endpoint, window.location.origin);
        
        // Add parameters to URL
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        }

        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...window.secureConfig?.getSecurityHeaders(),
                ...options.headers
            },
            credentials: 'same-origin'
        };

        if (options.body) {
            requestOptions.body = JSON.stringify(options.body);
        }

        console.log(`🌐 Making proxy call to: ${endpoint}`);
        
        const response = await fetch(url.toString(), requestOptions);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Proxy call failed: ${response.status} ${errorText}`);
        }
        
        return await response.json();
    }

    // Places Autocomplete
    async getPlacesAutocomplete(input, options = {}) {
        if (!input || input.length < 2) {
            return { predictions: [] };
        }

        const params = {
            input: window.secureConfig?.sanitizeInput(input, 'address') || input,
            types: options.types || 'address',
            components: options.components || 'country:au',
            sessiontoken: options.sessionToken || this.generateSessionToken()
        };

        try {
            return await this.makeProxyCall('places_autocomplete', params);
        } catch (error) {
            console.error('🌐 Places autocomplete failed:', error);
            
            // Log security event
            window.secureConfig?.logSecurityEvent('places_autocomplete_failed', {
                error: error.message,
                input: input.substring(0, 50) // Log first 50 chars only
            });
            
            // Return empty results on error
            return { predictions: [] };
        }
    }

    // Places Details
    async getPlaceDetails(placeId, options = {}) {
        if (!placeId) {
            throw new Error('Place ID is required');
        }

        const params = {
            place_id: placeId,
            fields: options.fields || 'formatted_address,address_components,geometry',
            sessiontoken: options.sessionToken || this.generateSessionToken()
        };

        try {
            return await this.makeProxyCall('places_details', params);
        } catch (error) {
            console.error('🌐 Place details failed:', error);
            
            // Log security event
            window.secureConfig?.logSecurityEvent('place_details_failed', {
                error: error.message,
                placeId: placeId
            });
            
            throw error;
        }
    }

    // Geocoding
    async geocodeAddress(address) {
        if (!address) {
            throw new Error('Address is required');
        }

        const params = {
            address: window.secureConfig?.sanitizeInput(address, 'address') || address,
            components: 'country:AU'
        };

        try {
            return await this.makeProxyCall('geocoding', params);
        } catch (error) {
            console.error('🌐 Geocoding failed:', error);
            
            // Log security event
            window.secureConfig?.logSecurityEvent('geocoding_failed', {
                error: error.message,
                address: address.substring(0, 50)
            });
            
            throw error;
        }
    }

    // Reverse Geocoding
    async reverseGeocode(lat, lng) {
        if (!lat || !lng) {
            throw new Error('Latitude and longitude are required');
        }

        const params = {
            latlng: `${lat},${lng}`,
            result_type: 'street_address|political'
        };

        try {
            return await this.makeProxyCall('reverse_geocoding', params);
        } catch (error) {
            console.error('🌐 Reverse geocoding failed:', error);
            
            // Log security event
            window.secureConfig?.logSecurityEvent('reverse_geocoding_failed', {
                error: error.message,
                coordinates: `${lat},${lng}`
            });
            
            throw error;
        }
    }

    // Generate session token for Places API
    generateSessionToken() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🌐 API cache cleared');
    }

    // Get cache stats
    getCacheStats() {
        const now = Date.now();
        let validEntries = 0;
        let expiredEntries = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp < this.cacheTimeout) {
                validEntries++;
            } else {
                expiredEntries++;
            }
        }

        return {
            total: this.cache.size,
            valid: validEntries,
            expired: expiredEntries
        };
    }

    // Clean expired cache entries
    cleanExpiredCache() {
        const now = Date.now();
        const keysToDelete = [];

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp >= this.cacheTimeout) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => this.cache.delete(key));
        
        if (keysToDelete.length > 0) {
            console.log(`🌐 Cleaned ${keysToDelete.length} expired cache entries`);
        }
    }
}

// Create global instance
const apiProxy = new APIProxyService();

// Clean expired cache periodically
setInterval(() => {
    apiProxy.cleanExpiredCache();
}, 5 * 60 * 1000); // Every 5 minutes

// Export for global use
window.apiProxy = apiProxy;

console.log('🌐 API Proxy Service loaded successfully');