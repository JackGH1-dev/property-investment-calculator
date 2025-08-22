// Secure Configuration Manager for InvestQuest
// Handles all sensitive configuration securely without exposing keys client-side

console.log('🔐 Loading Secure Configuration Manager');

class SecureConfigManager {
    constructor() {
        this.config = new Map();
        this.isInitialized = false;
        this.apiProxyBase = '/api'; // Will be handled by server
        this.securityHeaders = new Map();
        
        this.initializeSecurityHeaders();
        console.log('🔐 SecureConfigManager initialized');
    }

    // Initialize security headers
    initializeSecurityHeaders() {
        this.securityHeaders.set('Content-Security-Policy', 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://maps.googleapis.com https://cdn.jsdelivr.net; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "img-src 'self' data: https: blob:; " +
            "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.cloudfunctions.net; " +
            "font-src 'self' data: https://fonts.gstatic.com; " +
            "frame-src 'none'; " +
            "object-src 'none'; " +
            "base-uri 'self';"
        );
        
        this.securityHeaders.set('X-Content-Type-Options', 'nosniff');
        this.securityHeaders.set('X-Frame-Options', 'DENY');
        this.securityHeaders.set('X-XSS-Protection', '1; mode=block');
        this.securityHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        this.securityHeaders.set('Permissions-Policy', 
            'geolocation=(), microphone=(), camera=(), fullscreen=(self)'
        );
    }

    // Initialize configuration (client-safe only)
    async init() {
        if (this.isInitialized) {
            console.log('🔐 Config already initialized');
            return;
        }

        console.log('🔐 Initializing secure configuration...');

        // Only store non-sensitive configuration client-side
        this.config.set('ENVIRONMENT', this.detectEnvironment());
        this.config.set('API_ENDPOINTS', {
            places: `${this.apiProxyBase}/places`,
            geocoding: `${this.apiProxyBase}/geocoding`,
            validate: `${this.apiProxyBase}/validate`
        });
        
        // Firebase configuration (public keys are safe to expose)
        this.config.set('FIREBASE_PUBLIC', {
            authDomain: "investquest-67898.firebaseapp.com",
            projectId: "investquest-67898",
            storageBucket: "investquest-67898.firebasestorage.app",
            messagingSenderId: "495317898531",
            appId: "1:495317898531:web:2a4e29abc200374c6f2896"
        });

        // Application settings
        this.config.set('APP_SETTINGS', {
            name: 'InvestQuest',
            version: '1.2.0',
            maxCalculationsPerUser: 50,
            rateLimits: {
                placesSearch: 10, // per minute
                calculations: 100, // per hour
                dataSave: 20 // per hour
            }
        });

        this.isInitialized = true;
        console.log('🔐 Secure configuration initialized');
    }

