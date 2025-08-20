// Global Authentication Initialization
// Ensures consistent auth behavior across all pages

class GlobalAuthManager {
    constructor() {
        this.isInitialized = false;
        this.pageType = this.detectPageType();
        console.log(`🌐 GlobalAuthManager: Page type detected: ${this.pageType}`);
    }

    detectPageType() {
        const path = window.location.pathname;
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('calculator')) return 'calculator';
        if (path.includes('education')) return 'education';
        return 'index';
    }

    async init() {
        if (this.isInitialized) return;

        console.log('🌐 Initializing global auth manager...');

        // Wait for auth manager to be available
        if (!window.authManager) {
            console.log('🌐 Waiting for auth manager...');
            await new Promise(resolve => {
                const checkAuth = setInterval(() => {
                    if (window.authManager) {
                        clearInterval(checkAuth);
                        resolve();
                    }
                }, 100);
            });
        }

        try {
            await window.authManager.init();
            const user = window.authManager.getCurrentUser();
            
            console.log(`🌐 Auth state on ${this.pageType}:`, user ? user.email : 'not authenticated');

            // Handle page-specific logic
            this.handlePageAuth(user);
            
            // Set up auth state listener for future changes
            window.authManager.onAuthStateChange((user) => {
                console.log('🌐 Auth state changed globally:', user ? user.email : 'signed out');
                this.handlePageAuth(user);
            });

            this.isInitialized = true;
            console.log('🌐 Global auth manager initialized');

        } catch (error) {
            console.error('🌐 Global auth initialization failed:', error);
        }
    }

    handlePageAuth(user) {
        // Update navigation for all pages
        this.updateNavigation(user);

        // Page-specific handling
        switch (this.pageType) {
            case 'dashboard':
                if (!user) {
                    console.log('🌐 Dashboard requires auth, redirecting...');
                    // Let dashboard manager handle this
                }
                break;
            
            case 'calculator':
            case 'education':
                // These pages don't require auth but should update UI
                if (user) {
                    console.log(`🌐 User authenticated on ${this.pageType} page`);
                }
                break;
            
            case 'index':
                if (user) {
                    console.log('🌐 User already signed in on homepage');
                }
                break;
        }
    }

    updateNavigation(user) {
        // Update sign in button
        const signInBtn = document.querySelector('.auth-signin-btn');
        if (signInBtn && user) {
            signInBtn.textContent = 'Dashboard';
            signInBtn.onclick = () => window.location.href = 'dashboard.html';
            signInBtn.classList.remove('auth-signin-btn');
        }

        // Update "Back to Home" to "Dashboard" on calculator/education pages
        if ((this.pageType === 'calculator' || this.pageType === 'education') && user) {
            const backToHomeLink = document.querySelector('.nav-cta');
            if (backToHomeLink && backToHomeLink.textContent === 'Back to Home') {
                backToHomeLink.textContent = 'Dashboard';
                backToHomeLink.href = 'dashboard.html';
            }
        }

        // Show/hide dashboard link in nav
        const dashboardLink = document.getElementById('dashboardLink');
        if (dashboardLink) {
            dashboardLink.style.display = user ? 'block' : 'none';
        }
    }
}

// Initialize global auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.globalAuth = new GlobalAuthManager();
    window.globalAuth.init();
});

console.log('🌐 Global auth script loaded');