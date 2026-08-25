// Duel 1v1 : Calcul mental éclair, par code d'invitation. Les deux joueurs
// jouent en parallèle (pas tour par tour) sur exactement les mêmes calculs,
// chacun voit le score de l'autre progresser en direct (Supabase Realtime,
// avec un filet de sécurité par sondage régulier). Voir setup-duels.sql
// pour le schéma et les fonctions Postgres correspondantes.

// Même pool que script-calcul-mental.js — utilisé uniquement par l'hôte
// pour échantillonner les questions à la création du duel.
const levels = {
  facile: [
    { expr: "8 + 5", answer: 13 }, { expr: "14 − 6", answer: 8 }, { expr: "9 + 7", answer: 16 },
    { expr: "18 − 9", answer: 9 }, { expr: "6 + 6", answer: 12 }, { expr: "20 − 13", answer: 7 },
    { expr: "11 + 4", answer: 15 }, { expr: "17 − 8", answer: 9 }, { expr: "5 + 9", answer: 14 },
    { expr: "16 − 7", answer: 9 }, { expr: "12 + 8", answer: 20 }, { expr: "19 − 11", answer: 8 },
    { expr: "4 + 13", answer: 17 }, { expr: "15 − 9", answer: 6 }, { expr: "10 + 10", answer: 20 },
    { expr: "18 − 12", answer: 6 },
  ],
  moyen: [
    { expr: "7 × 8", answer: 56 }, { expr: "63 ÷ 9", answer: 7 }, { expr: "45 + 38", answer: 83 },
    { expr: "92 − 47", answer: 45 }, { expr: "6 × 9", answer: 54 }, { expr: "72 ÷ 8", answer: 9 },
    { expr: "56 + 29", answer: 85 }, { expr: "81 − 34", answer: 47 }, { expr: "48 ÷ 6", answer: 8 },
    { expr: "9 × 8", answer: 72 }, { expr: "54 ÷ 6", answer: 9 }, { expr: "37 + 46", answer: 83 },
    { expr: "68 − 29", answer: 39 }, { expr: "5 × 12", answer: 60 }, { expr: "84 ÷ 7", answer: 12 },
    { expr: "27 + 58", answer: 85 }, { expr: "93 − 58", answer: 35 }, { expr: "11 × 6", answer: 66 },
  ],
  difficile: [
    { expr: "(4 + 3) × 6", answer: 42 }, { expr: "125 − 68", answer: 57 }, { expr: "12 × 12", answer: 144 },
    { expr: "144 ÷ 12", answer: 12 }, { expr: "(9 − 4) × 8", answer: 40 }, { expr: "256 + 187", answer: 443 },
    { expr: "15 × 6 − 20", answer: 70 }, { expr: "(6 + 2) × 5", answer: 40 }, { expr: "312 − 178", answer: 134 },
    { expr: "13 × 13", answer: 169 }, { expr: "196 ÷ 14", answer: 14 }, { expr: "(11 − 3) × 7", answer: 56 },
    { expr: "348 + 276", answer: 624 }, { expr: "8 × 9 + 17", answer: 89 },
  ],
};

const SESSION_LENGTH = 8;
const TIME_PER_LEVEL = { facile: 15, moyen: 10, difficile: 8 };

let currentDuel = null; // dernière copie connue de la ligne "duels"
let myRole = null;      // "host" | "guest"
let myUserId = null;    // résolu une fois dans initDuelPage() ; ne pas
                         // dépendre de la variable globale currentUser de
                         // script-auth.js, qui se remplit de façon
                         // asynchrone et pourrait ne pas encore être prête
let duelChannel = null;
let pollTimer = null;
let current = 0;
let score = 0;
let validated = false;
let timerTimeout = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- Écrans ----

const screens = {
  login: document.getElementById("login-prompt"),
  choice: document.getElementById("duel-choice-screen"),
  create: document.getElementById("duel-create-screen"),
  join: document.getElementById("duel-join-screen"),
  waiting: document.getElementById("duel-waiting-screen"),
  game: document.getElementById("duel-game-card"),
  result: document.getElementById("duel-result-screen"),
};

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.style.display = key === name ? "block" : "none";
  });
}

// ---- Écran de choix / création / rejoindre ----

