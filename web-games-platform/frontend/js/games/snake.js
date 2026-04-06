const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const restartBtn = document.getElementById('restart');

const box = 20;
const canvasSize = 20; // 20x20 grid
let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let food = { x: 15, y: 15 };
let score = 0;
let gameLoop = null;
let gameActive = true;

function draw() {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#3b82f6' : '#60a5fa';
    ctx.fillRect(snake[i].x * box, snake[i].y * box, box - 2, box - 2);
  }

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(food.x * box, food.y * box, box - 2, box - 2);
}

function move() {
  let head = { ...snake[0] };
  switch (direction) {
    case 'RIGHT': head.x++; break;
    case 'LEFT': head.x--; break;
    case 'UP': head.y--; break;
    case 'DOWN': head.y++; break;
  }

  // Check collision with food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreSpan.textContent = score;
    snake.unshift(head);
    generateFood();
  } else {
    snake.unshift(head);
    snake.pop();
  }

  // Collision with walls or self
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || collision(head)) {
    gameActive = false;
    if (gameLoop) clearInterval(gameLoop);
    submitScoreIfLogged('snake', score);
    alert(`Game over! Your score: ${score}`);
    return;
  }
}

function collision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) return true;
  }
  return false;
}

function generateFood() {
  let newFood;
  do {
    newFood = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
}

function gameStep() {
  if (!gameActive) return;
  move();
  draw();
}

function startGame() {
  if (gameLoop) clearInterval(gameLoop);
  snake = [{ x: 10, y: 10 }];
  direction = 'RIGHT';
  score = 0;
  scoreSpan.textContent = '0';
  gameActive = true;
  generateFood();
  draw();
  gameLoop = setInterval(gameStep, 150);
}

document.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  const key = e.key;
  if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

restartBtn.addEventListener('click', startGame);
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