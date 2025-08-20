#!/usr/bin/env node

/**
 * InvestQuest Production Preparation Script
 * Prepares files for deployment to investquest.app with Firebase backend
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 InvestQuest Production Preparation');
console.log('=====================================');
console.log('Target: investquest.app (existing hosting)');
console.log('Backend: Firebase Authentication + Firestore');
console.log('');

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
console.log('📦 Creating deployment package...');

// List of files to deploy to investquest.app
const deployFiles = [
    'index.html',
    'calculator.html',
    'education.html', 
    'dashboard.html',
    'auth-production.js',
    'dashboard-production.js',
    'script.js',
    'styles.css'
];

console.log('');
console.log('📋 Files ready for deployment:');
deployFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ⚠️  ${file} (missing - check if needed)`);
    }
});

console.log('');
console.log('🔧 Production Configuration Complete!');
console.log('');
console.log('Next steps:');
console.log('1. ✅ Update auth-production.js with your Firebase config');
console.log('2. 🌐 Upload the files above to investquest.app');
console.log('3. 🔍 Test authentication at https://investquest.app');
console.log('');
console.log('🎯 Benefits of this approach:');
console.log('   • Keep your professional domain (investquest.app)');
console.log('   • Add real user authentication');
console.log('   • Enable data persistence');
console.log('   • No hosting migration required');