    // Detect current environment
    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
            return 'staging';
        } else if (hostname === 'investquest.com.au' || hostname === 'www.investquest.com.au') {
            return 'production';
        }
        
        return 'development';
    }

    // Get configuration value safely
    get(key) {
        if (!this.isInitialized) {
            console.warn('🔐 Configuration not initialized, call init() first');
            return null;
        }
        
        return this.config.get(key);
    }

    // Get API endpoint for secure calls
    getApiEndpoint(service) {
        const endpoints = this.get('API_ENDPOINTS');
        return endpoints ? endpoints[service] : null;
    }

    // Check if environment is production
    isProduction() {
        return this.get('ENVIRONMENT') === 'production';
    }

    // Get security headers for fetch requests
    getSecurityHeaders() {
        const headers = new Headers();
        
        // Add CSRF token if available
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
            headers.set('X-CSRF-Token', csrfToken);
        }
        
        // Add client info
        headers.set('X-Client-Version', this.get('APP_SETTINGS')?.version || '1.0.0');
        headers.set('X-Client-Environment', this.get('ENVIRONMENT') || 'development');
        
        return headers;
    }

    // Get CSRF token from meta tag or cookie
    getCSRFToken() {
        // Try meta tag first
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            return metaToken.getAttribute('content');
        }
        
        // Try cookie
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrf_token') {
                return decodeURIComponent(value);
            }
        }
        
        return null;
    }

    // Apply security headers to page
    applySecurityHeaders() {
        // These would typically be set by the server, but we can add some client-side
        console.log('🔐 Security headers should be configured on server');
        
        // Add CSP meta tag if not present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const cspMeta = document.createElement('meta');
            cspMeta.httpEquiv = 'Content-Security-Policy';
            cspMeta.content = this.securityHeaders.get('Content-Security-Policy');
            document.head.appendChild(cspMeta);
            console.log('🔐 CSP meta tag added');
        }
    }

    // Rate limiting check (client-side validation, server should enforce)
    async checkRateLimit(action) {
        const rateLimits = this.get('APP_SETTINGS')?.rateLimits || {};
        const limit = rateLimits[action];
        
        if (!limit) return true;
        
        const key = `rateLimit_${action}`;
        const now = Date.now();
        const windowSize = action === 'placesSearch' ? 60000 : 3600000; // 1 min or 1 hour
        
        let attempts = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Clean old attempts
        attempts = attempts.filter(timestamp => now - timestamp < windowSize);
        
        if (attempts.length >= limit) {
            console.warn(`🔐 Rate limit exceeded for ${action}`);
            return false;
        }
        
        // Record this attempt
        attempts.push(now);
        localStorage.setItem(key, JSON.stringify(attempts));
        
        return true;
    }

    // Secure API call wrapper
    async secureApiCall(endpoint, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Configuration not initialized');
        }

        const url = endpoint.startsWith('http') ? endpoint : `${window.location.origin}${endpoint}`;
        const secureHeaders = this.getSecurityHeaders();
        
        // Merge with provided headers
        const headers = new Headers(options.headers || {});
        for (const [key, value] of secureHeaders.entries()) {
            headers.set(key, value);
        }
        
        const secureOptions = {
            ...options,
            headers,
            mode: 'cors',
            credentials: 'same-origin',
            cache: 'no-store' // Prevent caching sensitive data
        };
        
        try {
            console.log(`🔐 Making secure API call to: ${endpoint}`);
            const response = await fetch(url, secureOptions);
            
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            console.error('🔐 Secure API call failed:', error);
            throw error;
        }
    }

    // Validate and sanitize user input
    sanitizeInput(input, type = 'text') {
        if (typeof input !== 'string') {
            input = String(input);
        }
        
        switch (type) {
            case 'text':
                // Remove potential XSS vectors
                return input
                    .replace(/[<>]/g, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+=/gi, '')
                    .trim();
                    
            case 'number':
                // Ensure it's a valid number
                const num = parseFloat(input.replace(/[^\d.-]/g, ''));
                return isNaN(num) ? 0 : num;
                
            case 'email':
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(input) ? input.toLowerCase().trim() : '';
                
            case 'address':
                // Allow common address characters
                return input
                    .replace(/[<>]/g, '')
                    .replace(/[^\w\s\-.,#/]/g, '')
                    .trim();
                    
            default:
                return input.trim();
        }
    }

    // Log security events
    logSecurityEvent(event, details = {}) {
        const securityEvent = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            environment: this.get('ENVIRONMENT')
        };
        
        console.log('🔐 Security Event:', securityEvent);
        
        // In production, send to security monitoring service
        if (this.isProduction()) {
            this.sendSecurityEvent(securityEvent);
        }
    }

    // Send security event to monitoring service
    async sendSecurityEvent(event) {
        try {
            await this.secureApiCall('/api/security/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.warn('🔐 Failed to send security event:', error);
        }
    }
}

// Create global instance
const secureConfig = new SecureConfigManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await secureConfig.init();
        secureConfig.applySecurityHeaders();
        
        // Log initialization
        secureConfig.logSecurityEvent('config_initialized', {
            environment: secureConfig.get('ENVIRONMENT')
        });
        
        console.log('🔐 Secure configuration system ready');
    } catch (error) {
        console.error('🔐 Failed to initialize secure configuration:', error);
    }
});

// Export for global use
window.secureConfig = secureConfig;