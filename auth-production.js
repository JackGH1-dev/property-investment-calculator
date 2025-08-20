// InvestQuest Production Authentication System
// Real Firebase Authentication with fallback to demo mode

console.log('🔥 Loading InvestQuest Production Authentication System');

// Firebase configuration - PRODUCTION READY
const firebaseConfig = {
    apiKey: "AIzaSyDP3X9E59AHb-U_OczTK_VywFcqbxmnsjk",
    authDomain: "investquest-67898.firebaseapp.com",
    projectId: "investquest-67898",
    storageBucket: "investquest-67898.firebasestorage.app",
    messagingSenderId: "495317898531",
    appId: "1:495317898531:web:2a4e29abc200374c6f2896",
    measurementId: "G-CYV507VCGC"
};

// Production Authentication Manager
class ProductionAuthManager {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
        this.isInitialized = false;
        this.firebaseAvailable = false;
        this.auth = null;
        this.db = null;
        
        console.log('🔥 ProductionAuthManager initialized');
    }

    // Initialize authentication system
    async init() {
        if (this.isInitialized) {
            console.log('🔥 Auth already initialized');
            return;
        }

        console.log('🔥 Initializing production authentication...');

        // Try to initialize Firebase first
        try {
            await this.initializeFirebase();
        } catch (error) {
            console.warn('🔥 Firebase unavailable, using demo mode:', error.message);
            this.setupDemoMode();
        }

        this.isInitialized = true;
        console.log('🔥 Authentication system ready');
    }

    // Initialize real Firebase
    async initializeFirebase() {
        // Check if Firebase config is set up
        if (firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('Firebase not configured - using demo mode');
        }

        // Check if Firebase is loaded
        if (typeof firebase === 'undefined') {
            // Try to load Firebase from CDN
            await this.loadFirebaseSDK();
        }

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.auth = firebase.auth();
        this.db = firebase.firestore();

        // Check if there's already a persisted user
        const persistedUser = this.auth.currentUser;
        if (persistedUser) {
            console.log('🔥 Found persisted user:', persistedUser.email);
            this.currentUser = {
                uid: persistedUser.uid,
                displayName: persistedUser.displayName,
                email: persistedUser.email,
                photoURL: persistedUser.photoURL,
                emailVerified: persistedUser.emailVerified
            };
        }

        // Configure Firebase Auth persistence
        try {
            await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            console.log('🔥 Firebase Auth persistence set to LOCAL');
        } catch (error) {
            console.warn('🔥 Auth persistence not available:', error.message);
        }

        // Configure Firestore settings
        this.db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });

        // Enable offline persistence with multi-tab support
        try {
            await this.db.enablePersistence({
                synchronizeTabs: true
            });
            console.log('🔥 Firestore offline persistence enabled with multi-tab support');
        } catch (error) {
            console.warn('🔥 Firestore persistence not available:', error.message);
        }

        // Set up real auth state listener with immediate check
        this.auth.onAuthStateChanged(async (user) => {
            console.log('🔥 Auth state changed:', user ? `signed in as ${user.email}` : 'signed out');
            
            if (user) {
                // Create/update user document in Firestore
                await this.createUserDocument(user);
                this.currentUser = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    createdAt: user.metadata.creationTime,
                    lastLoginAt: user.metadata.lastSignInTime
                };
                
                // Load additional user data from Firestore
                await this.loadUserProfile();
            } else {
                this.currentUser = null;
            }
            
            this.notifyAuthStateChange(this.currentUser);
        });

        this.firebaseAvailable = true;
        console.log('🔥 Firebase initialized successfully');

        // Initialize Analytics if available
        if (firebaseConfig.measurementId && typeof gtag !== 'undefined') {
            gtag('config', firebaseConfig.measurementId);
            console.log('📊 Google Analytics initialized');
        }
    }

    // Load Firebase SDK dynamically
    async loadFirebaseSDK() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof firebase !== 'undefined') {
                resolve();
                return;
            }

            console.log('📦 Loading Firebase SDK...');
            
            // Create script elements for Firebase
            const scripts = [
                'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
                'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
                'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
            ];

            let loadedCount = 0;

            scripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    loadedCount++;
                    if (loadedCount === scripts.length) {
                        console.log('📦 Firebase SDK loaded successfully');
                        resolve();
                    }
                };
                script.onerror = () => {
                    console.error('📦 Failed to load Firebase SDK');
                    reject(new Error('Failed to load Firebase SDK'));
                };
                document.head.appendChild(script);
            });
        });
    }

    // Create or update user document in Firestore
    async createUserDocument(user) {
        if (!this.db) return;

        try {
            const userRef = this.db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();

            const userData = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (!userDoc.exists) {
                // New user
                userData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                userData.userType = null; // Will be set during onboarding
                userData.subscription = 'free';
                userData.settings = {
                    notifications: true,
                    theme: 'light',
                    currency: 'AUD'
                };
                
                await userRef.set(userData);
                console.log('🔥 New user document created');
            } else {
                // Existing user - update login time
                await userRef.update(userData);
                console.log('🔥 User document updated');
            }
        } catch (error) {
            console.error('🔥 Error creating/updating user document:', error);
            console.error('🔥 Error details:', error.code, error.message);
            
            // Continue anyway - don't block authentication for database issues
            console.log('🔥 Continuing with authentication despite database error');
        }
    }

    // Load additional user profile data
    async loadUserProfile() {
        if (!this.db || !this.currentUser) return;

        try {
            const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
            if (userDoc.exists) {
                const profileData = userDoc.data();
                this.currentUser = {
                    ...this.currentUser,
                    userType: profileData.userType,
                    subscription: profileData.subscription,
                    settings: profileData.settings
                };
                console.log('🔥 User profile loaded');
            }
        } catch (error) {
            console.error('🔥 Error loading user profile:', error);
            console.error('🔥 Error details:', error.code, error.message);
            
            // Continue anyway - don't block authentication for profile loading issues
            console.log('🔥 Continuing with authentication despite profile loading error');
        }
    }

    // Demo mode fallback
    setupDemoMode() {
        console.log('🎭 Setting up demo authentication mode');
        this.firebaseAvailable = false;
        
        // Check for existing demo user
        const savedUser = localStorage.getItem('investquest-demo-user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('🎭 Restored demo user:', this.currentUser.displayName);
                setTimeout(() => this.notifyAuthStateChange(this.currentUser), 100);
            } catch (error) {
                console.error('🎭 Error parsing saved demo user:', error);
                localStorage.removeItem('investquest-demo-user');
            }
        }
    }

    // Sign in with Google
    async signInWithGoogle() {
        console.log('🔐 Starting Google sign in...');

        if (this.firebaseAvailable && this.auth) {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('email');
                provider.addScope('profile');
                
                const result = await this.auth.signInWithPopup(provider);
                console.log('🔥 Real Google sign in successful');
                
                // Track sign in event
                this.trackEvent('sign_in', { method: 'google' });
                
                return result.user;
            } catch (error) {
                console.error('🔥 Google sign in failed:', error);
                
                // Check if it's a specific error we can handle
                if (error.code === 'auth/popup-closed-by-user') {
                    throw new Error('Sign in was cancelled');
                } else if (error.code === 'auth/popup-blocked') {
                    throw new Error('Popup was blocked by browser. Please allow popups and try again.');
                } else {
                    throw new Error('Sign in failed: ' + error.message);
                }
            }
        } else {
            // Demo mode fallback
            console.log('🎭 Using demo Google sign in');
            return this.createDemoUser();
        }
    }

    // Create demo user
    createDemoUser() {
        const demoUser = {
            uid: 'demo-user-' + Date.now(),
            displayName: 'Demo User',
            email: 'demo@investquest.com.au',
            photoURL: 'https://via.placeholder.com/100x100/667eea/ffffff?text=DU',
            emailVerified: true,
            userType: null,
            subscription: 'free',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
        };
        
        localStorage.setItem('investquest-demo-user', JSON.stringify(demoUser));
        this.currentUser = demoUser;
        
        setTimeout(() => this.notifyAuthStateChange(demoUser), 100);
        
        console.log('🎭 Demo user created:', demoUser.displayName);
        return Promise.resolve(demoUser);
    }

    // Sign out
    async signOut() {
        console.log('🔐 Signing out...');

        if (this.firebaseAvailable && this.auth) {
            try {
                await this.auth.signOut();
                console.log('🔥 Firebase sign out successful');
            } catch (error) {
                console.error('🔥 Firebase sign out error:', error);
            }
        } else {
            // Demo mode
            localStorage.removeItem('investquest-demo-user');
            this.currentUser = null;
            this.notifyAuthStateChange(null);
        }
        
        // Track sign out event
        this.trackEvent('sign_out');
        
        console.log('🔐 Sign out complete');
    }

    // Set user type
    async setUserType(userType) {
        console.log('👤 Setting user type:', userType);
        
        if (!this.currentUser) {
            throw new Error('No current user to set type for');
        }
        
        this.currentUser.userType = userType;
        this.currentUser.updatedAt = new Date().toISOString();
        
        if (this.firebaseAvailable && this.db) {
            try {
                await this.db.collection('users').doc(this.currentUser.uid).update({
                    userType,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('🔥 User type saved to Firestore');
            } catch (error) {
                console.error('🔥 Failed to save user type to Firestore:', error);
            }
        } else {
            // Demo mode - save to localStorage
            localStorage.setItem('investquest-demo-user', JSON.stringify(this.currentUser));
        }
        
        // Track user type selection
        this.trackEvent('user_type_selected', { user_type: userType });
        
        console.log('👤 User type set successfully');
    }

    // Track analytics events
    trackEvent(eventName, parameters = {}) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    ...parameters,
                    user_id: this.currentUser?.uid,
                    timestamp: new Date().toISOString()
                });
                console.log('📊 Event tracked:', eventName);
            }
        } catch (error) {
            console.warn('📊 Analytics tracking failed:', error);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Check if user is professional
    isProfessional() {
        return this.currentUser?.userType === 'professional';
    }

    // Check if Firebase is available
    isFirebaseAvailable() {
        return this.firebaseAvailable;
    }

    // Add auth state change listener
    onAuthStateChange(callback) {
        if (typeof callback === 'function') {
            this.authStateListeners.push(callback);
            console.log('🔐 Auth state listener added');
        }
    }

    // Notify all listeners of auth state changes
    notifyAuthStateChange(user) {
        console.log('🔐 Notifying auth state change to', this.authStateListeners.length, 'listeners');
        this.authStateListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('🔐 Error in auth state listener:', error);
            }
        });
    }
}

