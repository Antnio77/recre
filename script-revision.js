// Mode révision : rejoue pour de vrai les items ratés (stockés dans la
// table "mistakes"), jeu par jeu. Ne compte pas dans les stats/XP — c'est
// un entraînement correctif, pas une partie notée. Un jeu sans renderer
// ici apparaît quand même dans la liste (si des erreurs existent) mais
// avec un badge "bientôt disponible".
const RENDERERS = {
  orthographe: {
    render: renderOrthoItem,
    validate: validateOrthoItem,
  },
  dictee: {
    render: renderDicteeItem,
    validate: validateDicteeItem,
  },
  "bonne-phrase": makeMultipleChoiceRenderer({
    game: "bonne-phrase",
    instructionsKey: "bpInstructions",
  }),
  "calcul-mental": makeNumericRenderer({
    game: "calcul-mental",
    instructionsKey: "calcInstructions",
    displayField: "expr",
  }),
  "bon-resultat-maths": makeMultipleChoiceRenderer({
    game: "bon-resultat-maths",
    instructionsKey: "bonResultInstructions",
    displayField: "expr",
  }),
  "problemes-quotidien": makeNumericRenderer({
    game: "problemes-quotidien",
    instructionsKey: "problemesInstructions",
    displayField: "text",
    displayStyle: "font-size:19px; font-weight:500; text-align:left; line-height:1.5;",
  }),
  "conjugaison-eclair": makeFreeTextRenderer({
    game: "conjugaison-eclair",
    instructionsKey: "conjInstructions",
  }),
  "texte-a-trous": makeMultipleChoiceRenderer({
    game: "texte-a-trous",
    instructionsKey: "textInstructions",
    displayField: "sentence",
    displayStyle: "font-size:19px; font-weight:600; text-align:left;",
  }),
  "problemes-multi-etapes": makeNumericRenderer({
    game: "problemes-multi-etapes",
    instructionsKey: "multiInstructions",
    displayField: "text",
    displayStyle: "font-size:18px; font-weight:500; text-align:left; line-height:1.5;",
  }),
  "geometrie-eclair": makeNumericRenderer({
    game: "geometrie-eclair",
    instructionsKey: "geoInstructions",
    displayField: "text",
    displayStyle: "font-size:19px; font-weight:600;",
  }),
  "quiz-maths-3eme": makeMultipleChoiceRenderer({
    game: "quiz-maths-3eme",
    instructionsKey: "quizInstructions",
    displayField: "question",
    displayStyle: "font-size:19px; font-weight:600; text-align:left;",
  }),
  "histoire-geo": makeMultipleChoiceRenderer({
    game: "histoire-geo",
    instructionsKey: "histgeoInstructions",
    displayField: "question",
    displayStyle: "font-size:19px; font-weight:600; text-align:left;",
  }),
  "frise-chronologique": {
    render: renderTimelineItem,
    validate: validateTimelineItem,
  },
  "carte-muette": {
    render: renderCarteMuetteItem,
    validate: () => {},
  },
};

const GAME_EMOJIS = {
  orthographe: "✏️",
  dictee: "🎧",
  "bonne-phrase": "📝",
  "calcul-mental": "⚡",
  "bon-resultat-maths": "🔢",
  "problemes-quotidien": "🧮",
  "conjugaison-eclair": "🔤",
  "texte-a-trous": "📄",
  "problemes-multi-etapes": "🧩",
  "geometrie-eclair": "📐",
  "quiz-maths-3eme": "🎓",
  "histoire-geo": "🌍",
  "frise-chronologique": "🕰️",
  "carte-muette": "🗺️",
};

let mistakesByGame = {};
let currentGame = null;
let queue = [];
let queueIndex = 0;
let orthoState = null;

const loginPrompt = document.getElementById("login-prompt");
const emptyState = document.getElementById("revision-empty");
const listScreen = document.getElementById("revision-list-screen");
const gameListEl = document.getElementById("revision-game-list");
const playScreen = document.getElementById("revision-play-screen");
const playInstructions = document.getElementById("revision-play-instructions");
const progressLabel = document.getElementById("revision-progress-label");
const itemContainer = document.getElementById("revision-item-container");
const actionsEl = document.getElementById("revision-actions");
const validateBtn = document.getElementById("revision-validate-btn");
const nextBtn = document.getElementById("revision-next-btn");
const backBtn = document.getElementById("revision-back-btn");
const finishedScreen = document.getElementById("revision-finished-screen");
const finishedBackBtn = document.getElementById("revision-finished-back-btn");

