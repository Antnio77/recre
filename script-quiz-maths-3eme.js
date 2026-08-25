const levels = {
  fr: {
    facile: [
      { question: "Que dit le théorème de Pythagore ?", options: ["Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.", "Dans tout triangle, la somme des angles fait 180°.", "Deux droites parallèles coupées par une sécante forment des angles égaux."], correct: 0, explanation: "C'est la définition du théorème de Pythagore : dans un triangle rectangle, a² = b² + c² (a étant l'hypoténuse)." },
      { question: "Quelle est l'aire d'un disque de rayon r ?", options: ["π × r", "π × r²", "2 × π × r"], correct: 1, explanation: "L'aire d'un disque de rayon r est π × r² (à ne pas confondre avec le périmètre du cercle, qui est 2πr)." },
      { question: "Quel est le périmètre d'un cercle de rayon r ?", options: ["π × r²", "2 × π × r", "π × r"], correct: 1, explanation: "Le périmètre (circonférence) d'un cercle de rayon r est 2πr." },
      { question: "Qu'est-ce qu'un nombre premier ?", options: ["Un nombre divisible uniquement par 1 et par lui-même", "Un nombre impair", "Un nombre qui n'est pas entier"], correct: 0, explanation: "Un nombre premier a exactement deux diviseurs : 1 et lui-même (ex : 2, 3, 5, 7, 11...)." },
      { question: "Combien vaut √49 ?", options: ["7", "24,5", "14"], correct: 0, explanation: "√49 = 7 car 7 × 7 = 49." },
      { question: "Combien vaut (−3)² ?", options: ["−9", "9", "6"], correct: 1, explanation: "(−3)² = (−3) × (−3) = 9 : le carré d'un nombre négatif est toujours positif." },
      { question: "Quelle est la forme développée de (a + b)² ?", options: ["a² + b²", "a² + 2ab + b²", "a² − b²"], correct: 1, explanation: "(a + b)² = a² + 2ab + b², c'est une identité remarquable à connaître par cœur." },
      { question: "Dans une fonction affine y = ax + b, comment appelle-t-on le nombre a ?", options: ["Le coefficient directeur (la pente)", "L'ordonnée à l'origine", "Le discriminant"], correct: 0, explanation: "a est le coefficient directeur (la pente de la droite) ; b est l'ordonnée à l'origine." },
      { question: "Quelle formule donne l'aire d'un triangle ?", options: ["base × hauteur", "(base × hauteur) ÷ 2", "base + hauteur"], correct: 1, explanation: "L'aire d'un triangle est (base × hauteur) ÷ 2." },
      { question: "Quelle est la probabilité d'un événement certain ?", options: ["0", "0,5", "1"], correct: 2, explanation: "Un événement certain a une probabilité de 1 (100 %). Un événement impossible a une probabilité de 0." },
    ],
    moyen: [
      { question: "Un triangle rectangle a des côtés de l'angle droit mesurant 3 cm et 4 cm. Quelle est la longueur de l'hypoténuse ?", options: ["5 cm", "7 cm", "12 cm"], correct: 0, explanation: "D'après Pythagore : hyp² = 3² + 4² = 9 + 16 = 25, donc hyp = √25 = 5 cm." },
      { question: "Dans un triangle rectangle, comment calcule-t-on le cosinus d'un angle aigu ?", options: ["côté opposé ÷ hypoténuse", "côté adjacent ÷ hypoténuse", "côté opposé ÷ côté adjacent"], correct: 1, explanation: "cos(angle) = côté adjacent ÷ hypoténuse (formule SOH-CAH-TOA : CAH pour cosinus)." },
      { question: "Comment calcule-t-on le sinus d'un angle aigu dans un triangle rectangle ?", options: ["côté opposé ÷ hypoténuse", "côté adjacent ÷ hypoténuse", "hypoténuse ÷ côté opposé"], correct: 0, explanation: "sin(angle) = côté opposé ÷ hypoténuse (SOH)." },
      { question: "Que permet de calculer le théorème de Thalès ?", options: ["Des longueurs dans une configuration de triangles avec des droites parallèles", "Des angles dans un triangle quelconque", "L'aire d'un polygone"], correct: 0, explanation: "Le théorème de Thalès relie les longueurs de deux triangles formés par des droites parallèles, pour calculer une longueur manquante." },
      { question: "Quelle est la forme factorisée de a² − b² ?", options: ["(a − b)²", "(a + b)(a − b)", "(a + b)²"], correct: 1, explanation: "a² − b² = (a + b)(a − b), c'est l'identité remarquable de la différence de deux carrés." },
      { question: "Quelle est la solution de l'équation 2x + 6 = 0 ?", options: ["x = 3", "x = −3", "x = −6"], correct: 1, explanation: "2x + 6 = 0 → 2x = −6 → x = −3." },
      { question: "On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ?", options: ["1/6", "1/2", "1/3"], correct: 1, explanation: "Il y a 3 nombres pairs (2, 4, 6) sur 6 possibles : 3/6 = 1/2." },
      { question: "Quelles sont les coordonnées du vecteur AB si A(1 ; 2) et B(4 ; 6) ?", options: ["(3 ; 4)", "(5 ; 8)", "(4 ; 6)"], correct: 0, explanation: "Les coordonnées du vecteur AB sont (xB − xA ; yB − yA) = (4−1 ; 6−2) = (3 ; 4)." },
      { question: "Quelle est la forme développée de (a − b)(a + b) ?", options: ["a² − b²", "a² + b²", "a² − 2ab + b²"], correct: 0, explanation: "(a − b)(a + b) = a² − b² (identité remarquable)." },
      { question: "Une réduction de 20 % sur un prix de 50€ donne un nouveau prix de :", options: ["40€", "10€", "45€"], correct: 0, explanation: "20 % de 50€ = 10€, donc le nouveau prix est 50 − 10 = 40€." },
    ],
    difficile: [
      { question: "Un triangle a des côtés de 6 cm, 8 cm et 10 cm. Est-il rectangle ?", options: ["Oui, d'après la réciproque de Pythagore", "Non", "On ne peut pas savoir sans les angles"], correct: 0, explanation: "6² + 8² = 36 + 64 = 100 = 10², donc d'après la réciproque du théorème de Pythagore, le triangle est rectangle." },
      { question: "À quoi sert la réciproque du théorème de Thalès ?", options: ["À prouver que deux droites sont parallèles", "À calculer une aire", "À calculer une probabilité"], correct: 0, explanation: "La réciproque de Thalès permet de démontrer que deux droites sont parallèles, à partir de rapports de longueurs égaux." },
      { question: "Que dit le théorème des milieux (droite des milieux) ?", options: ["La droite joignant les milieux de deux côtés d'un triangle est parallèle au troisième côté et mesure sa moitié", "Les médianes d'un triangle se coupent en leur milieu", "Le milieu d'un segment est équidistant des deux extrémités"], correct: 0, explanation: "Dans un triangle, la droite joignant les milieux de deux côtés est parallèle au troisième côté et sa longueur vaut la moitié de celle-ci." },
      { question: "Comment simplifier √75 ?", options: ["5√3", "25√3", "3√5"], correct: 0, explanation: "75 = 25 × 3, donc √75 = √25 × √3 = 5√3." },
      { question: "Que vaut a³ × a⁵ ?", options: ["a⁸", "a¹⁵", "2a⁸"], correct: 0, explanation: "Pour multiplier deux puissances de même base, on additionne les exposants : a³ × a⁵ = a^(3+5) = a⁸." },
      { question: "Une droite passe par les points A(0 ; 1) et B(2 ; 5). Quel est son coefficient directeur ?", options: ["2", "4", "1"], correct: 0, explanation: "Coefficient directeur = (yB − yA) / (xB − xA) = (5 − 1) / (2 − 0) = 4/2 = 2." },
      { question: "Quelle est la formule du volume d'une pyramide ?", options: ["(aire de la base × hauteur) ÷ 3", "aire de la base × hauteur", "(aire de la base × hauteur) ÷ 2"], correct: 0, explanation: "Le volume d'une pyramide (ou d'un cône) est (aire de la base × hauteur) ÷ 3." },
      { question: "Deux événements sont dits incompatibles quand :", options: ["Ils ne peuvent pas se réaliser en même temps", "Ils ont la même probabilité", "Leur somme fait 1"], correct: 0, explanation: "Deux événements incompatibles ne peuvent jamais se produire simultanément (leur intersection est vide)." },
      { question: "Que représente l'étendue d'une série statistique ?", options: ["La différence entre la valeur maximale et la valeur minimale", "La moyenne des valeurs", "La valeur la plus fréquente"], correct: 0, explanation: "L'étendue est l'écart entre la plus grande et la plus petite valeur de la série (max − min)." },
    ],
  },
  en: {
    facile: [
      { question: "What does the Pythagorean theorem state?", options: ["In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.", "In any triangle, the angles add up to 180°.", "Two parallel lines cut by a transversal form equal angles."], correct: 0, explanation: "That's the Pythagorean theorem: in a right triangle, a² = b² + c² (a being the hypotenuse)." },
      { question: "What is the area of a circle with radius r?", options: ["π × r", "π × r²", "2 × π × r"], correct: 1, explanation: "The area of a circle with radius r is π × r² (don't confuse it with the circumference, which is 2πr)." },
      { question: "What is the circumference of a circle with radius r?", options: ["π × r²", "2 × π × r", "π × r"], correct: 1, explanation: "The circumference of a circle with radius r is 2πr." },
      { question: "What is a prime number?", options: ["A number divisible only by 1 and itself", "An odd number", "A number that isn't an integer"], correct: 0, explanation: "A prime number has exactly two divisors: 1 and itself (e.g. 2, 3, 5, 7, 11...)." },
      { question: "What is √49?", options: ["7", "24.5", "14"], correct: 0, explanation: "√49 = 7 because 7 × 7 = 49." },
      { question: "What is (−3)²?", options: ["−9", "9", "6"], correct: 1, explanation: "(−3)² = (−3) × (−3) = 9: the square of a negative number is always positive." },
      { question: "What is the expanded form of (a + b)²?", options: ["a² + b²", "a² + 2ab + b²", "a² − b²"], correct: 1, explanation: "(a + b)² = a² + 2ab + b², a key identity to memorize." },
      { question: "In a linear function y = ax + b, what is the number a called?", options: ["The slope (or gradient)", "The y-intercept", "The discriminant"], correct: 0, explanation: "a is the slope of the line; b is the y-intercept." },
      { question: "What formula gives the area of a triangle?", options: ["base × height", "(base × height) ÷ 2", "base + height"], correct: 1, explanation: "The area of a triangle is (base × height) ÷ 2." },
      { question: "What is the probability of a certain event?", options: ["0", "0.5", "1"], correct: 2, explanation: "A certain event has a probability of 1 (100%). An impossible event has a probability of 0." },
    ],
    moyen: [
      { question: "A right triangle has legs measuring 3 cm and 4 cm. What is the length of the hypotenuse?", options: ["5 cm", "7 cm", "12 cm"], correct: 0, explanation: "By the Pythagorean theorem: hyp² = 3² + 4² = 9 + 16 = 25, so hyp = √25 = 5 cm." },
      { question: "In a right triangle, how do you compute the cosine of an acute angle?", options: ["opposite side ÷ hypotenuse", "adjacent side ÷ hypotenuse", "opposite side ÷ adjacent side"], correct: 1, explanation: "cos(angle) = adjacent side ÷ hypotenuse (SOH-CAH-TOA: CAH for cosine)." },
      { question: "How do you compute the sine of an acute angle in a right triangle?", options: ["opposite side ÷ hypotenuse", "adjacent side ÷ hypotenuse", "hypotenuse ÷ opposite side"], correct: 0, explanation: "sin(angle) = opposite side ÷ hypotenuse (SOH)." },
      { question: "What does Thales' theorem help you calculate?", options: ["Lengths in a configuration of triangles with parallel lines", "Angles in any triangle", "The area of a polygon"], correct: 0, explanation: "Thales' theorem relates the lengths of two triangles formed by parallel lines, to find a missing length." },
      { question: "What is the factored form of a² − b²?", options: ["(a − b)²", "(a + b)(a − b)", "(a + b)²"], correct: 1, explanation: "a² − b² = (a + b)(a − b), the difference-of-squares identity." },
      { question: "What is the solution of the equation 2x + 6 = 0?", options: ["x = 3", "x = −3", "x = −6"], correct: 1, explanation: "2x + 6 = 0 → 2x = −6 → x = −3." },
      { question: "You roll a 6-sided die. What is the probability of getting an even number?", options: ["1/6", "1/2", "1/3"], correct: 1, explanation: "There are 3 even numbers (2, 4, 6) out of 6: 3/6 = 1/2." },
      { question: "What are the coordinates of vector AB if A(1, 2) and B(4, 6)?", options: ["(3, 4)", "(5, 8)", "(4, 6)"], correct: 0, explanation: "The coordinates of vector AB are (xB − xA, yB − yA) = (4−1, 6−2) = (3, 4)." },
      { question: "What is the expanded form of (a − b)(a + b)?", options: ["a² − b²", "a² + b²", "a² − 2ab + b²"], correct: 0, explanation: "(a − b)(a + b) = a² − b² (a key identity)." },
      { question: "A 20% discount on a $50 price gives a new price of:", options: ["$40", "$10", "$45"], correct: 0, explanation: "20% of $50 = $10, so the new price is 50 − 10 = $40." },
    ],
    difficile: [
      { question: "A triangle has sides of 6 cm, 8 cm and 10 cm. Is it a right triangle?", options: ["Yes, by the converse of the Pythagorean theorem", "No", "You can't tell without the angles"], correct: 0, explanation: "6² + 8² = 36 + 64 = 100 = 10², so by the converse of the Pythagorean theorem, the triangle is right-angled." },
      { question: "What is the converse of Thales' theorem used for?", options: ["To prove that two lines are parallel", "To calculate an area", "To calculate a probability"], correct: 0, explanation: "The converse of Thales' theorem lets you prove two lines are parallel, from equal length ratios." },
      { question: "What does the midsegment theorem state?", options: ["The segment joining the midpoints of two sides of a triangle is parallel to the third side and half its length", "The medians of a triangle meet at their midpoint", "The midpoint of a segment is equidistant from both ends"], correct: 0, explanation: "In a triangle, the segment joining the midpoints of two sides is parallel to the third side and half as long." },
      { question: "How do you simplify √75?", options: ["5√3", "25√3", "3√5"], correct: 0, explanation: "75 = 25 × 3, so √75 = √25 × √3 = 5√3." },
      { question: "What is a³ × a⁵?", options: ["a⁸", "a¹⁵", "2a⁸"], correct: 0, explanation: "To multiply two powers with the same base, add the exponents: a³ × a⁵ = a^(3+5) = a⁸." },
      { question: "A line passes through points A(0, 1) and B(2, 5). What is its slope?", options: ["2", "4", "1"], correct: 0, explanation: "Slope = (yB − yA) / (xB − xA) = (5 − 1) / (2 − 0) = 4/2 = 2." },
      { question: "What is the formula for the volume of a pyramid?", options: ["(base area × height) ÷ 3", "base area × height", "(base area × height) ÷ 2"], correct: 0, explanation: "The volume of a pyramid (or cone) is (base area × height) ÷ 3." },
      { question: "Two events are called mutually exclusive when:", options: ["They cannot happen at the same time", "They have the same probability", "Their sum equals 1"], correct: 0, explanation: "Mutually exclusive events can never occur simultaneously (their intersection is empty)." },
      { question: "What does the range of a statistical series represent?", options: ["The difference between the maximum and minimum values", "The average of the values", "The most frequent value"], correct: 0, explanation: "The range is the gap between the largest and smallest value in the series (max − min)." },
    ],
  },
};

