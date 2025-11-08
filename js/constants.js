// Application Constants
const QUIZ_CONSTANTS = {
    // Quiz configurations
    QUIZ_LENGTHS: {
        QUICK: 10,
        STANDARD: 20,
        EXTENDED: 30,
        FULL_EXAM: 65
    },

    // Timer intervals
    TIMER_INTERVAL: 1000, // 1 second

    // Local storage keys
    STORAGE_KEYS: {
        QUIZ_CONFIG: 'quizConfig',
        QUIZ_SESSION: 'quizSession',
        QUIZ_PROGRESS: 'quizProgress',
        QUIZ_RESULTS: 'quizResults',
        TIMER_STATE: 'timerState',
        REVIEW_MODE: 'reviewMode'
    },

    // API endpoints
    ENDPOINTS: {
        QUESTIONS: 'data/questions.json',
        CONFIG: 'data/config.json'
    },

    // CSS classes
    CSS_CLASSES: {
        OPTION_CORRECT: 'correct',
        OPTION_INCORRECT: 'incorrect',
        NAV_CURRENT: 'current',
        NAV_ANSWERED: 'answered',
        KEYWORD_HIGHLIGHT: 'keyword-highlight'
    },

    // Question types
    QUESTION_TYPES: {
        SINGLE: 'single',
        MULTIPLE: 'multiple'
    },

    // Environments
    ENVIRONMENTS: {
        DEV: 'dev',
        QA: 'qa',
        PROD: 'prod'
    }
};

// Export for use in other modules
window.QUIZ_CONSTANTS = QUIZ_CONSTANTS;