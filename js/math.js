const mathQuestionDisplay = document.getElementById('math-question');
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
const btnRestartJourney = document.getElementById('btn-restart-journey');
const btnPause = document.getElementById('btn-pause');
const optionContainer = document.getElementById('options-container');

// Game Settings
const TIME_PER_QUESTION = 15; // Increased time for math sprint
const TOTAL_QUESTIONS = 10;
let questionIndex = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerInterval;
let canAnswer = false;
let currentCorrectAnswer = 0;
let isPaused = false;

// Initialize Game
function initGame() {
    score = 0;
    questionIndex = 0;
    isPaused = false;
    btnPause.textContent = "Pause";
    questionBox.classList.remove('hidden');
    optionContainer.classList.remove('hidden');
    
    updateScoreDisplay();
    modalOverlay.classList.remove('active');
    
    loadQuestion();
}

// Generate Math Problem
function generateProblem() {
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    if (op === '+') {
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        answer = num1 + num2;
    } else if (op === '-') {
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1); // Ensure positive result
        answer = num1 - num2;
    } else {
        num1 = Math.floor(Math.random() * 10) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = num1 * num2;
    }

    // Generate options
    const options = [answer];
    while(options.length < 4) {
        // Generate random offset from correct answer
        const offset = Math.floor(Math.random() * 10) + 1;
        const sign = Math.random() > 0.5 ? 1 : -1;
        const fakeAnswer = answer + (offset * sign);
        
        if (!options.includes(fakeAnswer) && fakeAnswer >= 0) {
            options.push(fakeAnswer);
        }
    }

    // Shuffle options
    options.sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(answer);

    return {
        text: `${num1} ${op} ${num2}`,
        options: options,
        correctIndex: correctIndex,
        answer: answer
    };
}

// Load a question
function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = TIME_PER_QUESTION;
    updateTimerUI();
    timerBar.classList.remove('warning');

    const problem = generateProblem();
    mathQuestionDisplay.textContent = problem.text;
    currentCorrectAnswer = problem.correctIndex;
    questionTracker.textContent = `Q: ${questionIndex + 1}/${TOTAL_QUESTIONS}`;

    // Setup options
    optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach((btn, index) => {
        btn.textContent = problem.options[index];
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
        
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => handleAnswer(index, newBtn));
    });

    optionButtons = document.querySelectorAll('.option-btn');
    canAnswer = true;
    startTimer();
}

function handleAnswer(selectedIndex, selectedBtn) {
    if (!canAnswer) return;
    canAnswer = false;
    clearInterval(timerInterval);

    const isCorrect = selectedIndex === currentCorrectAnswer;

    if (isCorrect) {
        score += 5;
        updateScoreDisplay();
        selectedBtn.classList.add('correct');
    } else {
        selectedBtn.classList.add('wrong');
        questionBox.classList.add('shake');
        setTimeout(() => questionBox.classList.remove('shake'), 400);
        optionButtons[currentCorrectAnswer].classList.add('correct');
    }

    optionButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        questionIndex++;
        if (questionIndex < TOTAL_QUESTIONS) {
            loadQuestion();
        } else {
            endGame();
        }
    }, 1000); // Shorter delay for sprint
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
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
    if (!canAnswer && !isPaused) return;

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
    questionBox.classList.add('shake');
    setTimeout(() => questionBox.classList.remove('shake'), 400);

    optionButtons[currentCorrectAnswer].classList.add('correct');
    optionButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        questionIndex++;
        if (questionIndex < TOTAL_QUESTIONS) {
            loadQuestion();
        } else {
            endGame();
        }
    }, 1000);
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function endGame() {
    clearInterval(timerInterval);
    finalScoreDisplay.textContent = score;
    
    const percentage = score / (TOTAL_QUESTIONS * 5);
    
    if (percentage > 0.8) {
        feedbackMessage.textContent = "Math Genius! Incredible speed!";
    } else if (percentage > 0.5) {
        feedbackMessage.textContent = "Solid calculations! Keep practicing.";
    } else {
        feedbackMessage.textContent = "Good try! Math requires a bit more focus.";
    }

    // Progression: Complete loop!
    // Since this is the last game, the user can restart the journey.
    btnRestartJourney.addEventListener('click', () => {
        // Optional: clear progress if they want to truly restart
        // localStorage.setItem('unlockedLevel', 1);
        window.location.href = 'quiz.html';
    });

    modalOverlay.classList.add('active');
}

btnPlayAgain.addEventListener('click', initGame);

window.addEventListener('DOMContentLoaded', initGame);
