const questionText = document.getElementById('question-text');
const optionContainer = document.getElementById('options-container');
let optionButtons = document.querySelectorAll('.option-btn');
const scoreDisplay = document.getElementById('score-display');
const questionTracker = document.getElementById('question-tracker');
const timerBar = document.getElementById('timer-bar');
const questionBox = document.getElementById('question-box');

// Modal Elements
const modalOverlay = document.getElementById('game-over-modal');
const finalScoreDisplay = document.getElementById('final-score-display');
const feedbackMessage = document.getElementById('feedback-message');
const btnPlayAgain = document.getElementById('btn-play-again');
const btnNextGame = document.getElementById('btn-next-game');
const btnPause = document.getElementById('btn-pause');
const languageSelect = document.getElementById('language-select');

// Game Settings & State
const TIME_PER_QUESTION = 15; // seconds
const TOTAL_QUESTIONS = 10;
let currentQuestions = [];
let questionIndex = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerInterval;
let canAnswer = false;
let isPaused = false;

// Utility to decode HTML entities from API
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// Fetch questions from API (English)
async function fetchQuestions() {
    questionText.textContent = "Loading dynamic questions...";
    try {
        const res = await fetch(`https://opentdb.com/api.php?amount=${TOTAL_QUESTIONS}&type=multiple`);
        const data = await res.json();
        
        return data.results.map(q => {
            const options = [...q.incorrect_answers.map(decodeHTML)];
            const correctAnswer = decodeHTML(q.correct_answer);
            
            const correctIndex = Math.floor(Math.random() * 4);
            options.splice(correctIndex, 0, correctAnswer);
            
            return {
                question: decodeHTML(q.question),
                options: options,
                correctAnswer: correctIndex
            };
        });
    } catch (err) {
        console.error("Failed to fetch questions", err);
        questionText.textContent = "Failed to load questions. Please refresh.";
        return [];
    }
}

// Utility: Get random questions from local data (Tamil)
function getRandomTamilQuestions(num) {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random()).slice(0, num);
    
    // Scramble options for each question to make it dynamic
    return shuffled.map(q => {
        const correctText = q.options[q.correctAnswer];
        let newOptions = [...q.options];
        newOptions.sort(() => 0.5 - Math.random());
        const newCorrectIndex = newOptions.indexOf(correctText);
        
        return {
            question: q.question,
            options: newOptions,
            correctAnswer: newCorrectIndex
        };
    });
}

// Initialize Game
async function initGame() {
    // Reset state
    score = 0;
    questionIndex = 0;
    isPaused = false;
    btnPause.textContent = "Pause";
    questionBox.classList.remove('hidden');
    optionContainer.classList.remove('hidden');
    
    updateScoreDisplay();
    modalOverlay.classList.remove('active');
    btnNextGame.classList.add('hidden');
    
    // Disable buttons while loading
    optionButtons.forEach(btn => btn.disabled = true);
    languageSelect.disabled = true;
    
    // Fetch random questions based on selected language
    if (languageSelect.value === 'en') {
        currentQuestions = await fetchQuestions();
    } else {
        currentQuestions = getRandomTamilQuestions(TOTAL_QUESTIONS);
    }
    
    if (currentQuestions.length > 0) {
        languageSelect.disabled = false;
        loadQuestion();
    }
}

// Load a question into the UI
function loadQuestion() {
    // Reset Timer
    clearInterval(timerInterval);
    timeLeft = TIME_PER_QUESTION;
    updateTimerUI();
    timerBar.classList.remove('warning');

    const currentQ = currentQuestions[questionIndex];
    questionText.textContent = currentQ.question;
    questionTracker.textContent = `Q: ${questionIndex + 1}/${TOTAL_QUESTIONS}`;

    // Setup options
    // First, re-select buttons to ensure we have the current DOM elements
    optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach((btn, index) => {
        btn.textContent = currentQ.options[index];
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
        
        // Remove old event listeners by replacing the node
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new click listener
        newBtn.addEventListener('click', () => handleAnswer(index, newBtn));
    });

    // Re-select newly cloned buttons for future reference
    optionButtons = document.querySelectorAll('.option-btn');
    
    // Enable answering
    canAnswer = true;

    // Start timer
    startTimer();
}

