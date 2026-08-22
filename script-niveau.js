let lastScoresForLevel = null;

function renderLevelPage(scores) {
  const xp = totalXp(scores);
  const idx = levelIndexForXp(xp);
  const isMax = idx === LEVELS.length - 1;

  document.getElementById("summary-emoji").textContent = LEVELS[idx].emoji;
  document.getElementById("summary-name").textContent = `${t("levelWord")} ${idx + 1} · ${levelName(idx)}`;
  document.getElementById("summary-xp").textContent = `${xp} ${t("levelCurrentXp")}`;

  const fill = document.getElementById("next-level-fill");
  const label = document.getElementById("next-level-label");

  if (isMax) {
    fill.style.width = "100%";
    label.textContent = t("levelMaxReached");
  } else {
    const currentThreshold = LEVELS[idx].xp;
    const nextThreshold = LEVELS[idx + 1].xp;
    const progressPct = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    fill.style.width = `${Math.max(0, Math.min(100, progressPct))}%`;
    const remaining = nextThreshold - xp;
    label.textContent = `${remaining} ${t("levelNextIn")}`;
  }

  const pathEl = document.getElementById("level-path");
  pathEl.innerHTML = LEVELS.map((lvl, i) => {
    const state = i < idx ? "completed" : i === idx ? "current" : "locked";
    const name = currentLang === "en" ? lvl.en : lvl.fr;
    return `
      <div class="level-node ${state}">
        <div class="level-circle">${lvl.emoji}</div>
        <div class="level-info">
          <div class="level-num">${t("levelWord")} ${i + 1}</div>
          <div class="level-name">${name}</div>
        </div>
      </div>
    `;
  }).join("");
}

async function initLevelPage() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;

  const loginPrompt = document.getElementById("login-prompt");
  const levelContent = document.getElementById("level-content");

  if (!user) {
    loginPrompt.style.display = "block";
    levelContent.style.display = "none";
    return;
  }

  loginPrompt.style.display = "none";
  levelContent.style.display = "block";

  const { data: scores } = await supabaseClient.from("scores").select("score,total,difficulty");
  lastScoresForLevel = scores || [];
  renderLevelPage(lastScoresForLevel);
}

document.addEventListener("langchange", () => {
  if (lastScoresForLevel) renderLevelPage(lastScoresForLevel);
});

initLevelPage();
