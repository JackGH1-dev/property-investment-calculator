/**
 * User Feedback Collection System
 * Comprehensive feedback collection for feature improvement and user experience optimization
 */

class UserFeedbackSystem {
    constructor() {
        this.isInitialized = false;
        this.feedbackData = {
            session: this.generateSessionId(),
            startTime: Date.now(),
            interactions: [],
            feedback: []
        };
        this.config = {
            enableAnalytics: true,
            enableFeedbackWidgets: true,
            enableSurveys: true,
            enableErrorReporting: true
        };
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📝 Initializing User Feedback System...');
        
        // Setup feedback collection components
        this.setupFeedbackWidget();
        this.setupSurveySystem();
        this.setupErrorReporting();
        this.setupUserInteractionTracking();
        this.setupPerformanceTracking();
        
        // Setup automatic feedback triggers
        this.setupSmartFeedbackTriggers();
        
        this.isInitialized = true;
        console.log('✅ User Feedback System initialized');
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setupFeedbackWidget() {
        // Create floating feedback button
        const feedbackButton = document.createElement('div');
        feedbackButton.className = 'feedback-widget-button';
        feedbackButton.innerHTML = `
            <div class="feedback-icon">💬</div>
            <span class="feedback-text">Feedback</span>
        `;
        feedbackButton.onclick = () => this.showFeedbackModal();
        
        document.body.appendChild(feedbackButton);
        
        // Add widget styles
        this.addFeedbackStyles();
        
        console.log('📝 Feedback widget added to page');
    }

    showFeedbackModal() {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        modal.innerHTML = `
            <div class="feedback-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="feedback-modal-content">
                <div class="feedback-modal-header">
                    <h3>Share Your Feedback</h3>
                    <button class="feedback-modal-close" onclick="this.closest('.feedback-modal').remove()">×</button>
                </div>
                <div class="feedback-modal-body">
                    <div class="feedback-tabs">
                        <button class="feedback-tab active" onclick="window.userFeedback.showFeedbackTab(this, 'general')">General</button>
                        <button class="feedback-tab" onclick="window.userFeedback.showFeedbackTab(this, 'feature')">Feature Request</button>
                        <button class="feedback-tab" onclick="window.userFeedback.showFeedbackTab(this, 'bug')">Report Bug</button>
                        <button class="feedback-tab" onclick="window.userFeedback.showFeedbackTab(this, 'rating')">Rate Experience</button>
                    </div>
                    
                    <div class="feedback-tab-content">
                        <div id="feedback-general" class="feedback-tab-panel active">
                            <div class="feedback-form">
                                <label>How would you rate your overall experience?</label>
                                <div class="rating-stars" data-rating="0">
                                    ${Array.from({length: 5}, (_, i) => 
                                        `<span class="star" data-value="${i + 1}" onclick="window.userFeedback.setRating(${i + 1})">⭐</span>`
                                    ).join('')}
                                </div>
                                
                                <label>What do you like most about InvestQuest?</label>
                                <textarea id="feedback-likes" placeholder="Tell us what's working well..."></textarea>
                                
                                <label>What could we improve?</label>
                                <textarea id="feedback-improvements" placeholder="Share your suggestions..."></textarea>
                                
                                <label>Would you recommend InvestQuest to others?</label>
                                <div class="nps-scale">
                                    ${Array.from({length: 11}, (_, i) => 
                                        `<button class="nps-button" data-score="${i}" onclick="window.userFeedback.setNPS(${i})">${i}</button>`
                                    ).join('')}
                                </div>
                                <div class="nps-labels">
                                    <span>Not likely</span>
                                    <span>Very likely</span>
                                </div>
                            </div>
                        </div>
                        
                        <div id="feedback-feature" class="feedback-tab-panel">
                            <div class="feedback-form">
                                <label>What feature would you like to see?</label>
                                <textarea id="feature-description" placeholder="Describe the feature you'd like..."></textarea>
                                
                                <label>How would this feature help you?</label>
                                <textarea id="feature-benefit" placeholder="Explain how this would improve your experience..."></textarea>
                                
                                <label>Priority Level</label>
                                <select id="feature-priority">
                                    <option value="low">Nice to have</option>
                                    <option value="medium">Would be helpful</option>
                                    <option value="high">Really need this</option>
                                    <option value="critical">Can't use platform without it</option>
                                </select>
                            </div>
                        </div>
                        
                        <div id="feedback-bug" class="feedback-tab-panel">
                            <div class="feedback-form">
                                <label>What went wrong?</label>
                                <textarea id="bug-description" placeholder="Describe what happened..."></textarea>
                                
                                <label>Steps to reproduce</label>
                                <textarea id="bug-steps" placeholder="1. I clicked on...\n2. Then I...\n3. And then..."></textarea>
                                
                                <label>Expected behavior</label>
                                <textarea id="bug-expected" placeholder="What should have happened instead?"></textarea>
                                
                                <div class="system-info">
                                    <label>
                                        <input type="checkbox" id="include-system-info" checked>
                                        Include system information (browser, device, etc.)
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div id="feedback-rating" class="feedback-tab-panel">
                            <div class="feedback-form">
                                <div class="rating-category">
                                    <label>Ease of Use</label>
                                    <div class="rating-stars" data-category="ease">
                                        ${Array.from({length: 5}, (_, i) => 
                                            `<span class="star" data-value="${i + 1}" onclick="window.userFeedback.setCategoryRating('ease', ${i + 1})">⭐</span>`
                                        ).join('')}
                                    </div>
                                </div>
                                
                                <div class="rating-category">
                                    <label>Calculation Accuracy</label>
                                    <div class="rating-stars" data-category="accuracy">
                                        ${Array.from({length: 5}, (_, i) => 
                                            `<span class="star" data-value="${i + 1}" onclick="window.userFeedback.setCategoryRating('accuracy', ${i + 1})">⭐</span>`
                                        ).join('')}
                                    </div>
                                </div>
                                
                                <div class="rating-category">
                                    <label>Performance Speed</label>
                                    <div class="rating-stars" data-category="performance">
                                        ${Array.from({length: 5}, (_, i) => 
                                            `<span class="star" data-value="${i + 1}" onclick="window.userFeedback.setCategoryRating('performance', ${i + 1})">⭐</span>`
                                        ).join('')}
                                    </div>
                                </div>
                                
                                <div class="rating-category">
                                    <label>Feature Completeness</label>
                                    <div class="rating-stars" data-category="features">
                                        ${Array.from({length: 5}, (_, i) => 
                                            `<span class="star" data-value="${i + 1}" onclick="window.userFeedback.setCategoryRating('features', ${i + 1})">⭐</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="feedback-form-footer">
                        <div class="contact-info">
                            <label>
                                <input type="checkbox" id="contact-followup">
                                Contact me about this feedback
                            </label>
                            <input type="email" id="contact-email" placeholder="your.email@example.com" style="display:none;">
                        </div>
                        
                        <div class="feedback-actions">
                            <button class="feedback-cancel" onclick="this.closest('.feedback-modal').remove()">Cancel</button>
                            <button class="feedback-submit" onclick="window.userFeedback.submitFeedback()">Send Feedback</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup contact email toggle
        document.getElementById('contact-followup').addEventListener('change', function() {
            const emailField = document.getElementById('contact-email');
            emailField.style.display = this.checked ? 'block' : 'none';
        });
    }

    showFeedbackTab(tabButton, tabId) {
        // Remove active class from all tabs
        document.querySelectorAll('.feedback-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.feedback-tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected tab
        tabButton.classList.add('active');
        document.getElementById(`feedback-${tabId}`).classList.add('active');
    }

    setRating(rating) {
        const container = document.querySelector('.rating-stars[data-rating]');
        container.setAttribute('data-rating', rating);
        
        // Update star display
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.style.opacity = index < rating ? '1' : '0.3';
        });
    }

