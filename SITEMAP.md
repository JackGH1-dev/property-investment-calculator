# 🗺️ InvestQuest Platform Sitemap

**Document Version:** 1.0  
**Last Updated:** August 19, 2025  
**Status:** Planning Document  

## Overview

This sitemap outlines the complete InvestQuest platform architecture from current v1.1.0 through planned v3.1.0+ features. It serves as a reference for information architecture, user flows, and development planning across all platform evolution phases.

## Phase 1: Multi-Page Foundation (v1.2.0 - Current Priority)

### Core Pages Structure
```
📄 HOME (Landing Page) - index.html
├── Hero Section
├── Features Overview  
├── Target Audiences (Consumers vs Professionals)
├── How It Works
├── Testimonials/Trust Indicators
├── CTA to Calculator
└── Footer (About, Contact, Legal)

📊 PROPERTY CALCULATOR - calculator.html
├── Property Input Form (Left Panel)
├── Results Dashboard (Right Panel)
├── 30-Year Projections & Charts
├── Investment Comparisons
├── Educational Content
└── Back to Home Navigation

🔗 GLOBAL NAVIGATION (All Pages)
├── Logo/Brand → Home
├── Home → index.html
├── Calculator → calculator.html
└── CTA Button → Calculator or Back to Home
```

### Implementation Notes
- **Priority**: Immediate development focus
- **Goals**: Professional landing page, dedicated calculator, consistent navigation
- **User Flow**: Home → Calculator → Results → Back to Home

## Phase 2: User Profiles & Authentication (v2.0.0)

### Enhanced Pages Structure
```
📄 HOME (Enhanced)
├── Existing landing content
├── Sign Up/Login CTAs
├── Feature differentiation (Free vs Registered)
└── Professional vs Consumer paths

🔐 AUTHENTICATION SYSTEM
├── SIGN UP - signup.html
│   ├── User Type Selection (Consumer/Professional)
│   ├── Basic Profile Creation
│   ├── Email/Password or Google OAuth
│   └── → Dashboard (post signup)
│
├── LOGIN - login.html
│   ├── Email/Password Login
│   ├── Google OAuth Option
│   ├── Forgot Password
│   └── → Dashboard (post login)
│
└── FORGOT PASSWORD - forgot-password.html
    └── → Email Reset → Login

📊 PROPERTY CALCULATOR (Enhanced)
├── Same core functionality
├── Save Calculation (logged in users)
├── Load Previous Calculations
└── Share Results (for professionals)

👤 USER DASHBOARD - dashboard.html
├── Profile Overview
├── Saved Calculations
├── Quick Actions
├── → Financial Profile Setup
├── → Goals & Strategy
└── Navigation to all user features
```

### Implementation Notes
- **Priority**: High - Platform transformation
- **Goals**: User accounts, saved data, personalization
- **User Flow**: Home → Sign Up → Dashboard → Feature Access

## Phase 3: Comprehensive Financial Planning (v2.1.0)

### Financial Management Pages
```
👤 USER DASHBOARD (Expanded)
├── Complete Financial Overview
├── Net Worth Summary
├── Cash Flow Status
├── Goal Progress
├── Recent Activity
└── Quick Navigation Menu

💰 INCOME & EXPENSES - income-expenses.html
├── Income Sources Management
├── Expense Categories & Tracking
├── Cash Flow Projections
├── Monthly/Quarterly Views
├── Risk Analysis & Warnings
└── → Assets & Liabilities

🏦 ASSETS & LIABILITIES - assets-liabilities.html
├── Property Portfolio
├── Investment Accounts
├── Savings & Bank Accounts
├── Loans & Debt Management
├── Net Worth Calculations
├── Asset Allocation Charts
└── → Goals & Strategy

🎯 GOALS & STRATEGY - goals-strategy.html
├── Short-term Goals (1-5 years)
├── Long-term Objectives (10-30 years)
├── Retirement Planning
├── Education Funding
├── Strategy Recommendations
├── Progress Tracking
└── → Bespoke Analysis

📊 FINANCIAL ANALYSIS - analysis.html
├── Complete Financial Health
├── Risk Assessment
├── Scenario Planning
├── Market Sensitivity Analysis
├── Recommendation Engine
└── → Professional Consultation
```

### Implementation Notes
- **Priority**: High - Core platform value
- **Goals**: Holistic financial planning, risk analysis, personalized strategies
- **User Flow**: Dashboard → Financial Profile → Analysis → Strategy → Implementation

## Phase 4: Professional Tools (v3.0.0)

### Professional User Pages
```
🏢 PROFESSIONAL DASHBOARD - pro-dashboard.html
├── Client Overview
├── Portfolio Management
├── Recent Client Activity
├── Professional Tools Access
└── Revenue/Performance Metrics

👥 CLIENT MANAGEMENT - clients.html
├── Client List & Profiles
├── Add New Client
├── Client Financial Summaries
├── Shared Calculations
├── Communication History
└── → Individual Client Pages

👤 CLIENT PROFILE - client/[id].html
├── Client Financial Overview
├── Property Calculations History
├── Shared Documents
├── Communication Log
├── Strategy Recommendations
├── Next Actions/Follow-ups
└── → Create New Analysis

📈 PROFESSIONAL TOOLS - pro-tools.html
├── Bulk Analysis Tools
├── Market Data & Insights
├── Report Generation
├── White-label Customization
├── API Access
└── Training Resources

📋 REPORTS & PRESENTATIONS - reports.html
├── Saved Reports
├── Report Templates
├── PDF Generation
├── Client Presentation Mode
├── Sharing & Distribution
└── Custom Branding Options
```

