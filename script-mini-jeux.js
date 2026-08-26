// Mini-jeux bonus : récompenses purement ludiques. Ce ne sont pas des jeux
// "éducatifs" comme les autres — ils ne remontent aucun score dans Supabase
// et ne comptent pas dans les statistiques. Tous les mini-jeux s'ouvrent
// ENSEMBLE pendant 15 minutes à chaque passage de palier (voir
// script-reward-window.js), puis se reverrouillent jusqu'au palier suivant
// — ce n'est donc plus un déblocage individuel et permanent par jeu.
const MINI_GAMES = [
  {
    id: "coupe-en-deux",
    href: "coupe-en-deux.html",
    emoji: "✂️",
    color: "#8B5CF6",
    colorDark: "#6D46D1",
    titleKey: "coupeTitle",
    descKey: "coupeDesc",
  },
  {
    id: "serpent",
    href: "serpent.html",
    emoji: "🐍",
    color: "#3AAFA9",
    colorDark: "#2C8C87",
    titleKey: "serpentTitle",
    descKey: "serpentDesc",
  },
  {
    id: "memoire",
    href: "memoire.html",
    emoji: "🃏",
    color: "#EF6461",
    colorDark: "#C94E4C",
    titleKey: "memoireTitle",
    descKey: "memoireDesc",
  },
  {
    id: "reflexe-eclair",
    href: "reflexe-eclair.html",
    emoji: "🎯",
    color: "#FFC145",
    colorDark: "#DE9E1A",
    titleKey: "reflexeTitle",
    descKey: "reflexeDesc",
  },
];

function renderMiniGamesGrid() {
  const grid = document.getElementById("mini-games-grid");
  grid.innerHTML = MINI_GAMES.map((g) => `
    <a class="tile tile--live" href="${g.href}" style="--tile-color:${g.color}; --tile-color-dark:${g.colorDark};">
      <span class="tile-badge" style="font-size:28px;">${g.emoji}</span>
      <h2>${t(g.titleKey)}</h2>
      <p>${t(g.descKey)}</p>
      <span class="tile-tag">${t("playBtn")}</span>
    </a>
  `).join("");
}

async function initMiniGames() {
  renderMiniGamesGrid();
  await initMiniGameAccess({
    loginPrompt: document.getElementById("login-prompt"),
    windowLocked: document.getElementById("window-locked"),
    countdownEl: document.getElementById("reward-countdown"),
    onUnlock: () => { document.getElementById("window-open").style.display = "block"; },
    onExpire: () => {
      document.getElementById("window-open").style.display = "none";
      document.getElementById("window-locked").style.display = "block";
    },
  });
}

document.addEventListener("langchange", renderMiniGamesGrid);

initMiniGames();
