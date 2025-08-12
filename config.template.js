// Configuration template file for API keys and settings
// INSTRUCTIONS: 
// 1. Copy this file to 'config.js'
// 2. Replace 'YOUR_API_KEY_HERE' with your actual Google Places API key
// 3. The real config.js file is ignored by git for security

const CONFIG = {
    // Replace 'YOUR_API_KEY_HERE' with your actual Google Places API key
    // Get your API key from: https://console.cloud.google.com/
    GOOGLE_PLACES_API_KEY: 'YOUR_API_KEY_HERE',
    
    // API settings
    PLACES_API: {
        // Restrict to Australia only
        componentRestrictions: { country: 'au' },
        // Focus on addresses
        types: ['address']
    }
};

// Export for use in other files
window.CONFIG = CONFIG;