document.getElementById("duel-show-create-btn").addEventListener("click", () => {
  if (window.playSound) playSound("click");
  showScreen("create");
});
document.getElementById("duel-show-join-btn").addEventListener("click", () => {
  if (window.playSound) playSound("click");
  showScreen("join");
  document.getElementById("duel-code-input").focus();
});
document.querySelectorAll(".duel-back-to-choice").forEach((btn) => {
  btn.addEventListener("click", () => showScreen("choice"));
});

document.querySelectorAll("#duel-create-screen .difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => createDuel(btn.dataset.level));
});

async function createDuel(difficulty) {
  if (window.playSound) playSound("click");
  const createError = document.getElementById("duel-create-error");
  createError.classList.remove("show");

  const pool = levels[difficulty];
  const chosen = shuffle(pool.map((_, i) => i)).slice(0, Math.min(SESSION_LENGTH, pool.length)).map((i) => pool[i]);

  const { data, error } = await supabaseClient.rpc("create_duel", {
    p_difficulty: difficulty,
    p_questions: chosen,
  });

  if (error || !data || !data[0]) {
    console.error("Erreur create_duel :", error);
    if (window.playSound) playSound("wrong");
    createError.classList.add("show");
    return;
  }

  myRole = "host";
  const duelId = data[0].id;
  history.replaceState(null, "", `duel-calcul-mental.html?code=${data[0].code}`);
  await fetchAndEnterDuel(duelId);
}

const joinForm = document.getElementById("duel-join-form");
const joinError = document.getElementById("duel-join-error");
joinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codeInput = document.getElementById("duel-code-input");
  const code = codeInput.value.trim().toUpperCase();
  if (!code) return;

  joinError.classList.remove("show");
  const submitBtn = document.getElementById("duel-join-submit");
  submitBtn.disabled = true;

  const { data: duelId, error } = await supabaseClient.rpc("join_duel", { p_code: code });
  submitBtn.disabled = false;

  if (error || !duelId) {
    if (window.playSound) playSound("wrong");
    joinError.textContent = t("duelJoinError");
    joinError.classList.add("show");
    return;
  }

  if (window.playSound) playSound("correct");
  myRole = "guest";
  history.replaceState(null, "", `duel-calcul-mental.html?code=${code}`);
  await fetchAndEnterDuel(duelId);
});

// ---- Récupération + abonnement temps réel ----

async function fetchAndEnterDuel(duelId) {
  const { data, error } = await supabaseClient.from("duels").select("*").eq("id", duelId).maybeSingle();
  if (error || !data) {
    console.error("Erreur chargement duel :", error);
    showScreen("choice");
    return;
  }
  currentDuel = data;
  if (myRole === null) {
    myRole = data.host_user_id === myUserId ? "host" : "guest";
  }
  subscribeToDuel(duelId);
  startPolling(duelId);
  renderForCurrentState();
}

