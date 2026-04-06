const gridEl = document.getElementById('grid');
const movesSpan = document.getElementById('moves');
const matchesSpan = document.getElementById('matches');
const restartBtn = document.getElementById('restart');

const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
let cards = [];
let flipped = [];
let matchedIndices = new Set();
let locked = false;
let moves = 0;
let matches = 0;

function initGame() {
  // Duplicate and shuffle
  let deck = [...icons, ...icons];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  cards = deck;
  flipped = [];
  matchedIndices = new Set();
  locked = false;
  moves = 0;
  matches = 0;
  movesSpan.textContent = '0';
  matchesSpan.textContent = '0';
  renderGrid();
}

function renderGrid() {
  gridEl.innerHTML = '';
  cards.forEach((icon, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    if (flipped.includes(idx) || matchedIndices.has(idx)) {
      card.classList.add('flipped');
      card.textContent = icon;
    } else {
      card.textContent = '?';
    }
    card.addEventListener('click', () => onCardClick(idx));
    gridEl.appendChild(card);
  });
}

function onCardClick(index) {
  if (locked) return;
  if (flipped.includes(index)) return;
  if (matchedIndices.has(index)) return;
  if (flipped.length === 2) return;

  flipped.push(index);
  renderGrid();

  if (flipped.length === 2) {
    moves++;
    movesSpan.textContent = moves;
    const [i1, i2] = flipped;
    if (cards[i1] === cards[i2]) {
      matches++;
      matchesSpan.textContent = matches;
      matchedIndices.add(i1);
      matchedIndices.add(i2);
      flipped = [];
      if (matches === icons.length) {
        setTimeout(() => {
          alert(`You won in ${moves} moves!`);
          submitScoreIfLogged('memory', Math.max(0, 50 - moves)); // score = 50 - moves
        }, 100);
      }
    } else {
      locked = true;
      setTimeout(() => {
        flipped = [];
        renderGrid();
        locked = false;
      }, 1000);
    }
  }
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