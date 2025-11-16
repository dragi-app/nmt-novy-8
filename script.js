// Mini-game 8 "Є чи не є?" game logic

// Create stars for the starry background
function createStars(num) {
  const container = document.getElementById('star-container');
  for (let i = 0; i < num; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    // Random positions and animation delays
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 4) + 's';
    container.appendChild(star);
  }
}

// Data for words: initial, correct form, explanation
const wordsData = [
  {
    initial: 'проект',
    correct: 'проєкт',
    explanation:
      'У новому правописі звук [je] у словах іншомовного походження передаємо буквою «є», тому пишемо «проєкт»【501493046740655†L96-L105】.'
  },
  {
    initial: 'проєкт',
    correct: 'проєкт',
    explanation:
      'Слово вже написане за новим правописом: «проєкт»【501493046740655†L96-L105】.'
  },
  {
    initial: 'проекція',
    correct: 'проєкція',
    explanation:
      'У слові «проєкція» звук [je] передається буквою «є», тому правильний варіант — «проєкція»【501493046740655†L96-L105】.'
  },
  {
    initial: 'проєкція',
    correct: 'проєкція',
    explanation:
      'Слово «проєкція» вже написано правильно, змін не потрібно【501493046740655†L96-L105】.'
  },
  {
    initial: 'об’ект',
    correct: 'об’єкт',
    explanation:
      'Звук [je] у словах іншомовного походження позначаємо літерою «є», тому правильне написання — «об’єкт»【501493046740655†L96-L105】.'
  },
  {
    initial: 'ін’єкція',
    correct: 'ін’єкція',
    explanation:
      'Слово «ін’‎єкція» вже написано відповідно до нового правопису【501493046740655†L96-L105】.'
  }
];

// Game state
let currentIndex = 0;
let totalWords = wordsData.length;
let mistakesLeft = 2;
let timer = 30;
let intervalId = null;
let summary = [];

// DOM elements
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const triesContainer = document.getElementById('tries-container');
const timerSpan = document.getElementById('timer');
const currentIndexSpan = document.getElementById('current-index');
const totalWordsSpan = document.getElementById('total-words');
const wordArea = document.getElementById('word-area');
const choiceButtons = document.getElementById('choice-buttons');
const correctBtn = document.getElementById('btn-correct');
const fixBtn = document.getElementById('btn-fix');
const explanationPara = document.getElementById('explanation');
const finishScreen = document.getElementById('finish-screen');
const summaryList = document.getElementById('summary-list');
const generalProgressFill = document.querySelector('.general-progress-fill');
const generalProgressText = document.querySelector('.general-progress-text');

// Initialize the game when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  createStars(60);
  totalWordsSpan.textContent = totalWords;
  // Prepare tries hearts
  renderTries();
});

// Start game handler
startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  startGame();
});

function startGame() {
  // Reset state
  currentIndex = 0;
  mistakesLeft = 2;
  timer = 30;
  summary = [];
  // Reset UI
  renderTries();
  timerSpan.textContent = timer;
  currentIndexSpan.textContent = currentIndex + 1;
  explanationPara.classList.add('hidden');
  choiceButtons.classList.remove('hidden');
  wordArea.classList.remove('correct', 'incorrect');
  // Start timer
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer--;
    if (timer < 0) {
      timer = 0;
    }
    timerSpan.textContent = timer;
    if (timer === 0) {
      finishGame();
    }
  }, 1000);
  showWord();
}

// Display current word
function showWord() {
  if (currentIndex >= totalWords) {
    finishGame();
    return;
  }
  const data = wordsData[currentIndex];
  // Clear previous classes and explanation
  wordArea.textContent = data.initial;
  wordArea.classList.remove('correct', 'incorrect');
  explanationPara.classList.add('hidden');
  choiceButtons.classList.remove('hidden');
  correctBtn.disabled = false;
  fixBtn.disabled = false;
  // Update progress
  currentIndexSpan.textContent = currentIndex + 1;
}

// Render hearts for remaining tries
function renderTries() {
  triesContainer.innerHTML = '';
  for (let i = 0; i < 2; i++) {
    const heart = document.createElement('span');
    heart.classList.add('heart');
    heart.textContent = '❤';
    if (i >= mistakesLeft) {
      heart.classList.add('lost');
    }
    triesContainer.appendChild(heart);
  }
}

// Handle choice: correct or fix
correctBtn.addEventListener('click', () => handleChoice(true));
fixBtn.addEventListener('click', () => handleChoice(false));

function handleChoice(isCorrectChoice) {
  // Disable buttons to prevent multiple clicks
  correctBtn.disabled = true;
  fixBtn.disabled = true;
  choiceButtons.classList.add('hidden');
  const data = wordsData[currentIndex];
  const initial = data.initial;
  const correct = data.correct;
  let finalWord = initial;
  let isAnswerCorrect = false;

  if (isCorrectChoice) {
    // User claims the word is correct
    if (initial === correct) {
      isAnswerCorrect = true;
      finalWord = initial;
      wordArea.classList.add('correct');
    } else {
      isAnswerCorrect = false;
      finalWord = correct;
      wordArea.classList.add('incorrect');
    }
  } else {
    // User wants to fix
    if (initial !== correct) {
      isAnswerCorrect = true;
      finalWord = correct;
      wordArea.classList.add('correct');
      // Update displayed word
      wordArea.textContent = finalWord;
    } else {
      isAnswerCorrect = false;
      finalWord = correct;
      wordArea.classList.add('incorrect');
    }
  }
  // Update hearts if wrong
  if (!isAnswerCorrect) {
    mistakesLeft--;
    if (mistakesLeft < 0) mistakesLeft = 0;
    renderTries();
  }
  // Show explanation
  explanationPara.textContent = data.explanation;
  explanationPara.classList.remove('hidden');
  // Record summary
  summary.push({ initial: initial, final: finalWord });
  // Move to next word after delay or finish early if no hearts
  setTimeout(() => {
    currentIndex++;
    if (mistakesLeft <= 0 || timer === 0) {
      finishGame();
    } else {
      showWord();
      choiceButtons.classList.remove('hidden');
    }
  }, 2000);
}

function finishGame() {
  // Stop timer
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  // Hide game
  gameContainer.classList.add('hidden');
  finishScreen.classList.remove('hidden');
  // Fill summary list
  summaryList.innerHTML = '';
  summary.forEach(item => {
    const p = document.createElement('p');
    p.textContent = `${item.initial} → ${item.final}`;
    summaryList.appendChild(p);
  });
  // Set general progress (8/9)
  const percent = (8 / 9) * 100;
  generalProgressFill.style.width = percent + '%';
  generalProgressText.textContent = '8 / 9';
}