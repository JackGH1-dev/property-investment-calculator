// Redirect Debugger - Add this to any page to debug redirect issues
// Load this script FIRST before any other scripts

console.log('🔍 REDIRECT DEBUGGER ACTIVE');

// Track all navigation attempts
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;
const originalAssign = location.assign;
const originalReplace = location.replace;

// Monitor history API
history.pushState = function(...args) {
    console.log('🔍 HISTORY.PUSHSTATE:', args);
    console.trace('Stack trace:');
    return originalPushState.apply(this, args);
};

history.replaceState = function(...args) {
    console.log('🔍 HISTORY.REPLACESTATE:', args);
    console.trace('Stack trace:');
    return originalReplaceState.apply(this, args);
};

// Monitor location changes
location.assign = function(...args) {
    console.log('🔍 LOCATION.ASSIGN:', args);
    console.trace('Stack trace:');
    return originalAssign.apply(this, args);
};

location.replace = function(...args) {
    console.log('🔍 LOCATION.REPLACE:', args);
    console.trace('Stack trace:');
    return originalReplace.apply(this, args);
};

// Monitor href changes
let originalHref = location.href;
Object.defineProperty(location, 'href', {
    get: function() {
        return originalHref;
    },
    set: function(value) {
        console.log('🔍 LOCATION.HREF SET:', value);
        console.trace('Stack trace:');
        originalHref = value;
        window.location = value;
    }
});

// Monitor popstate events
window.addEventListener('popstate', function(event) {
    console.log('🔍 POPSTATE EVENT:', event);
});

// Monitor beforeunload
window.addEventListener('beforeunload', function(event) {
    console.log('🔍 BEFOREUNLOAD EVENT - Page is about to unload');
});

// Monitor page visibility changes
document.addEventListener('visibilitychange', function() {
    console.log('🔍 VISIBILITY CHANGE:', document.visibilityState);
});

// Monitor all script errors
window.addEventListener('error', function(event) {
    console.log('🔍 SCRIPT ERROR:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// Monitor unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.log('🔍 UNHANDLED PROMISE REJECTION:', event.reason);
});

// Check for meta redirects
const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
if (metaRefresh) {
    console.log('🔍 META REFRESH FOUND:', metaRefresh.content);
}

// Monitor DOM changes that might trigger redirects
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'META' && node.getAttribute('http-equiv') === 'refresh') {
                    console.log('🔍 META REFRESH ADDED DYNAMICALLY:', node.content);
                }
            });
        }
    });
});

observer.observe(document.head, { childList: true, subtree: true });

// Track page load performance
window.addEventListener('load', function() {
    console.log('🔍 PAGE LOAD COMPLETE');
    console.log('🔍 Performance:', {
        navigation: performance.getEntriesByType('navigation')[0],
        resources: performance.getEntriesByType('resource').length
    });
});

// Check for common redirect patterns every second
setInterval(function() {
    // Check if current page matches expected page
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    if ((currentPage === 'dashboard.html' || currentPath.includes('dashboard')) && 
        window.location.pathname === '/') {
        console.log('🔍 DASHBOARD REDIRECT DETECTED!');
    }
    
    if ((currentPage === 'calculator.html' || currentPath.includes('calculator')) && 
        window.location.pathname === '/') {
        console.log('🔍 CALCULATOR REDIRECT DETECTED!');
    }
}, 1000);

console.log('🔍 Redirect debugger initialized for:', window.location.href);