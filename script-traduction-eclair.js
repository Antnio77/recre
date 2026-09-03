// Traduction éclair : traduit un mot ou une phrase. Le sens de traduction
// suit la langue de l'interface, comme les autres jeux de langues du site
// (orthographe, dictée...) : interface en français -> on traduit VERS
// l'anglais (apprentissage de l'anglais) ; interface en anglais -> on
// traduit VERS le français. Chaque entrée a une seule forme française
// canonique et une liste de formes anglaises acceptées (plusieurs
// formulations valides existent souvent en anglais : contractions,
// synonymes proches...).
const levels = {
  facile: [
    { fr: "Bonjour", en: ["hello", "hi"] },
    { fr: "Merci", en: ["thank you", "thanks"] },
    { fr: "Au revoir", en: ["goodbye", "bye"] },
    { fr: "Oui", en: ["yes"] },
    { fr: "Non", en: ["no"] },
    { fr: "S'il te plaît", en: ["please"] },
    { fr: "Le chat", en: ["the cat"] },
    { fr: "Le chien", en: ["the dog"] },
    { fr: "La maison", en: ["the house"] },
    { fr: "L'école", en: ["the school"] },
    { fr: "Un livre", en: ["a book"] },
    { fr: "Rouge", en: ["red"] },
    { fr: "Bleu", en: ["blue"] },
    { fr: "Le soleil", en: ["the sun"] },
  ],
  moyen: [
    { fr: "J'ai faim", en: ["i am hungry", "i'm hungry"] },
    { fr: "Il fait beau", en: ["the weather is nice", "it's nice out", "it is sunny"] },
    { fr: "Je m'appelle Marie", en: ["my name is marie"] },
    { fr: "Quelle heure est-il ?", en: ["what time is it", "what time is it?"] },
    { fr: "Elle aime lire", en: ["she likes reading", "she likes to read"] },
    { fr: "Nous allons à l'école", en: ["we go to school", "we are going to school"] },
    { fr: "Il a un chat noir", en: ["he has a black cat"] },
    { fr: "C'est mon anniversaire", en: ["it's my birthday", "it is my birthday"] },
    { fr: "Je suis fatigué", en: ["i am tired", "i'm tired"] },
    { fr: "Elle est très gentille", en: ["she is very kind", "she is very nice"] },
    { fr: "Où habites-tu ?", en: ["where do you live", "where do you live?"] },
    { fr: "J'aime le chocolat", en: ["i like chocolate"] },
  ],
  difficile: [
    { fr: "Je voudrais un café, s'il vous plaît", en: ["i would like a coffee, please", "i would like a coffee please"] },
    { fr: "Il pleut depuis ce matin", en: ["it has been raining since this morning"] },
    { fr: "Mes parents habitent en France", en: ["my parents live in france"] },
    { fr: "Peux-tu m'aider avec mes devoirs ?", en: ["can you help me with my homework", "can you help me with my homework?"] },
    { fr: "Elle a oublié son sac à l'école", en: ["she forgot her bag at school"] },
    { fr: "Nous partons en vacances demain", en: ["we are leaving on vacation tomorrow", "we leave for vacation tomorrow"] },
    { fr: "Il est plus grand que son frère", en: ["he is taller than his brother"] },
    { fr: "J'ai vu un bel oiseau dans le jardin", en: ["i saw a beautiful bird in the garden"] },
    { fr: "Le train part dans dix minutes", en: ["the train leaves in ten minutes"] },
    { fr: "Elle chante mieux que moi", en: ["she sings better than me", "she sings better than i do"] },
    { fr: "Nous devons finir ce travail avant demain", en: ["we have to finish this work before tomorrow", "we must finish this work before tomorrow"] },
    { fr: "Ils ont visité un musée intéressant", en: ["they visited an interesting museum"] },
  ],
};

const TIME_PER_LEVEL = { facile: 12, moyen: 18, difficile: 26 };
const SESSION_LENGTH = 8;

let items = [];
let order = [];
let difficulty = "moyen";
let current = 0;
let score = 0;
let validated = false;
let timerTimeout = null;

const difficultyScreen = document.getElementById("difficulty-screen");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const timerFill = document.getElementById("timer-fill");
const promptEl = document.getElementById("problem-text");
const answerInput = document.getElementById("answer-input");
const validateBtn = document.getElementById("validate-btn");
const nextBtn = document.getElementById("next-btn");
const feedbackEl = document.getElementById("feedback");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
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

function normalizePhrase(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:"'’]/g, "")
    .replace(/\s+/g, " ");
}

// item.fr -> item.en[] si l'interface est en français (on apprend
// l'anglais), ou l'inverse si l'interface est en anglais.
function sourceOf(item) {
  return currentLang === "en" ? item.en[0] : item.fr;
}
function acceptedAnswersOf(item) {
  return currentLang === "en" ? [item.fr] : item.en;
}
function canonicalAnswerOf(item) {
  return acceptedAnswersOf(item)[0];
}

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
  items = levels[level];
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
  order = shuffle(items.map((_, i) => i)).slice(0, Math.min(SESSION_LENGTH, items.length));
  current = 0;
  score = 0;
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  renderItem();
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

function renderItem() {
  validated = false;
  answerInput.value = "";
  answerInput.disabled = false;
  feedbackEl.classList.remove("show");
  feedbackEl.innerHTML = "";
  validateBtn.style.display = "inline-block";
  nextBtn.style.display = "none";

  const item = items[order[current]];
  promptEl.textContent = sourceOf(item);
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

  const item = items[order[current]];
  const accepted = acceptedAnswersOf(item);
  const canonical = canonicalAnswerOf(item);
  const typed = normalizePhrase(answerInput.value);
  const isCorrect = accepted.some((a) => normalizePhrase(a) === typed);

  if (window.playSound) playSound(isCorrect ? "correct" : "wrong");
  if (isCorrect) {
    score++;
    if (window.clearMistake) clearMistake("traduction-eclair", sourceOf(item));
  } else {
    if (window.recordMistake) {
      recordMistake("traduction-eclair", difficulty, sourceOf(item), { text: sourceOf(item), answer: canonical });
    }
  }

  const prefix = timedOut ? `${t("timeUp")} ` : "";
  feedbackEl.innerHTML = isCorrect
    ? `${prefix}${t("wellSpotted")} ${canonical} ✓`
    : `${prefix}${t("notQuite")} ${t("exactSentenceWas")} <strong>${canonical}</strong>`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function nextItem() {
  current++;
  if (current >= order.length) {
    showResult();
  } else {
    renderItem();
  }
}

function showResult() {
  clearTimer();
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  if (window.playSound) playSound("success");
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("traduction-eclair", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});
validateBtn.addEventListener("click", () => validate(false));
nextBtn.addEventListener("click", nextItem);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !validated) validate(false);
});

// La langue change le sens de traduction (fr->en devient en->fr) : on
// revient à l'écran de niveau plutôt que de continuer une partie dont le
// sens vient de s'inverser en plein milieu.
document.addEventListener("langchange", backToDifficulty);
