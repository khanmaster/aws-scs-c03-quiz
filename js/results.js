// Results Management System
class ResultsManager {
    constructor() {
        this.results = null;
        this.loadResults();
    }

    loadResults() {
        const savedResults = localStorage.getItem('quizResults');
        if (savedResults) {
            this.results = JSON.parse(savedResults);
            this.displayResults();
        } else {
            this.showNoResults();
        }
    }

    displayResults() {
        if (!this.results) return;

        const summaryElement = document.getElementById('resultsSummary');
        if (!summaryElement) return;

        const score = this.calculateScore();
        const totalTime = this.formatTime(this.results.totalTime);
        const averageTime = this.formatTime(this.results.totalTime / this.results.questions.length);

        summaryElement.innerHTML = `
            <div class="score-display">
                <h2>Quiz Complete!</h2>
                <div class="score-circle">
                    <span class="score-number">${score.percentage}%</span>
                    <span class="score-fraction">${score.correct}/${score.total}</span>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>Total Time</h3>
                    <p>${totalTime}</p>
                </div>
                <div class="stat-item">
                    <h3>Average per Question</h3>
                    <p>${averageTime}</p>
                </div>
                <div class="stat-item">
                    <h3>Questions Answered</h3>
                    <p>${Object.keys(this.results.answers).length}/${this.results.questions.length}</p>
                </div>
                <div class="stat-item">
                    <h3>Completion Rate</h3>
                    <p>${Math.round((Object.keys(this.results.answers).length / this.results.questions.length) * 100)}%</p>
                </div>
            </div>
            
            <div class="performance-breakdown">
                <h3>Performance Breakdown</h3>
                ${this.generatePerformanceBreakdown()}
            </div>
            
            <div class="time-analysis">
                <h3>Time Analysis</h3>
                ${this.generateTimeAnalysis()}
            </div>
        `;

        this.addResultsStyles();
    }

    calculateScore() {
        let correct = 0;
        const total = this.results.questions.length;

        this.results.questions.forEach((question, index) => {
            const userAnswer = this.results.answers[index];
            if (userAnswer !== undefined) {
                if (this.isAnswerCorrect(question, userAnswer)) {
                    correct++;
                }
            }
        });

        return {
            correct,
            total,
            percentage: Math.round((correct / total) * 100)
        };
    }

    isAnswerCorrect(question, userAnswer) {
        const correctAnswers = question.correct;
        
        if (question.type === 'multiple') {
            const userArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
            const correctArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
            
            if (userArray.length !== correctArray.length) return false;
            
            const sortedUser = userArray.sort((a, b) => a - b);
            const sortedCorrect = correctArray.sort((a, b) => a - b);
            
            return sortedUser.every((val, index) => val === sortedCorrect[index]);
        } else {
            return userAnswer === correctAnswers[0] || userAnswer === correctAnswers;
        }
    }

    generatePerformanceBreakdown() {
        let breakdown = '<div class="question-results">';
        
        this.results.questions.forEach((question, index) => {
            const userAnswer = this.results.answers[index];
            const isCorrect = userAnswer !== undefined ? this.isAnswerCorrect(question, userAnswer) : false;
            const wasAnswered = userAnswer !== undefined;
            const questionTime = this.results.questionTimes[index] || 0;
            
            breakdown += `
                <div class="question-result ${isCorrect ? 'correct' : wasAnswered ? 'incorrect' : 'unanswered'}">
                    <div class="question-number">Q${index + 1}</div>
                    <div class="question-status">
                        ${isCorrect ? '✅ Correct' : wasAnswered ? '❌ Incorrect' : '⚪ Unanswered'}
                    </div>
                    <div class="question-time">${this.formatTime(questionTime)}</div>
                </div>
            `;
        });
        
        breakdown += '</div>';
        return breakdown;
    }

    generateTimeAnalysis() {
        const questionTimes = this.results.questionTimes.filter(time => time > 0);
        if (questionTimes.length === 0) return '<p>No timing data available.</p>';

        const avgTime = questionTimes.reduce((sum, time) => sum + time, 0) / questionTimes.length;
        const maxTime = Math.max(...questionTimes);
        const minTime = Math.min(...questionTimes);

        return `
            <div class="time-stats">
                <div class="time-stat">
                    <span class="label">Fastest Question:</span>
                    <span class="value">${this.formatTime(minTime)}</span>
                </div>
                <div class="time-stat">
                    <span class="label">Slowest Question:</span>
                    <span class="value">${this.formatTime(maxTime)}</span>
                </div>
                <div class="time-stat">
                    <span class="label">Average Time:</span>
                    <span class="value">${this.formatTime(avgTime)}</span>
                </div>
            </div>
        `;
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showNoResults() {
        const summaryElement = document.getElementById('resultsSummary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="no-results">
                    <h2>No Results Found</h2>
                    <p>No quiz results were found. Please take a quiz first.</p>
                    <button onclick="window.location.href='index.html'">Start Quiz</button>
                </div>
            `;
        }
    }

    addResultsStyles() {
        if (document.getElementById('results-styles')) return;

        const style = document.createElement('style');
        style.id = 'results-styles';
        style.textContent = `
            .score-display {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .score-circle {
                display: inline-block;
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 1rem auto;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            }
            
            .score-number {
                font-size: 2.5rem;
                font-weight: bold;
            }
            
            .score-fraction {
                font-size: 1rem;
                opacity: 0.9;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .stat-item {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 8px;
                text-align: center;
                border-left: 4px solid #667eea;
            }
            
            .stat-item h3 {
                color: #333;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            
            .stat-item p {
                font-size: 1.5rem;
                font-weight: bold;
                color: #667eea;
            }
            
            .performance-breakdown, .time-analysis {
                margin-bottom: 2rem;
            }
            
            .question-results {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1rem;
            }
            
            .question-result {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #ddd;
            }
            
            .question-result.correct {
                background: rgba(76, 175, 80, 0.1);
                border-left-color: #4CAF50;
            }
            
            .question-result.incorrect {
                background: rgba(244, 67, 54, 0.1);
                border-left-color: #f44336;
            }
            
            .question-result.unanswered {
                background: rgba(158, 158, 158, 0.1);
                border-left-color: #9e9e9e;
            }
            
            .question-number {
                font-weight: bold;
                margin-right: 1rem;
                min-width: 30px;
            }
            
            .question-status {
                flex: 1;
            }
            
            .question-time {
                font-size: 0.9rem;
                color: #666;
            }
            
            .time-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .time-stat {
                display: flex;
                justify-content: space-between;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .time-stat .label {
                color: #666;
            }
            
            .time-stat .value {
                font-weight: bold;
                color: #333;
            }
            
            .no-results {
                text-align: center;
                padding: 3rem;
            }
            
            .no-results button {
                margin-top: 1rem;
                padding: 12px 24px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Global functions
function reviewAnswers() {
    // Store current results for review
    localStorage.setItem('reviewMode', 'true');
    window.location.href = 'quiz.html';
}

// Initialize results when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ResultsManager();
});