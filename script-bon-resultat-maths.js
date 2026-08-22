const levels = {
  facile: [
    { expr: "6 × 7 = ?", options: [42, 36, 48, 40], correct: 0, explanation: { fr: "6 × 7 = 42. Attention à ne pas confondre avec les tables voisines (6×6=36, 6×8=48).", en: "6 × 7 = 42. Watch out for neighbouring tables (6×6=36, 6×8=48)." } },
    { expr: "15 − 8 = ?", options: [7, 6, 8, 23], correct: 0, explanation: { fr: "15 − 8 = 7. Pense à compter à partir de 8 jusqu'à 15.", en: "15 − 8 = 7. Try counting up from 8 to 15 to check." } },
    { expr: "9 + 6 = ?", options: [15, 14, 16, 13], correct: 0, explanation: { fr: "9 + 6 = 15. Tu peux décomposer 6 en 1 + 5 pour arriver à 10 + 5.", en: "9 + 6 = 15. Try splitting 6 into 1 + 5 to make 10 + 5." } },
    { expr: "24 ÷ 4 = ?", options: [6, 5, 7, 8], correct: 0, explanation: { fr: "24 ÷ 4 = 6, car 4 × 6 = 24.", en: "24 ÷ 4 = 6, because 4 × 6 = 24." } },
    { expr: "8 × 5 = ?", options: [40, 45, 35, 42], correct: 0, explanation: { fr: "8 × 5 = 40. La table de 5 se termine toujours par 0 ou 5.", en: "8 × 5 = 40. The 5 times table always ends in 0 or 5." } },
    { expr: "13 + 9 = ?", options: [22, 21, 23, 20], correct: 0, explanation: { fr: "13 + 9 = 22. Arrondis 9 à 10, calcule 13+10=23, puis enlève 1.", en: "13 + 9 = 22. Round 9 up to 10, compute 13+10=23, then subtract 1." } },
    { expr: "7 × 9 = ?", options: [63, 54, 56, 72], correct: 0, explanation: { fr: "7×9=63. Pense à (7×10)-7=70-7=63.", en: "7×9=63. Try (7×10)-7=70-7=63." } },
    { expr: "18 − 9 = ?", options: [9, 8, 10, 19], correct: 0, explanation: { fr: "18-9=9, la moitié de 18.", en: "18-9=9, half of 18." } },
    { expr: "36 ÷ 6 = ?", options: [6, 5, 7, 8], correct: 0, explanation: { fr: "36÷6=6, car 6×6=36.", en: "36÷6=6, because 6×6=36." } },
    { expr: "7 + 8 = ?", options: [15, 14, 16, 13], correct: 0, explanation: { fr: "7+8=15. Décompose 8 en 3+5 pour arriver à 10+5.", en: "7+8=15. Split 8 into 3+5 to make 10+5." } },
    { expr: "9 × 4 = ?", options: [36, 32, 40, 42], correct: 0, explanation: { fr: "9×4=36. Astuce : 9×4 = 10×4-4 = 40-4=36.", en: "9×4=36. Trick: 9×4 = 10×4-4 = 40-4=36." } },
    { expr: "20 − 6 = ?", options: [14, 13, 15, 16], correct: 0, explanation: { fr: "20-6=14, compte à rebours depuis 20.", en: "20-6=14, count back from 20." } },
  ],
  moyen: [
    { expr: "3 + 4 × 2 = ?", options: [11, 14, 9, 10], correct: 0, explanation: { fr: "La multiplication est prioritaire : 4×2=8, puis 3+8=11.", en: "Multiplication comes first: 4×2=8, then 3+8=11." } },
    { expr: "50 − 2 × 10 = ?", options: [30, 480, 40, 20], correct: 0, explanation: { fr: "2×10=20 d'abord, puis 50-20=30.", en: "Compute 2×10=20 first, then 50-20=30." } },
    { expr: "(12 − 4) × 3 = ?", options: [24, 20, 32, 8], correct: 0, explanation: { fr: "Les parenthèses d'abord : 12-4=8, puis 8×3=24.", en: "Parentheses first: 12-4=8, then 8×3=24." } },
    { expr: "100 ÷ 5 + 3 = ?", options: [23, 20, 25, 17], correct: 0, explanation: { fr: "100÷5=20 d'abord, puis 20+3=23.", en: "100÷5=20 first, then 20+3=23." } },
    { expr: "9 × 9 − 15 = ?", options: [66, 81, 60, 71], correct: 0, explanation: { fr: "9×9=81 d'abord, puis 81-15=66.", en: "9×9=81 first, then 81-15=66." } },
    { expr: "7 × 6 + 8 = ?", options: [50, 54, 48, 42], correct: 0, explanation: { fr: "7×6=42 d'abord, puis 42+8=50.", en: "7×6=42 first, then 42+8=50." } },
    { expr: "5 + 3 × 6 = ?", options: [23, 48, 18, 21], correct: 0, explanation: { fr: "3×6=18 d'abord, puis 5+18=23.", en: "3×6=18 first, then 5+18=23." } },
    { expr: "(8 + 2) × 4 = ?", options: [40, 34, 36, 20], correct: 0, explanation: { fr: "8+2=10, puis 10×4=40.", en: "8+2=10, then 10×4=40." } },
    { expr: "80 ÷ 4 − 5 = ?", options: [15, 20, 10, 25], correct: 0, explanation: { fr: "80÷4=20, puis 20-5=15.", en: "80÷4=20, then 20-5=15." } },
    { expr: "6 × 8 − 10 = ?", options: [38, 48, 42, 28], correct: 0, explanation: { fr: "6×8=48, puis 48-10=38.", en: "6×8=48, then 48-10=38." } },
    { expr: "4 × 5 + 30 = ?", options: [50, 35, 45, 20], correct: 0, explanation: { fr: "4×5=20, puis 20+30=50.", en: "4×5=20, then 20+30=50." } },
    { expr: "90 − 6 × 9 = ?", options: [36, 756, 84, 30], correct: 0, explanation: { fr: "6×9=54, puis 90-54=36.", en: "6×9=54, then 90-54=36." } },
  ],
  difficile: [
    { expr: "20% de 150 = ?", options: [30, 15, 45, 20], correct: 0, explanation: { fr: "20% = 0,2. 150 × 0,2 = 30.", en: "20% = 0.2. 150 × 0.2 = 30." } },
    { expr: "−8 + 15 = ?", options: [7, -7, 23, -23], correct: 0, explanation: { fr: "-8 + 15 revient à 15 - 8 = 7.", en: "-8 + 15 is the same as 15 - 8 = 7." } },
    { expr: "3/4 de 60 = ?", options: [45, 40, 48, 20], correct: 0, explanation: { fr: "60 ÷ 4 = 15, puis 15 × 3 = 45.", en: "60 ÷ 4 = 15, then 15 × 3 = 45." } },
    { expr: "(−5) × 6 = ?", options: [-30, 30, -11, 11], correct: 0, explanation: { fr: "Positif × négatif = négatif : 5×6=30, donc -30.", en: "Positive × negative = negative: 5×6=30, so -30." } },
    { expr: "150 − 30% de 150 = ?", options: [105, 45, 120, 135], correct: 0, explanation: { fr: "30% de 150 = 45, donc 150-45=105.", en: "30% of 150 = 45, so 150-45=105." } },
    { expr: "2/5 de 100 = ?", options: [40, 20, 50, 25], correct: 0, explanation: { fr: "100 ÷ 5 = 20, puis 20 × 2 = 40.", en: "100 ÷ 5 = 20, then 20 × 2 = 40." } },
    { expr: "50% de 84 = ?", options: [42, 40, 44, 21], correct: 0, explanation: { fr: "50% = la moitié : 84÷2=42.", en: "50% = half: 84÷2=42." } },
    { expr: "−12 + 4 = ?", options: [-8, 8, 16, -16], correct: 0, explanation: { fr: "-12+4 revient à -(12-4) = -8.", en: "-12+4 is -(12-4) = -8." } },
    { expr: "1/3 de 90 = ?", options: [30, 45, 27, 33], correct: 0, explanation: { fr: "90÷3=30.", en: "90÷3=30." } },
    { expr: "(−4) × (−7) = ?", options: [28, -28, 11, -11], correct: 0, explanation: { fr: "Négatif × négatif = positif : 4×7=28.", en: "Negative × negative = positive: 4×7=28." } },
    { expr: "10% de 250 = ?", options: [25, 2.5, 250, 50], correct: 0, explanation: { fr: "10% = diviser par 10 : 250÷10=25.", en: "10% = divide by 10: 250÷10=25." } },
    { expr: "200 + 15% de 200 = ?", options: [230, 215, 30, 245], correct: 0, explanation: { fr: "15% de 200 = 30, donc 200+30=230.", en: "15% of 200 = 30, so 200+30=230." } },
  ],
};

