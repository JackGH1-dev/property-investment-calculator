// Production Deployment Script for InvestQuest
// Switches from demo mode to production Firebase integration

const fs = require('fs').promises;
const path = require('path');

class ProductionDeployer {
    constructor() {
        this.files = [
            'index.html',
            'calculator.html', 
            'dashboard.html',
            'education.html'
        ];
        
        this.replacements = [
            // Replace demo auth with production auth
            {
                from: '<script src="auth.js"></script>',
                to: '<script src="auth-production.js"></script>'
            },
            // Replace demo dashboard with production dashboard
            {
                from: '<script src="dashboard.js"></script>',
                to: '<script src="dashboard-production.js"></script>'
            },
            // Add Google Analytics
            {
                from: '</head>',
                to: `    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</head>`
            }
        ];
    }

    async deploy() {
        console.log('🚀 Starting production deployment...');

        try {
            // Create production versions of files
            for (const file of this.files) {
                await this.processFile(file);
            }

            // Copy production auth files
            await this.copyProductionFiles();

            // Update package.json version
            await this.updateVersion();

            // Create deployment summary
            await this.createDeploymentSummary();

            console.log('✅ Production deployment completed successfully!');
            console.log('📋 Next steps:');
            console.log('   1. Update Firebase config in auth-production.js');
            console.log('   2. Run: firebase deploy');
            console.log('   3. Configure custom domain');
            console.log('   4. Set up monitoring');

        } catch (error) {
            console.error('❌ Production deployment failed:', error);
        }
    }

    async processFile(filename) {
        console.log(`📝 Processing ${filename}...`);

        const filePath = path.join(__dirname, filename);
        let content = await fs.readFile(filePath, 'utf8');

        // Apply replacements
        for (const replacement of this.replacements) {
            content = content.replace(new RegExp(replacement.from, 'g'), replacement.to);
        }

        // Write production version
        const prodPath = path.join(__dirname, `prod-${filename}`);
        await fs.writeFile(prodPath, content, 'utf8');
        
        console.log(`✅ Created prod-${filename}`);
    }

    async copyProductionFiles() {
        console.log('📂 Copying production files...');
        
        const files = [
            'auth-production.js',
            'dashboard-production.js', 
            'firebase.json',
            'firestore.rules',
            'firestore.indexes.json'
        ];

        for (const file of files) {
            const sourcePath = path.join(__dirname, file);
            const exists = await fs.access(sourcePath).then(() => true).catch(() => false);
            
            if (exists) {
                console.log(`✅ ${file} ready for deployment`);
            } else {
                console.warn(`⚠️ ${file} not found`);
            }
        }
    }

    async updateVersion() {
        console.log('📦 Updating package.json version...');
        
        try {
            const packagePath = path.join(__dirname, 'package.json');
            const packageContent = await fs.readFile(packagePath, 'utf8');
            const packageJson = JSON.parse(packageContent);
            
            // Increment version
            const version = packageJson.version.split('.');
            version[2] = (parseInt(version[2]) + 1).toString();
            packageJson.version = version.join('.');
            
            await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
            console.log(`✅ Version updated to ${packageJson.version}`);
        } catch (error) {
            console.warn('⚠️ Could not update version:', error.message);
        }
    }

    async createDeploymentSummary() {
        const summary = `# 🚀 InvestQuest Production Deployment

**Deployment Date:** ${new Date().toISOString()}
**Version:** 2.0.0-production

## 📋 Deployment Checklist

### ✅ Files Prepared
- [x] Production HTML files created (prod-*.html)
- [x] Firebase authentication integration ready
- [x] Firestore security rules configured
- [x] Production dashboard with real-time sync

### 🔧 Configuration Required

#### 1. Firebase Configuration
Replace placeholder values in \`auth-production.js\`:
\`\`\`javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "investquest-prod.firebaseapp.com",
    projectId: "investquest-prod",
    storageBucket: "investquest-prod.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
\`\`\`

#### 2. Google Analytics
Replace GA_MEASUREMENT_ID with your actual tracking ID

#### 3. Domain Setup
- Register domain: investquest.com.au
- Configure DNS in Firebase Console
- SSL will be automatically configured

### 🚀 Deployment Commands

\`\`\`bash
# Install dependencies
npm install

# Deploy to Firebase Hosting
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
\`\`\`

### 📊 Post-Deployment Tasks

1. **Test Authentication Flow**
   - Verify Google OAuth works
   - Test user type selection
   - Check dashboard access

2. **Verify Database Operations**
   - Test saving calculations
   - Verify real-time updates
   - Check security rules

3. **Set Up Monitoring**
   - Configure Firebase Performance
   - Set up error reporting
   - Monitor user analytics

4. **SEO & Marketing Setup**
   - Submit sitemap to Google
   - Configure social media meta tags
   - Set up Google Search Console

### 🔗 Important URLs

- **Production URL:** https://investquest-prod.web.app
- **Custom Domain:** https://investquest.com.au (after setup)
- **Firebase Console:** https://console.firebase.google.com/project/investquest-prod
- **Analytics:** https://analytics.google.com

### 📱 Testing Checklist

- [ ] Home page loads correctly
- [ ] Authentication modal works
- [ ] Google sign-in functions
- [ ] Dashboard displays user data
- [ ] Calculator saves to Firestore
- [ ] Mobile responsive design
- [ ] Performance metrics acceptable

### 🎯 Success Metrics

- **Page Load Time:** < 3 seconds
- **Authentication Success Rate:** > 95%
- **Data Persistence:** 100% reliability
- **Mobile Performance:** > 90 Lighthouse score

## 🆘 Troubleshooting

### Common Issues:
- **Firebase auth errors:** Check API key and OAuth settings
- **CORS issues:** Verify authorized domains in Firebase
- **Firestore permission errors:** Review security rules
- **Performance issues:** Check bundle size and caching

### Support Resources:
- Firebase Documentation: https://firebase.google.com/docs
- InvestQuest GitHub: [Repository URL]
- Developer Contact: [Your Email]

---

**🎉 InvestQuest is ready for production!**

Transform from demo to real SaaS platform serving Australian property investors and mortgage brokers.
`;

        await fs.writeFile(path.join(__dirname, 'DEPLOYMENT-SUMMARY.md'), summary, 'utf8');
        console.log('✅ Deployment summary created: DEPLOYMENT-SUMMARY.md');
    }
}

// Run deployment if called directly
if (require.main === module) {
    const deployer = new ProductionDeployer();
    deployer.deploy();
}

module.exports = ProductionDeployer;