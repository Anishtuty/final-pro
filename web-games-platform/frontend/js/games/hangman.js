const wordDisplay = document.getElementById('wordDisplay');
const lettersDiv = document.getElementById('letters');
const messageDiv = document.getElementById('message');
const hangmanDiv = document.getElementById('hangmanDrawing');
const restartBtn = document.getElementById('restart');

const words = [
    // Programming
    'JAVASCRIPT', 'PYTHON', 'DEVELOPER', 'ALGORITHM', 'VARIABLE',
    'FUNCTION', 'KEYBOARD', 'DATABASE', 'FRAMEWORK', 'COMPILER',
    'DEBUGGING', 'INTERFACE', 'RECURSION', 'BOOLEAN', 'PARAMETER',
    // Science
    'PHOTOSYNTHESIS', 'MOLECULE', 'HYDROGEN', 'ELECTRICITY', 'GRAVITY',
    'TELESCOPE', 'EVOLUTION', 'CHROMOSOME', 'NEUTRON', 'ATMOSPHERE',
    // Animals
    'ELEPHANT', 'CROCODILE', 'BUTTERFLY', 'PENGUIN', 'CHEETAH',
    'KANGAROO', 'DOLPHIN', 'GIRAFFE', 'OCTOPUS', 'FLAMINGO',
    // Sports
    'BASKETBALL', 'VOLLEYBALL', 'SWIMMING', 'BADMINTON', 'MARATHON',
    'GYMNASTIC', 'ARCHERY', 'CRICKET', 'FOOTBALL', 'WRESTLING',
    // Geography
    'AMAZON', 'HIMALAYA', 'ANTARCTICA', 'AUSTRALIA', 'VOLCANO',
    // General
    'CHALLENGE', 'ADVENTURE', 'TREASURE', 'MYSTERY', 'CARNIVAL'
];
let currentWord = '';
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let gameActive = true;

function chooseWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function updateWordDisplay() {
    let display = '';
    for (let letter of currentWord) {
        if (guessedLetters.includes(letter)) {
            display += letter + ' ';
        } else {
            display += '_ ';
        }
    }
    wordDisplay.textContent = display.trim();
}

function updateHangman() {
    const stages = [
        '  +---+\n      |\n      |\n      |\n      |\n      |\n=========',
        '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
        '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
        '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
        '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
        '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
        '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
        '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========='
    ];
    hangmanDiv.textContent = stages[Math.min(mistakes, stages.length - 1)];
}

function checkWin() {
    let allGuessed = true;
    for (let letter of currentWord) {
        if (!guessedLetters.includes(letter)) {
            allGuessed = false;
            break;
        }
    }
    if (allGuessed && gameActive) {
        messageDiv.textContent = '🎉 You win! 🎉';
        gameActive = false;
        submitScoreIfLogged('hangman', 1);
    }
}

function checkLose() {
    if (mistakes >= maxMistakes && gameActive) {
        messageDiv.textContent = `💀 You lose! The word was ${currentWord}.`;
        gameActive = false;
        submitScoreIfLogged('hangman', 0);
    }
}

function makeGuess(letter) {
    if (!gameActive) return;
    if (guessedLetters.includes(letter)) return;
    guessedLetters.push(letter);
    if (currentWord.includes(letter)) {
        updateWordDisplay();
        checkWin();
    } else {
        mistakes++;
        updateHangman();
        checkLose();
    }
    updateLettersUI();
}

function updateLettersUI() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    lettersDiv.innerHTML = '';
    for (let char of alphabet) {
        const btn = document.createElement('div');
        btn.classList.add('letter');
        btn.textContent = char;
        if (guessedLetters.includes(char)) {
            btn.classList.add('used');
        }
        btn.addEventListener('click', () => makeGuess(char));
        lettersDiv.appendChild(btn);
    }
}

function initGame() {
    currentWord = chooseWord();
    guessedLetters = [];
    mistakes = 0;
    gameActive = true;
    messageDiv.textContent = '';
    updateWordDisplay();
    updateHangman();
    updateLettersUI();
}

restartBtn.addEventListener('click', initGame);
initGame();

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