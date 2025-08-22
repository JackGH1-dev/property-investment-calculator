// Enhanced Firestore Security Rules for InvestQuest Platform
// This file provides improved security rules to replace the current overly permissive configuration

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions for security
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isProfessional() {
      return isAuthenticated() && 
             'userType' in request.auth.token && 
             request.auth.token.userType == 'professional';
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             'admin' in request.auth.token && 
             request.auth.token.admin == true;
    }
    
    function isValidUserData() {
      return request.resource.data.keys().hasAll(['displayName', 'email']) &&
             request.resource.data.displayName is string &&
             request.resource.data.email is string &&
             request.resource.data.displayName.size() <= 100 &&
             request.resource.data.email.matches('.*@.*\\..*');
    }
    
    function isValidCalculationData() {
      return request.resource.data.keys().hasAll(['userId', 'propertyData', 'createdAt']) &&
             request.resource.data.userId is string &&
             request.resource.data.propertyData is map &&
             request.resource.data.createdAt is timestamp;
    }
    
    // User documents - users can only access their own data
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId) && isValidUserData();
      allow update: if isOwner(userId) && 
                    isValidUserData() && 
                    // Prevent users from changing critical fields
                    (!('userType' in request.resource.data) || 
                     request.resource.data.userType == resource.data.userType);
      allow delete: if isAdmin(); // Only admins can delete user accounts
    }
    
    // Property calculations - users can only access their own calculations
    match /calculations/{calculationId} {
      allow read: if isAuthenticated() && 
                  (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && 
                    isValidCalculationData() &&
                    request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && 
                    resource.data.userId == request.auth.uid &&
                    isValidCalculationData() &&
                    // Ensure userId cannot be changed
                    request.resource.data.userId == resource.data.userId;
      allow delete: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Properties - users can only access their own properties
    match /properties/{propertyId} {
      allow read: if isAuthenticated() && 
                  (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && 
                    request.resource.data.userId == request.auth.uid &&
                    request.resource.data.keys().hasAll(['userId', 'address', 'createdAt']);
      allow update: if isAuthenticated() && 
                    resource.data.userId == request.auth.uid &&
                    // Ensure userId cannot be changed
                    request.resource.data.userId == resource.data.userId;
      allow delete: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Professional clients (for mortgage brokers)
    match /clients/{clientId} {
      allow read: if isProfessional() && 
                  (resource.data.brokerId == request.auth.uid || isAdmin());
      allow create: if isProfessional() && 
                    request.resource.data.brokerId == request.auth.uid &&
                    request.resource.data.keys().hasAll(['brokerId', 'clientName', 'createdAt']);
      allow update: if isProfessional() && 
                    resource.data.brokerId == request.auth.uid &&
                    // Ensure brokerId cannot be changed
                    request.resource.data.brokerId == resource.data.brokerId;
      allow delete: if isProfessional() && 
                    (resource.data.brokerId == request.auth.uid || isAdmin());
    }
    
    // Subscription management
    match /subscriptions/{subscriptionId} {
      allow read: if isAuthenticated() && 
                  (resource.data.userId == request.auth.uid || isAdmin());
      allow write: if isAdmin(); // Only admins can modify subscriptions
    }
    
    // Public market data (read-only for authenticated users)
    match /market_data/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Analytics and usage tracking
    match /analytics/{analyticId} {
      // Users can write their own analytics data
      allow write: if isAuthenticated() && 
                   request.resource.data.userId == request.auth.uid;
      // Only admins can read analytics
      allow read: if isAdmin();
    }
    
    // System logs (admin only)
    match /system_logs/{logId} {
      allow read, write: if isAdmin();
    }
    
    // Security events (admin only)
    match /security_events/{eventId} {
      allow read, write: if isAdmin();
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // User settings and preferences
    match /user_settings/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Saved searches (user-specific)
    match /saved_searches/{searchId} {
      allow read, write: if isAuthenticated() && 
                         resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
                    request.resource.data.userId == request.auth.uid;
    }
    
    // Watchlists (user-specific)
    match /watchlists/{watchlistId} {
      allow read, write: if isAuthenticated() && 
                         resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
                    request.resource.data.userId == request.auth.uid;
    }
    
    // Default deny all other requests
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

/*
Security Rule Validation Checklist:

1. ✅ Removed global permissive rule
2. ✅ Implemented user-specific data access
3. ✅ Added role-based access control (professional, admin)
4. ✅ Implemented data validation functions
5. ✅ Protected critical fields from unauthorized changes
6. ✅ Added proper create/update/delete permissions
7. ✅ Implemented audit-friendly access patterns
8. ✅ Added support for new collections (analytics, logs)
9. ✅ Maintained backward compatibility with existing data structure
10. ✅ Added explicit deny-all fallback rule

Testing Requirements:
- Test user can only access their own data
- Test professional users can access client data
- Test admin users have appropriate elevated access
- Test data validation prevents malformed documents
- Test unauthorized access is properly denied
- Test all CRUD operations work correctly for authorized users

Deployment Steps:
1. Test rules in Firebase emulator
2. Deploy to development environment
3. Run comprehensive access control tests
4. Deploy to staging environment
5. Final validation before production deployment
*/