const LANG_GAMES = ["orthographe", "dictee", "bonne-phrase", "conjugaison-eclair", "texte-a-trous"];
const HISTGEO_GAMES = ["histoire-geo", "frise-chronologique"];
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
  if (!row.total) return 0;
  const weight = DIFFICULTY_WEIGHT[row.difficulty] ?? 1;
  return (row.score / row.total) * 100 * weight;
}

let myClasses = [];
let currentClassId = null;
let currentStudents = null;

function groupByStudent(rows) {
  const byStudent = {};
  rows.forEach((row) => {
    if (!byStudent[row.student_email]) {
      byStudent[row.student_email] = {
        name: row.student_name,
        email: row.student_email,
        scores: [],
      };
    }
    if (row.game) {
      byStudent[row.student_email].scores.push(row);
    }
  });
  return Object.values(byStudent);
}

function renderStudents(students) {
  const list = document.getElementById("students-list");

  list.innerHTML = students
    .map((student, i) => {
      const scores = student.scores;
      const totalXp = scores.reduce((sum, r) => sum + xpForRow(r), 0);
      const levelIdx = levelIndexForXp(totalXp);

      const buckets = { fr: [], en: [], maths: [], histgeo: [] };
      scores.forEach((r) => buckets[categorizeScore(r)].push(weightedPct(r)));
      const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
      const frPct = avg(buckets.fr);
      const enPct = avg(buckets.en);
      const mathsPct = avg(buckets.maths);
      const histgeoPct = avg(buckets.histgeo);

      const byGame = {};
      scores.forEach((r) => {
        if (!byGame[r.game]) byGame[r.game] = [];
        byGame[r.game].push(weightedPct(r));
      });
      const gameRows = Object.entries(byGame)
        .map(([game, vals]) => `
          <div class="score-row">
            <span class="score-game">${gameDisplayName(game)} <span>(${vals.length} ${t("attemptsWord")})</span></span>
            <span class="score-value">${avg(vals)}%</span>
          </div>
        `)
        .join("");

      const historyRows = [...scores]
        .sort((a, b) => new Date(b.played_at) - new Date(a.played_at))
        .map((r) => {
          const date = new Date(r.played_at).toLocaleDateString(currentLang === "en" ? "en-US" : "fr-FR");
          const cat = categorizeScore(r);
          const flag = cat === "en" ? "🇬🇧" : cat === "fr" ? "🇫🇷" : cat === "histgeo" ? "🌍" : "🔢";
          return `
          <div class="score-row">
            <span class="score-game">${flag} ${gameDisplayName(r.game)} <span>(${difficultyLabel(r.difficulty)} · ${date})</span></span>
            <span class="score-value">${r.score} / ${r.total}</span>
          </div>
        `;
        })
        .join("");

      const detailId = `student-detail-${i}`;

      return `
        <div class="student-card">
          <div class="student-card-header" onclick="toggleStudentDetail('${detailId}')">
            <div>
              <div class="student-card-name">${student.name}</div>
              <div class="student-card-level">${LEVELS[levelIdx].emoji} ${t("levelWord")} ${levelIdx + 1} · ${levelName(levelIdx)}</div>
            </div>
            <button class="view-detail-btn" id="btn-${detailId}" type="button" onclick="event.stopPropagation(); toggleStudentDetail('${detailId}')">${t("teacherViewDetails")}</button>
          </div>

          <div class="student-strengths">
            <div class="student-strength">
              <div class="student-strength-label">${t("statCategoryFr")}</div>
              <div class="student-strength-bar"><div class="student-strength-fill fr" style="width:${frPct}%;"></div></div>
              <div class="student-strength-pct">${frPct}%</div>
            </div>
            <div class="student-strength">
              <div class="student-strength-label">${t("statCategoryEn")}</div>
              <div class="student-strength-bar"><div class="student-strength-fill en" style="width:${enPct}%;"></div></div>
              <div class="student-strength-pct">${enPct}%</div>
            </div>
            <div class="student-strength">
              <div class="student-strength-label">${t("statCategoryMaths")}</div>
              <div class="student-strength-bar"><div class="student-strength-fill maths" style="width:${mathsPct}%;"></div></div>
              <div class="student-strength-pct">${mathsPct}%</div>
            </div>
            <div class="student-strength">
              <div class="student-strength-label">${t("statCategoryHistgeo")}</div>
              <div class="student-strength-bar"><div class="student-strength-fill histgeo" style="width:${histgeoPct}%;"></div></div>
              <div class="student-strength-pct">${histgeoPct}%</div>
            </div>
          </div>

          <div class="student-detail" id="${detailId}">
            ${
              scores.length === 0
                ? `<p class="instructions" style="margin-bottom:0;">${t("teacherNoScoresYet")}</p>`
                : `
              <h4>${t("teacherPerGameTitle")}</h4>
              ${gameRows}
              <h4 style="margin-top:16px;">${t("teacherHistoryTitle")}</h4>
              <div class="history-scroll">${historyRows}</div>
            `
            }
          </div>
        </div>
      `;
    })
    .join("");
}

function toggleStudentDetail(id) {
  const el = document.getElementById(id);
  const btn = document.getElementById(`btn-${id}`);
  const isShowing = el.classList.toggle("show");
  btn.textContent = isShowing ? t("teacherHideDetails") : t("teacherViewDetails");
}

function renderClassSelect() {
  const container = document.getElementById("class-select");
  if (myClasses.length <= 1) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = myClasses
    .map(
      (c) => `
    <button class="class-select-btn ${c.class_id === currentClassId ? "active" : ""}" data-class-id="${c.class_id}" type="button">
      ${c.label || c.class_id} (${c.student_count} ${t("teacherStudentsCount")})
    </button>
  `
    )
    .join("");
  container.querySelectorAll(".class-select-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadClass(btn.dataset.classId));
  });
}

async function loadClass(classId) {
  currentClassId = classId;
  renderClassSelect();
  const { data, error } = await supabaseClient.rpc("get_class_details", { p_class_id: classId });
  if (error) {
    console.error("Erreur get_class_details :", error);
  }
  if (error || !data) {
    currentStudents = [];
  } else {
    currentStudents = groupByStudent(data);
  }
  renderStudents(currentStudents);
}

async function initTeacherPage() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;

  const loginPrompt = document.getElementById("login-prompt");
  const noClassCard = document.getElementById("no-class-card");
  const teacherContent = document.getElementById("teacher-content");

  if (!user) {
    loginPrompt.style.display = "block";
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_my_classes");

  if (error) {
    console.error("Erreur get_my_classes :", error);
  }

  if (error || !data || data.length === 0) {
    noClassCard.style.display = "block";
    return;
  }

  myClasses = data;
  teacherContent.style.display = "block";
  renderClassSelect();
  await loadClass(myClasses[0].class_id);
}

document.addEventListener("langchange", () => {
  renderClassSelect();
  if (currentStudents) renderStudents(currentStudents);
});

initTeacherPage();
