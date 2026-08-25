const levels = {
  facile: [
    { expr: "8 + 5", answer: 13 },
    { expr: "14 − 6", answer: 8 },
    { expr: "9 + 7", answer: 16 },
    { expr: "18 − 9", answer: 9 },
    { expr: "6 + 6", answer: 12 },
    { expr: "20 − 13", answer: 7 },
    { expr: "11 + 4", answer: 15 },
    { expr: "17 − 8", answer: 9 },
    { expr: "5 + 9", answer: 14 },
    { expr: "16 − 7", answer: 9 },
    { expr: "12 + 8", answer: 20 },
    { expr: "19 − 11", answer: 8 },
    { expr: "4 + 13", answer: 17 },
    { expr: "15 − 9", answer: 6 },
    { expr: "10 + 10", answer: 20 },
    { expr: "18 − 12", answer: 6 },
  ],
  moyen: [
    { expr: "7 × 8", answer: 56 },
    { expr: "63 ÷ 9", answer: 7 },
    { expr: "45 + 38", answer: 83 },
    { expr: "92 − 47", answer: 45 },
    { expr: "6 × 9", answer: 54 },
    { expr: "72 ÷ 8", answer: 9 },
    { expr: "56 + 29", answer: 85 },
    { expr: "81 − 34", answer: 47 },
    { expr: "48 ÷ 6", answer: 8 },
    { expr: "9 × 8", answer: 72 },
    { expr: "54 ÷ 6", answer: 9 },
    { expr: "37 + 46", answer: 83 },
    { expr: "68 − 29", answer: 39 },
    { expr: "5 × 12", answer: 60 },
    { expr: "84 ÷ 7", answer: 12 },
    { expr: "27 + 58", answer: 85 },
    { expr: "93 − 58", answer: 35 },
    { expr: "11 × 6", answer: 66 },
  ],
  difficile: [
    { expr: "(4 + 3) × 6", answer: 42 },
    { expr: "125 − 68", answer: 57 },
    { expr: "12 × 12", answer: 144 },
    { expr: "144 ÷ 12", answer: 12 },
    { expr: "(9 − 4) × 8", answer: 40 },
    { expr: "256 + 187", answer: 443 },
    { expr: "15 × 6 − 20", answer: 70 },
    { expr: "(6 + 2) × 5", answer: 40 },
    { expr: "312 − 178", answer: 134 },
    { expr: "13 × 13", answer: 169 },
    { expr: "196 ÷ 14", answer: 14 },
    { expr: "(11 − 3) × 7", answer: 56 },
    { expr: "348 + 276", answer: 624 },
    { expr: "8 × 9 + 17", answer: 89 },
  ],
};

const SESSION_LENGTH = 8;

const TIME_PER_LEVEL = { facile: 15, moyen: 10, difficile: 8 };

let sentences = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let validated = false;
let timerTimeout = null;

const difficultyScreen = document.getElementById("difficulty-screen");
const expressionEl = document.getElementById("expression");
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
  if (window.playSound) playSound("click");
  sentences = levels[level];
  difficultyScreen.style.display = "none";
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
  // force reflow so the next transition actually animates from 100%
  void timerFill.offsetWidth;
  timerFill.style.transition = `width ${seconds}s linear`;
  timerFill.style.width = "0%";

  const warningAt = seconds * 1000 * 0.5;
  const dangerAt = seconds * 1000 * 0.8;
  setTimeout(() => { if (!validated) timerFill.classList.add("warning"); }, warningAt);
  setTimeout(() => { if (!validated) timerFill.classList.add("danger"); }, dangerAt);

  timerTimeout = setTimeout(() => {
    if (!validated) validate(true);
  }, seconds * 1000);
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
  expressionEl.textContent = `${data.expr} = ?`;

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
  if (window.playSound) playSound(isCorrect ? "correct" : "wrong");

  if (isCorrect) {
    score++;
    if (window.clearMistake) clearMistake("calcul-mental", data.expr);
  } else {
    if (window.recordMistake) recordMistake("calcul-mental", difficulty, data.expr, data);
  }

  const prefix = timedOut ? `${t("timeUp")} ` : "";
  feedbackEl.innerHTML = isCorrect
    ? `${prefix}${t("wellSpotted")} ${data.expr} = ${data.answer} ✓`
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
  if (window.playSound) playSound("success");
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("calcul-mental", difficulty, score, order.length);
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

// Changer de langue en cours de partie revient à l'écran de niveau
// (le minuteur en cours n'aurait plus de sens à conserver).
document.addEventListener("langchange", backToDifficulty);
