#!/usr/bin/env node

/**
 * InvestQuest Production Deployment Script
 * Switches to production authentication and deploys to Firebase
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 InvestQuest Production Deployment');
console.log('====================================');

// Files to update for production
const files = [
    'index.html',
    'calculator.html', 
    'education.html',
    'dashboard.html'
];

console.log('📝 Switching to production authentication...');

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace auth.js with auth-production.js
        content = content.replace(
            '<script src="auth.js"></script>',
            '<script src="auth-production.js"></script>'
        );
        
        // Replace dashboard.js with dashboard-production.js if it exists
        content = content.replace(
            '<script src="dashboard.js"></script>',
            '<script src="dashboard-production.js"></script>'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
    }
});

console.log('');
console.log('🔧 Production Configuration Complete!');
console.log('');
console.log('Next steps:');
console.log('1. Update auth-production.js with your Firebase config');
console.log('2. Run: firebase login');
console.log('3. Run: firebase use --add (select your project)');
console.log('4. Run: firebase deploy');
console.log('');
console.log('🌐 Your app will be live at: https://YOUR-PROJECT-ID.web.app');