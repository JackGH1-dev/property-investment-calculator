# 🎨 InvestQuest Design System

## Overview

InvestQuest is evolving from a single-page property calculator into a comprehensive multi-page financial planning platform. Our design system emphasizes scalability, consistency, and professional appeal across all user touchpoints while maintaining the trust and credibility essential for financial services.

## Multi-Page Application Architecture

### Page Structure & Hierarchy
```
📄 Landing Page (index.html)
├── 🎯 Hero Section - Value proposition and key benefits
├── ✨ Features Overview - Core functionality showcase  
├── 👥 Target Audience - Professionals vs consumers
├── 🚀 How It Works - Step-by-step process
└── 📞 Call-to-Action - Drive users to calculator

📊 Property Calculator (calculator.html)  
├── 🏠 Property Input Form - Comprehensive property details
├── 📈 Results Dashboard - 30-year projections and insights
├── 📊 Investment Comparisons - Property vs other assets
└── 📚 Educational Content - Investment fundamentals

🔮 Future Pages (Roadmap)
├── 👤 User Profile/Dashboard - Financial overview
├── 💰 Income & Expenses - Cash flow management
├── 🏦 Assets & Liabilities - Net worth tracking  
├── 🎯 Goals & Strategy - Bespoke planning
└── 📊 Professional Dashboard - Client management
```

### Navigation Design Principles
- **Persistent Navigation**: Consistent header across all pages
- **Progressive Disclosure**: More advanced features unlocked through user journey
- **Professional Credibility**: Clean, trustworthy design suitable for broker presentations
- **Mobile-First**: Responsive navigation that works on all devices

### Page-Specific Design Guidelines

#### Landing Page Design Goals
- **Convert visitors** into calculator users
- **Build trust** through professional design and clear value proposition
- **Educate** about platform capabilities without overwhelming
- **Differentiate** between consumer and professional use cases

#### Calculator Page Design Goals  
- **Maximize usability** with intuitive form design and real-time feedback
- **Present complex data** clearly through charts and visual hierarchies
- **Encourage exploration** through educational content and insights
- **Maintain focus** on core calculation tasks without distraction

#### Future Dashboard Pages Design Goals
- **Comprehensive overview** of user's complete financial picture
- **Actionable insights** with clear next steps and recommendations  
- **Professional presentation** suitable for client meetings
- **Data visualization** that makes complex financial concepts accessible

## Design Philosophy

### Core Principles
1. **Calm Sophistication** - Deep, earthy tones and calming blues create stability and serenity
2. **Bold Expression** - Oversized, variable fonts establish brand personality while maintaining professionalism
3. **Minimalist Clarity** - Clean, uncluttered layouts with purposeful white space build trust
4. **Vivid Organization** - Big blocks with strong contrast create visually striking, scannable content
5. **Subtle Motion** - Micro-interactions and transitions add polish without overwhelming
6. **Universal Access** - Dark mode, mobile-first, and accessibility-first design
7. **Interactive Engagement** - Gamified elements boost engagement while remaining professional

### Target Aesthetic
- **Modern Fintech Excellence** - Inspired by Canva's bold layouts and Pepperstone's professional trading platform
- **Calm Confidence** - Earthy tones and calming colors evoke stability and trust
- **Interactive Intelligence** - Guided flows and animated feedback create engaging experiences
- **Adaptive Beauty** - Seamless experience across all devices and lighting conditions

## Color System

