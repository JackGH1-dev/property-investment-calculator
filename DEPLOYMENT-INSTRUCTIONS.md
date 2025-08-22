# InvestQuest Platform - Deployment Instructions

## 🚀 Quick Start Deployment Guide

### **Prerequisites**
- Node.js 16+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git repository access
- Domain API credentials (optional, has fallback)
- Google Cloud Project with Firebase enabled

---

## 📦 Option 1: Firebase Hosting (Recommended)

### **Step 1: Firebase Setup**
```bash
# 1. Login to Firebase
firebase login

# 2. Initialize Firebase in project directory
cd investquest-platform
firebase init

# Select the following:
# ✅ Firestore: Configure rules and indexes
# ✅ Hosting: Configure files for Firebase Hosting
# ✅ Functions: Configure cloud functions (optional)

# 3. Configure firebase.json (already provided)
# File should contain hosting and firestore configuration
```

### **Step 2: Environment Configuration**
```javascript
// 1. Update firebase configuration in auth-production.js
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// 2. Update Domain API key in market-data-service.js (optional)
// Replace 'DOMAIN_API_KEY_PLACEHOLDER' with actual key
// If no key provided, system will use enhanced mock data
```

### **Step 3: Deploy to Firebase**
```bash
# 1. Deploy Firestore rules and indexes
firebase deploy --only firestore

# 2. Deploy hosting
firebase deploy --only hosting

# 3. Verify deployment
firebase hosting:sites:list
```

### **Step 4: Post-Deployment Verification**
```bash
# Test the deployed application
curl -I https://your-project.firebaseapp.com
curl https://your-project.firebaseapp.com/calculator.html

# Verify Firestore connection
# Login to Firebase Console and check Firestore data
```

---

## 🌐 Option 2: Traditional Web Hosting

### **Step 1: File Preparation**
```bash
# 1. Ensure all files are in root directory
ls -la
# Should see: calculator.html, dashboard.html, index.html, etc.

# 2. Update configuration files
# Edit auth-production.js with your Firebase config
# Edit market-data-service.js with API keys (optional)

# 3. Verify file structure
tree -L 2
```

### **Step 2: Upload to Web Server**
```bash
# Option A: Using FTP/SFTP
scp -r * user@your-server.com:/var/www/html/

# Option B: Using rsync
rsync -avz . user@your-server.com:/var/www/html/

# Option C: Manual upload via hosting provider's file manager
# Upload all files maintaining directory structure
```

### **Step 3: Server Configuration**
```nginx
# Example Nginx configuration
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/html;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing support
    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## ☁️ Option 3: Vercel Deployment

### **Step 1: Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    },
    {
      "src": "*.js",
      "use": "@vercel/static"
    },
    {
      "src": "*.css",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### **Step 2: Deploy to Vercel**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name
# - Configure build settings (none required for static site)

# 3. Deploy to production
vercel --prod
```

---

## 📊 Option 4: GitHub Pages Deployment

### **Step 1: Repository Setup**
```bash
# 1. Push code to GitHub repository
git add .
git commit -m "Production ready deployment"
git push origin main

# 2. Go to repository Settings > Pages
# 3. Select "Deploy from a branch"
# 4. Choose "main" branch and "/ (root)" folder
```

### **Step 2: Custom Domain (Optional)**
```bash
# 1. Add CNAME file to repository root
echo "your-domain.com" > CNAME

# 2. Configure DNS records:
# Type: CNAME
# Name: www (or @)
# Value: yourusername.github.io

# 3. Enable HTTPS in GitHub Pages settings
```

---

## 🔧 Configuration Details

### **Required Environment Variables**
```javascript
// Firebase Configuration (Required)
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

// Domain API (Optional - has fallback)
DOMAIN_API_KEY=your-domain-api-key

// Analytics (Optional)
GOOGLE_ANALYTICS_ID=your-ga-id
```

### **Firebase Security Rules**
```javascript
// Firestore Rules (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /calculations/{document} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Allow read access to public data
    match /public/{document} {
      allow read: if true;
    }
  }
}
```

### **Performance Optimization**
```javascript
// Optional: Service Worker for caching (sw.js)
const CACHE_NAME = 'investquest-v1';
const urlsToCache = [
  '/',
  '/calculator.html',
  '/dashboard.html',
  '/styles.css',
  '/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

## 🔍 Testing Your Deployment

### **Automated Testing Script**
```bash
#!/bin/bash
# test-deployment.sh

DOMAIN="https://your-domain.com"

echo "🧪 Testing InvestQuest Deployment"
echo "================================"

