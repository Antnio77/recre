const levels = {
  facile: [
    { options: ["Il c'est levé tôt.", "Il s'est levé tôt."], correct: 1, explanation: "« s'est » vient du verbe pronominal « se lever » ; « c'est » est la contraction de « cela est »." },
    { options: ["Elle a très faim.", "Elle a très fin."], correct: 0, explanation: "« faim » (envie de manger) ne s'écrit pas comme l'adjectif « fin »." },
    { options: ["Ils sont partie hier.", "Ils sont partis hier."], correct: 1, explanation: "Avec « ils », le participe passé « parti » s'accorde au masculin pluriel : partis." },
    { options: ["Je vais au parc.", "Je vais o parc."], correct: 0, explanation: "« au » est la contraction de « à le » ; « o » seul n'existe pas comme mot." },
    { options: ["Nous avons manger.", "Nous avons mangé."], correct: 1, explanation: "Après l'auxiliaire « avoir », on utilise le participe passé « mangé », pas l'infinitif « manger »." },
    { options: ["Le chat et noir.", "Le chat est noir."], correct: 1, explanation: "« est » est le verbe être ; « et » relie deux mots ou groupes de mots." },
  ],
  moyen: [
    { options: ["Ces enfants sont sages.", "Ses enfants sont sages.", "C'est enfants sont sages."], correct: 0, explanation: "« Ces » est un adjectif démonstratif (ces enfants-là). « Ses » indique une possession, « c'est » ne peut pas précéder un nom pluriel." },
    { options: ["Leur maison est grande.", "Leurs maison est grande."], correct: 0, explanation: "« Leur » reste invariable devant un nom singulier : leur maison (une seule maison)." },
    { options: ["Quelle heure es-tu arrivé ?", "Quelle heure est-tu arrivé ?", "À quelle heure es-tu arrivé ?"], correct: 2, explanation: "Il manque la préposition « à » pour introduire l'heure : à quelle heure." },
    { options: ["Il a mangé à midi.", "Il à mangé a midi."], correct: 0, explanation: "« a » (sans accent) est le verbe avoir ; « à » (avec accent) est une préposition de lieu ou de temps." },
    { options: ["Ils ont faim.", "Ils on faim."], correct: 0, explanation: "« ont » est le verbe avoir conjugué ; « on » est un pronom (on mange)." },
    { options: ["Quand il pleut, je reste chez moi.", "Quant il pleut, je reste chez moi."], correct: 0, explanation: "« Quand » indique le temps ; « quant à » sert à introduire un sujet et s'utilise toujours avec « à »." },
  ],
  difficile: [
    { options: ["Quoiqu'il soit riche, il reste humble.", "Quoi qu'il soit riche, il reste humble."], correct: 0, explanation: "« Quoique » (en un mot) signifie « bien que » ; « quoi que » (en deux mots) signifie « peu importe ce que »." },
    { options: ["Il faut davantage de temps.", "Il faut d'avantage de temps."], correct: 0, explanation: "« Davantage » (plus) s'écrit en un mot ; « avantage » (bénéfice) est un nom précédé d'un article." },
    { options: ["Il est censé arriver à midi.", "Il est sensé arriver à midi."], correct: 0, explanation: "« Censé » signifie « supposé » ; « sensé » signifie « qui a du bon sens »." },
    { options: ["Je préfère celui-ci plutôt que celui-là.", "Je préfère celui-ci plus tôt que celui-là."], correct: 0, explanation: "« Plutôt » exprime une préférence ; « plus tôt » (deux mots) exprime le temps, le contraire de « plus tard »." },
    { options: ["Il faut le faire raisonner.", "Il faut le faire résonner."], correct: 0, explanation: "« Raisonner » quelqu'un, c'est le convaincre par la logique ; « résonner » concerne un son qui se répercute." },
    { options: ["N'oublie pas d'apporter ton parapluie.", "N'oublie pas d'amener ton parapluie."], correct: 0, explanation: "On « apporte » un objet et on « amène » (ou emmène) une personne ou un animal." },
  ],
};

let rounds = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let answered = false;

const difficultyScreen = document.getElementById("difficulty-screen");
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
  order = shuffle(rounds.map((_, i) => i));
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
  const shuffledOptions = data.options.map((text, i) => ({ text, isCorrect: i === data.correct }));
  const displayOrder = shuffle(shuffledOptions);

  choicesEl.innerHTML = "";
  displayOrder.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => selectChoice(opt.isCorrect, btn, data.explanation));
    choicesEl.appendChild(btn);
  });

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `Niveau ${difficulty} · Phrase ${current + 1} / ${order.length} · Score : ${score}`;
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

  if (isCorrect) score++;

  feedbackEl.innerHTML = `${isCorrect ? "Bien vu !" : "Pas tout à fait."} ${explanation}`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `Niveau ${difficulty} · Phrase ${current + 1} / ${order.length} · Score : ${score}`;
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
  if (window.saveScore) window.saveScore("bonne-phrase", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);
