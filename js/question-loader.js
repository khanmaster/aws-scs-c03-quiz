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
                throw new Error(`Failed to load questions: HTTP ${response.status}`);
            }
            const data = await response.json();
            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error('Invalid questions data format');
            }
            
            // Validate each question has required fields
            const validQuestions = data.questions.filter(q => {
                return q.id && q.question && q.options && q.correct !== undefined && q.explanation;
            });
            
            if (validQuestions.length === 0) {
                throw new Error('No valid questions found');
            }
            
            this.questions = validQuestions;
            console.log(`Loaded ${this.questions.length} valid questions`);
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questions = [];
            // Show user-friendly error message
            if (typeof window !== 'undefined' && window.alert) {
                alert('Failed to load quiz questions. Please refresh the page and try again.');
            }
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
        try {
            if (this.questions.length === 0) {
                console.error('No questions available');
                return [];
            }
            
            if (!Number.isInteger(count) || count <= 0) {
                console.error('Invalid question count:', count);
                return [];
            }

            const availableQuestions = [...this.questions];
            const shuffled = this.shuffleArray(availableQuestions);
            this.selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
            
            console.log(`Selected ${this.selectedQuestions.length} questions out of ${count} requested`);
            return this.selectedQuestions;
        } catch (error) {
            console.error('Error selecting questions:', error);
            return [];
        }
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