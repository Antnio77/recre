const levels = {
  fr: {
    facile: [
      "Le chat dort sur le lit.",
      "J'aime manger des fraises.",
      "Il fait beau aujourd'hui.",
      "Mon frère joue au ballon.",
      "Nous allons à la piscine.",
      "Elle a un joli sac bleu.",
      "Mon papa lit le journal.",
      "La lune brille la nuit.",
      "Les enfants aiment les vacances.",
      "Elle porte un chapeau jaune.",
      "Le poisson nage dans l'eau.",
      "Nous mangeons des pâtes ce soir.",
    ],
    moyen: [
      "Le chat noir dort sur le canapé.",
      "Nous avons acheté deux kilos de pommes.",
      "Ces enfants sont sages et polis.",
      "Il a mangé tout son repas rapidement.",
      "Les vacances d'été commencent bientôt.",
      "Mon voisin a un chien très fidèle.",
      "Leur maison est grande et lumineuse.",
      "Elle porte une robe bleue magnifique.",
      "Le professeur explique la leçon avec patience.",
      "Ils ont visité un beau château médiéval.",
      "La rivière traverse toute la vallée verdoyante.",
      "Mes parents préparent un délicieux gâteau au chocolat.",
      "Le magasin ferme ses portes à dix-huit heures.",
      "Cette histoire raconte les aventures d'un jeune explorateur.",
    ],
    difficile: [
      "Bien qu'il fasse froid, les enfants veulent absolument sortir jouer dehors.",
      "Les acquéreurs du bien immobilier ont exigé un délai supplémentaire avant la signature.",
      "Quoiqu'elle soit fatiguée, elle a terminé son travail avant l'échéance prévue.",
      "Le décathlonien s'entraîne quotidiennement malgré une blessure persistante au genou.",
      "Ils se sont aperçus que leurs bagages avaient été égarés à l'aéroport.",
      "La municipalité a inauguré hier un nouveau centre culturel accessible aux personnes handicapées.",
      "Malgré les embouteillages, ils sont arrivés à l'heure prévue pour la réunion.",
      "L'entreprise a annoncé une réduction significative de ses effectifs cette année.",
      "Les scientifiques ont découvert une nouvelle espèce dans les profondeurs de l'océan.",
      "Elle a consacré plusieurs années à l'apprentissage du piano classique.",
      "Les négociations se poursuivent malgré les nombreuses divergences entre les deux parties.",
    ],
  },
  en: {
    facile: [
      "The cat sleeps on the bed.",
      "I like eating apples.",
      "It is sunny today.",
      "My brother plays football.",
      "We are going to the pool.",
      "She has a nice blue bag.",
      "My dad reads the newspaper.",
      "The moon shines at night.",
      "Children love the holidays.",
      "She wears a yellow hat.",
      "The fish swims in the water.",
      "We are eating pasta tonight.",
    ],
    moyen: [
      "The black cat sleeps on the sofa.",
      "We bought two kilos of apples.",
      "These children are polite and kind.",
      "He ate his whole meal quickly.",
      "Summer holidays are starting soon.",
      "My neighbor has a very loyal dog.",
      "Their house is big and bright.",
      "She wears a beautiful blue dress.",
      "The teacher explains the lesson patiently.",
      "They visited a beautiful medieval castle.",
      "The river runs through the whole green valley.",
      "My parents are baking a delicious chocolate cake.",
      "The shop closes its doors at six in the evening.",
      "This story tells the adventures of a young explorer.",
    ],
    difficile: [
      "Although it is cold, the children absolutely want to play outside.",
      "The buyers of the property demanded an extra delay before signing.",
      "Although she was exhausted, she finished her work before the deadline.",
      "The decathlete trains daily despite a persistent knee injury.",
      "They realized their luggage had been lost at the airport.",
      "The city council opened a new cultural center accessible to disabled people.",
      "Despite the traffic jams, they arrived on time for the meeting.",
      "The company announced a significant reduction in its workforce this year.",
      "Scientists discovered a new species in the depths of the ocean.",
      "She devoted several years to learning classical piano.",
      "Negotiations continue despite numerous disagreements between both parties.",
    ],
  },
};