const SESSION_LENGTH = 6;

let rounds = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let answered = false;

const difficultyScreen = document.getElementById("difficulty-screen");
const expressionEl = document.getElementById("expression");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");

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
  rounds = levels[level];
  difficultyScreen.style.display = "none";
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  startGame();
}

function backToDifficulty() {
  gameCard.style.display = "none";
  resultScreen.style.display = "none";
  difficultyScreen.style.display = "block";
}

function startGame() {
  order = shuffle(rounds.map((_, i) => i)).slice(0, Math.min(SESSION_LENGTH, rounds.length));
  current = 0;
  score = 0;
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  renderRound();
}

function renderRound() {
  answered = false;
  feedbackEl.classList.remove("show");
  feedbackEl.innerHTML = "";
  nextBtn.style.display = "none";

  const data = rounds[order[current]];
  expressionEl.textContent = data.expr;

  const optionsList = data.options.map((value, i) => ({ value, isCorrect: i === data.correct }));
  const displayOrder = shuffle(optionsList);

  choicesEl.innerHTML = "";
  displayOrder.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.style.textAlign = "center";
    btn.textContent = opt.value;
    btn.addEventListener("click", () => selectChoice(opt.isCorrect, btn, data.explanation));
    choicesEl.appendChild(btn);
  });

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
}

