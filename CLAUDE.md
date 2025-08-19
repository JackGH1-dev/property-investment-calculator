# CLAUDE.md - InvestQuest: Comprehensive Australian Financial Planning Platform

## Project Overview

InvestQuest is an evolving web-based financial planning platform that empowers both individual consumers and financial professionals (mortgage brokers, financial planners, buyers agents) to create comprehensive investment strategies and future financial projections.

**Current State**: Property investment calculator with 30-year forecasting for the Australian market.

**Evolution Goal**: Comprehensive financial planning platform that integrates property investments with complete financial profiles, enabling bespoke strategy creation and holistic cash flow analysis.

## Target Users

### **Individual Consumers**
- **Primary**: Property investors seeking comprehensive investment analysis
- **Secondary**: First-time investors learning about property markets
- **Tertiary**: High-net-worth individuals planning multiple investment strategies

### **Financial Professionals**
- **Primary**: Mortgage brokers (like Jack Chen from Brilliant Finance Group)
- **Secondary**: Financial planners and advisors
- **Tertiary**: Buyers agents and investment consultants

### **Platform Value Proposition**
- **For Consumers**: Autonomous financial planning with professional-grade tools and projections
- **For Professionals**: Client presentation tools, portfolio management, and bespoke strategy creation
- **For Both**: Comprehensive awareness of potential pitfalls (cash flow gaps, market risks, timing issues)

## Core Requirements (From Initial Brief)

### Business Context
- **User Profile**: Mortgage broker who deals with clients regularly
- **Use Case**: Advise on investment performance around property and make suggestions using projections to help clients reach their financial goals
- **Market**: Australian property market (not global)
- **Experience Level**: Treat user as someone who has never coded before and never developed an app

### Core Functionality (Current v1.1.0)

1. **30-Year Property Investment Forecasting**
   - Property value appreciation over time
   - Rental income projections
   - Cash flow analysis (positive/negative)
   - Complete financial outcome projections

2. **Investment Comparisons**
   - Property investment performance vs high interest savings accounts
   - Property investment vs ASX200 index funds
   - Comprehensive return analysis and recommendations

3. **Australian Market Integration**
   - State-specific stamp duty calculations
   - Lenders Mortgage Insurance (LMI) calculations
   - Realistic growth assumptions for Australian property markets

### Planned Comprehensive Platform Features

4. **User Profile & Authentication System**
   - Secure login for both consumers and professionals
   - Individual financial profile creation and management
   - Professional client portfolio management

5. **Holistic Financial Planning**
   - **Income & Expenses Analysis**
     - Current income streams (salary, business, investment income)
     - Regular expenses tracking and categorization
     - Future income projections and career planning
   
   - **Assets & Liabilities Portfolio**
     - Complete asset register (properties, shares, savings, super)
     - Liability tracking (mortgages, personal loans, credit cards)
     - Net worth calculations and trend analysis
   
   - **Goal-Based Strategy Creation**
     - Short-term financial goals (1-5 years)
     - Long-term wealth building objectives (10-30+ years)
     - Retirement planning integration
     - Education funding and family planning

6. **Advanced Risk Analysis & Awareness**
   - **Cash Flow Risk Detection**
     - Monthly/quarterly cash flow projections
     - Identification of potential cash flow gaps
     - Interest rate sensitivity analysis
     - Market downturn scenario planning
   
   - **Investment Timing Analysis**
     - Optimal property purchase timing
     - Market cycle awareness and warnings
     - Personal readiness assessment (deposit, income stability)

7. **Bespoke Strategy Engine**
   - Personalized investment recommendations based on complete financial profile
   - Multi-property portfolio optimization
   - Tax-effective structuring suggestions
   - Professional advice integration and referral system

### Input Requirements

**Property Details:**
- Purchase price
- Property address
- Deposit amount
- Rental income
- Year of purchase

**Ongoing Costs:**
- Maintenance
- Insurance
- Property management fees
- Council rates
- Other expenses

**Upfront Costs:**
- Stamp duty
- Legal/conveyancing fees
- Building & pest inspection
- Loan application/setup fees
- Other upfront costs

**Mortgage Details:**
- Loan amount (auto-calculated from purchase price - deposit)
- Interest rate
- Repayment type (Interest Only vs Principal & Interest)
- Loan term
- Monthly/weekly repayment calculations

### Market Data Requirements
- Integrate with real Australian property market APIs when possible
- Allow user override of market data
- Provide clear indication of what market data is being used
- Australian-specific growth rates and assumptions

### User Experience Requirements
- **Simplicity**: One-page calculator for initial version
- **Professional Design**: Suitable for mortgage broker client presentations
- **Easy to Understand**: Clear purpose and functionality
- **No Scrolling**: Investment comparisons should be immediately visible
- **Mobile Responsive**: Works on all devices

## Technical Specifications

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for visualizations
- **Design**: Responsive design using CSS Grid and Flexbox
- **Deployment**: GitHub Pages for easy sharing
- **Version Control**: Git with semantic versioning