function showScreen(name) {
  loginPrompt.style.display = name === "login" ? "block" : "none";
  emptyState.style.display = name === "empty" ? "block" : "none";
  listScreen.style.display = name === "list" ? "block" : "none";
  playScreen.style.display = name === "play" ? "block" : "none";
  finishedScreen.style.display = name === "finished" ? "block" : "none";
}

function renderGameList() {
  const games = Object.keys(mistakesByGame);
  gameListEl.innerHTML = games
    .map((game) => {
      const rows = mistakesByGame[game];
      const supported = !!RENDERERS[game];
      return `
      <div class="leaderboard-row">
        <div class="leaderboard-emoji">${GAME_EMOJIS[game] || "🎮"}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${gameDisplayName(game)}</div>
          <div class="leaderboard-level">${rows.length} ${t("revisionPendingCount")}</div>
        </div>
        ${
          supported
            ? `<button class="btn btn-primary revision-start-btn" data-game="${game}" type="button" style="padding:8px 16px; font-size:13px;">${t("revisionStartBtn")}</button>`
            : `<span style="font-size:12px; color:var(--ink-soft); font-weight:600;">${t("revisionComingSoon")}</span>`
        }
      </div>
    `;
    })
    .join("");

  gameListEl.querySelectorAll(".revision-start-btn").forEach((btn) => {
    btn.addEventListener("click", () => startRevision(btn.dataset.game));
  });
}

async function loadMistakes() {
  mistakesByGame = await fetchMistakesByGame();
  if (Object.keys(mistakesByGame).length === 0) {
    showScreen("empty");
    return;
  }
  renderGameList();
  showScreen("list");
}

function startRevision(game) {
  currentGame = game;
  queue = [...mistakesByGame[game]];
  queueIndex = 0;
  showScreen("play");
  renderCurrentItem();
}

function renderCurrentItem() {
  if (queueIndex >= queue.length) {
    showScreen("finished");
    return;
  }
  const row = queue[queueIndex];
  progressLabel.textContent = `${t("revisionRemaining")} ${queue.length - queueIndex} · ${t("levelWord")} ${difficultyLabel(row.difficulty)}`;
  actionsEl.style.display = "flex";
  validateBtn.style.display = "inline-block";
  validateBtn.disabled = false;
  nextBtn.style.display = "none";
  RENDERERS[currentGame].render(row);
}

function nextItem() {
  queueIndex++;
  renderCurrentItem();
}

backBtn.addEventListener("click", () => {
  loadMistakes();
});
finishedBackBtn.addEventListener("click", () => {
  loadMistakes();
});
validateBtn.addEventListener("click", () => {
  RENDERERS[currentGame].validate();
});
nextBtn.addEventListener("click", nextItem);

// ---- Renderer : Chasse aux fautes (orthographe) ----

