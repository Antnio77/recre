// Mini-jeux bonus : récompenses purement ludiques débloquées par palier
// d'XP (voir script-xp.js pour LEVELS/totalXp/levelIndexForXp). Ce ne sont
// pas des jeux "éducatifs" comme les autres — ils ne remontent aucun score
// dans Supabase et ne comptent pas dans les statistiques : c'est juste la
// récompense du palier, pas une nouvelle façon de grinder de l'XP.
const MINI_GAMES = [
  {
    id: "coupe-en-deux",
    href: "coupe-en-deux.html",
    emoji: "✂️",
    color: "#8B5CF6",
    colorDark: "#6D46D1",
    titleKey: "coupeTitle",
    descKey: "coupeDesc",
    unlockPalier: 3,
  },
];

let lastPalierForMiniGames = null;

function renderMiniGames(currentPalier) {
  lastPalierForMiniGames = currentPalier;
  const grid = document.getElementById("mini-games-grid");
  grid.innerHTML = MINI_GAMES.map((g) => {
    const unlocked = currentPalier >= g.unlockPalier;
    const title = t(g.titleKey);
    const desc = t(g.descKey);
    if (unlocked) {
      return `
        <a class="tile tile--live" href="${g.href}" style="--tile-color:${g.color}; --tile-color-dark:${g.colorDark};">
          <span class="tile-badge" style="font-size:28px;">${g.emoji}</span>
          <h2>${title}</h2>
          <p>${desc}</p>
          <span class="tile-tag">${t("playBtn")}</span>
        </a>
      `;
    }
    return `
      <div class="tile tile--soon">
        <span class="tile-badge" style="font-size:28px; filter:grayscale(1);">${g.emoji}</span>
        <h2>${title}</h2>
        <p>${desc}</p>
        <span class="tile-tag">${t("miniGamesLockedPrefix")} ${g.unlockPalier}</span>
      </div>
    `;
  }).join("");
}

async function initMiniGames() {
  const loginPrompt = document.getElementById("login-prompt");
  const grid = document.getElementById("mini-games-grid");

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    loginPrompt.style.display = "block";
    grid.style.display = "none";
    return;
  }
  loginPrompt.style.display = "none";
  grid.style.display = "grid";

  const { data: scores } = await supabaseClient.from("scores").select("score,total,difficulty");
  const xp = totalXp(scores || []);
  const idx = levelIndexForXp(xp);
  renderMiniGames(idx + 1);
}

document.addEventListener("langchange", () => {
  if (lastPalierForMiniGames !== null) renderMiniGames(lastPalierForMiniGames);
});

initMiniGames();
