# Changelog

All notable changes to InvestQuest - Australian Property Investment Calculator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-14

### 🎉 Major UX Enhancement and Professional Design Release

This release transforms InvestQuest from a functional calculator into a professional-grade financial tool suitable for mortgage brokers and serious property investors.

### ✨ Added
#### **User Experience Enhancements**
- **Tool Explanation Section**: Expandable "How does this calculator help you?" with comprehensive feature overview
- **Smart Investment Insights System**: AI-powered analysis providing actionable advice based on calculation results
  - Investment performance vs ASX200 and high-yield savings comparison
  - Cash flow analysis with weekly out-of-pocket costs
  - Loan-to-Value ratio risk assessment and recommendations
  - Rental yield evaluation and market context
  - Growth assumption reality checks and warnings
  - Tax considerations and financing strategy advice
  - Color-coded insights (positive, warning, negative, info) with relevant icons
- **Educational Content Section**: Comprehensive "Property Investment Fundamentals" 
  - Key investment metrics explanation (LVR, rental yield, cash flow, capital growth)
  - Understanding investment returns and leverage benefits
  - Risk considerations (market, interest rate, vacancy, liquidity)
  - Investment strategy tips and location importance
  - Australian market context and historical performance
  - Financing options comparison (P&I vs Interest Only, 100%+ financing)
- **Professional Disclaimer**: Proper legal disclaimer about financial advice and risk considerations

#### **Professional Design System**
- **Typography Overhaul**: Implemented Inter font family (used by Stripe, Linear, modern fintech)
  - Professional font weights (400, 500, 600, 700, 800)
  - Mathematical typography scale with proper hierarchy
  - Anti-aliased text rendering for crisp appearance
- **Financial Institution Color Palette**: 
  - Professional navy gradient background (#1e3a8a to #1d4ed8)
  - Comprehensive semantic color system with design tokens
  - Success green, warning amber, error red states
  - Clean white surfaces with subtle gray backgrounds
- **Enhanced Visual Elements**:
  - Professional form fields with improved padding and focus states
  - Modern summary cards with hover effects and semantic color coding
  - Sophisticated shadow system (sm, md, lg, xl elevations)
  - Glass morphism effects with subtle background patterns
  - Professional micro-interactions and transitions throughout

### 🔧 Changed
#### **Design Optimizations**
- **Compact Layout**: Reduced excessive spacing throughout the interface for better vertical space usage
- **Cleaner Interface**: Removed field help text for professional appearance
- **Improved Visual Hierarchy**: Better typography scaling and consistent spacing
- **Enhanced Mobile Experience**: Optimized breakpoints and touch targets

### 🏦 Business Impact
- **Enhanced Credibility**: Professional design increases trust for mortgage broker presentations
- **Better User Engagement**: Comprehensive insights and education keep users engaged longer
- **Improved Conversion**: Professional appearance typically increases conversion rates 15-25%
- **Educational Value**: Transforms tool from calculator to learning platform

## [1.0.0] - 2025-01-12

### 🎉 Initial Release - Australian Property Investment Calculator

**Target Audience:** Australian mortgage brokers and property investors

### ✅ Added
- **Complete 30-Year Investment Projections**
  - Property value growth forecasting
  - Rental income projections with 3% annual growth
  - Cash flow analysis (positive/negative)
  - Equity building over time

- **Professional Mortgage Calculator**
  - Auto-calculated loan amount based on purchase price and deposit
  - Support for Interest Only vs Principal & Interest repayments
  - Adjustable interest rates and loan terms (1-40 years)
  - Real-time monthly and weekly repayment calculations

- **Australian Market Specifics**
  - Council rates input
  - Property management fees (default 7%)
  - Insurance costs (default $1,500/year)
  - Maintenance costs (default $2,000/year)
  - Australian formatting and assumptions

- **Comprehensive Upfront Costs Tracking**
  - Stamp duty calculator
  - Legal/conveyancing fees
  - Building and pest inspection costs
  - Loan application/setup fees
  - Other miscellaneous upfront costs
  - Auto-calculated total upfront costs

- **Investment Comparison Dashboard**
  - Property investment vs High Yield Savings (4.5%)
  - Property investment vs ASX200 Index (8%)
  - Prominently displayed in left panel for easy client discussions
  - No scrolling required to view comparisons

- **Professional User Interface**
  - Clean, mortgage broker-friendly design
  - Real-time calculation updates
  - Interactive charts (property value growth, cash flow analysis)
  - Mobile responsive design
  - Professional color scheme and typography

- **Technical Features**
  - Client-side calculations (no server required)
  - Built with vanilla HTML, CSS, JavaScript
  - Chart.js integration for visualizations
  - Australian number formatting
  - Form validation and error handling

### 🎯 Key Benefits
- **No scrolling required** - Investment comparison visible immediately
- **Accurate Australian calculations** - Includes all typical upfront costs
- **Professional presentation** - Perfect for client meetings
- **Complete transparency** - All calculations shown with detailed breakdowns
- **Mobile friendly** - Works on all devices

### 🔧 Technical Specifications
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Charts:** Chart.js
- **Responsive Design:** CSS Grid and Flexbox
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **No Dependencies:** Runs entirely client-side

### 📊 Default Australian Market Assumptions
- Property growth: 6% per annum
- Rental growth: 3% per annum  
- Property management: 7% of rental income
- Insurance: $1,500 per year
- Maintenance: $2,000 per year
- High yield savings: 4.5% per annum
- ASX200 index: 8% per annum
- Default interest rate: 6.5%

---

## Future Versions (Planned)

### [2.0.0] - Future
- Google Authentication for saving calculations
- Australian property market API integration
- Taxation calculations (negative gearing, capital gains tax)
- Multiple property comparison
- PDF report generation
- Advanced scenarios modeling

### [1.1.0] - Future  
- Stamp duty calculator by state
- LMI (Lenders Mortgage Insurance) calculations
- Depreciation schedules
- Advanced expense categories
- Export to Excel functionality

---

**Repository:** https://github.com/JackGH1-dev/property-investment-calculator
**Live Demo:** https://jackgh1-dev.github.io/property-investment-calculator