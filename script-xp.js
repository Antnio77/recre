// Points d'XP maximum gagnables pour une manche parfaite, selon la
// difficulté choisie. Plus le niveau est dur, plus ça rapporte.
const XP_PER_DIFFICULTY_BASE = { facile: 10, moyen: 20, difficile: 35 };

// Chaque niveau : seuil d'XP cumulé nécessaire pour l'atteindre, un emoji,
// et un grade un peu drôle en FR/EN.
const LEVELS = [
  { xp: 0, emoji: "🐣", fr: "Poussin de la Récré", en: "Recess Chick" },
  { xp: 80, emoji: "✏️", fr: "Apprenti Griffonneur", en: "Apprentice Scribbler" },
  { xp: 200, emoji: "📚", fr: "Dévoreur de Cahiers", en: "Notebook Devourer" },
  { xp: 380, emoji: "🧮", fr: "Cerveau en Éveil", en: "Awakening Brain" },
  { xp: 620, emoji: "🎯", fr: "Chasseur de Fautes", en: "Mistake Hunter" },
  { xp: 920, emoji: "🥈", fr: "Champion de Cour", en: "Playground Champion" },
  { xp: 1300, emoji: "🥇", fr: "Roi(ne) de la Récré", en: "Recess Royalty" },
  { xp: 1750, emoji: "🧠", fr: "Génie en Culotte Courte", en: "Pint-Sized Genius" },
  { xp: 2300, emoji: "🏆", fr: "Légende du Préau", en: "Playground Legend" },
  { xp: 3000, emoji: "👑", fr: "Maître Suprême de la Récré", en: "Supreme Recess Master" },
];

function xpForRow(row) {
  const base = XP_PER_DIFFICULTY_BASE[row.difficulty] ?? 15;
  return Math.round((row.score / row.total) * base);
}

function totalXp(scores) {
  return scores.reduce((sum, row) => sum + xpForRow(row), 0);
}

function levelIndexForXp(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) idx = i;
  }
  return idx;
}

function levelName(idx) {
  const lvl = LEVELS[idx];
  return currentLang === "en" ? lvl.en : lvl.fr;
}