### Australian Market Defaults
- Property growth: 6% per annum
- Rental growth: 3% per annum
- Property management fee: 7% of rental income
- Insurance: $1,500 per year
- Maintenance: $2,000 per year
- Interest rate: 6.5% per annum
- High yield savings comparison: 4.5% per annum
- ASX200 comparison: 8% per annum

### Development Preferences
- **Simplicity First**: Start with vanilla JavaScript, avoid unnecessary frameworks
- **Professional Appearance**: Clean, mortgage broker-friendly design
- **Real-time Updates**: Auto-calculate values as user types
- **Clear Documentation**: Explain all calculations and assumptions
- **Australian Focus**: All calculations, formatting, and assumptions for Australian market

## File Structure
```
/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # Core calculation logic and UI interactions
├── README.md           # Project documentation
├── CHANGELOG.md        # Version history and features
└── CLAUDE.md          # This file - AI assistant context
```

## Development Guidelines

### When Making Changes
1. **Test thoroughly** with realistic Australian property values
2. **Maintain mobile responsiveness**
3. **Keep mortgage broker use case in mind** - must be professional for client presentations
4. **Document all calculation formulas** and assumptions
5. **Use semantic versioning** for releases
6. **Always run lint/typecheck** commands if available

### Code Style
- Clean, readable JavaScript
- Professional CSS with consistent naming
- Comprehensive comments for complex calculations
- Australian number formatting (e.g., $750,000 not $750000)

### Future Integration Points
- Google Authentication API
- Australian property market APIs (CoreLogic, Domain, PriceFinder)
- Tax calculation libraries
- PDF generation for reports
- Excel export functionality

## API Research Notes

**Investigated Australian Property APIs:**
- **CoreLogic**: Most comprehensive (~$12K/year, industry standard)
- **Domain API**: Has free tier + paid tiers (more accessible for startups)
- **PriceFinder**: Good middle option with reasonable pricing

**Recommendation**: Start with Domain API's free tier, upgrade later as needed.

## Version History
- **v1.1.0** (2025-08-14): Major UX enhancement and professional design release
- **v1.0.0** (2025-08-12): Initial release with all core functionality

## Comprehensive Platform Development Roadmap

### v1.2.0 - Multi-Page Architecture & Enhanced Property Features
**Priority: High - Foundation for platform expansion**
- **Multi-Page Application Structure**
  - Landing page with marketing and feature overview
  - Dedicated calculator page with enhanced UX
  - Professional navigation and responsive design
  - Consistent branding and visual identity
- **Enhanced Property Analysis**
  - Advanced suburb analytics and market trends
  - Property valuation API integration (Domain/CoreLogic)
  - Historical growth data display and comparable analysis
  - Tax calculations (negative gearing, capital gains, depreciation)

### v2.0.0 - User Authentication & Financial Profile Foundation
**Priority: High - Platform transformation begins**
- **Authentication System**
  - Secure user registration and login (Google OAuth + traditional)
  - User role management (Consumer vs Professional)
  - Profile creation and management dashboard
- **Basic Financial Profile Creation**
  - Income & expense input forms
  - Asset & liability tracking (basic)
  - Goal setting interface (short & long-term)
  - Save and retrieve personal financial data

### v2.1.0 - Comprehensive Financial Dashboard
**Priority: High - Core platform value delivery**
- **Complete Financial Overview**
  - Net worth calculations and visualizations
  - Cash flow projections (monthly/quarterly/annual)
  - Asset allocation analysis and recommendations
  - Liability management and optimization suggestions
- **Risk Analysis Engine**
  - Cash flow gap identification and warnings
  - Interest rate sensitivity analysis
  - Market downturn scenario planning
  - Personal financial stress testing

### v3.0.0 - Bespoke Strategy Engine & Professional Tools
**Priority: Medium - Advanced intelligence and professional features**
- **AI-Powered Strategy Recommendations**
  - Personalized investment strategies based on complete financial profile
  - Optimal timing analysis for property purchases
  - Multi-asset portfolio optimization
  - Tax-effective structuring suggestions
- **Professional Client Management**
  - Broker/planner client portfolio management
  - Shared calculation and strategy workspaces
  - Client presentation tools and reporting
  - Professional referral network integration

### v3.1.0 - Advanced Analytics & Reporting
**Priority: Medium - Professional presentation and insights**
- **Comprehensive Reporting Suite**
  - Professional PDF strategy reports
  - Interactive financial dashboards
  - Scenario comparison tools
  - Investment performance tracking over time
- **Advanced Market Integration**
  - Real-time market data integration
  - Economic indicator tracking and alerts
  - Market cycle timing analysis
  - Property market sentiment indicators

### v4.0.0 - Platform Maturation & Global Expansion
**Priority: Future Concept - Market expansion and advanced UX**
- **Multi-Market Support**
  - Expand beyond Australian market (UK, US, Canada)
  - Currency conversion and localization
  - Market-specific assumptions and regulations
- **Advanced UX Enhancements**
  - Dark/Light mode toggle
  - Custom theme builder for professionals (brand colors, logos)
  - Advanced data visualization and interactive charts
  - Mobile app development (iOS/Android)

## Technical Implementation Notes

