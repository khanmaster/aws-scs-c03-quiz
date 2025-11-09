/**
 * Main application JavaScript following industry best practices
 * - No global functions
 * - Event delegation
 * - Proper error handling
 * - Accessibility support
 */

(function() {
    'use strict';

    // Quiz configuration constants
    const QUIZ_CONFIGS = {
        'quiz1': { questionCount: 20, dataFile: 'quiz1-20questions.json' },
        'quiz2': { questionCount: 20, dataFile: 'quiz2-20questions.json' },
        'quiz3': { questionCount: 25, dataFile: 'quiz3-25questions.json' },
        'full': { questionCount: 65, dataFile: 'questions.json' }
    };

    // Application state
    let deferredPrompt = null;

    /**
     * Initialize the application
     */
    function init() {
        setupEventListeners();
        setupServiceWorker();
        setupPWAInstall();
        setupAccessibility();
    }

    /**
     * Setup all event listeners using event delegation
     */
    function setupEventListeners() {
        // Quiz start buttons
        document.addEventListener('click', handleQuizStart);
        
        // Mobile menu toggle
        document.addEventListener('click', handleMobileMenuToggle);
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', handleOutsideClick);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
    }

    /**
     * Handle quiz start button clicks
     */
    function handleQuizStart(event) {
        const button = event.target.closest('.quiz-start-btn');
        if (!button) return;

        event.preventDefault();
        
        const quizType = button.dataset.quiz;
        if (!quizType || !QUIZ_CONFIGS[quizType]) {
            console.error('Invalid quiz type:', quizType);
            return;
        }

        try {
            const config = QUIZ_CONFIGS[quizType];
            const quizConfig = {
                questionCount: config.questionCount,
                dataFile: config.dataFile,
                startTime: Date.now()
            };

            localStorage.setItem('quizConfig', JSON.stringify(quizConfig));
            window.location.href = 'quiz.html';
        } catch (error) {
            console.error('Failed to start quiz:', error);
            alert('Failed to start quiz. Please try again.');
        }
    }

    /**
     * Handle mobile menu toggle
     */
    function handleMobileMenuToggle(event) {
        const toggleButton = event.target.closest('.mobile-menu-toggle');
        if (!toggleButton) return;

        event.preventDefault();
        
        const mobileDropdown = document.getElementById('mobileDropdown');
        if (!mobileDropdown) return;

        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;

        // Update ARIA attributes
        toggleButton.setAttribute('aria-expanded', newState.toString());
        
        // Toggle menu visibility
        mobileDropdown.classList.toggle('active', newState);

        // Focus management
        if (newState) {
            const firstMenuItem = mobileDropdown.querySelector('.mobile-dropdown-item');
            if (firstMenuItem) {
                firstMenuItem.focus();
            }
        }
    }

    /**
     * Handle clicks outside mobile menu to close it
     */
    function handleOutsideClick(event) {
        const mobileDropdown = document.getElementById('mobileDropdown');
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        
        if (!mobileDropdown || !toggleButton) return;
        
        if (!toggleButton.contains(event.target) && !mobileDropdown.contains(event.target)) {
            mobileDropdown.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboardNavigation(event) {
        // Escape key closes mobile menu
        if (event.key === 'Escape') {
            const mobileDropdown = document.getElementById('mobileDropdown');
            const toggleButton = document.querySelector('.mobile-menu-toggle');
            
            if (mobileDropdown && mobileDropdown.classList.contains('active')) {
                mobileDropdown.classList.remove('active');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.focus();
            }
        }
    }

    /**
     * Setup service worker
     */
    function setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/aws-scs-c03-quiz/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered successfully');
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }

    /**
     * Setup PWA installation
     */
    function setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
            console.log('PWA install prompt available');
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            deferredPrompt = null;
        });
    }

    /**
     * Setup accessibility enhancements
     */
    function setupAccessibility() {
        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();