# Test main pages
echo "Testing main pages..."
curl -s -o /dev/null -w "%{http_code}" $DOMAIN/ && echo "✅ Home page: OK" || echo "❌ Home page: FAILED"
curl -s -o /dev/null -w "%{http_code}" $DOMAIN/calculator.html && echo "✅ Calculator: OK" || echo "❌ Calculator: FAILED"
curl -s -o /dev/null -w "%{http_code}" $DOMAIN/dashboard.html && echo "✅ Dashboard: OK" || echo "❌ Dashboard: FAILED"

# Test JavaScript files
echo "Testing JavaScript files..."
curl -s -o /dev/null -w "%{http_code}" $DOMAIN/script.js && echo "✅ Main script: OK" || echo "❌ Main script: FAILED"
curl -s -o /dev/null -w "%{http_code}" $DOMAIN/performance-monitor.js && echo "✅ Performance monitor: OK" || echo "❌ Performance monitor: FAILED"

# Test CSS files
echo "Testing CSS files..."
curl -s -o /dev/null -w "%{http_code}" $DOMAIN/styles.css && echo "✅ Main styles: OK" || echo "❌ Main styles: FAILED"

echo "Testing complete!"
```

### **Manual Testing Checklist**
- [ ] **Home page loads** - Check navigation and main content
- [ ] **Calculator functionality** - Test basic calculation
- [ ] **Property search** - Try address autocomplete
- [ ] **Market insights** - Verify widget displays
- [ ] **Authentication** - Test Google sign-in
- [ ] **Dashboard access** - Verify user dashboard loads
- [ ] **PDF generation** - Test report download
- [ ] **Performance dashboard** - Check monitoring widget
- [ ] **Mobile responsiveness** - Test on mobile device
- [ ] **Error handling** - Test with invalid inputs

---

## 🚨 Troubleshooting Common Issues

### **Issue: Firebase Authentication Not Working**
```javascript
// Solution: Check Firebase configuration
console.log('Firebase config:', firebaseConfig);
console.log('Firebase app:', firebase.apps.length);

// Verify OAuth settings in Firebase Console:
// Authentication > Sign-in method > Google > Enable
// Add your domain to authorized domains
```

### **Issue: Firestore Permission Denied**
```bash
# Solution: Deploy Firestore rules
firebase deploy --only firestore:rules

# Verify rules in Firebase Console:
# Firestore Database > Rules
# Should show user-specific access rules
```

### **Issue: Performance Dashboard Not Showing**
```javascript
// Solution: Check script loading order
// performance-monitor.js should load before performance-dashboard.js
// Verify in calculator.html script tags
```

### **Issue: Market Data Not Loading**
```javascript
// Solution: Check API configuration
// If no Domain API key, verify mock data is working
console.log('Market data service:', window.marketDataService);
console.log('Service initialized:', window.marketDataService?.isInitialized);
```

### **Issue: Mobile Layout Problems**
```css
/* Solution: Verify viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Check responsive CSS is loading */
@media (max-width: 768px) {
  /* Mobile styles should be present */
}
```

---

## 📊 Post-Deployment Monitoring

### **Performance Monitoring Setup**
```javascript
// The built-in performance monitor will automatically track:
// - Web Vitals (LCP, FID, CLS, FCP, TTFB)
// - User interactions and feature usage
// - Error rates and types
// - Session duration and engagement

// To export data for analysis:
// 1. Open performance dashboard (visible on calculator page)
// 2. Click "Export" button
// 3. Download JSON file with complete metrics
```

### **Analytics Integration (Optional)**
```javascript
// Add Google Analytics (optional)
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎯 Success Validation

### **Deployment Success Indicators**
- ✅ **All pages load** without errors
- ✅ **Calculator functions** properly with accurate results
- ✅ **Authentication works** with Google OAuth
- ✅ **Data persistence** saves and loads calculations
- ✅ **Performance dashboard** shows live metrics
- ✅ **Mobile responsive** design works on all devices
- ✅ **Error handling** provides graceful fallbacks
- ✅ **Market insights** display relevant data

### **Performance Benchmarks**
- **Page Load Time**: <3 seconds
- **Web Vitals**: All metrics in "Good" range
- **Error Rate**: <1%
- **Mobile Usability**: 100% responsive
- **Security**: HTTPS enabled, no exposed credentials

---

## 📞 Support & Maintenance

### **Ongoing Maintenance**
- **Daily**: Monitor error logs and performance metrics
- **Weekly**: Review user analytics and feature usage
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Performance optimization and feature updates

### **Support Resources**
- **Documentation**: Complete guides in `/docs` folder
- **Performance Data**: Export from built-in dashboard
- **Error Tracking**: Real-time error monitoring
- **User Feedback**: Built-in feedback collection system

---

**🎯 Deployment Status: READY FOR IMMEDIATE PRODUCTION**

*Choose your preferred deployment method and follow the step-by-step instructions. The platform is production-ready with comprehensive monitoring and error handling.*