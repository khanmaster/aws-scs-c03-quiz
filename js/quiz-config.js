// Quiz Configuration Management
class QuizConfig {
    constructor() {
        this.config = null;
        this.loadConfig();
    }

    async loadConfig() {
        try {
            const response = await fetch('data/config.json');
            this.config = await response.json();
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            quizLengths: {
                "10": { name: "Quick Practice", duration: "15-20 minutes" },
                "20": { name: "Standard Practice", duration: "30-40 minutes" },
                "30": { name: "Extended Practice", duration: "45-60 minutes" },
                "65": { name: "Full Practice Exam", duration: "130 minutes" }
            },
            settings: {
                randomizeQuestions: true,
                showProgressBar: true,
                enableTimers: true,
                autoSave: true
            }
        };
    }

    getQuizLength(length) {
        return this.config?.quizLengths[length] || null;
    }

    getSetting(key) {
        return this.config?.settings[key] || false;
    }

    saveQuizSession(data) {
        if (this.getSetting('autoSave')) {
            localStorage.setItem('quizSession', JSON.stringify(data));
        }
    }

    loadQuizSession() {
        const session = localStorage.getItem('quizSession');
        return session ? JSON.parse(session) : null;
    }

    clearQuizSession() {
        localStorage.removeItem('quizSession');
    }
}

// Global config instance
window.quizConfig = new QuizConfig();