// Timer Management System
class TimerManager {
    constructor() {
        this.totalStartTime = null;
        this.questionStartTime = null;
        this.totalInterval = null;
        this.questionInterval = null;
        this.questionTimes = [];
        this.isPaused = false;
    }

    startTotalTimer() {
        this.totalStartTime = Date.now();
        this.totalInterval = setInterval(() => {
            if (!this.isPaused) {
                this.updateTotalDisplay();
            }
        }, 1000);
    }

    startQuestionTimer(questionIndex) {
        this.questionStartTime = Date.now();
        this.questionInterval = setInterval(() => {
            if (!this.isPaused) {
                this.updateQuestionDisplay();
            }
        }, 1000);
    }

    stopQuestionTimer(questionIndex) {
        if (this.questionInterval) {
            clearInterval(this.questionInterval);
            this.questionInterval = null;
        }

        if (this.questionStartTime) {
            const timeSpent = Date.now() - this.questionStartTime;
            this.questionTimes[questionIndex] = timeSpent;
            this.questionStartTime = null;
        }
    }

    stopTotalTimer() {
        if (this.totalInterval) {
            clearInterval(this.totalInterval);
            this.totalInterval = null;
        }
    }

    pauseTimers() {
        this.isPaused = true;
    }

    resumeTimers() {
        this.isPaused = false;
    }

    updateTotalDisplay() {
        if (!this.totalElement) {
            this.totalElement = document.getElementById('totalTimer');
        }
        if (this.totalElement && this.totalStartTime) {
            const elapsed = Date.now() - this.totalStartTime;
            this.totalElement.textContent = `Total Time: ${this.formatTime(elapsed)}`;
        }
    }

    updateQuestionDisplay() {
        if (!this.questionElement) {
            this.questionElement = document.getElementById('questionTimer');
        }
        if (this.questionElement && this.questionStartTime) {
            const elapsed = Date.now() - this.questionStartTime;
            this.questionElement.textContent = this.formatTime(elapsed);
        }
    }

    formatTime(milliseconds) {
        return Utils.formatTime(milliseconds);
    }

    getTotalTime() {
        if (this.totalStartTime) {
            return Date.now() - this.totalStartTime;
        }
        return 0;
    }

    getQuestionTime(questionIndex) {
        return this.questionTimes[questionIndex] || 0;
    }

    getAllQuestionTimes() {
        return [...this.questionTimes];
    }

    reset() {
        this.stopTotalTimer();
        this.stopQuestionTimer();
        this.totalStartTime = null;
        this.questionStartTime = null;
        this.questionTimes = [];
        this.isPaused = false;
    }

    saveTimerState() {
        const state = {
            totalStartTime: this.totalStartTime,
            questionTimes: this.questionTimes,
            currentQuestionStart: this.questionStartTime
        };
        localStorage.setItem('timerState', JSON.stringify(state));
    }

    loadTimerState() {
        const saved = localStorage.getItem('timerState');
        if (saved) {
            const state = JSON.parse(saved);
            this.totalStartTime = state.totalStartTime;
            this.questionTimes = state.questionTimes || [];
            this.questionStartTime = state.currentQuestionStart;
            
            if (this.totalStartTime) {
                this.startTotalTimer();
            }
        }
    }
}

// Global timer instance
window.timerManager = new TimerManager();