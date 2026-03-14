// script3.js
// Minimal activation harness for all layers

document.addEventListener("DOMContentLoaded", () => {
  const layers = [
    ".exterior-beyond-exterior",
    ".harmonic-regenesis-engine",
    ".pre-cause-layer",
    ".exterior-within-exterior",
    ".harmonic-meta-cycle-engine",
    ".pre-existence-layer",
    ".inversion-beyond-inversion",
    ".harmonic-apex-engine",
    ".non-state-layer",
    ".totality-beyond-totality",
    ".harmonic-closure-engine",
    ".non-non-layer",
    ".absolute-finality"
  ];

  layers.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      // fade in each layer with a slight stagger
      setTimeout(() => {
        el.style.opacity = "1";
      }, Math.random() * 2000);
    }
  });
});
