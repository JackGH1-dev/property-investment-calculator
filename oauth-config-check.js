// OAuth Configuration Checker
// Run in browser console to verify OAuth setup

console.log('🔐 OAuth Configuration Checker');

const expectedConfig = {
    projectId: 'investquest-67898',
    authDomain: 'investquest-67898.firebaseapp.com',
    expectedOrigins: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'https://investquest-67898.web.app',
        'https://investquest-67898.firebaseapp.com',
        window.location.origin
    ],
    expectedRedirectUri: 'https://investquest-67898.firebaseapp.com/__/auth/handler'
};

console.log('📋 Expected Configuration:', expectedConfig);

// Test current OAuth setup
async function testOAuthSetup() {
    console.log('🧪 Testing OAuth Configuration...');
    
    // Check if current origin should work
    const currentOrigin = window.location.origin;
    const originAllowed = expectedConfig.expectedOrigins.includes(currentOrigin);
    
    console.log(`🌐 Current Origin: ${currentOrigin}`);
    console.log(`✅ Origin Expected: ${originAllowed ? 'YES' : 'NO - ADD TO FIREBASE CONSOLE'}`);
    
    if (!originAllowed) {
        console.log('❌ ISSUE: Current origin not in expected list');
        console.log('💡 FIX: Add to Firebase Console > Authentication > Settings > Authorized domains');
        console.log(`   Add: ${currentOrigin}`);
    }
    
    // Test redirect URI accessibility
    try {
        const response = await fetch(expectedConfig.expectedRedirectUri, { 
            mode: 'no-cors',
            method: 'HEAD'
        });
        console.log('✅ Redirect URI reachable');
    } catch (error) {
        console.log('❌ Redirect URI test failed:', error.message);
    }
    
    // Check Firebase Auth configuration
    if (typeof firebase !== 'undefined' && firebase.auth) {
        try {
            const currentUser = firebase.auth().currentUser;
            console.log('👤 Current Auth State:', currentUser ? 'Signed In' : 'Signed Out');
            
            // Test provider creation
            const provider = new firebase.auth.GoogleAuthProvider();
            console.log('✅ Google Provider created successfully');
            
            // Check provider scopes
            provider.addScope('email');
            provider.addScope('profile');
            console.log('✅ OAuth scopes added: email, profile');
            
        } catch (error) {
            console.log('❌ Firebase Auth setup error:', error.message);
        }
    }
}

// Test specific OAuth errors
async function simulateAuthFlow() {
    console.log('🔄 Simulating Auth Flow...');
    
    if (!firebase || !firebase.auth) {
        console.log('❌ Firebase not loaded');
        return;
    }
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            'hd': '' // Allow any domain
        });
        
        // This will trigger OAuth flow and show specific errors
        console.log('🚀 Starting OAuth popup...');
        const result = await firebase.auth().signInWithPopup(provider);
        console.log('✅ OAuth Success:', result.user.email);
        
    } catch (error) {
        console.log('❌ OAuth Error Details:');
        console.log('   Code:', error.code);
        console.log('   Message:', error.message);
        
        // Specific error handling
        switch (error.code) {
            case 'auth/unauthorized-domain':
                console.log('💡 FIX: Add domain to Authorized domains in Firebase Console');
                console.log(`   Domain to add: ${window.location.hostname}`);
                break;
                
            case 'auth/popup-blocked':
                console.log('💡 FIX: Allow popups in browser settings');
                break;
                
            case 'auth/operation-not-allowed':
                console.log('💡 FIX: Enable Google provider in Firebase Console > Authentication > Sign-in method');
                break;
                
            case 'auth/invalid-api-key':
                console.log('💡 FIX: Check API key in Firebase config');
                break;
                
            case 'auth/app-not-authorized':
                console.log('💡 FIX: Check OAuth client configuration in Google Cloud Console');
                break;
                
            default:
                console.log('💡 Check Firebase Console for more details');
        }
    }
}

// Export functions
window.oauthChecker = {
    test: testOAuthSetup,
    simulate: simulateAuthFlow,
    config: expectedConfig
};

// Auto-run basic checks
testOAuthSetup();

console.log('🔐 OAuth checker ready. Run window.oauthChecker.simulate() to test auth flow.');