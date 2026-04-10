const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let board = Array(9).fill(null);
let currentPlayer = 'X'; // X always player, O is AI
let gameActive = true;

function createBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = board[i];
    cell.addEventListener('click', () => handleMove(i));
    boardEl.appendChild(cell);
  }
}

function handleMove(index) {
  if (!gameActive || board[index] !== null || currentPlayer !== 'X') return;
  makeMove(index, 'X');
  if (checkWinner('X')) {
    statusEl.textContent = 'You win! 🎉';
    gameActive = false;
    submitScoreIfLogged('tic-tac-toe', 3);
    return;
  }
  if (isDraw()) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    submitScoreIfLogged('tic-tac-toe', 1);
    return;
  }
  currentPlayer = 'O';
  statusEl.textContent = 'AI thinking...';
  setTimeout(aiMove, 300);
}

function aiMove() {
  if (!gameActive || currentPlayer !== 'O') return;
  // Simple AI: take any empty cell (random)
  const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(v => v !== null);
  if (emptyIndices.length === 0) return;
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, 'O');
  if (checkWinner('O')) {
    statusEl.textContent = 'AI wins! 😵';
    gameActive = false;
    submitScoreIfLogged('tic-tac-toe', 0);
    return;
  }
  if (isDraw()) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    submitScoreIfLogged('tic-tac-toe', 1);
    return;
  }
  currentPlayer = 'X';
  statusEl.textContent = 'Your turn (X)';
}

function makeMove(index, player) {
  board[index] = player;
  updateBoardUI();
}

function updateBoardUI() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
  });
}

function checkWinner(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern => pattern.every(idx => board[idx] === player));
}

function isDraw() {
  return board.every(cell => cell !== null);
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  statusEl.textContent = 'Your turn (X)';
  updateBoardUI();
}

async function submitScoreIfLogged(gameId, score) {
  if (authToken) {
    await submitScore(gameId, score);
  }
}

restartBtn.addEventListener('click', restartGame);
createBoard();

// Dark mode sync
if (localStorage.getItem('darkMode') === 'enabled') document.body.classList.add('dark');
document.getElementById('darkModeToggle').onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
};