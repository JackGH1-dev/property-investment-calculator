// InvestQuest Dashboard Management
// Handles user data, saved calculations, and dashboard functionality

class DashboardManager {
    constructor() {
        this.calculations = [];
        this.user = null;
        this.isInitialized = false;
    }

    // Initialize dashboard when user is authenticated
    async init() {
        if (this.isInitialized) return;

        // Wait for auth manager to be ready
        if (!window.authManager) {
            setTimeout(() => this.init(), 100);
            return;
        }

        // Check if user is logged in
        await window.authManager.init();
        this.user = window.authManager.getCurrentUser();

        if (!this.user) {
            // Redirect to home if not authenticated
            window.location.href = 'index.html';
            return;
        }

        // Set up auth state listener
        window.authManager.onAuthStateChange((user) => {
            if (!user) {
                window.location.href = 'index.html';
            }
        });

        this.setupDashboard();
        await this.loadUserData();
        this.isInitialized = true;
    }

    // Setup dashboard UI based on user type
    setupDashboard() {
        // Update user name
        const userNameEl = document.getElementById('userName');
        if (userNameEl && this.user) {
            userNameEl.textContent = this.user.displayName || 'User';
        }

        // Update user description based on type
        const userDescEl = document.getElementById('userDescription');
        if (userDescEl && this.user) {
            if (this.user.userType === 'professional') {
                userDescEl.textContent = 'Your professional property analysis toolkit';
                // Show professional tools section
                const professionalTools = document.getElementById('professionalTools');
                if (professionalTools) {
                    professionalTools.style.display = 'block';
                }
            } else {
                userDescEl.textContent = 'Your property investment command center';
            }
        }
    }

    // Load user data and calculations
    async loadUserData() {
        try {
            // Load saved calculations
            this.calculations = this.loadCalculationsFromStorage();
            
            // Update dashboard stats
            this.updateDashboardStats();
            
            // Render saved calculations
            this.renderSavedCalculations();
            
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showError('Failed to load your data. Please try refreshing the page.');
        }
    }

    // Load calculations from local storage (or Firebase in the future)
    loadCalculationsFromStorage() {
        try {
            const stored = localStorage.getItem(`investquest-calculations-${this.user.uid}`);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error parsing stored calculations:', error);
            return [];
        }
    }

    // Save calculations to storage
    saveCalculationsToStorage() {
        try {
            localStorage.setItem(
                `investquest-calculations-${this.user.uid}`, 
                JSON.stringify(this.calculations)
            );
        } catch (error) {
            console.error('Error saving calculations:', error);
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

            // Calculate average return (simplified)
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
            const lastCalc = this.calculations.sort((a, b) => 
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

        // Clear loading state
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

        // Sort calculations by last modified
        const sortedCalculations = this.calculations.sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );

        // Render calculation cards
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

        // Add event listeners
        this.setupCalculationCardListeners();
    }

    // Setup event listeners for calculation cards
    setupCalculationCardListeners() {
        // Load calculation buttons
        document.querySelectorAll('.load-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const calcId = e.target.dataset.calcId;
                this.loadCalculation(calcId);
            });
        });

        // Delete calculation buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const calcId = e.target.dataset.calcId;
                this.deleteCalculation(calcId);
            });
        });
    }

    // Load a specific calculation
    loadCalculation(calcId) {
        const calculation = this.calculations.find(calc => calc.id === calcId);
        if (!calculation) return;

        // Store the calculation data for the calculator to load
        sessionStorage.setItem('loadCalculation', JSON.stringify(calculation.data));
        
        // Navigate to calculator
        window.location.href = 'calculator.html';
    }

    // Delete a calculation
    deleteCalculation(calcId) {
        const calculation = this.calculations.find(calc => calc.id === calcId);
        if (!calculation) return;

        const address = calculation.data?.address || 'this calculation';
        if (confirm(`Are you sure you want to delete the analysis for ${address}?`)) {
            this.calculations = this.calculations.filter(calc => calc.id !== calcId);
            this.saveCalculationsToStorage();
            this.updateDashboardStats();
            this.renderSavedCalculations();
        }
    }

    // Save a new calculation (called from calculator page)
    saveCalculation(calculationData) {
        const calculation = {
            id: this.generateId(),
            data: calculationData,
            lastModified: new Date().toISOString(),
            userId: this.user.uid
        };

        // Check if updating existing calculation
        const existingIndex = this.calculations.findIndex(calc => 
            calc.data?.address === calculationData.address
        );

        if (existingIndex >= 0) {
            // Update existing
            this.calculations[existingIndex] = calculation;
        } else {
            // Add new
            this.calculations.push(calculation);
        }

        this.saveCalculationsToStorage();
        return calculation.id;
    }

    // Utility methods
    generateId() {
        return 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

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
        // Simple error display - could be enhanced with a proper toast system
        alert(message);
    }
}

// Global dashboard manager instance
window.dashboardManager = new DashboardManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager.init();
});

// Export for use in calculator
window.DashboardManager = DashboardManager;