// Updated AuthUI for production
class ProductionAuthUI {
    static showAuthModal(mode = 'signin') {
        console.log('🎨 Showing production auth modal:', mode);
        
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) existingModal.remove();

        const isFirebaseAvailable = window.authManager?.isFirebaseAvailable();
        const authMethodText = isFirebaseAvailable ? 'Continue with Google' : 'Continue with Google (Demo)';
        const demoNotice = isFirebaseAvailable ? '' : `
            <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-radius: 6px; font-size: 0.9rem; color: #92400e;">
                <strong>Demo Mode:</strong> Firebase not configured. Using simulated authentication for testing.
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-backdrop"></div>
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h2>${mode === 'signin' ? '👋 Welcome to InvestQuest' : '🚀 Join InvestQuest'}</h2>
                    <button class="auth-modal-close">&times;</button>
                </div>
                <div class="auth-modal-body">
                    <p>Sign in to save your calculations, track your investment goals, and access personalized insights.</p>
                    
                    <button class="auth-google-btn" id="googleSignInBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        ${authMethodText}
                    </button>
                    
                    <div class="auth-benefits">
                        <h4>✨ Member Benefits:</h4>
                        <ul>
                            <li>💾 Save unlimited property calculations</li>
                            <li>📊 Track your investment portfolio performance</li>
                            <li>🎯 Set and monitor financial goals</li>
                            <li>📈 Access advanced market insights</li>
                            <li>🏦 Professional tools for mortgage brokers</li>
                        </ul>
                    </div>
                    
                    ${demoNotice}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.auth-modal-close').onclick = () => modal.remove();
        modal.querySelector('.auth-modal-backdrop').onclick = () => modal.remove();
        
        modal.querySelector('#googleSignInBtn').onclick = async () => {
            const signInBtn = modal.querySelector('#googleSignInBtn');
            const originalHTML = signInBtn.innerHTML;
            
            try {
                signInBtn.disabled = true;
                signInBtn.innerHTML = '<span style="opacity: 0.7;">Signing in...</span>';
                
                const user = await window.authManager.signInWithGoogle();
                console.log('🎨 Sign in successful:', user);
                
                // Close modal and wait for any async operations
                modal.remove();
                await new Promise(resolve => setTimeout(resolve, 100));
                
                if (!user.userType) {
                    setTimeout(() => ProductionAuthUI.showUserTypeSelection(), 500);
                } else {
                    // Allow more time for async operations to complete
                    setTimeout(() => {
                        try {
                            console.log('🔀 Redirecting to dashboard...');
                            // Use replace to avoid back button issues
                            window.location.replace('dashboard.html');
                        } catch (error) {
                            console.warn('Redirect error:', error);
                            // Fallback
                            window.location.href = 'dashboard.html';
                        }
                    }, 1500);
                }
            } catch (error) {
                console.error('🎨 Sign in failed:', error);
                alert('Sign in failed: ' + error.message);
                
                signInBtn.disabled = false;
                signInBtn.innerHTML = originalHTML;
            }
        };
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.remove();
        });
    }

    static showUserTypeSelection() {
        console.log('🎨 Showing user type selection');
        
        const modal = document.createElement('div');
        modal.className = 'user-type-modal';
        modal.innerHTML = `
            <div class="auth-modal-backdrop"></div>
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h2>🎯 Welcome to InvestQuest!</h2>
                </div>
                <div class="auth-modal-body">
                    <p>Tell us about yourself to personalize your experience:</p>
                    
