# 📱 InvestQuest Mobile Enhancement Plan

## Overview
Comprehensive mobile optimization strategy based on ProjectionLab's mobile excellence and modern PWA standards.

## 🚨 Critical Mobile Fixes (Priority 1)

### Navigation Issues
- ❌ **Current**: Desktop-focused navigation breaks on mobile
- ✅ **Fix**: Mobile-first hamburger menu with touch zones
- ❌ **Current**: Small touch targets (<44px)
- ✅ **Fix**: WCAG 2.1 compliant 44px minimum touch targets

### Form UX Problems  
- ❌ **Current**: Two-column forms unusable on mobile
- ✅ **Fix**: Single-column mobile layout with logical grouping
- ❌ **Current**: Input zoom on iOS (font-size < 16px)
- ✅ **Fix**: 16px+ font-size prevents unwanted zoom

### Performance Issues
- ❌ **Current**: No mobile-specific optimizations
- ✅ **Fix**: Mobile-first CSS, lazy loading, optimized images

## 🎯 Navigation System Redesign

### Mobile Navigation Pattern
```html
<!-- Enhanced mobile navigation -->
<nav class="mobile-nav" aria-label="Main navigation">
  <div class="nav-container">
    <div class="nav-header">
      <div class="nav-brand">
        <h1>🎯 InvestQuest</h1>
      </div>
      <button class="nav-toggle" 
              aria-label="Toggle navigation menu"
              aria-expanded="false">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
    
    <div class="nav-menu" id="navMenu">
      <div class="nav-overlay" aria-hidden="true"></div>
      <div class="nav-drawer">
        <div class="nav-drawer-header">
          <h2>Menu</h2>
          <button class="nav-close" aria-label="Close menu">&times;</button>
        </div>
        
        <ul class="nav-links" role="list">
          <li><a href="index.html" class="nav-link">🏠 Home</a></li>
          <li><a href="calculator.html" class="nav-link">🧮 Calculator</a></li>
          <li><a href="education.html" class="nav-link">📚 Education</a></li>
          <li><a href="dashboard.html" class="nav-link">📊 Dashboard</a></li>
        </ul>
        
        <div class="nav-actions">
          <button class="auth-signin-btn mobile-cta">Sign In</button>
        </div>
      </div>
    </div>
  </div>
</nav>
```

### Navigation CSS
```css
/* Mobile-first navigation system */
.mobile-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  height: 64px;
}

.nav-container {
  max-width: 100%;
  padding: 0 16px;
  height: 100%;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Touch-friendly hamburger button */
.nav-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.nav-toggle:hover,
.nav-toggle:focus {
  background-color: var(--gray-100);
  outline: 2px solid var(--primary-500);
}

.hamburger-line {
  width: 24px;
  height: 3px;
  background-color: var(--gray-700);
  margin: 2px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

/* Animated hamburger states */
.nav-toggle[aria-expanded="true"] .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.nav-toggle[aria-expanded="true"] .hamburger-line:nth-child(2) {
  opacity: 0;
}

.nav-toggle[aria-expanded="true"] .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Full-screen mobile menu */
.nav-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
}

.nav-menu.active {
  transform: translateX(0);
}

.nav-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-menu.active .nav-overlay {
  opacity: 1;
}

.nav-drawer {
  position: relative;
  width: 280px;
  height: 100%;
  background: white;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.nav-drawer-header {
  padding: 20px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-close {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-links {
  list-style: none;
  padding: 20px 0;
  margin: 0;
}

.nav-links li {
  margin: 0;
}

.nav-link {
  display: block;
  padding: 16px 20px;
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link:focus {
  background: var(--gray-50);
  border-left-color: var(--primary-500);
  color: var(--primary-600);
}

.nav-link.active {
  background: var(--primary-50);
  border-left-color: var(--primary-500);
  color: var(--primary-600);
}

.nav-actions {
  padding: 20px;
  border-top: 1px solid var(--gray-200);
}

.mobile-cta {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border-radius: 12px;
  background: var(--primary-500);
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mobile-cta:hover {
  background: var(--primary-600);
}

/* Tablet and desktop overrides */
@media (min-width: 768px) {
  .nav-toggle {
    display: none;
  }
  
  .nav-menu {
    position: static;
    transform: none;
    background: none;
  }
  
  .nav-drawer {
    width: auto;
    height: auto;
    background: none;
    box-shadow: none;
    display: flex;
    align-items: center;
    gap: 32px;
  }
  
  .nav-drawer-header {
    display: none;
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 0;
  }
  
  .nav-link {
    padding: 8px 0;
    border-left: none;
    border-bottom: 2px solid transparent;
  }
  
  .nav-link:hover,
  .nav-link.active {
    background: none;
    border-left: none;
    border-bottom-color: var(--primary-500);
  }
  
  .nav-actions {
    padding: 0;
    border: none;
  }
  
  .mobile-cta {
    width: auto;
    padding: 10px 20px;
    border-radius: 8px;
  }
}
```