### Primary Palette - Calm & Rich
```css
/* Deep Forest & Ocean Blues (Stability & Trust) */
--primary-900: #0f172a  /* Deep slate for backgrounds */
--primary-800: #1e293b  /* Rich dark blue-gray */
--primary-700: #334155  /* Main brand color - sophisticated slate */
--primary-600: #475569  /* Medium slate */
--primary-500: #64748b  /* Interactive elements - balanced slate */
--primary-400: #94a3b8  /* Light slate */
--primary-300: #cbd5e1  /* Soft gray-blue */
--primary-200: #e2e8f0  /* Very light slate */
--primary-100: #f1f5f9  /* Nearly white slate */
--primary-50: #f8fafc   /* Subtle slate tint */

/* Calming Accent Blues */
--accent-900: #164e63   /* Deep teal */
--accent-700: #0891b2   /* Rich cyan */
--accent-500: #06b6d4   /* Bright cyan - CTA color */
--accent-300: #67e8f9   /* Light cyan */
--accent-100: #cffafe   /* Pale cyan */

/* Earthy Neutrals */
--earth-900: #292524    /* Rich brown */
--earth-700: #44403c    /* Warm gray */
--earth-500: #78716c    /* Medium warm gray */
--earth-300: #d6d3d1    /* Light warm gray */
--earth-100: #f5f5f4    /* Warm white */
```

### Semantic Colors
```css
/* Success (Positive Cash Flow, Good Performance) */
--success-600: #059669  /* Dark green for text */
--success-500: #10b981  /* Standard green */
--success-50: #ecfdf5   /* Light green backgrounds */

/* Warning (Neutral/Caution) */
--warning-500: #f59e0b  /* Amber for warnings */
--warning-50: #fffbeb   /* Light amber backgrounds */

/* Error (Negative Cash Flow, High Risk) */
--error-500: #ef4444   /* Red for errors/negatives */
--error-50: #fef2f2    /* Light red backgrounds */

/* Neutrals (Text & Surfaces) */
--gray-900: #111827    /* Primary text */
--gray-800: #1f2937    
--gray-700: #374151    
--gray-600: #4b5563    /* Secondary text */
--gray-500: #6b7280    
--gray-300: #d1d5db    /* Borders */
--gray-200: #e5e7eb    /* Light borders */
--gray-100: #f3f4f6    /* Light backgrounds */
--gray-50: #f9fafb     /* Subtle backgrounds */
```

### Background System