const SESSION_LENGTH = 8;

let rounds = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let answered = false;

const difficultyScreen = document.getElementById("difficulty-screen");
const questionTextEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const loginPrompt = document.getElementById("login-prompt");
const premiumLocked = document.getElementById("premium-locked");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chooseDifficulty(level) {
  difficulty = level;
  if (window.playSound) playSound("click");
  rounds = levels[currentLang][level];
  difficultyScreen.style.display = "none";
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  startGame();
}

function backToDifficulty() {
  gameCard.style.display = "none";
  resultScreen.style.display = "none";
  difficultyScreen.style.display = "block";
}

function startGame() {
  order = shuffle(rounds.map((_, i) => i)).slice(0, Math.min(SESSION_LENGTH, rounds.length));
  current = 0;
  score = 0;
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  renderRound();
}

function renderRound() {
  answered = false;
  feedbackEl.classList.remove("show");
  feedbackEl.innerHTML = "";
  nextBtn.style.display = "none";

  const data = rounds[order[current]];
  questionTextEl.textContent = data.question;

  const optionsList = data.options.map((text, i) => ({ text, isCorrect: i === data.correct }));
  const displayOrder = shuffle(optionsList);

  choicesEl.innerHTML = "";
  displayOrder.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => selectChoice(opt.isCorrect, btn, data.explanation));
    choicesEl.appendChild(btn);
  });

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
}

