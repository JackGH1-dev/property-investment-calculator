// Professional PDF Report Generation Service
// Creates comprehensive property investment analysis reports

class PDFGenerator {
    constructor() {
        this.brandConfig = {
            companyName: 'InvestQuest',
            logo: '🎯',
            website: 'investquest.com.au',
            colors: {
                primary: '#667eea',
                secondary: '#764ba2', 
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                text: '#1f2937',
                textSecondary: '#6b7280'
            }
        };
        
        this.loadJSPDF();
    }

    async loadJSPDF() {
        if (!window.jsPDF) {
            // Load jsPDF library
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);
            
            return new Promise((resolve) => {
                script.onload = resolve;
            });
        }
    }

    async generateInvestmentReport(calculationData, projections, selectedProperty = null) {
        await this.loadJSPDF();
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Page setup
        let currentY = 20;
        const pageWidth = 210;
        const pageHeight = 297;
        const margins = { left: 20, right: 20, top: 20, bottom: 20 };
        const contentWidth = pageWidth - margins.left - margins.right;
        
        // Page 1: Cover Page
        this.addCoverPage(doc, calculationData, currentY, contentWidth, selectedProperty);
        
        // Page 2: Executive Summary
        doc.addPage();
        currentY = this.addExecutiveSummary(doc, calculationData, projections, 20, contentWidth);
        
        // Page 3: Property Details
        doc.addPage();
        currentY = this.addPropertyDetails(doc, calculationData, selectedProperty, 20, contentWidth);
        
        // Page 4: Financial Analysis
        doc.addPage();
        currentY = this.addFinancialAnalysis(doc, calculationData, projections, 20, contentWidth);
        
        // Page 5: Cash Flow Projections
        doc.addPage();
        currentY = this.addCashFlowProjections(doc, projections, 20, contentWidth);
        
        // Page 6: Market Analysis (if property data available)
        if (selectedProperty) {
            doc.addPage();
            currentY = this.addMarketAnalysis(doc, selectedProperty, 20, contentWidth);
        }
        
        // Page 7: Investment Comparison
        doc.addPage();
        currentY = this.addInvestmentComparison(doc, calculationData, projections, 20, contentWidth);
        
        // Page 8: Recommendations & Risk Analysis
        doc.addPage();
        currentY = this.addRecommendations(doc, calculationData, projections, selectedProperty, 20, contentWidth);
        
        // Footer on all pages
        this.addFooterToAllPages(doc);
        
        return doc;
    }

    addCoverPage(doc, data, startY, contentWidth, property) {
        // Company logo and branding
        doc.setFontSize(36);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 126, 234); // Primary color
        doc.text(`${this.brandConfig.logo} ${this.brandConfig.companyName}`, 20, 40);
        
        // Report title
        doc.setFontSize(24);
        doc.setTextColor(31, 41, 55); // Dark text
        doc.text('Property Investment Analysis Report', 20, 60);
        
        // Property address (if available)
        if (data.address || (property && property.address)) {
            doc.setFontSize(16);
            doc.setTextColor(107, 114, 128); // Secondary text
            const address = data.address || property.address;
            doc.text(`Property: ${address}`, 20, 75);
        }
        
        // Key metrics box
        doc.setFillColor(102, 126, 234); // Primary color
        doc.rect(20, 90, contentWidth, 60, 'F');
        
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255); // White text
        doc.text('Investment Overview', 25, 105);
        
        doc.setFontSize(11);
        doc.text(`Purchase Price: $${this.formatNumber(data.purchasePrice)}`, 25, 115);
        doc.text(`Initial Investment: $${this.formatNumber(data.deposit + data.totalUpfrontCosts)}`, 25, 125);
        doc.text(`Weekly Rental: $${this.formatNumber(data.rentalIncome)}`, 25, 135);
        
        const finalYear = projections[projections.length - 1];
        const totalReturn = finalYear.equity + finalYear.cumulativeCashFlow - (data.deposit + data.totalUpfrontCosts);
        const annualizedReturn = Math.pow((finalYear.equity + finalYear.cumulativeCashFlow) / (data.deposit + data.totalUpfrontCosts), 1/30) - 1;
        
        doc.text(`Projected 30-Year Return: $${this.formatNumber(totalReturn)}`, 100, 115);
        doc.text(`Annualized Return: ${(annualizedReturn * 100).toFixed(1)}%`, 100, 125);
        doc.text(`Final Property Value: $${this.formatNumber(finalYear.propertyValue)}`, 100, 135);
        
        // Date and disclaimer
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text(`Report Generated: ${new Date().toLocaleDateString('en-AU')}`, 20, 170);
        
        doc.setFontSize(8);
        doc.text('This report is for informational purposes only and should not be considered financial advice.', 20, 260);
        doc.text('Please consult with qualified professionals before making investment decisions.', 20, 268);
        
        // Contact information
        doc.setFontSize(10);
        doc.setTextColor(102, 126, 234);
        doc.text(`Visit: ${this.brandConfig.website}`, 20, 280);
    }

    addExecutiveSummary(doc, data, projections, startY, contentWidth) {
        let currentY = startY;
        
        // Section title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Executive Summary', 20, currentY);
        currentY += 15;
        
        // Key findings
        const finalYear = projections[projections.length - 1];
        const totalReturn = finalYear.equity + finalYear.cumulativeCashFlow - (data.deposit + data.totalUpfrontCosts);
        const annualizedReturn = Math.pow((finalYear.equity + finalYear.cumulativeCashFlow) / (data.deposit + data.totalUpfrontCosts), 1/30) - 1;
        const rentalYield = (data.rentalIncome * 52 / data.purchasePrice) * 100;
        const lvrRatio = (data.loanAmount / data.purchasePrice) * 100;
        
        // Summary boxes
        const boxHeight = 25;
        const boxWidth = contentWidth / 2 - 5;
        
        // Total Return box
        const returnColor = totalReturn > 0 ? [16, 185, 129] : [239, 68, 68]; // Green or red
        doc.setFillColor(returnColor[0], returnColor[1], returnColor[2]);
        doc.rect(20, currentY, boxWidth, boxHeight, 'F');
        
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('Total 30-Year Return', 25, currentY + 8);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${this.formatNumber(totalReturn)}`, 25, currentY + 18);
        
        // Annualized Return box
        doc.setFillColor(102, 126, 234); // Primary color
        doc.rect(110, currentY, boxWidth, boxHeight, 'F');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Annualized Return', 115, currentY + 8);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`${(annualizedReturn * 100).toFixed(1)}%`, 115, currentY + 18);
        
        currentY += boxHeight + 15;
        
        // Key metrics table
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text('Investment Metrics', 20, currentY);
        currentY += 10;
        
        const metrics = [
            ['Purchase Price', `$${this.formatNumber(data.purchasePrice)}`],
            ['Initial Investment (Deposit + Costs)', `$${this.formatNumber(data.deposit + data.totalUpfrontCosts)}`],
            ['Loan Amount', `$${this.formatNumber(data.loanAmount)}`],
            ['Loan-to-Value Ratio', `${lvrRatio.toFixed(1)}%`],
            ['Weekly Rental Income', `$${this.formatNumber(data.rentalIncome)}`],
            ['Initial Rental Yield', `${rentalYield.toFixed(1)}%`],
            ['Interest Rate', `${data.interestRate}% p.a.`],
            ['Loan Term', `${data.loanTerm} years`]
        ];
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        metrics.forEach(([label, value], index) => {
            const y = currentY + (index * 6);
            doc.setTextColor(107, 114, 128);
            doc.text(label, 25, y);
            doc.setTextColor(31, 41, 55);
            doc.text(value, 120, y);
        });
        
        currentY += (metrics.length * 6) + 10;
        
        // Investment recommendation
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text('Investment Recommendation', 20, currentY);
        currentY += 10;
        
        const recommendation = this.generateRecommendation(data, projections, totalReturn, annualizedReturn);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(31, 41, 55);
        
        const lines = doc.splitTextToSize(recommendation, contentWidth - 10);
        lines.forEach((line, index) => {
            doc.text(line, 25, currentY + (index * 5));
        });
        
        return currentY + (lines.length * 5) + 10;
    }

    addPropertyDetails(doc, data, property, startY, contentWidth) {
        let currentY = startY;
        
        // Section title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Property Details', 20, currentY);
        currentY += 15;
        
        // Basic property information
        const propertyInfo = [
            ['Address', data.address || 'Not specified'],
            ['State/Territory', data.state || 'Not specified'],
            ['Purchase Price', `$${this.formatNumber(data.purchasePrice)}`],
            ['Property Type', property?.propertyType || 'Not specified'],
            ['Bedrooms', property?.bedrooms?.toString() || 'Not specified'],
            ['Bathrooms', property?.bathrooms?.toString() || 'Not specified'],
            ['Car Spaces', property?.carSpaces?.toString() || 'Not specified']
        ];
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        
        propertyInfo.forEach(([label, value], index) => {
            const y = currentY + (index * 7);
            doc.setTextColor(107, 114, 128);
            doc.text(label + ':', 25, y);
            doc.setTextColor(31, 41, 55);
            doc.text(value, 80, y);
        });
        
        currentY += (propertyInfo.length * 7) + 15;
        
        // Financial details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Financial Structure', 20, currentY);
        currentY += 10;
        
        // Loan details table
        const loanDetails = [
            ['Loan Amount', `$${this.formatNumber(data.loanAmount)}`],
            ['Deposit', `$${this.formatNumber(data.deposit)}`],
            ['Stamp Duty', `$${this.formatNumber(data.stampDuty)}`],
            ['LMI', `$${this.formatNumber(data.lmi)}`],
            ['Legal Fees', `$${this.formatNumber(data.legalFees || 0)}`],
            ['Total Upfront Costs', `$${this.formatNumber(data.totalUpfrontCosts)}`],
            ['Monthly Repayment', `$${this.formatNumber(parseFloat(document.getElementById('monthlyRepayment')?.value || 0))}`],
            ['Repayment Type', data.repaymentType === 'interest-only' ? 'Interest Only' : 'Principal & Interest']
        ];
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        loanDetails.forEach(([label, value], index) => {
            const y = currentY + (index * 6);
            doc.setTextColor(107, 114, 128);
            doc.text(label, 25, y);
            doc.setTextColor(31, 41, 55);
            doc.text(value, 120, y);
        });
        
        return currentY + (loanDetails.length * 6) + 15;
    }

    addFinancialAnalysis(doc, data, projections, startY, contentWidth) {
        let currentY = startY;
        
        // Section title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Financial Analysis', 20, currentY);
        currentY += 15;
        
        // Create simple chart representation
        const chartHeight = 80;
        const chartWidth = contentWidth - 20;
        
        // Property value growth chart (simplified)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('30-Year Property Value Growth', 20, currentY);
        currentY += 10;
        
        // Chart border
        doc.setDrawColor(200, 200, 200);
        doc.rect(20, currentY, chartWidth, chartHeight);
        
        // Draw simplified chart data points
        const years = [0, 10, 20, 30];
        const chartData = years.map(year => ({
            year: year,
            value: projections[Math.min(year, projections.length - 1)].propertyValue
        }));
        
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        
        chartData.forEach((point, index) => {
            const x = 25 + (index * (chartWidth - 10) / (chartData.length - 1));
            const y = currentY + chartHeight - 10;
            
            doc.text(`Yr ${point.year}`, x - 5, y + 8);
            doc.text(`$${this.formatNumber(point.value, true)}`, x - 10, y + 15);
        });
        
        currentY += chartHeight + 25;
        
        // Key financial ratios
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text('Key Financial Ratios', 20, currentY);
        currentY += 10;
        
        const finalYear = projections[projections.length - 1];
        const initialInvestment = data.deposit + data.totalUpfrontCosts;
        const totalReturn = finalYear.equity + finalYear.cumulativeCashFlow - initialInvestment;
        const annualizedReturn = Math.pow((finalYear.equity + finalYear.cumulativeCashFlow) / initialInvestment, 1/30) - 1;
        const rentalYield = (data.rentalIncome * 52 / data.purchasePrice) * 100;
        const lvrRatio = (data.loanAmount / data.purchasePrice) * 100;
        
        const ratios = [
            ['Initial Rental Yield', `${rentalYield.toFixed(1)}%`],
            ['Loan-to-Value Ratio', `${lvrRatio.toFixed(1)}%`],
            ['Total Return on Investment', `${((totalReturn / initialInvestment) * 100).toFixed(1)}%`],
            ['Annualized Return', `${(annualizedReturn * 100).toFixed(1)}%`],
            ['Final Equity Position', `$${this.formatNumber(finalYear.equity)}`],
            ['Cumulative Cash Flow', `$${this.formatNumber(finalYear.cumulativeCashFlow)}`]
        ];
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        ratios.forEach(([label, value], index) => {
            const y = currentY + (index * 6);
            doc.setTextColor(107, 114, 128);
            doc.text(label, 25, y);
            doc.setTextColor(31, 41, 55);
            doc.text(value, 120, y);
        });
        
        return currentY + (ratios.length * 6) + 10;
    }

    addCashFlowProjections(doc, projections, startY, contentWidth) {
        let currentY = startY;
        
        // Section title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Cash Flow Projections', 20, currentY);
        currentY += 15;
        
        // Table headers
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(102, 126, 234);
        doc.rect(20, currentY, contentWidth, 8, 'F');
        
        const headers = ['Year', 'Property Value', 'Rental Income', 'Net Cash Flow', 'Equity'];
        const colWidth = contentWidth / headers.length;
        
        headers.forEach((header, index) => {
            doc.text(header, 25 + (index * colWidth), currentY + 6);
        });
        currentY += 8;
        
        // Table data (show every 5 years plus final year)
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(31, 41, 55);
        
        const displayYears = projections.filter((_, index) => index % 5 === 0 || index === projections.length - 1);
        
        displayYears.forEach((proj, rowIndex) => {
            const y = currentY + (rowIndex * 6) + 4;
            const rowColor = rowIndex % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
            
            doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
            doc.rect(20, y - 2, contentWidth, 6, 'F');
            
            const values = [
                proj.year.toString(),
                `$${this.formatNumber(proj.propertyValue, true)}`,
                `$${this.formatNumber(proj.rentalIncome, true)}`,
                `$${this.formatNumber(proj.netCashFlow, true)}`,
                `$${this.formatNumber(proj.equity, true)}`
            ];
            
            values.forEach((value, colIndex) => {
                // Color negative cash flow red
                if (colIndex === 3 && proj.netCashFlow < 0) {
                    doc.setTextColor(239, 68, 68);
                } else {
                    doc.setTextColor(31, 41, 55);
                }
                
                doc.text(value, 25 + (colIndex * colWidth), y + 2);
            });
        });
        
        currentY += (displayYears.length * 6) + 15;
        
        // Cash flow summary
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text('Cash Flow Summary', 20, currentY);
        currentY += 10;
        
        const firstYearCashFlow = projections[0].netCashFlow;
        const breakEvenYear = projections.findIndex(p => p.cumulativeCashFlow > 0);
        const finalCumulativeCashFlow = projections[projections.length - 1].cumulativeCashFlow;
        
        const summaryPoints = [
            `Year 1 Cash Flow: $${this.formatNumber(firstYearCashFlow)} ${firstYearCashFlow >= 0 ? '(Positive)' : '(Negative)'}`,
            breakEvenYear > 0 ? `Break-even Year: ${breakEvenYear + 1}` : 'Cash flow remains negative for 30 years',
            `Total 30-Year Cash Flow: $${this.formatNumber(finalCumulativeCashFlow)}`
        ];
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        summaryPoints.forEach((point, index) => {
            doc.text(`• ${point}`, 25, currentY + (index * 6));
        });
        
        return currentY + (summaryPoints.length * 6) + 10;
    }

    addMarketAnalysis(doc, property, startY, contentWidth) {
        let currentY = startY;
        
        // Section title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Market Analysis', 20, currentY);
        currentY += 15;
        
        if (!property || !property.marketData) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text('Market data not available for this property.', 25, currentY);
            return currentY + 10;
        }
        
        // Market metrics
        const marketMetrics = [
            ['Suburb Growth Rate', `${property.marketData.growthRate}%`],
            ['Days on Market', `${property.marketData.daysOnMarket} days`],
            ['Properties Sold (Last 12 Months)', `${property.marketData.soldLastYear}`],
            ['Median Price (Suburb)', `$${this.formatNumber(property.marketData.medianPrice)}`]
        ];
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        marketMetrics.forEach(([label, value], index) => {
            const y = currentY + (index * 6);
            doc.setTextColor(107, 114, 128);
            doc.text(label, 25, y);
            doc.setTextColor(31, 41, 55);
            doc.text(value, 120, y);
        });
        
        currentY += (marketMetrics.length * 6) + 15;
        
        // Property features
        if (property.features && property.features.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('Property Features', 20, currentY);
            currentY += 10;
            
            const featuresPerRow = 2;
            const featureRows = Math.ceil(property.features.length / featuresPerRow);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            
            for (let row = 0; row < featureRows; row++) {
                for (let col = 0; col < featuresPerRow; col++) {
                    const featureIndex = row * featuresPerRow + col;
                    if (featureIndex < property.features.length) {
                        const feature = property.features[featureIndex];
                        const x = 25 + (col * (contentWidth / 2));
                        doc.text(`• ${feature}`, x, currentY + (row * 5));
                    }
                }
            }
            
            currentY += (featureRows * 5) + 10;
        }
        
        return currentY;
    }

    addInvestmentComparison(doc, data, projections, startY, contentWidth) {
        let currentY = startY;
        
        // Section title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Investment Comparison', 20, currentY);
        currentY += 15;
        
        const initialInvestment = data.deposit + data.totalUpfrontCosts;
        const finalYear = projections[projections.length - 1];
        const propertyReturn = finalYear.equity + finalYear.cumulativeCashFlow - initialInvestment;
        
        // Calculate alternative investments
        const savingsReturn = initialInvestment * Math.pow(1.045, 30) - initialInvestment; // 4.5% p.a.
        const asxReturn = initialInvestment * Math.pow(1.08, 30) - initialInvestment; // 8.0% p.a.
        
        // Comparison table
        const comparisons = [
            ['Investment Type', 'Initial Investment', '30-Year Return', 'Annual Return'],
            ['Property Investment', `$${this.formatNumber(initialInvestment)}`, `$${this.formatNumber(propertyReturn)}`, `${((Math.pow((finalYear.equity + finalYear.cumulativeCashFlow) / initialInvestment, 1/30) - 1) * 100).toFixed(1)}%`],
            ['High Yield Savings (4.5%)', `$${this.formatNumber(initialInvestment)}`, `$${this.formatNumber(savingsReturn)}`, '4.5%'],
            ['ASX200 Index (8.0%)', `$${this.formatNumber(initialInvestment)}`, `$${this.formatNumber(asxReturn)}`, '8.0%']
        ];
        
        // Table headers
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(102, 126, 234);
        doc.rect(20, currentY, contentWidth, 8, 'F');
        
        const colWidth = contentWidth / 4;
        comparisons[0].forEach((header, index) => {
            doc.text(header, 25 + (index * colWidth), currentY + 6);
        });
        currentY += 8;
        
        // Table rows
        doc.setFont('helvetica', 'normal');
        comparisons.slice(1).forEach((row, rowIndex) => {
            const y = currentY + (rowIndex * 6) + 4;
            const rowColor = rowIndex % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
            
            doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
            doc.rect(20, y - 2, contentWidth, 6, 'F');
            
            row.forEach((value, colIndex) => {
                // Highlight the best performing investment
                if (colIndex === 2 && rowIndex === 0) {
                    const propertyReturnNum = propertyReturn;
                    const maxReturn = Math.max(propertyReturnNum, savingsReturn, asxReturn);
                    if (propertyReturnNum === maxReturn) {
                        doc.setTextColor(16, 185, 129); // Green for best
                    } else {
                        doc.setTextColor(31, 41, 55);
                    }
                } else {
                    doc.setTextColor(31, 41, 55);
                }
                
                doc.text(value, 25 + (colIndex * colWidth), y + 2);
            });
        });
        
        currentY += (comparisons.length * 6) + 10;
        
        // Comparison analysis
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text('Comparison Analysis', 20, currentY);
        currentY += 10;
        
        let analysis = '';
        if (propertyReturn > asxReturn) {
            analysis = `Based on the projections, this property investment outperforms both high-yield savings and ASX200 index funds, generating $${this.formatNumber(propertyReturn - asxReturn)} more than shares over 30 years.`;
        } else if (propertyReturn > savingsReturn) {
            analysis = `This property investment beats high-yield savings but underperforms ASX200 by $${this.formatNumber(asxReturn - propertyReturn)}. Consider the stability and tax benefits of property versus market volatility.`;
        } else {
            analysis = `Based on these assumptions, both high-yield savings and shares would provide better returns. Consider revising assumptions or looking for properties with better fundamentals.`;
        }
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const analysisLines = doc.splitTextToSize(analysis, contentWidth - 10);
        analysisLines.forEach((line, index) => {
            doc.text(line, 25, currentY + (index * 5));
        });
        
        return currentY + (analysisLines.length * 5) + 10;
    }

    addRecommendations(doc, data, projections, property, startY, contentWidth) {
        let currentY = startY;
        
        // Section title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Recommendations & Risk Analysis', 20, currentY);
        currentY += 15;
        
        // Generate recommendations
        const recommendations = this.generateDetailedRecommendations(data, projections, property);
        
        recommendations.forEach((rec, index) => {
            // Recommendation header
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            
            let headerColor = [31, 41, 55]; // Default dark
            if (rec.type === 'positive') headerColor = [16, 185, 129]; // Green
            if (rec.type === 'warning') headerColor = [245, 158, 11]; // Yellow
            if (rec.type === 'negative') headerColor = [239, 68, 68]; // Red
            
            doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
            doc.text(`${index + 1}. ${rec.title}`, 20, currentY);
            currentY += 8;
            
            // Recommendation content
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(31, 41, 55);
            
            const contentLines = doc.splitTextToSize(rec.content, contentWidth - 10);
            contentLines.forEach((line, lineIndex) => {
                doc.text(line, 25, currentY + (lineIndex * 4));
            });
            
            currentY += (contentLines.length * 4) + 8;
        });
        
        // Disclaimer
        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(239, 68, 68); // Red
        doc.text('Important Disclaimer', 20, currentY);
        currentY += 10;
        
        const disclaimer = "This analysis is based on assumptions and projections that may not reflect actual market conditions. Property investment involves significant risks including market volatility, vacancy periods, maintenance costs, and interest rate changes. Past performance does not guarantee future results. Always consult with qualified financial advisors, accountants, and property professionals before making investment decisions.";
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);
        
        const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 10);
        disclaimerLines.forEach((line, index) => {
            doc.text(line, 25, currentY + (index * 4));
        });
        
        return currentY + (disclaimerLines.length * 4) + 10;
    }

    addFooterToAllPages(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Footer line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 285, 190, 285);
            
            // Footer text
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128);
            doc.text(`${this.brandConfig.companyName} Property Investment Analysis Report`, 20, 290);
            doc.text(`Page ${i} of ${pageCount}`, 170, 290);
            doc.text(`Generated: ${new Date().toLocaleDateString('en-AU')}`, 20, 294);
        }
    }

    generateRecommendation(data, projections, totalReturn, annualizedReturn) {
        const initialInvestment = data.deposit + data.totalUpfrontCosts;
        const savingsReturn = initialInvestment * Math.pow(1.045, 30) - initialInvestment;
        const asxReturn = initialInvestment * Math.pow(1.08, 30) - initialInvestment;
        const firstYearCashFlow = projections[0].netCashFlow;
        const lvrRatio = (data.loanAmount / data.purchasePrice) * 100;
        
        if (totalReturn > asxReturn && firstYearCashFlow >= 0) {
            return "STRONG BUY RECOMMENDATION: This investment shows excellent potential with positive cash flow from year one and total returns exceeding market alternatives. The combination of capital growth and rental income makes this a compelling investment opportunity.";
        } else if (totalReturn > savingsReturn) {
            return "MODERATE BUY RECOMMENDATION: This property investment offers solid returns above savings accounts, though with manageable risks. The investment fundamentals are sound, making it suitable for investors seeking steady wealth building.";
        } else {
            return "CAUTION RECOMMENDED: Based on current assumptions, this investment may not provide competitive returns. Consider negotiating a lower purchase price, increasing rental income, or exploring alternative properties with stronger fundamentals.";
        }
    }

    generateDetailedRecommendations(data, projections, property) {
        const recommendations = [];
        const finalYear = projections[projections.length - 1];
        const totalReturn = finalYear.equity + finalYear.cumulativeCashFlow - (data.deposit + data.totalUpfrontCosts);
        const lvrRatio = (data.loanAmount / data.purchasePrice) * 100;
        const rentalYield = (data.rentalIncome * 52 / data.purchasePrice) * 100;
        const firstYearCashFlow = projections[0].netCashFlow;
        
        // Cash flow recommendation
        if (firstYearCashFlow >= 0) {
            recommendations.push({
                type: 'positive',
                title: 'Positive Cash Flow Investment',
                content: `This property generates positive cash flow from day one ($${this.formatNumber(firstYearCashFlow)} annually). This reduces your financial burden and provides immediate income returns. Positive cash flow properties are excellent for building a sustainable investment portfolio.`
            });
        } else {
            const weeklyContribution = Math.abs(firstYearCashFlow) / 52;
            if (weeklyContribution > 200) {
                recommendations.push({
                    type: 'warning',
                    title: 'High Negative Cash Flow',
                    content: `This investment requires $${Math.round(weeklyContribution)} weekly contributions ($${this.formatNumber(Math.abs(firstYearCashFlow))} annually). Ensure this fits comfortably within your budget and consider the impact on your lifestyle. High negative gearing can provide tax benefits but requires strong income support.`
                });
            } else {
                recommendations.push({
                    type: 'info',
                    title: 'Manageable Negative Cash Flow',
                    content: `Weekly contributions of $${Math.round(weeklyContribution)} are manageable for building long-term wealth. This level of negative gearing is common in growth-focused investment strategies and may provide tax benefits.`
                });
            }
        }
        
        // LVR and risk assessment
        if (lvrRatio > 95) {
            recommendations.push({
                type: 'warning',
                title: 'Very High Leverage Risk',
                content: `Your ${lvrRatio.toFixed(1)}% LVR represents very high leverage. While this maximizes potential returns, it significantly increases risk if property values decline. Consider having substantial cash reserves and stable income to manage potential market downturns.`
            });
        } else if (lvrRatio > 80) {
            recommendations.push({
                type: 'info',
                title: 'Moderate Leverage Strategy',
                content: `Your ${lvrRatio.toFixed(1)}% LVR provides good leverage for capital growth while maintaining manageable risk. The LMI cost of $${this.formatNumber(data.lmi)} should be factored into your ROI calculations.`
            });
        }
        
        // Rental yield analysis
        if (rentalYield < 4) {
            recommendations.push({
                type: 'warning',
                title: 'Low Rental Yield Concern',
                content: `The ${rentalYield.toFixed(1)}% rental yield is below market averages. This property relies heavily on capital growth for returns. Ensure the location has strong growth drivers such as infrastructure development, employment growth, or population increases.`
            });
        } else if (rentalYield > 6) {
            recommendations.push({
                type: 'positive',
                title: 'Excellent Rental Yield',
                content: `The ${rentalYield.toFixed(1)}% rental yield is excellent, providing strong income returns. High-yield properties typically offer better cash flow and more stable returns, making them ideal for income-focused investors.`
            });
        }
        
        // Growth assumptions check
        if (data.propertyGrowth > 8) {
            recommendations.push({
                type: 'warning',
                title: 'Aggressive Growth Assumptions',
                content: `The assumed ${data.propertyGrowth}% annual growth rate is above historical Australian averages (6-7%). Consider running scenarios with more conservative growth rates (4-6%) to stress-test your investment. Overly optimistic assumptions can lead to poor investment decisions.`
            });
        }
        
        // Interest rate sensitivity
        recommendations.push({
            type: 'info',
            title: 'Interest Rate Sensitivity',
            content: `At ${data.interestRate}% interest, a 1% rate increase would add approximately $${this.formatNumber(data.loanAmount * 0.01)} annually to your costs. Consider how interest rate changes might affect your cash flow and ensure you have buffer capacity for rate rises.`
        });
        
        // Market timing and strategy
        if (totalReturn > 0) {
            recommendations.push({
                type: 'positive',
                title: 'Long-Term Wealth Strategy',
                content: `This investment shows strong potential for long-term wealth creation with a projected total return of $${this.formatNumber(totalReturn)}. Property investment works best with a long-term hold strategy (7+ years) to maximize tax benefits and allow growth assumptions to compound.`
            });
        }
        
        return recommendations;
    }

    formatNumber(num, abbreviated = false) {
        if (abbreviated && num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (abbreviated && num >= 1000) {
            return `${(num / 1000).toFixed(0)}k`;
        }
        
        return new Intl.NumberFormat('en-AU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    }

    // Public methods for generating and downloading reports
    async generateAndDownload(calculationData, projections, selectedProperty = null) {
        try {
            const doc = await this.generateInvestmentReport(calculationData, projections, selectedProperty);
            
            const fileName = `InvestQuest-Property-Analysis-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            return { success: true, fileName };
            
        } catch (error) {
            console.error('PDF generation failed:', error);
            return { success: false, error: error.message };
        }
    }

    async generateAndGetBlob(calculationData, projections, selectedProperty = null) {
        try {
            const doc = await this.generateInvestmentReport(calculationData, projections, selectedProperty);
            return doc.output('blob');
            
        } catch (error) {
            console.error('PDF generation failed:', error);
            throw error;
        }
    }
}

// Export for global use
window.PDFGenerator = PDFGenerator;