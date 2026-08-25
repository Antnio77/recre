// Carte muette : cliquer sur le bon pays sur une carte d'Europe interactive.
// La carte (map-europe.svg) est un fichier SVG externe chargé à la demande
// (au premier choix de niveau) — chaque pays est un <g class="map-country"
// id="XX"> où XX est son code ISO 3166-1 alpha-2. Voir THIRD-PARTY-LICENSES.md
// pour la source des tracés géographiques.
const COUNTRY_NAMES = {
  fr: {
    FR: "France", DE: "Allemagne", ES: "Espagne", IT: "Italie", GB: "Royaume-Uni",
    PT: "Portugal", PL: "Pologne", SE: "Suède", NO: "Norvège", GR: "Grèce",
    IE: "Irlande", UA: "Ukraine",
    NL: "Pays-Bas", BE: "Belgique", CH: "Suisse", AT: "Autriche", DK: "Danemark",
    HU: "Hongrie", RO: "Roumanie", BG: "Bulgarie", CZ: "Tchéquie", HR: "Croatie",
    IS: "Islande", FI: "Finlande", BY: "Biélorussie", RS: "Serbie",
    SK: "Slovaquie", SI: "Slovénie", BA: "Bosnie-Herzégovine", ME: "Monténégro",
    MK: "Macédoine du Nord", AL: "Albanie", XK: "Kosovo", MD: "Moldavie",
    EE: "Estonie", LV: "Lettonie", LT: "Lituanie", LU: "Luxembourg", MT: "Malte", CY: "Chypre",
  },
  en: {
    FR: "France", DE: "Germany", ES: "Spain", IT: "Italy", GB: "United Kingdom",
    PT: "Portugal", PL: "Poland", SE: "Sweden", NO: "Norway", GR: "Greece",
    IE: "Ireland", UA: "Ukraine",
    NL: "Netherlands", BE: "Belgium", CH: "Switzerland", AT: "Austria", DK: "Denmark",
    HU: "Hungary", RO: "Romania", BG: "Bulgaria", CZ: "Czechia", HR: "Croatia",
    IS: "Iceland", FI: "Finland", BY: "Belarus", RS: "Serbia",
    SK: "Slovakia", SI: "Slovenia", BA: "Bosnia and Herzegovina", ME: "Montenegro",
    MK: "North Macedonia", AL: "Albania", XK: "Kosovo", MD: "Moldova",
    EE: "Estonia", LV: "Latvia", LT: "Lithuania", LU: "Luxembourg", MT: "Malta", CY: "Cyprus",
  },
};

const levels = {
  facile: ["FR", "DE", "ES", "IT", "GB", "PT", "PL", "SE", "NO", "GR", "IE", "UA"],
  moyen: ["NL", "BE", "CH", "AT", "DK", "HU", "RO", "BG", "CZ", "HR", "IS", "FI", "BY", "RS"],
  difficile: ["SK", "SI", "BA", "ME", "MK", "AL", "XK", "MD", "EE", "LV", "LT", "LU", "MT", "CY"],
};

const SESSION_LENGTH = 8;

let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let answered = false;
let mapLoaded = false;

const difficultyScreen = document.getElementById("difficulty-screen");
const mapWrap = document.getElementById("map-wrap");
const promptEl = document.getElementById("map-prompt");
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

function countryName(code) {
  return (COUNTRY_NAMES[currentLang] && COUNTRY_NAMES[currentLang][code]) || code;
}

async function loadMap() {
  if (mapLoaded) return;
  const res = await fetch("map-europe.svg");
  const svgText = await res.text();
  mapWrap.innerHTML = svgText;
  mapWrap.querySelectorAll(".map-country").forEach((g) => {
    g.addEventListener("click", () => selectCountry(g.id));
  });
  mapLoaded = true;
}

function clearMapState() {
  mapWrap.querySelectorAll(".map-country").forEach((g) => {
    g.classList.remove("correct", "wrong", "disabled");
  });
}

async function chooseDifficulty(level) {
  difficulty = level;
  await loadMap();
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
  order = shuffle(levels[difficulty]).slice(0, Math.min(SESSION_LENGTH, levels[difficulty].length));
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
  clearMapState();

  const code = order[current];
  promptEl.textContent = `${t("mapClickOn")} ${countryName(code)}`;

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
}

function selectCountry(clickedCode) {
  if (answered) return;
  answered = true;

  const targetCode = order[current];
  const isCorrect = clickedCode === targetCode;

  mapWrap.querySelectorAll(".map-country").forEach((g) => g.classList.add("disabled"));
  const targetEl = mapWrap.querySelector(`#${targetCode}`);
  if (targetEl) targetEl.classList.add("correct");
  if (!isCorrect) {
    const clickedEl = mapWrap.querySelector(`#${clickedCode}`);
    if (clickedEl) clickedEl.classList.add("wrong");
  }

  const itemData = { code: targetCode, name: countryName(targetCode) };
  if (isCorrect) {
    score++;
    if (window.clearMistake) clearMistake("carte-muette", targetCode);
  } else {
    if (window.recordMistake) recordMistake("carte-muette", difficulty, targetCode, itemData);
  }

  feedbackEl.innerHTML = isCorrect
    ? `${t("wellSpotted")} ${countryName(targetCode)} ✓`
    : `${t("notQuite")} ${t("exactSentenceWas")} <strong>${countryName(targetCode)}</strong>`;
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
  if (window.saveScore) window.saveScore("carte-muette", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

// Les noms de pays changent de langue, mais la carte elle-même est
// universelle : pas besoin de revenir à l'écran de niveau.
document.addEventListener("langchange", () => {
  if (gameCard.style.display === "block" && !answered) {
    const code = order[current];
    promptEl.textContent = `${t("mapClickOn")} ${countryName(code)}`;
    progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  }
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
