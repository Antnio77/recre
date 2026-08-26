// Mini-jeu bonus "Coupe en deux" : une forme aléatoire (un "blob" en
// polygone) qu'il faut couper d'un geste (glisser une ligne droite) en deux
// parts dont l'aire est aussi proche que possible. Contrairement aux jeux
// "éducatifs" du site, ce mini-jeu ne remonte aucun score dans Supabase :
// c'est une récompense purement ludique débloquée à un palier d'XP donné
// (voir script-xp.js), pas une nouvelle source de progression. L'accès est
// donc vérifié une fois au chargement (comme le premium ailleurs), puis
// tout se joue en local.
//
// Géométrie : la forme est un polygone simple généré en plaçant des points
// à des angles régulièrement espacés (+ un peu de bruit) autour d'un
// centre, à un rayon aléatoire — ça donne toujours un contour qui ne se
// croise pas lui-même. La coupe est une droite définie par le point de
// départ du glissé et sa direction ; on la découpe en deux polygones avec
// un clip de Sutherland-Hodgman (un classique pour "garder les sommets d'un
// côté d'une droite"), puis on calcule l'aire de chaque moitié avec la
// formule du lacet (shoelace).

const UNLOCK_PALIER = 3;

const DIFFICULTY_CONFIG = {
  facile: { points: 6, irregularity: 0.25, tolerance: 12, time: 15 },
  moyen: { points: 8, irregularity: 0.45, tolerance: 8, time: 12 },
  difficile: { points: 11, irregularity: 0.65, tolerance: 5, time: 9 },
};
const SESSION_LENGTH = 8;
const SIZE = 300;
const CENTER = SIZE / 2;
const BASE_RADIUS = 105;
const LINE_EXTEND = 400;
const MIN_DRAG_DIST = 8;

let difficulty = null;
let current = 0;
let score = 0;
let shapePoints = null;
let totalArea = 0;
let hasPreview = false;
let lastResult = null; // { pctA, pctB }
let validated = false;
let timerTimeout = null;
let dragging = false;
let dragStart = null;

const loginPrompt = document.getElementById("login-prompt");
const palierLocked = document.getElementById("palier-locked");
const palierLockedMessage = document.getElementById("palier-locked-message");
const difficultyScreen = document.getElementById("difficulty-screen");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const timerFill = document.getElementById("timer-fill");
const progressLabel = document.getElementById("progress-label");
const svg = document.getElementById("shape-svg");
const pieceA = document.getElementById("piece-a");
const pieceB = document.getElementById("piece-b");
const cutLine = document.getElementById("cut-line");
const areaAVal = document.getElementById("area-a-val");
const areaBVal = document.getElementById("area-b-val");
const feedbackEl = document.getElementById("feedback");
const cutBtn = document.getElementById("cut-btn");
const nextBtn = document.getElementById("next-btn");

// ---- Géométrie ----

function generateShape(cfg) {
  const n = cfg.points;
  const angleStep = (2 * Math.PI) / n;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const angle = i * angleStep + (Math.random() - 0.5) * angleStep * 0.5;
    const r = BASE_RADIUS * (1 - cfg.irregularity / 2 + Math.random() * cfg.irregularity);
    pts.push([CENTER + Math.cos(angle) * r, CENTER + Math.sin(angle) * r]);
  }
  return pts;
}

function polygonArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

// Sutherland-Hodgman : ne garde que les sommets d'un côté de la droite
// (origin, dir), en insérant un point d'intersection à chaque arête qui
// traverse la droite.
function clipPolygon(points, origin, dir, keepPositive) {
  const side = (p) => dir[0] * (p[1] - origin[1]) - dir[1] * (p[0] - origin[0]);
  const out = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const curr = points[i];
    const next = points[(i + 1) % n];
    const sCurr = side(curr);
    const sNext = side(next);
    const currIn = keepPositive ? sCurr >= 0 : sCurr <= 0;
    const nextIn = keepPositive ? sNext >= 0 : sNext <= 0;
    if (currIn) out.push(curr);
    if (currIn !== nextIn) {
      const t = sCurr / (sCurr - sNext);
      out.push([curr[0] + t * (next[0] - curr[0]), curr[1] + t * (next[1] - curr[1])]);
    }
  }
  return out;
}

