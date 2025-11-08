// Progress Tracking System
class ProgressTracker {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.answers = {};
        this.questionStates = {}; // track if question has been answered
    }

    initialize(totalQuestions) {
        this.totalQuestions = totalQuestions;
        this.currentQuestion = 0;
        this.answers = {};
        this.questionStates = {};
        this.createNavigation();
        this.updateProgress();
    }

    createNavigation() {
        const navElement = document.getElementById('questionNav');
        if (!navElement) return;

        navElement.innerHTML = '';
        
        for (let i = 0; i < this.totalQuestions; i++) {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.textContent = i + 1;
            navItem.onclick = () => this.goToQuestion(i);
            navElement.appendChild(navItem);
        }
        
        this.updateNavigation();
    }

    updateNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.classList.remove('current', 'answered');
            
            if (index === this.currentQuestion) {
                item.classList.add('current');
            }
            
            if (this.questionStates[index]) {
                item.classList.add('answered');
            }
        });
    }

    updateProgress() {
        const progressElement = document.getElementById('questionProgress');
        if (progressElement) {
            progressElement.textContent = `Question ${this.currentQuestion + 1} of ${this.totalQuestions}`;
        }
        
        this.updateNavigation();
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const finishBtn = document.getElementById('finishBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }

        if (nextBtn && finishBtn) {
            if (this.currentQuestion === this.totalQuestions - 1) {
                nextBtn.style.display = 'none';
                finishBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'inline-block';
                finishBtn.style.display = 'none';
            }
        }
    }

    goToQuestion(questionIndex) {
        if (questionIndex >= 0 && questionIndex < this.totalQuestions) {
            // Stop current question timer
            window.timerManager.stopQuestionTimer(this.currentQuestion);
            
            this.currentQuestion = questionIndex;
            this.updateProgress();
            
            // Load the new question
            if (window.quizEngine) {
                window.quizEngine.loadQuestion(questionIndex);
            }
            
            // Start new question timer
            window.timerManager.startQuestionTimer(questionIndex);
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.goToQuestion(this.currentQuestion + 1);
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.goToQuestion(this.currentQuestion - 1);
        }
    }

    saveAnswer(questionIndex, answer) {
        this.answers[questionIndex] = answer;
        this.questionStates[questionIndex] = true;
        this.updateNavigation();
        
        // Auto-save progress
        this.saveProgress();
    }

    getAnswer(questionIndex) {
        return this.answers[questionIndex];
    }

    getAllAnswers() {
        return { ...this.answers };
    }

    getAnsweredCount() {
        return Object.keys(this.answers).length;
    }

    getCompletionPercentage() {
        return Math.round((this.getAnsweredCount() / this.totalQuestions) * 100);
    }

    isQuestionAnswered(questionIndex) {
        return this.questionStates[questionIndex] || false;
    }

    saveProgress() {
        const progressData = {
            currentQuestion: this.currentQuestion,
            totalQuestions: this.totalQuestions,
            answers: this.answers,
            questionStates: this.questionStates,
            timestamp: Date.now()
        };
        
        localStorage.setItem('quizProgress', JSON.stringify(progressData));
    }

    loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentQuestion = data.currentQuestion || 0;
            this.totalQuestions = data.totalQuestions || 0;
            this.answers = data.answers || {};
            this.questionStates = data.questionStates || {};
            
            return true;
        }
        return false;
    }

    clearProgress() {
        localStorage.removeItem('quizProgress');
        this.currentQuestion = 0;
        this.answers = {};
        this.questionStates = {};
    }

    getProgressSummary() {
        return {
            currentQuestion: this.currentQuestion + 1,
            totalQuestions: this.totalQuestions,
            answeredCount: this.getAnsweredCount(),
            completionPercentage: this.getCompletionPercentage(),
            answers: this.getAllAnswers()
        };
    }
}

// Global progress tracker instance
window.progressTracker = new ProgressTracker();