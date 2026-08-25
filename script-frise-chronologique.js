// Frise chronologique : remettre un petit ensemble d'événements dans l'ordre
// chronologique en cliquant. Mécanique volontairement générique (pool
// d'événements + slots numérotés) pour pouvoir être réutilisée telle quelle
// par une future frise sur un autre thème (il suffirait de dupliquer ce
// fichier avec un nouveau pool "levels").
const levels = {
  fr: {
    facile: [
      { events: [ { label: "Sacre de Charlemagne", year: 800 }, { label: "Christophe Colomb découvre l'Amérique", year: 1492 }, { label: "Prise de la Bastille", year: 1789 }, { label: "Fin de la Seconde Guerre mondiale", year: 1945 } ] },
      { events: [ { label: "Chute de l'Empire romain d'Occident", year: 476 }, { label: "Napoléon devient empereur", year: 1804 }, { label: "Début de la Première Guerre mondiale", year: 1914 }, { label: "Chute du mur de Berlin", year: 1989 } ] },
      { events: [ { label: "Jeanne d'Arc délivre Orléans", year: 1429 }, { label: "Révolution française", year: 1789 }, { label: "Début de la Seconde Guerre mondiale", year: 1939 }, { label: "Premier pas sur la Lune", year: 1969 } ] },
      { events: [ { label: "Construction des pyramides de Gizeh", year: -2560 }, { label: "Fondation de Rome", year: -753 }, { label: "Début de l'ère chrétienne (an 1)", year: 1 }, { label: "Chute de l'Empire romain d'Occident", year: 476 } ] },
      { events: [ { label: "Début du Moyen Âge (chute de Rome)", year: 476 }, { label: "Sacre de Charlemagne", year: 800 }, { label: "Début de la Renaissance en Europe", year: 1450 }, { label: "Révolution française", year: 1789 } ] },
      { events: [ { label: "Bataille de Marathon (Grèce antique)", year: -490 }, { label: "Assassinat de Jules César", year: -44 }, { label: "Sacre de Charlemagne", year: 800 }, { label: "Christophe Colomb découvre l'Amérique", year: 1492 } ] },
      { events: [ { label: "Fin de la Première Guerre mondiale", year: 1918 }, { label: "Fin de la Seconde Guerre mondiale", year: 1945 }, { label: "Chute du mur de Berlin", year: 1989 }, { label: "Attentats du 11 septembre", year: 2001 } ] },
      { events: [ { label: "Début de la construction de Notre-Dame de Paris", year: 1163 }, { label: "Début de la guerre de Cent Ans", year: 1337 }, { label: "Révolution française", year: 1789 }, { label: "Début de la Première Guerre mondiale", year: 1914 } ] },
    ],
    moyen: [
      { events: [ { label: "Prise de la Bastille", year: 1789 }, { label: "Exécution de Louis XVI", year: 1793 }, { label: "Napoléon devient Premier Consul", year: 1799 }, { label: "Napoléon se couronne empereur", year: 1804 }, { label: "Défaite de Waterloo", year: 1815 } ] },
      { events: [ { label: "Fin de la Première Guerre mondiale", year: 1918 }, { label: "Crise économique de 1929", year: 1929 }, { label: "Arrivée d'Hitler au pouvoir", year: 1933 }, { label: "Début de la Seconde Guerre mondiale", year: 1939 }, { label: "Débarquement de Normandie", year: 1944 } ] },
      { events: [ { label: "Début de la colonisation de l'Algérie", year: 1830 }, { label: "Conférence de Berlin (partage de l'Afrique)", year: 1885 }, { label: "Indépendance de l'Inde", year: 1947 }, { label: "Indépendance de l'Algérie", year: 1962 }, { label: "Fin de l'apartheid en Afrique du Sud", year: 1991 } ] },
      { events: [ { label: "Proclamation de la Première République", year: 1792 }, { label: "Napoléon III proclame le Second Empire", year: 1852 }, { label: "Proclamation de la Troisième République", year: 1870 }, { label: "Instauration de la Quatrième République", year: 1946 }, { label: "Instauration de la Cinquième République", year: 1958 } ] },
      { events: [ { label: "James Watt améliore la machine à vapeur", year: 1769 }, { label: "Première ligne de chemin de fer en France", year: 1827 }, { label: "Premier câble télégraphique transatlantique", year: 1866 }, { label: "Invention de l'ampoule électrique", year: 1879 }, { label: "Premier vol des frères Wright", year: 1903 } ] },
      { events: [ { label: "Fin de la Seconde Guerre mondiale", year: 1945 }, { label: "Début du blocus de Berlin", year: 1948 }, { label: "Création de l'OTAN", year: 1949 }, { label: "Début de la guerre de Corée", year: 1950 }, { label: "Construction du mur de Berlin", year: 1961 } ] },
      { events: [ { label: "Déclaration Schuman (CECA)", year: 1950 }, { label: "Traité de Rome (CEE)", year: 1957 }, { label: "Premier élargissement de la CEE", year: 1973 }, { label: "Traité de Maastricht (Union européenne)", year: 1992 }, { label: "Introduction des pièces et billets en euros", year: 2002 } ] },
      { events: [ { label: "Loi sur l'instruction obligatoire (Jules Ferry)", year: 1882 }, { label: "Droit de vote des femmes en France", year: 1944 }, { label: "Création de la Sécurité sociale", year: 1945 }, { label: "Mai 68", year: 1968 }, { label: "Légalisation de l'IVG (loi Veil)", year: 1975 } ] },
    ],
    difficile: [
      { events: [ { label: "Doctrine Truman (containment)", year: 1947 }, { label: "Plan Marshall", year: 1948 }, { label: "Création de l'OTAN", year: 1949 }, { label: "Mort de Staline", year: 1953 }, { label: "Crise de Cuba", year: 1962 }, { label: "Traité de non-prolifération nucléaire", year: 1968 } ] },
      { events: [ { label: "Indépendance de l'Inde", year: 1947 }, { label: "Défaite française de Diên Biên Phu", year: 1954 }, { label: "Indépendance du Ghana", year: 1957 }, { label: "Année de l'Afrique (17 pays indépendants)", year: 1960 }, { label: "Indépendance de l'Algérie", year: 1962 }, { label: "Indépendance de l'Angola et du Mozambique", year: 1975 } ] },
      { events: [ { label: "Gorbatchev arrive au pouvoir en URSS", year: 1985 }, { label: "Chute du mur de Berlin", year: 1989 }, { label: "Dissolution de l'URSS", year: 1991 }, { label: "Traité de Maastricht", year: 1992 }, { label: "Création de l'Organisation mondiale du commerce", year: 1995 }, { label: "Attentats du 11 septembre", year: 2001 } ] },
      { events: [ { label: "Réunion des états généraux", year: 1789 }, { label: "Fuite du roi à Varennes", year: 1791 }, { label: "Proclamation de la Première République", year: 1792 }, { label: "Exécution de Louis XVI", year: 1793 }, { label: "Chute de Robespierre (fin de la Terreur)", year: 1794 }, { label: "Coup d'État de Napoléon (18 Brumaire)", year: 1799 } ] },
      { events: [ { label: "Instauration de la Cinquième République", year: 1958 }, { label: "Élection du président au suffrage universel direct", year: 1962 }, { label: "Mai 68", year: 1968 }, { label: "Élection de François Mitterrand", year: 1981 }, { label: "Première cohabitation politique", year: 1986 }, { label: "Passage au quinquennat présidentiel", year: 2000 } ] },
      { events: [ { label: "Premier choc pétrolier", year: 1973 }, { label: "Second choc pétrolier", year: 1979 }, { label: "Chute du mur de Berlin", year: 1989 }, { label: "Création de l'Organisation mondiale du commerce", year: 1995 }, { label: "L'euro devient monnaie scripturale", year: 1999 }, { label: "Crise financière mondiale", year: 2008 } ] },
      { events: [ { label: "Fondation légendaire de Rome", year: -753 }, { label: "Instauration de la République romaine", year: -509 }, { label: "Début des guerres puniques", year: -264 }, { label: "Assassinat de Jules César", year: -44 }, { label: "Auguste devient le premier empereur", year: -27 }, { label: "Édit de Milan (tolérance du christianisme)", year: 313 } ] },
      { events: [ { label: "Création de la Société des Nations", year: 1920 }, { label: "Création de l'ONU", year: 1945 }, { label: "Déclaration universelle des droits de l'homme", year: 1948 }, { label: "Création de la Communauté économique européenne", year: 1957 }, { label: "Premier sommet du G7", year: 1975 }, { label: "Création de la Cour pénale internationale", year: 2002 } ] },
    ],
  },
  en: {
    facile: [
      { events: [ { label: "Coronation of Charlemagne", year: 800 }, { label: "Columbus reaches the Americas", year: 1492 }, { label: "Storming of the Bastille", year: 1789 }, { label: "End of World War II", year: 1945 } ] },
      { events: [ { label: "Fall of the Western Roman Empire", year: 476 }, { label: "Napoleon crowns himself emperor", year: 1804 }, { label: "Start of World War I", year: 1914 }, { label: "Fall of the Berlin Wall", year: 1989 } ] },
      { events: [ { label: "Joan of Arc liberates Orléans", year: 1429 }, { label: "French Revolution", year: 1789 }, { label: "Start of World War II", year: 1939 }, { label: "First Moon landing", year: 1969 } ] },
      { events: [ { label: "Construction of the Great Pyramids of Giza", year: -2560 }, { label: "Founding of Rome", year: -753 }, { label: "Beginning of the Christian era (year 1)", year: 1 }, { label: "Fall of the Western Roman Empire", year: 476 } ] },
      { events: [ { label: "Start of the Middle Ages (fall of Rome)", year: 476 }, { label: "Coronation of Charlemagne", year: 800 }, { label: "Start of the Renaissance in Europe", year: 1450 }, { label: "French Revolution", year: 1789 } ] },
      { events: [ { label: "Battle of Marathon (ancient Greece)", year: -490 }, { label: "Assassination of Julius Caesar", year: -44 }, { label: "Coronation of Charlemagne", year: 800 }, { label: "Columbus reaches the Americas", year: 1492 } ] },
      { events: [ { label: "End of World War I", year: 1918 }, { label: "End of World War II", year: 1945 }, { label: "Fall of the Berlin Wall", year: 1989 }, { label: "September 11 attacks", year: 2001 } ] },
      { events: [ { label: "Construction of Notre-Dame Cathedral begins", year: 1163 }, { label: "Start of the Hundred Years' War", year: 1337 }, { label: "French Revolution", year: 1789 }, { label: "Start of World War I", year: 1914 } ] },
    ],
    moyen: [
      { events: [ { label: "Storming of the Bastille", year: 1789 }, { label: "Execution of Louis XVI", year: 1793 }, { label: "Napoleon becomes First Consul", year: 1799 }, { label: "Napoleon crowns himself emperor", year: 1804 }, { label: "Defeat at Waterloo", year: 1815 } ] },
      { events: [ { label: "End of World War I", year: 1918 }, { label: "1929 economic crisis", year: 1929 }, { label: "Hitler comes to power", year: 1933 }, { label: "Start of World War II", year: 1939 }, { label: "Normandy landings", year: 1944 } ] },
      { events: [ { label: "France begins colonizing Algeria", year: 1830 }, { label: "Berlin Conference (partition of Africa)", year: 1885 }, { label: "Indian independence", year: 1947 }, { label: "Algerian independence", year: 1962 }, { label: "End of apartheid in South Africa", year: 1991 } ] },
      { events: [ { label: "Proclamation of the First Republic", year: 1792 }, { label: "Napoleon III proclaims the Second Empire", year: 1852 }, { label: "Proclamation of the Third Republic", year: 1870 }, { label: "Fourth Republic established", year: 1946 }, { label: "Fifth Republic established", year: 1958 } ] },
      { events: [ { label: "James Watt improves the steam engine", year: 1769 }, { label: "First French railway line", year: 1827 }, { label: "First transatlantic telegraph cable", year: 1866 }, { label: "Invention of the electric light bulb", year: 1879 }, { label: "First Wright brothers flight", year: 1903 } ] },
      { events: [ { label: "End of World War II", year: 1945 }, { label: "Start of the Berlin Blockade", year: 1948 }, { label: "Creation of NATO", year: 1949 }, { label: "Start of the Korean War", year: 1950 }, { label: "Construction of the Berlin Wall", year: 1961 } ] },
      { events: [ { label: "Schuman Declaration (ECSC)", year: 1950 }, { label: "Treaty of Rome (EEC)", year: 1957 }, { label: "First EEC enlargement", year: 1973 }, { label: "Maastricht Treaty (European Union)", year: 1992 }, { label: "Euro coins and banknotes introduced", year: 2002 } ] },
      { events: [ { label: "Free, compulsory education law (Jules Ferry)", year: 1882 }, { label: "Women gain the right to vote in France", year: 1944 }, { label: "Creation of the French social security system", year: 1945 }, { label: "May 1968", year: 1968 }, { label: "Legalization of abortion in France", year: 1975 } ] },
    ],
    difficile: [
      { events: [ { label: "Truman Doctrine (containment)", year: 1947 }, { label: "Marshall Plan", year: 1948 }, { label: "Creation of NATO", year: 1949 }, { label: "Death of Stalin", year: 1953 }, { label: "Cuban Missile Crisis", year: 1962 }, { label: "Nuclear Non-Proliferation Treaty", year: 1968 } ] },
      { events: [ { label: "Indian independence", year: 1947 }, { label: "French defeat at Dien Bien Phu", year: 1954 }, { label: "Ghana's independence", year: 1957 }, { label: "Year of Africa (17 countries gain independence)", year: 1960 }, { label: "Algerian independence", year: 1962 }, { label: "Independence of Angola and Mozambique", year: 1975 } ] },
      { events: [ { label: "Gorbachev comes to power in the USSR", year: 1985 }, { label: "Fall of the Berlin Wall", year: 1989 }, { label: "Dissolution of the USSR", year: 1991 }, { label: "Maastricht Treaty", year: 1992 }, { label: "Creation of the World Trade Organization", year: 1995 }, { label: "September 11 attacks", year: 2001 } ] },
      { events: [ { label: "Estates-General convened", year: 1789 }, { label: "The king's flight to Varennes", year: 1791 }, { label: "Proclamation of the First Republic", year: 1792 }, { label: "Execution of Louis XVI", year: 1793 }, { label: "Fall of Robespierre (end of the Terror)", year: 1794 }, { label: "Napoleon's coup (18 Brumaire)", year: 1799 } ] },
      { events: [ { label: "Fifth Republic established", year: 1958 }, { label: "Direct election of the president by universal suffrage", year: 1962 }, { label: "May 1968", year: 1968 }, { label: "Election of François Mitterrand", year: 1981 }, { label: "First political cohabitation", year: 1986 }, { label: "Presidential term shortened to five years", year: 2000 } ] },
      { events: [ { label: "First oil crisis", year: 1973 }, { label: "Second oil crisis", year: 1979 }, { label: "Fall of the Berlin Wall", year: 1989 }, { label: "Creation of the World Trade Organization", year: 1995 }, { label: "Euro becomes an accounting currency", year: 1999 }, { label: "Global financial crisis", year: 2008 } ] },
      { events: [ { label: "Legendary founding of Rome", year: -753 }, { label: "Establishment of the Roman Republic", year: -509 }, { label: "Start of the Punic Wars", year: -264 }, { label: "Assassination of Julius Caesar", year: -44 }, { label: "Augustus becomes the first emperor", year: -27 }, { label: "Edict of Milan (tolerance of Christianity)", year: 313 } ] },
      { events: [ { label: "Creation of the League of Nations", year: 1920 }, { label: "Creation of the United Nations", year: 1945 }, { label: "Universal Declaration of Human Rights", year: 1948 }, { label: "Creation of the European Economic Community", year: 1957 }, { label: "First G7 summit", year: 1975 }, { label: "Creation of the International Criminal Court", year: 2002 } ] },
    ],
  },
};