### Implementation Notes
- **Priority**: Medium - Professional market expansion
- **Goals**: B2B tools, client management, revenue generation
- **User Flow**: Pro Dashboard → Client Management → Analysis → Reporting → Presentation

## Phase 5: Advanced Platform Features (v3.1.0+)

### Advanced Feature Pages
```
📊 MARKET INSIGHTS - market.html
├── Australian Property Market Data
├── Suburb Analytics
├── Market Trends & Forecasting
├── Economic Indicators
├── Investment Opportunities
└── Market Alerts

📚 EDUCATION CENTER - education.html
├── Investment Fundamentals
├── Property Market Guides
├── Tax & Legal Information
├── Strategy Tutorials
├── Webinars & Resources
├── Professional Certification
└── → Learning Paths

⚙️ SETTINGS & PREFERENCES - settings.html
├── Profile Management
├── Notification Preferences
├── Privacy & Security
├── Subscription Management
├── Data Export/Import
├── API Configuration
└── Account Deletion

📞 SUPPORT & HELP - support.html
├── Help Documentation
├── Video Tutorials
├── Contact Support
├── Feature Requests
├── System Status
└── Community Forum
```

### Implementation Notes
- **Priority**: Medium - Platform maturation
- **Goals**: Advanced analytics, education, user support
- **User Flow**: Context-driven access from primary workflows

## Information Architecture Hierarchy

### Navigation Levels
```
LEVEL 1 (Main Navigation)
├── Home
├── Calculator  
├── Dashboard (authenticated)
└── Support

LEVEL 2 (Dashboard Sub-Navigation)
├── Financial Profile
│   ├── Income & Expenses
│   ├── Assets & Liabilities
│   └── Goals & Strategy
├── Analysis & Reports
├── Professional Tools (pro users)
└── Settings

LEVEL 3 (Detailed Views)
├── Individual Property Analysis
├── Client-Specific Pages
├── Specific Goal Planning
└── Detailed Reports
```

## User Journey Flows

### Consumer User Flow
```
Home → Sign Up → Dashboard → Financial Profile Setup → 
Property Calculator → Analysis → Goals & Strategy → 
Ongoing Management
```

### Professional User Flow
```
Home → Professional Sign Up → Pro Dashboard → 
Client Management → Client Analysis → 
Report Generation → Client Presentation
```

### Guest User Flow
```
Home → Property Calculator → Results → 
Sign Up Prompt → Registration → Save Results
```

## Cross-Page Navigation Systems

### Persistent Navigation Elements
```
🔗 GLOBAL NAVIGATION (All Pages)
├── Logo → Home
├── Main Menu → Primary sections
├── User Menu → Profile, Settings, Logout
├── Search → Find calculations, clients, resources
└── Help → Support and documentation
```

### Contextual Navigation Elements
```
🔗 CONTEXTUAL NAVIGATION
├── Breadcrumbs → Show current location
├── Related Actions → Next logical steps  
├── Quick Links → Frequently accessed features
└── Progressive Disclosure → Advanced features
```

## Mobile Responsive Considerations

### Mobile-Specific Adaptations
```
📱 RESPONSIVE DESIGN REQUIREMENTS
├── Collapsible Navigation Menu
├── Touch-Friendly Interface Elements
├── Simplified Multi-Step Processes
├── Offline Calculation Capability
└── Native App Integration Points (future)
```

### Mobile User Flow Optimizations
- **Simplified onboarding** process
- **One-handed navigation** design
- **Quick action shortcuts** for frequent tasks
- **Progressive data entry** for complex forms

## Technical Implementation Notes

### URL Structure
```
Production Domain: investquest.app (example)

Static Pages:
├── / (home)
├── /calculator
├── /signup
├── /login
└── /support

Authenticated Pages:
├── /dashboard
├── /profile
├── /income-expenses
├── /assets-liabilities
├── /goals-strategy
└── /analysis

Professional Pages:
├── /pro-dashboard
├── /clients
├── /client/{id}
├── /reports
└── /pro-tools
```

### SEO Considerations
- **Unique page titles** and meta descriptions
- **Structured data** for property calculator
- **Internal linking** strategy between related pages
- **Mobile-first indexing** optimization

## Future Expansion Possibilities

### Additional Page Types (v4.0.0+)
- **API Documentation** - for third-party integrations
- **Partner Portal** - for broker partnerships
- **Community Forum** - user discussions and Q&A
- **Marketplace** - for professional services
- **Mobile App** - native iOS/Android applications

### International Expansion
- **Country-specific calculators** (UK, US, Canada)
- **Multi-currency support** and localization
- **Regional compliance** and legal requirements

## Maintenance and Updates

### Regular Review Schedule
- **Monthly**: User flow analysis and optimization
- **Quarterly**: Sitemap updates based on user feedback
- **Annually**: Complete information architecture review

### Version Control
- Track sitemap changes with platform development
- Maintain backward compatibility for existing users
- Document migration paths for major structural changes

---

**Document Status:** Planning reference for InvestQuest platform development  
**Next Review:** November 2025  
**Maintained by:** InvestQuest Development Team