// Main Quiz Engine
class QuizEngine {
    constructor() {
        this.isInitialized = false;
        this.currentQuestionData = null;
        this.showingAnswer = false;
        this.highlightingKeywords = false;
        this.originalQuestionText = '';
    }

    async initialize() {
        // Wait for all dependencies to load
        await this.waitForDependencies();
        
        // Get quiz configuration
        const config = JSON.parse(localStorage.getItem('quizConfig'));
        if (!config) {
            alert('No quiz configuration found. Redirecting to home page.');
            window.location.href = 'index.html';
            return;
        }

        // Load questions
        const questions = window.questionLoader.selectQuestions(config.questionCount);
        if (questions.length === 0) {
            alert('No questions available. Please try again.');
            window.location.href = 'index.html';
            return;
        }

        // Initialize components
        window.progressTracker.initialize(questions.length);
        window.timerManager.startTotalTimer();
        
        // Load first question
        this.loadQuestion(0);
        window.timerManager.startQuestionTimer(0);
        
        this.isInitialized = true;
    }

    async waitForDependencies() {
        const maxWait = 5000; // 5 seconds
        const startTime = Date.now();
        
        while (!window.questionLoader || !window.progressTracker || !window.timerManager) {
            if (Date.now() - startTime > maxWait) {
                throw new Error('Dependencies failed to load');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Wait for questions to load
        while (window.questionLoader.questions.length === 0) {
            if (Date.now() - startTime > maxWait) {
                throw new Error('Questions failed to load');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    loadQuestion(questionIndex) {
        const question = window.questionLoader.getQuestion(questionIndex);
        if (!question) {
            console.error('Question not found:', questionIndex);
            return;
        }

        this.currentQuestionData = question;
        this.showingAnswer = false;
        this.highlightingKeywords = false;
        
        // Update question display
        this.displayQuestion(question);
        
        // Load saved answer if exists
        const savedAnswer = window.progressTracker.getAnswer(questionIndex);
        if (savedAnswer !== undefined) {
            this.loadSavedAnswer(savedAnswer);
        }
        
        // Reset button states
        this.resetButtonStates();
    }

    displayQuestion(question) {
        // Update question title
        const titleElement = document.getElementById('questionTitle');
        if (titleElement) {
            titleElement.textContent = `Question ${window.progressTracker.currentQuestion + 1}`;
        }

        // Update question text
        const textElement = document.getElementById('questionText');
        if (textElement) {
            textElement.innerHTML = question.question;
            this.originalQuestionText = question.question;
        }

        // Create answer options
        this.createAnswerOptions(question);
        
        // Hide explanation
        const explanationElement = document.getElementById('explanation');
        if (explanationElement) {
            explanationElement.style.display = 'none';
        }
    }

    createAnswerOptions(question) {
        const optionsContainer = document.getElementById('answerOptions');
        if (!optionsContainer) return;

        optionsContainer.innerHTML = '';
        
        const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
        const inputName = question.type === 'multiple' ? `question_${question.id}` : `question_${question.id}`;

        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const input = document.createElement('input');
            input.type = inputType;
            input.id = `option_${index}`;
            input.name = inputName;
            input.value = index;
            input.onchange = () => this.handleAnswerChange();
            
            const label = document.createElement('label');
            label.htmlFor = `option_${index}`;
            label.textContent = option;
            
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            optionsContainer.appendChild(optionDiv);
        });
    }

    loadSavedAnswer(savedAnswer) {
        const answers = Array.isArray(savedAnswer) ? savedAnswer : [savedAnswer];
        
        answers.forEach(answerIndex => {
            const input = document.getElementById(`option_${answerIndex}`);
            if (input) {
                input.checked = true;
            }
        });
    }

    handleAnswerChange() {
        const selectedAnswers = this.getSelectedAnswers();
        window.progressTracker.saveAnswer(window.progressTracker.currentQuestion, selectedAnswers);
    }

    getSelectedAnswers() {
        const inputs = document.querySelectorAll('#answerOptions input:checked');
        const answers = Array.from(inputs).map(input => parseInt(input.value));
        return this.currentQuestionData.type === 'multiple' ? answers : answers[0];
    }

    showAnswer() {
        if (this.showingAnswer) return;
        
        this.showingAnswer = true;
        
        // Stop question timer
        window.timerManager.stopQuestionTimer(window.progressTracker.currentQuestion);
        
        // Highlight correct/incorrect answers
        this.highlightAnswers();
        
        // Show explanation
        this.showExplanation();
        
        // Update button states
        document.getElementById('showAnswerBtn').style.display = 'none';
        document.getElementById('keyWordsBtn').style.display = 'inline-block';
        document.getElementById('resetBtn').style.display = 'inline-block';
    }

    highlightAnswers() {
        const correctAnswers = this.currentQuestionData.correct;
        const correctArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
        
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            const input = option.querySelector('input');
            const isCorrect = correctArray.includes(index);
            const isSelected = input.checked;
            
            if (isCorrect) {
                option.classList.add('correct');
                // Add checkmark
                if (!option.querySelector('.result-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'result-icon';
                    icon.textContent = ' ✅';
                    option.appendChild(icon);
                }
            } else if (isSelected) {
                option.classList.add('incorrect');
                // Add X mark
                if (!option.querySelector('.result-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'result-icon';
                    icon.textContent = ' ❌';
                    option.appendChild(icon);
                }
            }
        });
    }

    showExplanation() {
        const explanationElement = document.getElementById('explanation');
        if (explanationElement && this.currentQuestionData.explanation) {
            explanationElement.innerHTML = `<h4>Explanation:</h4><p>${this.currentQuestionData.explanation}</p>`;
            explanationElement.style.display = 'block';
        }
    }

    highlightKeywords() {
        if (this.highlightingKeywords) return;
        
        this.highlightingKeywords = true;
        const keywords = window.questionLoader.getQuestionKeywords(window.progressTracker.currentQuestion);
        
        if (keywords.length === 0) return;
        
        const textElement = document.getElementById('questionText');
        if (!textElement) return;
        
        let highlightedText = this.originalQuestionText;
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, `<span class="keyword-highlight">${this.escapeHtml(keyword)}</span>`);
        });
        
        textElement.innerHTML = highlightedText;
    }