const SESSION_LENGTH = 5;

let rounds = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let validated = false;
let roundEvents = [];    // events for the current round: { id, label, year }
let slotAssignment = []; // slotAssignment[i] = event id placed in slot i, or null
let poolIds = [];        // ids of events not yet placed

const difficultyScreen = document.getElementById("difficulty-screen");
const poolEl = document.getElementById("timeline-pool");
const slotsEl = document.getElementById("timeline-slots");
const correctionsEl = document.getElementById("corrections");
const validateBtn = document.getElementById("validate-btn");
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

function formatYear(year) {
  if (year < 0) return currentLang === "en" ? `${-year} BCE` : `${-year} av. J.-C.`;
  return `${year}`;
}

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
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
  validated = false;
  correctionsEl.classList.remove("show");
  correctionsEl.innerHTML = "";
  validateBtn.style.display = "inline-block";
  validateBtn.disabled = true;
  nextBtn.style.display = "none";

  const data = rounds[order[current]];
  roundEvents = data.events.map((e, i) => ({ ...e, id: i }));
  slotAssignment = new Array(roundEvents.length).fill(null);
  poolIds = shuffle(roundEvents.map((e) => e.id));

  renderTimeline();
  renderPool();

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
}

function eventById(id) {
  return roundEvents.find((e) => e.id === id);
}