#### Light Mode
- **Primary Background**: Rich gradient (`linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`)
- **Card Surfaces**: Pure white (`#ffffff`) with rich shadows
- **Secondary Surfaces**: `--primary-50` (#f8fafc) for subtle contrast
- **Accent Surfaces**: `--accent-100` (#cffafe) for highlights

#### Dark Mode
- **Primary Background**: Deep gradient (`linear-gradient(135deg, #020617 0%, #0f172a 100%)`)
- **Card Surfaces**: `--primary-800` (#1e293b) with enhanced shadows
- **Secondary Surfaces**: `--primary-700` (#334155) for contrast
- **Text Colors**: Light variants with proper contrast ratios

### Dark Mode Implementation
```css
[data-theme="dark"] {
    --bg-primary: linear-gradient(135deg, #020617 0%, #0f172a 100%);
    --surface-primary: #1e293b;
    --surface-secondary: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --border-color: #475569;
}

/* Dark mode toggle button */
.theme-toggle {
    background: var(--accent-500);
    border-radius: 20px;
    padding: 8px 16px;
    transition: all 0.3s ease;
}
```

## Typography

### Font System - Bold & Expressive
**Primary**: Inter Variable (Google Fonts)
- Modern variable font with expressive weight range
- Excellent for oversized headlines and data display
- Professional yet bold personality
- Optimized for financial interfaces

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-variation-settings: 'wght' 400; /* Use variable font when available */
```

### Typography Scale - Bold & Hierarchical
```css
/* Oversized Headers for Brand Personality */
h1: 4rem (64px)      /* Hero title - Bold brand presence */
h1.hero: 5rem (80px) /* Extra large for landing impact */
h2: 2.5rem (40px)    /* Section headers - Strong hierarchy */
h3: 1.75rem (28px)   /* Subsection headers */
h4: 1.25rem (20px)   /* Card titles */

/* Financial Data Display */
.financial-large: 3rem (48px)    /* Key financial figures */
.financial-medium: 2rem (32px)   /* Secondary figures */
.percentage: 1.5rem (24px)       /* Percentage displays */

/* Body Text - Enhanced Readability */
Base: 1.125rem (18px)     /* Larger base for better readability */
Small: 1rem (16px)        /* Helper text, labels */
Caption: 0.875rem (14px)  /* Captions, disclaimers */

/* Interactive Elements */
Button Text: 1.125rem (18px) /* Bold, readable CTAs */
Input Text: 1rem (16px)      /* Prevents iOS zoom */
```

### Font Weights
```css
font-weight: 400; /* Regular - body text */
font-weight: 500; /* Medium - secondary emphasis */
font-weight: 600; /* Semibold - labels, small headers */
font-weight: 700; /* Bold - important information */
font-weight: 800; /* Extra bold - main headings */
```

### Line Heights
```css
line-height: 1.2;  /* Tight - headers */
line-height: 1.4;  /* Compact - cards, small text */
line-height: 1.5;  /* Standard - body text */
line-height: 1.6;  /* Loose - long form content */
```

## Spacing System

### Base Unit: 8px Grid
All spacing follows 8px increments for visual consistency:

```css
--space-xs: 4px;   /* Tiny gaps */
--space-sm: 8px;   /* Small spacing */
--space-md: 16px;  /* Standard spacing */
--space-lg: 24px;  /* Large spacing */
--space-xl: 32px;  /* Extra large spacing */
--space-2xl: 48px; /* Section spacing */
--space-3xl: 64px; /* Major section spacing */
```

### Application Guidelines
- **Component Padding**: 16px-24px (comfortable touch targets)
- **Card Spacing**: 20px-24px internal padding
- **Section Margins**: 30px-40px between major sections
- **Form Element Margins**: 16px between fields, 12px for labels

## Component Design

### Cards & Panels
```css
/* Standard Card */
background: #ffffff;
border-radius: 16px;           /* Rounded for modern look */
box-shadow: var(--shadow-lg);  /* Subtle depth */
border: 1px solid var(--border-light);
padding: 24px;
transition: all 0.2s ease;     /* Smooth interactions */

/* Hover State */
transform: translateY(-2px);
box-shadow: var(--shadow-xl);
```

### Form Elements
```css
/* Input Fields */
padding: 12px;
border: 2px solid var(--border-light);
border-radius: 8px;
font-size: 1rem;
font-family: inherit;
transition: all 0.2s ease;

/* Focus State */
border-color: var(--primary-500);
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
outline: none;
```

### Buttons
```css
/* Primary Button */
padding: 15px 24px;
background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
color: white;
border: none;
border-radius: 10px;
font-weight: 600;
font-size: 1.1rem;
cursor: pointer;
transition: all 0.2s ease;

/* Hover State */
transform: translateY(-2px);
box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
```

## Shadow System

### Elevation Levels
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Usage Guidelines
- **Cards**: `--shadow-lg` for main content cards
- **Hover States**: `--shadow-xl` for interactive feedback
- **Subtle Elements**: `--shadow-sm` for minimal depth
- **Floating Elements**: `--shadow-xl` for modals, dropdowns

## Layout & Grid

### Container System
```css
.container {
    max-width: 1400px;  /* Accommodates wide content */
    margin: 0 auto;
    padding: 20px;
}

/* Responsive Containers */
@media (max-width: 768px) {
    .container {
        padding: 16px;
    }
}
```

### Grid Systems
```css
/* Two-Column Calculator Layout */
.calculator-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    min-height: 70vh;
}

/* Responsive Cards */
.explanation-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (max-width: 480px)  { /* Small phones */ }
@media (max-width: 768px)  { /* Tablets/large phones */ }
@media (max-width: 1024px) { /* Small laptops */ }
@media (max-width: 1200px) { /* Standard laptops */ }
/* 1200px+ is desktop */
```

### Touch Targets
- **Minimum Touch Target**: 44px × 44px (iOS/Android guidelines)
- **Button Padding**: 12px minimum vertical, 16px horizontal
- **Form Inputs**: 48px minimum height on mobile

## Motion Design & Micro-Interactions

### Sophisticated Animations
```css
/* Smooth, Professional Transitions */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Material Design easing */

/* Card Hover Effects - Subtle Lift */
.card:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Button Micro-Interactions */
.cta-button {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.cta-button:hover::before {
    left: 100%;
}

/* Progress Animations */
@keyframes progressGrow {
    from { width: 0%; }
    to { width: var(--progress-width); }
}

/* Floating Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

/* Number Counter Animation */
@keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

### Motion Guidelines
- **Duration**: 0.3s for micro-interactions, 0.5s for data animations
- **Easing**: Cubic-bezier curves for natural, premium feel
- **Stagger Effects**: Animate elements in sequence for elegance
- **Scroll Triggers**: Reveal content as user scrolls
- **Loading States**: Smooth skeleton screens and progress indicators

### Gamified Elements
```css
/* Achievement-Style Notifications */
.insight-achievement {
    background: linear-gradient(135deg, #10b981, #059669);
    border-radius: 12px;
    padding: 16px;
    position: relative;
    overflow: hidden;
    animation: slideInRight 0.6s ease-out;
}

.insight-achievement::before {
    content: '🎯';
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 3rem;
    opacity: 0.1;
    animation: float 3s ease-in-out infinite;
}

/* Step-by-Step Progress */
.calculation-steps {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;
}

.step {
    background: var(--primary-100);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.4s ease;
}

.step.active {
    background: var(--accent-500);
    color: white;
    transform: scale(1.2);
}

.step.completed {
    background: var(--success-500);
    color: white;
}
```

## Accessibility

### Color Contrast
- **Text on White**: Minimum 4.5:1 ratio (WCAG AA)
- **Text on Navy**: Use white or light colors with sufficient contrast
- **Interactive Elements**: Clear focus states with 3px outline

### Keyboard Navigation
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Tab Order**: Logical flow through form elements
- **Skip Links**: For screen reader users

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy (h1 > h2 > h3)
- **ARIA Labels**: Descriptive labels for form inputs
- **Alt Text**: Meaningful descriptions for icons and images

## Content Guidelines

### Tone of Voice
- **Professional but Approachable**: Like a knowledgeable mortgage broker
- **Data-Driven**: Let numbers speak, avoid sales-y language
- **Educational**: Explain concepts without being condescending
- **Compliant**: Avoid financial advice, present calculations only

### Number Formatting
```javascript
// Currency Formatting
$750,000  // Standard Australian format
$1.2M     // Abbreviated for large numbers
4.5%      // Percentage with one decimal

// Insights Language
"Based on these assumptions..."     // Safe, factual
"This projection shows..."          // Neutral analysis  
"Consider consulting professionals"  // Compliance-friendly
```

## Brand Elements

### Logo & Identity
- **Primary Mark**: 🎯 InvestQuest 
- **Color**: White on navy background, navy on light backgrounds
- **Emoji**: Target emoji (🎯) represents accuracy and goals

### Iconography
- **Financial Icons**: 💰 🏠 📊 📈 🏦 💼 📚 ⚖️
- **Status Icons**: ✅ ⚠️ ❌ ℹ️ 🔍 🎯
- **Consistent Style**: Use emoji for warmth, supplement with SVG icons for UI

## Design Tokens (CSS Custom Properties)

All design values should be stored as CSS custom properties for consistency:

```css
:root {
    /* Colors */
    --primary-500: #3b82f6;
    --success-500: #10b981;
    --error-500: #ef4444;
    
    /* Typography */
    --font-family: 'Inter', sans-serif;
    --font-size-base: 1rem;
    --line-height-base: 1.5;
    
    /* Spacing */
    --space-md: 16px;
    --space-lg: 24px;
    
    /* Borders */
    --border-radius: 8px;
    --border-radius-lg: 16px;
    
    /* Shadows */
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## Multi-Page Component Patterns

### Global Navigation Component
```css
/* Persistent header across all pages */
.global-nav {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--gray-200);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 72px;
    max-width: 1400px;
    margin: 0 auto;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--primary-700);
}

.nav-links {
    display: flex;
    gap: 32px;
    align-items: center;
}

.nav-link {
    font-weight: 500;
    color: var(--gray-700);
    text-decoration: none;
    transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary-600);
}

.nav-cta {
    background: var(--primary-600);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
}

.nav-cta:hover {
    background: var(--primary-700);
}
```

### Page-Specific Layout Patterns

#### Landing Page Layout
```css
/* Hero section with strong visual hierarchy */
.hero {
    min-height: 80vh;
    background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 20px;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 24px;
    line-height: 1.1;
}

.hero-subtitle {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    opacity: 0.9;
    margin-bottom: 40px;
    line-height: 1.4;
}

/* Feature sections with consistent spacing */
.section {
    padding: 80px 20px;
}

.section:nth-child(even) {
    background: var(--gray-50);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
}
```

#### Calculator Page Layout
```css
/* Two-column calculator with flexible panels */
.calculator-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: calc(100vh - 72px);
}

