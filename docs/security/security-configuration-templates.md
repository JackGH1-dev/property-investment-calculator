# Security Configuration Templates

## Content Security Policy (CSP) Configuration

### Meta Tag Implementation
Add to all HTML files in the `<head>` section:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                         https://www.gstatic.com 
                         https://apis.google.com 
                         https://www.google-analytics.com 
                         https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline' 
                        https://fonts.googleapis.com 
                        https://cdnjs.cloudflare.com;
               font-src 'self' 
                       https://fonts.gstatic.com;
               img-src 'self' data: 
                      https://*.googleusercontent.com 
                      https://via.placeholder.com;
               connect-src 'self' 
                          https://*.firebaseapp.com 
                          https://*.googleapis.com 
                          https://identitytoolkit.googleapis.com 
                          https://securetoken.googleapis.com 
                          https://www.google-analytics.com;
               frame-src 'self' 
                        https://accounts.google.com;
               object-src 'none';
               base-uri 'self';
               form-action 'self';">
```

### Firebase Hosting Headers Configuration
Update `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "geolocation=(), microphone=(), camera=(), payment=()"
          }
        ]
      },
      {
        "source": "**/*.@(js|css|html|png|jpg|jpeg|gif|svg|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains; preload"
          }
        ]
      }
    ]
  }
}
```

## Environment Configuration

### `.env.production` Template
```bash
# Firebase Production Configuration
FIREBASE_API_KEY=your_production_api_key_here
FIREBASE_AUTH_DOMAIN=investquest-67898.firebaseapp.com
FIREBASE_PROJECT_ID=investquest-67898
FIREBASE_STORAGE_BUCKET=investquest-67898.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=495317898531
FIREBASE_APP_ID=1:495317898531:web:2a4e29abc200374c6f2896
FIREBASE_MEASUREMENT_ID=G-CYV507VCGC

# Security Configuration
ENCRYPTION_KEY=your_32_character_encryption_key_here
SESSION_TIMEOUT=3600000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000

# API Configuration
DOMAIN_API_KEY=your_domain_api_key_here
CORELOGIC_API_KEY=your_corelogic_api_key_here

# Monitoring and Logging
LOG_LEVEL=warn
ANALYTICS_ENABLED=true
SECURITY_MONITORING_ENABLED=true
```

### `.env.development` Template
```bash
# Firebase Development Configuration
FIREBASE_API_KEY=your_development_api_key_here
FIREBASE_AUTH_DOMAIN=investquest-dev.firebaseapp.com
FIREBASE_PROJECT_ID=investquest-dev
FIREBASE_STORAGE_BUCKET=investquest-dev.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=development_sender_id
FIREBASE_APP_ID=development_app_id
FIREBASE_MEASUREMENT_ID=development_measurement_id

# Security Configuration
ENCRYPTION_KEY=development_encryption_key_32_chars
SESSION_TIMEOUT=7200000
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=60000

# API Configuration
DOMAIN_API_KEY=development_domain_api_key
CORELOGIC_API_KEY=development_corelogic_api_key

