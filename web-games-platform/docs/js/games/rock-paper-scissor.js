const playerScoreSpan = document.getElementById('playerScore');
const computerScoreSpan = document.getElementById('computerScore');
const resultDiv = document.getElementById('result');
const restartBtn = document.getElementById('restart');

let playerScore = 0;
let computerScore = 0;
let gameActive = true;

const choices = ['rock', 'paper', 'scissors'];

function getComputerChoice() {
  const random = Math.floor(Math.random() * 3);
  return choices[random];
}

function determineWinner(player, computer) {
  if (player === computer) return 'draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'scissors' && computer === 'paper') ||
    (player === 'paper' && computer === 'rock')
  ) {
    return 'player';
  }
  return 'computer';
}

function updateUI(playerChoice, computerChoice, winner) {
  let message = `You chose ${playerChoice}, computer chose ${computerChoice}. `;
  if (winner === 'player') {
    message += 'You win!';
    playerScore++;
    playerScoreSpan.textContent = playerScore;
  } else if (winner === 'computer') {
    message += 'Computer wins!';
    computerScore++;
    computerScoreSpan.textContent = computerScore;
  } else {
    message += "It's a draw!";
  }
  resultDiv.textContent = message;

  // Check for best of three
  if (playerScore === 3 || computerScore === 3) {
    const finalWinner = playerScore === 3 ? 'You' : 'Computer';
    resultDiv.textContent += ` 🎉 Game over! ${finalWinner} wins the match!`;
    gameActive = false;
    // Submit score: 3 for player win, 0 for loss, 1 for draw? Actually we submit player's score = wins
    if (playerScore === 3) {
      submitScoreIfLogged('rps', 3);
    } else {
      submitScoreIfLogged('rps', 0);
    }
  }
}

function handleChoice(choice) {
  if (!gameActive) return;
  const computer = getComputerChoice();
  const winner = determineWinner(choice, computer);
  updateUI(choice, computer, winner);
}

document.querySelectorAll('.choice').forEach(el => {
  el.addEventListener('click', () => {
    const choice = el.getAttribute('data-choice');
    handleChoice(choice);
  });
});

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  playerScoreSpan.textContent = '0';
  computerScoreSpan.textContent = '0';
  resultDiv.textContent = '';
  gameActive = true;
}

restartBtn.addEventListener('click', resetGame);

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