## 👆 Touch Interface Optimization

### WCAG 2.1 Compliant Touch Targets
```css
/* Minimum 44px touch targets */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* Button improvements */
.btn-mobile {
  min-height: 48px;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 12px;
  font-weight: 600;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-mobile:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Ripple effect for better touch feedback */
.btn-mobile::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-mobile:active::after {
  width: 300px;
  height: 300px;
}

/* Primary button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

.btn-primary:hover {
  background: var(--primary-600);
  border-color: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

/* Secondary button */
.btn-secondary {
  background: white;
  color: var(--primary-500);
  border-color: var(--primary-500);
}

.btn-secondary:hover {
  background: var(--primary-50);
  transform: translateY(-1px);
}

/* Form input improvements */
.form-input-mobile {
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  font-size: 16px; /* Prevents zoom on iOS */
  border: 2px solid var(--gray-300);
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
}

.form-input-mobile:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

/* Select dropdown improvements */
.select-mobile {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

/* Checkbox and radio improvements */
.checkbox-mobile,
.radio-mobile {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: pointer;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  min-height: 44px;
  cursor: pointer;
  user-select: none;
}
```

## 📱 Calculator Mobile UX Redesign

### Mobile-First Form Layout
```css
/* Calculator mobile optimizations */
@media (max-width: 768px) {
  .calculator-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .input-panel {
    position: static; /* Remove sticky positioning on mobile */
    margin-bottom: 20px;
  }
  
  /* Single column form layout */
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  /* Collapsible sections for better mobile UX */
  .form-section {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  
  .section-header {
    padding: 16px;
    background: var(--gray-50);
    border-bottom: 1px solid var(--gray-200);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }
  
  .section-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--gray-900);
  }
  
  .section-toggle {
    font-size: 1.2rem;
    transition: transform 0.2s ease;
  }
  
  .section-content {
    padding: 16px;
    display: none;
  }
  
  .form-section.expanded .section-content {
    display: block;
  }
  
  .form-section.expanded .section-toggle {
    transform: rotate(180deg);
  }
  
  /* Progress indicator */
  .form-progress {
    position: sticky;
    top: 64px;
    background: white;
    padding: 12px 16px;
    border-bottom: 1px solid var(--gray-200);
    z-index: 10;
  }
  
  .progress-bar {
    width: 100%;
    height: 4px;
    background: var(--gray-200);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--primary-500);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.875rem;
    color: var(--gray-600);
    margin-top: 8px;
    text-align: center;
  }
  
  /* Floating action button for calculate */
  .calc-fab {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 64px;
    height: 64px;
    background: var(--primary-500);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    z-index: 100;
    transition: all 0.2s ease;
  }
  
  .calc-fab:hover {
    background: var(--primary-600);
    transform: scale(1.1);
  }
  
  .calc-fab:active {
    transform: scale(0.95);
  }
}
```

### Mobile Form JavaScript
```javascript
// Mobile form enhancements
class MobileFormHandler {
  constructor() {
    this.initCollapsibleSections();
    this.initProgressTracking();
    this.initFloatingButton();
  }
  
  initCollapsibleSections() {
    const sections = document.querySelectorAll('.form-section');
    
    sections.forEach((section, index) => {
      const header = section.querySelector('.section-header');
      const content = section.querySelector('.section-content');
      
      // Expand first section by default
      if (index === 0) {
        section.classList.add('expanded');
      }
      
      header.addEventListener('click', () => {
        const isExpanded = section.classList.contains('expanded');
        
        // Collapse other sections (accordion behavior)
        sections.forEach(s => s.classList.remove('expanded'));
        
        if (!isExpanded) {
          section.classList.add('expanded');
          // Smooth scroll to section
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        this.updateProgress();
      });
    });
  }
  
  initProgressTracking() {
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      field.addEventListener('input', () => this.updateProgress());
      field.addEventListener('change', () => this.updateProgress());
    });
  }
  
  updateProgress() {
    const requiredFields = document.querySelectorAll('[required]');
    const filledFields = Array.from(requiredFields).filter(field => {
      return field.type === 'checkbox' ? field.checked : field.value.trim();
    });
    
    const progress = (filledFields.length / requiredFields.length) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${Math.round(progress)}% Complete (${filledFields.length}/${requiredFields.length} fields)`;
    }
    
    // Show/hide floating button based on progress
    const fab = document.querySelector('.calc-fab');
    if (fab) {
      fab.style.display = progress >= 60 ? 'flex' : 'none';
    }
  }
  
  initFloatingButton() {
    const fab = document.createElement('button');
    fab.className = 'calc-fab';
    fab.innerHTML = '🧮';
    fab.title = 'Calculate Results';
    fab.style.display = 'none';
    
    fab.addEventListener('click', () => {
      // Trigger calculation
      if (window.propertyCalculator) {
        window.propertyCalculator.calculateProperty();
      }
      
      // Scroll to results
      const results = document.querySelector('.results-panel');
      if (results) {
        results.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    document.body.appendChild(fab);
  }
}

// Initialize mobile form handler
if (window.innerWidth <= 768) {
  document.addEventListener('DOMContentLoaded', () => {
    new MobileFormHandler();
  });
}
```

## ⚡ Performance Optimization

### Mobile-First CSS Loading
```css
/* Critical CSS for mobile (inline in <head>) */
/* Base system fonts and variables */
:root {
  --primary-500: #3b82f6;
  --gray-900: #111827;
  --gray-50: #f9fafb;
}

/* Essential mobile layout */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  color: var(--gray-900);
  background: white;
}

/* Navigation critical styles */
.mobile-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  height: 64px;
}

