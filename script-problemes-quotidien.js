const levels = {
  fr: {
    facile: [
      { text: "Léa a 5 bonbons. Elle en achète 3 de plus. Combien en a-t-elle ?", answer: 8 },
      { text: "Il y a 10 oiseaux sur la branche. 4 s'envolent. Combien en reste-t-il ?", answer: 6 },
      { text: "Un paquet contient 6 biscuits. Combien de biscuits dans 3 paquets ?", answer: 18 },
      { text: "Tom a 12 billes, il en donne 4 à son ami. Combien lui en reste-t-il ?", answer: 8 },
      { text: "Une classe a 4 rangées de 5 élèves. Combien d'élèves au total ?", answer: 20 },
    ],
    moyen: [
      { text: "Léa achète 3 pains à 1,20€ chacun. Combien paie-t-elle au total (en €) ?", answer: 3.6 },
      { text: "Un bus a 24 passagers. À l'arrêt, 9 descendent et 5 montent. Combien reste-t-il de passagers ?", answer: 20 },
      { text: "Un fermier a 48 œufs. Il les range dans des boîtes de 6. Combien de boîtes remplit-il ?", answer: 8 },
      { text: "Marc a 50€. Il achète un livre à 18€ et un stylo à 4€. Combien lui reste-t-il (en €) ?", answer: 28 },
      { text: "Une pizza est coupée en 8 parts. 3 amis en mangent chacun 2 parts. Combien de parts reste-t-il ?", answer: 2 },
    ],
    difficile: [
      { text: "Un article coûte 80€. Il est soldé à -25%. Quel est le nouveau prix (en €) ?", answer: 60 },
      { text: "Un train parcourt 240 km en 3 heures. Quelle est sa vitesse moyenne en km/h ?", answer: 80 },
      { text: "Une recette pour 4 personnes nécessite 250g de farine. Combien de grammes faut-il pour 6 personnes ?", answer: 375 },
      { text: "Sophie place 500€ à un taux d'intérêt simple de 4% par an. Combien d'intérêts (en €) aura-t-elle après 1 an ?", answer: 20 },
      { text: "Un réservoir de 60 litres est rempli aux deux tiers. Combien de litres contient-il ?", answer: 40 },
    ],
  },
  en: {
    facile: [
      { text: "Lea has 5 candies. She buys 3 more. How many candies does she have now?", answer: 8 },
      { text: "There are 10 birds on the branch. 4 fly away. How many are left?", answer: 6 },
      { text: "A pack has 6 cookies. How many cookies are in 3 packs?", answer: 18 },
      { text: "Tom has 12 marbles and gives 4 to his friend. How many does he have left?", answer: 8 },
      { text: "A classroom has 4 rows of 5 students. How many students in total?", answer: 20 },
    ],
    moyen: [
      { text: "Lea buys 3 loaves of bread at $1.20 each. How much does she pay in total?", answer: 3.6 },
      { text: "A bus has 24 passengers. At a stop, 9 get off and 5 get on. How many passengers are left?", answer: 20 },
      { text: "A farmer has 48 eggs. He packs them into boxes of 6. How many boxes does he fill?", answer: 8 },
      { text: "Mark has $50. He buys a book for $18 and a pen for $4. How much does he have left?", answer: 28 },
      { text: "A pizza is cut into 8 slices. 3 friends each eat 2 slices. How many slices are left?", answer: 2 },
    ],
    difficile: [
      { text: "An item costs $80. It's on sale at -25%. What is the new price?", answer: 60 },
      { text: "A train travels 240 km in 3 hours. What is its average speed in km/h?", answer: 80 },
      { text: "A recipe for 4 people needs 250g of flour. How much flour is needed for 6 people?", answer: 375 },
      { text: "Sophie invests $500 at a simple interest rate of 4% per year. How much interest will she earn after 1 year?", answer: 20 },
      { text: "A 60-liter tank is two-thirds full. How many liters does it contain?", answer: 40 },
    ],
  },
};

let sentences = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let validated = false;

const difficultyScreen = document.getElementById("difficulty-screen");
const problemTextEl = document.getElementById("problem-text");
const answerInput = document.getElementById("answer-input");
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
  sentences = levels[currentLang][level];
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
  order = shuffle(sentences.map((_, i) => i));
  current = 0;
  score = 0;
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  renderProblem();
}

function renderProblem() {
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
}

function validate() {
  if (validated) return;
  validated = true;
  answerInput.disabled = true;

  const data = sentences[order[current]];
  const typed = answerInput.value.trim().replace(",", ".");
  const typedNum = parseFloat(typed);
  const isCorrect = !isNaN(typedNum) && Math.abs(typedNum - data.answer) < 0.01;

  if (isCorrect) score++;

  feedbackEl.innerHTML = isCorrect
    ? `${t("wellSpotted")} ${data.answer} ✓`
    : `${t("notQuite")} ${t("exactSentenceWas")} <strong>${data.answer}</strong>`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function nextProblem() {
  current++;
  if (current >= order.length) {
    showResult();
  } else {
    renderProblem();
  }
}

function showResult() {
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("problemes-quotidien", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

validateBtn.addEventListener("click", validate);
nextBtn.addEventListener("click", nextProblem);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !validated) validate();
});

// Les énoncés sont différents en FR/EN : changer de langue en cours de
// partie revient à l'écran de sélection du niveau.
document.addEventListener("langchange", backToDifficulty);
