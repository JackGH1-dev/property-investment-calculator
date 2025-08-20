// InvestQuest Production Dashboard Management
// Integrates with Firebase Firestore for real data persistence

class ProductionDashboardManager {
    constructor() {
        this.calculations = [];
        this.user = null;
        this.isInitialized = false;
        this.db = null;
        this.unsubscribers = []; // For Firestore listeners
        
        console.log('🏠 ProductionDashboardManager initialized');
    }

    // Initialize dashboard
    async init() {
        if (this.isInitialized) return;

        console.log('🏠 Dashboard init starting...');

        if (!window.authManager) {
            console.log('🏠 AuthManager not ready, waiting...');
            setTimeout(() => this.init(), 100);
            return;
        }

        try {
            console.log('🏠 Initializing auth manager...');
            await window.authManager.init();
            
            console.log('🏠 Waiting for auth state...');
            // Wait for authentication state to be determined
            await this.waitForAuthState();
            
            console.log('🏠 Checking current user...');
            this.user = window.authManager.getCurrentUser();
            console.log('🏠 Current user from authManager:', this.user);

            if (!this.user) {
                console.log('🔐 No authenticated user found, waiting a bit more...');
                // Wait a bit more in case auth is still processing
                await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
                this.user = window.authManager.getCurrentUser();
                console.log('🏠 User after delay:', this.user);
                
                // Also check Firebase directly
                if (window.authManager.isFirebaseAvailable() && firebase.auth().currentUser) {
                    console.log('🔥 Firebase has current user:', firebase.auth().currentUser.email);
                    this.user = {
                        uid: firebase.auth().currentUser.uid,
                        displayName: firebase.auth().currentUser.displayName,
                        email: firebase.auth().currentUser.email,
                        photoURL: firebase.auth().currentUser.photoURL,
                        emailVerified: firebase.auth().currentUser.emailVerified
                    };
                }
                
                if (!this.user) {
                    console.log('🔐 Still no authenticated user, redirecting to home');
                    window.location.href = 'index.html';
                    return;
                }
            }

            console.log('👤 Authenticated user found:', this.user.displayName || this.user.email);

            // Get Firestore instance if available
            if (window.authManager.isFirebaseAvailable()) {
                this.db = firebase.firestore();
                console.log('🔥 Using Firebase Firestore for data persistence');
            } else {
                console.log('📦 Using localStorage fallback for data persistence');
            }

            // Set up auth state change listener for future changes
            window.authManager.onAuthStateChange((user) => {
                if (!user) {
                    console.log('🔐 User signed out, redirecting to home');
                    window.location.href = 'index.html';
                } else {
                    this.user = user;
                    this.loadUserData();
                }
            });

            this.setupDashboard();
            await this.loadUserData();
            this.isInitialized = true;
            
            // Remove loading indicator
            this.hideLoadingIndicator();
            
            console.log('✅ Dashboard fully initialized for user:', this.user.displayName || this.user.email);
            
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            window.location.href = 'index.html';
        }
    }