function normalizeWord(w) {
  return w.toLowerCase().replace(/^[.,!?;:"'’()«»]+|[.,!?;:"'’()«»]+$/g, "");
}

function renderOrthoItem(row) {
  playInstructions.textContent = t("orthoInstructions");
  const data = row.item_data;
  orthoState = { data, selected: new Set(), validated: false };

  itemContainer.innerHTML = `
    <div class="sentence" id="revision-sentence"></div>
    <div class="correction-inputs" id="revision-correction-inputs"></div>
    <div class="corrections" id="revision-corrections"></div>
  `;

  const sentenceEl = document.getElementById("revision-sentence");
  const tokens = data.text.split(" ");
  tokens.forEach((word, i) => {
    const btn = document.createElement("button");
    btn.className = "word-btn";
    btn.type = "button";
    btn.textContent = word;
    btn.addEventListener("click", () => toggleOrthoWord(i, btn, word));
    sentenceEl.appendChild(btn);
  });
}

function toggleOrthoWord(i, btn, word) {
  if (orthoState.validated) return;
  const correctionInputsEl = document.getElementById("revision-correction-inputs");
  if (orthoState.selected.has(i)) {
    orthoState.selected.delete(i);
    btn.classList.remove("selected");
    const row = document.getElementById(`revision-correction-row-${i}`);
    if (row) row.remove();
  } else {
    orthoState.selected.add(i);
    btn.classList.add("selected");
    const rowEl = document.createElement("div");
    rowEl.className = "correction-row";
    rowEl.id = `revision-correction-row-${i}`;
    rowEl.innerHTML = `
      <span class="flagged-word">${word}</span>
      <span>→</span>
      <input type="text" class="correction-input" id="revision-correction-input-${i}" placeholder="${t("yourProposal")}" autocomplete="off" autocapitalize="off" spellcheck="false">
    `;
    correctionInputsEl.appendChild(rowEl);
    rowEl.querySelector("input").focus();
  }
}

function validateOrthoItem() {
  if (orthoState.validated) return;
  orthoState.validated = true;

  const { data, selected } = orthoState;
  const errorIndices = Object.keys(data.errors).map(Number);
  const buttons = document.getElementById("revision-sentence").querySelectorAll(".word-btn");
  const correctionsEl = document.getElementById("revision-corrections");

  let allCorrected = true;
  let noWrongPicks = true;

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove("selected");
    const isError = errorIndices.includes(i);
    const wasSelected = selected.has(i);

    if (isError && wasSelected) {
      const input = document.getElementById(`revision-correction-input-${i}`);
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
      const input = document.getElementById(`revision-correction-input-${i}`);
      if (input) input.disabled = true;
    }
  });

  const success = allCorrected && noWrongPicks;

  if (errorIndices.length > 0) {
    const list = errorIndices
      .map((i) => {
        const wasSelected = selected.has(i);
        const input = document.getElementById(`revision-correction-input-${i}`);
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
    correctionsEl.innerHTML = success ? `${t("perfectExclaim")} ${list}` : `${t("expectedCorrections")} ${list}`;
  } else {
    correctionsEl.innerHTML = success ? t("noMistakeCorrect") : t("noMistakeWrong");
  }
  correctionsEl.classList.add("show");

  if (success) {
    clearMistake("orthographe", data.text);
  }

  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

// ---- Helpers partagés ----

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Doit rester cohérent avec la clé utilisée par recordMistake()/clearMistake()
// dans le script de chaque jeu.
function itemKeyFor(game, data) {
  if (game === "bonne-phrase") return data.options.join(" / ");
  if (game === "calcul-mental" || game === "bon-resultat-maths") return data.expr;
  if (game === "texte-a-trous") return data.sentence;
  if (game === "quiz-maths-3eme" || game === "histoire-geo") return data.question;
  if (game === "frise-chronologique") {
    return [...data.events].sort((a, b) => a.year - b.year).map((e) => e.label).join(" | ");
  }
  if (game === "carte-muette") return data.code;
  return data.text;
}

function finishRevisionItem(success, itemKey) {
  if (success) clearMistake(currentGame, itemKey);
  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

// Valide au Entrée dans le champ de réponse texte/numérique en cours.
itemContainer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && validateBtn.style.display !== "none") {
    RENDERERS[currentGame].validate();
  }
});

// ---- Renderer : Dictée vocale ----

let dicteeState = null;

function normalizeDicteeWord(w) {
  return w.toLowerCase().replace(/^[.,!?;:"'’()«»]+|[.,!?;:"'’()«»]+$/g, "");
}

function renderDicteeItem(row) {
  const data = row.item_data;
  dicteeState = { data };
  playInstructions.textContent = t("dicteeInstructions");
  itemContainer.innerHTML = `
    <input type="text" class="answer-input" id="revision-answer-input" data-i18n-placeholder="answerPlaceholder" placeholder="${t("answerPlaceholder")}" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="corrections" id="revision-corrections"></div>
  `;
  document.getElementById("revision-answer-input").focus();
}

function validateDicteeItem() {
  const { data } = dicteeState;
  const input = document.getElementById("revision-answer-input");
  input.disabled = true;

  const targetWords = data.text.split(" ");
  const answerWords = input.value.trim().split(/\s+/).filter(Boolean);
  let allCorrect = answerWords.length === targetWords.length;
  const html = [];
  const maxLen = Math.max(targetWords.length, answerWords.length);
  for (let i = 0; i < maxLen; i++) {
    const targetWord = targetWords[i];
    const answerWord = answerWords[i];
    if (targetWord === undefined) continue;
    const isMatch = answerWord !== undefined && normalizeDicteeWord(answerWord) === normalizeDicteeWord(targetWord);
    if (!isMatch) allCorrect = false;
    html.push(
      `<span class="word-btn ${isMatch ? "correct" : "wrong-pick"}" style="cursor:default;">${
        answerWord !== undefined ? answerWord : "…"
      }</span>`
    );
  }

  const correctionsEl = document.getElementById("revision-corrections");
  correctionsEl.innerHTML = `
    <div class="sentence" style="margin-bottom:14px;">${html.join(" ")}</div>
    ${allCorrect ? t("perfectNoMistake") : `${t("exactSentenceWas")} <strong>${data.text}</strong>`}
  `;
  correctionsEl.classList.add("show");

  finishRevisionItem(allCorrect, data.text);
}

// ---- Renderer générique : réponse numérique libre ----
// (calcul-mental, problemes-quotidien, problemes-multi-etapes, geometrie-eclair)

function makeNumericRenderer({ game, instructionsKey, displayField, displayStyle }) {
  let state = null;
  return {
    render(row) {
      const data = row.item_data;
      state = { data };
      playInstructions.textContent = t(instructionsKey);
      itemContainer.innerHTML = `
        <div class="numeric-display" id="revision-display" style="${displayStyle || ""}"></div>
        <input type="text" inputmode="numeric" class="answer-input" id="revision-answer-input" autocomplete="off" spellcheck="false">
        <div class="corrections" id="revision-corrections"></div>
      `;
      document.getElementById("revision-display").textContent =
        displayField === "expr" ? `${data.expr} = ?` : data.text;
      document.getElementById("revision-answer-input").focus();
    },
    validate() {
      const { data } = state;
      const input = document.getElementById("revision-answer-input");
      input.disabled = true;
      const typed = input.value.trim().replace(",", ".");
      const typedNum = parseFloat(typed);
      const isCorrect = !isNaN(typedNum) && Math.abs(typedNum - data.answer) < 0.01;

      const correctionsEl = document.getElementById("revision-corrections");
      correctionsEl.innerHTML = isCorrect
        ? `${t("wellSpotted")} ${data.answer} ✓`
        : `${t("notQuite")} ${t("exactSentenceWas")} <strong>${data.answer}</strong>`;
      correctionsEl.classList.add("show");

      finishRevisionItem(isCorrect, itemKeyFor(game, data));
    },
  };
}

// ---- Renderer générique : réponse texte libre normalisée ----
// (conjugaison-eclair)

function makeFreeTextRenderer({ game, instructionsKey }) {
  let state = null;
  function normalizeAnswer(w) {
    return w.toLowerCase().trim().replace(/\s+/g, " ");
  }
  return {
    render(row) {
      const data = row.item_data;
      state = { data };
      playInstructions.textContent = t(instructionsKey);
      itemContainer.innerHTML = `
        <div class="numeric-display" id="revision-display" style="font-size:22px; font-weight:700;"></div>
        <input type="text" class="answer-input" id="revision-answer-input" autocomplete="off" autocapitalize="off" spellcheck="false">
        <div class="corrections" id="revision-corrections"></div>
      `;
      document.getElementById("revision-display").textContent = data.text;
      document.getElementById("revision-answer-input").focus();
    },
    validate() {
      const { data } = state;
      const input = document.getElementById("revision-answer-input");
      input.disabled = true;
      const isCorrect = normalizeAnswer(input.value) === normalizeAnswer(data.answer);

      const correctionsEl = document.getElementById("revision-corrections");
      correctionsEl.innerHTML = isCorrect
        ? `${t("wellSpotted")} ${data.answer} ✓`
        : `${t("notQuite")} ${t("exactSentenceWas")} <strong>${data.answer}</strong>`;
      correctionsEl.classList.add("show");

      finishRevisionItem(isCorrect, itemKeyFor(game, data));
    },
  };
}

// ---- Renderer générique : QCM ----
// (bonne-phrase, bon-resultat-maths, texte-a-trous). La validation se fait
// au clic sur un choix, pas via le bouton "Valider" (comme dans les jeux
// d'origine) : on masque validateBtn et on affiche nextBtn une fois répondu.

let mcAnswered = false;

function makeMultipleChoiceRenderer({ game, instructionsKey, displayField, displayStyle }) {
  return {
    render(row) {
      const data = row.item_data;
      mcAnswered = false;
      playInstructions.textContent = t(instructionsKey);
      const displayHtml = displayField
        ? `<div class="numeric-display" id="revision-display" style="${displayStyle || ""}"></div>`
        : "";
      itemContainer.innerHTML = `
        ${displayHtml}
        <div class="choices" id="revision-choices"></div>
        <div class="feedback" id="revision-corrections"></div>
      `;
      if (displayField) {
        document.getElementById("revision-display").textContent = data[displayField];
      }

      const optionsList = data.options.map((text, i) => ({ text, isCorrect: i === data.correct }));
      const choicesEl = document.getElementById("revision-choices");
      shuffle(optionsList).forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.type = "button";
        btn.style.textAlign = "center";
        btn.textContent = opt.text;
        btn.addEventListener("click", () => selectMultipleChoiceAnswer(game, opt.isCorrect, btn, data));
        choicesEl.appendChild(btn);
      });

      validateBtn.style.display = "none";
      nextBtn.style.display = "none";
    },
    validate() {},
  };
}

function selectMultipleChoiceAnswer(game, isCorrect, clickedBtn, data) {
  if (mcAnswered) return;
  mcAnswered = true;

  document.querySelectorAll("#revision-choices .choice-btn").forEach((btn) => {
    btn.disabled = true;
    if (btn === clickedBtn) btn.classList.add(isCorrect ? "correct" : "wrong-pick");
  });

  const explanation = typeof data.explanation === "object" ? data.explanation[currentLang] || data.explanation.fr : data.explanation;
  const feedbackEl = document.getElementById("revision-corrections");
  feedbackEl.innerHTML = `${isCorrect ? t("wellSpotted") : t("notQuite")} ${explanation}`;
  feedbackEl.classList.add("show");

  finishRevisionItem(isCorrect, itemKeyFor(game, data));
}

// ---- Renderer : Frise chronologique (glisser-déposer, comme le jeu) ----

let timelineState = null;

function formatYear(year) {
  if (year < 0) return currentLang === "en" ? `${-year} BCE` : `${-year} av. J.-C.`;
  return `${year}`;
}

function renderTimelineItem(row) {
  const data = row.item_data;
  playInstructions.textContent = t("timelineInstructions");

  const roundEvents = data.events.map((e, i) => ({ ...e, id: i }));
  timelineState = {
    roundEvents,
    slotAssignment: new Array(roundEvents.length).fill(null),
    poolIds: shuffle(roundEvents.map((e) => e.id)),
  };

  itemContainer.innerHTML = `
    <div class="timeline-slots" id="revision-timeline-slots"></div>
    <div class="timeline-pool" id="revision-timeline-pool"></div>
  `;

  renderTimelineDOM();
  validateBtn.disabled = true;
}

function timelineEventById(id) {
  return timelineState.roundEvents.find((e) => e.id === id);
}

function renderTimelineDOM() {
  const slotsEl = document.getElementById("revision-timeline-slots");
  const poolEl = document.getElementById("revision-timeline-pool");
  const { slotAssignment, poolIds } = timelineState;

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
      slot.appendChild(createTimelineChip(eventId, i));
    } else {
      const hint = document.createElement("span");
      hint.className = "timeline-slot-hint";
      hint.textContent = i + 1;
      slot.appendChild(hint);
    }
    item.appendChild(slot);
    slotsEl.appendChild(item);
  });

  poolEl.innerHTML = "";
  poolIds.forEach((id) => poolEl.appendChild(createTimelineChip(id, null)));
}