function renderPool() {
  poolEl.innerHTML = "";
  poolIds.forEach((id) => {
    poolEl.appendChild(createChip(id, null));
  });
}

function renderTimeline() {
  slotsEl.innerHTML = "";
  slotAssignment.forEach((eventId, i) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    item.appendChild(dot);

    const slot = document.createElement("div");
    slot.className = "timeline-slot";
    slot.dataset.index = i;

    if (eventId !== null) {
      slot.appendChild(createChip(eventId, i));
    } else {
      const hint = document.createElement("span");
      hint.className = "timeline-slot-hint";
      hint.textContent = i + 1;
      slot.appendChild(hint);
    }
    item.appendChild(slot);
    slotsEl.appendChild(item);
  });
}

// Une étiquette : cliquable au pointerdown, le drag suit ensuite le
// curseur/doigt via pointermove sur la fenêtre (pointer events, marche
// à la souris comme au toucher).
function createChip(eventId, fromSlot) {
  const ev = eventById(eventId);
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "timeline-pool-btn";
  chip.textContent = ev.label;
  chip.addEventListener("pointerdown", (e) => {
    if (validated) return;
    e.preventDefault();
    startDrag(eventId, fromSlot, e.clientX, e.clientY, chip);
  });
  return chip;
}

function startDrag(eventId, fromSlot, x, y, sourceEl) {
  sourceEl.classList.add("dragging");

  const ghost = document.createElement("div");
  ghost.className = "timeline-pool-btn timeline-ghost";
  ghost.textContent = eventById(eventId).label;
  document.body.appendChild(ghost);
  moveGhost(ghost, x, y);

  function cleanup() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onCancel);
    ghost.remove();
    clearDropHighlight();
    sourceEl.classList.remove("dragging");
  }
  function onMove(e) {
    moveGhost(ghost, e.clientX, e.clientY);
    highlightDropTarget(e.clientX, e.clientY);
  }
  function onUp(e) {
    cleanup();
    handleDrop(eventId, fromSlot, e.clientX, e.clientY);
  }
  function onCancel() {
    cleanup();
  }

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onCancel);
}