.input-panel,
.results-panel {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: var(--shadow-lg);
    height: fit-content;
}

.input-panel {
    position: sticky;
    top: 92px; /* Nav height + margin */
}

@media (max-width: 1024px) {
    .calculator-layout {
        grid-template-columns: 1fr;
        gap: 24px;
    }
    
    .input-panel {
        position: static;
    }
}
```

### Responsive Design Patterns

#### Mobile-First Navigation
```css
/* Mobile hamburger menu */
@media (max-width: 768px) {
    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 20px;
        box-shadow: var(--shadow-lg);
    }
    
    .nav-links.active {
        display: flex;
    }
    
    .nav-toggle {
        display: block;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
}

@media (min-width: 769px) {
    .nav-toggle {
        display: none;
    }
}
```

#### Adaptive Typography Scale
```css
/* Fluid typography that scales with viewport */
.display-1 { font-size: clamp(2.5rem, 5vw, 4rem); }
.display-2 { font-size: clamp(2rem, 4vw, 3rem); }
.heading-1 { font-size: clamp(1.75rem, 3vw, 2.5rem); }
.heading-2 { font-size: clamp(1.5rem, 2.5vw, 2rem); }
.heading-3 { font-size: clamp(1.25rem, 2vw, 1.5rem); }
.body-large { font-size: clamp(1.125rem, 1.5vw, 1.25rem); }
.body { font-size: clamp(1rem, 1.2vw, 1.125rem); }
.caption { font-size: clamp(0.875rem, 1vw, 1rem); }
```

### Interactive State Patterns

#### Loading and Transition States
```css
/* Page transition animations */
.page-enter {
    opacity: 0;
    transform: translateY(20px);
}

