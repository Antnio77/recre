const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

const authModal = document.getElementById("auth-modal");
const accountModal = document.getElementById("account-modal");
const loginBtn = document.getElementById("login-btn");
const modalClose = document.getElementById("modal-close");
const accountModalClose = document.getElementById("account-modal-close");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authTabs = document.querySelectorAll(".auth-tab");
const loginSubmit = document.getElementById("login-submit");
const signupSubmit = document.getElementById("signup-submit");
const authError = document.getElementById("auth-error");
const accountEmail = document.getElementById("account-email");
const accountScores = document.getElementById("account-scores");
const logoutBtn = document.getElementById("logout-btn");

function gameDisplayName(game) {
  if (game === "orthographe") return t("tile1Title");
  if (game === "dictee") return t("tile2Title");
  if (game === "bonne-phrase") return t("tile3Title");
  if (game === "calcul-mental") return t("tile4Title");
  if (game === "bon-resultat-maths") return t("tile5Title");
  if (game === "problemes-quotidien") return t("tile6Title");
  if (game === "conjugaison-eclair") return t("tile7Title");
  if (game === "texte-a-trous") return t("tile8Title");
  if (game === "problemes-multi-etapes") return t("tile9Title");
  if (game === "geometrie-eclair") return t("tile10Title");
  return game;
}

function openModal(modal) {
  modal.classList.add("show");
}
function closeModal(modal) {
  modal.classList.remove("show");
}

function setAuthTab(tabName) {
  authTabs.forEach((tabBtn) => tabBtn.classList.toggle("active", tabBtn.dataset.tab === tabName));
  loginForm.style.display = tabName === "login" ? "block" : "none";
  signupForm.style.display = tabName === "signup" ? "block" : "none";
  hideAuthError();
}

function showAuthError(message) {
  authError.textContent = message;
  authError.classList.add("show");
}
function hideAuthError() {
  authError.textContent = "";
  authError.classList.remove("show");
}

function translateSupabaseError(message) {
  console.error("Erreur Supabase brute :", message);
  if (message.includes("Invalid login credentials")) return t("errWrongCredentials");
  if (message.includes("already registered") || message.includes("already exists")) return t("errAlreadyRegistered");
  if (message.includes("Password should be")) return t("passwordTooShort");
  if (message.includes("Unable to validate email")) return t("errInvalidEmail");
  return t("errGeneric");
}

function updateLoginBtn() {
  loginBtn.innerHTML = currentUser
    ? `<span class="avatar-dot"></span> ${t("accountBtnText")}`
    : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="2"/>
        <path d="M5 19c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg> ${t("loginBtnText")}`;
}

async function refreshSession() {
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session ? data.session.user : null;
  updateLoginBtn();
}

loginBtn.addEventListener("click", () => {
  if (currentUser) {
    openAccountModal();
  } else {
    setAuthTab("login");
    openModal(authModal);
  }
});

modalClose.addEventListener("click", () => closeModal(authModal));
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeModal(authModal);
});
authTabs.forEach((tab) => tab.addEventListener("click", () => setAuthTab(tab.dataset.tab)));

loginSubmit.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  if (!email || !password) {
    showAuthError(t("fillAllFields"));
    return;
  }
  hideAuthError();
  loginSubmit.disabled = true;
  loginSubmit.textContent = t("loggingIn");
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  loginSubmit.disabled = false;
  loginSubmit.textContent = t("loginSubmitBtn");
  if (error) {
    showAuthError(translateSupabaseError(error.message));
    return;
  }
  currentUser = data.user;
  updateLoginBtn();
  closeModal(authModal);
});

signupSubmit.addEventListener("click", async () => {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  if (!name || !email || !password) {
    showAuthError(t("fillAllFields"));
    return;
  }
  if (password.length < 6) {
    showAuthError(t("passwordTooShort"));
    return;
  }
  hideAuthError();
  signupSubmit.disabled = true;
  signupSubmit.textContent = t("signingUp");
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  signupSubmit.disabled = false;
  signupSubmit.textContent = t("signupSubmitBtn");
  if (error) {
    showAuthError(translateSupabaseError(error.message));
    return;
  }
  currentUser = data.user;
  updateLoginBtn();
  closeModal(authModal);
});

async function openAccountModal() {
  accountEmail.textContent = currentUser.email;
  accountScores.innerHTML = `<p class="instructions">${t("loadingScores")}</p>`;
  openModal(accountModal);

  const { data, error } = await supabaseClient
    .from("scores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    accountScores.innerHTML = `<p class="instructions">${t("noScores")}</p>`;
    return;
  }

  const byGame = {};
  data.forEach((row) => {
    if (!byGame[row.game]) byGame[row.game] = [];
    byGame[row.game].push(row);
  });

  const rowsHtml = Object.entries(byGame)
    .map(([game, rows]) => {
      const bestPct = Math.round(Math.max(...rows.map((r) => (r.score / r.total) * 100)));
      return `
      <div class="score-row">
        <span class="score-game">${gameDisplayName(game)} <span>(${rows.length} ${t("attemptsWord")})</span></span>
        <span class="score-value">${bestPct}%</span>
      </div>
    `;
    })
    .join("");

  accountScores.innerHTML = `
    ${rowsHtml}
    <a class="btn btn-primary" href="stats.html" style="width:100%; margin-top:18px; display:block; text-align:center; box-sizing:border-box;" data-i18n="viewStatsBtn">${t("viewStatsBtn")}</a>
  `;
}

accountModalClose.addEventListener("click", () => closeModal(accountModal));
accountModal.addEventListener("click", (e) => {
  if (e.target === accountModal) closeModal(accountModal);
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  currentUser = null;
  updateLoginBtn();
  closeModal(accountModal);
});

// Fonction appelée par les jeux (script-orthographe.js, script-dictee.js,
// script-bonne-phrase.js) à la fin d'une partie pour sauvegarder le score.
// Ne fait rien si personne n'est connecté.
window.saveScore = async function (game, difficulty, score, total) {
  if (!currentUser) return;
  const { error } = await supabaseClient.from("scores").insert({
    user_id: currentUser.id,
    game,
    difficulty,
    score,
    total,
    lang: currentLang,
  });
  if (error) {
    console.error("Erreur lors de la sauvegarde du score :", error);
  } else {
    console.log("Score sauvegardé avec succès :", { game, difficulty, score, total, lang: currentLang });
  }
};

// Si la modale "Mon compte" est ouverte au moment où la langue change,
// on la re-rend pour traduire les noms de jeux affichés.
document.addEventListener("langchange", () => {
  if (currentUser && accountModal.classList.contains("show")) {
    openAccountModal();
  }
});

refreshSession();
