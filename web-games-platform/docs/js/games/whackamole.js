const grid = document.getElementById('grid');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

let score = 0;
let timeLeft = 30;
let activeIndex = null;
let interval = null;
let gameActive = false;
let moleTimeout = null;

function createGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.classList.add('hole');
        hole.dataset.index = i;
        hole.addEventListener('click', () => whack(i));
        grid.appendChild(hole);
    }
}

function whack(index) {
    if (!gameActive) return;
    if (activeIndex === index) {
        score++;
        scoreSpan.textContent = score;
        const hole = grid.children[index];
        hole.innerHTML = ''; // remove mole
        activeIndex = null;
    }
}

function showMole() {
    if (!gameActive) return;
    // remove existing mole
    if (activeIndex !== null) {
        const prev = grid.children[activeIndex];
        prev.innerHTML = '';
    }
    const newIndex = Math.floor(Math.random() * 9);
    activeIndex = newIndex;
    const moleHole = grid.children[activeIndex];
    moleHole.innerHTML = '🐭';
}

function startGame() {
    if (interval) clearInterval(interval);
    if (moleTimeout) clearTimeout(moleTimeout);
    score = 0;
    timeLeft = 30;
    scoreSpan.textContent = '0';
    timerSpan.textContent = '30';
    gameActive = true;
    activeIndex = null;
    // clear all holes
    for (let i = 0; i < 9; i++) {
        grid.children[i].innerHTML = '';
    }
    interval = setInterval(() => {
        if (!gameActive) return;
        timeLeft--;
        timerSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    // show mole with dynamic speed - starts slow, gets faster
    scheduleMole();
}

function getMoleDelay() {
    // Start at 1500ms, decrease by 50ms per point, minimum 500ms
    return Math.max(500, 1500 - score * 50);
}

function scheduleMole() {
    if (!gameActive) return;
    moleTimeout = setTimeout(() => {
        if (!gameActive) return;
        showMole();
        scheduleMole();
    }, getMoleDelay());
}

function endGame() {
    gameActive = false;
    if (interval) clearInterval(interval);
    if (moleTimeout) clearTimeout(moleTimeout);
    if (activeIndex !== null) {
        grid.children[activeIndex].innerHTML = '';
    }
    alert(`Game over! Your score: ${score}`);
    submitScoreIfLogged('whack', score);
}

restartBtn.addEventListener('click', () => {
    if (interval) clearInterval(interval);
    if (moleTimeout) clearTimeout(moleTimeout);
    startGame();
});

createGrid();
startGame();

async function submitScoreIfLogged(gameId, score) {
    if (authToken) {
        await submitScore(gameId, score);
    }
}

// Dark mode sync
if (localStorage.getItem('darkMode') === 'enabled') document.body.classList.add('dark');
document.getElementById('darkModeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
};