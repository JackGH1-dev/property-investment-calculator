# CLAUDE.md - InvestQuest: Australian Property Investment Calculator

## Project Overview

This is a web-based micro-SaaS application that forecasts investment property performance over time for the Australian market. It combines user inputs with market predictors for income, expenses, and growth to project financial outcomes for the next 30 years.

## Target Users

- **Primary**: Mortgage brokers (like Jack Chen from Brilliant Finance Group)
- **Secondary**: Individual property investors
- **Tertiary**: Financial planners and advisors

The tool serves both professionals who can use it to educate and retain clients, and individual investors making property decisions.

## Core Requirements (From Initial Brief)

### Business Context
- **User Profile**: Mortgage broker who deals with clients regularly
- **Use Case**: Advise on investment performance around property and make suggestions using projections to help clients reach their financial goals
- **Market**: Australian property market (not global)
- **Experience Level**: Treat user as someone who has never coded before and never developed an app

### Key Functionality

1. **30-Year Property Investment Forecasting**
   - Property value appreciation over time
   - Rental income projections
   - Cash flow analysis (positive/negative)
   - Complete financial outcome projections

2. **Investment Comparisons**
   - Property investment performance
   - High interest savings accounts
   - S&P 500 Index funds (using ASX200 for Australian context)

3. **Future Versions Should Include**
   - Taxation computations (negative gearing benefits)
   - Capital gains tax calculations when asset is sold
   - Google authentication for account creation
   - Australian property market API integration

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
- **v1.1.0** (2025-01-14): Major UX enhancement and professional design release
- **v1.0.0** (2025-01-12): Initial release with all core functionality

## Future Feature Roadmap

### v1.2.0 - Enhanced Calculations (Next Minor Release)
**Priority: High - Quick wins for mortgage brokers**
- **Enhanced Property Data Integration**
  - Advanced suburb analytics and market trends
  - Historical growth data display
  - Comparable property analysis
- **Advanced Tax Calculations**
  - Negative gearing benefits calculation
  - Capital gains tax scenarios
  - Depreciation schedules
  - Tax-effective investment strategies

### v1.2.0 - Property Data Integration
**Priority: High - Automation and accuracy**
- **Property Valuation API Integration**
  - Automated property value estimates (Domain, CoreLogic, or PriceFinder)
  - Real-time rental yield data
  - Market growth rate suggestions based on suburb
  - User override capability maintained
- **Suburb Analytics**
  - Historical growth data display
  - Market trends and insights
  - Comparable property analysis

### v2.0.0 - User Authentication & Data Management
**Priority: Medium - Platform transformation**
- **Google Authentication System**
  - Secure user login and registration
  - OAuth2 integration for easy signup
  - User profile management
- **Save & Retrieve Property Calculations**
  - Save calculations per property address
  - Client-specific property portfolios
  - Edit and update saved calculations
- **Client Management for Brokers**
  - Create client profiles
  - Assign properties to specific clients
  - Client-specific calculation history

### v2.1.0 - Reporting & Documentation
**Priority: Medium - Professional client presentations**
- **PDF Report Generation**
  - Professional property investment reports
  - Include all calculations, charts, and comparisons
  - Branded reports for mortgage brokers
  - Email delivery capability
- **Excel Export**
  - Detailed spreadsheet with all projections
  - Year-by-year breakdown
  - Customizable report templates

### v3.0.0 - Portfolio Management & Advanced Analytics
**Priority: Low - Advanced platform features**
- **Multi-Property Portfolio Dashboard**
  - Aggregated investment performance across properties
  - Portfolio diversification analysis
  - Combined cash flow projections
  - Risk assessment across portfolio
- **Advanced Comparison Tools**
  - Side-by-side property comparisons
  - Portfolio vs single property analysis
  - Investment strategy optimization
- **Client Dashboard**
  - Individual client portal access
  - Real-time portfolio updates
  - Performance tracking over time

### v3.1.0 - Advanced Financial Calculations
**Priority: Low - Comprehensive financial modeling**
- **Tax Calculation Engine**
  - Negative gearing benefits calculation
  - Capital gains tax scenarios
  - Depreciation schedules
  - Tax-effective investment strategies
- **Advanced Scenarios**
  - Interest rate change modeling
  - Market crash scenarios
  - Early property sale calculations
  - Refinancing impact analysis

### v4.0.0 - Themes & Internationalization (Concept Ideas)
**Priority: Future Concept - UX Enhancement & Global Reach**
- **Theme System**
  - Light/Dark mode toggle
  - **Retro Gaming Theme**: Chrono Cross inspired design with blocky character aesthetics
    - Pixel-art style UI components
    - Retro color palettes and fonts
    - Game-like animations and transitions
    - Character avatars for different user types (broker, investor, etc.)
  - Custom theme builder for brokers (brand colors, logos)
  - Theme persistence and user preferences
- **Multi-Language Support**
  - Complete website translation system
  - Currency conversion and localization
  - Market-specific assumptions per country/region
  - Right-to-left language support
  - Dynamic language switching without page reload
  - Professional translation for mortgage/finance terminology

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