                    <div class="user-type-options">
                        <button class="user-type-option" data-type="consumer">
                            <div class="user-type-icon">🏠</div>
                            <h3>Property Investor</h3>
                            <p>I'm building my own property investment portfolio</p>
                        </button>
                        
                        <button class="user-type-option" data-type="professional">
                            <div class="user-type-icon">🏦</div>
                            <h3>Property Professional</h3>
                            <p>I'm a mortgage broker, financial planner, or advisor helping clients</p>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.user-type-option').forEach(option => {
            option.onclick = async () => {
                const userType = option.dataset.type;
                console.log('🎨 User selected type:', userType);
                
                try {
                    option.disabled = true;
                    option.style.opacity = '0.7';
                    
                    await window.authManager.setUserType(userType);
                    modal.remove();
                    
                    // Allow more time for async operations to complete
                    setTimeout(() => {
                        try {
                            console.log('🔀 Redirecting to dashboard...');
                            // Use replace to avoid back button issues
                            window.location.replace('dashboard.html');
                        } catch (error) {
                            console.warn('Redirect error:', error);
                            // Fallback
                            window.location.href = 'dashboard.html';
                        }
                    }, 1500);
                } catch (error) {
                    console.error('🎨 Failed to set user type:', error);
                    alert('Failed to set user type: ' + error.message);
                    option.disabled = false;
                    option.style.opacity = '1';
                }
            };
        });
    }

    static updateNavigation() {
        const user = window.authManager?.getCurrentUser();
        
        const navCta = document.querySelector('.nav-cta');
        if (navCta && user) {
            if (navCta.classList.contains('auth-signin-btn')) {
                navCta.textContent = 'Dashboard';
                navCta.onclick = () => window.location.href = 'dashboard.html';
                navCta.classList.remove('auth-signin-btn');
                navCta.href = 'dashboard.html';
            }
        }
        
        const dashboardLink = document.getElementById('dashboardLink');
        if (dashboardLink && user) {
            dashboardLink.style.display = 'block';
        }
    }
}

// Global instances
console.log('🔥 Creating global production auth manager');
window.authManager = new ProductionAuthManager();
window.AuthUI = ProductionAuthUI;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔥 DOM loaded, initializing production auth system');
    
    try {
        await window.authManager.init();
        
        window.authManager.onAuthStateChange((user) => {
            console.log('🔥 Auth state changed, updating UI');
            ProductionAuthUI.updateNavigation();
        });
        
        ProductionAuthUI.updateNavigation();
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('.auth-signin-btn')) {
                e.preventDefault();
                console.log('🔥 Sign in button clicked');
                ProductionAuthUI.showAuthModal('signin');
            }
        });
        
        console.log('🔥 Production auth system ready');
    } catch (error) {
        console.error('🔥 Production auth system failed to initialize:', error);
    }
});

console.log('🔥 Production auth script loaded successfully');