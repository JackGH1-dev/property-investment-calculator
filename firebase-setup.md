# 🔥 Firebase Setup Guide for InvestQuest

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Project name**: `investquest-prod`
4. **Enable Google Analytics**: Yes (recommended)
5. **Choose Analytics account**: Create new or use existing

## Step 2: Enable Authentication

1. **Go to Authentication > Sign-in method**
2. **Enable Google provider**:
   - Click Google → Enable
   - Add your email as test user
   - Configure OAuth consent screen
3. **Enable Email/Password** (for future use)

## Step 3: Set up Firestore Database

1. **Go to Firestore Database**
2. **Click "Create database"**
3. **Start in production mode** (we'll add security rules)
4. **Choose location**: `australia-southeast1` (Sydney)

## Step 4: Get Configuration

1. **Go to Project Settings (gear icon)**
2. **Scroll to "Your apps"**
3. **Click "</>" (Web app icon)**
4. **App nickname**: `InvestQuest Web`
5. **Also set up Firebase Hosting**: Yes
6. **Copy the config object** - you'll need this!

```javascript
// Your Firebase config will look like this:
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "investquest-prod.firebaseapp.com",
  projectId: "investquest-prod", 
  storageBucket: "investquest-prod.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 5: Install Firebase CLI

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project in your directory
firebase init
```

**During firebase init, select**:
- ✅ Firestore
- ✅ Hosting
- ✅ Storage (for future file uploads)

## Step 6: Security Rules

**Firestore Security Rules** (paste in Firebase Console):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own calculations
    match /calculations/{calculationId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Users can read/write their own properties
    match /properties/{propertyId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Public read access for market data (future)
    match /market_data/{document} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
  }
}
```

## Step 7: Domain Setup (Optional but Recommended)

1. **Register domain**: investquest.com.au (or .com)
2. **In Firebase Hosting**:
   - Go to Hosting → Add custom domain
   - Follow DNS setup instructions
   - Firebase will handle SSL certificates

## Next Steps After Setup

Once you have the Firebase config:
1. Replace the demo config in `auth-production.js`
2. Test authentication with real Google OAuth
3. Deploy to Firebase Hosting
4. Set up monitoring and analytics

## Cost Estimate

**Firebase Pricing** (Spark Plan - Free tier):
- Authentication: 50,000 monthly active users (free)
- Firestore: 1GB storage, 50k reads/20k writes per day (free)
- Hosting: 10GB storage, 360MB/day transfer (free)

**Upgrade to Blaze Plan** when you exceed free limits:
- Pay-as-you-go pricing
- Very affordable for startup usage
- Typically $5-20/month for small SaaS

## Troubleshooting

**Common Issues**:
- ❌ **OAuth redirect issues**: Add your domain to authorized domains
- ❌ **CORS errors**: Enable hosting or add domain to Firebase
- ❌ **Permission denied**: Check Firestore security rules
- ❌ **API key restrictions**: Configure API key restrictions in Google Cloud Console

**Need Help?**
- Firebase Documentation: https://firebase.google.com/docs
- Community: https://stackoverflow.com/questions/tagged/firebase