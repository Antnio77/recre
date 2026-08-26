// Mini-jeu bonus "Mémoire" : jeu de paires classique. Contrairement aux
// jeux "éducatifs" du site, aucun score n'est envoyé à Supabase. Accès géré
// par la fenêtre de récompense de 15 min (script-reward-window.js), comme
// les autres mini-jeux.

const DIFFICULTY_CONFIG = {
  facile: { pairs: 6, cols: 3 },
  moyen: { pairs: 8, cols: 4 },
  difficile: { pairs: 10, cols: 4 },
};
const EMOJI_POOL = ["🍎", "🍌", "🍇", "🍓", "🍉", "🍒", "🥝", "🍑", "🍍", "🥥"];

let difficulty = null;
let cards = [];
let flippedIndices = [];
let moves = 0;
let matchedPairs = 0;
let totalPairs = 0;
let lockBoard = false;

const loginPrompt = document.getElementById("login-prompt");
const windowLocked = document.getElementById("window-locked");
const rewardCountdown = document.getElementById("reward-countdown");
const difficultyScreen = document.getElementById("difficulty-screen");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScoreEl = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const grid = document.getElementById("memory-grid");
const movesEl = document.getElementById("memory-moves");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateMovesLabel() {
  movesEl.textContent = String(moves);
}

function renderGrid(cols) {
  grid.style.setProperty("--memory-cols", cols);
  grid.innerHTML = cards.map((c, i) => `
    <button type="button" class="memory-card" data-index="${i}">
      <div class="memory-card-inner">
        <span class="memory-card-face memory-card-face--back">❓</span>
        <span class="memory-card-face memory-card-face--front">${c.emoji}</span>
      </div>
    </button>
  `).join("");
  grid.querySelectorAll(".memory-card").forEach((btn) => btn.addEventListener("click", onCardClick));
}

function initGame(cfg) {
  totalPairs = cfg.pairs;
  matchedPairs = 0;
  moves = 0;
  flippedIndices = [];
  lockBoard = false;
  const emojis = EMOJI_POOL.slice(0, cfg.pairs);
  cards = shuffle([...emojis, ...emojis]).map((emoji) => ({ emoji, matched: false }));
  renderGrid(cfg.cols);
  updateMovesLabel();
}

function onCardClick(e) {
  const btn = e.currentTarget;
  const i = parseInt(btn.dataset.index, 10);
  if (lockBoard || cards[i].matched || flippedIndices.includes(i)) return;

  if (window.playSound) playSound("click");
  btn.classList.add("flipped");
  flippedIndices.push(i);

  if (flippedIndices.length < 2) return;

  moves++;
  updateMovesLabel();
  const [a, b] = flippedIndices;
  const btns = grid.querySelectorAll(".memory-card");

  if (cards[a].emoji === cards[b].emoji) {
    cards[a].matched = true;
    cards[b].matched = true;
    matchedPairs++;
    flippedIndices = [];
    btns[a].classList.add("matched");
    btns[b].classList.add("matched");
    if (window.playSound) playSound("correct");
    if (matchedPairs === totalPairs) {
      setTimeout(showWin, 500);
    }
  } else {
    lockBoard = true;
    if (window.playSound) playSound("wrong");
    setTimeout(() => {
      btns[a].classList.remove("flipped");
      btns[b].classList.remove("flipped");
      flippedIndices = [];
      lockBoard = false;
    }, 800);
  }
}

function showWin() {
  if (window.playSound) playSound("success");
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  finalScoreEl.textContent = String(moves);
}

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
  difficultyScreen.style.display = "none";
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  initGame(DIFFICULTY_CONFIG[level]);
}

function backToDifficulty() {
  gameCard.style.display = "none";
  resultScreen.style.display = "none";
  difficultyScreen.style.display = "block";
}

document.querySelectorAll("#difficulty-screen .difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});
replayBtn.addEventListener("click", () => {
  if (window.playSound) playSound("click");
  chooseDifficulty(difficulty);
});
changeLevelBtn.addEventListener("click", () => {
  if (window.playSound) playSound("click");
  backToDifficulty();
});

initMiniGameAccess({
  loginPrompt,
  windowLocked,
  countdownEl: rewardCountdown,
  onUnlock: () => { difficultyScreen.style.display = "block"; },
  onExpire: () => {
    if (gameCard.style.display !== "block") {
      difficultyScreen.style.display = "none";
      resultScreen.style.display = "none";
      windowLocked.style.display = "block";
    }
  },
});
