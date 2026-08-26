// Mécanique de la "fenêtre de récompense" : à chaque fois qu'un joueur
// franchit un nouveau palier d'XP (script-xp.js), l'ensemble des mini-jeux
// bonus devient accessible pendant 15 minutes, puis se reverrouille jusqu'au
// palier suivant. Contrairement au premier essai (un jeu débloqué en
// permanence à un palier donné), c'est donc un accès TEMPORAIRE, remis à
// zéro par chaque nouveau palier — pas une progression cumulative.
//
// Suivi entièrement côté navigateur (localStorage), pas de nouvelle table
// Supabase : le palier "vu" et la date de fin de fenêtre sont propres à cet
// appareil/navigateur. Un même compte utilisé sur deux appareils peut donc
// avoir des fenêtres désynchronisées — accepté comme limitation simple pour
// une fonctionnalité 100% bonus, pas de score en jeu.
//
// Ce script doit être inclus sur TOUTES les pages (après script-xp.js et
// script-auth.js) pour que la détection de passage de palier se déclenche
// dès qu'on navigue quelque part après avoir gagné de l'XP — pas seulement
// sur les pages des mini-jeux.

const REWARD_WINDOW_MS = 15 * 60 * 1000;
const LS_LAST_PALIER = "recre-last-palier-seen";
const LS_WINDOW_UNTIL = "recre-reward-window-until";

function isRewardWindowActive() {
  const until = parseInt(localStorage.getItem(LS_WINDOW_UNTIL) || "0", 10);
  return Date.now() < until;
}

function rewardWindowRemainingMs() {
  const until = parseInt(localStorage.getItem(LS_WINDOW_UNTIL) || "0", 10);
  return Math.max(0, until - Date.now());
}

// Affiche un compte à rebours "⏱️ 14:59" dans l'élément fourni tant que la
// fenêtre est active, et exécute onExpire() (une seule fois) quand elle se
// termine. Utilisé par le hub des mini-jeux et par chaque mini-jeu.
function startRewardCountdown(el, onExpire) {
  let done = false;
  function tick() {
    const ms = rewardWindowRemainingMs();
    if (ms <= 0) {
      el.textContent = "";
      if (!done) { done = true; if (onExpire) onExpire(); }
      return;
    }
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    el.textContent = `⏱️ ${m}:${String(s).padStart(2, "0")}`;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}

// Vérification d'accès standard pour un mini-jeu : connexion requise, puis
// fenêtre de récompense active requise. onUnlock() est appelée une fois
// l'accès validé (affiche l'écran de choix de difficulté ou le jeu
// lui-même, selon le mini-jeu). Si la fenêtre expire pendant que le joueur
// consulte cette page (mais pas en pleine partie : on ne l'interrompt pas,
// on vérifie juste au chargement puis au tic du compte à rebours),
// onExpire() reverrouille l'écran.
async function initMiniGameAccess({ loginPrompt, windowLocked, countdownEl, onUnlock, onExpire }) {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    loginPrompt.style.display = "block";
    return;
  }
  // On revérifie un éventuel passage de palier tout juste survenu, pour
  // éviter une fenêtre "pas encore vue" par cette page précise.
  await checkForLevelUp();
  if (!isRewardWindowActive()) {
    windowLocked.style.display = "block";
    return;
  }
  onUnlock();
  if (countdownEl) {
    startRewardCountdown(countdownEl, () => { if (onExpire) onExpire(); });
  }
}

async function checkForLevelUp() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) return;

  const { data: scores } = await supabaseClient.from("scores").select("score,total,difficulty");
  const xp = totalXp(scores || []);
  const currentPalier = levelIndexForXp(xp) + 1;

  const lastSeen = localStorage.getItem(LS_LAST_PALIER);
  if (lastSeen === null) {
    // Premier passage sur cet appareil : on mémorise le palier actuel sans
    // ouvrir de fenêtre, pour ne récompenser que les VRAIS futurs passages.
    localStorage.setItem(LS_LAST_PALIER, String(currentPalier));
    return;
  }

  const lastPalier = parseInt(lastSeen, 10);
  if (currentPalier > lastPalier) {
    localStorage.setItem(LS_WINDOW_UNTIL, String(Date.now() + REWARD_WINDOW_MS));
    localStorage.setItem(LS_LAST_PALIER, String(currentPalier));
  }
}

checkForLevelUp();
