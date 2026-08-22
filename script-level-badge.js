async function updateLevelBadge() {
  const badgeEmoji = document.getElementById("level-badge-emoji");
  const badgeText = document.getElementById("level-badge-text");
  if (!badgeEmoji || !badgeText) return;

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;

  if (!user) {
    badgeEmoji.textContent = "🔒";
    badgeText.textContent = t("levelBadgeLoginPrompt");
    return;
  }

  const { data: scores } = await supabaseClient.from("scores").select("score,total,difficulty");
  const xp = totalXp(scores || []);
  const idx = levelIndexForXp(xp);

  badgeEmoji.textContent = LEVELS[idx].emoji;
  badgeText.textContent = `${t("levelWord")} ${idx + 1}`;
}

document.addEventListener("langchange", updateLevelBadge);
updateLevelBadge();
