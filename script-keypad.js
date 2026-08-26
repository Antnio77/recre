// Deux pavés tactiles partagés par les jeux de maths :
//
// - createKeypad : une vraie petite calculatrice (opérateurs, √, xʸ, %,
//   évaluation sur "="). Réservée aux exercices où c'est la réflexion/la
//   démarche qui compte, pas le calcul brut (problèmes multi-étapes,
//   problèmes du quotidien) — là, une calculatrice ne triche pas le but
//   de l'exercice.
// - createNumericKeypad : juste les chiffres, la virgule et l'effacement,
//   sans aucun calcul. Pour les jeux où c'est justement la rapidité de
//   calcul mental qui est testée (calcul mental éclair, géométrie éclair,
//   duel) — y donner une calculatrice reviendrait à contourner l'exercice.

function createKeypad(container, inputEl) {
  container.innerHTML = `
    <div class="keypad">
      <button type="button" class="keypad-btn keypad-btn--action" data-key="sqrt">√</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="pow">x^y</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="percent">%</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="back">⌫</button>

      <button type="button" class="keypad-btn" data-key="7">7</button>
      <button type="button" class="keypad-btn" data-key="8">8</button>
      <button type="button" class="keypad-btn" data-key="9">9</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="÷">÷</button>

      <button type="button" class="keypad-btn" data-key="4">4</button>
      <button type="button" class="keypad-btn" data-key="5">5</button>
      <button type="button" class="keypad-btn" data-key="6">6</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="×">×</button>

      <button type="button" class="keypad-btn" data-key="1">1</button>
      <button type="button" class="keypad-btn" data-key="2">2</button>
      <button type="button" class="keypad-btn" data-key="3">3</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="-">−</button>

      <button type="button" class="keypad-btn keypad-btn--action" data-key="clear">C</button>
      <button type="button" class="keypad-btn" data-key="0">0</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key=",">,</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="+">+</button>

      <button type="button" class="keypad-btn keypad-btn--equals" data-key="equals" style="grid-column: span 4;">=</button>
    </div>
  `;

  let justEvaluated = false;
  const isEnglish = document.documentElement.lang === "en";
  const errorText = isEnglish ? "Error" : "Erreur";

  function evaluateExpression() {
    const raw = inputEl.value.trim();
    if (!raw) return;

    // N'autorise que les caractères que nos boutons peuvent produire.
    // Si l'utilisateur a tapé autre chose au clavier physique (des
    // lettres par exemple), on refuse d'évaluer plutôt que d'exécuter
    // n'importe quoi.
    if (!/^[0-9+\-×÷^√(),.%\s]*$/.test(raw)) {
      inputEl.value = errorText;
      justEvaluated = true;
      return;
    }

    let expr = raw
      .replace(/,/g, ".")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/√/g, "Math.sqrt");

    // Le % est contextuel, comme sur une vraie calculatrice :
    // "150-20%" veut dire "réduire 150 de 20%" (= 150 - 150×20/100 = 120),
    // pas "150 moins 0,2". On traite d'abord les cas +/- (qui ont ce sens
    // particulier), puis les % restants (après ×, ÷, ou isolés) comme une
    // simple division par 100.
    expr = expr.replace(/(\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)%/g, "$1$2($1*$3/100)");
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    // Équilibre automatiquement les parenthèses non refermées
    // (pratique quand on tape √( sans penser à la fermer).
    const openCount = (expr.match(/\(/g) || []).length;
    const closeCount = (expr.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      expr += ")".repeat(openCount - closeCount);
    }

    // Sécurité : après les remplacements ci-dessus, seuls chiffres,
    // opérateurs, points, parenthèses, espaces et "Math.sqrt" peuvent
    // être présents. Si autre chose s'est glissé, on refuse d'évaluer.
    if (!/^[0-9+\-*/.()\s]*$|^[0-9+\-*/.()\sMathsqrt]*$/.test(expr)) {
      inputEl.value = errorText;
      justEvaluated = true;
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + expr + ")")();
      if (typeof result !== "number" || !isFinite(result)) {
        inputEl.value = errorText;
      } else {
        const rounded = Math.round(result * 1e6) / 1e6;
        inputEl.value = String(rounded);
      }
    } catch (e) {
      inputEl.value = errorText;
    }
    justEvaluated = true;
  }

  container.querySelectorAll(".keypad-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;

      if (key === "equals") {
        evaluateExpression();
        inputEl.focus();
        return;
      }

      if (key === "back") {
        inputEl.value = inputEl.value.slice(0, -1);
        justEvaluated = false;
        inputEl.focus();
        return;
      }

      if (key === "clear") {
        inputEl.value = "";
        justEvaluated = false;
        inputEl.focus();
        return;
      }

      const isOperator = ["+", "-", "×", "÷", "pow", "percent"].includes(key);

      // Après un "=", un chiffre repart de zéro ; un opérateur enchaîne
      // sur le résultat obtenu (comme sur une vraie calculatrice).
      if (justEvaluated) {
        if (!isOperator && key !== "sqrt") {
          inputEl.value = "";
        }
        justEvaluated = false;
      }

      if (key === "sqrt") {
        inputEl.value += "√(";
      } else if (key === "pow") {
        inputEl.value += "^";
      } else if (key === "percent") {
        inputEl.value += "%";
      } else {
        inputEl.value += key;
      }
      inputEl.focus();
    });
  });
}

function createNumericKeypad(container, inputEl) {
  container.innerHTML = `
    <div class="keypad">
      <button type="button" class="keypad-btn" data-key="7">7</button>
      <button type="button" class="keypad-btn" data-key="8">8</button>
      <button type="button" class="keypad-btn" data-key="9">9</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="back">⌫</button>

      <button type="button" class="keypad-btn" data-key="4">4</button>
      <button type="button" class="keypad-btn" data-key="5">5</button>
      <button type="button" class="keypad-btn" data-key="6">6</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="clear">C</button>

      <button type="button" class="keypad-btn" data-key="1">1</button>
      <button type="button" class="keypad-btn" data-key="2">2</button>
      <button type="button" class="keypad-btn" data-key="3">3</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key=",">,</button>

      <button type="button" class="keypad-btn" data-key="0" style="grid-column: span 4;">0</button>
    </div>
  `;

  container.querySelectorAll(".keypad-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (key === "back") {
        inputEl.value = inputEl.value.slice(0, -1);
      } else if (key === "clear") {
        inputEl.value = "";
      } else {
        inputEl.value += key;
      }
      inputEl.focus();
    });
  });
}