function moveGhost(ghost, x, y) {
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;
}

function highlightDropTarget(x, y) {
  clearDropHighlight();
  const el = document.elementFromPoint(x, y);
  const slot = el && el.closest(".timeline-slot");
  if (slot) slot.classList.add("drag-over");
}

function clearDropHighlight() {
  slotsEl.querySelectorAll(".timeline-slot.drag-over").forEach((s) => s.classList.remove("drag-over"));
}

function handleDrop(eventId, fromSlot, x, y) {
  const el = document.elementFromPoint(x, y);
  const slotEl = el && el.closest(".timeline-slot");
  const droppedOnPool = el && el.closest("#timeline-pool");

  if (slotEl) {
    const toIndex = Number(slotEl.dataset.index);
    if (toIndex !== fromSlot) {
      const displaced = slotAssignment[toIndex];
      if (fromSlot !== null) {
        slotAssignment[fromSlot] = displaced;
      } else {
        poolIds = poolIds.filter((id) => id !== eventId);
        if (displaced !== null) poolIds.push(displaced);
      }
      slotAssignment[toIndex] = eventId;
    }
  } else if (droppedOnPool && fromSlot !== null) {
    slotAssignment[fromSlot] = null;
    poolIds.push(eventId);
  }
  // Sinon : lâché nulle part de valide -> aucun changement d'état, l'étiquette
  // revient visuellement à sa place au rendu suivant.

  renderTimeline();
  renderPool();
  validateBtn.disabled = poolIds.length > 0;
}