### Feature 1: Address Autocomplete + Stamp Duty
**Implementation:**
```javascript
// Google Places API integration
const autocomplete = new google.maps.places.Autocomplete(addressInput);
// Extract state from address components
// Lookup stamp duty rates by state and price bracket
```
**APIs Needed:**
- Google Places API (address autocomplete)
- State-specific stamp duty rate tables (static data)

### Feature 2: Property Valuation APIs
**Preferred Integration Order:**
1. **Domain API** (free tier available)
2. **PriceFinder API** (reasonable pricing)
3. **CoreLogic API** (most comprehensive, expensive)

**Implementation Approach:**
- API key management and rotation
- Fallback to manual input if API fails
- Cache results to minimize API calls
- Display data source transparency

### Feature 3: Google Authentication
**Technical Stack:**
```javascript
// Firebase Authentication (Google OAuth)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
```
**Data Storage:**
- Firebase Firestore for user data
- Encrypted property calculations
- User privacy compliance (GDPR/Australian Privacy Act)

### Feature 4: Save/Retrieve Functions
**Database Schema:**
```javascript
// User document structure
{
  userId: string,
  email: string,
  properties: [
    {
      propertyId: string,
      address: string,
      calculationData: object,
      lastModified: timestamp,
      clientId?: string // for brokers
    }
  ]
}
```

### Feature 5: PDF Generation
**Recommended Libraries:**
- jsPDF + html2canvas (client-side)
- Or server-side with Node.js + Puppeteer
**Template Requirements:**
- Professional mortgage broker branding
- Charts and graphs inclusion
- Multi-page layout support

### Feature 6: Portfolio Dashboard
**Architecture:**
- React or Vue.js for complex state management
- Chart.js for advanced visualizations
- Real-time data synchronization
- Mobile-responsive dashboard design

### Feature 7: Theme System (v4.0.0 Concepts)
**Technical Implementation:**
```javascript
// CSS Custom Properties for dynamic theming
:root {
  --primary-color: #667eea;
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-color: #333;
}

[data-theme="dark"] {
  --primary-color: #4f46e5;
  --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --text-color: #e5e7eb;
}

[data-theme="retro"] {
  --primary-color: #ff6b35;
  --bg-gradient: linear-gradient(135deg, #2d1b69 0%, #11213e 100%);
  --font-family: 'Press Start 2P', monospace;
}
```

**Retro Gaming Theme Features:**
- Pixel-perfect 8-bit/16-bit UI components
- CSS animations mimicking classic RPG interfaces
- Sprite-based character avatars
- Chiptune-inspired hover sounds (optional)
- Scanline effects and CRT monitor simulation
- Progress bars styled like health/mana bars

### Feature 8: Internationalization (v4.0.0 Concepts)  
**Technical Stack:**
```javascript
// i18next for translation management
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

// Currency and number formatting
const formatCurrency = (amount, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Market-specific calculations
const getMarketDefaults = (country) => {
  const markets = {
    'AU': { propertyGrowth: 6, rentalGrowth: 3, currency: 'AUD' },
    'US': { propertyGrowth: 4, rentalGrowth: 2.5, currency: 'USD' },
    'UK': { propertyGrowth: 5, rentalGrowth: 2.8, currency: 'GBP' }
  };
  return markets[country] || markets['AU'];
};
```

**Translation Structure:**
```json
{
  "common": {
    "calculate": "Calculate",
    "currency": "AUD",
    "deposit": "Deposit"
  },
  "calculator": {
    "title": "Australian Investment Property Calculator",
    "propertyDetails": "Property Details",
    "mortgageDetails": "Mortgage Details"
  },
  "financial": {
    "stampDuty": "Stamp Duty",
    "lmi": "Lenders Mortgage Insurance",
    "cashFlow": "Cash Flow"
  }
}
```

## Business Impact Analysis

### Revenue Potential by Version
- **v1.1.0**: Increased accuracy = higher broker adoption
- **v2.0.0**: User accounts = subscription model potential
- **v2.1.0**: Professional reports = premium feature
- **v3.0.0**: Portfolio management = enterprise clients

### Development Priorities
1. **Quick Wins** (v1.1.0): Address autocomplete, stamp duty
2. **Market Differentiation** (v1.2.0): Property data integration  
3. **Monetization** (v2.0.0): User authentication, save functions
4. **Professional Tool** (v2.1.0): PDF reports, Excel export
5. **Enterprise Platform** (v3.0.0+): Portfolio management, advanced analytics

## Contact Information
- **Developer**: Jack Chen
- **Email**: jack.chen@brilliantfinancegroup.com.au
- **Business**: Brilliant Finance Group (Mortgage Broker)
- **Repository**: https://github.com/JackGH1-dev/property-investment-calculator

## Notes for Future AI Assistants
- User prefers detailed explanations but concise implementation
- Always consider the mortgage broker perspective and client presentation needs
- Australian market context is crucial - don't use US/global assumptions
- User values professional appearance and ease of use over complex features
- Test suggestions with realistic Australian property scenarios (e.g., $750K purchase, $150K deposit)