function pointsAttr(points) {
  return points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

// ---- Rendu ----

function renderShapeOnly() {
  pieceA.setAttribute("points", pointsAttr(shapePoints));
  pieceB.setAttribute("points", "");
  cutLine.style.display = "none";
}

function renderCutPreview(origin, dir) {
  const a = clipPolygon(shapePoints, origin, dir, true);
  const b = clipPolygon(shapePoints, origin, dir, false);
  const areaA = polygonArea(a);
  const areaB = polygonArea(b);
  pieceA.setAttribute("points", pointsAttr(a));
  pieceB.setAttribute("points", pointsAttr(b));

  cutLine.style.display = "block";
  cutLine.setAttribute("x1", origin[0] - dir[0] * LINE_EXTEND);
  cutLine.setAttribute("y1", origin[1] - dir[1] * LINE_EXTEND);
  cutLine.setAttribute("x2", origin[0] + dir[0] * LINE_EXTEND);
  cutLine.setAttribute("y2", origin[1] + dir[1] * LINE_EXTEND);

  const pctA = totalArea > 0 ? (areaA / totalArea) * 100 : 0;
  const pctB = 100 - pctA;
  areaAVal.textContent = `${Math.round(pctA)}%`;
  areaBVal.textContent = `${Math.round(pctB)}%`;

  return { pctA, pctB };
}

function svgPoint(clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  return [((clientX - rect.left) / rect.width) * SIZE, ((clientY - rect.top) / rect.height) * SIZE];
}

svg.addEventListener("pointerdown", (e) => {
  if (validated) return;
  dragging = true;
  dragStart = svgPoint(e.clientX, e.clientY);
  svg.setPointerCapture(e.pointerId);
});

svg.addEventListener("pointermove", (e) => {
  if (!dragging || validated) return;
  const p = svgPoint(e.clientX, e.clientY);
  const dx = p[0] - dragStart[0];
  const dy = p[1] - dragStart[1];
  const len = Math.hypot(dx, dy);
  if (len < MIN_DRAG_DIST) return;
  const dir = [dx / len, dy / len];
  lastResult = renderCutPreview(dragStart, dir);
  if (!hasPreview) {
    hasPreview = true;
    cutBtn.disabled = false;
  }
});

svg.addEventListener("pointerup", (e) => {
  dragging = false;
  try { svg.releasePointerCapture(e.pointerId); } catch (err) { /* déjà relâché */ }
});
svg.addEventListener("pointercancel", () => { dragging = false; });

// ---- Boucle de jeu ----

function renderRound() {
  validated = false;
  hasPreview = false;
  lastResult = null;
  dragging = false;
  feedbackEl.classList.remove("show");
  feedbackEl.innerHTML = "";
  cutBtn.style.display = "inline-block";
  cutBtn.disabled = true;
  nextBtn.style.display = "none";
  areaAVal.textContent = "—";
  areaBVal.textContent = "—";
  pieceA.classList.remove("shape-piece--locked");
  pieceB.classList.remove("shape-piece--locked");

  shapePoints = generateShape(DIFFICULTY_CONFIG[difficulty]);
  totalArea = polygonArea(shapePoints);
  renderShapeOnly();

  progressLabel.textContent = `${current + 1} / ${SESSION_LENGTH} · ${t("scoreWord")} : ${score}`;
  startTimer(DIFFICULTY_CONFIG[difficulty].time);
}

function clearTimer() {
  if (timerTimeout) clearTimeout(timerTimeout);
  timerTimeout = null;
  timerFill.style.transition = "none";
}

function startTimer(seconds) {
  clearTimer();
  timerFill.classList.remove("warning", "danger");
  timerFill.style.transition = "none";
  timerFill.style.width = "100%";
  void timerFill.offsetWidth;
  timerFill.style.transition = `width ${seconds}s linear`;
  timerFill.style.width = "0%";

  setTimeout(() => { if (!validated) timerFill.classList.add("warning"); }, seconds * 500);
  setTimeout(() => { if (!validated) timerFill.classList.add("danger"); }, seconds * 800);
  timerTimeout = setTimeout(() => { if (!validated) cutNow(true); }, seconds * 1000);
}

function cutNow(timedOut) {
  if (validated) return;
  validated = true;
  clearTimer();
  dragging = false;

  if (!hasPreview) {
    if (window.playSound) playSound("wrong");
    feedbackEl.innerHTML = timedOut ? `${t("timeUp")} ${t("coupeNoSelectionFeedback")}` : t("coupeNoSelectionFeedback");
    feedbackEl.classList.add("show");
    cutBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    return;
  }

  const diffPct = Math.abs(lastResult.pctA - lastResult.pctB);
  const tolerance = DIFFICULTY_CONFIG[difficulty].tolerance;
  const isCorrect = diffPct <= tolerance;
  if (window.playSound) playSound(isCorrect ? "correct" : "wrong");
  if (isCorrect) score++;

  pieceA.classList.add("shape-piece--locked");
  pieceB.classList.add("shape-piece--locked");

  const prefix = timedOut ? `${t("timeUp")} ` : "";
  const diffLabel = `${t("coupeDiffLabel")} ${Math.round(diffPct)}%`;
  if (isCorrect) {
    feedbackEl.innerHTML = `${prefix}${diffPct <= 2 ? t("coupePerfectFeedback") : `${t("coupeGoodFeedback")} (${diffLabel})`}`;
  } else {
    feedbackEl.innerHTML = `${prefix}${t("coupeMissFeedback")} (${diffLabel})`;
  }
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${current + 1} / ${SESSION_LENGTH} · ${t("scoreWord")} : ${score}`;
  cutBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function nextRound() {
  current++;
  if (current >= SESSION_LENGTH) {
    showResults();
  } else {
    renderRound();
  }
}

function startGame() {
  current = 0;
  score = 0;
  gameCard.style.display = "block";
  resultScreen.style.display = "none";
  renderRound();
}

function showResults() {
  clearTimer();
  if (window.playSound) playSound("success");
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  finalScore.textContent = `${score} / ${SESSION_LENGTH}`;
}

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
  difficultyScreen.style.display = "none";
  startGame();
}

function backToDifficulty() {
  clearTimer();
  gameCard.style.display = "none";
  resultScreen.style.display = "none";
  difficultyScreen.style.display = "block";
}

document.querySelectorAll("#difficulty-screen .difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});
cutBtn.addEventListener("click", () => cutNow(false));
nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", () => {
  if (window.playSound) playSound("click");
  startGame();
});
changeLevelBtn.addEventListener("click", () => {
  if (window.playSound) playSound("click");
  backToDifficulty();
});

async function initAccess() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    loginPrompt.style.display = "block";
    return;
  }
  const { data: scores } = await supabaseClient.from("scores").select("score,total,difficulty");
  const xp = totalXp(scores || []);
  const idx = levelIndexForXp(xp);
  const currentPalier = idx + 1;

  if (currentPalier < UNLOCK_PALIER) {
    palierLockedMessage.textContent = `${t("miniGamesLockedPrefix")} ${UNLOCK_PALIER}. ${t("coupeLockedCurrentPrefix")} ${currentPalier}.`;
    palierLocked.style.display = "block";
    return;
  }
  difficultyScreen.style.display = "block";
}

initAccess();
