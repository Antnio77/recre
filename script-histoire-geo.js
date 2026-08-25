const levels = {
  fr: {
    facile: [
      { question: "En quelle année a eu lieu la prise de la Bastille (Révolution française) ?", options: ["1789", "1804", "1715"], correct: 0, explanation: "La prise de la Bastille, le 14 juillet 1789, marque le début de la Révolution française." },
      { question: "Quel est le plus grand océan du monde ?", options: ["L'océan Atlantique", "L'océan Pacifique", "L'océan Indien"], correct: 1, explanation: "L'océan Pacifique est le plus grand et le plus profond des océans." },
      { question: "Quelle est la capitale de la France ?", options: ["Lyon", "Marseille", "Paris"], correct: 2, explanation: "Paris est la capitale de la France depuis des siècles." },
      { question: "Combien de continents compte le découpage généralement enseigné en France ?", options: ["5", "6", "7"], correct: 1, explanation: "Le découpage en 6 continents (Europe, Asie, Afrique, Amérique, Océanie, Antarctique) est celui généralement enseigné en France." },
      { question: "Quel empereur français est couronné en 1804 ?", options: ["Louis XIV", "Napoléon Bonaparte", "Charles de Gaulle"], correct: 1, explanation: "Napoléon Bonaparte se couronne empereur des Français le 2 décembre 1804." },
      { question: "Quel fleuve traverse Paris ?", options: ["La Loire", "La Seine", "Le Rhône"], correct: 1, explanation: "La Seine traverse Paris d'est en ouest." },
      { question: "À quelle période correspond, en gros, le Moyen Âge ?", options: ["Entre l'Antiquité et les Temps modernes (Ve-XVe siècle environ)", "La période préhistorique", "Le XXe siècle"], correct: 0, explanation: "Le Moyen Âge s'étend environ de la chute de l'Empire romain d'Occident (476) à la fin du XVe siècle." },
      { question: "Quel est le plus long fleuve du monde ?", options: ["L'Amazone", "Le Nil", "Le Mississippi"], correct: 1, explanation: "Le Nil, en Afrique, est généralement considéré comme le plus long fleuve du monde (environ 6 650 km)." },
      { question: "Quelle chaîne de montagnes sépare la France de l'Espagne ?", options: ["Les Alpes", "Les Pyrénées", "Le Massif central"], correct: 1, explanation: "Les Pyrénées forment la frontière naturelle entre la France et l'Espagne." },
      { question: "Qui étaient les Gaulois ?", options: ["Les habitants de la Gaule avant la conquête romaine", "Les habitants de l'Égypte antique", "Les premiers rois de France"], correct: 0, explanation: "Les Gaulois étaient les peuples celtes qui habitaient la Gaule (France actuelle) avant sa conquête par les Romains." },
    ],
    moyen: [
      { question: "Quelle est la date de la Déclaration des droits de l'homme et du citoyen ?", options: ["1789", "1848", "1958"], correct: 0, explanation: "La Déclaration des droits de l'homme et du citoyen est adoptée le 26 août 1789." },
      { question: "Quand a eu lieu la Première Guerre mondiale ?", options: ["1914-1918", "1939-1945", "1870-1871"], correct: 0, explanation: "La Première Guerre mondiale s'est déroulée de 1914 à 1918." },
      { question: "Quand a eu lieu la Seconde Guerre mondiale ?", options: ["1914-1918", "1939-1945", "1929-1933"], correct: 1, explanation: "La Seconde Guerre mondiale s'est déroulée de 1939 à 1945." },
      { question: "Qu'est-ce que la Révolution industrielle ?", options: ["La transformation économique liée à la mécanisation, à partir de la fin du XVIIIe siècle", "La révolution de 1789", "L'invention d'Internet"], correct: 0, explanation: "La Révolution industrielle désigne les profondes transformations économiques et sociales liées à la mécanisation, débutées en Angleterre à la fin du XVIIIe siècle." },
      { question: "Quel est le régime politique de la France actuelle ?", options: ["Une monarchie", "Une république", "Un empire"], correct: 1, explanation: "La France est une république depuis 1792 (avec des interruptions), actuellement la Ve République depuis 1958." },
      { question: "Qu'est-ce que la décolonisation ?", options: ["Le processus par lequel les colonies ont accédé à l'indépendance, surtout après 1945", "La conquête de nouveaux territoires par la France", "La construction de l'Union européenne"], correct: 0, explanation: "La décolonisation est le processus, principalement entre 1945 et les années 1960-70, par lequel les colonies ont obtenu leur indépendance." },
      { question: "Quel pays a la plus grande population du monde, au début des années 2020 ?", options: ["Les États-Unis", "L'Inde", "La Russie"], correct: 1, explanation: "L'Inde a dépassé la Chine et est devenue le pays le plus peuplé du monde au début des années 2020." },
      { question: "Qu'appelle-t-on une métropole, en géographie ?", options: ["Une grande ville qui concentre des fonctions de commandement (économiques, politiques, culturelles)", "Un petit village", "Une région agricole"], correct: 0, explanation: "Une métropole est une grande ville qui exerce une influence importante sur son territoire, en concentrant des fonctions de commandement." },
      { question: "Quelle institution française est chargée de faire les lois ?", options: ["Le Parlement (Assemblée nationale et Sénat)", "Le Conseil constitutionnel", "La mairie"], correct: 0, explanation: "En France, le pouvoir législatif appartient au Parlement, composé de l'Assemblée nationale et du Sénat." },
      { question: "Qu'est-ce qu'une énergie renouvelable ?", options: ["Une source d'énergie qui se renouvelle naturellement (solaire, éolien, hydraulique...)", "Le pétrole", "Le charbon"], correct: 0, explanation: "Les énergies renouvelables (solaire, éolienne, hydraulique, etc.) se régénèrent naturellement, contrairement aux énergies fossiles." },
    ],
    difficile: [
      { question: "Que désigne le terme « Guerre froide » ?", options: ["L'affrontement indirect entre les États-Unis et l'URSS de 1947 à 1991", "Un conflit armé direct entre la France et l'Allemagne", "La Première Guerre mondiale"], correct: 0, explanation: "La Guerre froide désigne l'opposition idéologique et géopolitique entre les États-Unis et l'URSS, sans affrontement armé direct, de 1947 à 1991." },
      { question: "Quand l'Union européenne a-t-elle été créée sous ce nom ?", options: ["1957 (traité de Rome)", "1992 (traité de Maastricht)", "1945"], correct: 1, explanation: "L'Union européenne est créée par le traité de Maastricht en 1992 (elle succède à la Communauté économique européenne fondée en 1957)." },
      { question: "Qu'est-ce que la mondialisation ?", options: ["L'intensification des échanges (commerciaux, financiers, culturels) à l'échelle de la planète", "La colonisation de l'Afrique", "La construction de l'Union européenne uniquement"], correct: 0, explanation: "La mondialisation désigne l'accélération et l'intensification des échanges de toute nature à l'échelle mondiale." },
      { question: "Quel événement marque symboliquement la fin de la Guerre froide ?", options: ["La chute du mur de Berlin en 1989", "La chute de l'Empire romain", "Le traité de Versailles"], correct: 0, explanation: "La chute du mur de Berlin, le 9 novembre 1989, est un symbole fort de la fin de la Guerre froide et du bloc soviétique." },
      { question: "Qu'est-ce qu'un espace productif, en géographie ?", options: ["Un territoire aménagé pour produire des biens ou des services (usine, zone agricole, zone touristique...)", "Une réserve naturelle protégée", "Une zone inhabitée"], correct: 0, explanation: "Un espace productif est un territoire organisé pour la production de biens ou de services : industriel, agricole, touristique, etc." },
      { question: "Que signifie le sigle ONU ?", options: ["Organisation des Nations unies", "Organisation nationale unifiée", "Office national de l'urbanisme"], correct: 0, explanation: "L'ONU, Organisation des Nations unies, a été fondée en 1945 pour maintenir la paix et la sécurité internationales." },
      { question: "Qu'est-ce que le développement durable ?", options: ["Un mode de développement qui répond aux besoins présents sans compromettre ceux des générations futures", "La croissance économique la plus rapide possible", "Un synonyme de mondialisation"], correct: 0, explanation: "Le développement durable vise à concilier développement économique, justice sociale et préservation de l'environnement, pour les générations actuelles et futures." },
      { question: "Quel traité met fin à la Première Guerre mondiale ?", options: ["Le traité de Versailles (1919)", "Le traité de Maastricht", "Le traité de Rome"], correct: 0, explanation: "Le traité de Versailles, signé en 1919, met officiellement fin à la Première Guerre mondiale entre l'Allemagne et les Alliés." },
      { question: "Qu'est-ce que la métropolisation ?", options: ["La concentration croissante des populations et des activités dans les grandes métropoles", "La création de nouvelles colonies", "La division d'un pays en régions"], correct: 0, explanation: "La métropolisation désigne le processus de concentration croissante des populations, des activités et des richesses dans les métropoles." },
    ],
  },
  en: {
    facile: [
      { question: "In what year did the storming of the Bastille (French Revolution) take place?", options: ["1789", "1804", "1715"], correct: 0, explanation: "The storming of the Bastille, on July 14, 1789, marks the start of the French Revolution." },
      { question: "What is the largest ocean in the world?", options: ["The Atlantic Ocean", "The Pacific Ocean", "The Indian Ocean"], correct: 1, explanation: "The Pacific Ocean is the largest and deepest of all oceans." },
      { question: "What is the capital of France?", options: ["Lyon", "Marseille", "Paris"], correct: 2, explanation: "Paris has been the capital of France for centuries." },
      { question: "How many continents are there, in the model commonly taught in France?", options: ["5", "6", "7"], correct: 1, explanation: "The 6-continent model (Europe, Asia, Africa, America, Oceania, Antarctica) is commonly taught in France." },
      { question: "Which French emperor was crowned in 1804?", options: ["Louis XIV", "Napoleon Bonaparte", "Charles de Gaulle"], correct: 1, explanation: "Napoleon Bonaparte crowned himself Emperor of the French on December 2, 1804." },
      { question: "Which river runs through Paris?", options: ["The Loire", "The Seine", "The Rhône"], correct: 1, explanation: "The Seine runs through Paris from east to west." },
      { question: "Roughly what period is the Middle Ages?", options: ["Between Antiquity and Early Modern times (roughly 5th to 15th century)", "The prehistoric period", "The 20th century"], correct: 0, explanation: "The Middle Ages span roughly from the fall of the Western Roman Empire (476) to the end of the 15th century." },
      { question: "What is the longest river in the world?", options: ["The Amazon", "The Nile", "The Mississippi"], correct: 1, explanation: "The Nile, in Africa, is generally considered the longest river in the world (about 6,650 km)." },
      { question: "Which mountain range separates France from Spain?", options: ["The Alps", "The Pyrenees", "The Massif Central"], correct: 1, explanation: "The Pyrenees form the natural border between France and Spain." },
      { question: "Who were the Gauls?", options: ["The people who lived in Gaul before the Roman conquest", "The people of ancient Egypt", "The first kings of France"], correct: 0, explanation: "The Gauls were the Celtic peoples who lived in Gaul (present-day France) before it was conquered by Rome." },
    ],
    moyen: [
      { question: "What is the date of the Declaration of the Rights of Man and of the Citizen?", options: ["1789", "1848", "1958"], correct: 0, explanation: "The Declaration of the Rights of Man and of the Citizen was adopted on August 26, 1789." },
      { question: "When did World War I take place?", options: ["1914-1918", "1939-1945", "1870-1871"], correct: 0, explanation: "World War I took place from 1914 to 1918." },
      { question: "When did World War II take place?", options: ["1914-1918", "1939-1945", "1929-1933"], correct: 1, explanation: "World War II took place from 1939 to 1945." },
      { question: "What was the Industrial Revolution?", options: ["The economic transformation driven by mechanization, starting in the late 18th century", "The 1789 revolution", "The invention of the internet"], correct: 0, explanation: "The Industrial Revolution refers to the deep economic and social changes driven by mechanization, starting in England in the late 18th century." },
      { question: "What is the current political system of France?", options: ["A monarchy", "A republic", "An empire"], correct: 1, explanation: "France has been a republic since 1792 (with interruptions), currently the Fifth Republic since 1958." },
      { question: "What is decolonization?", options: ["The process by which colonies gained independence, mostly after 1945", "France's conquest of new territories", "The building of the European Union"], correct: 0, explanation: "Decolonization is the process, mainly between 1945 and the 1960s-70s, by which colonies gained independence." },
      { question: "Which country has the largest population in the world, in the early 2020s?", options: ["The United States", "India", "Russia"], correct: 1, explanation: "India overtook China to become the world's most populous country in the early 2020s." },
      { question: "What is a metropolis, in geography?", options: ["A large city that concentrates command functions (economic, political, cultural)", "A small village", "A farming region"], correct: 0, explanation: "A metropolis is a large city that has a major influence on its territory by concentrating command functions." },
      { question: "Which French institution is in charge of making laws?", options: ["Parliament (National Assembly and Senate)", "The Constitutional Council", "The town hall"], correct: 0, explanation: "In France, legislative power belongs to Parliament, made up of the National Assembly and the Senate." },
      { question: "What is a renewable energy source?", options: ["An energy source that naturally replenishes itself (solar, wind, hydro...)", "Oil", "Coal"], correct: 0, explanation: "Renewable energy sources (solar, wind, hydro, etc.) naturally replenish themselves, unlike fossil fuels." },
    ],
    difficile: [
      { question: "What does the term \"Cold War\" refer to?", options: ["The indirect confrontation between the US and the USSR from 1947 to 1991", "A direct armed conflict between France and Germany", "World War I"], correct: 0, explanation: "The Cold War refers to the ideological and geopolitical opposition between the US and the USSR, without direct armed conflict, from 1947 to 1991." },
      { question: "When was the European Union created under that name?", options: ["1957 (Treaty of Rome)", "1992 (Maastricht Treaty)", "1945"], correct: 1, explanation: "The European Union was created by the Maastricht Treaty in 1992 (succeeding the European Economic Community founded in 1957)." },
      { question: "What is globalization?", options: ["The intensification of trade, financial and cultural exchanges worldwide", "The colonization of Africa", "The building of the European Union only"], correct: 0, explanation: "Globalization refers to the acceleration and intensification of exchanges of all kinds on a global scale." },
      { question: "What event symbolically marks the end of the Cold War?", options: ["The fall of the Berlin Wall in 1989", "The fall of the Roman Empire", "The Treaty of Versailles"], correct: 0, explanation: "The fall of the Berlin Wall on November 9, 1989, is a powerful symbol of the end of the Cold War and the Soviet bloc." },
      { question: "What is a productive space, in geography?", options: ["A territory organized to produce goods or services (factory, farmland, tourist area...)", "A protected nature reserve", "An uninhabited area"], correct: 0, explanation: "A productive space is a territory organized for the production of goods or services: industrial, agricultural, touristic, etc." },
      { question: "What does the UN stand for?", options: ["United Nations", "Unified National Organization", "National Urban Office"], correct: 0, explanation: "The UN, United Nations, was founded in 1945 to maintain international peace and security." },
      { question: "What is sustainable development?", options: ["A way of developing that meets present needs without compromising those of future generations", "The fastest possible economic growth", "A synonym for globalization"], correct: 0, explanation: "Sustainable development aims to reconcile economic development, social justice, and environmental protection for current and future generations." },
      { question: "Which treaty ended World War I?", options: ["The Treaty of Versailles (1919)", "The Maastricht Treaty", "The Treaty of Rome"], correct: 0, explanation: "The Treaty of Versailles, signed in 1919, officially ended World War I between Germany and the Allies." },
      { question: "What is metropolization?", options: ["The growing concentration of population and activity in major metropolises", "The creation of new colonies", "The division of a country into regions"], correct: 0, explanation: "Metropolization refers to the growing concentration of population, activity and wealth in metropolitan areas." },
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
const questionTextEl = document.getElementById("question-text");
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
  questionTextEl.textContent = data.question;

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
  if (isCorrect) {
    score++;
    if (window.clearMistake) clearMistake("histoire-geo", data.question);
  } else {
    if (window.recordMistake) recordMistake("histoire-geo", difficulty, data.question, data);
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
  if (window.saveScore) window.saveScore("histoire-geo", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

document.addEventListener("langchange", backToDifficulty);
