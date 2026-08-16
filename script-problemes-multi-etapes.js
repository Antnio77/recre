const levels = {
  fr: {
    facile: [
      { text: "Léa a 12 bonbons. Elle en mange 3, puis sa mère lui en donne 5. Combien en a-t-elle maintenant ?", answer: 14 },
      { text: "Un panier a 20 fruits. On enlève 8 pommes et on ajoute 4 poires. Combien de fruits reste-t-il ?", answer: 16 },
      { text: "Tom a 15€. Il gagne 10€ puis dépense 8€. Combien lui reste-t-il (en €) ?", answer: 17 },
      { text: "Une classe a 24 élèves. 6 partent en sortie, puis 3 nouveaux arrivent. Combien d'élèves dans la classe ?", answer: 21 },
      { text: "Un fermier a 30 poules. Il en vend 12 puis en achète 5. Combien a-t-il de poules ?", answer: 23 },
      { text: "Un sac a 18 billes. On en retire 5 puis on en ajoute 9. Combien de billes au total ?", answer: 22 },
      { text: "Léo lit 8 pages, puis 6 pages de plus, puis encore 4 pages. Combien de pages a-t-il lues ?", answer: 18 },
      { text: "Un magasin a 40 jouets. Il en vend 15 le matin et 10 l'après-midi. Combien de jouets reste-t-il ?", answer: 15 },
    ],
    moyen: [
      { text: "Léa achète 4 cahiers à 2€ chacun et 1 stylo à 3€. Elle paie avec un billet de 20€. Combien lui rend-on (en €) ?", answer: 9 },
      { text: "Un bus part avec 30 passagers. À un arrêt, 12 descendent et 7 montent ; à un autre arrêt, 5 descendent. Combien reste-t-il de passagers ?", answer: 20 },
      { text: "Un fermier récolte 120 kg de pommes. Il en vend les deux tiers, puis donne 10 kg à un voisin. Combien lui reste-t-il (en kg) ?", answer: 30 },
      { text: "Marc a 60€. Il dépense un quart pour un livre, puis 15€ pour un jeu. Combien lui reste-t-il (en €) ?", answer: 30 },
      { text: "Une salle a 8 rangées de 6 chaises. On retire 2 rangées entières puis on ajoute 5 chaises. Combien de chaises au total ?", answer: 41 },
      { text: "Un magasin vend 3 tee-shirts à 12€ et 2 pantalons à 25€, avec une réduction de 10€ sur le total. Combien le client paie-t-il (en €) ?", answer: 76 },
      { text: "Une piscine de 200 m³ est remplie aux trois quarts, puis on retire 20 m³. Combien de m³ contient-elle ?", answer: 130 },
      { text: "Julie a 90€. Elle dépense un tiers dans une boutique, puis reçoit 20€ de sa tante. Combien a-t-elle (en €) ?", answer: 80 },
    ],
    difficile: [
      { text: "Un article coûte 120€. Il est soldé à -20%, puis une taxe de 5% est ajoutée au nouveau prix. Quel est le prix final (en €) ?", answer: 100.8 },
      { text: "Une voiture roule à 80 km/h pendant 2h, puis à 100 km/h pendant 1h30. Quelle distance totale a-t-elle parcourue (en km) ?", answer: 310 },
      { text: "Un capital de 1000€ rapporte 3% d'intérêt la première année, puis 4% la deuxième année (sur le nouveau montant). Combien vaut-il après 2 ans (en €) ?", answer: 1071.2 },
      { text: "Un réservoir de 500 litres est rempli à moitié, puis on ajoute 50 litres, puis on retire 20% du total. Combien de litres reste-t-il ?", answer: 240 },
      { text: "Un magasin augmente un prix de 60€ de 25%, puis offre une réduction de 15% sur le nouveau prix. Quel est le prix final (en €) ?", answer: 63.75 },
      { text: "Une usine produit 800 objets par jour. Elle augmente sa production de 10%, puis en perd 5% à cause de défauts. Combien d'objets valides produit-elle par jour ?", answer: 836 },
      { text: "Un trajet de 450 km est parcouru : 200 km à 100 km/h, puis le reste à 125 km/h. Combien de temps dure le trajet au total (en heures) ?", answer: 4 },
      { text: "Sophie place 2000€ à 5% d'intérêt simple par an. Combien d'intérêts aura-t-elle accumulés après 3 ans (en €) ?", answer: 300 },
    ],
  },
  en: {
    facile: [
      { text: "Lea has 12 candies. She eats 3, then her mom gives her 5 more. How many does she have now?", answer: 14 },
      { text: "A basket has 20 fruits. 8 apples are removed and 4 pears are added. How many fruits are left?", answer: 16 },
      { text: "Tom has $15. He earns $10 then spends $8. How much does he have left?", answer: 17 },
      { text: "A class has 24 students. 6 leave for a field trip, then 3 new students arrive. How many students are in the class?", answer: 21 },
      { text: "A farmer has 30 hens. He sells 12 then buys 5. How many hens does he have?", answer: 23 },
      { text: "A bag has 18 marbles. 5 are removed then 9 are added. How many marbles in total?", answer: 22 },
      { text: "Leo reads 8 pages, then 6 more, then 4 more. How many pages has he read?", answer: 18 },
      { text: "A shop has 40 toys. It sells 15 in the morning and 10 in the afternoon. How many toys are left?", answer: 15 },
    ],
    moyen: [
      { text: "Lea buys 4 notebooks at $2 each and 1 pen for $3. She pays with a $20 bill. How much change does she get?", answer: 9 },
      { text: "A bus leaves with 30 passengers. At one stop, 12 get off and 7 get on; at another, 5 get off. How many passengers are left?", answer: 20 },
      { text: "A farmer harvests 120 kg of apples. He sells two-thirds, then gives 10 kg to a neighbor. How many kg does he have left?", answer: 30 },
      { text: "Mark has $60. He spends a quarter on a book, then $15 on a game. How much does he have left?", answer: 30 },
      { text: "A room has 8 rows of 6 chairs. 2 full rows are removed then 5 chairs are added. How many chairs in total?", answer: 41 },
      { text: "A shop sells 3 t-shirts at $12 and 2 pants at $25, with a $10 discount on the total. How much does the customer pay?", answer: 76 },
      { text: "A 200 m³ pool is three-quarters full, then 20 m³ is removed. How many m³ does it contain?", answer: 130 },
      { text: "Julie has $90. She spends a third in a shop, then receives $20 from her aunt. How much does she have?", answer: 80 },
    ],
    difficile: [
      { text: "An item costs $120. It's on sale at -20%, then a 5% tax is added to the new price. What's the final price?", answer: 100.8 },
      { text: "A car drives at 80 km/h for 2h, then at 100 km/h for 1.5h. What total distance did it travel (in km)?", answer: 310 },
      { text: "$1000 earns 3% interest the first year, then 4% the second year (on the new amount). How much is it worth after 2 years?", answer: 1071.2 },
      { text: "A 500-liter tank is half full, then 50 liters are added, then 20% of the total is removed. How many liters are left?", answer: 240 },
      { text: "A shop increases a $60 price by 25%, then offers a 15% discount on the new price. What's the final price?", answer: 63.75 },
      { text: "A factory produces 800 items per day. It increases production by 10%, then loses 5% to defects. How many valid items does it produce per day?", answer: 836 },
      { text: "A 450 km trip is made: 200 km at 100 km/h, then the rest at 125 km/h. How long does the whole trip take (in hours)?", answer: 4 },
      { text: "Sophie invests $2000 at 5% simple interest per year. How much interest will she have after 3 years?", answer: 300 },
    ],
  },
};