function createTimelineChip(eventId, fromSlot) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "timeline-pool-btn";
  chip.textContent = timelineEventById(eventId).label;
  chip.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    startTimelineDrag(eventId, fromSlot, e.clientX, e.clientY, chip);
  });
  return chip;
}

function startTimelineDrag(eventId, fromSlot, x, y, sourceEl) {
  sourceEl.classList.add("dragging");

  const ghost = document.createElement("div");
  ghost.className = "timeline-pool-btn timeline-ghost";
  ghost.textContent = timelineEventById(eventId).label;
  document.body.appendChild(ghost);
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;

  function clearHighlight() {
    document.querySelectorAll("#revision-timeline-slots .timeline-slot.drag-over").forEach((s) => s.classList.remove("drag-over"));
  }
  function cleanup() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onCancel);
    ghost.remove();
    clearHighlight();
    sourceEl.classList.remove("dragging");
  }
  function onMove(e) {
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;
    clearHighlight();
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const slot = el && el.closest(".timeline-slot");
    if (slot) slot.classList.add("drag-over");
  }
  function onUp(e) {
    cleanup();
    handleTimelineDrop(eventId, fromSlot, e.clientX, e.clientY);
  }
  function onCancel() {
    cleanup();
  }

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onCancel);
}

function handleTimelineDrop(eventId, fromSlot, x, y) {
  const el = document.elementFromPoint(x, y);
  const slotEl = el && el.closest(".timeline-slot");
  const droppedOnPool = el && el.closest("#revision-timeline-pool");
  const { slotAssignment } = timelineState;

  if (slotEl) {
    const toIndex = Number(slotEl.dataset.index);
    if (toIndex !== fromSlot) {
      const displaced = slotAssignment[toIndex];
      if (fromSlot !== null) {
        slotAssignment[fromSlot] = displaced;
      } else {
        timelineState.poolIds = timelineState.poolIds.filter((id) => id !== eventId);
        if (displaced !== null) timelineState.poolIds.push(displaced);
      }
      slotAssignment[toIndex] = eventId;
    }
  } else if (droppedOnPool && fromSlot !== null) {
    slotAssignment[fromSlot] = null;
    timelineState.poolIds.push(eventId);
  }

  renderTimelineDOM();
  validateBtn.disabled = timelineState.poolIds.length > 0;
}

