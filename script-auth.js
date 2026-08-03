let isLoggedIn = false;

const authModal = document.getElementById("auth-modal");
const loginBtn = document.getElementById("login-btn");
const modalClose = document.getElementById("modal-close");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authTabs = document.querySelectorAll(".auth-tab");
const loginSubmit = document.getElementById("login-submit");
const signupSubmit = document.getElementById("signup-submit");

function openAuthModal() {
  authModal.classList.add("show");
}
function closeAuthModal() {
  authModal.classList.remove("show");
}
function setAuthTab(tab) {
  authTabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
  loginForm.style.display = tab === "login" ? "block" : "none";
  signupForm.style.display = tab === "signup" ? "block" : "none";
}
function updateLoginBtn() {
  loginBtn.innerHTML = isLoggedIn
    ? `<span class="avatar-dot"></span> Mon compte`
    : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="2"/>
        <path d="M5 19c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg> Se connecter`;
}

loginBtn.addEventListener("click", () => {
  if (isLoggedIn) {
    isLoggedIn = false;
    updateLoginBtn();
  } else {
    setAuthTab("login");
    openAuthModal();
  }
});
modalClose.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal();
});
authTabs.forEach((tab) => {
  tab.addEventListener("click", () => setAuthTab(tab.dataset.tab));
});
loginSubmit.addEventListener("click", () => {
  isLoggedIn = true;
  updateLoginBtn();
  closeAuthModal();
});
signupSubmit.addEventListener("click", () => {
  isLoggedIn = true;
  updateLoginBtn();
  closeAuthModal();
});

updateLoginBtn();