const SESSION_LENGTH = 6;

let sentences = [];
let difficulty = "moyen";
let order = [];
let current = 0;
let score = 0;
let validated = false;

const difficultyScreen = document.getElementById("difficulty-screen");
const problemTextEl = document.getElementById("problem-text");
const answerInput = document.getElementById("answer-input");
const validateBtn = document.getElementById("validate-btn");
const nextBtn = document.getElementById("next-btn");
const feedbackEl = document.getElementById("feedback");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const gameCard = document.getElementById("game-card");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const replayBtn = document.getElementById("replay-btn");
const changeLevelBtn = document.getElementById("change-level-btn");
const keypadContainer = document.getElementById("keypad-container");
const loginPrompt = document.getElementById("login-prompt");
const premiumLocked = document.getElementById("premium-locked");

createKeypad(keypadContainer, answerInput);

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
  sentences = levels[currentLang][level];
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
  order = shuffle(sentences.map((_, i) => i)).slice(0, Math.min(SESSION_LENGTH, sentences.length));
  current = 0;
  score = 0;
  resultScreen.style.display = "none";
  gameCard.style.display = "block";
  renderProblem();
}

function renderProblem() {
  validated = false;
  answerInput.value = "";
  answerInput.disabled = false;
  feedbackEl.classList.remove("show");
  feedbackEl.innerHTML = "";
  validateBtn.style.display = "inline-block";
  nextBtn.style.display = "none";

  const data = sentences[order[current]];
  problemTextEl.textContent = data.text;

  progressFill.style.width = `${(current / order.length) * 100}%`;
  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  answerInput.focus();
}

function validate() {
  if (validated) return;
  validated = true;
  answerInput.disabled = true;

  const data = sentences[order[current]];
  const typed = answerInput.value.trim().replace(",", ".");
  const typedNum = parseFloat(typed);
  const isCorrect = !isNaN(typedNum) && Math.abs(typedNum - data.answer) < 0.01;

  if (isCorrect) score++;

  feedbackEl.innerHTML = isCorrect
    ? `${t("wellSpotted")} ${data.answer} ✓`
    : `${t("notQuite")} ${t("exactSentenceWas")} <strong>${data.answer}</strong>`;
  feedbackEl.classList.add("show");

  progressLabel.textContent = `${t("levelWord")} ${difficultyLabel(difficulty)} · ${t("sentenceWord")} ${current + 1} / ${order.length} · ${t("scoreWord")} : ${score}`;
  validateBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function nextProblem() {
  current++;
  if (current >= order.length) {
    showResult();
  } else {
    renderProblem();
  }
}

function showResult() {
  gameCard.style.display = "none";
  resultScreen.style.display = "block";
  progressFill.style.width = "100%";
  finalScore.textContent = `${score} / ${order.length}`;
  if (window.saveScore) window.saveScore("problemes-multi-etapes", difficulty, score, order.length);
}

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => chooseDifficulty(btn.dataset.level));
});

validateBtn.addEventListener("click", validate);
nextBtn.addEventListener("click", nextProblem);
replayBtn.addEventListener("click", startGame);
changeLevelBtn.addEventListener("click", backToDifficulty);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !validated) validate();
});

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