const SESSION_LENGTH = 8;

let sentences = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let validated = false;
let frenchVoice = null;
let englishVoice = null;

const difficultyScreen = document.getElementById("difficulty-screen");
const listenBtn = document.getElementById("listen-btn");
const answerInput = document.getElementById("answer-input");
const validateBtn = document.getElementById("validate-btn");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("dictee-result");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const speechWarning = document.getElementById("speech-warning");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickVoices() {
  const voices = window.speechSynthesis.getVoices();
  frenchVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("fr")) || null;
  englishVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("en")) || null;
}

function initSpeech() {
  if (!("speechSynthesis" in window)) {
    speechWarning.style.display = "block";
    listenBtn.disabled = true;
    return;
  }
  pickVoices();
  window.speechSynthesis.onvoiceschanged = pickVoices;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const isEn = currentLang === "en";
  utter.lang = isEn ? "en-US" : "fr-FR";
  utter.rate = difficulty === "difficile" ? 0.95 : 0.88;
  const voice = isEn ? englishVoice : frenchVoice;
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
  sentences = levels[currentLang][level];
  difficultyScreen.style.display = "none";
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  startGame();
}

function backToDifficulty() {
  window.speechSynthesis && window.speechSynthesis.cancel();
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
  renderSentence();
}

function renderSentence() {
  validated = false;
  answerInput.value = "";
  answerInput.disabled = false;
  resultEl.classList.remove("show");
  resultEl.innerHTML = "";
  validateBtn.style.display = "inline-block";
  nextBtn.style.display = "none";
  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  answerInput.focus();
}

function normalizeWord(w) {
  return w.toLowerCase().replace(/^[.,!?;:"'’()«»]+|[.,!?;:"'’()«»]+$/g, "");
}

function validate() {
  if (validated) return;
  const target = sentences[order[current]];
  const targetWords = target.split(" ");
  const answerWords = answerInput.value.trim().split(/\s+/).filter(Boolean);
  validated = true;
  answerInput.disabled = true;

  let allCorrect = answerWords.length === targetWords.length;
  const html = [];

  const maxLen = Math.max(targetWords.length, answerWords.length);
  for (let i = 0; i < maxLen; i++) {
    const targetWord = targetWords[i];
    const answerWord = answerWords[i];
    if (targetWord === undefined) continue;
    const isMatch = answerWord !== undefined && normalizeWord(answerWord) === normalizeWord(targetWord);
    if (!isMatch) allCorrect = false;
    html.push(
      `<span class="word-btn ${isMatch ? "correct" : "wrong-pick"}" style="cursor:default;">${
        answerWord !== undefined ? answerWord : "…"
      }</span>`
    );
  }

  if (window.playSound) playSound(allCorrect ? "correct" : "wrong");
  if (allCorrect) {
    score++;
    if (window.clearMistake) clearMistake("dictee", target);
  } else {
    if (window.recordMistake) recordMistake("dictee", difficulty, target, { text: target });
  }

  resultEl.innerHTML = `
    <div class="sentence" style="margin-bottom:14px;">${html.join(" ")}</div>
    ${allCorrect ? t("perfectNoMistake") : `${t("exactSentenceWas")} <strong>${target}</strong>`}
  `;
  resultEl.classList.add("show");

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
  if (window.playSound) playSound("success");
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("dictee", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

listenBtn.addEventListener("click", () => speak(sentences[order[current]]));
validateBtn.addEventListener("click", validate);
nextBtn.addEventListener("click", nextSentence);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !validated) validate();
});

initSpeech();

// Changer de langue en cours de partie revient à l'écran de niveau,
// puisque les phrases (et la voix utilisée) changent complètement.
document.addEventListener("langchange", backToDifficulty);
