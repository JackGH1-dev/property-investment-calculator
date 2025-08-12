// Australian Property Investment Calculator
class PropertyCalculator {
    constructor() {
        this.form = document.getElementById('propertyForm');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.chartsContainer = document.getElementById('chartsContainer');
        this.comparisonContainer = document.getElementById('comparisonContainer');
        
        this.valueChart = null;
        this.cashflowChart = null;
        this.calculationTimeout = null;
        this.hasMinimumData = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Get all input fields for live calculation
        const inputFields = [
            'purchasePrice', 'deposit', 'rentalIncome', 'purchaseYear',
            'stampDuty', 'legalFees', 'buildingInspection', 'loanFees', 'otherUpfrontCosts',
            'insurance', 'maintenance', 'councilRates', 'propertyManagement', 'otherExpenses',
            'interestRate', 'loanTerm', 'propertyGrowth', 'rentalGrowth'
        ];

        // Add live calculation listeners to all input fields
        inputFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('input', () => this.debouncedCalculation());
                element.addEventListener('change', () => this.debouncedCalculation());
            }
        });

        // Special handling for select elements
        document.getElementById('repaymentType').addEventListener('change', () => {
            this.updateRepaymentCalculations();
            this.debouncedCalculation();
        });

        // Auto-calculate specific functions (still needed for immediate UI updates)
        document.getElementById('purchasePrice').addEventListener('input', () => this.updateLoanCalculations());
        document.getElementById('deposit').addEventListener('input', () => this.updateLoanCalculations());
        
        // Auto-calculate total upfront costs
        document.getElementById('stampDuty').addEventListener('input', () => this.updateUpfrontCosts());
        document.getElementById('legalFees').addEventListener('input', () => this.updateUpfrontCosts());
        document.getElementById('buildingInspection').addEventListener('input', () => this.updateUpfrontCosts());
        document.getElementById('loanFees').addEventListener('input', () => this.updateUpfrontCosts());
        document.getElementById('otherUpfrontCosts').addEventListener('input', () => this.updateUpfrontCosts());
        
        // Auto-calculate repayments when loan details change
        document.getElementById('interestRate').addEventListener('input', () => this.updateRepaymentCalculations());
        document.getElementById('repaymentType').addEventListener('change', () => this.updateRepaymentCalculations());
        document.getElementById('loanTerm').addEventListener('input', () => this.updateRepaymentCalculations());
        
        // Initialize calculations
        this.updateUpfrontCosts();
        this.updateLoanCalculations();
    }

    debouncedCalculation() {
        // Clear existing timeout
        if (this.calculationTimeout) {
            clearTimeout(this.calculationTimeout);
        }

        // Check if we have minimum required data
        if (!this.hasMinimumRequiredData()) {
            this.showWelcomeMessage();
            return;
        }

        // Set new timeout for calculation (300ms delay)
        this.calculationTimeout = setTimeout(() => {
            this.calculateInvestment();
        }, 300);
    }

    hasMinimumRequiredData() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
        const deposit = parseFloat(document.getElementById('deposit').value);
        const rentalIncome = parseFloat(document.getElementById('rentalIncome').value);
        
        return purchasePrice > 0 && deposit > 0 && rentalIncome > 0;
    }

    showWelcomeMessage() {
        this.resultsContainer.innerHTML = `
            <div class="welcome-message">
                <p>👈 Enter your property details to see live 30-year investment projections</p>
                <small>Results update automatically as you type</small>
                <br><br>
                <small><strong>Required:</strong> Purchase Price, Deposit, and Rental Income</small>
            </div>
        `;
        this.chartsContainer.style.display = 'none';
        document.getElementById('leftComparisonContainer').style.display = 'none';
    }

    getFormData() {
        return {
            address: document.getElementById('address').value,
            purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
            deposit: parseFloat(document.getElementById('deposit').value),
            rentalIncome: parseFloat(document.getElementById('rentalIncome').value),
            purchaseYear: parseInt(document.getElementById('purchaseYear').value),
            insurance: parseFloat(document.getElementById('insurance').value) || 1500,
            maintenance: parseFloat(document.getElementById('maintenance').value) || 2000,
            councilRates: parseFloat(document.getElementById('councilRates').value) || 0,
            propertyManagement: parseFloat(document.getElementById('propertyManagement').value) || 7,
            otherExpenses: parseFloat(document.getElementById('otherExpenses').value) || 0,
            stampDuty: parseFloat(document.getElementById('stampDuty').value) || 0,
            legalFees: parseFloat(document.getElementById('legalFees').value) || 0,
            buildingInspection: parseFloat(document.getElementById('buildingInspection').value) || 0,
            loanFees: parseFloat(document.getElementById('loanFees').value) || 0,
            otherUpfrontCosts: parseFloat(document.getElementById('otherUpfrontCosts').value) || 0,
            totalUpfrontCosts: parseFloat(document.getElementById('totalUpfrontCosts').value) || 0,
            loanAmount: parseFloat(document.getElementById('loanAmount').value) || 0,
            interestRate: parseFloat(document.getElementById('interestRate').value) || 6.5,
            repaymentType: document.getElementById('repaymentType').value,
            loanTerm: parseInt(document.getElementById('loanTerm').value) || 30,
            propertyGrowth: parseFloat(document.getElementById('propertyGrowth').value) || 6,
            rentalGrowth: parseFloat(document.getElementById('rentalGrowth').value) || 3
        };
    }

    updateUpfrontCosts() {
        const stampDuty = parseFloat(document.getElementById('stampDuty').value) || 0;
        const legalFees = parseFloat(document.getElementById('legalFees').value) || 0;
        const buildingInspection = parseFloat(document.getElementById('buildingInspection').value) || 0;
        const loanFees = parseFloat(document.getElementById('loanFees').value) || 0;
        const otherUpfrontCosts = parseFloat(document.getElementById('otherUpfrontCosts').value) || 0;
        
        const totalUpfrontCosts = stampDuty + legalFees + buildingInspection + loanFees + otherUpfrontCosts;
        document.getElementById('totalUpfrontCosts').value = totalUpfrontCosts;
    }

    updateLoanCalculations() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const deposit = parseFloat(document.getElementById('deposit').value) || 0;
        const loanAmount = Math.max(0, purchasePrice - deposit);
        
        document.getElementById('loanAmount').value = loanAmount;
        this.updateRepaymentCalculations();
    }

    updateRepaymentCalculations() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 6.5;
        const repaymentType = document.getElementById('repaymentType').value;
        const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;

        if (loanAmount <= 0) {
            document.getElementById('monthlyRepayment').value = 0;
            document.getElementById('weeklyRepayment').value = 0;
            return;
        }

        let monthlyRepayment;
        
        if (repaymentType === 'interest-only') {
            // Interest only calculation
            monthlyRepayment = (loanAmount * (interestRate / 100)) / 12;
        } else {
            // Principal & Interest calculation
            monthlyRepayment = this.calculateMonthlyPayment(loanAmount, interestRate / 100, loanTerm);
        }

        const weeklyRepayment = (monthlyRepayment * 12) / 52;

        document.getElementById('monthlyRepayment').value = Math.round(monthlyRepayment);
        document.getElementById('weeklyRepayment').value = Math.round(weeklyRepayment);
    }

    calculateInvestment() {
        const data = this.getFormData();
        
        // Skip if missing required data
        if (!data.purchasePrice || !data.deposit || !data.rentalIncome) {
            this.showWelcomeMessage();
            return;
        }
        
        try {
            const projections = this.generateProjections(data);
            this.displayResults(data, projections);
        } catch (error) {
            console.error('Calculation error:', error);
            this.resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>⚠️ Error in calculations. Please check your inputs.</p>
                </div>
            `;
        }
    }

    generateProjections(data) {
        const projections = [];
        const years = 30;
        
        let currentPropertyValue = data.purchasePrice;
        let currentRentalIncome = data.rentalIncome * 52; // Convert weekly to annual
        
        // Calculate loan details
        const loanAmount = data.loanAmount;
        const interestRate = data.interestRate / 100;
        
        let monthlyPayment;
        if (data.repaymentType === 'interest-only') {
            monthlyPayment = (loanAmount * interestRate) / 12;
        } else {
            monthlyPayment = this.calculateMonthlyPayment(loanAmount, interestRate, data.loanTerm);
        }
        const annualLoanPayment = monthlyPayment * 12;
        
        for (let year = 0; year < years; year++) {
            // Calculate annual expenses
            const propertyManagementFee = currentRentalIncome * (data.propertyManagement / 100);
            const totalExpenses = data.insurance + data.maintenance + data.councilRates + 
                                propertyManagementFee + data.otherExpenses + annualLoanPayment;
            
            // Calculate cash flow
            const netCashFlow = currentRentalIncome - totalExpenses;
            
            // Calculate remaining loan balance
            let remainingBalance;
            if (data.repaymentType === 'interest-only') {
                remainingBalance = loanAmount; // Balance remains constant for interest-only
            } else {
                remainingBalance = this.calculateRemainingBalance(loanAmount, interestRate, year + 1, data.loanTerm);
            }
            
            // Calculate equity
            const equity = currentPropertyValue - remainingBalance;
            
            projections.push({
                year: data.purchaseYear + year,
                yearNumber: year + 1,
                propertyValue: currentPropertyValue,
                rentalIncome: currentRentalIncome,
                totalExpenses: totalExpenses,
                netCashFlow: netCashFlow,
                remainingBalance: Math.max(0, remainingBalance),
                equity: equity,
                cumulativeCashFlow: year === 0 ? netCashFlow : 
                    projections[year - 1].cumulativeCashFlow + netCashFlow
            });
            
            // Grow property value and rental income
            currentPropertyValue *= (1 + data.propertyGrowth / 100);
            currentRentalIncome *= (1 + data.rentalGrowth / 100);
        }
        
        return projections;
    }

    calculateMonthlyPayment(principal, annualRate, years) {
        const monthlyRate = annualRate / 12;
        const numPayments = years * 12;
        
        if (monthlyRate === 0) return principal / numPayments;
        
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
               (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    calculateRemainingBalance(principal, annualRate, yearsPaid, totalYears) {
        const monthlyRate = annualRate / 12;
        const totalPayments = totalYears * 12;
        const paymentsMade = yearsPaid * 12;
        
        if (paymentsMade >= totalPayments) return 0;
        
        const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, totalYears);
        
        let balance = principal;
        for (let i = 0; i < paymentsMade; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
        }
        
        return Math.max(0, balance);
    }

    displayResults(data, projections) {
        // Calculate summary statistics
        const finalYear = projections[projections.length - 1];
        const totalCashFlow = finalYear.cumulativeCashFlow;
        const totalInitialInvestment = data.deposit + data.totalUpfrontCosts;
        const totalReturn = finalYear.equity + totalCashFlow - totalInitialInvestment;
        const annualizedReturn = Math.pow((finalYear.equity + totalCashFlow) / totalInitialInvestment, 1/30) - 1;
        
        // Generate results HTML
        const monthlyRepayment = parseFloat(document.getElementById('monthlyRepayment').value);
        const resultsHTML = `
            <div class="investment-summary">
                <h4>Investment Summary</h4>
                <div class="investment-details">
                    <p><strong>Purchase Price:</strong> $${this.formatMoney(data.purchasePrice)}</p>
                    <p><strong>Deposit:</strong> $${this.formatMoney(data.deposit)}</p>
                    <p><strong>Upfront Costs:</strong> $${this.formatMoney(data.totalUpfrontCosts)}</p>
                    <p><strong>Total Initial Investment:</strong> $${this.formatMoney(data.deposit + data.totalUpfrontCosts)}</p>
                </div>
            </div>
            
            <div class="mortgage-summary">
                <h4>Mortgage Summary</h4>
                <div class="mortgage-details">
                    <p><strong>Loan Amount:</strong> $${this.formatMoney(data.loanAmount)}</p>
                    <p><strong>Interest Rate:</strong> ${data.interestRate}% p.a.</p>
                    <p><strong>Loan Term:</strong> ${data.loanTerm} years</p>
                    <p><strong>Repayment Type:</strong> ${data.repaymentType === 'interest-only' ? 'Interest Only' : 'Principal & Interest'}</p>
                    <p><strong>Monthly Repayment:</strong> $${this.formatMoney(monthlyRepayment)}</p>
                </div>
            </div>
            
            <div class="summary-cards">
                <div class="summary-card ${totalReturn > 0 ? 'positive' : 'negative'}">
                    <h3>Total Return</h3>
                    <div class="value">$${this.formatMoney(totalReturn)}</div>
                </div>
                <div class="summary-card">
                    <h3>Final Property Value</h3>
                    <div class="value">$${this.formatMoney(finalYear.propertyValue)}</div>
                </div>
                <div class="summary-card ${totalCashFlow > 0 ? 'positive' : 'negative'}">
                    <h3>Cumulative Cash Flow</h3>
                    <div class="value">$${this.formatMoney(totalCashFlow)}</div>
                </div>
                <div class="summary-card">
                    <h3>Annualized Return</h3>
                    <div class="value">${(annualizedReturn * 100).toFixed(1)}%</div>
                </div>
            </div>
            
            <div class="charts-container">
                <div class="chart-wrapper">
                    <h4>Property Value Growth</h4>
                    <canvas id="valueChart" width="400" height="200"></canvas>
                </div>
                <div class="chart-wrapper">
                    <h4>Annual Cash Flow</h4>
                    <canvas id="cashflowChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Property Value</th>
                        <th>Rental Income</th>
                        <th>Net Cash Flow</th>
                        <th>Equity</th>
                    </tr>
                </thead>
                <tbody>
                    ${projections.filter((_, index) => index % 5 === 0 || index === projections.length - 1)
                        .map(proj => `
                        <tr>
                            <td>${proj.year}</td>
                            <td>$${this.formatMoney(proj.propertyValue)}</td>
                            <td>$${this.formatMoney(proj.rentalIncome)}</td>
                            <td class="${proj.netCashFlow >= 0 ? 'positive' : 'negative'}">
                                $${this.formatMoney(proj.netCashFlow)}
                            </td>
                            <td>$${this.formatMoney(proj.equity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        this.resultsContainer.innerHTML = resultsHTML;
        
        // Create charts
        this.createCharts(projections);
        
        // Show left panel comparison
        this.showLeftComparison(data, totalReturn, annualizedReturn);
        
        // Show results sections
        this.chartsContainer.style.display = 'block';
        document.getElementById('leftComparisonContainer').style.display = 'block';
    }

    createCharts(projections) {
        const years = projections.map(p => p.year);
        const propertyValues = projections.map(p => p.propertyValue);
        const cashFlows = projections.map(p => p.netCashFlow);
        
        // Destroy existing charts
        if (this.valueChart) this.valueChart.destroy();
        if (this.cashflowChart) this.cashflowChart.destroy();
        
        // Property Value Chart
        const valueCtx = document.getElementById('valueChart').getContext('2d');
        this.valueChart = new Chart(valueCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Property Value',
                    data: propertyValues,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        
        // Cash Flow Chart
        const cashflowCtx = document.getElementById('cashflowChart').getContext('2d');
        this.cashflowChart = new Chart(cashflowCtx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Annual Cash Flow',
                    data: cashFlows,
                    backgroundColor: cashFlows.map(cf => cf >= 0 ? 'rgba(40, 167, 69, 0.6)' : 'rgba(220, 53, 69, 0.6)'),
                    borderColor: cashFlows.map(cf => cf >= 0 ? '#28a745' : '#dc3545'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }


    showLeftComparison(data, propertyReturn, propertyAnnualizedReturn) {
        const initialInvestment = data.deposit + data.totalUpfrontCosts;
        
        // High yield savings (4.5% p.a.)
        const savingsReturn = initialInvestment * Math.pow(1.045, 30) - initialInvestment;
        
        // ASX200 (8% p.a.)
        const asxReturn = initialInvestment * Math.pow(1.08, 30) - initialInvestment;
        
        // Update left panel comparison
        document.getElementById('leftPropertyReturn').textContent = 
            `$${this.formatMoney(propertyReturn)}`;
        document.getElementById('leftPropertyDetails').textContent = 
            `${(propertyAnnualizedReturn * 100).toFixed(1)}% annual return`;
        document.getElementById('leftSavingsReturn').textContent = 
            `$${this.formatMoney(savingsReturn)}`;
        document.getElementById('leftAsxReturn').textContent = 
            `$${this.formatMoney(asxReturn)}`;
    }

    formatMoney(amount) {
        return new Intl.NumberFormat('en-AU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new PropertyCalculator();
});