const levels = {
  fr: {
    facile: [
      { sentence: "Le soleil ___ dans le ciel bleu.", options: ["brille", "brillent", "brillé"], correct: 0, explanation: "Sujet singulier « le soleil » → verbe au singulier : brille." },
      { sentence: "Les enfants ___ dans la cour de récréation.", options: ["joue", "jouent", "joues"], correct: 1, explanation: "Sujet pluriel « les enfants » → verbe au pluriel : jouent." },
      { sentence: "Nous ___ très contents de te voir.", options: ["sommes", "somme", "êtes"], correct: 0, explanation: "Avec « nous », le verbe être se conjugue « sommes »." },
      { sentence: "Elle ___ ses devoirs avant le dîner.", options: ["fais", "fait", "font"], correct: 1, explanation: "Sujet « elle » (3e personne du singulier) → fait." },
      { sentence: "Mes parents ___ au marché tous les samedis.", options: ["vont", "va", "allons"], correct: 0, explanation: "Sujet pluriel « mes parents » → vont." },
      { sentence: "Tu ___ beaucoup de progrès en mathématiques.", options: ["fait", "fais", "faites"], correct: 1, explanation: "Avec « tu », le verbe faire se conjugue « fais »." },
      { sentence: "Le chien ___ après la balle dans le jardin.", options: ["court", "courent", "courez"], correct: 0, explanation: "Sujet singulier « le chien » → court." },
      { sentence: "Vous ___ bien parlé pendant la réunion.", options: ["avez", "avons", "ont"], correct: 0, explanation: "Avec « vous », l'auxiliaire avoir se conjugue « avez »." },
      { sentence: "Les oiseaux ___ vers le sud en hiver.", options: ["part", "partent", "partez"], correct: 1, explanation: "Sujet pluriel « les oiseaux » → partent." },
      { sentence: "Je ___ une pomme chaque matin.", options: ["mange", "manges", "mangeons"], correct: 0, explanation: "Avec « je », le verbe se conjugue « mange »." },
    ],
    moyen: [
      { sentence: "Il a oublié ___ clés sur la table.", options: ["ses", "ces", "c'est"], correct: 0, explanation: "« ses » indique la possession (les clés à lui) ; « ces » désigne, « c'est » est une contraction." },
      { sentence: "___ enfants jouent dans le jardin depuis ce matin.", options: ["Ses", "Ces", "C'est"], correct: 1, explanation: "« Ces » est un démonstratif : ces enfants-là." },
      { sentence: "Nous irons à la plage ___ il fait beau.", options: ["quand", "quant", "qu'en"], correct: 0, explanation: "« quand » indique le temps." },
      { sentence: "Elle a répondu ___ toutes les questions.", options: ["à", "a", "as"], correct: 0, explanation: "« à » est une préposition ; « a » est le verbe avoir." },
      { sentence: "___ que tu sois fatigué, il faut continuer.", options: ["Bien", "Malgré", "Quoique"], correct: 2, explanation: "« Quoique » signifie « bien que », suivi du subjonctif." },
      { sentence: "Ils ont ___ leurs valises avant de partir.", options: ["préparer", "préparé", "préparés"], correct: 1, explanation: "Après l'auxiliaire avoir, le participe passé reste invariable ici : préparé." },
      { sentence: "Je pense ___ il a raison sur ce point.", options: ["que", "qu'", "qui"], correct: 0, explanation: "« que » introduit une proposition complétive après « penser »." },
      { sentence: "Le magasin est fermé ___ dimanche.", options: ["le", "les", "la"], correct: 0, explanation: "« le dimanche » (habitude récurrente) prend l'article défini singulier." },
      { sentence: "Elle a ___ la même erreur deux fois.", options: ["fait", "fais", "faites"], correct: 0, explanation: "Participe passé du verbe faire avec avoir : fait (invariable ici)." },
      { sentence: "Nous nous sommes ___ tôt ce matin.", options: ["levé", "levés", "levée"], correct: 1, explanation: "Avec « nous » (masculin pluriel), le participe passé pronominal s'accorde : levés." },
    ],
    difficile: [
      { sentence: "Bien qu'il ___ tard, elle a continué à travailler.", options: ["est", "soit", "était"], correct: 1, explanation: "« Bien que » est suivi du subjonctif : soit." },
      { sentence: "C'est le meilleur film ___ j'aie jamais vu.", options: ["que", "dont", "qui"], correct: 0, explanation: "COD du verbe voir → pronom relatif « que »." },
      { sentence: "Si j'___ su, je ne serais pas venu.", options: ["avais", "aie", "aurais"], correct: 0, explanation: "Après « si » dans une hypothèse au passé, on utilise le plus-que-parfait : avais su." },
      { sentence: "Voici la maison ___ je rêve depuis toujours.", options: ["que", "dont", "où"], correct: 1, explanation: "On dit « rêver de quelque chose », donc le pronom relatif est « dont »." },
      { sentence: "Il se peut qu'elle ___ raison après tout.", options: ["a", "ait", "aura"], correct: 1, explanation: "Après « il se peut que », on utilise le subjonctif : ait." },
      { sentence: "Les enfants, ___ les parents étaient absents, sont restés sages.", options: ["que", "dont", "qui"], correct: 1, explanation: "Possession → « dont » (les parents des enfants)." },
      { sentence: "Plus il ___ d'efforts, plus il progresse.", options: ["fait", "fasse", "faisait"], correct: 0, explanation: "Dans une comparaison proportionnelle avec « plus... plus », on utilise l'indicatif : fait." },
      { sentence: "Il est essentiel que tu ___ à l'heure demain.", options: ["es", "sois", "seras"], correct: 1, explanation: "Après « il est essentiel que », le subjonctif est requis : sois." },
    ],
  },
  en: {
    facile: [
      { sentence: "The sun ___ in the blue sky.", options: ["shines", "shine", "shining"], correct: 0, explanation: "Singular subject 'the sun' takes -s in the present simple: shines." },
      { sentence: "The children ___ in the playground.", options: ["play", "plays", "played"], correct: 0, explanation: "Plural subject 'children' takes the base form: play." },
      { sentence: "We ___ very happy to see you.", options: ["are", "is", "am"], correct: 0, explanation: "With 'we', use 'are'." },
      { sentence: "She ___ her homework before dinner.", options: ["do", "does", "doing"], correct: 1, explanation: "Third person singular 'she' takes -s: does." },
      { sentence: "My parents ___ to the market every Saturday.", options: ["go", "goes", "going"], correct: 0, explanation: "Plural subject 'my parents' takes the base form: go." },
      { sentence: "You ___ a lot of progress in math.", options: ["make", "makes", "made"], correct: 0, explanation: "With 'you', use the base form: make." },
      { sentence: "The dog ___ after the ball in the garden.", options: ["run", "runs", "running"], correct: 1, explanation: "Singular subject 'the dog' takes -s: runs." },
      { sentence: "You ___ clearly during meetings.", options: ["speak", "speaks", "spoken"], correct: 0, explanation: "With 'you', use the base form: speak." },
      { sentence: "The birds ___ south in winter.", options: ["fly", "flies", "flown"], correct: 0, explanation: "Plural subject 'the birds' takes the base form: fly." },
      { sentence: "I ___ an apple every morning.", options: ["eat", "eats", "eaten"], correct: 0, explanation: "With 'I', use the base form: eat." },
    ],
    moyen: [
      { sentence: "He forgot ___ keys on the table.", options: ["his", "this", "it's"], correct: 0, explanation: "'His' shows possession." },
      { sentence: "___ children have been playing in the garden since this morning.", options: ["This", "These", "It's"], correct: 1, explanation: "'These' is a plural demonstrative: these children." },
      { sentence: "We'll go to the beach ___ the weather is nice.", options: ["when", "went", "win"], correct: 0, explanation: "'When' introduces a time clause." },
      { sentence: "She answered ___ all the questions.", options: ["to", "two", "too"], correct: 0, explanation: "'To' is the preposition needed after 'answer'." },
      { sentence: "___ he is tired, he has to keep going.", options: ["Despite", "Although", "Because"], correct: 1, explanation: "'Although' introduces a contrast clause with a subject and verb." },
      { sentence: "They had ___ their suitcases before leaving.", options: ["pack", "packed", "packing"], correct: 1, explanation: "After the auxiliary 'had', use the past participle: packed." },
      { sentence: "I think ___ he is right about this.", options: ["that", "those", "this"], correct: 0, explanation: "'That' introduces a subordinate clause after 'think'." },
      { sentence: "The shop is closed ___ Sundays.", options: ["on", "in", "at"], correct: 0, explanation: "Use 'on' with days of the week." },
      { sentence: "She has ___ the same mistake twice.", options: ["make", "made", "making"], correct: 1, explanation: "Past participle of 'make' with 'has': made." },
      { sentence: "We ___ up early this morning.", options: ["wake", "woke", "waking"], correct: 1, explanation: "Simple past of 'wake': woke." },
    ],
    difficile: [
      { sentence: "Although it ___ late, she kept working.", options: ["is", "was", "were"], correct: 1, explanation: "Past narrative context needs the past tense: was." },
      { sentence: "This is the best film ___ I have ever seen.", options: ["that", "whose", "where"], correct: 0, explanation: "Object of 'seen' → relative pronoun 'that'." },
      { sentence: "If I ___ known, I wouldn't have come.", options: ["had", "have", "would have"], correct: 0, explanation: "Third conditional needs the past perfect after 'if': had known." },
      { sentence: "It's raining, ___ means we should take an umbrella.", options: ["that", "which", "who"], correct: 1, explanation: "'Which' refers back to the whole previous clause." },
      { sentence: "It's possible that she ___ right after all.", options: ["is", "be", "was"], correct: 0, explanation: "'It's possible that' is typically followed by the indicative in English: is." },
      { sentence: "The children, ___ parents were absent, stayed well-behaved.", options: ["that", "whose", "who"], correct: 1, explanation: "Possession → 'whose' (the children's parents)." },
      { sentence: "The more effort he ___, the more he improves.", options: ["makes", "made", "make"], correct: 0, explanation: "In a proportional comparison 'the more... the more', use the present simple: makes." },
      { sentence: "It's essential that you ___ on time tomorrow.", options: ["are", "be", "were"], correct: 1, explanation: "After 'it's essential that', English uses the subjunctive base form: be." },
    ],
  },
};

const SESSION_LENGTH = 8;

let rounds = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let answered = false;

const difficultyScreen = document.getElementById("difficulty-screen");
const sentenceTextEl = document.getElementById("sentence-text");
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

function chooseDifficulty(level) {
  difficulty = level;
  rounds = levels[currentLang][level];
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
  sentenceTextEl.textContent = data.sentence;

  const optionsList = data.options.map((text, i) => ({ text, isCorrect: i === data.correct }));
  const displayOrder = shuffle(optionsList);

  choicesEl.innerHTML = "";
  displayOrder.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.style.textAlign = "center";
    btn.textContent = opt.text;
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

  if (isCorrect) score++;

  feedbackEl.innerHTML = `${isCorrect ? t("wellSpotted") : t("notQuite")} ${explanation}`;
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
  if (window.saveScore) window.saveScore("texte-a-trous", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

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