// Handle Answer Selection
function handleAnswer(selectedIndex, selectedBtn) {
    if (!canAnswer) return;
    canAnswer = false; // Prevent multiple clicks
    clearInterval(timerInterval); // Stop timer

    const currentQ = currentQuestions[questionIndex];
    const isCorrect = selectedIndex === currentQ.correctAnswer;

    if (isCorrect) {
        // Fixed scoring: exactly 5 marks per correct answer
        score += 5;
        updateScoreDisplay();
        
        selectedBtn.classList.add('correct');
    } else {
        selectedBtn.classList.add('wrong');
        questionBox.classList.add('shake'); // Shake effect
        setTimeout(() => questionBox.classList.remove('shake'), 400);
        
        // Highlight correct answer
        optionButtons[currentQ.correctAnswer].classList.add('correct');
    }

    // Disable all buttons
    optionButtons.forEach(btn => btn.disabled = true);

    // Wait and load next question or finish game
    setTimeout(() => {
        questionIndex++;
        if (questionIndex < TOTAL_QUESTIONS) {
            loadQuestion();
        } else {
            endGame();
        }
    }, 1500); // 1.5 seconds delay to see the answer
}

// Timer Logic
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft -= 0.1; // Decrease by 100ms
        
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timerInterval);
            handleTimeUp();
        }
        
        updateTimerUI();
    }, 100);
}

function updateTimerUI() {
    const percentage = (timeLeft / TIME_PER_QUESTION) * 100;
    timerBar.style.width = `${percentage}%`;
    
    if (percentage < 30) {
        timerBar.classList.add('warning');
    }
}

// Pause functionality
function togglePause() {
    if (!canAnswer && !isPaused) return; // Prevent pausing during transitions

    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(timerInterval);
        btnPause.textContent = "Resume";
        questionBox.classList.add('hidden');
        optionContainer.classList.add('hidden');
    } else {
        startTimer();
        btnPause.textContent = "Pause";
        questionBox.classList.remove('hidden');
        optionContainer.classList.remove('hidden');
    }
}

btnPause.addEventListener('click', togglePause);

function handleTimeUp() {
    canAnswer = false;
    const currentQ = currentQuestions[questionIndex];
    
    questionBox.classList.add('shake');
    setTimeout(() => questionBox.classList.remove('shake'), 400);

    // Highlight correct answer
    optionButtons[currentQ.correctAnswer].classList.add('correct');
    optionButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        questionIndex++;
        if (questionIndex < TOTAL_QUESTIONS) {
            loadQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

// Update Score UI
function updateScoreDisplay() {
    const currentDisplayScore = parseInt(scoreDisplay.textContent.replace('Score: ', '')) || 0;
    const targetScore = score;
    
    if (currentDisplayScore === targetScore) return;

    let step = 0;
    const maxSteps = 10;
    const difference = targetScore - currentDisplayScore;
    const stepValue = difference / maxSteps;

    const animateScore = setInterval(() => {
        step++;
        const newScore = Math.floor(currentDisplayScore + (stepValue * step));
        scoreDisplay.textContent = `Score: ${newScore}`;
        
        if (step >= maxSteps) {
            clearInterval(animateScore);
            scoreDisplay.textContent = `Score: ${targetScore}`;
        }
    }, 30);
}

// End Game
function endGame() {
    clearInterval(timerInterval);
    
    finalScoreDisplay.textContent = score;
    
    // Set feedback message based on score
    const maxPossibleScore = TOTAL_QUESTIONS * 5;
    const percentage = score / maxPossibleScore;
    
    if (percentage > 0.8) {
        feedbackMessage.textContent = "Genius Level! Outstanding performance!";
    } else if (percentage > 0.5) {
        feedbackMessage.textContent = "Great job! Your brain is sharp!";
    } else {
        feedbackMessage.textContent = "Good effort! Keep playing to train your brain!";
    }

    // Unlock Level 2 (Memory Matrix)
    let currentLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
    if (currentLevel < 2) {
        localStorage.setItem('unlockedLevel', 2);
    }

    // Show Next Game Button
    btnNextGame.classList.remove('hidden');

    modalOverlay.classList.add('active');
}

// Event Listeners
btnPlayAgain.addEventListener('click', initGame);
languageSelect.addEventListener('change', initGame);

// Start game on load
window.addEventListener('DOMContentLoaded', initGame);