function validateTimelineItem() {
  const { roundEvents, slotAssignment, poolIds } = timelineState;
  if (poolIds.length > 0) return;

  const correctOrder = [...roundEvents].sort((a, b) => a.year - b.year);
  let allCorrect = true;
  const slotEls = document.querySelectorAll("#revision-timeline-slots .timeline-slot");
  slotAssignment.forEach((eventId, i) => {
    const ev = timelineEventById(eventId);
    const isRight = ev.label === correctOrder[i].label && ev.year === correctOrder[i].year;
    slotEls[i].classList.add(isRight ? "correct" : "wrong");
    if (!isRight) allCorrect = false;
  });

  const correctionsEl = document.createElement("div");
  correctionsEl.className = "corrections show";
  const list = correctOrder.map((e, i) => `${i + 1}. ${e.label} (${formatYear(e.year)})`).join("<br>");
  correctionsEl.innerHTML = `${allCorrect ? t("perfectExclaim") : t("notQuite")}<br>${t("timelineCorrectOrder")}<br>${list}`;
  itemContainer.appendChild(correctionsEl);

  finishRevisionItem(allCorrect, itemKeyFor(currentGame, { events: roundEvents }));
}

// ---- Renderer : Carte muette (Europe) ----

let mapState = null;

async function loadEuropeMapInto(container) {
  const res = await fetch("map-europe.svg");
  const svgText = await res.text();
  container.innerHTML = svgText;
}

