// InvestQuest Authentication System - FIXED VERSION
// Improved error handling and localStorage fallback

console.log('🔐 Loading InvestQuest Authentication System');

// Authentication state management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
        this.isInitialized = false;
        
        console.log('🔐 AuthManager initialized');
    }

    // Initialize authentication system
    async init() {
        if (this.isInitialized) {
            console.log('🔐 Auth already initialized');
            return;
        }

        console.log('🔐 Initializing authentication system...');

        // Use localStorage fallback for demo
        this.setupLocalStorageFallback();
        this.isInitialized = true;
        
        console.log('🔐 Authentication system ready');
    }

    // Fallback authentication using localStorage
    setupLocalStorageFallback() {
        console.log('📦 Setting up localStorage authentication fallback');
        
        // Check for existing user in localStorage
        const savedUser = localStorage.getItem('investquest-user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('📦 Restored user from localStorage:', this.currentUser.displayName);
                // Notify listeners after a short delay
                setTimeout(() => {
                    this.notifyAuthStateChange(this.currentUser);
                }, 100);
            } catch (error) {
                console.error('📦 Error parsing saved user:', error);
                localStorage.removeItem('investquest-user');
            }
        }
    }

    // Sign in with Google (simulated)
    async signInWithGoogle() {
        console.log('🔐 Starting simulated Google sign in...');
        
        try {
            const mockUser = {
                uid: 'demo-user-' + Date.now(),
                displayName: 'Demo User',
                email: 'demo@example.com',
                photoURL: 'https://via.placeholder.com/100x100/667eea/ffffff?text=DU',
                userType: null, // Will be set during onboarding
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('investquest-user', JSON.stringify(mockUser));
            this.currentUser = mockUser;
            
            // Notify listeners
            setTimeout(() => {
                this.notifyAuthStateChange(mockUser);
            }, 100);
            
            console.log('🎭 Mock user created:', mockUser.displayName);
            return mockUser;
            
        } catch (error) {
            console.error('🔐 Sign in error:', error);
            throw new Error('Sign in failed: ' + error.message);
        }
    }

    // Sign out
    async signOut() {
        console.log('🔐 Signing out...');
        
        try {
            // Clear localStorage
            localStorage.removeItem('investquest-user');
            this.currentUser = null;
            this.notifyAuthStateChange(null);
            console.log('🔐 Sign out complete');
        } catch (error) {
            console.error('🔐 Sign out error:', error);
            throw error;
        }
    }

    // Set user type (consumer or professional)
    async setUserType(userType) {
        console.log('👤 Setting user type:', userType);
        
        if (!this.currentUser) {
            throw new Error('No current user to set type for');
        }
        
        this.currentUser.userType = userType;
        this.currentUser.updatedAt = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('investquest-user', JSON.stringify(this.currentUser));
        console.log('👤 User type set successfully');
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

// DOM utilities for authentication UI
class AuthUI {
    static showAuthModal(mode = 'signin') {
        console.log('🎨 Showing auth modal:', mode);
        
        // Remove any existing modals
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-backdrop"></div>
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h2>${mode === 'signin' ? '👋 Welcome Back' : '🚀 Join InvestQuest'}</h2>
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
                        Continue with Google (Demo)
                    </button>
                    
                    <div class="auth-benefits">
                        <h4>✨ Member Benefits:</h4>
                        <ul>
                            <li>💾 Save unlimited property calculations</li>
                            <li>📊 Track your investment goals and progress</li>
                            <li>🎯 Get personalized recommendations</li>
                            <li>📈 Access advanced analysis tools</li>
                        </ul>
                    </div>
                    
                    <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-radius: 6px; font-size: 0.9rem; color: #92400e;">
                        <strong>Demo Mode:</strong> This is using simulated authentication for testing. In production, this would use real Google OAuth.
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.auth-modal-close').onclick = () => {
            console.log('🎨 Closing auth modal');
            modal.remove();
        };
        
        modal.querySelector('.auth-modal-backdrop').onclick = () => {
            console.log('🎨 Closing auth modal via backdrop');
            modal.remove();
        };
        
        modal.querySelector('#googleSignInBtn').onclick = async () => {
            console.log('🎨 Google sign in button clicked');
            
            const signInBtn = modal.querySelector('#googleSignInBtn');
            const originalText = signInBtn.innerHTML;
            
            try {
                signInBtn.disabled = true;
                signInBtn.textContent = 'Signing in...';
                
                const user = await window.authManager.signInWithGoogle();
                console.log('🎨 Sign in successful:', user);
                
                modal.remove();
                
                // Show user type selection if new user
                if (!user.userType) {
                    console.log('🎨 New user, showing type selection');
                    setTimeout(() => AuthUI.showUserTypeSelection(), 300);
                } else {
                    // Redirect to dashboard
                    console.log('🎨 Existing user, redirecting to dashboard');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);
                }
            } catch (error) {
                console.error('🎨 Sign in failed:', error);
                alert('Sign in failed: ' + error.message);
                
                // Re-enable button
                signInBtn.disabled = false;
                signInBtn.innerHTML = originalText;
            }
        };
        
        // Focus trap and escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('🎨 Closing auth modal via escape key');
                modal.remove();
            }
        });
        
        console.log('🎨 Auth modal displayed');
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
                    <p>Tell us a bit about yourself to personalize your experience:</p>
                    
                    <div class="user-type-options">
                        <button class="user-type-option" data-type="consumer">
                            <div class="user-type-icon">🏠</div>
                            <h3>Property Investor</h3>
                            <p>I'm looking to analyze my own property investments and build my portfolio</p>
                        </button>
                        
                        <button class="user-type-option" data-type="professional">
                            <div class="user-type-icon">🏦</div>
                            <h3>Property Professional</h3>
                            <p>I'm a mortgage broker, financial planner, or advisor helping clients with property investments</p>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelectorAll('.user-type-option').forEach(option => {
            option.onclick = async () => {
                const userType = option.dataset.type;
                console.log('🎨 User selected type:', userType);
                
                try {
                    option.disabled = true;
                    option.style.opacity = '0.7';
                    
                    await window.authManager.setUserType(userType);
                    modal.remove();
                    
                    console.log('🎨 Redirecting to dashboard');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);
                } catch (error) {
                    console.error('🎨 Failed to set user type:', error);
                    alert('Failed to set user type: ' + error.message);
                }
            };
        });
        
        console.log('🎨 User type selection displayed');
    }

    static updateNavigation() {
        const user = window.authManager?.getCurrentUser();
        console.log('🎨 Updating navigation, user:', user ? 'authenticated' : 'not authenticated');
        
        // Update nav CTA button
        const navCta = document.querySelector('.nav-cta');
        if (navCta && user) {
            if (navCta.classList.contains('auth-signin-btn')) {
                navCta.textContent = 'Dashboard';
                navCta.onclick = () => window.location.href = 'dashboard.html';
                navCta.classList.remove('auth-signin-btn');
                navCta.href = 'dashboard.html';
            }
        }
        
        // Show dashboard link in footer
        const dashboardLink = document.getElementById('dashboardLink');
        if (dashboardLink && user) {
            dashboardLink.style.display = 'block';
        }
    }
}

// Global auth manager instance
console.log('🔐 Creating global auth manager');
window.authManager = new AuthManager();
window.AuthUI = AuthUI;

// Initialize authentication when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔐 DOM loaded, initializing auth system');
    
    try {
        await window.authManager.init();
        
        // Update navigation based on auth state
        window.authManager.onAuthStateChange((user) => {
            console.log('🔐 Auth state changed, updating UI');
            AuthUI.updateNavigation();
        });
        
        // Initial navigation update
        AuthUI.updateNavigation();
        
        // Add sign in button handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.auth-signin-btn')) {
                e.preventDefault();
                console.log('🔐 Sign in button clicked');
                AuthUI.showAuthModal('signin');
            }
        });
        
        console.log('🔐 Auth system initialization complete');
    } catch (error) {
        console.error('🔐 Auth system initialization failed:', error);
    }
});

console.log('🔐 Auth script loaded successfully');