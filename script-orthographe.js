const levels = {
  fr: {
    facile: [
      { text: "Les enfant jouent dans le jardin.", errors: { 1: "enfants" } },
      { text: "Elle mange une pomme rouge.", errors: {} },
      { text: "Nous somme content aujourd'hui.", errors: { 1: "sommes" } },
      { text: "Le chien court dans le parc.", errors: {} },
      { text: "Les oiseaux chante le matin.", errors: { 2: "chantent" } },
      { text: "Il fait très beau ce matin.", errors: {} },
    ],
    moyen: [
      { text: "Les chats aiment jouer avec des ficelle.", errors: { 6: "ficelles." } },
      { text: "Elle a mangé une pomme rouge trés mûre.", errors: { 6: "très" } },
      { text: "Nous somme allés au marché hier matin.", errors: { 1: "sommes" } },
      { text: "Mon frère et moi avons visiter le musée.", errors: { 5: "visité" } },
      { text: "Les enfant jouent dans le jardins.", errors: { 1: "enfants", 5: "jardin." } },
      { text: "Ce livre est vraiment intéressant et amusant.", errors: {} },
      { text: "Elle a oublier son parapluie à la maison.", errors: { 2: "oublié" } },
      { text: "Ils sont aller au cinéma samedi soir.", errors: { 2: "allés" } },
      { text: "Les oiseaux chantent dans les arbre.", errors: { 5: "arbres." } },
    ],
    difficile: [
      { text: "Malgrés les embuches, ils on réussi leurs examens.", errors: { 0: "Malgré", 2: "embûches,", 4: "ont" } },
      { text: "Quelqu'un a laisser trainer ses affaire dans le couloir.", errors: { 3: "laissé", 6: "affaires" } },
      { text: "Les nouveau locataires n'ont pas encore payer leur loyers.", errors: { 1: "nouveaux", 7: "payé", 8: "leurs" } },
      { text: "Malgré la fatigue, elle continua à travailler sans relache.", errors: { 8: "relâche." } },
      { text: "Ils croivent que tout est fini depuis longtemps.", errors: { 1: "croient" } },
      { text: "C'est en forgeant qu'on devient forgeron, disait mon grand-père.", errors: {} },
      { text: "Les décision qu'ils ont pris étaient bonne pour l'entreprise.", errors: { 1: "décisions", 5: "prises", 6: "bonnes" } },
    ],
  },
  en: {
    facile: [
      { text: "The dog run in the park.", errors: { 2: "runs" } },
      { text: "She like chocolate cake.", errors: { 1: "likes" } },
      { text: "I have three cat.", errors: { 3: "cats." } },
      { text: "He are my best friend.", errors: { 1: "is" } },
      { text: "They was late today.", errors: { 1: "were" } },
      { text: "The sun is shining bright.", errors: {} },
    ],
    moyen: [
      { text: "Its raining outside today.", errors: { 0: "It's" } },
      { text: "Your welcome to join us.", errors: { 0: "You're" } },
      { text: "The team are loosing the match.", errors: { 3: "losing" } },
      { text: "There going to the beach tomorrow.", errors: { 0: "They're" } },
      { text: "I should of called you earlier.", errors: { 2: "have" } },
      { text: "This is definately the best pizza.", errors: { 2: "definitely" } },
      { text: "He don't know the answer.", errors: { 1: "doesn't" } },
      { text: "The children plays outside every day.", errors: { 2: "play" } },
      { text: "She past the exam easily.", errors: { 1: "passed" } },
    ],
    difficile: [
      { text: "The company have shown a significant loss, effecting their stock price.", errors: { 2: "has", 7: "affecting" } },
      { text: "Their going to loose the game if they don't improve.", errors: { 0: "They're", 3: "lose" } },
      { text: "I can't believe he recieved two seperate awards.", errors: { 4: "received", 6: "separate" } },
      { text: "The commitee are meeting to discuss the budget tommorow.", errors: { 1: "committee", 8: "tomorrow." } },
      { text: "Its a shame that there not coming to the party.", errors: { 0: "It's", 4: "they're" } },
      { text: "Despite loosing the first round, she preformed brilliantly in the final.", errors: { 1: "losing", 6: "performed" } },
      { text: "The weather effects my mood, so I try to stay positive regardless.", errors: { 2: "affects" } },
    ],
  },
};

let sentences = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let selected = new Set();
let validated = false;

const difficultyScreen = document.getElementById("difficulty-screen");
const sentenceEl = document.getElementById("sentence");
const correctionInputsEl = document.getElementById("correction-inputs");
const validateBtn = document.getElementById("validate-btn");
const nextBtn = document.getElementById("next-btn");
const correctionsEl = document.getElementById("corrections");
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

