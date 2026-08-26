// Mini-jeu bonus "Serpent" : le classique jeu du serpent sur une grille,
// en <canvas>. Contrairement aux jeux "éducatifs" du site, aucun score
// n'est envoyé à Supabase — seul le meilleur score est gardé en local
// (localStorage) pour un peu de rejouabilité. Accès géré par la fenêtre de
// récompense de 15 min (script-reward-window.js), comme les autres
// mini-jeux.

const DIFFICULTY_CONFIG = {
  facile: { grid: 14, interval: 180 },
  moyen: { grid: 17, interval: 130 },
  difficile: { grid: 20, interval: 90 },
};
const CELL_PX = 20;
const LS_BEST = "recre-snake-best";

let difficulty = null;
let gridSize = 14;
let snake = [];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let running = false;
let tickTimer = null;

const loginPrompt = document.getElementById("login-prompt");
const windowLocked = document.getElementById("window-locked");
const rewardCountdown = document.getElementById("reward-countdown");
const difficultyScreen = document.getElementById("difficulty-screen");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScoreEl = document.getElementById("final-score");
const finalBestText = document.getElementById("final-best-text");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("snake-overlay");
const overlayText = document.getElementById("snake-overlay-text");
const scoreEl = document.getElementById("snake-score");
const bestEl = document.getElementById("snake-best");

const DIR_VECTORS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

function roundRect(context, x, y, w, h, r) {
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function spawnFood() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function updateScoreboard() {
  scoreEl.textContent = String(score);
  bestEl.textContent = localStorage.getItem(LS_BEST) || "0";
}

function draw() {
  ctx.fillStyle = "#FBFAF7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#EF6461";
  ctx.beginPath();
  ctx.arc(food.x * CELL_PX + CELL_PX / 2, food.y * CELL_PX + CELL_PX / 2, CELL_PX * 0.35, 0, Math.PI * 2);
  ctx.fill();

  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? "#2C8C87" : "#3AAFA9";
    roundRect(ctx, seg.x * CELL_PX + 2, seg.y * CELL_PX + 2, CELL_PX - 4, CELL_PX - 4, 4);
    ctx.fill();
  });
}

function initGame(cfg) {
  gridSize = cfg.grid;
  canvas.width = gridSize * CELL_PX;
  canvas.height = gridSize * CELL_PX;
  const mid = Math.floor(gridSize / 2);
  snake = [{ x: mid, y: mid }];
  direction = { x: 0, y: 0 };
  nextDirection = { x: 0, y: 0 };
  score = 0;
  running = false;
  clearInterval(tickTimer);
  spawnFood();
  draw();
  updateScoreboard();
  overlayText.textContent = t("serpentPausedHint");
  overlay.style.display = "flex";
}

function startRun() {
  if (running) return;
  running = true;
  overlay.style.display = "none";
  clearInterval(tickTimer);
  tickTimer = setInterval(tick, DIFFICULTY_CONFIG[difficulty].interval);
}

function tick() {
  direction = nextDirection;
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };

  if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
    gameOver();
    return;
  }

  const eating = newHead.x === food.x && newHead.y === food.y;
  const bodyToCheck = eating ? snake : snake.slice(0, -1);
  if (bodyToCheck.some((s) => s.x === newHead.x && s.y === newHead.y)) {
    gameOver();
    return;
  }

  snake.unshift(newHead);
  if (eating) {
    score++;
    if (window.playSound) playSound("correct");
    spawnFood();
    updateScoreboard();
  } else {
    snake.pop();
  }
  draw();
}

function gameOver() {
  clearInterval(tickTimer);
  running = false;
  if (window.playSound) playSound("wrong");
  const best = Math.max(score, parseInt(localStorage.getItem(LS_BEST) || "0", 10));
  localStorage.setItem(LS_BEST, String(best));

  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  finalScoreEl.textContent = String(score);
  finalBestText.textContent = `${t("serpentBestLabel")} : ${best}`;
}

function setDirection(name) {
  const v = DIR_VECTORS[name];
  if (!v) return;
  const cur = running ? direction : nextDirection;
  const isOpposite = cur.x === -v.x && cur.y === -v.y && (cur.x !== 0 || cur.y !== 0);
  if (isOpposite) return;
  nextDirection = v;
  if (!running) startRun();
}

document.addEventListener("keydown", (e) => {
  if (gameCard.style.display !== "block") return;
  const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
  if (map[e.key]) {
    e.preventDefault();
    setDirection(map[e.key]);
  }
});

document.querySelectorAll(".snake-dpad-btn").forEach((btn) => {
  btn.addEventListener("click", () => setDirection(btn.dataset.dir));
});

let touchStart = null;
canvas.addEventListener("pointerdown", (e) => { touchStart = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener("pointerup", (e) => {
  if (!touchStart) return;
  const dx = e.clientX - touchStart.x;
  const dy = e.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? "right" : "left");
  else setDirection(dy > 0 ? "down" : "up");
});

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
  difficultyScreen.style.display = "none";
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  initGame(DIFFICULTY_CONFIG[level]);
}

function backToDifficulty() {
  clearInterval(tickTimer);
  running = false;
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
