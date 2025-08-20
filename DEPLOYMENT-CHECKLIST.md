# 🚀 InvestQuest Production Deployment Checklist
## (Using Existing investquest.app Hosting)

## ✅ Prerequisites (Complete)
- [x] Firebase CLI installed (v14.12.1)
- [x] Production authentication files ready
- [x] Current hosting at investquest.app working
- [x] Firestore security rules configured

## 🔥 Firebase Console Setup - Backend Services Only

### 1. Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Create a project"
- [ ] Project name: `investquest-prod`
- [ ] Enable Google Analytics: ✅ Yes
- [ ] Click "Create project"

### 2. Enable Authentication
- [ ] Left sidebar → Authentication → Get started
- [ ] Sign-in method → Google → Enable
- [ ] Set support email
- [ ] Save

### 3. Create Firestore Database
- [ ] Left sidebar → Firestore Database → Create database
- [ ] Start in production mode → Next
- [ ] Location: `asia-southeast1` (closest to Australia)
- [ ] Done

### 4. Configure Authorized Domains
- [ ] Authentication → Settings → Authorized domains
- [ ] Add domain: `investquest.app`
- [ ] Add domain: `localhost` (for testing)
- [ ] Save

### 5. Get Configuration
- [ ] Project settings (⚙️) → General tab
- [ ] Your apps → Add app → Web
- [ ] App nickname: `InvestQuest Web`
- [ ] Copy the firebaseConfig object

## 💻 Local Deployment Commands

### 6. Update Configuration
```bash
# Edit auth-production.js with your Firebase config
# Replace YOUR_API_KEY_HERE, YOUR_APP_ID_HERE, etc.
```

### 7. Login and Initialize
```bash
# Login to Firebase (run in terminal)
firebase login

# Initialize project (if not already done)
firebase init hosting

# Select existing project: investquest-prod
```

### 8. Switch to Production Mode
```bash
# Run the deployment script
node deploy.js
```

### 9. Deploy to Your Current Hosting
```bash
# Upload updated files to investquest.app
# Use your current deployment method (FTP, cPanel, etc.)
# Key files to update:
# - index.html
# - calculator.html
# - education.html
# - dashboard.html
# - auth-production.js (with your Firebase config)
```

## 🌐 Post-Deployment

### 10. Test Live Site
- [ ] Visit: https://YOUR-PROJECT-ID.web.app
- [ ] Test Google Sign In
- [ ] Test calculator functionality
- [ ] Test dashboard (after sign in)
- [ ] Test mobile responsiveness

### 11. Custom Domain (Optional)
- [ ] Firebase Console → Hosting → Add custom domain
- [ ] Point DNS to Firebase
- [ ] SSL will auto-configure

## 🎯 Success Metrics
- [ ] Site loads in <3 seconds
- [ ] Google Authentication works
- [ ] Calculator saves results
- [ ] Dashboard shows saved data
- [ ] Mobile friendly (responsive)

## 🚨 Troubleshooting

### Common Issues:
1. **"Permission denied"**: Check Firestore security rules
2. **"Auth domain not authorized"**: Add domain in Firebase Auth settings
3. **"Loading forever"**: Check browser console for errors

### Support:
- Firebase docs: https://firebase.google.com/docs
- InvestQuest GitHub: Your repository
- Contact: your-email@domain.com

---

**🎉 Once complete, your InvestQuest platform will be LIVE!**

**Live URL remains**: `https://investquest.app` (your existing domain)