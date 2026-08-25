let progressChartInstance = null;
let strengthsChartInstance = null;
let lastScores = null;

const LANG_GAMES = ["orthographe", "dictee", "bonne-phrase", "conjugaison-eclair", "texte-a-trous"];
const HISTGEO_GAMES = ["histoire-geo", "frise-chronologique", "carte-muette"];
const DIFFICULTY_WEIGHT = { facile: 0.6, moyen: 0.8, difficile: 1 };

function categorizeScore(row) {
  if (LANG_GAMES.includes(row.game)) {
    return row.lang === "en" ? "en" : "fr";
  }
  if (HISTGEO_GAMES.includes(row.game)) {
    return "histgeo";
  }
  return "maths";
}

function weightedPct(row) {
  const weight = DIFFICULTY_WEIGHT[row.difficulty] ?? 1;
  return (row.score / row.total) * 100 * weight;
}

function renderProgressChart(scores) {
  const labels = scores.map((_, i) => i + 1);
  const data = scores.map((r) => Math.round(weightedPct(r)));

  const ctx = document.getElementById("progress-chart").getContext("2d");
  if (progressChartInstance) progressChartInstance.destroy();
  progressChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: t("statsScoreAxis"),
          data,
          borderColor: "#6C63FF",
          backgroundColor: "rgba(108,99,255,0.15)",
          fill: true,
          tension: 0.3,
          pointBackgroundColor: "#6C63FF",
          pointRadius: 4,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 100, ticks: { stepSize: 20 } },
        x: { title: { display: true, text: t("statsAttemptAxis") } },
      },
      plugins: { legend: { display: false } },
    },
  });
}

function renderStrengthsChart(scores) {
  const buckets = { fr: [], en: [], maths: [], histgeo: [] };
  scores.forEach((r) => buckets[categorizeScore(r)].push(weightedPct(r)));
  const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

  const ctx = document.getElementById("strengths-chart").getContext("2d");
  if (strengthsChartInstance) strengthsChartInstance.destroy();
  strengthsChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [t("statCategoryFr"), t("statCategoryEn"), t("statCategoryMaths"), t("statCategoryHistgeo")],
      datasets: [
        {
          label: t("statsScoreAxis"),
          data: [avg(buckets.fr), avg(buckets.en), avg(buckets.maths), avg(buckets.histgeo)],
          backgroundColor: "rgba(58,175,169,0.25)",
          borderColor: "#3AAFA9",
          pointBackgroundColor: "#3AAFA9",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
      plugins: { legend: { display: false } },
    },
  });
}

function renderHistory(scores) {
  const list = document.getElementById("history-list");
  const reversed = [...scores].reverse();
  const locale = currentLang === "en" ? "en-US" : "fr-FR";

  list.innerHTML = reversed
    .map((row) => {
      const date = new Date(row.created_at).toLocaleDateString(locale);
      const category = categorizeScore(row);
      const flag = category === "en" ? "🇬🇧" : category === "fr" ? "🇫🇷" : category === "histgeo" ? "🌍" : "🔢";
      const pct = Math.round(weightedPct(row));
      return `
      <div class="score-row">
        <span class="score-game">${flag} ${gameDisplayName(row.game)} <span>(${difficultyLabel(row.difficulty)} · ${date})</span></span>
        <span class="score-value">${row.score} / ${row.total} <span style="font-family:'Work Sans',sans-serif; font-weight:400; color:var(--ink-soft); font-size:12px;">(${pct}%)</span></span>
      </div>
    `;
    })
    .join("");
}

function renderAll(scores) {
  renderProgressChart(scores);
  renderStrengthsChart(scores);
  renderHistory(scores);
}

async function initStats() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;

  const loginPrompt = document.getElementById("login-prompt");
  const statsContent = document.getElementById("stats-content");

  if (!user) {
    loginPrompt.style.display = "block";
    statsContent.style.display = "none";
    return;
  }

  loginPrompt.style.display = "none";
  statsContent.style.display = "block";

  const { data: scores, error } = await supabaseClient
    .from("scores")
    .select("*")
    .order("created_at", { ascending: true });

  const noDataCard = document.getElementById("no-data-card");
  const progressCard = document.getElementById("progress-card");
  const strengthsCard = document.getElementById("strengths-card");
  const historyCard = document.getElementById("history-card");

  if (error || !scores || scores.length === 0) {
    noDataCard.style.display = "block";
    progressCard.style.display = "none";
    strengthsCard.style.display = "none";
    historyCard.style.display = "none";
    return;
  }

  noDataCard.style.display = "none";
  progressCard.style.display = "block";
  strengthsCard.style.display = "block";
  historyCard.style.display = "block";

  lastScores = scores;
  renderAll(scores);
}

document.addEventListener("langchange", () => {
  if (lastScores) renderAll(lastScores);
});

initStats();
