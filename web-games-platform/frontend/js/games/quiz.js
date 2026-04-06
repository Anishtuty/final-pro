const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreSpan = document.getElementById('score');
const totalSpan = document.getElementById('total');
const restartBtn = document.getElementById('restart');

const questions = [
  { text: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], correct: 2 },
  { text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
  { text: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "Mark Twain", "Jane Austen", "William Shakespeare"], correct: 3 },
  { text: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { text: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 }
];

let currentIndex = 0;
let score = 0;

function loadQuestion() {
  if (currentIndex >= questions.length) {
    questionEl.textContent = "Quiz completed!";
    optionsEl.innerHTML = `<p>Your final score: ${score}/${questions.length}</p>`;
    submitScoreIfLogged('quiz', score);
    return;
  }
  const q = questions[currentIndex];
  questionEl.textContent = q.text;
  optionsEl.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('div');
    btn.classList.add('option');
    btn.textContent = opt;
    btn.addEventListener('click', () => checkAnswer(idx));
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const q = questions[currentIndex];
  if (selected === q.correct) {
    score++;
    scoreSpan.textContent = score;
  }
  currentIndex++;
  loadQuestion();
}

function restart() {
  currentIndex = 0;
  score = 0;
  scoreSpan.textContent = '0';
  loadQuestion();
}

totalSpan.textContent = questions.length;
restartBtn.addEventListener('click', restart);
loadQuestion();

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