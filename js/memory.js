const grid = document.getElementById('memory-grid');
const movesTracker = document.getElementById('moves-tracker');
const matchesTracker = document.getElementById('matches-tracker');
const modalOverlay = document.getElementById('game-over-modal');
const finalMovesDisplay = document.getElementById('final-moves-display');
const btnPlayAgain = document.getElementById('btn-play-again');
const btnPause = document.getElementById('btn-pause');

const emojis = ['🍎', '🚀', '💎', '🎸', '⚡', '🍕', '👻', '💡'];
let cards = [];
let flippedCards = [];
let matches = 0;
let moves = 0;
let canFlip = true;
let isPaused = false;

// Initialize Game
function initGame() {
    // Reset state
    grid.innerHTML = '';
    cards = [];
    flippedCards = [];
    matches = 0;
    moves = 0;
    canFlip = true;
    isPaused = false;
    btnPause.textContent = "Pause";
    grid.classList.remove('hidden');
    
    updateStats();
    modalOverlay.classList.remove('active');

    // Create deck (2 of each emoji)
    const deck = [...emojis, ...emojis];
    
    // Shuffle deck
    deck.sort(() => 0.5 - Math.random());

    // Generate DOM
    deck.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;

        const front = document.createElement('div');
        front.classList.add('card-front');

        const back = document.createElement('div');
        back.classList.add('card-back');
        back.textContent = emoji;

        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', () => handleCardClick(card));
        
        grid.appendChild(card);
    });
}

function handleCardClick(card) {
    if (!canFlip) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matches++;
        updateStats();
        flippedCards = [];
        
        if (matches === emojis.length) {
            setTimeout(endGame, 500);
        }
    } else {
        // No match
        canFlip = false;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function updateStats() {
    movesTracker.textContent = `Moves: ${moves}`;
    matchesTracker.textContent = `Matches: ${matches}/8`;
}

// Pause functionality
function togglePause() {
    if (matches === emojis.length) return; // Don't pause if game over

    isPaused = !isPaused;

    if (isPaused) {
        canFlip = false;
        btnPause.textContent = "Resume";
        grid.classList.add('hidden');
    } else {
        canFlip = true;
        btnPause.textContent = "Pause";
        grid.classList.remove('hidden');
    }
}

btnPause.addEventListener('click', togglePause);

function endGame() {
    finalMovesDisplay.textContent = moves;
    
    // Unlock Level 3 (Math Sprint)
    let currentLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
    if (currentLevel < 3) {
        localStorage.setItem('unlockedLevel', 3);
    }

    modalOverlay.classList.add('active');
}

btnPlayAgain.addEventListener('click', initGame);

// Start game
window.addEventListener('DOMContentLoaded', initGame);
