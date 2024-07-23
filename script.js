// DOM elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.querySelector('.game-board');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const timeDisplayContainer = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const backToHomeBtn = document.getElementById('back-to-home');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const timerToggle = document.getElementById('timer-toggle');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let time = 0;
let timer;
let timerOn = true;
let difficulty = 'beginner';
let gameInProgress = false;

// List of icon classes for the cards
const iconClasses = [
    'fa-heart', 'fa-star', 'fa-smile', 'fa-sun', 'fa-moon', 'fa-cloud', 'fa-coffee', 'fa-pizza-slice',
    'fa-ice-cream', 'fa-cat', 'fa-dog', 'fa-fish', 'fa-leaf', 'fa-tree', 'fa-flower', 'fa-rainbow',
    'fa-umbrella', 'fa-snowflake', 'fa-cookie', 'fa-gift', 'fa-camera', 'fa-music', 'fa-book', 'fa-palette',
    'fa-football', 'fa-baseball', 'fa-basketball', 'fa-bicycle', 'fa-car', 'fa-plane', 'fa-rocket', 'fa-anchor'
];

// Get a list of random icons
function getRandomIcons(count) {
    const shuffled = iconClasses.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Shuffle an array of cards
function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create a card element
function createCard(icon) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.icon = icon;
    card.addEventListener('click', flipCard);
    return card;
}

// Handle card flip
function flipCard() {
    if (!gameInProgress) return;
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.innerHTML = `<i class="fas ${this.dataset.icon}"></i>`;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }
}

// Check for a match between two cards
function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.icon === card2.dataset.icon) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === cards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.innerHTML = '';
            card2.innerHTML = '';
            flippedCards = [];
        }, 1000);
    }
}

// Start the game
function startGame() {
    gameInProgress = true;
    homeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resetGame();
}

// Update the timer
function updateTime() {
    time++;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// End the game
function endGame() {
    gameInProgress = false;
    clearInterval(timer);
    const timeStr = timerOn ? ` and ${timeDisplay.textContent} time` : '';
    alert(`Congratulations! You've completed the game in ${moves} moves${timeStr}.`);
    backToHome();
}

// Return to the home screen
function backToHome() {
    gameInProgress = false;
    clearInterval(timer);
    gameScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
}

// Reset the game
function resetGame() {
    gameBoard.innerHTML = '';
    moves = 0;
    movesDisplay.textContent = moves;
    matchedPairs = 0;
    time = 0;
    timeDisplay.textContent = '0:00';
    clearInterval(timer);
    flippedCards = [];

    let gridSize;
    switch (difficulty) {
        case 'beginner':
            gridSize = 4;
            break;
        case 'intermediate':
            gridSize = 6;
            break;
        case 'hard':
            gridSize = 8;
            break;
    }

    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    const icons = getRandomIcons((gridSize * gridSize) / 2);
    cards = [...icons, ...icons];
    shuffleCards(cards);

    cards.forEach(icon => {
        gameBoard.appendChild(createCard(icon));
    });

    if (timerOn) {
        timer = setInterval(updateTime, 1000);
        timeDisplayContainer.style.display = 'block';
    } else {
        timeDisplayContainer.style.display = 'none';
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);
backToHomeBtn.addEventListener('click', backToHome);
restartBtn.addEventListener('click', resetGame);

difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    resetGame();
});

timerToggle.addEventListener('click', () => {
    timerOn = !timerOn;
    timerToggle.textContent = `Timer: ${timerOn ? 'ON' : 'OFF'}`;
    if (!timerOn) {
        clearInterval(timer);
        timeDisplayContainer.style.display = 'none';
    } else {
        timer = setInterval(updateTime, 1000);
        timeDisplayContainer.style.display = 'block';
    }
});

// Initialize the game
backToHome();
