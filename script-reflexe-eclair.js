// Mini-jeu bonus "Réflexe éclair" : une cible apparaît à un endroit
// aléatoire après un délai imprévisible ; il faut la taper le plus vite
// possible, sans anticiper. Contrairement aux jeux "éducatifs" du site,
// aucun score n'est envoyé à Supabase. Accès géré par la fenêtre de
// récompense de 15 min (script-reward-window.js), comme les autres
// mini-jeux.

const DIFFICULTY_CONFIG = {
  facile: { visibleMs: 1300, minDelay: 1000, maxDelay: 2200 },
  moyen: { visibleMs: 950, minDelay: 800, maxDelay: 1800 },
  difficile: { visibleMs: 650, minDelay: 600, maxDelay: 1500 },
};
const SESSION_LENGTH = 8;
const TARGET_SIZE = 60;

let difficulty = null;
let current = 0;
let hits = 0;
let reactionTimes = [];
let roundState = "idle"; // "waiting" | "visible" | "feedback"
let appearTimestamp = 0;
let delayTimer = null;
let visibleTimer = null;
let feedbackTimer = null;

const loginPrompt = document.getElementById("login-prompt");
const windowLocked = document.getElementById("window-locked");
const rewardCountdown = document.getElementById("reward-countdown");
const difficultyScreen = document.getElementById("difficulty-screen");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScoreEl = document.getElementById("final-score");
const avgText = document.getElementById("reflex-avg-text");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const progressLabel = document.getElementById("progress-label");
const area = document.getElementById("reflex-area");
const target = document.getElementById("reflex-target");
const message = document.getElementById("reflex-message");

function clearTimers() {
  clearTimeout(delayTimer);
  clearTimeout(visibleTimer);
  clearTimeout(feedbackTimer);
}

function updateProgressLabel() {
  progressLabel.textContent = `${current + 1} / ${SESSION_LENGTH} · ${t("scoreWord")} : ${hits}`;
}

function startRound() {
  roundState = "waiting";
  message.textContent = t("reflexeGetReady");
  target.style.display = "none";
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const delay = cfg.minDelay + Math.random() * (cfg.maxDelay - cfg.minDelay);
  delayTimer = setTimeout(showTarget, delay);
}

function showTarget() {
  roundState = "visible";
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const rect = area.getBoundingClientRect();
  const maxLeftPct = 100 - (TARGET_SIZE / rect.width) * 100;
  const maxTopPct = 100 - (TARGET_SIZE / rect.height) * 100;
  target.style.left = `${Math.random() * Math.max(0, maxLeftPct)}%`;
  target.style.top = `${Math.random() * Math.max(0, maxTopPct)}%`;
  target.style.display = "block";
  message.textContent = "";
  appearTimestamp = performance.now();
  visibleTimer = setTimeout(() => resolveRound(null), cfg.visibleMs);
}

function resolveRound(reactionMs) {
  clearTimers();
  target.style.display = "none";
  roundState = "feedback";

  if (reactionMs !== null) {
    hits++;
    reactionTimes.push(reactionMs);
    if (window.playSound) playSound("correct");
    message.textContent = `⚡ ${Math.round(reactionMs)} ms !`;
  } else {
    if (window.playSound) playSound("wrong");
    message.textContent = "💤";
  }
  updateProgressLabel();
  feedbackTimer = setTimeout(nextRound, 900);
}

area.addEventListener("click", (e) => {
  if (roundState === "waiting") {
    clearTimers();
    roundState = "feedback";
    if (window.playSound) playSound("wrong");
    message.textContent = t("reflexeTooSoon");
    updateProgressLabel();
    feedbackTimer = setTimeout(nextRound, 900);
    return;
  }
  if (roundState === "visible") {
    const hitTarget = e.target === target;
    resolveRound(hitTarget ? performance.now() - appearTimestamp : null);
  }
});

function nextRound() {
  current++;
  if (current >= SESSION_LENGTH) {
    showResults();
    return;
  }
  startRound();
}

function showResults() {
  clearTimers();
  roundState = "idle";
  if (window.playSound) playSound("success");
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  finalScoreEl.textContent = `${hits} / ${SESSION_LENGTH}`;
  if (reactionTimes.length > 0) {
    const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
    avgText.textContent = `${t("reflexeAvgLabel")} : ${avg} ms`;
  } else {
    avgText.textContent = "";
  }
}

function startGame() {
  current = 0;
  hits = 0;
  reactionTimes = [];
  gameCard.style.display = "block";
  resultScreen.style.display = "none";
  updateProgressLabel();
  startRound();
}

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
  difficultyScreen.style.display = "none";
  resultScreen.style.display = "none";
  startGame();
}

function backToDifficulty() {
  clearTimers();
  roundState = "idle";
  gameCard.style.display = "none";
  resultScreen.style.display = "none";
  difficultyScreen.style.display = "block";
}

document.querySelectorAll("#difficulty-screen .difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});
replayBtn.addEventListener("click", () => {
  if (window.playSound) playSound("click");
  startGame();
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
