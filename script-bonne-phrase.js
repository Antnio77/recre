const levels = {
  fr: {
    facile: [
      { options: ["Il c'est levé tôt.", "Il s'est levé tôt."], correct: 1, explanation: "« s'est » vient du verbe pronominal « se lever » ; « c'est » est la contraction de « cela est »." },
      { options: ["Elle a très faim.", "Elle a très fin."], correct: 0, explanation: "« faim » (envie de manger) ne s'écrit pas comme l'adjectif « fin »." },
      { options: ["Ils sont partie hier.", "Ils sont partis hier."], correct: 1, explanation: "Avec « ils », le participe passé « parti » s'accorde au masculin pluriel : partis." },
      { options: ["Je vais au parc.", "Je vais o parc."], correct: 0, explanation: "« au » est la contraction de « à le » ; « o » seul n'existe pas comme mot." },
      { options: ["Nous avons manger.", "Nous avons mangé."], correct: 1, explanation: "Après l'auxiliaire « avoir », on utilise le participe passé « mangé », pas l'infinitif « manger »." },
      { options: ["Le chat et noir.", "Le chat est noir."], correct: 1, explanation: "« est » est le verbe être ; « et » relie deux mots ou groupes de mots." },
      { options: ["Il mange des pomme.", "Il mange des pommes."], correct: 1, explanation: "Après un déterminant pluriel comme « des », le nom se met au pluriel : pommes." },
      { options: ["Elles sont aller au marché.", "Elles sont allées au marché."], correct: 1, explanation: "Avec « elles », le participe passé s'accorde au féminin pluriel : allées." },
      { options: ["Je c'est perdu en route.", "Je me suis perdu en route."], correct: 1, explanation: "On dit « je me suis perdu » (verbe pronominal « se perdre »), pas « je c'est »." },
      { options: ["Les enfant sont sage.", "Les enfants sont sages."], correct: 1, explanation: "« enfant » et « sage » prennent tous les deux un -s au pluriel." },
    ],
    moyen: [
      { options: ["Ces enfants sont sages.", "Ses enfants sont sages.", "C'est enfants sont sages."], correct: 0, explanation: "« Ces » est un adjectif démonstratif (ces enfants-là). « Ses » indique une possession, « c'est » ne peut pas précéder un nom pluriel." },
      { options: ["Leur maison est grande.", "Leurs maison est grande."], correct: 0, explanation: "« Leur » reste invariable devant un nom singulier : leur maison (une seule maison)." },
      { options: ["Quelle heure es-tu arrivé ?", "Quelle heure est-tu arrivé ?", "À quelle heure es-tu arrivé ?"], correct: 2, explanation: "Il manque la préposition « à » pour introduire l'heure : à quelle heure." },
      { options: ["Il a mangé à midi.", "Il à mangé a midi."], correct: 0, explanation: "« a » (sans accent) est le verbe avoir ; « à » (avec accent) est une préposition de lieu ou de temps." },
      { options: ["Ils ont faim.", "Ils on faim."], correct: 0, explanation: "« ont » est le verbe avoir conjugué ; « on » est un pronom (on mange)." },
      { options: ["Quand il pleut, je reste chez moi.", "Quant il pleut, je reste chez moi."], correct: 0, explanation: "« Quand » indique le temps ; « quant à » sert à introduire un sujet et s'utilise toujours avec « à »." },
      { options: ["Malgré qu'il pleuve, nous sortons.", "Bien qu'il pleuve, nous sortons."], correct: 1, explanation: "« Malgré que » est une tournure critiquée ; on préfère « bien que » suivi du subjonctif." },
      { options: ["Je me rappelle de ce jour-là.", "Je me souviens de ce jour-là.", "Je me rappelle ce jour-là."], correct: 2, explanation: "« Se rappeler » ne prend pas de « de » (on rappelle quelque chose), contrairement à « se souvenir de »." },
      { options: ["Après qu'il soit parti, nous avons fermé.", "Après qu'il est parti, nous avons fermé."], correct: 1, explanation: "« Après que » est suivi de l'indicatif, pas du subjonctif, contrairement à « avant que »." },
      { options: ["Il est plus grand que moi.", "Il est plus grand que je."], correct: 0, explanation: "Après « que » dans une comparaison, on utilise le pronom tonique « moi », pas « je »." },
    ],
    difficile: [
      { options: ["Quoiqu'il soit riche, il reste humble.", "Quoi qu'il soit riche, il reste humble."], correct: 0, explanation: "« Quoique » (en un mot) signifie « bien que » ; « quoi que » (en deux mots) signifie « peu importe ce que »." },
      { options: ["Il faut davantage de temps.", "Il faut d'avantage de temps."], correct: 0, explanation: "« Davantage » (plus) s'écrit en un mot ; « avantage » (bénéfice) est un nom précédé d'un article." },
      { options: ["Il est censé arriver à midi.", "Il est sensé arriver à midi."], correct: 0, explanation: "« Censé » signifie « supposé » ; « sensé » signifie « qui a du bon sens »." },
      { options: ["Je préfère celui-ci plutôt que celui-là.", "Je préfère celui-ci plus tôt que celui-là."], correct: 0, explanation: "« Plutôt » exprime une préférence ; « plus tôt » (deux mots) exprime le temps, le contraire de « plus tard »." },
      { options: ["Il faut le faire raisonner.", "Il faut le faire résonner."], correct: 0, explanation: "« Raisonner » quelqu'un, c'est le convaincre par la logique ; « résonner » concerne un son qui se répercute." },
      { options: ["N'oublie pas d'apporter ton parapluie.", "N'oublie pas d'amener ton parapluie."], correct: 0, explanation: "On « apporte » un objet et on « amène » (ou emmène) une personne ou un animal." },
      { options: ["Il s'agit de deux évènements distincts.", "Il s'agit de deux évènement distinct."], correct: 0, explanation: "Après « il s'agit de », le nom qui suit s'accorde normalement au pluriel : évènements distincts." },
      { options: ["Ce sont les résultats que j'ai attendu.", "Ce sont les résultats que j'ai attendus."], correct: 1, explanation: "Avec l'auxiliaire avoir, le participe passé s'accorde avec le COD placé avant : « que » (résultats) → attendus." },
      { options: ["Quelle que soit la décision, nous l'accepterons.", "Quelque soit la décision, nous l'accepterons."], correct: 0, explanation: "« Quelle que » (en deux mots) s'accorde avec le sujet quand il est suivi d'un verbe être ; « quelque » (un mot) modifie un nom." },
      { options: ["Voici les livres dont j'ai besoin.", "Voici les livres que j'ai besoin."], correct: 0, explanation: "On dit « avoir besoin de quelque chose », donc le pronom relatif correct est « dont », pas « que »." },
    ],
  },
  en: {
    facile: [
      { options: ["He don't like coffee.", "He doesn't like coffee."], correct: 1, explanation: "With he/she/it, the verb needs an -s: doesn't, not don't." },
      { options: ["She has a big smile.", "She have a big smile."], correct: 0, explanation: "After she, use 'has', not 'have'." },
      { options: ["They was happy.", "They were happy."], correct: 1, explanation: "With 'they', the past of 'be' is 'were', not 'was'." },
      { options: ["I goed to the park.", "I went to the park."], correct: 1, explanation: "The past tense of 'go' is irregular: went, not goed." },
      { options: ["The dogs is barking.", "The dogs are barking."], correct: 1, explanation: "With a plural subject (dogs), use 'are', not 'is'." },
      { options: ["She can sings well.", "She can sing well."], correct: 1, explanation: "After 'can', use the base form of the verb: sing, not sings." },
      { options: ["I have two dogs.", "I have two dog."], correct: 0, explanation: "Plural nouns after numbers greater than one need an -s: two dogs." },
      { options: ["She go to the park.", "She goes to the park."], correct: 1, explanation: "With he/she/it, the verb takes an -s in the present simple: goes." },
      { options: ["They is my friends.", "They are my friends."], correct: 1, explanation: "With 'they', use 'are', not 'is'." },
      { options: ["I seen that movie already.", "I've seen that movie already."], correct: 1, explanation: "The present perfect needs 'have/has' before the past participle: I've seen, not I seen." },
    ],
    moyen: [
      { options: ["Its raining again.", "It's raining again."], correct: 1, explanation: "'It's' is the contraction of 'it is'; 'its' shows possession." },
      { options: ["Your the best!", "You're the best!"], correct: 1, explanation: "'You're' is the contraction of 'you are'; 'your' shows possession." },
      { options: ["They're car broke down.", "Their car broke down.", "There car broke down."], correct: 1, explanation: "'Their' shows possession; 'they're' means 'they are'; 'there' refers to a place." },
      { options: ["I should of asked first.", "I should have asked first."], correct: 1, explanation: "'Should have' is correct; 'should of' comes from mishearing the contraction 'should've'." },
      { options: ["Who's book is this?", "Whose book is this?"], correct: 1, explanation: "'Whose' shows possession; 'who's' means 'who is'." },
      { options: ["The weather effects my mood.", "The weather affects my mood."], correct: 1, explanation: "'Affect' is usually a verb (to influence); 'effect' is usually a noun (a result)." },
      { options: ["Although it was raining, we went out.", "Despite it was raining, we went out."], correct: 0, explanation: "'Despite' is followed by a noun or -ing form, not a full clause; 'although' works with a full clause." },
      { options: ["I look forward to see you.", "I look forward to seeing you."], correct: 1, explanation: "'Look forward to' is followed by a gerund (-ing form), not the base infinitive." },
      { options: ["He is taller than me.", "He is taller than I."], correct: 0, explanation: "In everyday English, the object pronoun 'me' is standard after 'than' in comparisons." },
      { options: ["If I was you, I would apologize.", "If I were you, I would apologize."], correct: 1, explanation: "In hypothetical 'if' clauses, use 'were' for all subjects, not 'was'." },
    ],
    difficile: [
      { options: ["I could care less about it.", "I couldn't care less about it."], correct: 1, explanation: "The standard, logical form is 'couldn't care less' — meaning your level of care is already at zero." },
      { options: ["She was disinterested in the outcome, so she paid close attention out of professionalism.", "She was uninterested in the outcome, so she paid close attention out of professionalism."], correct: 1, explanation: "'Disinterested' means impartial; 'uninterested' means not interested. The meaning here calls for 'uninterested'." },
      { options: ["The data suggests the theory is flawed.", "The data suggest the theory is flawed."], correct: 1, explanation: "'Data' is technically the plural of 'datum', so in formal writing it takes a plural verb: suggest." },
      { options: ["The speaker implied that budgets would be cut, and the staff inferred layoffs were coming.", "The speaker inferred that budgets would be cut, and the staff implied layoffs were coming."], correct: 0, explanation: "A speaker 'implies' (suggests indirectly); the listener 'infers' (deduces from what was said)." },
      { options: ["Less people attended this year.", "Fewer people attended this year."], correct: 1, explanation: "Use 'fewer' for countable nouns (people) and 'less' for uncountable nouns (time, water)." },
      { options: ["Between you and I, the plan will fail.", "Between you and me, the plan will fail."], correct: 1, explanation: "After a preposition like 'between', use the object pronoun 'me', not 'I'." },
      { options: ["The jury have reached their verdict.", "The jury has reached its verdict."], correct: 1, explanation: "In American English, collective nouns like 'jury' typically take a singular verb and pronoun: has/its." },
      { options: ["Neither of the answers are correct.", "Neither of the answers is correct."], correct: 1, explanation: "'Neither' is grammatically singular, so it takes a singular verb: is." },
      { options: ["She is one of the students who has finished.", "She is one of the students who have finished."], correct: 1, explanation: "The relative pronoun 'who' refers to 'students' (plural), so the verb should be plural: have." },
      { options: ["It is I who am responsible.", "It is I who is responsible.", "It is me who's responsible."], correct: 0, explanation: "In formal English, 'who' agrees with 'I', so the verb must also be first person: who am." },
    ],
  },
};

const SESSION_LENGTH = 6;

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
  const optionsList = data.options.map((text, i) => ({ text, isCorrect: i === data.correct }));
  const displayOrder = shuffle(optionsList);

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
  const itemKey = data.options.join(" / ");
  if (isCorrect) {
    score++;
    if (window.clearMistake) clearMistake("bonne-phrase", itemKey);
  } else {
    if (window.recordMistake) recordMistake("bonne-phrase", difficulty, itemKey, data);
  }

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
  if (window.saveScore) window.saveScore("bonne-phrase", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

document.addEventListener("langchange", backToDifficulty);