    // Wait for Firebase auth state to be determined
    async waitForAuthState() {
        console.log('🏠 Starting auth state wait...');
        return new Promise((resolve) => {
            if (window.authManager.isFirebaseAvailable()) {
                console.log('🏠 Firebase available, checking auth state...');
                
                // Check if user is already available
                const currentUser = firebase.auth().currentUser;
                if (currentUser) {
                    console.log('🏠 User already available:', currentUser.email);
                    setTimeout(resolve, 100);
                    return;
                }
                
                // Wait for auth state change
                let resolved = false;
                const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    console.log('🏠 Auth state changed in waitForAuthState:', user ? user.email : 'no user');
                    if (!resolved) {
                        resolved = true;
                        unsubscribe();
                        // Give extra time for user document creation to complete
                        setTimeout(resolve, 1000); // Increased timeout
                    }
                });
                
                // Fallback timeout to prevent infinite waiting
                setTimeout(() => {
                    if (!resolved) {
                        console.log('🏠 Auth state wait timed out');
                        resolved = true;
                        unsubscribe();
                        resolve();
                    }
                }, 8000); // Increased timeout
            } else {
                console.log('🏠 Firebase not available, using demo mode');
                // For demo mode, resolve immediately
                resolve();
            }
        });
    }

    // Hide loading indicator
    hideLoadingIndicator() {
        const loadingDiv = document.getElementById('auth-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
        const container = document.querySelector('.container');
        if (container) {
            container.style.opacity = '1';
        }
    }

    // Setup dashboard UI
    setupDashboard() {
        const userNameEl = document.getElementById('userName');
        if (userNameEl && this.user) {
            userNameEl.textContent = this.user.displayName || 'User';
        }

        const userDescEl = document.getElementById('userDescription');
        if (userDescEl && this.user) {
            if (this.user.userType === 'professional') {
                userDescEl.textContent = 'Your professional property analysis toolkit';
                const professionalTools = document.getElementById('professionalTools');
                if (professionalTools) {
                    professionalTools.style.display = 'block';
                }
            } else {
                userDescEl.textContent = 'Your property investment command center';
            }
        }
    }

    // Load user data from Firestore or localStorage
    async loadUserData() {
        try {
            if (this.db) {
                await this.loadFromFirestore();
            } else {
                this.loadFromLocalStorage();
            }
            
            this.updateDashboardStats();
            this.renderSavedCalculations();
            
        } catch (error) {
            console.error('🏠 Error loading user data:', error);
            this.showError('Failed to load your data. Please try refreshing the page.');
        }
    }

    // Load calculations from Firestore
    async loadFromFirestore() {
        if (!this.db || !this.user) return;

        try {
            // Set up real-time listener for calculations
            const calculationsRef = this.db
                .collection('calculations')
                .where('userId', '==', this.user.uid)
                .orderBy('createdAt', 'desc');

            const unsubscribe = calculationsRef.onSnapshot((snapshot) => {
                this.calculations = [];
                snapshot.forEach((doc) => {
                    this.calculations.push({
                        id: doc.id,
                        ...doc.data(),
                        lastModified: doc.data().updatedAt?.toDate?.() || new Date()
                    });
                });
                
                console.log('🔥 Loaded', this.calculations.length, 'calculations from Firestore');
                this.updateDashboardStats();
                this.renderSavedCalculations();
            });

            this.unsubscribers.push(unsubscribe);

        } catch (error) {
            console.error('🔥 Error loading from Firestore:', error);
            // Fallback to localStorage
            this.loadFromLocalStorage();
        }
    }

    // Load calculations from localStorage (fallback)
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(`investquest-calculations-${this.user.uid}`);
            this.calculations = stored ? JSON.parse(stored) : [];
            console.log('📦 Loaded', this.calculations.length, 'calculations from localStorage');
        } catch (error) {
            console.error('📦 Error loading from localStorage:', error);
            this.calculations = [];
        }
    }

    // Save calculation to Firestore or localStorage
    async saveCalculation(calculationData) {
        if (!this.user) {
            throw new Error('User not authenticated');
        }

        const calculation = {
            userId: this.user.uid,
            data: calculationData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            if (this.db) {
                // Save to Firestore
                const docRef = await this.db.collection('calculations').add(calculation);
                console.log('🔥 Calculation saved to Firestore:', docRef.id);
                
                // Track the save event
                this.trackEvent('calculation_saved', {
                    property_price: calculationData.purchasePrice,
                    rental_income: calculationData.rentalIncome,
                    user_type: this.user.userType
                });
                
                return docRef.id;
            } else {
                // Fallback to localStorage
                calculation.id = 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                this.calculations.push(calculation);
                this.saveCalculationsToStorage();
                console.log('📦 Calculation saved to localStorage:', calculation.id);
                return calculation.id;
            }
        } catch (error) {
            console.error('🏠 Error saving calculation:', error);
            throw error;
        }
    }

    // Delete calculation
    async deleteCalculation(calcId) {
        try {
            if (this.db) {
                // Delete from Firestore
                await this.db.collection('calculations').doc(calcId).delete();
                console.log('🔥 Calculation deleted from Firestore:', calcId);
                
                this.trackEvent('calculation_deleted');
            } else {
                // Delete from localStorage
                this.calculations = this.calculations.filter(calc => calc.id !== calcId);
                this.saveCalculationsToStorage();
                this.updateDashboardStats();
                this.renderSavedCalculations();
                console.log('📦 Calculation deleted from localStorage:', calcId);
            }
        } catch (error) {
            console.error('🏠 Error deleting calculation:', error);
            throw error;
        }
    }

    // Save calculations to localStorage (fallback)
    saveCalculationsToStorage() {
        try {
            localStorage.setItem(
                `investquest-calculations-${this.user.uid}`, 
                JSON.stringify(this.calculations)
            );
        } catch (error) {
            console.error('📦 Error saving to localStorage:', error);
        }
    }

    // Update dashboard statistics
    updateDashboardStats() {
        const totalPropertiesEl = document.getElementById('totalProperties');
        const totalInvestmentEl = document.getElementById('totalInvestment');
        const averageReturnEl = document.getElementById('averageReturn');
        const lastActivityEl = document.getElementById('lastActivity');

        if (totalPropertiesEl) {
            totalPropertiesEl.textContent = this.calculations.length.toString();
        }

        if (this.calculations.length > 0) {
            // Calculate total investment value
            const totalInvestment = this.calculations.reduce((sum, calc) => {
                return sum + (calc.data?.purchasePrice || 0);
            }, 0);

            if (totalInvestmentEl) {
                totalInvestmentEl.textContent = this.formatCurrency(totalInvestment);
            }

            // Calculate average return
            const avgReturn = this.calculations.reduce((sum, calc) => {
                const propertyGrowth = calc.data?.propertyGrowth || 6;
                const rentalYield = calc.data?.rentalIncome 
                    ? (calc.data.rentalIncome * 52 / calc.data.purchasePrice) * 100 
                    : 4;
                return sum + propertyGrowth + rentalYield;
            }, 0) / this.calculations.length;

            if (averageReturnEl) {
                averageReturnEl.textContent = `${avgReturn.toFixed(1)}%`;
            }

            // Last activity
            const lastCalc = [...this.calculations].sort((a, b) => 
                new Date(b.lastModified) - new Date(a.lastModified)
            )[0];

            if (lastActivityEl && lastCalc) {
                const lastDate = new Date(lastCalc.lastModified);
                lastActivityEl.textContent = this.formatRelativeTime(lastDate);
            }
        } else {
            // No calculations yet
            if (totalInvestmentEl) totalInvestmentEl.textContent = '$0';
            if (averageReturnEl) averageReturnEl.textContent = '0%';
            if (lastActivityEl) lastActivityEl.textContent = 'Never';
        }
    }

    // Render saved calculations
    renderSavedCalculations() {
        const container = document.getElementById('calculationsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.calculations.length === 0) {
            container.innerHTML = `
                <div class="calculations-empty">
                    <div class="empty-icon">📊</div>
                    <h3>No Saved Calculations Yet</h3>
                    <p>Start by analyzing your first property investment to see it saved here.</p>
                    <a href="calculator.html" class="cta-primary">Create Your First Analysis</a>
                </div>
            `;
            return;
        }

        const sortedCalculations = [...this.calculations].sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );

        const calculationsHTML = sortedCalculations.map(calc => {
            const data = calc.data || {};
            const address = data.address || 'Unknown Address';
            const purchasePrice = this.formatCurrency(data.purchasePrice || 0);
            const rentalIncome = data.rentalIncome ? `$${data.rentalIncome}/week` : 'No rental data';
            const lastModified = this.formatRelativeTime(new Date(calc.lastModified));

            return `
                <div class="calculation-card" data-calc-id="${calc.id}">
                    <div class="calculation-header">
                        <h3>${address}</h3>
                        <div class="calculation-actions">
                            <button class="load-btn" data-calc-id="${calc.id}">Load</button>
                            <button class="delete-btn" data-calc-id="${calc.id}">×</button>
                        </div>
                    </div>
                    <div class="calculation-details">
                        <div class="detail-item">
                            <span class="detail-label">Purchase Price:</span>
                            <span class="detail-value">${purchasePrice}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Rental Income:</span>
                            <span class="detail-value">${rentalIncome}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Last Modified:</span>
                            <span class="detail-value">${lastModified}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="calculations-grid">
                ${calculationsHTML}
            </div>
        `;

        this.setupCalculationCardListeners();
    }

    // Setup event listeners for calculation cards
    setupCalculationCardListeners() {
        document.querySelectorAll('.load-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const calcId = e.target.dataset.calcId;
                this.loadCalculation(calcId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const calcId = e.target.dataset.calcId;
                this.confirmDeleteCalculation(calcId);
            });
        });
    }

    // Load a specific calculation
    loadCalculation(calcId) {
        const calculation = this.calculations.find(calc => calc.id === calcId);
        if (!calculation) return;

        sessionStorage.setItem('loadCalculation', JSON.stringify(calculation.data));
        
        // Track load event
        this.trackEvent('calculation_loaded');
        
        window.location.href = 'calculator.html';
    }

    // Confirm and delete calculation
    async confirmDeleteCalculation(calcId) {
        const calculation = this.calculations.find(calc => calc.id === calcId);
        if (!calculation) return;

        const address = calculation.data?.address || 'this calculation';
        if (confirm(`Are you sure you want to delete the analysis for ${address}?`)) {
            try {
                await this.deleteCalculation(calcId);
                this.showSuccess('Calculation deleted successfully');
            } catch (error) {
                this.showError('Failed to delete calculation: ' + error.message);
            }
        }
    }

    // Track analytics events
    trackEvent(eventName, parameters = {}) {
        try {
            if (window.authManager && typeof window.authManager.trackEvent === 'function') {
                window.authManager.trackEvent(eventName, {
                    ...parameters,
                    dashboard_action: true
                });
            }
        } catch (error) {
            console.warn('📊 Dashboard event tracking failed:', error);
        }
    }

    // Utility methods
    formatCurrency(amount) {
        if (amount === 0) return '$0';
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString('en-AU');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Cleanup listeners when page unloads
    cleanup() {
        this.unsubscribers.forEach(unsubscribe => {
            try {
                unsubscribe();
            } catch (error) {
                console.error('🏠 Error cleaning up listener:', error);
            }
        });
        this.unsubscribers = [];
    }
}

// Global dashboard manager instance
window.dashboardManager = new ProductionDashboardManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboardManager) {
        window.dashboardManager.cleanup();
    }
});

// Export for use in other files
window.ProductionDashboardManager = ProductionDashboardManager;

console.log('🏠 Production dashboard script loaded');