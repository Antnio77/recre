let isPremiumUser = false;

async function checkPremiumStatus() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    isPremiumUser = false;
    return false;
  }
  const { data } = await supabaseClient
    .from("premium_status")
    .select("is_premium")
    .eq("user_id", user.id)
    .maybeSingle();
  isPremiumUser = !!(data && data.is_premium);
  return isPremiumUser;
}

async function redeemPremiumCode(code) {
  const { data, error } = await supabaseClient.rpc("redeem_premium_code", {
    input_code: code.trim(),
  });
  if (error) {
    console.error("Erreur lors de la validation du code :", error);
    return false;
  }
  if (data) isPremiumUser = true;
  return !!data;
}

// Branché automatiquement sur la modale "Mon compte" si les éléments
// premium-code-input / premium-code-btn / premium-code-message /
// premium-badge existent sur la page.
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("premium-code-btn");
  const input = document.getElementById("premium-code-input");
  const message = document.getElementById("premium-code-message");
  if (!btn || !input) return;

  btn.addEventListener("click", async () => {
    if (!input.value.trim()) return;
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "...";
    const success = await redeemPremiumCode(input.value);
    btn.disabled = false;
    btn.textContent = originalText;
    if (success) {
      message.textContent = t("premiumCodeSuccess");
      message.className = "auth-error show";
      message.style.background = "#DFF3E4";
      message.style.color = "#2C7A46";
      input.value = "";
      updatePremiumBadge();
    } else {
      message.textContent = t("premiumCodeError");
      message.className = "auth-error show";
      message.style.background = "";
      message.style.color = "";
    }
  });
});

async function updatePremiumBadge() {
  const badge = document.getElementById("premium-badge");
  if (!badge) return;
  await checkPremiumStatus();
  badge.style.display = isPremiumUser ? "inline-flex" : "none";
}

updatePremiumBadge();
document.addEventListener("langchange", updatePremiumBadge);
