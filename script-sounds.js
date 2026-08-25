// Petits effets sonores synthétisés via l'API Web Audio (pas de fichier audio
// à charger, pas de souci de licence). Activés par défaut, coupables via
// localStorage ("recre-sound" = "off") si on ajoute un jour un bouton pour ça.
let audioCtx = null;
let soundEnabled = localStorage.getItem("recre-sound") !== "off";

function getAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(ctx, freq, startTime, duration, gainValue, type) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.03);
}

// name: "click" | "correct" | "wrong" | "success"
function playSound(name) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (name === "click") {
    playTone(ctx, 600, now, 0.06, 0.07, "sine");
  } else if (name === "correct") {
    playTone(ctx, 523.25, now, 0.12, 0.12, "triangle"); // C5
    playTone(ctx, 783.99, now + 0.08, 0.18, 0.12, "triangle"); // G5
  } else if (name === "wrong") {
    playTone(ctx, 220, now, 0.18, 0.09, "sine");
    playTone(ctx, 196, now + 0.09, 0.22, 0.08, "sine");
  } else if (name === "success") {
    playTone(ctx, 523.25, now, 0.12, 0.1, "triangle"); // C5
    playTone(ctx, 659.25, now + 0.1, 0.12, 0.1, "triangle"); // E5
    playTone(ctx, 783.99, now + 0.2, 0.12, 0.1, "triangle"); // G5
    playTone(ctx, 1046.5, now + 0.3, 0.28, 0.12, "triangle"); // C6
  }
}

window.playSound = playSound;
