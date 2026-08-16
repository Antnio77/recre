const levels = {
  fr: {
    facile: [
      { text: "Périmètre d'un rectangle 5×3", answer: 16 },
      { text: "Aire d'un rectangle 4×6", answer: 24 },
      { text: "Périmètre d'un carré de côté 7", answer: 28 },
      { text: "Aire d'un carré de côté 5", answer: 25 },
      { text: "Périmètre d'un rectangle 8×2", answer: 20 },
      { text: "Aire d'un rectangle 3×9", answer: 27 },
      { text: "Périmètre d'un carré de côté 9", answer: 36 },
      { text: "Aire d'un carré de côté 6", answer: 36 },
      { text: "Périmètre d'un rectangle 10×4", answer: 28 },
      { text: "Aire d'un rectangle 7×5", answer: 35 },
    ],
    moyen: [
      { text: "Aire d'un triangle base 8 hauteur 5", answer: 20 },
      { text: "Aire d'un triangle base 10 hauteur 6", answer: 30 },
      { text: "Périmètre d'un cercle de rayon 5 (π≈3)", answer: 30 },
      { text: "Aire d'un cercle de rayon 4 (π≈3)", answer: 48 },
      { text: "Aire d'un triangle base 12 hauteur 4", answer: 24 },
      { text: "Périmètre d'un cercle de rayon 3 (π≈3)", answer: 18 },
      { text: "Aire d'un cercle de rayon 2 (π≈3)", answer: 12 },
      { text: "Aire d'un triangle base 6 hauteur 7", answer: 21 },
      { text: "Périmètre d'un cercle de rayon 6 (π≈3)", answer: 36 },
      { text: "Aire d'un triangle base 9 hauteur 8", answer: 36 },
    ],
    difficile: [
      { text: "Volume d'un cube d'arête 3", answer: 27 },
      { text: "Volume d'un pavé 2×3×4", answer: 24 },
      { text: "Volume d'un cube d'arête 4", answer: 64 },
      { text: "Volume d'un pavé 5×2×3", answer: 30 },
      { text: "Aire d'un trapèze bases 6 et 10 hauteur 4", answer: 32 },
      { text: "Volume d'un pavé 6×2×2", answer: 24 },
      { text: "Aire d'un trapèze bases 4 et 8 hauteur 5", answer: 30 },
      { text: "Volume d'un cube d'arête 5", answer: 125 },
    ],
  },
  en: {
    facile: [
      { text: "Perimeter of a 5×3 rectangle", answer: 16 },
      { text: "Area of a 4×6 rectangle", answer: 24 },
      { text: "Perimeter of a square with side 7", answer: 28 },
      { text: "Area of a square with side 5", answer: 25 },
      { text: "Perimeter of an 8×2 rectangle", answer: 20 },
      { text: "Area of a 3×9 rectangle", answer: 27 },
      { text: "Perimeter of a square with side 9", answer: 36 },
      { text: "Area of a square with side 6", answer: 36 },
      { text: "Perimeter of a 10×4 rectangle", answer: 28 },
      { text: "Area of a 7×5 rectangle", answer: 35 },
    ],
    moyen: [
      { text: "Area of a triangle, base 8 height 5", answer: 20 },
      { text: "Area of a triangle, base 10 height 6", answer: 30 },
      { text: "Circumference of a circle, radius 5 (π≈3)", answer: 30 },
      { text: "Area of a circle, radius 4 (π≈3)", answer: 48 },
      { text: "Area of a triangle, base 12 height 4", answer: 24 },
      { text: "Circumference of a circle, radius 3 (π≈3)", answer: 18 },
      { text: "Area of a circle, radius 2 (π≈3)", answer: 12 },
      { text: "Area of a triangle, base 6 height 7", answer: 21 },
      { text: "Circumference of a circle, radius 6 (π≈3)", answer: 36 },
      { text: "Area of a triangle, base 9 height 8", answer: 36 },
    ],
    difficile: [
      { text: "Volume of a cube with edge 3", answer: 27 },
      { text: "Volume of a 2×3×4 box", answer: 24 },
      { text: "Volume of a cube with edge 4", answer: 64 },
      { text: "Volume of a 5×2×3 box", answer: 30 },
      { text: "Area of a trapezoid, bases 6 and 10, height 4", answer: 32 },
      { text: "Volume of a 6×2×2 box", answer: 24 },
      { text: "Area of a trapezoid, bases 4 and 8, height 5", answer: 30 },
      { text: "Volume of a cube with edge 5", answer: 125 },
    ],
  },
};

const TIME_PER_LEVEL = { facile: 15, moyen: 10, difficile: 8 };
const SESSION_LENGTH = 8;

let sentences = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let validated = false;
let timerTimeout = null;

const difficultyScreen = document.getElementById("difficulty-screen");
const problemTextEl = document.getElementById("problem-text");
const answerInput = document.getElementById("answer-input");
const timerFill = document.getElementById("timer-fill");
const validateBtn = document.getElementById("validate-btn");
const nextBtn = document.getElementById("next-btn");
const feedbackEl = document.getElementById("feedback");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const keypadContainer = document.getElementById("keypad-container");
const loginPrompt = document.getElementById("login-prompt");
const premiumLocked = document.getElementById("premium-locked");

createKeypad(keypadContainer, answerInput);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chooseDifficulty(level) {
  difficulty = level;
  sentences = levels[currentLang][level];
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  startGame();
}

function backToDifficulty() {
  clearTimer();
  gameCard.style.display = "none";
  resultScreen.style.display = "none";
  difficultyScreen.style.display = "block";
}

function startGame() {
  order = shuffle(sentences.map((_, i) => i)).slice(0, Math.min(SESSION_LENGTH, sentences.length));
  current = 0;
  score = 0;
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  renderQuestion();
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
  timerTimeout = setTimeout(() => { if (!validated) validate(true); }, seconds * 1000);
}

function renderQuestion() {
  validated = false;
  answerInput.value = "";
  answerInput.disabled = false;
  feedbackEl.classList.remove("show");
  feedbackEl.innerHTML = "";
  validateBtn.style.display = "inline-block";
  nextBtn.style.display = "none";

  const data = sentences[order[current]];
  problemTextEl.textContent = data.text;

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;

  answerInput.focus();
  startTimer(TIME_PER_LEVEL[difficulty]);
}

function validate(timedOut) {
  if (validated) return;
  validated = true;
  clearTimer();
  answerInput.disabled = true;

  const data = sentences[order[current]];
  const typed = answerInput.value.trim().replace(",", ".");
  const typedNum = parseFloat(typed);
  const isCorrect = !isNaN(typedNum) && Math.abs(typedNum - data.answer) < 0.01;

  if (isCorrect) score++;

  const prefix = timedOut ? `${t("timeUp")} ` : "";
  feedbackEl.innerHTML = isCorrect
    ? `${prefix}${t("wellSpotted")} ${data.answer} ✓`
    : `${prefix}${t("notQuite")} ${t("exactSentenceWas")} <strong>${data.answer}</strong>`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function nextQuestion() {
  current++;
  if (current >= order.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  clearTimer();
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("geometrie-eclair", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

validateBtn.addEventListener("click", () => validate(false));
nextBtn.addEventListener("click", nextQuestion);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !validated) validate(false);
});

document.addEventListener("langchange", () => {
  if (difficultyScreen.style.display === "block") backToDifficulty();
});

async function initAccess() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    loginPrompt.style.display = "block";
    return;
  }
  const premium = await checkPremiumStatus();
  if (!premium) {
    premiumLocked.style.display = "block";
    return;
  }
  difficultyScreen.style.display = "block";
}

initAccess();
