// Game list – same as before
const games = [
  { id: 'tic-tac-toe', title: 'Tic Tac Toe', icon: '❌⭕', desc: 'vs AI, classic', url: 'games/tic-tac-toe.html' },
  { id: 'snake', title: 'Snake', icon: '🐍', desc: 'eat & grow', url: 'games/snake.html' },
  { id: 'memory', title: 'Memory Match', icon: '🧠', desc: 'flip & match pairs', url: 'games/memory.html' },
  { id: 'quiz', title: 'Quiz Mania', icon: '❓', desc: 'general knowledge', url: 'games/quiz.html' },
  { id: 'flappy', title: 'Flappy Bird', icon: '🐦', desc: 'tap to fly', url: 'games/flappy.html' },
  { id: 'rps', title: 'Rock Paper Scissors', icon: '✊📄✂️', desc: 'best of three', url: 'games/rock-paper-scissor.html' },
  { id: 'whack', title: 'Whack‑a‑Mole', icon: '🔨🐭', desc: 'mole frenzy', url: 'games/whackamole.html' },
  { id: 'hangman', title: 'Hangman', icon: '🔤', desc: 'guess the word', url: 'games/hangman.html' },
  { id: 'connect4', title: 'Connect Four', icon: '🔴🟡', desc: '4 in a row', url: 'games/connect4.html' }
];

function renderGames() {
  const grid = document.getElementById('gamesGrid');
  grid.innerHTML = games.map(game => `
    <div class="game-card" data-game-id="${game.id}">
      <div class="thumbnail">${game.icon}</div>
      <div class="card-content">
        <div class="game-title">${game.title}</div>
        <p>${game.desc}</p>
        <button class="btn-neon play-btn" data-url="${game.url}">Launch <i class="fas fa-play"></i></button>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = btn.getAttribute('data-url');
      window.location.href = url;
    });
  });
}

function updateUserUI() {
  const greetingSpan = document.getElementById('userGreeting');
  const loginBtn = document.getElementById('loginBtn');
  if (currentUser) {
    greetingSpan.innerHTML = `<i class="fas fa-user-astronaut"></i> ${currentUser.username} <span style="color:#0ff;">🎯 ${currentUser.gamesPlayed || 0}</span>`;
    loginBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Exit`;
    loginBtn.onclick = () => {
      logout();
      updateUserUI();
      renderGames();
      loadLeaderboard(document.getElementById('gameLeaderSelect').value);
    };
  } else {
    greetingSpan.innerHTML = `Guest <i class="fas fa-user-secret"></i>`;
    loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Enter`;
    loginBtn.onclick = () => openModal();
  }
}

// Modal logic (same as before)
const modal = document.getElementById('loginModal');
function openModal() { modal.style.display = 'flex'; }
function closeModal() { modal.style.display = 'none'; }
document.getElementById('confirmLoginBtn').onclick = async () => {
  const username = document.getElementById('usernameInput').value.trim();
  if (!username) return alert('Enter a callsign');
  try {
    await login(username);
    updateUserUI();
    closeModal();
    renderGames();
    loadLeaderboard(document.getElementById('gameLeaderSelect').value);
  } catch (err) {
    alert('Login failed: ' + err.message);
  }
};
document.getElementById('closeModalBtn').onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };

// Leaderboard loading
async function loadLeaderboard(gameId) {
  try {
    const scores = await fetchLeaderboard(gameId);
    const list = document.getElementById('leaderboardList');
    if (scores.length) {
      list.innerHTML = scores.map(entry => `<li><span>🏆 ${entry.username}</span><span>${entry.score} pts</span></li>`).join('');
    } else {
      list.innerHTML = '<li>✨ No scores yet. Be the first! ✨</li>';
    }
  } catch (err) {
    console.error(err);
  }
}

// Dark mode toggle (preserve local storage)
const darkToggle = document.getElementById('darkModeToggle');
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark');
}
darkToggle.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
};

// Populate leaderboard select
const selectEl = document.getElementById('gameLeaderSelect');
selectEl.innerHTML = games.map(g => `<option value="${g.id}">${g.title}</option>`).join('');
selectEl.onchange = () => loadLeaderboard(selectEl.value);

// Initialization
renderGames();
updateUserUI();
loadLeaderboard('tic-tac-toe');