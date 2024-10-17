document.addEventListener('DOMContentLoaded', () => {
    // Fetching the quiz
    fetch('db.json')

        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            // for debugging
            console.log('Fetched data:', data); 

            if (!data || !data.quiz || !Array.isArray(data.quiz)) {
                console.error('Data format is incorrect:', data);
                document.getElementById('quiz-container').innerHTML = '<p>Error: No valid quiz data found.</p>';
                return;
            }

            const quizContainer = document.getElementById('quiz-container');
            const categorySelect = document.getElementById('category');
            let filteredQuestions = [];
            let currentQuestionIndex = 0;

            // Load questions based on the selected category
            const loadQuestions = (category) => {
                filteredQuestions = category === 'all' ? data.quiz : data.quiz.filter(q => q.category.trim() === category.trim());
                currentQuestionIndex = 0;
                displayQuestion();
            };

            // Display the current question
            const displayQuestion = () => {
                console.log('Current Index:', currentQuestionIndex); // Log current question index
                console.log('Filtered Questions:', filteredQuestions); // Log filtered questions

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
                    console.error('No questions found in the response.'); // Log error for debugging
                    quizContainer.innerHTML = '<p>No questions available.</p>';
                }
            };

            // Initial load of questions
            loadQuestions('all');

            // Update questions when category changes
            categorySelect.addEventListener('change', () => {
                loadQuestions(categorySelect.value);
            });

            // Handle next question button click
            document.getElementById('next-btn').addEventListener('click', () => {
                if (currentQuestionIndex < filteredQuestions.length - 1) {
                    currentQuestionIndex++;
                    displayQuestion();

                } else {
                    alert('No more questions!');
                }
            });

            // Handle submit answer button click
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
        .catch(error => {
            console.error('Fetch error:', error);
            document.getElementById('quiz-container').innerHTML = '<p>Error loading questions. Please try again later.</p>';
        });
});
