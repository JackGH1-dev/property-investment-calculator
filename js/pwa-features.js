/**
 * Progressive Web App Features - Phase 2 Implementation
 * ProjectionLab-Inspired PWA Capabilities
 */

class PWAFeatures {
    constructor() {
        this.serviceWorker = null;
        this.installPrompt = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        this.cacheStrategy = 'networkFirst';
        
        // Performance monitoring integration
        this.perfMonitor = window.performanceMonitor || null;
        
        // PWA configuration
        this.config = {
            cacheName: 'investquest-v2.0.0',
            cacheAssets: [
                '/',
                '/index.html',
                '/calculator.html',
                '/dashboard.html',
                '/styles.css',
                '/js/performance-monitor.js',
                '/js/advanced-chart-system.js',
                '/js/interactive-data-table.js',
                '/js/enhanced-components.js',
                '/manifest.json'
            ],
            notificationConfig: {
                badge: '/images/icon-badge.png',
                icon: '/images/icon-192x192.png',
                requireInteraction: true,
                tag: 'investquest-notification'
            }
        };
        
        this.isInitialized = false;
    }

    /**
     * Initialize PWA features
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Register service worker
            await this.registerServiceWorker();
            
            // Setup install prompt
            this.setupInstallPrompt();
            
            // Setup offline/online detection
            this.setupNetworkDetection();
            
            // Setup push notifications
            this.setupNotifications();
            
            // Setup app shortcuts
            this.setupAppShortcuts();
            
            // Setup background sync
            this.setupBackgroundSync();
            
            this.isInitialized = true;
            console.log('🚀 PWA Features initialized');
            
            if (this.perfMonitor) {
                this.perfMonitor.trackEvent('pwa_initialized');
            }
            
        } catch (error) {
            console.error('❌ PWA initialization failed:', error);
        }
    }

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return;
        }

        try {
            // Create service worker content dynamically
            const swContent = this.generateServiceWorkerContent();
            const swBlob = new Blob([swContent], { type: 'application/javascript' });
            const swUrl = URL.createObjectURL(swBlob);
            
            const registration = await navigator.serviceWorker.register(swUrl);
            this.serviceWorker = registration;
            
            console.log('✅ Service Worker registered successfully');
            
            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateAvailable();
                    }
                });
            });
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }

    /**
     * Generate service worker content
     */
    generateServiceWorkerContent() {
        return `
const CACHE_NAME = '${this.config.cacheName}';
const CACHE_ASSETS = ${JSON.stringify(this.config.cacheAssets)};

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network first strategy
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response
                const responseClone = response.clone();
                
                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone));
                }
                
                return response;
            })
            .catch(() => {
                // Return cached version if network fails
                return caches.match(event.request);
            })
    );
});

// Background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-calculation') {
        event.waitUntil(syncCalculationData());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/images/icon-192x192.png',
                badge: '/images/icon-badge.png',
                tag: 'investquest-notification',
                requireInteraction: true,
                actions: data.actions || []
            })
        );
    }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Sync calculation data function
async function syncCalculationData() {
    try {
        const calculations = await getStoredCalculations();
        if (calculations.length > 0) {
            // Send to server when online
            await fetch('/api/sync-calculations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calculations })
            });
            
            // Clear local storage after successful sync
            await clearStoredCalculations();
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

async function getStoredCalculations() {
    // Implementation would get data from IndexedDB
    return [];
}

async function clearStoredCalculations() {
    // Implementation would clear IndexedDB
}
        `;
    }

