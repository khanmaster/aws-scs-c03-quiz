// Question Loader and Management
class QuestionLoader {
    constructor() {
        this.questions = [];
        this.selectedQuestions = [];
        this.loadQuestions();
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error('Invalid questions data format');
            }
            this.questions = data.questions;
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questions = [];
            // Could show user-friendly error message here
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    selectQuestions(count) {
        if (this.questions.length === 0) {
            console.error('No questions available');
            return [];
        }

        const availableQuestions = [...this.questions];
        const shuffled = this.shuffleArray(availableQuestions);
        this.selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
        
        return this.selectedQuestions;
    }

    getQuestion(index) {
        return this.selectedQuestions[index] || null;
    }

    getTotalQuestions() {
        return this.selectedQuestions.length;
    }

    validateAnswer(questionIndex, selectedOptions) {
        const question = this.getQuestion(questionIndex);
        if (!question) return false;

        const correctAnswers = question.correct;
        
        // Convert to arrays for comparison
        const selected = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
        const correct = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];

        // Check if arrays have same length and same elements
        if (selected.length !== correct.length) return false;
        
        const sortedSelected = selected.sort((a, b) => a - b);
        const sortedCorrect = correct.sort((a, b) => a - b);
        
        return sortedSelected.every((val, index) => val === sortedCorrect[index]);
    }

    getQuestionKeywords(questionIndex) {
        const question = this.getQuestion(questionIndex);
        return question?.keywords || [];
    }
}

// Global question loader instance
window.questionLoader = new QuestionLoader();