function validate() {
  if (validated || poolIds.length > 0) return;
  validated = true;

  const correctOrder = [...roundEvents].sort((a, b) => a.year - b.year);
  let allCorrect = true;
  const slotEls = slotsEl.querySelectorAll(".timeline-slot");
  slotAssignment.forEach((eventId, i) => {
    const ev = eventById(eventId);
    const isRight = ev.label === correctOrder[i].label && ev.year === correctOrder[i].year;
    slotEls[i].classList.add(isRight ? "correct" : "wrong");
    if (!isRight) allCorrect = false;
  });

  if (window.playSound) playSound(allCorrect ? "correct" : "wrong");

  const itemKey = correctOrder.map((e) => e.label).join(" | ");
  const data = rounds[order[current]];
  if (allCorrect) {
    score++;
    if (window.clearMistake) clearMistake("frise-chronologique", itemKey);
  } else {
    if (window.recordMistake) recordMistake("frise-chronologique", difficulty, itemKey, data);
  }

  const list = correctOrder.map((e, i) => `${i + 1}. ${e.label} (${formatYear(e.year)})`).join("<br>");
  correctionsEl.innerHTML = `${allCorrect ? t("perfectExclaim") : t("notQuite")}<br>${t("timelineCorrectOrder")}<br>${list}`;
  correctionsEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  validateBtn.style.display = "none";
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
  if (window.playSound) playSound("success");
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("frise-chronologique", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

validateBtn.addEventListener("click", validate);
nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

document.addEventListener("langchange", backToDifficulty);
