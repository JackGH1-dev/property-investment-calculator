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
        this.autocomplete = null;
        
        this.initEventListeners();
        this.initFieldStateHandling();
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Get all input fields for live calculation
        const inputFields = [
            'purchasePrice', 'deposit', 'rentalIncome', 'purchaseYear',
            'legalFees', 'buildingInspection', 'loanFees', 'otherUpfrontCosts',
            'insurance', 'maintenance', 'councilRates', 'propertyManagement', 'otherExpenses',
            'interestRate', 'loanTerm', 'propertyGrowth', 'rentalGrowth'
        ];

        // Add special handling for state and first home buyer changes
        const selectFields = ['state', 'isFirstHomeBuyer', 'repaymentType'];
        const checkboxFields = ['applyLMI'];
        const radioFields = ['inputType'];

        // Add live calculation listeners to all input fields
        inputFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('input', () => this.debouncedCalculation());
                element.addEventListener('change', () => this.debouncedCalculation());
            }
        });

        // Add listeners to select fields
        selectFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('change', () => {
                    if (fieldId === 'state' || fieldId === 'isFirstHomeBuyer') {
                        this.calculateStampDuty();
                    }
                    if (fieldId === 'repaymentType') {
                        this.updateRepaymentCalculations();
                    }
                    this.debouncedCalculation();
                });
            }
        });

        // Add listeners to checkbox fields
        checkboxFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('change', () => {
                    if (fieldId === 'applyLMI') {
                        this.calculateLMI();
                    }
                    this.debouncedCalculation();
                });
            }
        });

        // Add listeners to radio button fields and mode options
        const modeOptions = document.querySelectorAll('.mode-option');
        modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                this.updateModeSelector();
                this.toggleInputMode();
                this.updateLoanCalculations();
            });
        });

        // Auto-calculate specific functions (still needed for immediate UI updates)
        document.getElementById('purchasePrice').addEventListener('input', () => this.updateLoanCalculations());
        document.getElementById('deposit').addEventListener('input', () => this.updateLoanCalculations());
        
        // Auto-calculate total upfront costs (only for manual fields)
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
        this.updateModeSelector(); // Set initial visual state
        this.toggleInputMode(); // Set initial UI state
        this.updateLoanCalculations();
    }

    initFieldStateHandling() {
        // Simplified - we only need the red asterisks which are handled by CSS
        // The "required" class is already added to labels in HTML
    }

    updateModeSelector() {
        const selectedMode = document.querySelector('input[name="inputType"]:checked').value;
        const modeOptions = document.querySelectorAll('.mode-option');
        
        modeOptions.forEach(option => {
            const mode = option.dataset.mode;
            if (mode === selectedMode) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    toggleInputMode() {
        const selectedMode = document.querySelector('input[name="inputType"]:checked').value;
        const depositField = document.getElementById('deposit');
        const depositLabel = document.getElementById('depositLabel');
        const calculatedField = document.getElementById('calculatedAmount');
        const calculatedLabel = calculatedField.previousElementSibling;

        if (selectedMode === 'deposit') {
            // Deposit input mode
            depositLabel.textContent = 'Deposit ($)';
            depositField.placeholder = 'e.g. 150000';
            depositField.readOnly = false;
            depositField.style.backgroundColor = '';
            depositField.style.color = '';
            
            calculatedLabel.textContent = 'Loan Amount ($)';
            calculatedField.readOnly = true;
            calculatedField.style.backgroundColor = '#f8f9fa';
            calculatedField.style.color = '#6c757d';
        } else {
            // Loan amount input mode
            depositLabel.textContent = 'Loan Amount ($)';
            depositField.placeholder = 'e.g. 600000';
            depositField.readOnly = false;
            depositField.style.backgroundColor = '';
            depositField.style.color = '';
            
            calculatedLabel.textContent = 'Deposit ($)';
            calculatedField.readOnly = true;
            calculatedField.style.backgroundColor = '#f8f9fa';
            calculatedField.style.color = '#6c757d';
        }
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
        // Handle the flexible deposit/loan input
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const inputValue = parseFloat(document.getElementById('deposit').value) || 0;
        const selectedMode = document.querySelector('input[name="inputType"]:checked').value;
        
        let deposit;
        if (selectedMode === 'deposit') {
            deposit = inputValue;
        } else {
            deposit = Math.max(0, purchasePrice - inputValue);
        }
        
        return {
            address: document.getElementById('address').value,
            state: document.getElementById('state').value,
            isFirstHomeBuyer: document.getElementById('isFirstHomeBuyer').value === 'true',
            applyLMI: document.getElementById('applyLMI').checked,
            purchasePrice: purchasePrice,
            deposit: deposit,
            rentalIncome: parseFloat(document.getElementById('rentalIncome').value),
            purchaseYear: parseInt(document.getElementById('purchaseYear').value),
            insurance: parseFloat(document.getElementById('insurance').value) || 1500,
            maintenance: parseFloat(document.getElementById('maintenance').value) || 2000,
            councilRates: parseFloat(document.getElementById('councilRates').value) || 0,
            propertyManagement: parseFloat(document.getElementById('propertyManagement').value) || 7,
            otherExpenses: parseFloat(document.getElementById('otherExpenses').value) || 0,
            stampDuty: parseFloat(document.getElementById('stampDuty').value) || 0,
            lmi: parseFloat(document.getElementById('lmi').value) || 0,
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
        const lmi = parseFloat(document.getElementById('lmi').value) || 0;
        const legalFees = parseFloat(document.getElementById('legalFees').value) || 0;
        const buildingInspection = parseFloat(document.getElementById('buildingInspection').value) || 0;
        const loanFees = parseFloat(document.getElementById('loanFees').value) || 0;
        const otherUpfrontCosts = parseFloat(document.getElementById('otherUpfrontCosts').value) || 0;
        
        const totalUpfrontCosts = stampDuty + lmi + legalFees + buildingInspection + loanFees + otherUpfrontCosts;
        document.getElementById('totalUpfrontCosts').value = totalUpfrontCosts;
    }

    updateLoanCalculations() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const inputValue = parseFloat(document.getElementById('deposit').value) || 0;
        const selectedMode = document.querySelector('input[name="inputType"]:checked').value;
        
        let deposit, loanAmount;
        
        if (selectedMode === 'deposit') {
            // User entered deposit amount
            deposit = inputValue;
            loanAmount = Math.max(0, purchasePrice - deposit);
            document.getElementById('calculatedAmount').value = loanAmount;
        } else {
            // User entered loan amount
            loanAmount = inputValue;
            deposit = Math.max(0, purchasePrice - loanAmount);
            document.getElementById('calculatedAmount').value = deposit;
        }
        
        // Update the main loan amount field used by other calculations
        document.getElementById('loanAmount').value = loanAmount;
        
        // Calculate LMI and Stamp Duty (using actual deposit for LMI calculation)
        this.calculateLMIWithValues(purchasePrice, deposit);
        this.calculateStampDuty();
        
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

    // Google Places API Integration
    initGooglePlaces() {
        if (!window.google || !window.google.maps) {
            console.warn('Google Maps API not loaded');
            return;
        }

        const addressInput = document.getElementById('address');
        
        // Use legacy Autocomplete for consistent styling
        this.autocomplete = new google.maps.places.Autocomplete(addressInput, {
            componentRestrictions: { country: 'au' },
            types: ['address']
        });

        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            this.extractStateFromPlace(place);
        });
    }

    extractStateFromPlace(place) {
        if (!place.address_components) {
            return;
        }

        let state = '';
        
        // Look for state in address components
        place.address_components.forEach(component => {
            if (component.types.includes('administrative_area_level_1')) {
                const longName = component.long_name;
                const shortName = component.short_name;
                
                // Map full state names to abbreviations
                const stateMapping = {
                    'New South Wales': 'NSW',
                    'Victoria': 'VIC',
                    'Queensland': 'QLD',
                    'South Australia': 'SA',
                    'Western Australia': 'WA',
                    'Tasmania': 'TAS',
                    'Northern Territory': 'NT',
                    'Australian Capital Territory': 'ACT'
                };
                
                state = stateMapping[longName] || shortName || longName;
            }
        });

        if (state) {
            document.getElementById('state').value = state;
            // Trigger stamp duty calculation
            this.calculateStampDuty();
            this.debouncedCalculation();
        }
    }

    // Australian Stamp Duty Calculator
    calculateStampDuty() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const state = document.getElementById('state').value;
        const isFirstHomeBuyer = document.getElementById('isFirstHomeBuyer').value === 'true';
        
        if (!purchasePrice || !state) {
            document.getElementById('stampDuty').value = 0;
            this.updateUpfrontCosts();
            return;
        }

        let stampDuty = 0;

        switch (state) {
            case 'NSW':
                stampDuty = this.calculateNSWStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
            case 'VIC':
                stampDuty = this.calculateVICStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
            case 'QLD':
                stampDuty = this.calculateQLDStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
            case 'SA':
                stampDuty = this.calculateSAStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
            case 'WA':
                stampDuty = this.calculateWAStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
            case 'TAS':
                stampDuty = this.calculateTASStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
            case 'NT':
                stampDuty = this.calculateNTStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
            case 'ACT':
                stampDuty = this.calculateACTStampDuty(purchasePrice, isFirstHomeBuyer);
                break;
        }

        document.getElementById('stampDuty').value = Math.round(stampDuty);
        this.updateUpfrontCosts();
    }

    // NSW Stamp Duty Calculation
    calculateNSWStampDuty(price, isFirstHomeBuyer) {
        // First home buyer exemptions/concessions
        if (isFirstHomeBuyer) {
            if (price <= 650000) return 0; // Full exemption
            if (price <= 800000) {
                // Concessional rate for $650k-$800k
                return ((price - 650000) / 150000) * this.calculateNSWStampDuty(price, false);
            }
        }

        // Standard NSW rates (2025)
        if (price <= 14000) return price * 0.0125;
        if (price <= 32000) return 175 + (price - 14000) * 0.015;
        if (price <= 85000) return 445 + (price - 32000) * 0.0175;
        if (price <= 319000) return 1372.50 + (price - 85000) * 0.035;
        if (price <= 1064000) return 9562.50 + (price - 319000) * 0.045;
        return 43087.50 + (price - 1064000) * 0.055;
    }

    // Victoria Stamp Duty Calculation
    calculateVICStampDuty(price, isFirstHomeBuyer) {
        // First home buyer exemptions
        if (isFirstHomeBuyer) {
            if (price <= 600000) return 0;
            if (price <= 750000) {
                // Concessional rate
                return ((price - 600000) / 150000) * this.calculateVICStampDuty(price, false);
            }
        }

        // Standard VIC rates
        if (price <= 25000) return price * 0.014;
        if (price <= 130000) return 350 + (price - 25000) * 0.024;
        if (price <= 960000) return 2870 + (price - 130000) * 0.06;
        return 52670 + (price - 960000) * 0.065;
    }

    // Queensland Stamp Duty Calculation
    calculateQLDStampDuty(price, isFirstHomeBuyer) {
        // First home buyer concessions
        if (isFirstHomeBuyer && price <= 550000) {
            return 0; // Full concession up to $550k
        }

        // Standard QLD rates
        if (price <= 5000) return 0;
        if (price <= 75000) return (price - 5000) * 0.015;
        if (price <= 540000) return 1050 + (price - 75000) * 0.035;
        if (price <= 1000000) return 17325 + (price - 540000) * 0.045;
        return 38025 + (price - 1000000) * 0.055;
    }

    // South Australia Stamp Duty
    calculateSAStampDuty(price, isFirstHomeBuyer) {
        if (isFirstHomeBuyer && price <= 500000) return 0;
        
        if (price <= 12000) return price * 0.01;
        if (price <= 30000) return 120 + (price - 12000) * 0.02;
        if (price <= 50000) return 480 + (price - 30000) * 0.03;
        if (price <= 100000) return 1080 + (price - 50000) * 0.04;
        if (price <= 200000) return 3080 + (price - 100000) * 0.05;
        if (price <= 250000) return 8080 + (price - 200000) * 0.055;
        if (price <= 300000) return 10830 + (price - 250000) * 0.06;
        if (price <= 500000) return 13830 + (price - 300000) * 0.065;
        return 26830 + (price - 500000) * 0.07;
    }

    // Western Australia Stamp Duty
    calculateWAStampDuty(price, isFirstHomeBuyer) {
        if (isFirstHomeBuyer && price <= 530000) return 0;
        
        if (price <= 120000) return price * 0.019;
        if (price <= 150000) return 2280 + (price - 120000) * 0.029;
        if (price <= 360000) return 3150 + (price - 150000) * 0.038;
        if (price <= 725000) return 11130 + (price - 360000) * 0.049;
        return 29015 + (price - 725000) * 0.051;
    }

    // Tasmania Stamp Duty
    calculateTASStampDuty(price, isFirstHomeBuyer) {
        if (isFirstHomeBuyer && price <= 400000) return 0;
        
        if (price <= 3000) return 50;
        if (price <= 25000) return 50 + (price - 3000) * 0.0175;
        if (price <= 75000) return 435 + (price - 25000) * 0.03;
        if (price <= 200000) return 1935 + (price - 75000) * 0.04;
        if (price <= 375000) return 6935 + (price - 200000) * 0.043;
        return 14460 + (price - 375000) * 0.045;
    }

    // Northern Territory Stamp Duty
    calculateNTStampDuty(price, isFirstHomeBuyer) {
        if (isFirstHomeBuyer && price <= 500000) return 0;
        
        if (price <= 25000) return 15 * Math.ceil(price / 100);
        if (price <= 100000) return 3750 + 35 * Math.ceil((price - 25000) / 100);
        if (price <= 200000) return 30000 + 40 * Math.ceil((price - 100000) / 100);
        if (price <= 500000) return 70000 + 50 * Math.ceil((price - 200000) / 100);
        return 220000 + 60 * Math.ceil((price - 500000) / 100);
    }

    // ACT Stamp Duty (being phased out, replaced by land tax)
    calculateACTStampDuty(price, isFirstHomeBuyer) {
        // ACT has largely abolished stamp duty, replaced with land tax
        // Minimal duty remains for some transfers
        return isFirstHomeBuyer ? 0 : Math.min(price * 0.001, 500);
    }

    // Lenders Mortgage Insurance Calculator
    calculateLMI() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const selectedMode = document.querySelector('input[name="inputType"]:checked').value;
        const inputValue = parseFloat(document.getElementById('deposit').value) || 0;
        
        let deposit;
        if (selectedMode === 'deposit') {
            deposit = inputValue;
        } else {
            deposit = Math.max(0, purchasePrice - inputValue);
        }
        
        this.calculateLMIWithValues(purchasePrice, deposit);
    }

    calculateLMIWithValues(purchasePrice, deposit) {
        const applyLMI = document.getElementById('applyLMI').checked;
        const loanAmount = purchasePrice - deposit;
        
        // If LMI checkbox is unchecked, set LMI to 0
        if (!applyLMI) {
            document.getElementById('lmi').value = 0;
            this.updateUpfrontCosts();
            return;
        }
        
        if (!purchasePrice || !deposit || loanAmount <= 0) {
            document.getElementById('lmi').value = 0;
            this.updateUpfrontCosts();
            return;
        }

        const loanToValueRatio = (loanAmount / purchasePrice) * 100;
        
        // LMI only applies when LVR > 80%
        if (loanToValueRatio <= 80) {
            document.getElementById('lmi').value = 0;
            this.updateUpfrontCosts();
            return;
        }

        // LMI calculation (approximation based on typical rates)
        let lmiRate = 0;
        
        if (loanToValueRatio <= 85) lmiRate = 0.0075;      // 0.75%
        else if (loanToValueRatio <= 90) lmiRate = 0.015;  // 1.5%
        else if (loanToValueRatio <= 95) lmiRate = 0.025;  // 2.5%
        else lmiRate = 0.035; // 3.5% for >95%

        const lmi = loanAmount * lmiRate;
        document.getElementById('lmi').value = Math.round(lmi);
        this.updateUpfrontCosts();
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
    window.propertyCalculator = new PropertyCalculator();
});