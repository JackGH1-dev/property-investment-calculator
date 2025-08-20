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
        document.getElementById('loanAmount').addEventListener('input', () => this.updateFromLoanAmount());
        document.getElementById('loan100PlusCosts').addEventListener('change', () => this.handleLoan100PlusCosts());
        
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
        const loan100PlusCostsDiv = document.querySelector('.loan-100-plus-costs');

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
            
            // Hide the "Loan 100% + costs" option in deposit mode
            if (loan100PlusCostsDiv) {
                loan100PlusCostsDiv.style.display = 'none';
            }
            document.getElementById('loan100PlusCosts').checked = false;
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
            
            // Show the "Loan 100% + costs" option in loan mode
            if (loan100PlusCostsDiv) {
                loan100PlusCostsDiv.style.display = 'block';
            }
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
        // Handle the flexible deposit/loan input including 100%+ financing
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const inputValue = parseFloat(document.getElementById('deposit').value) || 0;
        const selectedMode = document.querySelector('input[name="inputType"]:checked').value;
        
        let deposit, actualLoanAmount;
        if (selectedMode === 'deposit') {
            deposit = inputValue;
            actualLoanAmount = purchasePrice - deposit;
        } else {
            actualLoanAmount = inputValue;
            deposit = purchasePrice - actualLoanAmount;
        }
        
        // For calculations, use effective deposit (minimum 0) but allow actual loan amount
        const effectiveDeposit = Math.max(0, deposit);
        
        return {
            address: document.getElementById('address').value,
            state: document.getElementById('state').value,
            isFirstHomeBuyer: document.getElementById('isFirstHomeBuyer').value === 'true',
            applyLMI: document.getElementById('applyLMI').checked,
            purchasePrice: purchasePrice,
            deposit: effectiveDeposit,
            actualLoanAmount: Math.max(0, actualLoanAmount),
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
            // User entered deposit amount (can be negative for 100%+ financing)
            deposit = inputValue;
            loanAmount = purchasePrice - deposit;
            document.getElementById('calculatedAmount').value = Math.max(0, loanAmount);
        } else {
            // User entered loan amount (can exceed purchase price)
            loanAmount = inputValue;
            deposit = purchasePrice - loanAmount;
            // Show negative deposit as $0 in display, but keep actual value for calculations
            document.getElementById('calculatedAmount').value = Math.max(0, deposit);
        }
        
        // Update the main loan amount field used by other calculations
        document.getElementById('loanAmount').value = Math.max(0, loanAmount);
        
        // Calculate LMI and Stamp Duty (using effective deposit for LMI calculation)
        const effectiveDeposit = Math.max(0, deposit);
        this.calculateLMIWithValues(purchasePrice, effectiveDeposit);
        this.calculateStampDuty();
        
        this.updateRepaymentCalculations();
    }

    updateFromLoanAmount() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        
        // Calculate deposit from loan amount
        const deposit = purchasePrice - loanAmount;
        
        // Update the deposit field and calculated amount field
        document.getElementById('deposit').value = deposit;
        
        // Determine which mode we should be in and update accordingly
        const selectedMode = document.querySelector('input[name="inputType"]:checked').value;
        
        if (selectedMode === 'deposit') {
            // If in deposit mode, update the calculated amount to show loan amount
            document.getElementById('calculatedAmount').value = Math.max(0, loanAmount);
        } else {
            // If in loan mode, update the calculated amount to show deposit
            document.getElementById('calculatedAmount').value = Math.max(0, deposit);
        }
        
        // Calculate LMI and Stamp Duty
        const effectiveDeposit = Math.max(0, deposit);
        this.calculateLMIWithValues(purchasePrice, effectiveDeposit);
        this.calculateStampDuty();
        
        this.updateRepaymentCalculations();
        this.debouncedCalculation();
    }

    handleLoan100PlusCosts() {
        const isChecked = document.getElementById('loan100PlusCosts').checked;
        
        if (isChecked) {
            // First ensure all upfront costs are calculated
            this.calculateStampDuty();
            this.calculateLMIWithValues(parseFloat(document.getElementById('purchasePrice').value) || 0, 0); // Calculate LMI for 0% deposit
            this.updateUpfrontCosts();
            
            // Calculate purchase price + ALL upfront costs
            const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
            const stampDuty = parseFloat(document.getElementById('stampDuty').value) || 0;
            const lmi = parseFloat(document.getElementById('lmi').value) || 0;
            const legalFees = parseFloat(document.getElementById('legalFees').value) || 0;
            const buildingInspection = parseFloat(document.getElementById('buildingInspection').value) || 0;
            const loanFees = parseFloat(document.getElementById('loanFees').value) || 0;
            const otherUpfrontCosts = parseFloat(document.getElementById('otherUpfrontCosts').value) || 0;
            
            // Total all upfront costs
            const totalUpfrontCosts = stampDuty + lmi + legalFees + buildingInspection + loanFees + otherUpfrontCosts;
            
            // Total loan amount = purchase price + all upfront costs
            const totalLoanAmount = purchasePrice + totalUpfrontCosts;
            
            // Set the loan amount field
            document.getElementById('deposit').value = totalLoanAmount;
            
            // This will result in a negative deposit (100%+ financing)
            const deposit = purchasePrice - totalLoanAmount; // This will be negative
            document.getElementById('calculatedAmount').value = deposit;
            
            // Update the main loan amount field
            document.getElementById('loanAmount').value = totalLoanAmount;
            
            // Update the total upfront costs display
            document.getElementById('totalUpfrontCosts').value = totalUpfrontCosts;
            
            // Recalculate repayments with the new loan amount
            this.updateRepaymentCalculations();
            this.debouncedCalculation();
        }
        // If unchecked, user can manually adjust the loan amount
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
        
        // Skip if missing required data (deposit can be 0 for 100%+ financing)
        if (!data.purchasePrice || !data.rentalIncome || (!data.actualLoanAmount && !data.loanAmount)) {
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
        
        // Calculate loan details - use actual loan amount for 100%+ financing
        const loanAmount = data.actualLoanAmount || data.loanAmount;
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
        
        // Generate and show insights
        this.showInvestmentInsights(data, projections, totalReturn, annualizedReturn);
        
        // Show results sections
        this.chartsContainer.style.display = 'block';
        document.getElementById('leftComparisonContainer').style.display = 'block';
        document.getElementById('insightsContainer').style.display = 'block';
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

    showInvestmentInsights(data, projections, totalReturn, annualizedReturn) {
        const insights = this.generateInvestmentInsights(data, projections, totalReturn, annualizedReturn);
        
        const insightsHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <span class="insight-icon">${insight.icon}</span>
                <span class="insight-text">${insight.message}</span>
            </div>
        `).join('');
        
        document.getElementById('insightsContent').innerHTML = insightsHTML;
    }

    generateInvestmentInsights(data, projections, totalReturn, annualizedReturn) {
        const insights = [];
        const finalYear = projections[projections.length - 1];
        const initialInvestment = data.deposit + data.totalUpfrontCosts;
        const loanToValueRatio = (data.actualLoanAmount / data.purchasePrice) * 100;
        const rentalYield = (data.rentalIncome * 52 / data.purchasePrice) * 100;
        const firstYearCashFlow = projections[0].netCashFlow;
        const breakEvenYear = projections.findIndex(p => p.cumulativeCashFlow > 0);
        
        // High yield savings comparison
        const savingsReturn = initialInvestment * Math.pow(1.045, 30) - initialInvestment;
        const asxReturn = initialInvestment * Math.pow(1.08, 30) - initialInvestment;
        
        // 1. Investment Performance vs Alternatives
        if (totalReturn > asxReturn) {
            insights.push({
                type: 'positive',
                icon: '🏆',
                message: `<strong>Higher Projected Returns:</strong> Based on these assumptions, this property investment shows $${this.formatMoney(totalReturn - asxReturn)} higher projected returns than ASX200 over 30 years.`
            });
        } else if (totalReturn > savingsReturn) {
            insights.push({
                type: 'info',
                icon: '📈',
                message: `<strong>Good Investment:</strong> This property beats high-yield savings by $${this.formatMoney(totalReturn - savingsReturn)} but underperforms ASX200 by $${this.formatMoney(asxReturn - totalReturn)}. Consider if you prefer property's stability over share market volatility.`
            });
        } else {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                message: `<strong>Consider Alternatives:</strong> This investment underperforms both ASX200 ($${this.formatMoney(asxReturn - totalReturn)} difference) and high-yield savings ($${this.formatMoney(savingsReturn - totalReturn)} difference). Look for better properties or reconsider your assumptions.`
            });
        }

        // 2. Cash Flow Analysis
        if (firstYearCashFlow >= 0) {
            insights.push({
                type: 'positive',
                icon: '💰',
                message: `<strong>Positive Cash Flow:</strong> This property generates $${this.formatMoney(firstYearCashFlow)} positive cash flow in year one. You'll receive money each year instead of paying out of pocket.`
            });
        } else {
            const weeklyOutOfPocket = Math.abs(firstYearCashFlow) / 52;
            if (weeklyOutOfPocket > 200) {
                insights.push({
                    type: 'negative',
                    icon: '💸',
                    message: `<strong>High Negative Cash Flow:</strong> You'll pay $${Math.round(weeklyOutOfPocket)} per week ($${this.formatMoney(Math.abs(firstYearCashFlow))} annually) out of pocket. Ensure this fits your budget comfortably.`
                });
            } else {
                insights.push({
                    type: 'warning',
                    icon: '💳',
                    message: `<strong>Manageable Negative Cash Flow:</strong> You'll contribute $${Math.round(weeklyOutOfPocket)} per week out of pocket. This is reasonable for building long-term wealth.`
                });
            }
        }

        // 3. Break-even Analysis
        if (breakEvenYear > 0 && breakEvenYear < 30) {
            insights.push({
                type: 'info',
                icon: '⚖️',
                message: `<strong>Cash Flow Break-Even:</strong> Your cumulative cash flow turns positive in year ${breakEvenYear + 1}. After this point, all previous negative cash flow is recovered and you start seeing net positive returns.`
            });
        }

        // 4. LVR and Risk Assessment
        if (loanToValueRatio > 95) {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                message: `<strong>Very High Leverage (${loanToValueRatio.toFixed(1)}% LVR):</strong> You're borrowing ${loanToValueRatio > 100 ? 'more than the property value' : 'with minimal deposit'}. This maximizes returns but significantly increases risk if property values fall.`
            });
        } else if (loanToValueRatio > 80) {
            insights.push({
                type: 'info',
                icon: '📊',
                message: `<strong>High Leverage (${loanToValueRatio.toFixed(1)}% LVR):</strong> Good balance of leverage for growth while maintaining manageable risk. Consider the LMI cost in your decision.`
            });
        } else {
            insights.push({
                type: 'positive',
                icon: '🛡️',
                message: `<strong>Conservative Leverage (${loanToValueRatio.toFixed(1)}% LVR):</strong> Lower risk approach with substantial equity buffer. You avoid LMI and have protection against market downturns.`
            });
        }

        // 5. Rental Yield Analysis
        if (rentalYield > 6) {
            insights.push({
                type: 'positive',
                icon: '🎯',
                message: `<strong>Excellent Rental Yield (${rentalYield.toFixed(1)}%):</strong> High rental return relative to purchase price. This property generates strong income and improves cash flow.`
            });
        } else if (rentalYield > 4) {
            insights.push({
                type: 'info',
                icon: '🏠',
                message: `<strong>Moderate Rental Yield (${rentalYield.toFixed(1)}%):</strong> Reasonable rental return. Focus on capital growth potential and location quality for long-term success.`
            });
        } else {
            insights.push({
                type: 'warning',
                icon: '📉',
                message: `<strong>Low Rental Yield (${rentalYield.toFixed(1)}%):</strong> Rental income is low relative to property price. Ensure strong capital growth prospects justify the investment.`
            });
        }

        // 6. Growth Rate Reality Check
        if (data.propertyGrowth > 8) {
            insights.push({
                type: 'warning',
                icon: '🔍',
                message: `<strong>Aggressive Growth Assumptions:</strong> ${data.propertyGrowth}% annual property growth is higher than historical Australian averages (6-7%). Consider more conservative estimates for realistic planning.`
            });
        }

        // 7. Final Equity and Wealth Creation
        const finalEquityPercentage = ((finalYear.equity / initialInvestment) - 1) * 100;
        if (finalEquityPercentage > 1000) {
            insights.push({
                type: 'positive',
                icon: '🚀',
                message: `<strong>Exceptional Wealth Creation:</strong> Your initial investment of $${this.formatMoney(initialInvestment)} grows to $${this.formatMoney(finalYear.equity)} in equity alone - a ${finalEquityPercentage.toFixed(0)}% increase over 30 years.`
            });
        }

        // 8. Interest Rate Sensitivity Warning
        if (data.repaymentType === 'interest-only') {
            insights.push({
                type: 'info',
                icon: '💡',
                message: `<strong>Interest-Only Strategy:</strong> You're maximizing cash flow with interest-only repayments. Remember you'll still owe the full loan amount after ${data.loanTerm} years unless you refinance or sell.`
            });
        }

        // 9. Tax Considerations
        if (firstYearCashFlow < 0) {
            insights.push({
                type: 'info',
                icon: '📋',
                message: `<strong>Tax Benefits Available:</strong> Negative gearing may provide tax deductions on your losses. Consult a tax professional to understand your specific benefits and obligations.`
            });
        }

        return insights;
    }

    // Save/Load Functionality for Authenticated Users
    async saveCalculation() {
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            // Show sign-in prompt for unauthenticated users
            this.showSavePrompt();
            return;
        }

        const data = this.getCalculationData();
        if (!data.address || !data.purchasePrice || !data.rentalIncome) {
            alert('Please fill in the required fields (Address, Purchase Price, and Rental Income) before saving.');
            return;
        }

        try {
            // Save directly to Firestore if authenticated and Firebase is available
            if (window.authManager && window.authManager.isAuthenticated() && firebase.firestore) {
                const user = window.authManager.getCurrentUser();
                const calculation = {
                    userId: user.uid,
                    data: data,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                // Save to Firestore
                const docRef = await firebase.firestore().collection('calculations').add(calculation);
                console.log('🔥 Calculation saved to Firestore:', docRef.id);
                this.showSaveSuccess();
                return docRef.id;
            } else if (window.dashboardManager) {
                const calculationId = window.dashboardManager.saveCalculation(data);
                this.showSaveSuccess();
                return calculationId;
            } else {
                // Fallback: save to localStorage temporarily
                const calculations = JSON.parse(localStorage.getItem('temp-calculations') || '[]');
                const calculation = {
                    id: 'temp_' + Date.now(),
                    data: data,
                    lastModified: new Date().toISOString()
                };
                calculations.push(calculation);
                localStorage.setItem('temp-calculations', JSON.stringify(calculations));
                this.showSaveSuccess();
                return calculation.id;
            }
        } catch (error) {
            console.error('🚨 Error saving calculation:', error);
            console.error('🚨 Error details:', {
                message: error.message,
                code: error.code,
                authManager: !!window.authManager,
                isAuthenticated: window.authManager ? window.authManager.isAuthenticated() : false,
                firebaseAvailable: !!firebase,
                firestoreAvailable: !!(firebase && firebase.firestore)
            });
            
            // Try localStorage fallback
            try {
                console.log('📦 Attempting localStorage fallback...');
                const calculations = JSON.parse(localStorage.getItem('temp-calculations') || '[]');
                const calculation = {
                    id: 'temp_' + Date.now(),
                    data: data,
                    lastModified: new Date().toISOString()
                };
                calculations.push(calculation);
                localStorage.setItem('temp-calculations', JSON.stringify(calculations));
                console.log('📦 Saved to localStorage successfully');
                alert('Saved to local storage! Your calculation will be available on this device. Sign in and save again to sync across devices.');
                return calculation.id;
            } catch (localError) {
                console.error('📦 localStorage fallback also failed:', localError);
                alert('Failed to save calculation. Please try again.');
            }
        }
    }

    loadCalculation(data) {
        if (!data) return;

        try {
            // Populate all form fields with saved data
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = data[key];
                    } else if (element.type === 'radio') {
                        const radio = document.querySelector(`input[name="${element.name}"][value="${data[key]}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        element.value = data[key] || '';
                    }
                }
            });

            // Trigger calculation updates
            this.updateLoanCalculations();
            this.calculateStampDuty();
            this.calculateLMI();
            this.updateUpfrontCosts();
            this.updateRepaymentCalculations();
            this.toggleInputMode();
            this.updateModeSelector();
            this.performCalculations();

            console.log('Calculation loaded successfully');
        } catch (error) {
            console.error('Error loading calculation:', error);
            alert('Failed to load calculation. Please try again.');
        }
    }

    getCalculationData() {
        const data = {};
        
        // Get all form field values
        const fields = [
            'address', 'state', 'isFirstHomeBuyer', 'purchasePrice', 'deposit', 
            'rentalIncome', 'purchaseYear', 'stampDuty', 'lmi', 'legalFees', 
            'buildingInspection', 'loanFees', 'otherUpfrontCosts', 'totalUpfrontCosts',
            'insurance', 'maintenance', 'councilRates', 'propertyManagement', 
            'otherExpenses', 'loanAmount', 'interestRate', 'repaymentType', 
            'loanTerm', 'monthlyRepayment', 'weeklyRepayment', 'propertyGrowth', 
            'rentalGrowth'
        ];

        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                if (element.type === 'checkbox') {
                    data[fieldId] = element.checked;
                } else if (element.type === 'number') {
                    data[fieldId] = parseFloat(element.value) || 0;
                } else {
                    data[fieldId] = element.value;
                }
            }
        });

        // Get radio button values
        const inputType = document.querySelector('input[name="inputType"]:checked');
        if (inputType) {
            data.inputType = inputType.value;
        }

        // Get checkbox values
        const applyLMI = document.getElementById('applyLMI');
        if (applyLMI) {
            data.applyLMI = applyLMI.checked;
        }

        const loan100PlusCosts = document.getElementById('loan100PlusCosts');
        if (loan100PlusCosts) {
            data.loan100PlusCosts = loan100PlusCosts.checked;
        }

        return data;
    }

    showSavePrompt() {
        if (window.AuthUI) {
            const customModal = document.createElement('div');
            customModal.className = 'auth-modal';
            customModal.innerHTML = `
                <div class="auth-modal-backdrop"></div>
                <div class="auth-modal-content">
                    <div class="auth-modal-header">
                        <h2>💾 Save Your Analysis</h2>
                        <button class="auth-modal-close">&times;</button>
                    </div>
                    <div class="auth-modal-body">
                        <p>Sign in to save your property calculations and access them from any device.</p>
                        
                        <button class="auth-google-btn" id="savePromptSignIn">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign In to Save
                        </button>
                        
                        <div class="auth-benefits">
                            <h4>✨ Why sign in?</h4>
                            <ul>
                                <li>💾 Save unlimited property calculations</li>
                                <li>📱 Access from any device</li>
                                <li>📊 Track your investment portfolio</li>
                                <li>🎯 Get personalized insights</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(customModal);
            
            // Event listeners
            customModal.querySelector('.auth-modal-close').onclick = () => customModal.remove();
            customModal.querySelector('.auth-modal-backdrop').onclick = () => customModal.remove();
            
            customModal.querySelector('#savePromptSignIn').onclick = async () => {
                try {
                    await window.authManager.signInWithGoogle();
                    customModal.remove();
                    // Auto-save after successful login
                    setTimeout(() => this.saveCalculation(), 500);
                } catch (error) {
                    console.error('Sign in failed:', error);
                    alert('Sign in failed. Please try again.');
                }
            };
        }
    }

    showSaveSuccess() {
        // Simple success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
        `;
        notification.textContent = '✅ Calculation saved successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Check for calculation to load on page load
    checkForLoadCalculation() {
        const loadData = sessionStorage.getItem('loadCalculation');
        if (loadData) {
            try {
                const data = JSON.parse(loadData);
                sessionStorage.removeItem('loadCalculation');
                setTimeout(() => {
                    this.loadCalculation(data);
                }, 500); // Small delay to ensure form is ready
            } catch (error) {
                console.error('Error loading calculation from session:', error);
            }
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.propertyCalculator = new PropertyCalculator();
    
    // Check for calculation to load after initialization
    setTimeout(() => {
        window.propertyCalculator.checkForLoadCalculation();
    }, 1000);
});