function subscribeToDuel(duelId) {
  if (duelChannel) supabaseClient.removeChannel(duelChannel);
  duelChannel = supabaseClient
    .channel(`duel-${duelId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "duels", filter: `id=eq.${duelId}` },
      (payload) => applyDuelUpdate(payload.new)
    )
    .subscribe();
}

// Filet de sécurité : en plus du temps réel, on re-vérifie l'état toutes
// les 3 secondes tant que la partie n'est pas terminée (si jamais l'abonnement
// temps réel ne se déclenche pas pour une raison ou une autre).
function startPolling(duelId) {
  stopPolling();
  pollTimer = setInterval(async () => {
    if (!currentDuel || currentDuel.status === "finished") {
      stopPolling();
      return;
    }
    const { data } = await supabaseClient.from("duels").select("*").eq("id", duelId).maybeSingle();
    if (data) applyDuelUpdate(data);
  }, 3000);
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

function applyDuelUpdate(row) {
  const wasInProgress = currentDuel && currentDuel.status === "in_progress";
  const wasWaiting = currentDuel && currentDuel.status === "waiting";
  currentDuel = row;

  if (wasWaiting && row.status === "in_progress" && screens.waiting.style.display === "block") {
    startDuelGame();
    return;
  }
  if (screens.waiting.style.display === "block") {
    renderWaitingRoom();
  }
  if (screens.game.style.display === "block") {
    updateOpponentBadge();
  }
  if ((wasInProgress || screens.result.style.display === "block") && row.status === "finished") {
    showDuelResult();
  }
}

function opponentField(field) {
  const prefix = myRole === "host" ? "guest" : "host";
  return currentDuel[`${prefix}_${field}`];
}
function myField(field) {
  return currentDuel[`${myRole}_${field}`];
}

// ---- Salle d'attente ----

function renderForCurrentState() {
  if (currentDuel.status === "finished") {
    showDuelResult();
  } else if (currentDuel.status === "in_progress") {
    startDuelGame();
  } else {
    showScreen("waiting");
    renderWaitingRoom();
  }
}

function renderWaitingRoom() {
  document.getElementById("duel-code-display").textContent = currentDuel.code;
  const hostName = currentDuel.host_name;
  const guestName = currentDuel.guest_name;
  const meName = myRole === "host" ? hostName : guestName;
  const oppName = myRole === "host" ? guestName : hostName;

  document.getElementById("duel-you-name").textContent = `${meName} (${t("duelPlayerYou")})`;
  document.getElementById("duel-opponent-name").textContent = oppName || t("duelWaitingForOpponent");
  document.getElementById("duel-you-ready").style.display = myField("ready") ? "inline" : "none";
  document.getElementById("duel-opponent-ready").style.display = opponentField("ready") ? "inline" : "none";

  const readyBtn = document.getElementById("duel-ready-btn");
  const bothPresent = !!(currentDuel.host_user_id && currentDuel.guest_user_id);
  readyBtn.style.display = bothPresent && !myField("ready") ? "inline-block" : "none";
  document.getElementById("duel-waiting-ready-hint").style.display = bothPresent && myField("ready") ? "block" : "none";
}

document.getElementById("duel-ready-btn").addEventListener("click", async () => {
  if (window.playSound) playSound("click");
  await supabaseClient.rpc("set_duel_ready", { p_duel_id: currentDuel.id });
  const { data } = await supabaseClient.from("duels").select("*").eq("id", currentDuel.id).maybeSingle();
  if (data) applyDuelUpdate(data);
});

document.getElementById("duel-copy-link-btn").addEventListener("click", () => {
  const url = `${location.origin}${location.pathname}?code=${currentDuel.code}`;
  navigator.clipboard.writeText(url).then(() => {
    const msg = document.getElementById("duel-copy-confirm");
    msg.classList.add("show");
    setTimeout(() => msg.classList.remove("show"), 2000);
  });
});

// ---- Partie (adapté de script-calcul-mental.js) ----

const expressionEl = document.getElementById("duel-expression");
const answerInput = document.getElementById("duel-answer-input");
const timerFill = document.getElementById("duel-timer-fill");
const validateBtn = document.getElementById("duel-validate-btn");
const nextBtn = document.getElementById("duel-next-btn");
const feedbackEl = document.getElementById("duel-feedback");
const progressLabel = document.getElementById("duel-progress-label");
const opponentBadge = document.getElementById("duel-opponent-badge");
const keypadContainer = document.getElementById("duel-keypad-container");

createKeypad(keypadContainer, answerInput);

function startDuelGame() {
  current = 0;
  score = 0;
  showScreen("game");
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

function updateOpponentBadge() {
  const oppName = myRole === "host" ? currentDuel.guest_name : currentDuel.host_name;
  const oppScore = opponentField("score");
  opponentBadge.textContent = `${oppName || t("duelOpponentScore")} : ${oppScore}`;
  opponentBadge.classList.toggle("finished", !!opponentField("finished"));
}

function renderQuestion() {
  validated = false;
  answerInput.value = "";
  answerInput.disabled = false;
  feedbackEl.classList.remove("show");
  feedbackEl.innerHTML = "";
  validateBtn.style.display = "inline-block";
  nextBtn.style.display = "none";

  const questions = currentDuel.questions;
  const data = questions[current];
  expressionEl.textContent = `${data.expr} = ?`;
  progressLabel.textContent = `${t("sentenceWord")} ${current + 1} / ${questions.length} · ${t("scoreWord")} : ${score}`;
  updateOpponentBadge();

  answerInput.focus();
  startTimer(TIME_PER_LEVEL[currentDuel.difficulty]);
}

async function validate(timedOut) {
  if (validated) return;
  validated = true;
  clearTimer();
  answerInput.disabled = true;

  const questions = currentDuel.questions;
  const data = questions[current];
  const typed = answerInput.value.trim().replace(",", ".");
  const typedNum = parseFloat(typed);
  const isCorrect = !isNaN(typedNum) && Math.abs(typedNum - data.answer) < 0.01;
  if (window.playSound) playSound(isCorrect ? "correct" : "wrong");

  if (isCorrect) score++;

  const isLast = current >= questions.length - 1;
  // Mise à jour optimiste locale : on n'attend pas l'aller-retour réseau
  // pour que currentDuel reflète mon propre score/statut (il reste sinon
  // périmé pour moi-même jusqu'au prochain evenement temps réel/sondage,
  // alors que je le connais déjà avec certitude).
  currentDuel[`${myRole}_score`] = Math.max(currentDuel[`${myRole}_score`], score);
  currentDuel[`${myRole}_finished`] = currentDuel[`${myRole}_finished`] || isLast;
  supabaseClient.rpc("update_duel_progress", {
    p_duel_id: currentDuel.id,
    p_score: score,
    p_finished: isLast,
  });

  const prefix = timedOut ? `${t("timeUp")} ` : "";
  feedbackEl.innerHTML = isCorrect
    ? `${prefix}${t("wellSpotted")} ${data.expr} = ${data.answer} ✓`
    : `${prefix}${t("notQuite")} ${t("exactSentenceWas")} <strong>${data.answer}</strong>`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${t("sentenceWord")} ${current + 1} / ${questions.length} · ${t("scoreWord")} : ${score}`;
  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function nextQuestion() {
  current++;
  if (current >= currentDuel.questions.length) {
    showWaitingForOpponentOrResult();
  } else {
    renderQuestion();
  }
}

function showWaitingForOpponentOrResult() {
  clearTimer();
  if (opponentField("finished")) {
    showDuelResult();
  } else {
    showScreen("result");
    document.getElementById("duel-result-content").style.display = "none";
    document.getElementById("duel-waiting-opponent-finish").style.display = "block";
  }
}

function showDuelResult() {
  stopPolling();
  if (window.playSound) playSound("success");
  showScreen("result");
  document.getElementById("duel-waiting-opponent-finish").style.display = "none";
  const resultContent = document.getElementById("duel-result-content");
  resultContent.style.display = "block";

  const myScore = myField("score");
  const oppScore = opponentField("score");
  const oppName = myRole === "host" ? currentDuel.guest_name : currentDuel.host_name;

  document.getElementById("duel-you-score").textContent = myScore;
  document.getElementById("duel-opponent-score-final").textContent = oppScore;
  document.getElementById("duel-opponent-name-final").textContent = oppName;

  const titleEl = document.getElementById("duel-result-title");
  if (myScore > oppScore) titleEl.textContent = t("duelResultWin");
  else if (myScore < oppScore) titleEl.textContent = t("duelResultLose");
  else titleEl.textContent = t("duelResultTie");
}

validateBtn.addEventListener("click", () => validate(false));
nextBtn.addEventListener("click", nextQuestion);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !validated) validate(false);
});

document.querySelectorAll(".duel-new-duel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (duelChannel) supabaseClient.removeChannel(duelChannel);
    stopPolling();
    history.replaceState(null, "", "duel-calcul-mental.html");
    currentDuel = null;
    myRole = null;
    showScreen("choice");
  });
});

// ---- Démarrage ----

async function initDuelPage() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    showScreen("login");
    return;
  }
  myUserId = user.id;

  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  if (code) {
    // Si on est déjà participant de ce duel (rechargement de page en cours
    // de partie, ou retour sur un lien déjà rejoint), on reprend directement
    // là où on en était plutôt que de re-proposer de le rejoindre.
    const { data } = await supabaseClient.from("duels").select("*").eq("code", code.toUpperCase()).maybeSingle();
    if (data) {
      myRole = data.host_user_id === myUserId ? "host" : "guest";
      currentDuel = data;
      subscribeToDuel(data.id);
      startPolling(data.id);
      renderForCurrentState();
      return;
    }
    document.getElementById("duel-code-input").value = code.toUpperCase();
    showScreen("join");
  } else {
    showScreen("choice");
  }
}

initDuelPage();