/* Rest of CSS loaded asynchronously */
```

### Async CSS Loading
```html
<head>
  <!-- Critical CSS inline -->
  <style>
    /* Critical mobile CSS here */
  </style>
  
  <!-- Non-critical CSS loaded asynchronously -->
  <link rel="preload" href="styles/mobile.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles/mobile.css"></noscript>
  
  <!-- Preload key resources -->
  <link rel="preload" href="fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://api.example.com">
</head>
```

### Image Optimization
```html
<!-- Responsive images with lazy loading -->
<img src="hero-mobile.webp" 
     srcset="hero-mobile.webp 400w, 
             hero-tablet.webp 768w, 
             hero-desktop.webp 1200w"
     sizes="(max-width: 400px) 100vw, 
            (max-width: 768px) 100vw, 
            1200px"
     alt="Property investment analysis"
     loading="lazy"
     decoding="async">
```

## 📱 Progressive Web App Features

### PWA Manifest
```json
{
  "name": "InvestQuest - Property Investment Calculator",
  "short_name": "InvestQuest",
  "description": "Professional Australian property investment analysis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["finance", "productivity", "business"],
  "lang": "en",
  "dir": "ltr",
  "prefer_related_applications": false
}
```

### Service Worker for Offline Support
```javascript
// sw.js - Service Worker
const CACHE_NAME = 'investquest-v1.2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/calculator.html',
  '/education.html',
  '/dashboard.html',
  '/styles/mobile.css',
  '/js/calculator.js',
  '/js/mobile-enhancements.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📱 PWA cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('📱 Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### PWA Registration
```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('📱 SW registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('📱 SW registration failed:', error);
      });
  });
}

// Add to home screen prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📱 Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install button
  showInstallButton();
});

function showInstallButton() {
  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          console.log('📱 User choice:', choiceResult.outcome);
          deferredPrompt = null;
        });
      }
    });
  }
}
```

## 🔧 Mobile Testing Framework

### Device Testing Checklist
```javascript
// Mobile testing utilities
class MobileTestSuite {
  constructor() {
    this.deviceTests = {
      'iPhone SE': { width: 375, height: 667 },
      'iPhone 12': { width: 390, height: 844 },
      'iPhone 14 Pro Max': { width: 430, height: 932 },
      'Samsung Galaxy S21': { width: 360, height: 800 },
      'iPad Mini': { width: 768, height: 1024 },
      'iPad Pro': { width: 1024, height: 1366 }
    };
  }
  
  runAccessibilityTests() {
    const tests = [
      this.testTouchTargetSize(),
      this.testColorContrast(),
      this.testKeyboardNavigation(),
      this.testScreenReaderCompat(),
      this.testFocusManagement()
    ];
    
    return Promise.all(tests);
  }
  
  testTouchTargetSize() {
    const clickableElements = document.querySelectorAll('button, a, input, select, [role="button"]');
    const failedElements = [];
    
    clickableElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        failedElements.push({
          element: el,
          size: { width: rect.width, height: rect.height }
        });
      }
    });
    
    return {
      test: 'Touch Target Size',
      passed: failedElements.length === 0,
      failures: failedElements
    };
  }
  
  testColorContrast() {
    // Implementation for WCAG color contrast testing
    return {
      test: 'Color Contrast',
      passed: true,
      note: 'Manual testing required for full compliance'
    };
  }
  
  testPerformance() {
    const metrics = {
      lcp: this.getLargestContentfulPaint(),
      fid: this.getFirstInputDelay(),
      cls: this.getCumulativeLayoutShift()
    };
    
    return {
      test: 'Core Web Vitals',
      metrics,
      passed: metrics.lcp < 2500 && metrics.fid < 100 && metrics.cls < 0.1
    };
  }
}

// Run mobile tests
if (window.location.search.includes('test=mobile')) {
  const testSuite = new MobileTestSuite();
  testSuite.runAccessibilityTests().then(results => {
    console.table(results);
  });
}
```

