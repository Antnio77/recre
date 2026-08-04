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

const GAME_NAMES = {
  orthographe: "Chasse aux fautes",
  dictee: "Dictée vocale",
  "bonne-phrase": "La bonne phrase",
};

function openModal(modal) {
  modal.classList.add("show");
}
function closeModal(modal) {
  modal.classList.remove("show");
}

function setAuthTab(tab) {
  authTabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
  loginForm.style.display = tab === "login" ? "block" : "none";
  signupForm.style.display = tab === "signup" ? "block" : "none";
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

function translateError(message) {
  if (message.includes("Invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (message.includes("already registered") || message.includes("already exists")) return "Un compte existe déjà avec cet email.";
  if (message.includes("Password should be")) return "Le mot de passe doit faire au moins 6 caractères.";
  if (message.includes("Unable to validate email")) return "Cette adresse email n'est pas valide.";
  return "Une erreur est survenue. Réessaie.";
}

function updateLoginBtn() {
  loginBtn.innerHTML = currentUser
    ? `<span class="avatar-dot"></span> Mon compte`
    : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="2"/>
        <path d="M5 19c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg> Se connecter`;
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
    showAuthError("Merci de remplir tous les champs.");
    return;
  }
  hideAuthError();
  loginSubmit.disabled = true;
  loginSubmit.textContent = "Connexion...";
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  loginSubmit.disabled = false;
  loginSubmit.textContent = "Se connecter";
  if (error) {
    showAuthError(translateError(error.message));
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
    showAuthError("Merci de remplir tous les champs.");
    return;
  }
  if (password.length < 6) {
    showAuthError("Le mot de passe doit faire au moins 6 caractères.");
    return;
  }
  hideAuthError();
  signupSubmit.disabled = true;
  signupSubmit.textContent = "Création...";
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  signupSubmit.disabled = false;
  signupSubmit.textContent = "Créer mon compte";
  if (error) {
    showAuthError(translateError(error.message));
    return;
  }
  currentUser = data.user;
  updateLoginBtn();
  closeModal(authModal);
});

async function openAccountModal() {
  accountEmail.textContent = currentUser.email;
  accountScores.innerHTML = `<p class="instructions">Chargement des scores...</p>`;
  openModal(accountModal);

  const { data, error } = await supabaseClient
    .from("scores")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data || data.length === 0) {
    accountScores.innerHTML = `<p class="instructions">Aucun score enregistré pour l'instant. Joue à un jeu pour commencer !</p>`;
    return;
  }

  accountScores.innerHTML = data
    .map(
      (row) => `
    <div class="score-row">
      <span class="score-game">${GAME_NAMES[row.game] || row.game} <span>(${row.difficulty})</span></span>
      <span class="score-value">${row.score} / ${row.total}</span>
    </div>
  `
    )
    .join("");
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
  await supabaseClient.from("scores").insert({
    user_id: currentUser.id,
    game,
    difficulty,
    score,
    total,
  });
};

refreshSession();
