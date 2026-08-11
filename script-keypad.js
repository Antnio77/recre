// Crée un pavé numérique tactile (chiffres, virgule, signe moins, effacer)
// et le branche sur un champ de saisie. Fonctionne en plus du clavier
// physique, ne le remplace pas.
function createKeypad(container, inputEl) {
  container.innerHTML = `
    <div class="keypad">
      <button type="button" class="keypad-btn" data-key="7">7</button>
      <button type="button" class="keypad-btn" data-key="8">8</button>
      <button type="button" class="keypad-btn" data-key="9">9</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="back">⌫</button>

      <button type="button" class="keypad-btn" data-key="4">4</button>
      <button type="button" class="keypad-btn" data-key="5">5</button>
      <button type="button" class="keypad-btn" data-key="6">6</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="minus">−</button>

      <button type="button" class="keypad-btn" data-key="1">1</button>
      <button type="button" class="keypad-btn" data-key="2">2</button>
      <button type="button" class="keypad-btn" data-key="3">3</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key=",">,</button>

      <button type="button" class="keypad-btn keypad-btn--wide" data-key="0">0</button>
      <button type="button" class="keypad-btn keypad-btn--action" data-key="clear">C</button>
    </div>
  `;

  container.querySelectorAll(".keypad-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (key === "back") {
        inputEl.value = inputEl.value.slice(0, -1);
      } else if (key === "clear") {
        inputEl.value = "";
      } else if (key === "minus") {
        inputEl.value = inputEl.value.startsWith("-") ? inputEl.value.slice(1) : "-" + inputEl.value;
      } else {
        inputEl.value += key;
      }
      inputEl.focus();
    });
  });
}
