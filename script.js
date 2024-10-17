document.addEventListener('DOMContentLoaded', () => {
    fetch('db.json')

        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const quizContainer = document.getElementById('quiz-container');
            const categorySelect = document.getElementById('category');
            let filteredQuestions = [];
            let currentQuestionIndex = 0;
        

            const loadQuestions = (category) => {
                filteredQuestions = category === 'all' ? data.quiz : data.quiz.filter(q => q.category.trim() === category.trim());
                currentQuestionIndex = 0;
                displayQuestion();
            };

            const displayQuestion = () => {
                if (filteredQuestions.length > 0) {
                    const question = filteredQuestions[currentQuestionIndex];
                    quizContainer.innerHTML = `
                        <div class="question">
                            <p>${currentQuestionIndex + 1}. ${question.question}</p>
                            <input type="text" id="answer-input" placeholder="Your answer here">
                        </div>
                    `;
                    document.getElementById('result').innerHTML = '';
                } else {
                    quizContainer.innerHTML = '<p>No questions available in this category.</p>';
                }
            };

            loadQuestions('all');

            categorySelect.addEventListener('change', () => {
                loadQuestions(categorySelect.value);
            });

            document.getElementById('next-btn').addEventListener('click', () => {
                if (currentQuestionIndex < filteredQuestions.length - 1) {
                    currentQuestionIndex++;
                    displayQuestion();
                    
                } else {
                    alert('No more questions!');
                }
            });

            document.getElementById('submit-btn').addEventListener('click', () => {
                const userAnswer = document.getElementById('answer-input').value.trim();
                if (!filteredQuestions.length) {
                    alert('No questions to answer.');
                    return;
                }
                const correctAnswer = filteredQuestions[currentQuestionIndex].answer.trim();
                const result = userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? 'Correct!' : `Incorrect! The correct answer is: ${correctAnswer}`;
                document.getElementById('result').innerHTML = result;
            });
        })
        
});