    /**
     * Setup install prompt
     */
    setupInstallPrompt() {
        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallButton();
        });

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstalledMessage();
            
            if (this.perfMonitor) {
                this.perfMonitor.trackEvent('pwa_installed');
            }
        });
    }

    /**
     * Show install button
     */
    showInstallButton() {
        // Check if install button already exists
        let installBtn = document.getElementById('pwa-install-btn');
        
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'btn btn-accent pwa-install-btn';
            installBtn.innerHTML = `
                📱 Install InvestQuest
                <span class="install-subtitle">Get the full app experience</span>
            `;
            
            installBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                min-width: 200px;
                padding: 12px 16px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                background: var(--projectionlab-accent);
                color: #ffffff;
                border: none;
                cursor: pointer;
                transition: all 250ms ease;
                animation: slideInUp 0.5s ease-out;
            `;
            
            installBtn.addEventListener('click', () => this.promptInstall());
            document.body.appendChild(installBtn);
        }
        
        // Add slide-in animation CSS
        this.addInstallButtonCSS();
    }

    /**
     * Add install button CSS animations
     */
    addInstallButtonCSS() {
        if (document.getElementById('pwa-install-css')) return;

        const style = document.createElement('style');
        style.id = 'pwa-install-css';
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .pwa-install-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
            }
            
            .install-subtitle {
                display: block;
                font-size: 11px;
                opacity: 0.9;
                font-weight: 400;
                margin-top: 2px;
            }
            
            @media (max-width: 768px) {
                .pwa-install-btn {
                    bottom: 80px;
                    right: 16px;
                    left: 16px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Prompt install
     */
    async promptInstall() {
        if (!this.installPrompt) return;

        try {
            const result = await this.installPrompt.prompt();
            
            if (this.perfMonitor) {
                this.perfMonitor.trackEvent('pwa_install_prompted', { 
                    outcome: result.outcome 
                });
            }
            
            if (result.outcome === 'accepted') {
                console.log('✅ PWA install accepted');
            } else {
                console.log('❌ PWA install declined');
            }
            
            this.installPrompt = null;
            
        } catch (error) {
            console.error('Install prompt error:', error);
        }
    }

    /**
     * Hide install button
     */
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.style.animation = 'slideOutDown 0.5s ease-out forwards';
            setTimeout(() => {
                installBtn.remove();
            }, 500);
        }
    }

    /**
     * Show installed message
     */
    showInstalledMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-installed-message';
        message.innerHTML = `
            <div class="message-content">
                ✅ InvestQuest installed successfully!
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            background: #10B981;
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(message);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    /**
     * Setup network detection
     */
    setupNetworkDetection() {
        const updateNetworkStatus = () => {
            this.isOnline = navigator.onLine;
            
            if (this.isOnline) {
                this.showOnlineMessage();
                this.syncWhenOnline();
            } else {
                this.showOfflineMessage();
            }
            
            if (this.perfMonitor) {
                this.perfMonitor.trackEvent('network_status_changed', {
                    online: this.isOnline
                });
            }
        };

        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
        
        // Initial check
        updateNetworkStatus();
    }

    /**
     * Show online message
     */
    showOnlineMessage() {
        this.removeNetworkMessage();
        
        const message = this.createNetworkMessage(
            'online',
            '✅ Back online - data will sync automatically',
            '#10B981'
        );
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    /**
     * Show offline message
     */
    showOfflineMessage() {
        this.removeNetworkMessage();
        
        const message = this.createNetworkMessage(
            'offline',
            '📱 You\'re offline - InvestQuest still works!',
            '#F59E0B'
        );
        
        document.body.appendChild(message);
    }

    /**
     * Create network status message
     */
    createNetworkMessage(type, text, color) {
        const message = document.createElement('div');
        message.className = `network-message network-${type}`;
        message.innerHTML = `
            <div class="message-content">
                ${text}
                ${type === 'offline' ? '' : '<button onclick="this.parentElement.parentElement.remove()">×</button>'}
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1002;
            background: ${color};
            color: white;
            padding: 12px 16px;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            animation: slideInDown 0.3s ease-out;
        `;
        
        return message;
    }

    /**
     * Remove network message
     */
    removeNetworkMessage() {
        const existing = document.querySelector('.network-message');
        if (existing) {
            existing.remove();
        }
    }

    /**
     * Setup push notifications
     */
    async setupNotifications() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.warn('Push notifications not supported');
            return;
        }

        // Check permission status
        let permission = Notification.permission;
        
        if (permission === 'default') {
            // Don't auto-prompt - wait for user action
            this.setupNotificationPrompt();
        } else if (permission === 'granted') {
            await this.setupPushSubscription();
        }
    }

    /**
     * Setup notification permission prompt
     */
    setupNotificationPrompt() {
        // Add subtle notification prompt to UI
        const prompt = document.createElement('div');
        prompt.className = 'notification-prompt';
        prompt.innerHTML = `
            <div class="prompt-content">
                🔔 Enable notifications for calculation updates and market insights
                <div class="prompt-actions">
                    <button onclick="window.pwaFeatures.requestNotificationPermission()">Enable</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Maybe Later</button>
                </div>
            </div>
        `;
        
        prompt.style.cssText = `
            position: relative;
            background: rgba(24, 103, 192, 0.1);
            border: 1px solid rgba(24, 103, 192, 0.2);
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            font-size: 14px;
        `;
        
        // Insert after hero section if available
        const hero = document.querySelector('.hero-section, .header-content');
        if (hero && hero.parentNode) {
            hero.parentNode.insertBefore(prompt, hero.nextSibling);
        }
    }

    /**
     * Request notification permission
     */
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                await this.setupPushSubscription();
                this.showNotificationEnabledMessage();
            }
            
            // Remove prompt
            const prompt = document.querySelector('.notification-prompt');
            if (prompt) prompt.remove();
            
            if (this.perfMonitor) {
                this.perfMonitor.trackEvent('notification_permission_requested', {
                    granted: permission === 'granted'
                });
            }
            
        } catch (error) {
            console.error('Notification permission error:', error);
        }
    }

    /**
     * Setup push subscription
     */
    async setupPushSubscription() {
        if (!this.serviceWorker) return;

        try {
            const subscription = await this.serviceWorker.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlB64ToUint8Array('YOUR_VAPID_PUBLIC_KEY_HERE')
            });
            
            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
            
        } catch (error) {
            console.error('Push subscription error:', error);
        }
    }

    /**
     * Convert VAPID key
     */
    urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /**
     * Send subscription to server
     */
    async sendSubscriptionToServer(subscription) {
        try {
            await fetch('/api/save-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });
        } catch (error) {
            console.error('Failed to save subscription:', error);
        }
    }

    /**
     * Setup app shortcuts
     */
    setupAppShortcuts() {
        // These are defined in the manifest.json, but we can provide fallbacks
        if ('shortcuts' in navigator) {
            console.log('✅ App shortcuts supported');
        }
    }

    /**
     * Setup background sync
     */
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            // Register sync when data needs to be saved offline
            this.setupOfflineDataHandler();
        }
    }

    /**
     * Setup offline data handling
     */
    setupOfflineDataHandler() {
        // Listen for form submissions and calculation results
        document.addEventListener('calculationComplete', (e) => {
            if (!this.isOnline) {
                this.saveCalculationOffline(e.detail);
            }
        });
    }

    /**
     * Save calculation data offline
     */
    saveCalculationOffline(calculationData) {
        // Save to IndexedDB for background sync
        const data = {
            ...calculationData,
            timestamp: Date.now(),
            synced: false
        };
        
        // Store in IndexedDB (implementation needed)
        this.storeOfflineData('calculations', data);
        
        // Register background sync
        if (this.serviceWorker && this.serviceWorker.sync) {
            this.serviceWorker.sync.register('background-calculation');
        }
        
        this.showOfflineDataSavedMessage();
    }

    /**
     * Store data offline (IndexedDB implementation)
     */
    storeOfflineData(store, data) {
        // This would implement IndexedDB storage
        console.log(`Storing offline data in ${store}:`, data);
    }

    /**
     * Sync when online
     */
    async syncWhenOnline() {
        if (this.isOnline && this.serviceWorker) {
            try {
                // Trigger background sync
                await this.serviceWorker.sync.register('background-calculation');
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
    }

    /**
     * Show notification enabled message
     */
    showNotificationEnabledMessage() {
        this.showTemporaryMessage(
            '🔔 Notifications enabled! You\'ll receive updates about your calculations.',
            '#10B981'
        );
    }

    /**
     * Show offline data saved message
     */
    showOfflineDataSavedMessage() {
        this.showTemporaryMessage(
            '💾 Calculation saved offline - will sync when you\'re back online.',
            '#F59E0B'
        );
    }

    /**
     * Show temporary message
     */
    showTemporaryMessage(text, color) {
        const message = document.createElement('div');
        message.className = 'temporary-message';
        message.textContent = text;
        
        message.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1003;
            background: ${color};
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: messageSlideIn 0.3s ease-out;
            max-width: 90vw;
            text-align: center;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'messageSlideOut 0.3s ease-out forwards';
                setTimeout(() => message.remove(), 300);
            }
        }, 4000);
    }

    /**
     * Check if PWA is installed
     */
    isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true ||
               this.isInstalled;
    }

    /**
     * Get PWA capabilities
     */
    getCapabilities() {
        return {
            serviceWorker: 'serviceWorker' in navigator,
            notifications: 'Notification' in window,
            pushManager: 'PushManager' in window,
            backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
            installPrompt: 'BeforeInstallPromptEvent' in window,
            standalone: this.isPWAInstalled()
        };
    }

    /**
     * Cleanup and destroy
     */
    cleanup() {
        // Unregister service worker if needed
        if (this.serviceWorker) {
            this.serviceWorker.unregister();
        }
        
        // Remove PWA UI elements
        const pwaElements = document.querySelectorAll('.pwa-install-btn, .notification-prompt, .network-message');
        pwaElements.forEach(element => element.remove());
        
        // Remove event listeners
        window.removeEventListener('beforeinstallprompt', this.setupInstallPrompt);
        window.removeEventListener('appinstalled', this.setupInstallPrompt);
    }
}

// Initialize and export
const pwaFeatures = new PWAFeatures();
window.pwaFeatures = pwaFeatures;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => pwaFeatures.init());
} else {
    pwaFeatures.init();
}

console.log('🚀 PWA Features loaded - Progressive Web App Ready');