function normalizeWord(w) {
  return w.toLowerCase().replace(/^[.,!?;:"'’()«»]+|[.,!?;:"'’()«»]+$/g, "");
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
  renderSentence();
}

function renderSentence() {
  selected = new Set();
  validated = false;
  correctionsEl.classList.remove("show");
  correctionsEl.innerHTML = "";
  correctionInputsEl.innerHTML = "";
  validateBtn.style.display = "inline-block";
  nextBtn.style.display = "none";

  const data = sentences[order[current]];
  const tokens = data.text.split(" ");
  sentenceEl.innerHTML = "";

  tokens.forEach((word, i) => {
    const btn = document.createElement("button");
    btn.className = "word-btn";
    btn.textContent = word;
    btn.type = "button";
    btn.addEventListener("click", () => toggleWord(i, btn, word));
    sentenceEl.appendChild(btn);
  });

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
}

function toggleWord(i, btn, word) {
  if (validated) return;
  if (selected.has(i)) {
    selected.delete(i);
    btn.classList.remove("selected");
    const row = document.getElementById(`correction-row-${i}`);
    if (row) row.remove();
  } else {
    selected.add(i);
    btn.classList.add("selected");
    const row = document.createElement("div");
    row.className = "correction-row";
    row.id = `correction-row-${i}`;
    row.innerHTML = `
      <span class="flagged-word">${word}</span>
      <span>→</span>
      <input type="text" class="correction-input" id="correction-input-${i}" placeholder="${t("yourProposal")}" autocomplete="off" autocapitalize="off" spellcheck="false">
    `;
    correctionInputsEl.appendChild(row);
    row.querySelector("input").focus();
  }
}

function validate() {
  if (validated) return;
  validated = true;

  const data = sentences[order[current]];
  const errorIndices = Object.keys(data.errors).map(Number);
  const buttons = sentenceEl.querySelectorAll(".word-btn");

  let allCorrected = true;
  let noWrongPicks = true;

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove("selected");
    const isError = errorIndices.includes(i);
    const wasSelected = selected.has(i);

    if (isError && wasSelected) {
      const input = document.getElementById(`correction-input-${i}`);
      const typed = input ? input.value.trim() : "";
      if (input) input.disabled = true;
      const isRight = normalizeWord(typed) === normalizeWord(data.errors[i]);
      if (isRight) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("found-wrong");
        allCorrected = false;
      }
    } else if (isError && !wasSelected) {
      btn.classList.add("missed");
      allCorrected = false;
    } else if (!isError && wasSelected) {
      btn.classList.add("wrong-pick");
      noWrongPicks = false;
      const input = document.getElementById(`correction-input-${i}`);
      if (input) input.disabled = true;
    }
  });

  const roundSuccess = allCorrected && noWrongPicks;
  if (roundSuccess) score++;

  if (errorIndices.length > 0) {
    const list = errorIndices
      .map((i) => {
        const wasSelected = selected.has(i);
        const input = document.getElementById(`correction-input-${i}`);
        const typed = wasSelected && input ? input.value.trim() : null;
        const target = data.errors[i];
        if (!wasSelected) {
          return `<strong>${data.text.split(" ")[i]}</strong> → ${target} (${t("notSpotted")})`;
        }
        if (normalizeWord(typed) === normalizeWord(target)) {
          return `<strong>${data.text.split(" ")[i]}</strong> → ${target} ✓`;
        }
        return `<strong>${data.text.split(" ")[i]}</strong> → ${target} (${t("yourProposal")} : « ${typed || t("emptyWord")} »)`;
      })
      .join(" &nbsp;·&nbsp; ");
    correctionsEl.innerHTML = roundSuccess
      ? `${t("perfectExclaim")} ${list}`
      : `${t("expectedCorrections")} ${list}`;
  } else {
    correctionsEl.innerHTML = roundSuccess ? t("noMistakeCorrect") : t("noMistakeWrong");
  }
  correctionsEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function nextSentence() {
  current++;
  if (current >= order.length) {
    showResult();
  } else {
    renderSentence();
  }
}

function showResult() {
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("orthographe", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

validateBtn.addEventListener("click", validate);
nextBtn.addEventListener("click", nextSentence);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

// Si la langue change en cours de partie, on revient à l'écran de
// sélection du niveau (les phrases sont entièrement différentes d'une
// langue à l'autre, un ré-affichage à la volée n'aurait pas de sens).
document.addEventListener("langchange", backToDifficulty);
