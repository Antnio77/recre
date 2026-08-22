// Enregistre une erreur précise (pour le mode révision). Écrase l'entrée
// existante si le joueur refait la même erreur sur le même item.
async function recordMistake(game, difficulty, itemKey, itemData) {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) return;

  const { error } = await supabaseClient.from("mistakes").upsert(
    {
      user_id: user.id,
      game,
      difficulty,
      lang: currentLang,
      item_key: itemKey,
      item_data: itemData,
    },
    { onConflict: "user_id,game,item_key" }
  );
  if (error) console.error("Erreur lors de l'enregistrement de l'erreur :", error);
}

// Efface une erreur (le joueur l'a corrigée, en jeu normal ou en révision).
async function clearMistake(game, itemKey) {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) return;

  const { error } = await supabaseClient
    .from("mistakes")
    .delete()
    .eq("user_id", user.id)
    .eq("game", game)
    .eq("item_key", itemKey);
  if (error) console.error("Erreur lors de la suppression de l'erreur :", error);
}

// Récupère toutes les erreurs de l'utilisateur, groupées par jeu.
async function fetchMistakesByGame() {
  const { data, error } = await supabaseClient
    .from("mistakes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des erreurs :", error);
    return {};
  }

  const byGame = {};
  (data || []).forEach((row) => {
    if (!byGame[row.game]) byGame[row.game] = [];
    byGame[row.game].push(row);
  });
  return byGame;
}