    resetQuestion() {
        // Clear all selections
        const inputs = document.querySelectorAll('#answerOptions input');
        inputs.forEach(input => input.checked = false);
        
        // Remove highlighting
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('correct', 'incorrect');
            const icon = option.querySelector('.result-icon');
            if (icon) icon.remove();
        });
        
        // Reset question text
        const textElement = document.getElementById('questionText');
        if (textElement) {
            textElement.innerHTML = this.originalQuestionText;
        }
        
        // Hide explanation
        const explanationElement = document.getElementById('explanation');
        if (explanationElement) {
            explanationElement.style.display = 'none';
        }
        
        // Reset states
        this.showingAnswer = false;
        this.highlightingKeywords = false;
        
        // Reset buttons
        this.resetButtonStates();
        
        // Clear saved answer
        window.progressTracker.saveAnswer(window.progressTracker.currentQuestion, undefined);
        
        // Restart question timer
        window.timerManager.startQuestionTimer(window.progressTracker.currentQuestion);
    }

    resetButtonStates() {
        document.getElementById('showAnswerBtn').style.display = 'inline-block';
        document.getElementById('keyWordsBtn').style.display = 'none';
        document.getElementById('resetBtn').style.display = 'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    finishQuiz() {
        // Stop all timers
        window.timerManager.stopQuestionTimer(window.progressTracker.currentQuestion);
        window.timerManager.stopTotalTimer();
        
        // Save final results
        const results = {
            answers: window.progressTracker.getAllAnswers(),
            totalTime: window.timerManager.getTotalTime(),
            questionTimes: window.timerManager.getAllQuestionTimes(),
            questions: window.questionLoader.selectedQuestions,
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('quizResults', JSON.stringify(results));
        
        // Clear progress
        window.progressTracker.clearProgress();
        
        // Redirect to results
        window.location.href = 'results.html';
    }
}

// Global quiz engine instance
window.quizEngine = new QuizEngine();

// Global functions for HTML onclick handlers
function showAnswer() {
    window.quizEngine.showAnswer();
}

function highlightKeywords() {
    window.quizEngine.highlightKeywords();
}

function resetQuestion() {
    window.quizEngine.resetQuestion();
}

function nextQuestion() {
    window.progressTracker.nextQuestion();
}

function previousQuestion() {
    window.progressTracker.previousQuestion();
}

function finishQuiz() {
    if (confirm('Are you sure you want to finish the quiz?')) {
        window.quizEngine.finishQuiz();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quizEngine.initialize().catch(error => {
        console.error('Failed to initialize quiz:', error);
        alert('Failed to load quiz. Please try again.');
        window.location.href = 'index.html';
    });
});