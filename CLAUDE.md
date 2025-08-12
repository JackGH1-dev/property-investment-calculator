# CLAUDE.md - Australian Property Investment Calculator

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
- **v1.0.0** (2025-01-12): Initial release with all core functionality
- **Future v1.1.0**: Planned minor improvements
- **Future v2.0.0**: Major features (auth, API integration, taxation)

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