function selectChoice(isCorrect, clickedBtn, explanation) {
  if (answered) return;
  answered = true;

  const allBtns = choicesEl.querySelectorAll(".choice-btn");
  allBtns.forEach((btn) => {
    btn.disabled = true;
    if (btn === clickedBtn) {
      btn.classList.add(isCorrect ? "correct" : "wrong-pick");
    }
  });

  const data = rounds[order[current]];
  if (isCorrect) {
    score++;
    if (window.clearMistake) clearMistake("bon-resultat-maths", data.expr);
  } else {
    if (window.recordMistake) recordMistake("bon-resultat-maths", difficulty, data.expr, data);
  }

  const explanationText = explanation[currentLang] || explanation.fr;
  feedbackEl.innerHTML = `${isCorrect ? t("wellSpotted") : t("notQuite")} ${explanationText}`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  nextBtn.style.display = "inline-block";
}

function nextRound() {
  current++;
  if (current >= order.length) {
    showResult();
  } else {
    renderRound();
  }
}

function showResult() {
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("bon-resultat-maths", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

// Les calculs sont universels (mêmes nombres en FR/EN), mais l'explication
// change de langue : on ré-affiche juste les textes visibles, sans relancer
// la manche en cours.
document.addEventListener("langchange", () => {
  if (!answered) {
    progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${(order.length || 1)} · ${t("scoreWord")} : ${score}`;
  }
});
