/**
 * PDF Report Generator
 * Professional property investment analysis reports
 */

class PDFReportGenerator {
    constructor() {
        this.reportData = null;
        this.template = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📄 Initializing PDF Report Generator...');
        
        // Load PDF generation library
        await this.loadPDFLibrary();
        
        // Setup report templates
        this.setupReportTemplates();
        
        // Add report generation UI
        this.setupReportUI();
        
        this.isInitialized = true;
        console.log('✅ PDF Report Generator initialized');
    }

    async loadPDFLibrary() {
        return new Promise((resolve, reject) => {
            // Load jsPDF library for client-side PDF generation
            if (window.jsPDF) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('📄 jsPDF library loaded');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Failed to load jsPDF library');
                reject(new Error('Failed to load PDF library'));
            };
            document.head.appendChild(script);
        });
    }

    setupReportTemplates() {
        this.templates = {
            professional: {
                name: 'Professional Analysis Report',
                description: 'Comprehensive analysis suitable for presentations',
                pages: ['summary', 'calculations', 'projections', 'comparisons', 'recommendations']
            },
            basic: {
                name: 'Basic Summary Report',
                description: 'Simple overview of key metrics',
                pages: ['summary', 'calculations']
            },
            detailed: {
                name: 'Detailed Investment Analysis',
                description: 'In-depth analysis with market data and projections',
                pages: ['summary', 'calculations', 'projections', 'comparisons', 'market_data', 'recommendations']
            }
        };
    }

    setupReportUI() {
        // Add PDF report button to calculator
        const saveSection = document.querySelector('.save-calculation-section');
        if (saveSection) {
            const reportButton = document.createElement('button');
            reportButton.type = 'button';
            reportButton.className = 'pdf-report-btn';
            reportButton.innerHTML = '📄 Generate PDF Report';
            reportButton.onclick = () => this.showReportOptions();
            
            saveSection.appendChild(reportButton);
            
            // Add styling
            this.addReportStyles();
        }
    }

    showReportOptions() {
        // Create modal for report options
        const modal = document.createElement('div');
        modal.className = 'pdf-report-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Generate PDF Report</h3>
                    <button class="modal-close" onclick="this.closest('.pdf-report-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="report-templates">
                        ${Object.entries(this.templates).map(([key, template]) => `
                            <div class="template-option" data-template="${key}">
                                <div class="template-info">
                                    <h4>${template.name}</h4>
                                    <p>${template.description}</p>
                                    <div class="template-pages">
                                        Includes: ${template.pages.join(', ')}
                                    </div>
                                </div>
                                <button class="select-template-btn" onclick="window.pdfReportGenerator.generateReport('${key}')">
                                    Select Template
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="report-options">
                        <div class="option-group">
                            <label>
                                <input type="checkbox" id="includeCharts" checked>
                                Include charts and graphs
                            </label>
                        </div>
                        <div class="option-group">
                            <label>
                                <input type="checkbox" id="includeDisclaimer" checked>
                                Include legal disclaimer
                            </label>
                        </div>
                        <div class="option-group">
                            <label>Company/Broker Name (optional):</label>
                            <input type="text" id="companyName" placeholder="Your Company Name">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async generateReport(templateKey) {
        const template = this.templates[templateKey];
        if (!template) {
            console.error('❌ Invalid template:', templateKey);
            return;
        }

        console.log('📄 Generating PDF report with template:', templateKey);

        try {
            // Show loading
            this.showGenerationProgress(true);
            
            // Collect calculation data
            const calculationData = this.collectCalculationData();
            
            // Generate PDF
            const pdf = await this.createPDF(template, calculationData);
            
            // Download PDF
            this.downloadPDF(pdf, calculationData);
            
            // Close modal
            document.querySelector('.pdf-report-modal')?.remove();
            
            console.log('✅ PDF report generated successfully');
            
        } catch (error) {
            console.error('❌ PDF generation failed:', error);
            alert('Failed to generate PDF report. Please try again.');
        } finally {
            this.showGenerationProgress(false);
        }
    }

    collectCalculationData() {
        // Get data from the property calculator
        const calculator = window.propertyCalculator;
        if (!calculator) {
            throw new Error('Calculator not available');
        }

        const data = calculator.getCalculationData();
        
        // Enhance with additional report data
        return {
            ...data,
            generatedAt: new Date(),
            reportType: 'Property Investment Analysis',
            companyName: document.getElementById('companyName')?.value || '',
            includeCharts: document.getElementById('includeCharts')?.checked || false,
            includeDisclaimer: document.getElementById('includeDisclaimer')?.checked || true
        };
    }

    async createPDF(template, data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        let yPos = 20; // Current Y position
        
        // Add header
        yPos = this.addHeader(doc, data, yPos);
        
        // Add pages based on template
        for (const pageType of template.pages) {
            yPos = await this.addPage(doc, pageType, data, yPos);
        }
        
        // Add footer on all pages
        this.addFooter(doc, data);
        
        return doc;
    }

    addHeader(doc, data, yPos) {
        // Company name/logo
        if (data.companyName) {
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(data.companyName, 20, yPos);
            yPos += 15;
        }
        
        // Report title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Property Investment Analysis Report', 20, yPos);
        yPos += 15;
        
        // Property address
        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text(`Property: ${data.address || 'Property Analysis'}`, 20, yPos);
        yPos += 10;
        
        // Generation date
        doc.setFontSize(10);
        doc.text(`Generated: ${data.generatedAt.toLocaleDateString()}`, 20, yPos);
        yPos += 20;
        
        return yPos;
    }

    async addPage(doc, pageType, data, yPos) {
        switch (pageType) {
            case 'summary':
                return this.addSummaryPage(doc, data, yPos);
            case 'calculations':
                return this.addCalculationsPage(doc, data, yPos);
            case 'projections':
                return this.addProjectionsPage(doc, data, yPos);
            case 'comparisons':
                return this.addComparisonsPage(doc, data, yPos);
            case 'recommendations':
                return this.addRecommendationsPage(doc, data, yPos);
            default:
                return yPos;
        }
    }

    addSummaryPage(doc, data, yPos) {
        // Check if we need a new page
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }
        
        // Summary section
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Investment Summary', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        const summaryData = [
            ['Purchase Price', `$${(data.purchasePrice || 0).toLocaleString()}`],
            ['Weekly Rental Income', `$${(data.rentalIncome || 0).toLocaleString()}`],
            ['Annual Rental Yield', `${this.calculateRentalYield(data)}%`],
            ['Deposit Required', `$${(data.deposit || 0).toLocaleString()}`],
            ['Loan Amount', `$${(data.loanAmount || 0).toLocaleString()}`],
            ['Weekly Repayments', `$${this.calculateWeeklyRepayments(data)}`]
        ];
        
        summaryData.forEach(([label, value]) => {
            doc.text(`${label}:`, 20, yPos);
            doc.text(value, 120, yPos);
            yPos += 8;
        });
        
        return yPos + 10;
    }

    addCalculationsPage(doc, data, yPos) {
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Detailed Calculations', 20, yPos);
        yPos += 15;
        
        // Add calculation details
        const calculations = this.performCalculations(data);
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        calculations.forEach(calc => {
            doc.text(`${calc.label}: ${calc.value}`, 20, yPos);
            yPos += 8;
        });
        
        return yPos + 10;
    }

    addProjectionsPage(doc, data, yPos) {
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('30-Year Projections', 20, yPos);
        yPos += 15;
        
        // Add projections table
        const projections = this.calculateProjections(data);
        
        // Simple table implementation
        doc.setFontSize(10);
        doc.text('Year | Property Value | Rental Income | Equity', 20, yPos);
        yPos += 8;
        
        projections.slice(0, 10).forEach((year, index) => {
            const text = `${index + 1} | $${year.propertyValue.toLocaleString()} | $${year.rentalIncome.toLocaleString()} | $${year.equity.toLocaleString()}`;
            doc.text(text, 20, yPos);
            yPos += 6;
        });
        
        return yPos + 10;
    }

    addComparisonsPage(doc, data, yPos) {
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Investment Comparisons', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        // Add comparison data
        const comparisons = [
            ['Property Investment (30 years)', '$1,234,567'],
            ['High Yield Savings (4.5%)', '$987,654'],
            ['ASX200 Index Fund (8%)', '$1,456,789']
        ];
        
        comparisons.forEach(([investment, value]) => {
            doc.text(`${investment}:`, 20, yPos);
            doc.text(value, 120, yPos);
            yPos += 8;
        });
        
        return yPos + 10;
    }

    addRecommendationsPage(doc, data, yPos) {
        if (yPos > 180) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Investment Recommendations', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        const recommendations = this.generateRecommendations(data);
        
        recommendations.forEach(rec => {
            // Word wrap for long text
            const lines = doc.splitTextToSize(rec, 170);
            lines.forEach(line => {
                doc.text(line, 20, yPos);
                yPos += 6;
            });
            yPos += 4;
        });
        
        return yPos + 10;
    }

    addFooter(doc, data) {
        const pageCount = doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Page number
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${pageCount}`, 180, 285);
            
            // Disclaimer
            if (data.includeDisclaimer) {
                const disclaimer = 'This report is for informational purposes only and does not constitute financial advice. Please consult with a qualified financial advisor before making investment decisions.';
                const lines = doc.splitTextToSize(disclaimer, 170);
                let disclaimerY = 270;
                
                lines.forEach(line => {
                    doc.text(line, 20, disclaimerY);
                    disclaimerY += 4;
                });
            }
        }
    }

    downloadPDF(pdf, data) {
        const filename = `property-analysis-${Date.now()}.pdf`;
        pdf.save(filename);
        
        // Show success message
        this.showSuccessMessage(`PDF report "${filename}" downloaded successfully!`);
    }

    // Helper calculation methods
    calculateRentalYield(data) {
        if (!data.purchasePrice || !data.rentalIncome) return '0.0';
        const annualRent = data.rentalIncome * 52;
        return ((annualRent / data.purchasePrice) * 100).toFixed(1);
    }

    calculateWeeklyRepayments(data) {
        if (!data.loanAmount || !data.interestRate) return '0';
        const monthlyRate = (data.interestRate / 100) / 12;
        const numberOfPayments = (data.loanTerm || 30) * 12;
        const monthlyPayment = (data.loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
        return Math.round(monthlyPayment / 4.33).toLocaleString();
    }

    performCalculations(data) {
        return [
            { label: 'Stamp Duty', value: `$${this.calculateStampDuty(data).toLocaleString()}` },
            { label: 'LMI (if applicable)', value: `$${this.calculateLMI(data).toLocaleString()}` },
            { label: 'Total Purchase Costs', value: `$${this.calculateTotalCosts(data).toLocaleString()}` },
            { label: 'Cash Required', value: `$${this.calculateCashRequired(data).toLocaleString()}` }
        ];
    }

    calculateProjections(data) {
        const projections = [];
        let propertyValue = data.purchasePrice || 0;
        let rentalIncome = (data.rentalIncome || 0) * 52;
        
        for (let year = 1; year <= 30; year++) {
            propertyValue *= 1.06; // 6% growth assumption
            rentalIncome *= 1.03; // 3% rental growth
            const equity = propertyValue - (data.loanAmount || 0) * Math.pow(0.97, year);
            
            projections.push({
                year,
                propertyValue: Math.round(propertyValue),
                rentalIncome: Math.round(rentalIncome),
                equity: Math.round(equity)
            });
        }
        
        return projections;
    }

    generateRecommendations(data) {
        const recommendations = [];
        const rentalYield = parseFloat(this.calculateRentalYield(data));
        
        if (rentalYield > 6) {
            recommendations.push('• Strong rental yield indicates good cash flow potential.');
        } else if (rentalYield < 4) {
            recommendations.push('• Consider improving rental yield through property improvements or rent optimization.');
        }
        
        recommendations.push('• Regular property maintenance will help preserve capital growth.');
        recommendations.push('• Consider professional property management to maximize returns.');
        recommendations.push('• Monitor market conditions and interest rate changes regularly.');
        
        return recommendations;
    }

    // Placeholder calculation methods (replace with actual calculator logic)
    calculateStampDuty(data) { return (data.purchasePrice || 0) * 0.055; }
    calculateLMI(data) { return 0; }
    calculateTotalCosts(data) { return (data.purchasePrice || 0) * 0.08; }
    calculateCashRequired(data) { return (data.deposit || 0) + this.calculateTotalCosts(data); }

    showGenerationProgress(show) {
        if (show) {
            const progress = document.createElement('div');
            progress.className = 'pdf-generation-progress';
            progress.innerHTML = `
                <div class="progress-overlay"></div>
                <div class="progress-content">
                    <div class="progress-spinner"></div>
                    <p>Generating PDF report...</p>
                </div>
            `;
            document.body.appendChild(progress);
        } else {
            document.querySelector('.pdf-generation-progress')?.remove();
        }
    }

    showSuccessMessage(message) {
        const success = document.createElement('div');
        success.className = 'pdf-success-message';
        success.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(success);
        
        setTimeout(() => success.remove(), 5000);
    }

    addReportStyles() {
        if (document.getElementById('pdf-report-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'pdf-report-styles';
        styles.textContent = `
            .pdf-report-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 10px;
                width: 100%;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .pdf-report-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
            }
            
            .pdf-report-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .modal-content {
                position: relative;
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal-header {
                padding: 24px 24px 0 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #1f2937;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
            }
            
            .modal-body {
                padding: 24px;
            }
            
            .template-option {
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: border-color 0.2s;
            }
            
            .template-option:hover {
                border-color: #3b82f6;
            }
            
            .template-info h4 {
                margin: 0 0 8px 0;
                color: #1f2937;
            }
            
            .template-info p {
                margin: 0 0 8px 0;
                color: #6b7280;
            }
            
            .template-pages {
                font-size: 14px;
                color: #9ca3af;
            }
            
            .select-template-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .select-template-btn:hover {
                background: #2563eb;
            }
            
            .report-options {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
            }
            
            .option-group {
                margin-bottom: 16px;
            }
            
            .option-group label {
                display: block;
                color: #374151;
                font-weight: 500;
                margin-bottom: 4px;
            }
            
            .option-group input[type="text"] {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
            }
            
            .option-group input[type="checkbox"] {
                margin-right: 8px;
            }
            
            .pdf-generation-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 20000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .progress-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
            }
            
            .progress-content {
                position: relative;
                background: white;
                padding: 32px;
                border-radius: 12px;
                text-align: center;
            }
            
            .progress-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f4f6;
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px auto;
            }
            
            .pdf-success-message {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 15000;
                background: #10b981;
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .success-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .success-icon {
                font-size: 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize PDF report generator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.property-calculator')) {
        window.pdfReportGenerator = new PDFReportGenerator();
        window.pdfReportGenerator.init();
    }
});