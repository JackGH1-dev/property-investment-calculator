// 📱 InvestQuest Mobile Enhancements JavaScript
// Mobile-first UX improvements and PWA functionality

class MobileEnhancements {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isTouch = 'ontouchstart' in window;
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    this.init();
  }
  
  init() {
    console.log('📱 Initializing mobile enhancements');
    
    // Core mobile features
    this.initPWA();
    this.initMobileNavigation();
    this.initTouchEnhancements();
    this.initMobileForm();
    this.initPerformanceOptimizations();
    this.initAccessibility();
    
    // Mobile-specific features
    if (this.isMobile) {
      this.initMobileOnlyFeatures();
    }
  }
  
  // ================================
  // PWA FUNCTIONALITY
  // ================================
  
  initPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
    
    // Handle install prompt
    this.handleInstallPrompt();
    
    // Update detection
    this.handleAppUpdates();
    
    // Connection status
    this.handleConnectionChanges();
  }
  
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('📱 Service Worker registered:', registration.scope);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.showUpdateNotification();
          }
        });
      });
      
    } catch (error) {
      console.error('📱 Service Worker registration failed:', error);
    }
  }
  
  handleInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('📱 Install prompt available');
      
      this.showInstallButton(deferredPrompt);
    });
    
    // Track installation
    window.addEventListener('appinstalled', () => {
      console.log('📱 App installed successfully');
      this.trackEvent('pwa_installed');
      this.hideInstallButton();
    });
  }
  
  showInstallButton(deferredPrompt) {
    // Create install button if it doesn't exist
    let installBtn = document.getElementById('installBtn');
    
    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'installBtn';
      installBtn.className = 'install-btn mobile-only';
      installBtn.innerHTML = '📱 Install App';
      installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-500);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        z-index: 1000;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      
      document.body.appendChild(installBtn);
    }
    
    installBtn.style.display = 'block';
    
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        
        const choiceResult = await deferredPrompt.userChoice;
        console.log('📱 Install choice:', choiceResult.outcome);
        
        this.trackEvent('pwa_install_prompt', { outcome: choiceResult.outcome });
        
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
  
  hideInstallButton() {
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }
  
  showUpdateNotification() {
    const updateBar = document.createElement('div');
    updateBar.className = 'update-notification';
    updateBar.innerHTML = `
      <div class="update-content">
        <span>🔄 New version available!</span>
        <button id="updateBtn">Update</button>
        <button id="dismissBtn">×</button>
      </div>
    `;
    updateBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--primary-500);
      color: white;
      padding: 12px;
      z-index: 1001;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(updateBar);
    
    // Animate in
    requestAnimationFrame(() => {
      updateBar.style.transform = 'translateY(0)';
    });
    
    // Handle buttons
    document.getElementById('updateBtn').addEventListener('click', () => {
      window.location.reload();
    });
    
    document.getElementById('dismissBtn').addEventListener('click', () => {
      updateBar.style.transform = 'translateY(-100%)';
      setTimeout(() => updateBar.remove(), 300);
    });
  }
  
  handleConnectionChanges() {
    window.addEventListener('online', () => {
      console.log('📱 Connection restored');
      this.showConnectionStatus('Online', 'success');
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      console.log('📱 Connection lost');
      this.showConnectionStatus('Offline', 'warning');
    });
  }
  
  showConnectionStatus(status, type) {
    const statusBar = document.createElement('div');
    statusBar.className = `connection-status ${type}`;
    statusBar.textContent = `📶 ${status}`;
    statusBar.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      z-index: 1000;
      background: ${type === 'success' ? '#10b981' : '#f59e0b'};
      color: white;
      transform: translateX(100px);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(statusBar);
    
    // Animate in
    requestAnimationFrame(() => {
      statusBar.style.transform = 'translateX(0)';
    });
    
    // Auto hide
    setTimeout(() => {
      statusBar.style.transform = 'translateX(100px)';
      setTimeout(() => statusBar.remove(), 300);
    }, 3000);
  }
  
  async syncOfflineData() {
    try {
      // Trigger background sync if supported
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('property-calculation');
        console.log('📱 Background sync registered');
      }
    } catch (error) {
      console.error('📱 Background sync failed:', error);
    }
  }
  
  // ================================
  // MOBILE NAVIGATION
  // ================================
  
  initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
    
    // Close menu when navigating
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }
  
  toggleMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    const isOpen = navLinks.classList.contains('active');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navLinks.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    this.trackEvent('mobile_menu_open');
  }
  
  closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    
    // Restore body scrolling
    document.body.style.overflow = '';
  }
  
  // ================================
  // TOUCH ENHANCEMENTS
  // ================================
  
  initTouchEnhancements() {
    if (!this.isTouch) return;
    
    // Add touch feedback to buttons
    this.addTouchFeedback();
    
    // Handle swipe gestures
    this.initSwipeGestures();
    
    // Improve scroll performance
    this.optimizeScrolling();
  }
  
  addTouchFeedback() {
    const touchElements = document.querySelectorAll('button, .btn, .touch-target, .nav-link');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', (e) => {
        element.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', (e) => {
        element.classList.remove('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchcancel', (e) => {
        element.classList.remove('touch-active');
      }, { passive: true });
    });
    
    // Add CSS for touch feedback
    if (!document.getElementById('touchFeedbackStyles')) {
      const style = document.createElement('style');
      style.id = 'touchFeedbackStyles';
      style.textContent = `
        .touch-active {
          transform: scale(0.95);
          transition: transform 0.1s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  initSwipeGestures() {
    let startX, startY, startTime;
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = Date.now() - startTime;
      
      // Check for swipe gesture
      const minSwipeDistance = 50;
      const maxSwipeTime = 300;
      
      if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
      
      startX = startY = startTime = null;
    }, { passive: true });
  }
  
  handleSwipeRight() {
    // Close mobile menu if open
    if (document.querySelector('.nav-links.active')) {
      this.closeMobileMenu();
    }
    
    this.trackEvent('swipe_right');
  }
  
  handleSwipeLeft() {
    // Could implement navigation or other features
    this.trackEvent('swipe_left');
  }
  
  optimizeScrolling() {
    // Enable momentum scrolling on iOS
    const scrollableElements = document.querySelectorAll('.nav-links, .scrollable');
    
    scrollableElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
      element.style.overflowScrolling = 'touch';
    });
  }
  
  // ================================
  // MOBILE FORM ENHANCEMENTS
  // ================================
  
  initMobileForm() {
    if (!document.querySelector('.calculator-grid')) return;
    
    this.createFormSections();
    this.addProgressIndicator();
    this.initFloatingActionButton();
    this.optimizeFormInputs();
  }
  
  createFormSections() {
    const inputPanel = document.querySelector('.input-panel');
    if (!inputPanel) return;
    
    const sections = [
      { 
        title: '🏠 Property Details', 
        fields: ['address', 'state', 'isFirstHomeBuyer', 'purchasePrice', 'deposit', 'calculatedAmount', 'rentalIncome', 'purchaseYear'],
        expanded: true 
      },
      { 
        title: '💰 Upfront Costs', 
        fields: ['stampDuty', 'lmi', 'legalFees', 'buildingInspection', 'loanFees', 'otherUpfrontCosts', 'totalUpfrontCosts'] 
      },
      { 
        title: '📅 Annual Expenses', 
        fields: ['insurance', 'maintenance', 'councilRates', 'propertyManagement', 'otherExpenses'] 
      },
      { 
        title: '🏦 Mortgage Details', 
        fields: ['loanAmount', 'interestRate', 'repaymentType', 'loanTerm', 'monthlyRepayment', 'weeklyRepayment'] 
      },
      { 
        title: '📈 Growth Assumptions', 
        fields: ['propertyGrowth', 'rentalGrowth'] 
      }
    ];
    
    this.reorganizeFormSections(inputPanel, sections);
  }
  
  reorganizeFormSections(container, sections) {
    const form = container.querySelector('form');
    if (!form) return;
    
    // Create progress indicator container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress mobile-only';
    progressContainer.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
      <div class="progress-text">0% Complete</div>
    `;
    container.insertBefore(progressContainer, form);
    
    // Get all form groups
    const formGroups = Array.from(form.querySelectorAll('.form-group, .form-row'));
    const existingH3s = Array.from(form.querySelectorAll('h3'));
    
    // Clear form content
    form.innerHTML = '';
    
    // Create sections
    sections.forEach((section, index) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = `form-section ${section.expanded ? 'expanded' : ''}`;
      
      const header = document.createElement('div');
      header.className = 'section-header';
      header.innerHTML = `
        <h3>${section.title}</h3>
        <span class="section-toggle">▼</span>
      `;
      
      const content = document.createElement('div');
      content.className = 'section-content';
      
      // Add relevant form groups to this section
      section.fields.forEach(fieldId => {
        const fieldGroup = formGroups.find(group => {
          const input = group.querySelector(`#${fieldId}`);
          return input !== null;
        });
        
        if (fieldGroup) {
          content.appendChild(fieldGroup.cloneNode(true));
        }
      });
      
      sectionDiv.appendChild(header);
      sectionDiv.appendChild(content);
      form.appendChild(sectionDiv);
      
      // Add click handler
      header.addEventListener('click', () => {
        this.toggleFormSection(sectionDiv);
      });
    });
    
    // Add save button at the end
    const saveSection = container.querySelector('.save-calculation-section');
    if (saveSection) {
      form.appendChild(saveSection);
    }
  }
  
  toggleFormSection(section) {
    const isExpanded = section.classList.contains('expanded');
    
    // Collapse all other sections (accordion behavior)
    document.querySelectorAll('.form-section').forEach(s => {
      s.classList.remove('expanded');
    });
    
    if (!isExpanded) {
      section.classList.add('expanded');
      // Smooth scroll to section
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    this.updateFormProgress();
  }
  
  addProgressIndicator() {
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    
    requiredInputs.forEach(input => {
      input.addEventListener('input', () => this.updateFormProgress());
      input.addEventListener('change', () => this.updateFormProgress());
    });
    
    // Initial update
    setTimeout(() => this.updateFormProgress(), 100);
  }
  
  updateFormProgress() {
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    const filledInputs = Array.from(requiredInputs).filter(input => {
      return input.type === 'checkbox' ? input.checked : input.value.trim();
    });
    
    const progress = (filledInputs.length / requiredInputs.length) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${Math.round(progress)}% Complete (${filledInputs.length}/${requiredInputs.length} fields)`;
    }
    
    // Show/hide FAB based on progress
    const fab = document.querySelector('.calc-fab');
    if (fab) {
      fab.style.display = progress >= 60 ? 'flex' : 'none';
    }
  }
  
  initFloatingActionButton() {
    if (!this.isMobile) return;
    
    const fab = document.createElement('button');
    fab.className = 'calc-fab mobile-only';
    fab.innerHTML = '🧮';
    fab.title = 'Calculate Results';
    fab.style.cssText = `
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
      display: none;
    `;
    
    fab.addEventListener('click', () => {
      // Trigger calculation
      const calculateBtn = document.querySelector('.calculate-btn');
      if (calculateBtn) {
        calculateBtn.click();
      } else if (window.propertyCalculator) {
        window.propertyCalculator.calculateProperty();
      }
      
      // Scroll to results
      const results = document.querySelector('.results-panel');
      if (results) {
        results.scrollIntoView({ behavior: 'smooth' });
      }
      
      this.trackEvent('fab_calculate');
    });
    
    document.body.appendChild(fab);
  }
  
  optimizeFormInputs() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Prevent zoom on iOS
      if (input.style.fontSize !== '16px') {
        input.style.fontSize = '16px';
      }
      
      // Add touch-friendly styling
      input.classList.add('touch-optimized');
      
      // Handle focus/blur for better UX
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('input-focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('input-focused');
      });
    });
  }
  
  // ================================
  // PERFORMANCE OPTIMIZATIONS
  // ================================
  
  initPerformanceOptimizations() {
    // Lazy load images
    this.initLazyLoading();
    
    // Optimize animations for mobile
    this.optimizeAnimations();
    
    // Debounce expensive operations
    this.debounceExpensiveOperations();
  }
  
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  optimizeAnimations() {
    // Reduce animations on lower-powered devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      document.body.classList.add('reduced-motion');
    }
    
    // Reduce animations based on user preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }
  }
  
  debounceExpensiveOperations() {
    // Debounce calculation updates
    let calcTimeout;
    
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, select')) {
        clearTimeout(calcTimeout);
        calcTimeout = setTimeout(() => {
          if (window.propertyCalculator && typeof window.propertyCalculator.updateCalculations === 'function') {
            window.propertyCalculator.updateCalculations();
          }
        }, 300);
      }
    });
  }
  
  // ================================
  // ACCESSIBILITY ENHANCEMENTS
  // ================================
  
  initAccessibility() {
    // Improve keyboard navigation
    this.enhanceKeyboardNavigation();
    
    // Add skip links
    this.addSkipLinks();
    
    // Enhance focus management
    this.improveFocusManagement();
    
    // Add ARIA labels
    this.addAriaLabels();
  }
  
  enhanceKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Tab navigation improvements
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // Escape key handling
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        
        // Close any open modals
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
      }
    });
    
    document.addEventListener('click', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
  
  addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    `;
    skipLinks.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      z-index: 1000;
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
    
    // Add CSS for skip links
    const skipLinkStyles = document.createElement('style');
    skipLinkStyles.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
      }
      
      .skip-link:focus {
        top: 6px;
      }
    `;
    document.head.appendChild(skipLinkStyles);
  }
  
  improveFocusManagement() {
    // Trap focus in mobile menu
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks) {
      navLinks.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && navLinks.classList.contains('active')) {
          const focusableElements = navLinks.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }
  }
  
  addAriaLabels() {
    // Add aria-labels to elements that need them
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle && !navToggle.getAttribute('aria-label')) {
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Add role attributes
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
  }
  
  // ================================
  // MOBILE-ONLY FEATURES
  // ================================
  
  initMobileOnlyFeatures() {
    console.log('📱 Initializing mobile-only features');
    
    // Add mobile device classes
    this.addDeviceClasses();
    
    // Handle orientation changes
    this.handleOrientationChange();
    
    // Add mobile-specific touch zones
    this.addTouchZones();
  }
  
  addDeviceClasses() {
    const userAgent = navigator.userAgent;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      document.body.classList.add('ios');
    } else if (/Android/.test(userAgent)) {
      document.body.classList.add('android');
    }
    
    if (this.isStandalone) {
      document.body.classList.add('pwa');
    }
  }
  
  handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
      // Close mobile menu on orientation change
      this.closeMobileMenu();
      
      // Update layout after orientation change
      setTimeout(() => {
        this.updateFormProgress();
      }, 100);
      
      this.trackEvent('orientation_change', {
        orientation: window.orientation
      });
    });
  }
  
  addTouchZones() {
    // Add invisible touch zones for easier navigation
    const touchZones = document.createElement('div');
    touchZones.className = 'touch-zones mobile-only';
    touchZones.innerHTML = `
      <div class="touch-zone left" data-action="back"></div>
      <div class="touch-zone right" data-action="forward"></div>
    `;
    touchZones.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: -1;
    `;
    
    document.body.appendChild(touchZones);
  }
  
  // ================================
  // ANALYTICS AND TRACKING
  // ================================
  
  trackEvent(eventName, properties = {}) {
    // Track mobile-specific events
    const eventData = {
      ...properties,
      isMobile: this.isMobile,
      isTouch: this.isTouch,
      isStandalone: this.isStandalone,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      userAgent: navigator.userAgent
    };
    
    console.log('📱 Mobile Event:', eventName, eventData);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
    }
  }
  
  // ================================
  // UTILITY METHODS
  // ================================
  
  handleAppUpdates() {
    // Handle app updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }
}

// Initialize mobile enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.mobileEnhancements = new MobileEnhancements();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already loaded
  window.mobileEnhancements = new MobileEnhancements();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileEnhancements;
}