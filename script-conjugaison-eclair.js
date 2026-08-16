const levels = {
  fr: {
    facile: [
      { text: "Je (chanter, présent)", answer: "chante" },
      { text: "Tu (manger, présent)", answer: "manges" },
      { text: "Il (parler, présent)", answer: "parle" },
      { text: "Nous (jouer, présent)", answer: "jouons" },
      { text: "Vous (regarder, présent)", answer: "regardez" },
      { text: "Ils (aimer, présent)", answer: "aiment" },
      { text: "Je (danser, présent)", answer: "danse" },
      { text: "Tu (donner, présent)", answer: "donnes" },
      { text: "Elle (arriver, présent)", answer: "arrive" },
      { text: "Nous (marcher, présent)", answer: "marchons" },
    ],
    moyen: [
      { text: "Je (finir, présent)", answer: "finis" },
      { text: "Tu (choisir, présent)", answer: "choisis" },
      { text: "Il (vendre, présent)", answer: "vend" },
      { text: "Il (manger, passé composé)", answer: "a mangé" },
      { text: "Il (parler, passé composé)", answer: "a parlé" },
      { text: "Nous (finir, présent)", answer: "finissons" },
      { text: "Vous (vendre, présent)", answer: "vendez" },
      { text: "Il (donner, passé composé)", answer: "a donné" },
      { text: "Elle (chanter, passé composé)", answer: "a chanté" },
      { text: "Ils (jouer, passé composé)", answer: "ont joué" },
    ],
    difficile: [
      { text: "Il (être, présent)", answer: "est" },
      { text: "Il (avoir, présent)", answer: "a" },
      { text: "Il (aller, présent)", answer: "va" },
      { text: "Il (faire, présent)", answer: "fait" },
      { text: "Il (pouvoir, présent)", answer: "peut" },
      { text: "Il (vouloir, présent)", answer: "veut" },
      { text: "Il (aller, passé composé)", answer: "est allé" },
      { text: "Il (venir, présent)", answer: "vient" },
    ],
  },
  en: {
    facile: [
      { text: "He (to sing, present)", answer: "sings" },
      { text: "She (to play, present)", answer: "plays" },
      { text: "I (to eat, present)", answer: "eat" },
      { text: "They (to walk, present)", answer: "walk" },
      { text: "We (to dance, present)", answer: "dance" },
      { text: "He (to jump, present)", answer: "jumps" },
      { text: "She (to talk, present)", answer: "talks" },
      { text: "You (to watch, present)", answer: "watch" },
      { text: "He (to help, present)", answer: "helps" },
      { text: "They (to listen, present)", answer: "listen" },
    ],
    moyen: [
      { text: "He (to walk, past)", answer: "walked" },
      { text: "She (to play, past)", answer: "played" },
      { text: "I (to watch, past)", answer: "watched" },
      { text: "He (to go, past)", answer: "went" },
      { text: "She (to eat, past)", answer: "ate" },
      { text: "They (to have, past)", answer: "had" },
      { text: "He (to see, past)", answer: "saw" },
      { text: "We (to make, past)", answer: "made" },
      { text: "He (to take, past)", answer: "took" },
      { text: "She (to give, past)", answer: "gave" },
    ],
    difficile: [
      { text: "He (to write, present perfect: has ___)", answer: "written" },
      { text: "She (to break, present perfect: has ___)", answer: "broken" },
      { text: "They (to speak, present perfect: have ___)", answer: "spoken" },
      { text: "He (to choose, present perfect: has ___)", answer: "chosen" },
      { text: "She (to begin, present perfect: has ___)", answer: "begun" },
      { text: "He (to know, present perfect: has ___)", answer: "known" },
      { text: "They (to fly, present perfect: have ___)", answer: "flown" },
      { text: "He (to drive, present perfect: has ___)", answer: "driven" },
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
const loginPrompt = document.getElementById("login-prompt");
const premiumLocked = document.getElementById("premium-locked");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeAnswer(w) {
  return w.toLowerCase().trim().replace(/\s+/g, " ");
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
  const isCorrect = normalizeAnswer(answerInput.value) === normalizeAnswer(data.answer);

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
  if (window.saveScore) window.saveScore("conjugaison-eclair", difficulty, score, order.length);
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