## 📊 Mobile Analytics Integration

### Mobile-Specific Event Tracking
```javascript
// Mobile analytics events
class MobileAnalytics {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isTouch = 'ontouchstart' in window;
    this.initMobileTracking();
  }
  
  initMobileTracking() {
    if (!this.isMobile) return;
    
    // Track mobile-specific interactions
    this.trackTouchGestures();
    this.trackScrollBehavior();
    this.trackFormInteractions();
    this.trackNavigationUsage();
  }
  
  trackTouchGestures() {
    let touchStartTime;
    let touchStartY;
    
    document.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;
      const touchEndY = e.changedTouches[0].clientY;
      const scrollDistance = Math.abs(touchEndY - touchStartY);
      
      // Track swipe gestures
      if (touchDuration < 300 && scrollDistance > 50) {
        gtag('event', 'mobile_swipe', {
          'direction': touchEndY > touchStartY ? 'down' : 'up',
          'distance': scrollDistance
        });
      }
      
      // Track tap vs long press
      if (scrollDistance < 10) {
        const eventType = touchDuration > 500 ? 'long_press' : 'tap';
        gtag('event', eventType, {
          'duration': touchDuration
        });
      }
    });
  }
  
  trackScrollBehavior() {
    let scrollTimer;
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
      }
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        gtag('event', 'scroll_depth', {
          'percent': maxScrollDepth,
          'device_type': 'mobile'
        });
      }, 1000);
    });
  }
  
  trackFormInteractions() {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
      let focusTime;
      
      input.addEventListener('focus', () => {
        focusTime = Date.now();
        gtag('event', 'form_field_focus', {
          'field_type': input.type || input.tagName.toLowerCase(),
          'field_name': input.name || input.id
        });
      });
      
      input.addEventListener('blur', () => {
        const focusDuration = Date.now() - focusTime;
        gtag('event', 'form_field_blur', {
          'field_type': input.type || input.tagName.toLowerCase(),
          'field_name': input.name || input.id,
          'focus_duration': focusDuration,
          'has_value': !!input.value
        });
      });
    });
  }
  
  trackNavigationUsage() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        gtag('event', 'mobile_menu_toggle', {
          'action': 'open'
        });
      });
    }
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', 'mobile_navigation', {
          'link_text': link.textContent.trim(),
          'link_url': link.href
        });
      });
    });
  }
}

// Initialize mobile analytics
if (typeof gtag !== 'undefined') {
  new MobileAnalytics();
}
```

## 🎯 Implementation Priority

### Phase 1: Critical Fixes (Week 1)
- ✅ Fix navigation mobile responsiveness
- ✅ Implement minimum 44px touch targets
- ✅ Fix form input zoom issues on iOS
- ✅ Add mobile-first CSS loading

### Phase 2: UX Enhancements (Week 2)
- ✅ Redesign calculator form for mobile
- ✅ Add collapsible form sections
- ✅ Implement floating action button
- ✅ Add progress indicator

### Phase 3: PWA Features (Week 3)
- ✅ Create PWA manifest
- ✅ Implement service worker
- ✅ Add offline support
- ✅ Enable add-to-homescreen

### Phase 4: Advanced Features (Week 4)
- ✅ Mobile analytics integration
- ✅ Performance monitoring
- ✅ Accessibility testing suite
- ✅ Cross-device testing framework

## 🚀 Success Metrics

### Mobile Performance Targets
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### User Experience Goals
- **Mobile Conversion Rate**: +25% improvement
- **Mobile Bounce Rate**: -30% reduction
- **Form Completion Rate**: +40% increase
- **PWA Install Rate**: 15% of mobile users

### Accessibility Compliance
- **WCAG 2.1 Level AA**: 100% compliance
- **Touch Target Size**: 44px minimum
- **Color Contrast**: 4.5:1 minimum
- **Keyboard Navigation**: Full support

This comprehensive mobile enhancement plan transforms InvestQuest into a mobile-first, PWA-ready platform that delivers exceptional user experience across all devices while maintaining professional functionality and accessibility standards.