function renderCarteMuetteItem(row) {
  const data = row.item_data;
  playInstructions.textContent = `${t("mapClickOn")} ${data.name}`;
  itemContainer.innerHTML = `<div class="map-wrap" id="revision-map-wrap"></div>`;
  mapState = { data, answered: false };

  const wrap = document.getElementById("revision-map-wrap");
  loadEuropeMapInto(wrap).then(() => {
    wrap.querySelectorAll(".map-country").forEach((g) => {
      g.addEventListener("click", () => selectCarteMuetteCountry(g.id));
    });
  });

  validateBtn.style.display = "none";
  nextBtn.style.display = "none";
}

function selectCarteMuetteCountry(clickedCode) {
  if (mapState.answered) return;
  mapState.answered = true;

  const { data } = mapState;
  const wrap = document.getElementById("revision-map-wrap");
  const isCorrect = clickedCode === data.code;

  wrap.querySelectorAll(".map-country").forEach((g) => g.classList.add("disabled"));
  const targetEl = wrap.querySelector(`#${data.code}`);
  if (targetEl) targetEl.classList.add("correct");
  if (!isCorrect) {
    const clickedEl = wrap.querySelector(`#${clickedCode}`);
    if (clickedEl) clickedEl.classList.add("wrong");
  }

  const feedbackEl = document.createElement("div");
  feedbackEl.className = "feedback show";
  feedbackEl.innerHTML = isCorrect
    ? `${t("wellSpotted")} ${data.name} ✓`
    : `${t("notQuite")} ${t("exactSentenceWas")} <strong>${data.name}</strong>`;
  itemContainer.appendChild(feedbackEl);

  finishRevisionItem(isCorrect, itemKeyFor(currentGame, data));
}

// ---- Init ----

async function initRevisionPage() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    showScreen("login");
    return;
  }
  await loadMistakes();
}

document.addEventListener("langchange", () => {
  if (listScreen.style.display === "block") renderGameList();
});

initRevisionPage();