# Monitoring and Logging
LOG_LEVEL=debug
ANALYTICS_ENABLED=false
SECURITY_MONITORING_ENABLED=true
```

## Enhanced Authentication Configuration

### Secure Firebase Config Loader
```javascript
// config/firebase-config.js
class SecureFirebaseConfig {
  static getConfig() {
    // Validate environment
    const environment = this.detectEnvironment();
    
    // Load configuration based on environment
    const config = {
      apiKey: this.getEnvVar('FIREBASE_API_KEY'),
      authDomain: this.getEnvVar('FIREBASE_AUTH_DOMAIN'),
      projectId: this.getEnvVar('FIREBASE_PROJECT_ID'),
      storageBucket: this.getEnvVar('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
      appId: this.getEnvVar('FIREBASE_APP_ID'),
      measurementId: this.getEnvVar('FIREBASE_MEASUREMENT_ID')
    };
    
    // Validate configuration
    this.validateConfig(config);
    
    return config;
  }
  
  static detectEnvironment() {
    if (window.location.hostname === 'localhost') return 'development';
    if (window.location.hostname.includes('staging')) return 'staging';
    return 'production';
  }
  
  static getEnvVar(name) {
    const value = process.env[name] || window.ENV?.[name];
    if (!value && this.detectEnvironment() === 'production') {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
  }
  
  static validateConfig(config) {
    const required = ['apiKey', 'authDomain', 'projectId'];
    for (const field of required) {
      if (!config[field]) {
        throw new Error(`Invalid Firebase configuration: missing ${field}`);
      }
    }
  }
}
```

## Input Validation Framework

### Comprehensive Input Validator
```javascript
// utils/input-validator.js
class InputValidator {
  static validateAddress(address) {
    if (!address || typeof address !== 'string') {
      throw new ValidationError('Address must be a non-empty string');
    }
    
    // Remove potentially dangerous characters
    const sanitized = address
      .replace(/[<>\"']/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
    
    if (sanitized.length < 5 || sanitized.length > 200) {
      throw new ValidationError('Address must be between 5 and 200 characters');
    }
    
    // Check for SQL injection patterns
    const sqlPatterns = /(\b(union|select|insert|update|delete|drop|exec|script)\b)/gi;
    if (sqlPatterns.test(sanitized)) {
      throw new ValidationError('Invalid characters in address');
    }
    
    return sanitized;
  }
  
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email must be a non-empty string');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
    
    if (email.length > 254) {
      throw new ValidationError('Email too long');
    }
    
    return email.toLowerCase();
  }
  
  static validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new ValidationError('Value must be a valid number');
    }
    
    if (min !== null && num < min) {
      throw new ValidationError(`Value must be at least ${min}`);
    }
    
    if (max !== null && num > max) {
      throw new ValidationError(`Value must be no more than ${max}`);
    }
    
    return num;
  }
  
  static sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Secure Storage Implementation

### Encrypted Local Storage
```javascript
// utils/secure-storage.js
class SecureStorage {
  static async init() {
    this.encryptionKey = await this.deriveKey();
  }
  
  static async deriveKey() {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.getStorageKey()),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('investquest-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  static getStorageKey() {
    return process.env.ENCRYPTION_KEY || 'default-development-key-not-secure';
  }
  
  static async setItem(key, value) {
    try {
      const data = JSON.stringify(value);
      const encoded = new TextEncoder().encode(data);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        this.encryptionKey,
        encoded
      );
      
      const encryptedData = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encrypted))
      };
      
      localStorage.setItem(key, JSON.stringify(encryptedData));
    } catch (error) {
      console.error('Secure storage encryption failed:', error);
      throw new Error('Failed to store encrypted data');
    }
  }
  
  static async getItem(key) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const encryptedData = JSON.parse(stored);
      const iv = new Uint8Array(encryptedData.iv);
      const data = new Uint8Array(encryptedData.data);
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        this.encryptionKey,
        data
      );
      
      const decoded = new TextDecoder().decode(decrypted);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Secure storage decryption failed:', error);
      localStorage.removeItem(key); // Remove corrupted data
      return null;
    }
  }
  
  static removeItem(key) {
    localStorage.removeItem(key);
  }
  
  static clear() {
    localStorage.clear();
  }
}
```

## Enhanced Rate Limiting

### Advanced Rate Limiter
```javascript
// utils/rate-limiter.js
class AdvancedRateLimiter {
  constructor(config = {}) {
    this.requests = new Map();
    this.blocked = new Set();
    this.config = {
      maxRequests: config.maxRequests || 100,
      timeWindow: config.timeWindow || 60000,
      blockDuration: config.blockDuration || 300000,
      burstLimit: config.burstLimit || 10,
      ...config
    };
  }
  
  async checkLimit(identifier, endpoint = 'default') {
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();
    
    // Check if identifier is blocked
    if (this.blocked.has(identifier)) {
      throw new RateLimitError('Rate limit exceeded - temporarily blocked');
    }
    
    // Get request history
    const history = this.requests.get(key) || [];
    
    // Remove old requests outside time window
    const validRequests = history.filter(time => now - time < this.config.timeWindow);
    
    // Check burst limit (very recent requests)
    const recentRequests = validRequests.filter(time => now - time < 1000);
    if (recentRequests.length >= this.config.burstLimit) {
      this.blockIdentifier(identifier);
      throw new RateLimitError('Burst rate limit exceeded');
    }
    
    // Check overall rate limit
    if (validRequests.length >= this.config.maxRequests) {
      this.blockIdentifier(identifier);
      throw new RateLimitError('Rate limit exceeded');
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - validRequests.length,
      resetTime: now + this.config.timeWindow
    };
  }
  
  blockIdentifier(identifier) {
    this.blocked.add(identifier);
    setTimeout(() => {
      this.blocked.delete(identifier);
    }, this.config.blockDuration);
  }
  
  cleanup() {
    const now = Date.now();
    
    // Clean up old request histories
    for (const [key, history] of this.requests.entries()) {
      const validRequests = history.filter(time => now - time < this.config.timeWindow);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimitError';
  }
}
```

---

**Note**: These templates provide a comprehensive security foundation for the InvestQuest platform. Implement them gradually according to the priority levels defined in the security assessment report.