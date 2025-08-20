// Firebase Project Diagnostic Tool
// Run this in browser console on your site

console.log('🔥 Firebase Diagnostic Tool Starting...');

// Check Firebase configuration
const config = {
    apiKey: "AIzaSyDP3X9E59AHb-U_OczTK_VywFcqbxmnsjk",
    authDomain: "investquest-67898.firebaseapp.com",
    projectId: "investquest-67898",
    storageBucket: "investquest-67898.firebasestorage.app",
    messagingSenderId: "495317898531",
    appId: "1:495317898531:web:2a4e29abc200374c6f2896",
    measurementId: "G-CYV507VCGC"
};

console.log('📋 Firebase Configuration:', config);

// Check if Firebase is loaded
console.log('📦 Firebase SDK loaded:', typeof firebase !== 'undefined');

if (typeof firebase !== 'undefined') {
    console.log('📦 Firebase apps:', firebase.apps.length);
    console.log('📦 Auth available:', typeof firebase.auth !== 'undefined');
    console.log('📦 Firestore available:', typeof firebase.firestore !== 'undefined');
}

// Check current domain
console.log('🌐 Current domain:', window.location.hostname);
console.log('🌐 Current protocol:', window.location.protocol);
console.log('🌐 Current port:', window.location.port);
console.log('🌐 Full origin:', window.location.origin);

// Test network connectivity to Firebase
async function testFirebaseConnectivity() {
    console.log('🔗 Testing Firebase connectivity...');
    
    try {
        const response = await fetch('https://investquest-67898.firebaseapp.com/__/auth/handler');
        console.log('✅ Firebase Auth handler reachable:', response.status);
    } catch (error) {
        console.error('❌ Firebase Auth handler unreachable:', error);
    }
    
    try {
        const response = await fetch('https://firestore.googleapis.com/v1/projects/investquest-67898/databases/(default)/documents');
        console.log('✅ Firestore API reachable:', response.status);
    } catch (error) {
        console.error('❌ Firestore API unreachable:', error);
    }
}

testFirebaseConnectivity();

// Check for common OAuth issues
function checkOAuthConfig() {
    console.log('🔐 OAuth Configuration Check:');
    console.log('   Auth Domain:', config.authDomain);
    console.log('   Expected redirect pattern:', `https://${config.authDomain}/__/auth/handler`);
    console.log('   Current origin allowed:', window.location.origin);
    
    // Common OAuth origins that should be configured:
    const commonOrigins = [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'https://investquest-67898.web.app',
        'https://investquest-67898.firebaseapp.com',
        window.location.origin
    ];
    
    console.log('🔐 Common origins to whitelist:', commonOrigins);
}

checkOAuthConfig();

// Export diagnostic function
window.firebaseDiagnostic = {
    config,
    testConnectivity: testFirebaseConnectivity,
    checkOAuth: checkOAuthConfig,
    
    async testAuth() {
        if (!firebase || !firebase.auth) {
            console.error('❌ Firebase Auth not available');
            return;
        }
        
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            console.log('🔐 Testing Google Auth provider creation... ✅');
            
            // This will show popup configuration errors
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.error('❌ Auth test failed:', error.code, error.message);
            
            // Specific error guidance
            if (error.code === 'auth/unauthorized-domain') {
                console.log('💡 FIX: Add this domain to authorized domains in Firebase Console > Authentication > Settings > Authorized domains');
            } else if (error.code === 'auth/popup-blocked') {
                console.log('💡 FIX: Allow popups in browser');
            } else if (error.code === 'auth/operation-not-allowed') {
                console.log('💡 FIX: Enable Google provider in Firebase Console > Authentication > Sign-in method');
            }
        }
    }
};

console.log('🔥 Diagnostic complete. Run window.firebaseDiagnostic.testAuth() to test authentication.');