function selectChoice(isCorrect, clickedBtn, explanation) {
  if (answered) return;
  answered = true;
  if (window.playSound) playSound(isCorrect ? "correct" : "wrong");

  const allBtns = choicesEl.querySelectorAll(".choice-btn");
  allBtns.forEach((btn) => {
    btn.disabled = true;
    if (btn === clickedBtn) {
      btn.classList.add(isCorrect ? "correct" : "wrong-pick");
    }
  });

  const data = rounds[order[current]];
  if (isCorrect) {
    score++;
    if (window.clearMistake) clearMistake("quiz-maths-3eme", data.question);
  } else {
    if (window.recordMistake) recordMistake("quiz-maths-3eme", difficulty, data.question, data);
  }

  feedbackEl.innerHTML = `${isCorrect ? t("wellSpotted") : t("notQuite")} ${explanation}`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  nextBtn.style.display = "inline-block";
}

function nextRound() {
  current++;
  if (current >= order.length) {
    showResult();
  } else {
    renderRound();
  }
}

function showResult() {
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  if (window.playSound) playSound("success");
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("quiz-maths-3eme", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

nextBtn.addEventListener("click", nextRound);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);

document.addEventListener("langchange", () => {
  if (difficultyScreen.style.display === "block") backToDifficulty();
});

async function initAccess() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData.session ? sessionData.session.user : null;
  if (!user) {
    loginPrompt.style.display = "block";
    return;
  }
  const premium = await checkPremiumStatus();
  if (!premium) {
    premiumLocked.style.display = "block";
    return;
  }
  difficultyScreen.style.display = "block";
}

initAccess();
