const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');

const rows = 6;
const cols = 7;
let grid = Array(rows).fill().map(() => Array(cols).fill(null));
let currentPlayer = 'red'; // red starts, AI is yellow
let gameActive = true;

function createBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (grid[r][c]) cell.classList.add(grid[r][c]);
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleClick(c));
            boardEl.appendChild(cell);
        }
    }
}

function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < rows * cols; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        cells[i].className = 'cell';
        if (grid[r][c]) cells[i].classList.add(grid[r][c]);
    }
}

function dropDisc(col, player) {
    for (let r = rows - 1; r >= 0; r--) {
        if (grid[r][col] === null) {
            grid[r][col] = player;
            return true;
        }
    }
    return false; // column full
}

function checkWin(player) {
    // horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (grid[r][c] === player && grid[r][c + 1] === player && grid[r][c + 2] === player && grid[r][c + 3] === player)
                return true;
        }
    }
    // vertical
    for (let r = 0; r <= rows - 4; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === player && grid[r + 1][c] === player && grid[r + 2][c] === player && grid[r + 3][c] === player)
                return true;
        }
    }
    // diagonal (down-right)
    for (let r = 0; r <= rows - 4; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (grid[r][c] === player && grid[r + 1][c + 1] === player && grid[r + 2][c + 2] === player && grid[r + 3][c + 3] === player)
                return true;
        }
    }
    // diagonal (down-left)
    for (let r = 0; r <= rows - 4; r++) {
        for (let c = 3; c < cols; c++) {
            if (grid[r][c] === player && grid[r + 1][c - 1] === player && grid[r + 2][c - 2] === player && grid[r + 3][c - 3] === player)
                return true;
        }
    }
    return false;
}

function isDraw() {
    for (let c = 0; c < cols; c++) {
        if (grid[0][c] === null) return false;
    }
    return true;
}

function handleClick(col) {
    if (!gameActive || currentPlayer !== 'red') return;
    if (!dropDisc(col, 'red')) return;
    updateBoardUI();
    if (checkWin('red')) {
        statusEl.textContent = '🎉 You win! 🎉';
        gameActive = false;
        submitScoreIfLogged('connect4', 3);
        return;
    }
    if (isDraw()) {
        statusEl.textContent = "It's a draw!";
        gameActive = false;
        submitScoreIfLogged('connect4', 1);
        return;
    }
    currentPlayer = 'yellow';
    statusEl.textContent = 'AI thinking...';
    setTimeout(aiMove, 300);
}

function aiMove() {
    if (!gameActive || currentPlayer !== 'yellow') return;
    // Simple AI: find first empty column (from left)
    let emptyCol = -1;
    for (let c = 0; c < cols; c++) {
        if (grid[0][c] === null) {
            emptyCol = c;
            break;
        }
    }
    if (emptyCol === -1) return;
    dropDisc(emptyCol, 'yellow');
    updateBoardUI();
    if (checkWin('yellow')) {
        statusEl.textContent = 'AI wins! 😵';
        gameActive = false;
        submitScoreIfLogged('connect4', 0);
        return;
    }
    if (isDraw()) {
        statusEl.textContent = "It's a draw!";
        gameActive = false;
        submitScoreIfLogged('connect4', 1);
        return;
    }
    currentPlayer = 'red';
    statusEl.textContent = 'Your turn (🔴)';
}

function restartGame() {
    grid = Array(rows).fill().map(() => Array(cols).fill(null));
    currentPlayer = 'red';
    gameActive = true;
    statusEl.textContent = 'Your turn (🔴)';
    updateBoardUI();
}

restartBtn.addEventListener('click', restartGame);
createBoard();

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