const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const restartBtn = document.getElementById('restart');

let gameRunning = false;
let score = 0;
let bird = { x: 80, y: 300, radius: 12, velocity: 0, gravity: 0.12, jump: -3.5 };
let pipes = [];
let frame = 0;
let pipeSpeed = 1;

function initGame() {
    bird.y = 300;
    bird.velocity = 0;
    score = 0;
    scoreSpan.textContent = score;
    pipes = [];
    frame = 0;
    pipeSpeed = 1;
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + 4, bird.y - 4, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, 0, 60, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 60, canvas.height - pipe.bottom);
    });
}

function update() {
    if (!gameRunning) return;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
        gameRunning = false;
        submitScoreIfLogged('flappy', score);
        return;
    }

    // Spawn pipes less frequently at start, more frequently as speed increases
    const spawnInterval = Math.max(80, Math.floor(140 / pipeSpeed));
    if (frame % spawnInterval === 0) {
        const gap = 150;
        const top = Math.random() * (canvas.height - gap - 50) + 30;
        pipes.push({ x: canvas.width, top: top, bottom: top + gap });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
        if (pipes[i].x + 60 < 0) {
            pipes.splice(i, 1);
            score++;
            scoreSpan.textContent = score;
            // Increase speed every 5 points
            pipeSpeed = 1 + Math.floor(score / 5) * 0.25;
            i--;
            continue;
        }

        if (bird.x + bird.radius > pipes[i].x && bird.x - bird.radius < pipes[i].x + 60) {
            if (bird.y - bird.radius < pipes[i].top || bird.y + bird.radius > pipes[i].bottom) {
                gameRunning = false;
                submitScoreIfLogged('flappy', score);
                return;
            }
        }
    }

    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        draw(); // final frame
    }
}

function handleJump() {
    if (!gameRunning) return;
    bird.velocity = bird.jump;
}

canvas.addEventListener('click', handleJump);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleJump();
});

restartBtn.addEventListener('click', () => {
    initGame();
});

async function submitScoreIfLogged(gameId, score) {
    if (authToken) {
        await submitScore(gameId, score);
    }
}

initGame();

// Dark mode sync
if (localStorage.getItem('darkMode') === 'enabled') document.body.classList.add('dark');
document.getElementById('darkModeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
};