.page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s;
}

/* Loading skeleton for data-heavy components */
.skeleton {
    background: linear-gradient(90deg, 
        var(--gray-200) 25%, 
        var(--gray-100) 50%, 
        var(--gray-200) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    border-radius: 4px;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

/* Interactive feedback for forms and buttons */
.interactive-feedback {
    position: relative;
    overflow: hidden;
}

.interactive-feedback::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.interactive-feedback:active::after {
    width: 300px;
    height: 300px;
}
```

## Future Design Considerations

### Planned Enhancements
- **Dark Mode**: Alternative color scheme for low-light usage
- **Custom Themes**: Branded themes for different mortgage broker clients
- **Advanced Animations**: Micro-interactions for data visualization
- **Print Styles**: Professional PDF-ready layouts

### Scalability
- **Component Library**: Systematic approach to reusable components
- **Design System Documentation**: Living style guide
- **Performance**: Optimized fonts, images, and CSS delivery
- **Maintenance**: Regular design system audits and updates

## Implementation Notes

### CSS Architecture
```
styles.css structure:
1. CSS Custom Properties (Design Tokens)
2. Typography System  
3. Layout System
4. Component Styles
5. Interactive States
6. Responsive Design
7. Utility Classes
```

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features**: Grid, Flexbox, Custom Properties, Backdrop Blur
- **Progressive Enhancement**: Graceful degradation for older browsers

---

**Last Updated**: August 19, 2025  
**Version**: 1.1.0  
**Maintained By**: InvestQuest Design Team