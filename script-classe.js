let lastLeaderboard = null;

function renderLeaderboard(rows) {
  const list = document.getElementById("leaderboard-list");
  const rankEmojis = ["🥇", "🥈", "🥉"];

  list.innerHTML = rows
    .map((row, i) => {
      const idx = levelIndexForXp(row.total_xp);
      const rankDisplay = rankEmojis[i] || `#${i + 1}`;
      return `
      <div class="leaderboard-row ${row.is_me ? "me" : ""}">
        <div class="leaderboard-rank">${rankDisplay}</div>
        <div class="leaderboard-emoji">${LEVELS[idx].emoji}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${row.display_name}</div>
          <div class="leaderboard-level">${t("levelWord")} ${idx + 1} · ${levelName(idx)}</div>
        </div>
        <div class="leaderboard-xp">${Math.round(row.total_xp)} ${t("classXpLabel")}</div>
      </div>
    `;
    })
    .join("");
}

async function initClassPage() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;

  const loginPrompt = document.getElementById("login-prompt");
  const noClassCard = document.getElementById("no-class-card");
  const leaderboardCard = document.getElementById("leaderboard-card");

  if (!user) {
    loginPrompt.style.display = "block";
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_classmates_leaderboard");

  if (error || !data || data.length === 0) {
    noClassCard.style.display = "block";
    return;
  }

  const sorted = [...data].sort((a, b) => b.total_xp - a.total_xp);
  lastLeaderboard = sorted;
  leaderboardCard.style.display = "block";
  renderLeaderboard(sorted);
}

document.addEventListener("langchange", () => {
  if (lastLeaderboard) renderLeaderboard(lastLeaderboard);
});

initClassPage();