    setCategoryRating(category, rating) {
        const container = document.querySelector(`[data-category="${category}"]`);
        container.setAttribute('data-rating', rating);
        
        // Update star display
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.style.opacity = index < rating ? '1' : '0.3';
        });
    }

    setNPS(score) {
        // Remove previous selection
        document.querySelectorAll('.nps-button').forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        document.querySelector(`[data-score="${score}"]`).classList.add('selected');
        
        // Store NPS score
        this.currentNPS = score;
    }

    async submitFeedback() {
        const activeTab = document.querySelector('.feedback-tab.active').textContent.toLowerCase();
        const feedbackData = this.collectFeedbackData(activeTab);
        
        try {
            // Show loading state
            this.showSubmissionLoading(true);
            
            // Submit feedback
            await this.saveFeedback(feedbackData);
            
            // Show success message
            this.showSubmissionSuccess();
            
            // Close modal after delay
            setTimeout(() => {
                document.querySelector('.feedback-modal')?.remove();
            }, 2000);
            
        } catch (error) {
            console.error('📝 Feedback submission failed:', error);
            this.showSubmissionError();
        } finally {
            this.showSubmissionLoading(false);
        }
    }

    collectFeedbackData(type) {
        const baseData = {
            type,
            timestamp: Date.now(),
            sessionId: this.feedbackData.session,
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };

        switch (type) {
            case 'general':
                return {
                    ...baseData,
                    rating: document.querySelector('.rating-stars[data-rating]')?.getAttribute('data-rating') || 0,
                    likes: document.getElementById('feedback-likes')?.value || '',
                    improvements: document.getElementById('feedback-improvements')?.value || '',
                    nps: this.currentNPS || null,
                    contactFollowup: document.getElementById('contact-followup')?.checked || false,
                    contactEmail: document.getElementById('contact-email')?.value || ''
                };
                
            case 'feature request':
                return {
                    ...baseData,
                    description: document.getElementById('feature-description')?.value || '',
                    benefit: document.getElementById('feature-benefit')?.value || '',
                    priority: document.getElementById('feature-priority')?.value || 'medium'
                };
                
            case 'report bug':
                return {
                    ...baseData,
                    description: document.getElementById('bug-description')?.value || '',
                    steps: document.getElementById('bug-steps')?.value || '',
                    expected: document.getElementById('bug-expected')?.value || '',
                    includeSystemInfo: document.getElementById('include-system-info')?.checked || false,
                    systemInfo: this.collectSystemInfo()
                };
                
            case 'rate experience':
                return {
                    ...baseData,
                    ratings: {
                        ease: document.querySelector('[data-category="ease"]')?.getAttribute('data-rating') || 0,
                        accuracy: document.querySelector('[data-category="accuracy"]')?.getAttribute('data-rating') || 0,
                        performance: document.querySelector('[data-category="performance"]')?.getAttribute('data-rating') || 0,
                        features: document.querySelector('[data-category="features"]')?.getAttribute('data-rating') || 0
                    }
                };
                
            default:
                return baseData;
        }
    }

    collectSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            screen: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };
    }

    async saveFeedback(feedbackData) {
        // Save to localStorage as backup
        const localFeedback = JSON.parse(localStorage.getItem('investquest-feedback') || '[]');
        localFeedback.push(feedbackData);
        localStorage.setItem('investquest-feedback', JSON.stringify(localFeedback.slice(-50))); // Keep last 50

        // If user is authenticated, save to Firestore
        if (window.authManager && window.authManager.isAuthenticated() && firebase.firestore) {
            const user = window.authManager.getCurrentUser();
            await firebase.firestore().collection('feedback').add({
                ...feedbackData,
                userId: user.uid,
                userEmail: user.email
            });
            console.log('📝 Feedback saved to Firestore');
        }

        // Send to analytics (if available)
        if (window.gtag) {
            window.gtag('event', 'feedback_submitted', {
                feedback_type: feedbackData.type,
                rating: feedbackData.rating || null
            });
        }

        console.log('📝 Feedback collected:', feedbackData.type);
    }

    showSubmissionLoading(show) {
        const submitBtn = document.querySelector('.feedback-submit');
        if (show) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Feedback';
        }
    }

    showSubmissionSuccess() {
        const modalBody = document.querySelector('.feedback-modal-body');
        modalBody.innerHTML = `
            <div class="feedback-success">
                <div class="success-icon">✅</div>
                <h3>Thank you for your feedback!</h3>
                <p>We appreciate you taking the time to help us improve InvestQuest.</p>
            </div>
        `;
    }

    showSubmissionError() {
        const modalBody = document.querySelector('.feedback-modal-body');
        modalBody.innerHTML = `
            <div class="feedback-error">
                <div class="error-icon">❌</div>
                <h3>Submission Failed</h3>
                <p>Sorry, there was an issue sending your feedback. Please try again later.</p>
                <button onclick="this.closest('.feedback-modal').remove()">Close</button>
            </div>
        `;
    }

    setupSurveySystem() {
        // Trigger surveys based on user behavior
        this.surveyTriggers = {
            afterCalculation: 0, // Counter
            afterSave: 0,
            timeOnSite: Date.now(),
            featureUsage: new Set()
        };

        // Check for survey triggers
        setInterval(() => {
            this.checkSurveyTriggers();
        }, 30000); // Every 30 seconds
    }

    checkSurveyTriggers() {
        const timeOnSite = Date.now() - this.surveyTriggers.timeOnSite;
        
        // Survey after 5 minutes on site (first time only)
        if (timeOnSite > 300000 && !localStorage.getItem('investquest-survey-shown')) {
            this.showQuickSurvey();
            localStorage.setItem('investquest-survey-shown', 'true');
        }
        
        // Survey after multiple calculations
        if (this.surveyTriggers.afterCalculation > 3 && !localStorage.getItem('investquest-power-user-survey')) {
            this.showPowerUserSurvey();
            localStorage.setItem('investquest-power-user-survey', 'true');
        }
    }

    showQuickSurvey() {
        const survey = document.createElement('div');
        survey.className = 'quick-survey-toast';
        survey.innerHTML = `
            <div class="survey-content">
                <h4>Quick Question</h4>
                <p>How likely are you to recommend InvestQuest to a friend or colleague?</p>
                <div class="quick-nps">
                    ${Array.from({length: 11}, (_, i) => 
                        `<button onclick="window.userFeedback.submitQuickNPS(${i})">${i}</button>`
                    ).join('')}
                </div>
                <button class="survey-dismiss" onclick="this.parentElement.parentElement.remove()">Maybe later</button>
            </div>
        `;
        
        document.body.appendChild(survey);
        
        // Auto-dismiss after 20 seconds
        setTimeout(() => {
            survey.remove();
        }, 20000);
    }

    submitQuickNPS(score) {
        this.saveFeedback({
            type: 'quick_nps',
            nps: score,
            timestamp: Date.now(),
            sessionId: this.feedbackData.session
        });
        
        document.querySelector('.quick-survey-toast').remove();
        
        // Show thank you message
        this.showToast('Thanks for your feedback! 🙏', 3000);
    }

    setupErrorReporting() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.reportError({
                type: 'javascript_error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error ? event.error.stack : null,
                timestamp: Date.now()
            });
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.reportError({
                type: 'promise_rejection',
                reason: event.reason.toString(),
                timestamp: Date.now()
            });
        });
    }

    async reportError(errorData) {
        const reportData = {
            ...errorData,
            sessionId: this.feedbackData.session,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };

        // Store locally
        const errorLog = JSON.parse(localStorage.getItem('investquest-errors') || '[]');
        errorLog.push(reportData);
        localStorage.setItem('investquest-errors', JSON.stringify(errorLog.slice(-20))); // Keep last 20

        console.warn('📝 Error reported:', errorData.type, errorData.message);
    }

    setupUserInteractionTracking() {
        // Track key user interactions
        const trackInteraction = (type, details) => {
            this.feedbackData.interactions.push({
                type,
                details,
                timestamp: Date.now(),
                url: window.location.pathname
            });
        };

        // Calculator interactions
        document.addEventListener('input', (e) => {
            if (e.target.type === 'number' || e.target.type === 'range') {
                trackInteraction('calculation_input', {
                    field: e.target.id || e.target.name,
                    value: e.target.value
                });
            }
        });

        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                trackInteraction('button_click', {
                    button: e.target.textContent.trim(),
                    id: e.target.id,
                    className: e.target.className
                });
            }
        });

        // Navigation
        let currentPath = window.location.pathname;
        setInterval(() => {
            if (window.location.pathname !== currentPath) {
                trackInteraction('page_navigation', {
                    from: currentPath,
                    to: window.location.pathname
                });
                currentPath = window.location.pathname;
            }
        }, 1000);
    }

    setupPerformanceTracking() {
        // Track performance issues
        const trackPerformance = () => {
            const perfData = {
                loadTime: performance.now(),
                memory: performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize
                } : null,
                connection: navigator.connection ? {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink
                } : null
            };

            if (perfData.loadTime > 5000) { // Slow load
                this.reportError({
                    type: 'performance_issue',
                    category: 'slow_load',
                    loadTime: perfData.loadTime,
                    timestamp: Date.now()
                });
            }
        };

        window.addEventListener('load', trackPerformance);
    }

    setupSmartFeedbackTriggers() {
        // Trigger feedback requests at optimal moments
        
        // After successful calculation
        document.addEventListener('calculationComplete', () => {
            this.surveyTriggers.afterCalculation++;
        });

        // After saving calculation
        document.addEventListener('calculationSaved', () => {
            this.surveyTriggers.afterSave++;
            
            // Trigger feedback after first save
            if (this.surveyTriggers.afterSave === 1) {
                setTimeout(() => {
                    this.showContextualFeedback('save');
                }, 2000);
            }
        });

        // After PDF generation
        document.addEventListener('pdfGenerated', () => {
            setTimeout(() => {
                this.showContextualFeedback('pdf');
            }, 3000);
        });
    }

    showContextualFeedback(context) {
        const messages = {
            save: "Great! You saved your first calculation. How's your experience so far?",
            pdf: "Hope the PDF report was helpful! Any feedback on the report format?",
            calculation: "How accurate do our calculations feel to you?"
        };

        if (localStorage.getItem(`investquest-contextual-${context}`) === 'true') return;

        const toast = document.createElement('div');
        toast.className = 'contextual-feedback-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <p>${messages[context]}</p>
                <div class="toast-actions">
                    <button onclick="window.userFeedback.showFeedbackModal()">Give Feedback</button>
                    <button onclick="window.userFeedback.dismissContextualFeedback('${context}', this)">Not now</button>
                </div>
            </div>
        `;

        document.body.appendChild(toast);
        localStorage.setItem(`investquest-contextual-${context}`, 'true');
    }

    dismissContextualFeedback(context, button) {
        button.closest('.contextual-feedback-toast').remove();
    }

    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), duration);
    }

    // Get feedback analytics for admin dashboard
    getFeedbackAnalytics() {
        const feedback = JSON.parse(localStorage.getItem('investquest-feedback') || '[]');
        const errors = JSON.parse(localStorage.getItem('investquest-errors') || '[]');
        
        return {
            totalFeedback: feedback.length,
            feedbackByType: feedback.reduce((acc, f) => {
                acc[f.type] = (acc[f.type] || 0) + 1;
                return acc;
            }, {}),
            averageRating: feedback
                .filter(f => f.rating)
                .reduce((sum, f, _, arr) => sum + f.rating / arr.length, 0),
            totalErrors: errors.length,
            sessionInteractions: this.feedbackData.interactions.length,
            sessionDuration: Date.now() - this.feedbackData.startTime
        };
    }

    addFeedbackStyles() {
        if (document.getElementById('feedback-system-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'feedback-system-styles';
        styles.textContent = `
            .feedback-widget-button {
                position: fixed;
                right: 20px;
                bottom: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 25px;
                padding: 12px 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                transition: transform 0.2s, box-shadow 0.2s;
                z-index: 1000;
            }
            
            .feedback-widget-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
            }
            
            .feedback-icon {
                font-size: 18px;
            }
            
            .feedback-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .feedback-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .feedback-modal-content {
                position: relative;
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .feedback-modal-header {
                padding: 24px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .feedback-modal-header h3 {
                margin: 0;
                color: #1f2937;
            }
            
            .feedback-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
            }
            
            .feedback-modal-body {
                flex: 1;
                overflow-y: auto;
            }
            
            .feedback-tabs {
                display: flex;
                background: #f9fafb;
                margin: 0 24px;
                margin-top: 24px;
                border-radius: 8px;
                padding: 4px;
            }
            
            .feedback-tab {
                flex: 1;
                background: none;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                color: #6b7280;
                transition: all 0.2s;
            }
            
            .feedback-tab.active {
                background: white;
                color: #1f2937;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
            
            .feedback-tab-content {
                padding: 24px;
            }
            
            .feedback-tab-panel {
                display: none;
            }
            
            .feedback-tab-panel.active {
                display: block;
            }
            
            .feedback-form label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #374151;
            }
            
            .feedback-form textarea,
            .feedback-form input,
            .feedback-form select {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                margin-bottom: 16px;
                resize: vertical;
            }
            
            .feedback-form textarea {
                min-height: 80px;
            }
            
            .rating-stars {
                display: flex;
                gap: 4px;
                margin-bottom: 16px;
            }
            
            .rating-stars .star {
                font-size: 24px;
                cursor: pointer;
                opacity: 0.3;
                transition: opacity 0.2s;
            }
            
            .rating-stars .star:hover,
            .rating-stars .star.active {
                opacity: 1;
            }
            
            .nps-scale {
                display: flex;
                gap: 4px;
                margin-bottom: 8px;
            }
            
            .nps-button {
                width: 40px;
                height: 40px;
                border: 1px solid #d1d5db;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .nps-button:hover {
                border-color: #3b82f6;
                background: #eff6ff;
            }
            
            .nps-button.selected {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }
            
            .nps-labels {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 16px;
            }
            
            .rating-category {
                margin-bottom: 16px;
            }
            
            .feedback-form-footer {
                padding: 24px;
                border-top: 1px solid #e5e7eb;
                background: #f9fafb;
            }
            
            .contact-info {
                margin-bottom: 16px;
            }
            
            .feedback-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            
            .feedback-cancel {
                background: #6b7280;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
            }
            
            .feedback-submit {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .feedback-submit:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .feedback-success,
            .feedback-error {
                text-align: center;
                padding: 40px;
            }
            
            .success-icon,
            .error-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            .quick-survey-toast {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                padding: 20px;
                max-width: 300px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            }
            
            .quick-nps {
                display: flex;
                gap: 2px;
                margin: 12px 0;
            }
            
            .quick-nps button {
                width: 24px;
                height: 24px;
                border: 1px solid #d1d5db;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .survey-dismiss {
                background: none;
                border: none;
                color: #6b7280;
                cursor: pointer;
                text-decoration: underline;
                font-size: 14px;
                margin-top: 8px;
            }
            
            .contextual-feedback-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 16px;
                max-width: 320px;
                z-index: 9999;
                animation: slideDown 0.3s ease;
            }
            
            .toast-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }
            
            .toast-actions button {
                padding: 6px 12px;
                border-radius: 4px;
                border: 1px solid #d1d5db;
                background: white;
                cursor: pointer;
                font-size: 14px;
            }
            
            .toast-actions button:first-child {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }
            
            .feedback-toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .feedback-modal-content {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .feedback-tabs {
                    flex-wrap: wrap;
                }
                
                .feedback-tab {
                    min-width: 45%;
                }
                
                .nps-scale {
                    justify-content: space-between;
                }
                
                .quick-survey-toast,
                .contextual-feedback-toast {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize feedback system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.userFeedback = new UserFeedbackSystem();
    window.userFeedback.init();
});

// Export feedback analytics for admin use
if (typeof module !== 'undefined') {
    module.exports = UserFeedbackSystem;
}